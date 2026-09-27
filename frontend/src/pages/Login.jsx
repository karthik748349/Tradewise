import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Turnstile } from "@marsidev/react-turnstile";
import authService from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  // -----------------------------
  // Form state
  // -----------------------------
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  // -----------------------------
  // UI state
  // -----------------------------
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // -----------------------------
  // Cloudflare Turnstile state
  // -----------------------------
  const [turnstileToken, setTurnstileToken] = useState("");

  // -----------------------------
  // Update form fields
  // -----------------------------
  const updateForm = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value
    }));
  };

  // -----------------------------
  // Turnstile success
  // -----------------------------
  const handleTurnstileSuccess = (token) => {
    setTurnstileToken(token);
    setError("");
  };

  // -----------------------------
  // Turnstile error
  // -----------------------------
  const handleTurnstileError = () => {
    setTurnstileToken("");

    setError(
      "Security verification failed. Please try again."
    );
  };

  // -----------------------------
  // Turnstile expired
  // -----------------------------
  const handleTurnstileExpire = () => {
    setTurnstileToken("");

    setError(
      "Security verification expired. Please verify again."
    );
  };

  // -----------------------------
  // Login
  // -----------------------------
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    // Validate email and password
    if (!form.email.trim() || !form.password) {
      setError("Please enter your email and password.");
      return;
    }

    // Validate Turnstile
    if (!turnstileToken) {
      setError(
        "Please complete the security verification."
      );
      return;
    }

    try {
      setLoading(true);

      // Login request
      await authService.login({
        email: form.email.trim(),
        password: form.password,
        turnstileToken: turnstileToken
      });

      // If user came from a protected page,
      // return them there.
      const destination =
        location.state?.from?.pathname || "/dashboard";

      navigate(destination, {
        replace: true
      });

    } catch (err) {
      console.error("Login error:", err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Invalid email or password.";

      setError(message);

      // Clear Turnstile token after failed login.
      // User will need to verify again.
      setTurnstileToken("");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* =====================================================
          LEFT SIDE
      ====================================================== */}

      <div className="auth-left">

        {/* Brand */}
        <div className="auth-brand">

          <div className="auth-logo">
            T
          </div>

          <div>
            <h2>TradeWise</h2>

            <span>
              Learn • Simulate • Grow
            </span>
          </div>

        </div>


        {/* Left content */}
        <div className="auth-left-content">

          <span className="auth-label">
            AI-POWERED PAPER TRADING
          </span>

          <h1>
            Learn markets by
            <br />
            practicing them.
          </h1>

          <p>
            Practice trading with virtual money, understand
            market movements and improve your financial
            knowledge with AI.
          </p>


          {/* Benefits */}
          <div className="auth-benefits">

            {/* Benefit 1 */}
            <div className="benefit">

              <div>
                📈
              </div>

              <span>
                Practice with virtual capital
              </span>

            </div>


            {/* Benefit 2 */}
            <div className="benefit">

              <div>
                📊
              </div>

              <span>
                Track portfolio performance
              </span>

            </div>


            {/* Benefit 3 */}
            <div className="benefit">

              <div>
                🤖
              </div>

              <span>
                Learn with an AI assistant
              </span>

            </div>

          </div>

        </div>


        {/* Footer */}
        <small className="auth-footer">
          TradeWise is a paper-trading and financial
          education platform.
        </small>

      </div>


      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}

      <div className="auth-right">

        <div className="auth-card">

          {/* Mobile logo */}
          <div className="mobile-logo">

            <div className="auth-logo">
              T
            </div>

            <strong>
              TradeWise
            </strong>

          </div>


          {/* Heading */}
          <div className="auth-heading">

            <span className="auth-label">
              WELCOME BACK
            </span>

            <h2>
              Sign in to TradeWise
            </h2>

            <p>
              Continue your paper-trading journey.
            </p>

          </div>


          {/* Error message */}
          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}


          {/* =================================================
              LOGIN FORM
          ================================================== */}

          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <label className="auth-input-label">

              Email

              <div className="auth-input">

                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={updateForm}
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </label>


            {/* PASSWORD */}
            <label className="auth-input-label">

              Password

              <div className="auth-input">

                <LockKeyhole size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={updateForm}
                  autoComplete="current-password"
                  disabled={loading}
                />


                {/* Show / hide password */}
                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}

                </button>

              </div>

            </label>


            {/* =================================================
                CLOUDFLARE TURNSTILE
            ================================================== */}

            <div
              style={{
                marginTop: "18px",
                marginBottom: "18px",
                display: "flex",
                justifyContent: "center",
                width: "100%"
              }}
            >

              <Turnstile
                siteKey={
                  import.meta.env
                    .VITE_TURNSTILE_SITE_KEY
                }

                onSuccess={
                  handleTurnstileSuccess
                }

                onError={
                  handleTurnstileError
                }

                onExpire={
                  handleTurnstileExpire
                }

              />

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================== */}

            <button
              type="submit"
              className="auth-button"
              disabled={
                loading ||
                !turnstileToken
              }
            >

              {loading
                ? "Signing in..."
                : "Sign in"
              }

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>


          {/* =================================================
              REGISTER LINK
          ================================================== */}

          <div className="auth-switch">

            Don't have an account?

            <Link to="/register">
              Create an account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}