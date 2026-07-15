import "./NewPostsBanner.css";

function NewPostsBanner({

    count,

    onClick

}) {

    if (count <= 0) {

        return null;

    }

    return (

        <button

            className="new-posts-banner"

            onClick={onClick}

        >

            ▲ {count} New {count === 1 ? "Post" : "Posts"}

        </button>

    );

}

export default NewPostsBanner;