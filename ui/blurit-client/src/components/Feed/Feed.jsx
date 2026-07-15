import FeedItem from "../FeedItem/FeedItem";
import Skeleton from "../Loading/Skeleton";
import Loader from "../Loader/Loader";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";

import "./Feed.css";

function Feed({

    posts,

    loading,

    loadingMore,

    hasMore,

    loadMore,

    onReport

}) {

    const bottomRef = useInfiniteScroll(

        loadMore,

        hasMore,

        loadingMore

    );

    if (loading) {

        return (
            <>
                <Skeleton />
                <Skeleton />
                <Skeleton />
            </>
        );

    }

    if (posts.length === 0) {

        return (

            <div className="empty">

                <h3>No posts yet</h3>

                <p>

                    Be the first person to say something.

                </p>

            </div>

        );

    }

    return (

        <section className="feed">

            {

                posts.map(post => (

                    <FeedItem

                        key={post.id}

                        post={post}

                        onReport={onReport}

                    />

                ))

            }

            <div
                ref={bottomRef}
                className="feed__bottom"
            >

                {

                    loadingMore && (

                        <Loader />

                    )

                }

                {

                    !hasMore &&

                    !loadingMore &&

                    posts.length > 0 && (

                        <div className="feed-end">

                            You've reached the end.

                        </div>

                    )

                }

            </div>

        </section>

    );

}

export default Feed;