import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import logo from "../../assets/TSTlogo.png"

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Connect your authentication API here.
      // Example:
      // const response = await loginUser(formData);

      await new Promise((resolve) => setTimeout(resolve, 800));

      navigate("/");
    } catch (err) {
      setError("Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-background">
        <span className="auth-orb auth-orb-one" />
        <span className="auth-orb auth-orb-two" />
        <span className="auth-orb auth-orb-three" />
      </div>

      <section className="auth-container">
        <div className="auth-brand">
          <Link to="/" className="auth-logo">
            <img src={logo} className="auth-logo-mark" alt="" />
            <span>Type<span>Fast</span></span>
          </Link>

          <p className="auth-brand-text">
            Improve your typing speed. Track your progress. Get faster.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">
              <span>→</span>
            </div>

            <h1>Welcome back</h1>

            <p>
              Sign in to continue your typing journey.
            </p>
          </div>

          {error && (
            <div className="auth-error" role="alert">
              <span className="auth-error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="login-email">Email address</label>

              <div className="input-wrapper">
                <span className="input-icon">✉</span>

                <input
                  id="login-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label htmlFor="login-password">Password</label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => alert("Password reset will be available soon.")}
                >
                  Forgot password?
                </button>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">●</span>

                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>
            </div>

            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />

              <span className="custom-checkbox">
                {rememberMe && "✓"}
              </span>

              <span>Remember me</span>
            </label>

            <button
              type="submit"
              className="auth-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="button-spinner" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span className="submit-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?
              <Link to="/register"> Create account</Link>
            </p>
          </div>
        </div>

        <p className="auth-bottom-text">
          By continuing, you agree to our{" "}
          <Link to="/terms">Terms of Service</Link> and{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </p>
      </section>
    </main>
  );
};

export default Login;