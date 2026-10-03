import { useEffect, useState } from "react";

import {
  BarChart3,
  Bell,
  BookOpen,
  Bot,
  BriefcaseBusiness,
  CalendarDays,
  Calculator,
  ChartNoAxesCombined,
  ChevronRight,
  CircleDollarSign,
  Home,
  LogOut,
  NotebookPen,
  Newspaper,
  Search,
  Settings,
  ShieldCheck,
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
import Portfolio from "./pages/Portfolio";
import Orders from "./pages/Orders";
import Journal from "./pages/Journal";
import BuySell from "./pages/BuySell";
import Holdings from "./pages/Holdings";
import RiskManagement from "./pages/RiskManagement";
import TradeAnalytics from "./pages/TradeAnalytics";
import TradingCalendar from "./pages/TradingCalendar";
import DailyNotes from "./pages/DailyNotes";
import authService from "./services/authService";

/* =========================================================
   SIDEBAR NAVIGATION
========================================================= */

const nav = [
  ["Dashboard", Home],
  ["Markets", TrendingUp],
  ["Portfolio", BriefcaseBusiness],
  ["Buy / Sell", CircleDollarSign],
  ["Holdings", Wallet],
  ["Orders", BriefcaseBusiness],
  ["Journal", NotebookPen],
  ["Risk Management", ShieldCheck],
  ["Trade Analytics", ChartNoAxesCombined],
  ["Trading Calendar", CalendarDays],
  ["Daily Notes", NotebookPen],
  ["Watchlist", Star],
  ["News", Newspaper],
  ["AI Tutor", Bot],
  ["Learning", BookOpen],
];

/* =========================================================
   DEMO CHART DATA
========================================================= */

const chart = [
  32, 40, 36, 52, 48, 61,
  57, 68, 64, 77, 73, 84,
];

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
  const location = useLocation();

  /*
   * Keep Journal directly accessible.
   */
  if (
    location.pathname === "/journal" ||
    location.pathname.startsWith("/journal/")
  ) {
    if (!authService.isAuthenticated()) {
      return <Navigate to="/login" replace />;
    }

    return <Journal />;
  }

  return (
    <Routes>

      {/* =====================================================
          PUBLIC ROUTES
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />


      {/* =====================================================
          PROTECTED ROUTES
      ===================================================== */}

      <Route element={<ProtectedRoute />}>

        {/* Dashboard */}

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


        {/* Markets */}

        <Route
          path="/markets"
          element={
            <PlaceholderPage
              title="Markets"
              eyebrow="MARKET DATA"
              description="Market data, stock prices and charts will be connected in Phase 4."
              icon={TrendingUp}
            />
          }
        />


        {/* Portfolio */}

        <Route
          path="/portfolio"
          element={<Portfolio />}
        />


        {/* Buy / Sell */}

     <Route
  path="/buy-sell"
  element={<BuySell />}
/>


        {/* Holdings */}

        <Route
  path="/holdings"
  element={<Holdings />}
/>


        {/* Orders */}

        <Route
          path="/orders"
          element={<Orders />}
        />


        {/* Journal */}

        <Route
          path="/journal/*"
          element={<Journal />}
        />


        {/* Risk Management */}

        <Route
  path="/risk"
  element={<RiskManagement />}
/>

        <Route
  path="/risk-reward"
  element={<RiskManagement />}
/>

        <Route
  path="/position-size"
  element={<RiskManagement />}
/>


        {/* Analytics */}

        <Route
  path="/analytics"
  element={<TradeAnalytics />}
/>


        {/* Trading Calendar */}

        <Route
  path="/calendar"
  element={<TradingCalendar />}
/>
<Route
  path="/daily-notes"
  element={<DailyNotes />}
/>

        {/* Watchlist */}

        <Route
          path="/watchlist"
          element={
            <PlaceholderPage
              title="Watchlist"
              eyebrow="WATCHLIST"
              description="Your saved stocks will appear here."
              icon={Star}
            />
          }
        />


        {/* News */}

        <Route
          path="/news"
          element={
            <PlaceholderPage
              title="Market News"
              eyebrow="FINANCIAL NEWS"
              description="Financial and company news will be connected in Phase 5."
              icon={Newspaper}
            />
          }
        />


        {/* AI Tutor */}

        <Route
          path="/ai-tutor"
          element={
            <PlaceholderPage
              title="AI Tutor"
              eyebrow="ARTIFICIAL INTELLIGENCE"
              description="Your AI-powered financial learning assistant will be added in Phase 6."
              icon={Bot}
            />
          }
        />


        {/* Learning */}

        <Route
          path="/learning"
          element={
            <PlaceholderPage
              title="Learning"
              eyebrow="FINANCIAL EDUCATION"
              description="Courses, lessons and quizzes will be added in Phase 7."
              icon={BookOpen}
            />
          }
        />

      </Route>


      {/* =====================================================
          DEFAULT ROUTES
      ===================================================== */}

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

  const [portfolio, setPortfolio] = useState(null);

  const [portfolioLoading, setPortfolioLoading] = useState(true);

  const user = authService.getUser();

  const displayName =
    user && user.name
      ? user.name
      : "Trader";


  /* =======================================================
     BACKEND HEALTH CHECK
  ======================================================= */

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


  /* =======================================================
     PORTFOLIO DATA
  ======================================================= */

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setPortfolioLoading(false);
      return;
    }

    axios
      .get(
        "http://localhost:8081/api/portfolio",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setPortfolio(response.data);
      })
      .catch((error) => {
        console.error(
          "Failed to load portfolio:",
          error
        );
      })
      .finally(() => {
        setPortfolioLoading(false);
      });

  }, []);


  /* =======================================================
     ACTIVE PAGE
  ======================================================= */

  useEffect(() => {

    const path = location.pathname;

    if (path === "/dashboard") {
      setActive("Dashboard");
    }

    else if (path === "/markets") {
      setActive("Markets");
    }

    else if (path === "/portfolio") {
      setActive("Portfolio");
    }

    else if (
      path === "/trade" ||
      path === "/buy-sell"
    ) {
      setActive("Buy / Sell");
    }

    else if (path === "/holdings") {
      setActive("Holdings");
    }

    else if (path === "/orders") {
      setActive("Orders");
    }

    else if (
      path === "/journal" ||
      path.startsWith("/journal/")
    ) {
      setActive("Journal");
    }

    else if (
      path === "/risk" ||
      path === "/risk-reward" ||
      path === "/position-size"
    ) {
      setActive("Risk Management");
    }

    else if (path === "/analytics") {
      setActive("Trade Analytics");
    }

    else if (path === "/calendar") {
  setActive("Trading Calendar");
}

else if (path === "/daily-notes") {
  setActive("Daily Notes");
}

else if (path === "/watchlist") {
      setActive("Watchlist");
    }

    else if (path === "/news") {
      setActive("News");
    }

    else if (path === "/ai-tutor") {
      setActive("AI Tutor");
    }

    else if (path === "/learning") {
      setActive("Learning");
    }

  }, [location.pathname]);


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleNavigation = (name) => {

    setActive(name);

    const routes = {

      Dashboard: "/dashboard",

      Markets: "/markets",

      Portfolio: "/portfolio",

      "Buy / Sell": "/buy-sell",

      Holdings: "/holdings",

      Orders: "/orders",

      Journal: "/journal",

      "Risk Management": "/risk",

      "Trade Analytics": "/analytics",

     "Trading Calendar": "/calendar",

"Daily Notes": "/daily-notes",

Watchlist: "/watchlist",

      News: "/news",

      "AI Tutor": "/ai-tutor",

      Learning: "/learning",

    };

    if (routes[name]) {
      navigate(routes[name]);
    }

  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    authService.logout();

    navigate("/login", {
      replace: true,
    });

  };


  return (

    <div className="app-shell">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside className="sidebar">


        {/* BRAND */}

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
              onClick={() =>
                handleNavigation(name)
              }
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


          {/* SETTINGS */}

          <button
            className="nav-item"
            onClick={() => {
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


      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="main">


        {/* =================================================
            TOP BAR
        ================================================= */}

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


        {/* =================================================
            DASHBOARD CONTENT
        ================================================= */}

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
              onClick={() =>
                navigate("/markets")
              }
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
              value={
                portfolioLoading
                  ? "Loading..."
                  : portfolio
                    ? `₹${Number(
                        portfolio.portfolioValue
                      ).toLocaleString("en-IN")}`
                    : "—"
              }
              change="Current portfolio value"
              positive
            />


            <Metric
              title="Today's P&L"
              value="₹0"
              change="No trades yet"
              positive
            />


            <Metric
              title="Available cash"
              value={
                portfolioLoading
                  ? "Loading..."
                  : portfolio
                    ? `₹${Number(
                        portfolio.availableCash
                      ).toLocaleString("en-IN")}`
                    : "—"
              }
              change={
                portfolio
                  ? `${(
                      (
                        Number(
                          portfolio.availableCash
                        ) /
                        Number(
                          portfolio.initialCapital
                        )
                      ) * 100
                    ).toFixed(1)}% of capital`
                  : "Current available cash"
              }
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
                  onClick={() =>
                    navigate("/risk")
                  }
                >

                  Open risk management

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
              PHASE 3 QUICK ACTIONS
          ================================================= */}

          <section className="card phase3-card">

            <div className="card-head">

              <div>

                <p className="eyebrow">
                  PHASE 3
                </p>

                <h2>
                  Trading workspace
                </h2>

                <p>
                  Manage paper trades, risk and
                  trading records from one place.
                </p>

              </div>

            </div>


            <div className="quick-actions">

              <QuickAction
                icon={CircleDollarSign}
                title="Buy / Sell"
                description="Place a paper trade"
                onClick={() =>
                  navigate("/buy-sell")
                }
              />

              <QuickAction
                icon={Wallet}
                title="Holdings"
                description="View your positions"
                onClick={() =>
                  navigate("/holdings")
                }
              />

              <QuickAction
                icon={NotebookPen}
                title="Trading Journal"
                description="Record trade decisions"
                onClick={() =>
                  navigate("/journal")
                }
              />

              <QuickAction
                icon={ShieldCheck}
                title="Risk Management"
                description="Plan trade risk"
                onClick={() =>
                  navigate("/risk")
                }
              />

              <QuickAction
                icon={ChartNoAxesCombined}
                title="Trade Analytics"
                description="Analyze performance"
                onClick={() =>
                  navigate("/analytics")
                }
              />

              <QuickAction
                icon={CalendarDays}
                title="Trading Calendar"
                description="Review trading days"
                onClick={() =>
                  navigate("/calendar")
                }
              />

            </div>

          </section>


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
                  onClick={() =>
                    navigate("/watchlist")
                  }
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
                  onClick={() =>
                    navigate("/news")
                  }
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
   QUICK ACTION COMPONENT
========================================================= */

function QuickAction({
  icon: Icon,
  title,
  description,
  onClick,
}) {

  return (

    <button
      className="quick-action"
      onClick={onClick}
    >

      <div className="quick-action-icon">
        <Icon size={19} />
      </div>

      <div className="quick-action-content">

        <b>
          {title}
        </b>

        <span>
          {description}
        </span>

      </div>

      <ChevronRight size={17} />

    </button>

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
   PLACEHOLDER PAGE
========================================================= */

function PlaceholderPage({
  title,
  description,
  eyebrow = "TRADEWISE",
  icon: Icon = BarChart3,
}) {

  const navigate = useNavigate();

  const location = useLocation();

  const [active, setActive] = useState(title);

  const user = authService.getUser();

  const displayName =
    user && user.name
      ? user.name
      : "Trader";


  /* =======================================================
     ACTIVE NAV
  ======================================================= */

  useEffect(() => {

    const path = location.pathname;

    if (path === "/dashboard") {
      setActive("Dashboard");
    }

    else if (path === "/markets") {
      setActive("Markets");
    }

    else if (path === "/portfolio") {
      setActive("Portfolio");
    }

    else if (
      path === "/trade" ||
      path === "/buy-sell"
    ) {
      setActive("Buy / Sell");
    }

    else if (path === "/holdings") {
      setActive("Holdings");
    }

    else if (path === "/orders") {
      setActive("Orders");
    }

    else if (
      path === "/journal" ||
      path.startsWith("/journal/")
    ) {
      setActive("Journal");
    }

    else if (
      path === "/risk" ||
      path === "/risk-reward" ||
      path === "/position-size"
    ) {
      setActive("Risk Management");
    }

    else if (path === "/analytics") {
      setActive("Trade Analytics");
    }

    else if (path === "/calendar") {
  setActive("Trading Calendar");
}

else if (path === "/daily-notes") {
  setActive("Daily Notes");
}

else if (path === "/watchlist") {
      setActive("Watchlist");
    }

    else if (path === "/news") {
      setActive("News");
    }

    else if (path === "/ai-tutor") {
      setActive("AI Tutor");
    }

    else if (path === "/learning") {
      setActive("Learning");
    }

  }, [location.pathname]);


  /* =======================================================
     NAVIGATION
  ======================================================= */

  const handleNavigation = (name) => {

    setActive(name);

    const routes = {

      Dashboard: "/dashboard",

      Markets: "/markets",

      Portfolio: "/portfolio",

      "Buy / Sell": "/buy-sell",

      Holdings: "/holdings",

      Orders: "/orders",

      Journal: "/journal",

      "Risk Management": "/risk",

      "Trade Analytics": "/analytics",

      "Trading Calendar": "/calendar",

"Daily Notes": "/daily-notes",

Watchlist: "/watchlist",

      News: "/news",

      "AI Tutor": "/ai-tutor",

      Learning: "/learning",

    };

    if (routes[name]) {
      navigate(routes[name]);
    }

  };


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {

    authService.logout();

    navigate("/login", {
      replace: true,
    });

  };


  return (

    <div className="app-shell">


      {/* =================================================
          SIDEBAR
      ================================================= */}

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

          {nav.map(([name, NavIcon]) => (

            <button
              key={name}
              className={
                active === name
                  ? "nav-item active"
                  : "nav-item"
              }
              onClick={() =>
                handleNavigation(name)
              }
            >

              <NavIcon size={18} />

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
              setActive("Settings");
            }}
          >

            <Settings size={18} />

            <span>
              Settings
            </span>

          </button>


          <button
            className="nav-item logout-button"
            onClick={handleLogout}
          >

            <LogOut size={18} />

            <span>
              Logout
            </span>

          </button>


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


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="main">


        {/* TOPBAR */}

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
              TradeWise
            </span>

            <Bell size={19} />

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
                {eyebrow}
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
              onClick={() =>
                navigate("/dashboard")
              }
            >

              <Home size={17} />

              Dashboard

            </button>

          </div>


          {/* PAGE CARD */}

          <section className="card">

            <div className="placeholder-content">

              <div className="placeholder-icon">

                <Icon size={42} />

              </div>

              <p className="eyebrow">
                TRADEWISE WORKSPACE
              </p>

              <h2>
                {title}
              </h2>

              <p className="muted">
                {description}
              </p>

              <div className="placeholder-status">

                <span className="status-dot"></span>

                Backend API available

              </div>

            </div>

          </section>


          {/* PHASE 3 INFORMATION */}

          <section className="card">

            <div className="card-head">

              <div>

                <h2>
                  Phase 3 Trading Platform
                </h2>

                <p>
                  The backend functionality is
                  already connected progressively.
                </p>

              </div>

            </div>


            <div className="feature-grid">

              <div className="feature-box">

                <b>
                  Paper Trading
                </b>

                <span>
                  BUY / SELL orders using virtual
                  capital.
                </span>

              </div>


              <div className="feature-box">

                <b>
                  Risk Management
                </b>

                <span>
                  Stop loss, target, risk/reward
                  and position sizing.
                </span>

              </div>


              <div className="feature-box">

                <b>
                  Trading Journal
                </b>

                <span>
                  Record reasons, strategies,
                  notes and screenshots.
                </span>

              </div>


              <div className="feature-box">

                <b>
                  Analytics
                </b>

                <span>
                  Review trades, P&L and
                  trading-calendar data.
                </span>

              </div>

            </div>

          </section>


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


export default App;