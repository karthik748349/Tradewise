import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";

export default function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateForm = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {

    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Name must contain at least 2 characters.");
      return;
    }

    if (!form.email) {
      setError("Please enter your email.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    try {

      setLoading(true);

      await authService.register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password
      });

      navigate("/dashboard", {
        replace: true
      });

    } catch (err) {

      console.error(err);

      const message =
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Unable to create your account.";

      setError(message);

    } finally {

      setLoading(false);

    }
  };

  return (

    <div className="auth-page">

      {/* LEFT SIDE */}

      <div className="auth-left">

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

        <div className="auth-left-content">

          <span className="auth-label">
            START YOUR JOURNEY
          </span>

          <h1>
            Turn market
            <br />
            knowledge into practice.
          </h1>

          <p>
            Build your understanding of financial markets
            through simulated trading and structured learning.
          </p>

          <div className="auth-benefits">

            <div className="benefit">
              <div>💰</div>
              <span>
                Start with virtual capital
              </span>
            </div>

            <div className="benefit">
              <div>📚</div>
              <span>
                Learn financial concepts
              </span>
            </div>

            <div className="benefit">
              <div>🤖</div>
              <span>
                Get AI-powered explanations
              </span>
            </div>

          </div>

        </div>

        <small className="auth-footer">
          TradeWise is a paper-trading and financial
          education platform.
        </small>

      </div>

      {/* RIGHT SIDE */}

      <div className="auth-right">

        <div className="auth-card">

          <div className="mobile-logo">

            <div className="auth-logo">
              T
            </div>

            <strong>
              TradeWise
            </strong>

          </div>

          <div className="auth-heading">

            <span className="auth-label">
              GET STARTED
            </span>

            <h2>
              Create your account
            </h2>

            <p>
              Start learning and practicing with virtual money.
            </p>

          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <label className="auth-input-label">

              Full name

              <div className="auth-input">

                <UserRound size={18} />

                <input
                  type="text"
                  name="name"
                  placeholder="Your name"
                  value={form.name}
                  onChange={updateForm}
                  autoComplete="name"
                />

              </div>

            </label>

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
                  placeholder="At least 8 characters"
                  value={form.password}
                  onChange={updateForm}
                  autoComplete="new-password"
                />

                <button
                  type="button"
                  className="password-button"
                  onClick={() =>
                    setShowPassword(!showPassword)
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

            {/* REGISTER */}

            <button
              type="submit"
              className="auth-button"
              disabled={loading}
            >

              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && (
                <ArrowRight size={18} />
              )}

            </button>

          </form>

          <div className="auth-switch">

            Already have an account?

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>

  );
}