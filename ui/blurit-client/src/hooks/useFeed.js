import { useEffect, useState } from "react";

import {
    getPosts,
    reportPost,
    getLatestPost
} from "../services/api";

const PAGE_SIZE = 20;

export default function useFeed() {

    const [posts, setPosts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [loadingMore, setLoadingMore] = useState(false);

    const [offset, setOffset] = useState(0);

    const [hasMore, setHasMore] = useState(true);

    const [newPosts, setNewPosts] = useState(0);

    async function load() {

        setLoading(true);

        try {

            const data = await getPosts(PAGE_SIZE, 0);

            setPosts(data);

            setOffset(data.length);

            setHasMore(data.length === PAGE_SIZE);

            // User refreshed the feed,
            // so clear the notification.
            setNewPosts(0);

        }

        finally {

            setLoading(false);

        }

    }

    async function loadMore() {

        if (loadingMore || !hasMore) {

            return;

        }

        setLoadingMore(true);

        try {

            const data = await getPosts(

                PAGE_SIZE,

                offset

            );

            setPosts(previous => {

                const existingIds = new Set(

                    previous.map(post => post.id)

                );

                const uniquePosts = data.filter(

                    post => !existingIds.has(post.id)

                );

                return [

                    ...previous,

                    ...uniquePosts

                ];

            });

            setOffset(previous => previous + data.length);

            if (data.length < PAGE_SIZE) {

                setHasMore(false);

            }

        }

        finally {

            setLoadingMore(false);

        }

    }

    async function report(id) {

        // Send the report to the server.
        // The FeedItem component already changes
        // its own button to "✓ Reported".
        // Once enough users report the post,
        // the backend hides it automatically.

        await reportPost(id);

    }

    function addOptimisticPost(text) {

        const tempPost = {

            id: `temp-${Date.now()}`,

            text,

            created_at: new Date().toISOString(),

            optimistic: true

        };

        setPosts(previous => [

            tempPost,

            ...previous

        ]);

        return tempPost;

    }

    function removeOptimisticPost(id) {

        setPosts(previous =>

            previous.filter(post => post.id !== id)

        );

    }

    // Initial load
    useEffect(() => {

        load();

    }, []);

    // Check every 4 seconds for newer posts
    useEffect(() => {

        const interval = setInterval(async () => {

            if (posts.length === 0) {

                return;

            }

            try {

                const latest = await getLatestPost();

                const newestLoaded = posts[0];

                if (

                    newestLoaded &&

                    latest.latestId > newestLoaded.id

                ) {

                    setNewPosts(

                        latest.latestId - newestLoaded.id

                    );

                }

            }

            catch (err) {

                console.error(err);

            }

        }, 4000);

        return () => clearInterval(interval);

    }, [posts]);

    return {

        posts,

        loading,

        loadingMore,

        hasMore,

        loadMore,

        report,

        reload: load,

        newPosts,

        setNewPosts,

        addOptimisticPost,

        removeOptimisticPost

    };

}