import "./Header.css";

function Header() {
    return (
        <header className="header">
            <div className="header__inner">

                <div className="header__left">
                    <h1 className="header__logo">
                        blurit
                    </h1>

                    <p className="header__tagline">
                        say it. no login. it's public.
                    </p>
                </div>

                <a
                    className="header__github"
                    href="https://github.com/varadTheDeveloper/blurit"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View Blurit on GitHub"
                >
                    ⭐ Open Source
                </a>

            </div>
        </header>
    );
}

export default Header;