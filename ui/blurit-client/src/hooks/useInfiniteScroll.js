import { useEffect, useRef } from "react";

export default function useInfiniteScroll(

    onLoadMore,

    hasMore,

    loadingMore

) {

    const targetRef = useRef(null);

    useEffect(() => {

        if (!hasMore) {

            return;

        }

        const observer = new IntersectionObserver(

            entries => {

                const entry = entries[0];

                if (

                    entry.isIntersecting &&

                    hasMore &&

                    !loadingMore

                ) {

                    onLoadMore();

                }

            },

            {

                root: null,

                rootMargin: "200px",

                threshold: 0

            }

        );

        if (targetRef.current) {

            observer.observe(targetRef.current);

        }

        return () => {

            observer.disconnect();

        };

    }, [

        onLoadMore,

        hasMore,

        loadingMore

    ]);

    return targetRef;

}