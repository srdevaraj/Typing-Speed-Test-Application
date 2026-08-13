import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Header.css";

import logo from "../../assets/TSTlogo.png";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    logout,
    user,
  } = useAuth();

  const isHomePage =
    location.pathname === "/";

  const isResultsPage =
    location.pathname === "/result";

  const username =
    user?.username ||
    user?.name ||
    "User";

  const userInitial =
    username
      .charAt(0)
      .toUpperCase();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  const handleHome = () => {
    navigate("/");
  };

  const handleResults = () => {
    navigate("/result");
  };

  return (
    <header className="header">
      <div
        className="header-background-glow"
        aria-hidden="true"
      />

      <div className="header-container">

        {/* =================================================
            BRAND
        ================================================= */}

        <button
          type="button"
          className="brand"
          onClick={handleHome}
          aria-label="Go to TypeSpeed home"
        >
          <div className="brand-logo-wrapper">
            <img
              src={logo}
              className="brand-logo"
              alt="TypeSpeed logo"
            />

            <span
              className="brand-logo-ring"
              aria-hidden="true"
            />
          </div>

          <div className="brand-content">
            <h1 className="brand-title">
              Type<span>Speed</span>
            </h1>

            <p className="header-subtitle">
              Improve your typing speed
            </p>
          </div>
        </button>

        {/* =================================================
            NAVIGATION / ACTIONS
        ================================================= */}

        <div className="header-actions">

          {/* =================================================
              HOME
          ================================================= */}

          <button
            type="button"
            className={`header-nav-button ${
              isHomePage
                ? "active"
                : ""
            }`}
            onClick={handleHome}
            aria-current={
              isHomePage
                ? "page"
                : undefined
            }
            aria-label="Home"
          >
            <span className="nav-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M3 10.5L12 3l9 7.5" />
                <path d="M5.5 9.5V21h13V9.5" />
                <path d="M9.5 21v-6.5h5V21" />
              </svg>
            </span>

            <span className="nav-text">
              Home
            </span>
          </button>

          {/* =================================================
              RESULTS
          ================================================= */}

          <button
            type="button"
            className={`header-nav-button ${
              isResultsPage
                ? "active"
                : ""
            }`}
            onClick={handleResults}
            aria-current={
              isResultsPage
                ? "page"
                : undefined
            }
            aria-label="Results"
          >
            <span className="nav-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M4 19V5" />
                <path d="M4 19h16" />
                <path d="M8 16v-5" />
                <path d="M12 16V8" />
                <path d="M16 16v-9" />
              </svg>
            </span>

            <span className="nav-text">
              Results
            </span>
          </button>

          {/* =================================================
              DIVIDER
          ================================================= */}

          <span
            className="header-divider"
            aria-hidden="true"
          />

          {/* =================================================
              USER PROFILE
          ================================================= */}

          <div className="user-profile">

            <div className="user-avatar">
              {userInitial}

              <span
                className="user-online-dot"
                aria-hidden="true"
              />
            </div>

            <div className="user-info">
              <span className="user-label">
                Signed in as
              </span>

              <span className="user-name">
                {username}
              </span>
            </div>

          </div>

          {/* =================================================
              LOGOUT
          ================================================= */}

          <button
            type="button"
            className="header-logout"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <span className="logout-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
              </svg>
            </span>

            <span className="logout-text">
              Logout
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}