const { Pool } = require('pg');

// Uses DATABASE_URL from environment (see .env.example).
// No user data ever goes through this pool except post text + id + timestamp.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

module.exports = pool;
