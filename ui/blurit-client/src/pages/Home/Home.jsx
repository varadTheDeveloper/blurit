import Header from "../../components/Header/Header";
import Composer from "../../components/Composer/Composer";
import Feed from "../../components/Feed/Feed";
import Footer from "../../components/Footer/Footer";
import Toast from "../../components/Toast/Toast";
import BackToTop from "../../components/BackToTop/BackToTop";
import NewPostsBanner from "../../components/NewPostsBanner/NewPostsBanner";

import useFeed from "../../hooks/useFeed";
import useToast from "../../hooks/useToast";

function Home() {

    const {

        posts,
        loading,
        loadingMore,
        hasMore,
        loadMore,
        report,
        reload,
        newPosts,
        setNewPosts

    } = useFeed();

    const {

        toast,
        show

    } = useToast();

    return (

        <>

            <Header />

            <main className="container">

                <Composer
                    onPosted={() => {

                        reload();

                        show("Post created successfully!");

                    }}
                />

                {

                    newPosts > 0 && (

                        <NewPostsBanner

                            count={newPosts}

                            onClick={async () => {

                                await reload();

                                setNewPosts(0);

                                window.scrollTo({

                                    top: 0,

                                    behavior: "smooth"

                                });

                            }}

                        />

                    )

                }

                <Feed
                    posts={posts}
                    loading={loading}
                    loadingMore={loadingMore}
                    hasMore={hasMore}
                    loadMore={loadMore}
                    onReport={report}
                />

                <Footer />

            </main>

            <BackToTop />

            <Toast
                message={toast?.message}
                type={toast?.type}
            />

        </>

    );

}

export default Home;