import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Header.css";

import logo from "../../assets/TSTlogo.png";

export default function Header() {
  const navigate = useNavigate();

  const {
    logout,
  } = useAuth();

  const handleLogout = () => {
    logout();

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="brand">
          <img
            src={logo}
            className="brand-logo"
            alt="Type Speed Test logo"
          />

          <div className="brand-content">
            <h1 className="brand-title">
              Type<span>Speed</span>
            </h1>

            <p className="header-subtitle">
              Improve your typing speed
            </p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="header-results"
            onClick={() =>
              navigate("/result")
            }
          >
            Results
          </button>

          <div className="header-badge">
            <span className="status-dot" />
            Practice Mode
          </div>

          <button
            type="button"
            className="header-logout"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}