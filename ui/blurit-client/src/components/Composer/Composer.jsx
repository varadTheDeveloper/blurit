import { useEffect, useRef, useState } from "react";
import { createPost } from "../../services/api";
import "./Composer.css";

const MAX_LENGTH = 500;

function Composer({ onPosted }) {

    const textareaRef = useRef(null);

    const [text, setText] = useState("");
    const [posting, setPosting] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const textarea = textareaRef.current;

        if (!textarea) return;

        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;

    }, [text]);

    async function handleSubmit() {

        const value = text.trim();

        if (!value) {

            setError("Write something first.");
            return;

        }

        if (value.length > MAX_LENGTH) {

            setError("Post is too long.");
            return;

        }

        try {

            setPosting(true);
            setError("");

            await createPost(value);

            setText("");

            textareaRef.current?.focus();

            onPosted?.();

        } catch (err) {

            setError(err.message || "Could not create post.");

        } finally {

            setPosting(false);

        }

    }

    function handleKeyDown(event) {

        if (event.ctrlKey && event.key === "Enter") {

            event.preventDefault();
            handleSubmit();

        }

        if (event.key === "Escape") {

            setText("");
            setError("");

        }

    }

    return (

        <section className="composer">

            <h2 className="composer__title">

                What's happening?

            </h2>

            <textarea
                ref={textareaRef}
                value={text}
                maxLength={MAX_LENGTH}
                placeholder="Write anything..."
                onChange={(event) => {

                    setText(event.target.value);

                    if (error) {

                        setError("");

                    }

                }}
                onKeyDown={handleKeyDown}
            />

            <div className="composer__bottom">

                <div>

                    <span className="composer__counter">

                        {MAX_LENGTH - text.length} characters left

                    </span>

                    <span className="composer__shortcut">

                        Ctrl + Enter to post

                    </span>

                </div>

                <button
                    className={posting ? "loading" : ""}
                    disabled={posting || text.trim().length === 0}
                    onClick={handleSubmit}
                >

                    {

                        posting ? (

                            <>

                                <span className="spinner"></span>

                                Posting...

                            </>

                        ) : (

                            "Post"

                        )

                    }

                </button>

            </div>

            {

                error && (

                    <p className="composer__error">

                        {error}

                    </p>

                )

            }

        </section>

    );

}

export default Composer;