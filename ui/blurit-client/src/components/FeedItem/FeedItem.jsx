import { useState } from "react";
import timeAgo from "../../utils/timeAgo";
import useNow from "../../hooks/useNow";
import "./FeedItem.css";

function FeedItem({ post, onReport }) {

    const now = useNow();

    const [reporting, setReporting] = useState(false);

    const [reported, setReported] = useState(false);

    async function handleReport() {

        if (reporting || reported) {

            return;

        }

        try {

            setReporting(true);

            const result = await onReport(post.id);

            // Whether it was reported just now or was
            // already reported earlier, mark it as reported.
            setReported(true);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setReporting(false);

        }

    }

    return (

        <article
            className={`feed-item
                ${post.optimistic ? "feed-item--pending" : ""}
                ${post.isNew ? "feed-item--new" : ""}
            `}
        >

            <div className="feed-item__content">

                {

                    post.isNew && (

                        <span className="feed-item__badge">

                            NEW

                        </span>

                    )

                }

                <p className="feed-item__text">

                    {post.text}

                </p>

            </div>

            <div className="feed-item__footer">

                <span>

                    {timeAgo(post.created_at, now)}

                </span>

                <button

                    disabled={reporting || reported}

                    onClick={handleReport}

                >

                    {

                        reported

                            ? "✓ Reported"

                            : reporting

                            ? "Reporting..."

                            : "Report"

                    }

                </button>

            </div>

        </article>

    );

}

export default FeedItem;