import "./Header.css";
import logo from "../../assets/TSTlogo.png";

export default function Header() {
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

        <div className="header-badge">
          <span className="status-dot"></span>
          Practice Mode
        </div>
      </div>
    </header>
  );
}