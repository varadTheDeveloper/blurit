import { useEffect, useState } from "react";

import "./BackToTop.css";

function BackToTop() {

    const [visible, setVisible] = useState(false);

    useEffect(() => {

        function handleScroll() {

            setVisible(window.scrollY > 500);

        }

        window.addEventListener("scroll", handleScroll);

        return () => {

            window.removeEventListener("scroll", handleScroll);

        };

    }, []);

    function scrollToTop() {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

    }

    if (!visible) {

        return null;

    }

    return (

        <button

            className="back-to-top"

            onClick={scrollToTop}

            aria-label="Back to top"

        >

            ↑

        </button>

    );

}

export default BackToTop;