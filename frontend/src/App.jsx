import { useEffect, useState } from "react";


import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  ChevronRight,
  CircleDollarSign,
  Home,
  LogOut,
  Newspaper,
  Search,
  Settings,
  Star,
  TrendingUp,
  Wallet,
} from "lucide-react";

import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from "react-router-dom";

import axios from "axios";

import Login from "./pages/Login";
import Register from "./pages/Register";
import authService from "./services/authService";

/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

const nav = [
  ["Dashboard", Home],
  ["Markets", TrendingUp],
  ["Portfolio", BriefcaseBusiness],
  ["Watchlist", Star],
  ["News", Newspaper],
  ["AI Tutor", Bot],
  ["Learning", BookOpen],
];

/* =========================================================
   DEMO CHART DATA
========================================================= */

const chart = [32, 40, 36, 52, 48, 61, 57, 68, 64, 77, 73, 84];

/* =========================================================
   SPARKLINE
========================================================= */

function Sparkline() {
  return (
    <div className="sparkline">
      {chart.map((value, index) => (
        <span
          key={index}
          style={{ height: `${value}%` }}
        />
      ))}
    </div>
  );
}

/* =========================================================
   PROTECTED ROUTE
========================================================= */

function ProtectedRoute() {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return <Outlet />;
}


/* =========================================================
   APP
========================================================= */

function App() {
  return (
    <Routes>

      {/* ================= PUBLIC ROUTES ================= */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />


      {/* ================= PROTECTED ROUTES ================= */}

      <Route element={<ProtectedRoute />}>

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* Future Phase routes */}

        <Route
          path="/markets"
          element={
            <PlaceholderPage
              title="Markets"
              description="Market data and stock charts will be added in Phase 4."
            />
          }
        />

        <Route
          path="/portfolio"
          element={
            <PlaceholderPage
              title="Portfolio"
              description="Your holdings and portfolio analytics will appear here."
            />
          }
        />

        <Route
          path="/watchlist"
          element={
            <PlaceholderPage
              title="Watchlist"
              description="Your saved stocks will appear here."
            />
          }
        />

        <Route
          path="/news"
          element={
            <PlaceholderPage
              title="Market News"
              description="Financial news will be connected in Phase 5."
            />
          }
        />

        <Route
          path="/ai-tutor"
          element={
            <PlaceholderPage
              title="AI Tutor"
              description="The TradeWise AI tutor will be added in Phase 6."
            />
          }
        />

        <Route
          path="/learning"
          element={
            <PlaceholderPage
              title="Learning"
              description="Courses, lessons and quizzes will be added in Phase 7."
            />
          }
        />

      </Route>


      {/* ================= DEFAULT ROUTES ================= */}

      <Route
        path="/"
        element={
          <Navigate
            to={
              authService.isAuthenticated()
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={
              authService.isAuthenticated()
                ? "/dashboard"
                : "/login"
            }
            replace
          />
        }
      />

    </Routes>
  );
}

/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {

  const navigate = useNavigate();

  const location = useLocation();

  const [active, setActive] = useState("Dashboard");

  const [apiStatus, setApiStatus] = useState("Checking…");

  const user = authService.getUser();

  const displayName =
    user && user.name
      ? user.name
      : "Trader";


  /* ================= BACKEND HEALTH CHECK ================= */

  useEffect(() => {

    axios
      .get("http://localhost:8081/api/health")
      .then(() => {
        setApiStatus("Connected");
      })
      .catch(() => {
        setApiStatus("Backend offline");
      });

  }, []);


  /* ================= ACTIVE PAGE ================= */

  useEffect(() => {

    const path = location.pathname;

    if (path === "/dashboard") {
      setActive("Dashboard");
    } else if (path === "/markets") {
      setActive("Markets");
    } else if (path === "/portfolio") {
      setActive("Portfolio");
    } else if (path === "/watchlist") {
      setActive("Watchlist");
    } else if (path === "/news") {
      setActive("News");
    } else if (path === "/ai-tutor") {
      setActive("AI Tutor");
    } else if (path === "/learning") {
      setActive("Learning");
    }

  }, [location.pathname]);


  /* ================= NAVIGATION ================= */

  const handleNavigation = (name) => {

    setActive(name);

    const routes = {
      Dashboard: "/dashboard",
      Markets: "/markets",
      Portfolio: "/portfolio",
      Watchlist: "/watchlist",
      News: "/news",
      "AI Tutor": "/ai-tutor",
      Learning: "/learning",
    };

    if (routes[name]) {
      navigate(routes[name]);
    }

  };


  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    authService.logout();

    navigate("/login", {
      replace: true,
    });

  };


  return (

    <div className="app-shell">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        {/* BRAND */}

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


        {/* NAVIGATION */}

        <div className="nav-label">
          WORKSPACE
        </div>

        <nav>

          {nav.map(([name, Icon]) => (

            <button
              className={
                active === name
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() => handleNavigation(name)}
              key={name}
            >

              <Icon size={18} />

              <span>
                {name}
              </span>

            </button>

          ))}

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <button
            className="nav-item"
            onClick={() => {
              // Settings will be implemented later
              setActive("Settings");
            }}
          >

            <Settings size={18} />

            <span>
              Settings
            </span>

          </button>


          {/* LOGOUT */}

          <button
            className="nav-item logout-button"
            onClick={handleLogout}
          >

            <LogOut size={18} />

            <span>
              Logout
            </span>

          </button>


          {/* USER */}

          <div className="user-mini">

            <div className="avatar">
              {displayName
                .substring(0, 2)
                .toUpperCase()}
            </div>

            <div>

              <b>
                {displayName}
              </b>

              <small>
                Paper account
              </small>

            </div>

          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main">


        {/* ===================================================
            TOP BAR
        =================================================== */}

        <header className="topbar">

          <div className="search">

            <Search size={17} />

            <input
              placeholder="Search stocks, concepts, news…"
            />

          </div>


          <div className="top-actions">

            <span className="status-dot"></span>

            <span className="api-status">
              {apiStatus}
            </span>

            <Bell size={19} />

            <div className="avatar">

              {displayName
                .substring(0, 2)
                .toUpperCase()}

            </div>

          </div>

        </header>


        {/* ===================================================
            DASHBOARD CONTENT
        =================================================== */}

        <section className="content">


          {/* PAGE HEADING */}

          <div className="page-heading">

            <div>

              <p className="eyebrow">
                PAPER TRADING
              </p>

              <h1>
                Good morning, {displayName}
              </h1>

              <p className="muted">
                Practice markets with virtual money
                and learn from every decision.
              </p>

            </div>


            <button
              className="primary"
              onClick={() => navigate("/markets")}
            >

              <CircleDollarSign size={17} />

              Explore markets

            </button>

          </div>


          {/* =================================================
              METRICS
          ================================================= */}

          <div className="metrics">

            <Metric
              title="Portfolio value"
              value="₹10,00,000"
              change="+₹12,480"
              positive
            />

            <Metric
              title="Today's P&L"
              value="+₹4,820"
              change="+0.48%"
              positive
            />

            <Metric
              title="Available cash"
              value="₹7,64,200"
              change="76.4% of capital"
            />

            <Metric
              title="Learning progress"
              value="18%"
              change="6 lessons completed"
            />

          </div>


          {/* =================================================
              MAIN GRID
          ================================================= */}

          <div className="grid-main">


            {/* PORTFOLIO PERFORMANCE */}

            <section className="card chart-card">

              <div className="card-head">

                <div>

                  <h2>
                    Portfolio performance
                  </h2>

                  <p>
                    Simulated account · Last 30 days
                  </p>

                </div>


                <select>

                  <option>
                    30D
                  </option>

                  <option>
                    90D
                  </option>

                  <option>
                    1Y
                  </option>

                </select>

              </div>


              <div className="fake-chart">

                <div className="chart-value">
                  ₹10.12L
                </div>

                <Sparkline />

                <div className="axis">

                  <span>
                    1 Sep
                  </span>

                  <span>
                    10 Sep
                  </span>

                  <span>
                    20 Sep
                  </span>

                  <span>
                    Today
                  </span>

                </div>

              </div>

            </section>


            {/* AI INSIGHT */}

            <section className="card ai-card">

              <div className="ai-head">

                <div className="ai-icon">

                  <Bot size={20} />

                </div>

                <div>

                  <h2>
                    AI learning insight
                  </h2>

                  <p>
                    Based on your simulated activity
                  </p>

                </div>

              </div>


              <div className="insight">

                <b>
                  Risk management
                </b>

                <p>
                  Your learning path is ready for
                  the next module: position sizing
                  and risk/reward.
                </p>

                <button
                  className="text-btn"
                  onClick={() => navigate("/learning")}
                >

                  Open lesson

                  <ChevronRight size={15} />

                </button>

              </div>


              <div className="insight">

                <b>
                  Trade review
                </b>

                <p>
                  Once you have enough paper trades,
                  TradeWise AI will explain patterns
                  in your results.
                </p>

              </div>

            </section>

          </div>


          {/* =================================================
              BOTTOM GRID
          ================================================= */}

          <div className="grid-bottom">


            {/* WATCHLIST */}

            <section className="card">

              <div className="card-head">

                <div>

                  <h2>
                    Watchlist
                  </h2>

                  <p>
                    Demo market snapshot
                  </p>

                </div>

                <button
                  className="ghost"
                  onClick={() => navigate("/watchlist")}
                >
                  View all
                </button>

              </div>


              <div className="table">

                {[
                  [
                    "RELIANCE",
                    "Reliance Industries",
                    "₹1,412.80",
                    "+1.24%",
                  ],

                  [
                    "TCS",
                    "Tata Consultancy Services",
                    "₹3,184.40",
                    "-0.42%",
                  ],

                  [
                    "INFY",
                    "Infosys",
                    "₹1,542.10",
                    "+0.86%",
                  ],

                  [
                    "HDFCBANK",
                    "HDFC Bank",
                    "₹1,009.35",
                    "+0.31%",
                  ],

                ].map((row) => (

                  <div
                    className="row"
                    key={row[0]}
                  >

                    <div>

                      <b>
                        {row[0]}
                      </b>

                      <small>
                        {row[1]}
                      </small>

                    </div>

                    <strong>
                      {row[2]}
                    </strong>

                    <span
                      className={
                        row[3].startsWith("+")
                          ? "gain"
                          : "loss"
                      }
                    >
                      {row[3]}
                    </span>

                  </div>

                ))}

              </div>

            </section>


            {/* MARKET NEWS */}

            <section className="card">

              <div className="card-head">

                <div>

                  <h2>
                    Market news
                  </h2>

                  <p>
                    News provider will be connected
                    in Phase 5
                  </p>

                </div>

                <button
                  className="ghost"
                  onClick={() => navigate("/news")}
                >
                  All news
                </button>

              </div>


              <article className="news">

                <span className="tag">
                  MARKETS
                </span>

                <h3>
                  Live company and market news
                  will appear here
                </h3>

                <p>
                  Each article can later be explained
                  by the AI tutor with learning concepts
                  linked to the story.
                </p>

                <small>
                  TradeWise demo
                </small>

              </article>


              <article className="news">

                <span className="tag">
                  LEARNING
                </span>

                <h3>
                  Why news matters to market prices
                </h3>

                <p>
                  Use the learning section to understand
                  how events can affect prices and
                  volatility.
                </p>

                <small>
                  Education module
                </small>

              </article>

            </section>

          </div>


          {/* FOOTER */}

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


/* =========================================================
   METRIC COMPONENT
========================================================= */

function Metric({
  title,
  value,
  change,
  positive,
}) {

  return (

    <div className="metric card">

      <div className="metric-icon">

        <Wallet size={17} />

      </div>

      <p>
        {title}
      </p>

      <h2>
        {value}
      </h2>

      <small
        className={
          positive
            ? "gain"
            : ""
        }
      >
        {change}
      </small>

    </div>

  );
}


/* =========================================================
   FUTURE PAGE PLACEHOLDER
========================================================= */

function PlaceholderPage({
  title,
  description,
}) {

  const navigate = useNavigate();

  return (

    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            T
          </div>

          <div>

            <b>
              TradeWise
            </b>

            <small>
              Learn • Simulate • Grow
            </small>

          </div>

        </div>

        <div className="nav-label">
          WORKSPACE
        </div>

        <nav>

          {nav.map(([name, Icon]) => (

            <button
              key={name}
              className="nav-item"
              onClick={() => {

                const routes = {
                  Dashboard: "/dashboard",
                  Markets: "/markets",
                  Portfolio: "/portfolio",
                  Watchlist: "/watchlist",
                  News: "/news",
                  "AI Tutor": "/ai-tutor",
                  Learning: "/learning",
                };

                navigate(routes[name]);

              }}
            >

              <Icon size={18} />

              <span>
                {name}
              </span>

            </button>

          ))}

        </nav>

        <div className="sidebar-bottom">

          <button
            className="nav-item"
            onClick={() => {
              authService.logout();
              navigate("/login");
            }}
          >

            <LogOut size={18} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      <main className="main">

        <header className="topbar">

          <div className="search">

            <Search size={17} />

            <input
              placeholder="Search stocks, concepts, news…"
            />

          </div>

        </header>


        <section className="content">

          <div className="page-heading">

            <div>

              <p className="eyebrow">
                TRADEWISE
              </p>

              <h1>
                {title}
              </h1>

              <p className="muted">
                {description}
              </p>

            </div>

            <button
              className="primary"
              onClick={() => navigate("/dashboard")}
            >

              <Home size={17} />

              Dashboard

            </button>

          </div>


          <section className="card">

            <div
              style={{
                padding: "50px",
                textAlign: "center",
              }}
            >

              <BarChart3
                size={48}
                style={{
                  marginBottom: "20px",
                }}
              />

              <h2>
                {title}
              </h2>

              <p className="muted">
                {description}
              </p>

            </div>

          </section>

        </section>

      </main>

    </div>

  );
}


export default App;