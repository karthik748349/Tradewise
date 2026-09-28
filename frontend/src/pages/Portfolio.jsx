import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowDownToLine,
  ArrowUpRight,
  BriefcaseBusiness,
  CircleDollarSign,
  Home,
  LogOut,
  Wallet,
} from "lucide-react";

import authService from "../services/authService";

function Portfolio() {
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = authService.getUser();

  const displayName =
    user && user.name
      ? user.name
      : "Trader";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8081/api/portfolio", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPortfolio(response.data);
      })
      .catch((err) => {
        console.error("Failed to load portfolio:", err);
        setError("Unable to load your portfolio.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    authService.logout();

    navigate("/login", {
      replace: true,
    });
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) {
      return "₹0";
    }

    return `₹${Number(value).toLocaleString("en-IN", {
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <div className="app-shell">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-mark">
            T
          </div>

          <div>
            <b>TradeWise</b>

            <small>
              Learn • Simulate • Grow
            </small>
          </div>
        </div>

        <div className="nav-label">
          WORKSPACE
        </div>

        <nav>

          <button
            className="nav-item"
            onClick={() => navigate("/dashboard")}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/markets")}
          >
            <ArrowUpRight size={18} />
            <span>Markets</span>
          </button>

          <button
            className="nav-item active"
          >
            <BriefcaseBusiness size={18} />
            <span>Portfolio</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/watchlist")}
          >
            <CircleDollarSign size={18} />
            <span>Watchlist</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/news")}
          >
            <CircleDollarSign size={18} />
            <span>News</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/ai-tutor")}
          >
            <CircleDollarSign size={18} />
            <span>AI Tutor</span>
          </button>

          <button
            className="nav-item"
            onClick={() => navigate("/learning")}
          >
            <CircleDollarSign size={18} />
            <span>Learning</span>
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="nav-item logout-button"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>

          <div className="user-mini">

            <div className="avatar">
              {displayName
                .substring(0, 2)
                .toUpperCase()}
            </div>

            <div>
              <b>{displayName}</b>

              <small>
                Paper account
              </small>
            </div>

          </div>

        </div>

      </aside>

      {/* MAIN */}
      <main className="main">

        {/* TOP BAR */}
        <header className="topbar">

          <div className="search">
            <input
              placeholder="Search stocks, concepts, news…"
            />
          </div>

          <div className="top-actions">

            <span className="status-dot"></span>

            <span className="api-status">
              Connected
            </span>

            <div className="avatar">
              {displayName
                .substring(0, 2)
                .toUpperCase()}
            </div>

          </div>

        </header>

        {/* CONTENT */}
        <section className="content">

          <div className="page-heading">

            <div>

              <p className="eyebrow">
                PAPER TRADING
              </p>

              <h1>
                My Portfolio
              </h1>

              <p className="muted">
                Track your virtual capital, investments
                and trading performance.
              </p>

            </div>

            <button
              className="primary"
              onClick={() => navigate("/markets")}
            >
              <ArrowUpRight size={17} />
              Explore markets
            </button>

          </div>

          {/* ERROR */}
          {error && (
            <section className="card">
              <div
                style={{
                  padding: "30px",
                  textAlign: "center",
                }}
              >
                <h2>
                  Portfolio unavailable
                </h2>

                <p className="muted">
                  {error}
                </p>
              </div>
            </section>
          )}

          {/* LOADING */}
          {loading && (
            <section className="card">
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                }}
              >
                <h2>
                  Loading portfolio...
                </h2>

                <p className="muted">
                  Fetching your virtual trading account.
                </p>
              </div>
            </section>
          )}

          {/* PORTFOLIO */}
          {!loading && portfolio && (
            <>

              {/* METRICS */}
              <div className="metrics">

                <div className="metric card">

                  <div className="metric-icon">
                    <Wallet size={17} />
                  </div>

                  <p>
                    Portfolio value
                  </p>

                  <h2>
                    {formatCurrency(
                      portfolio.portfolioValue
                    )}
                  </h2>

                  <small>
                    Current account value
                  </small>

                </div>

                <div className="metric card">

                  <div className="metric-icon">
                    <CircleDollarSign size={17} />
                  </div>

                  <p>
                    Initial capital
                  </p>

                  <h2>
                    {formatCurrency(
                      portfolio.initialCapital
                    )}
                  </h2>

                  <small>
                    Starting virtual capital
                  </small>

                </div>

                <div className="metric card">

                  <div className="metric-icon">
                    <Wallet size={17} />
                  </div>

                  <p>
                    Available cash
                  </p>

                  <h2>
                    {formatCurrency(
                      portfolio.availableCash
                    )}
                  </h2>

                  <small>
                    Ready for trading
                  </small>

                </div>

                <div className="metric card">

                  <div className="metric-icon">
                    <BriefcaseBusiness size={17} />
                  </div>

                  <p>
                    Invested amount
                  </p>

                  <h2>
                    {formatCurrency(
                      portfolio.investedAmount
                    )}
                  </h2>

                  <small>
                    Currently invested
                  </small>

                </div>

              </div>

              {/* HOLDINGS */}
              <section className="card">

                <div className="card-head">

                  <div>
                    <h2>
                      Holdings
                    </h2>

                    <p>
                      Your current paper-trading positions
                    </p>
                  </div>

                </div>

                <div
                  style={{
                    padding: "55px 30px",
                    textAlign: "center",
                  }}
                >

                  <div
                    style={{
                      width: "56px",
                      height: "56px",
                      margin: "0 auto 18px",
                      borderRadius: "14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#eef4ff",
                    }}
                  >
                    <BriefcaseBusiness size={25} />
                  </div>

                  <h2>
                    No holdings yet
                  </h2>

                  <p className="muted">
                    You haven't placed any paper trades yet.
                  </p>

                  <button
                    className="primary"
                    style={{ marginTop: "18px" }}
                    onClick={() => navigate("/markets")}
                  >
                    <ArrowUpRight size={17} />
                    Explore markets
                  </button>

                </div>

              </section>

              {/* QUICK ACTIONS */}
              <div className="grid-bottom">

                <section className="card">

                  <div className="card-head">

                    <div>
                      <h2>
                        Trading actions
                      </h2>

                      <p>
                        Manage your paper trading activity.
                      </p>
                    </div>

                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(2, minmax(0, 1fr))",
                      gap: "14px",
                      padding: "10px 0",
                    }}
                  >

                    <button
                      className="primary"
                      onClick={() => navigate("/markets")}
                    >
                      <ArrowUpRight size={17} />
                      Buy stocks
                    </button>

                    <button
                      className="ghost"
                      onClick={() => navigate("/markets")}
                    >
                      <ArrowDownToLine size={17} />
                      Sell stocks
                    </button>

                  </div>

                </section>

                <section className="card">

                  <div className="card-head">

                    <div>
                      <h2>
                        Portfolio status
                      </h2>

                      <p>
                        Your paper account is ready.
                      </p>
                    </div>

                  </div>

                  <div className="news">

                    <span className="tag">
                      PAPER ACCOUNT
                    </span>

                    <h3>
                      ₹10,00,000 virtual capital
                    </h3>

                    <p>
                      Start practicing trades without
                      using real money.
                    </p>

                  </div>

                </section>

              </div>

            </>
          )}

          <footer>
            TradeWise · Paper trading only ·{" "}
            <span>
              Never connect real-money execution
              to this demo engine.
            </span>
          </footer>

        </section>

      </main>

    </div>
  );
}

export default Portfolio;