require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(cors());
app.use(express.json({ limit: '10kb' })); // small body limit - this is text-only, no need for more

const PORT = process.env.PORT || 3000;
const REPORT_THRESHOLD = parseInt(process.env.REPORT_THRESHOLD || '5', 10);
const RATE_LIMIT_MS = parseInt(process.env.RATE_LIMIT_MS || '15000', 10);
const POST_EXPIRY_HOURS = parseInt(process.env.POST_EXPIRY_HOURS || '48', 10);
const MAX_POST_LENGTH = parseInt(process.env.MAX_POST_LENGTH || '500', 10);
const ADMIN_KEY = process.env.ADMIN_KEY;

const LINK_PATTERN = /(https?:\/\/|www\.)\S+/i;

// ---- rate limiting ----
// Kept ONLY in memory, keyed by IP, never written to the database and never
// exposed through any API response. This is purely an anti-spam throttle,
// not a tracking mechanism - it's wiped on every server restart.
const lastPostByIp = new Map();

function getIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
}

// ---- routes ----

// Get the shared public feed. Anyone can call this, no auth.
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, text, created_at
       FROM posts
       WHERE hidden = false
         AND created_at > now() - interval '${POST_EXPIRY_HOURS} hours'
       ORDER BY created_at DESC
       LIMIT 100`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not load feed' });
  }
});

// Create a new post. Text only, nothing else accepted.
app.post('/posts', async (req, res) => {
  const text = (req.body.text || '').toString().trim();

  if (!text) return res.status(400).json({ error: 'empty post' });
  if (text.length > MAX_POST_LENGTH) return res.status(400).json({ error: 'too long' });
  if (LINK_PATTERN.test(text)) return res.status(400).json({ error: 'links are not allowed' });

  const ip = getIp(req);
  const now = Date.now();
  const last = lastPostByIp.get(ip) || 0;
  if (now - last < RATE_LIMIT_MS) {
    const waitSec = Math.ceil((RATE_LIMIT_MS - (now - last)) / 1000);
    return res.status(429).json({ error: `wait ${waitSec}s before posting again` });
  }

  try {
    const result = await pool.query(
      `INSERT INTO posts (text) VALUES ($1) RETURNING id, text, created_at`,
      [text]
    );
    lastPostByIp.set(ip, now);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not save post' });
  }
});

// Report a post. Increments report_count; auto-hides once past threshold.
app.post('/posts/:id/report', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid post id' });

  try {
    const result = await pool.query(
      `UPDATE posts
       SET report_count = report_count + 1,
           hidden = (report_count + 1 >= $2)
       WHERE id = $1
       RETURNING id`,
      [id, REPORT_THRESHOLD]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'post not found' });
    res.json({ reported: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not register report' });
  }
});

// ---- admin-only routes ----
// Not exposed anywhere in the public UI. Require the secret key header on every call.
function requireAdmin(req, res, next) {
  if (!ADMIN_KEY || req.headers['x-admin-key'] !== ADMIN_KEY) {
    return res.status(403).json({ error: 'forbidden' });
  }
  next();
}

// List posts that have at least one report, worst-first, so you can see
// what's been flagged and decide whether to purge it. Includes posts the
// public feed has already auto-hidden, since those are exactly the ones
// worth reviewing.
app.get('/admin/posts', requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, text, created_at, report_count, hidden
       FROM posts
       WHERE report_count > 0
       ORDER BY report_count DESC, created_at DESC
       LIMIT 200`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not load flagged posts' });
  }
});

// Not exposed in the UI anywhere. Used only for illegal content that needs
// immediate removal regardless of report count.
app.post('/admin/posts/:id/purge', requireAdmin, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await pool.query(`DELETE FROM posts WHERE id = $1`, [id]);
    res.json({ deleted: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'could not delete post' });
  }
});

// ---- periodic cleanup of expired posts ----
// Belt-and-suspenders: the feed query already filters expired posts out,
// this just actually removes old rows so the table doesn't grow forever.
async function cleanupExpired() {
  try {
    await pool.query(
      `DELETE FROM posts WHERE created_at < now() - interval '${POST_EXPIRY_HOURS} hours'`
    );
  } catch (err) {
    console.error('cleanup failed', err);
  }
}
setInterval(cleanupExpired, 60 * 60 * 1000); // once an hour

app.listen(PORT, () => {
  console.log(`blurit server running on port ${PORT}`);
});
