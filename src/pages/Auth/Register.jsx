import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import logo from "../../assets/TSTlogo.png"

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
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

  const getPasswordStrength = () => {
    const { password } = formData;

    if (!password) {
      return {
        level: 0,
        label: "",
      };
    }

    let score = 0;

    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) {
      return {
        level: 1,
        label: "Weak",
      };
    }

    if (score === 2) {
      return {
        level: 2,
        label: "Fair",
      };
    }

    if (score === 3) {
      return {
        level: 3,
        label: "Good",
      };
    }

    return {
      level: 4,
      label: "Strong",
    };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Connect your registration API here.
      // Example:
      // await registerUser({
      //   name: formData.name,
      //   email: formData.email,
      //   password: formData.password,
      // });

      await new Promise((resolve) => setTimeout(resolve, 800));

      navigate("/");
    } catch (err) {
      setError("Unable to create your account. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-background">
        <span className="register-orb register-orb-one" />
        <span className="register-orb register-orb-two" />
        <span className="register-orb register-orb-three" />
      </div>

      <section className="register-container">
        <div className="register-brand">
          <Link to="/" className="register-logo">
            <img src={logo} className="register-logo-mark" alt="" />
            <span>Type<span>Fast</span></span>
          </Link>

          <p>
            Start improving your typing speed today.
          </p>
        </div>

        <div className="register-card">
          <div className="register-card-header">
            <div className="register-icon">
              <span>+</span>
            </div>

            <h1>Create your account</h1>

            <p>
              Join TypeFast and start tracking your progress.
            </p>
          </div>

          {error && (
            <div className="register-error" role="alert">
              <span className="register-error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="register-name">Full name</label>

              <div className="register-input-wrapper">
                <span className="register-input-icon">●</span>

                <input
                  id="register-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="register-email">Email address</label>

              <div className="register-input-wrapper">
                <span className="register-input-icon">✉</span>

                <input
                  id="register-email"
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
              <label htmlFor="register-password">Password</label>

              <div className="register-input-wrapper">
                <span className="register-input-icon">●</span>

                <input
                  id="register-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>

              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((bar) => (
                      <span
                        key={bar}
                        className={
                          bar <= passwordStrength.level
                            ? "strength-bar active"
                            : "strength-bar"
                        }
                      />
                    ))}
                  </div>

                  <span
                    className={`strength-label strength-${passwordStrength.level}`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="register-confirm-password">
                Confirm password
              </label>

              <div className="register-input-wrapper">
                <span className="register-input-icon">●</span>

                <input
                  id="register-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  required
                />

                <button
                  type="button"
                  className="register-password-toggle"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showConfirmPassword ? "◉" : "◌"}
                </button>
              </div>

              {formData.confirmPassword && (
                <p
                  className={
                    formData.password === formData.confirmPassword
                      ? "password-match success"
                      : "password-match"
                  }
                >
                  {formData.password === formData.confirmPassword
                    ? "✓ Passwords match"
                    : "Passwords do not match"}
                </p>
              )}
            </div>

            <label className="terms-checkbox">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(event) =>
                  setAgreeTerms(event.target.checked)
                }
              />

              <span className="terms-custom-checkbox">
                {agreeTerms && "✓"}
              </span>

              <span>
                I agree to the{" "}
                <Link to="/terms">Terms of Service</Link> and{" "}
                <Link to="/privacy">Privacy Policy</Link>.
              </span>
            </label>

            <button
              type="submit"
              className="register-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="register-spinner" />
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <span className="register-arrow">→</span>
                </>
              )}
            </button>
          </form>

          <div className="register-divider">
            <span>Already a member?</span>
          </div>

          <div className="register-footer">
            <Link to="/login">
              Sign in to your account
              <span>→</span>
            </Link>
          </div>
        </div>

        <p className="register-bottom-text">
          Your typing progress will be securely associated with your account.
        </p>
      </section>
    </main>
  );
};

export default Register;