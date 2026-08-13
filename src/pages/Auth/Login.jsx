import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import "./Login.css";

import logo from "../../assets/TSTlogo.png";

import { login as loginApi } from "../../services/authService";

import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { login: loginUser } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

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

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await loginApi({
        email,
        password,
      });

      console.log(
        "Login response:",
        response
      );

      if (!response?.token) {
        throw new Error(
          "Authentication token was not received."
        );
      }

      /**
       * IMPORTANT:
       *
       * Save token AND update AuthContext.
       */
      loginUser(
        response.token,
        response.username,
        response.email,
        rememberMe
      );

      console.log(
        "Authentication successful."
      );

      /**
       * Return to the page user originally
       * requested, if available.
       */
      const from =
        location.state?.from?.pathname ||
        "/";

      navigate(from, {
        replace: true,
      });

    } catch (err) {
      console.error(
        "Login failed:",
        err?.response?.data || err
      );

      const responseData =
        err?.response?.data;

      if (
        typeof responseData === "string"
      ) {
        setError(responseData);
      } else if (
        responseData?.message
      ) {
        setError(responseData.message);
      } else if (
        err?.response?.status === 400
      ) {
        setError(
          "Invalid login request."
        );
      } else if (
        err?.response?.status === 401
      ) {
        setError(
          "Invalid email or password."
        );
      } else if (
        err?.response?.status === 403
      ) {
        setError(
          "You are not authorized to login."
        );
      } else if (err?.request) {
        setError(
          "Unable to connect to the server."
        );
      } else {
        setError(
          "Unable to sign in. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div
        className="auth-background"
        aria-hidden="true"
      >
        <span className="auth-orb auth-orb-one" />
        <span className="auth-orb auth-orb-two" />
        <span className="auth-orb auth-orb-three" />
      </div>

      <section className="auth-container">
        <div className="auth-brand">
          <Link
            to="/"
            className="auth-logo"
          >
            <img
              src={logo}
              className="auth-logo-mark"
              alt="TypeFast logo"
            />

            <span>
              Type<span>Fast</span>
            </span>
          </Link>

          <p className="auth-brand-text">
            Improve your typing speed. Track
            your progress. Get faster.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">
              <span>→</span>
            </div>

            <h1>Welcome back</h1>

            <p>
              Sign in to continue your typing
              journey.
            </p>
          </div>

          {error && (
            <div
              className="auth-error"
              role="alert"
            >
              <span className="auth-error-icon">
                !
              </span>

              <span>{error}</span>
            </div>
          )}

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <div className="form-group">
              <label htmlFor="login-email">
                Email address
              </label>

              <div className="input-wrapper">
                <span className="input-icon">
                  ✉
                </span>

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
                <label htmlFor="login-password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() =>
                    alert(
                      "Password reset will be available soon."
                    )
                  }
                >
                  Forgot password?
                </button>
              </div>

              <div className="input-wrapper">
                <span className="input-icon">
                  ●
                </span>

                <input
                  id="login-password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
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
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword
                    ? "◉"
                    : "◌"}
                </button>
              </div>
            </div>

            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(
                    event.target.checked
                  )
                }
              />

              <span className="custom-checkbox">
                {rememberMe && "✓"}
              </span>

              <span>
                Remember me
              </span>
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

                  <span className="submit-arrow">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>or</span>
          </div>

          <div className="auth-footer">
            <p>
              Don't have an account?{" "}
              <Link to="/register">
                Create account
              </Link>
            </p>
          </div>
        </div>

        <p className="auth-bottom-text">
          By continuing, you agree to our{" "}
          <Link to="/terms">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy">
            Privacy Policy
          </Link>
          .
        </p>
      </section>
    </main>
  );
};

export default Login;