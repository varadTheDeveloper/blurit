const API_BASE = window.BLURIT_API_BASE || "https://api.blurit.org";

export async function getPosts(limit = 20, offset = 0) {

    const response = await fetch(
        `${API_BASE}/posts?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {

        throw new Error("Could not load posts.");

    }

    return response.json();

}

export async function getLatestPost() {

    const response = await fetch(
        `${API_BASE}/posts/latest`
    );

    if (!response.ok) {

        throw new Error("Could not check for new posts.");

    }

    return response.json();

}

export async function createPost(text) {

    const response = await fetch(`${API_BASE}/posts`, {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            text

        })

    });

    const data = await response.json();

    if (!response.ok) {

        throw new Error(data.error || "Could not create post.");

    }

    return data;

}

export async function reportPost(id) {

    const response = await fetch(

        `${API_BASE}/posts/${id}/report`,

        {

            method: "POST"

        }

    );

    const data = await response.json();

    // Already reported isn't an actual error.
    // Just tell the UI it has already been reported.
    if (response.status === 409) {

        return {

            alreadyReported: true

        };

    }

    if (!response.ok) {

        throw new Error(

            data.error || "Could not report post."

        );

    }

    return {

        alreadyReported: false,

        ...data

    };

}