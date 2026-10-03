import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Activity,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API = "http://localhost:8081/api";

function TradeAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  /* =====================================================
     LOAD ANALYTICS
  ===================================================== */

  const loadAnalytics = async () => {
    try {
      setError("");

      const response = await axios.get(
        `${API}/analytics`,
        config
      );

      setAnalytics(response.data);
    } catch (err) {
      console.error(
        "Failed to load analytics:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load trade analytics."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = () => {
    setRefreshing(true);
    loadAnalytics();
  };

  /* =====================================================
     FORMAT CURRENCY
  ===================================================== */

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  /* =====================================================
     VALUES
  ===================================================== */

  const totalOrders =
    Number(analytics?.totalOrders || 0);

  const buyOrders =
    Number(analytics?.buyOrders || 0);

  const sellOrders =
    Number(analytics?.sellOrders || 0);

  const totalBuyValue =
    Number(analytics?.totalBuyValue || 0);

  const totalSellValue =
    Number(analytics?.totalSellValue || 0);

  const realizedPnl =
    Number(analytics?.realizedPnl || 0);

  const buyPercentage =
    totalOrders > 0
      ? (buyOrders / totalOrders) * 100
      : 0;

  const sellPercentage =
    totalOrders > 0
      ? (sellOrders / totalOrders) * 100
      : 0;

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>
          <Loader2
            size={30}
            className="analytics-spin"
          />

          <h2>
            Loading trade analytics...
          </h2>

          <p>
            Analyzing your paper trades.
          </p>
        </div>
      </div>
    );
  }

  /* =====================================================
     PAGE
  ===================================================== */

  return (
    <div style={styles.page}>

      {/* =================================================
          HEADER
      ================================================= */}

      <div style={styles.header}>

        <div>
          <p style={styles.eyebrow}>
            PERFORMANCE
          </p>

          <h1 style={styles.title}>
            Trade Analytics
          </h1>

          <p style={styles.subtitle}>
            Understand your trading activity,
            realized P&L and order distribution.
          </p>
        </div>

        <button
          style={styles.refresh}
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "analytics-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div style={styles.error}>
          <AlertCircle size={18} />

          <span>
            {error}
          </span>
        </div>
      )}


      {/* =================================================
          MAIN METRICS
      ================================================= */}

      <div style={styles.metricsGrid}>

        <MetricCard
          icon={Activity}
          title="Total Trades"
          value={totalOrders}
          description="All executed orders"
        />

        <MetricCard
          icon={ArrowUpRight}
          title="BUY Orders"
          value={buyOrders}
          description={`${buyPercentage.toFixed(1)}% of orders`}
          positive
        />

        <MetricCard
          icon={ArrowDownRight}
          title="SELL Orders"
          value={sellOrders}
          description={`${sellPercentage.toFixed(1)}% of orders`}
        />

        <MetricCard
          icon={
            realizedPnl >= 0
              ? TrendingUp
              : TrendingDown
          }
          title="Realized P&L"
          value={money(realizedPnl)}
          description={
            realizedPnl >= 0
              ? "Realized trading profit"
              : "Realized trading loss"
          }
          positive={realizedPnl >= 0}
          negative={realizedPnl < 0}
        />

      </div>


      {/* =================================================
          ANALYTICS GRID
      ================================================= */}

      <div style={styles.mainGrid}>


        {/* ORDER DISTRIBUTION */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                Order Distribution
              </h2>

              <p style={styles.cardSubtitle}>
                Breakdown of your executed orders.
              </p>
            </div>

            <div style={styles.cardIcon}>
              <BarChart3 size={19} />
            </div>

          </div>


          <div style={styles.distribution}>

            <DistributionRow
              label="BUY Orders"
              value={buyOrders}
              percentage={buyPercentage}
              type="buy"
            />

            <DistributionRow
              label="SELL Orders"
              value={sellOrders}
              percentage={sellPercentage}
              type="sell"
            />

          </div>


          <div style={styles.totalBox}>

            <div>
              <span>
                Total Orders
              </span>

              <strong>
                {totalOrders}
              </strong>
            </div>

            <Activity size={22} />

          </div>

        </section>


        {/* TRADE VALUE */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                Trading Value
              </h2>

              <p style={styles.cardSubtitle}>
                Total value of executed BUY
                and SELL orders.
              </p>
            </div>

            <div style={styles.cardIcon}>
              <Wallet size={19} />
            </div>

          </div>


          <ValueRow
            label="Total BUY Value"
            value={money(totalBuyValue)}
            icon={ArrowUpRight}
            positive
          />

          <ValueRow
            label="Total SELL Value"
            value={money(totalSellValue)}
            icon={ArrowDownRight}
          />


          <div style={styles.divider} />


          <div style={styles.netValue}>

            <div>
              <span>
                Net Trading Value
              </span>

              <strong>
                {money(
                  totalBuyValue -
                  totalSellValue
                )}
              </strong>
            </div>

            <BarChart3 size={22} />

          </div>

        </section>

      </div>


      {/* =================================================
          REALIZED P&L
      ================================================= */}

      <section style={styles.pnlCard}>

        <div style={styles.pnlHeader}>

          <div>

            <p style={styles.eyebrow}>
              REALIZED PERFORMANCE
            </p>

            <h2>
              Realized P&L
            </h2>

            <p>
              Profit or loss from completed
              SELL transactions based on the
              average-cost calculation.
            </p>

          </div>

          <div
            style={{
              ...styles.pnlIcon,
              ...(realizedPnl >= 0
                ? styles.pnlPositive
                : styles.pnlNegative),
            }}
          >
            {realizedPnl >= 0 ? (
              <TrendingUp size={28} />
            ) : (
              <TrendingDown size={28} />
            )}
          </div>

        </div>


        <div
          style={{
            ...styles.pnlValue,
            color:
              realizedPnl >= 0
                ? "#15803d"
                : "#dc2626",
          }}
        >
          {realizedPnl >= 0
            ? "+"
            : ""}
          {money(realizedPnl)}
        </div>


        <div style={styles.pnlDescription}>

          <span>
            {realizedPnl === 0
              ? "No realized profit or loss yet."
              : realizedPnl > 0
                ? "Your completed trades have generated a realized profit."
                : "Your completed trades have generated a realized loss."}
          </span>

        </div>

      </section>


      {/* =================================================
          TRADING INSIGHTS
      ================================================= */}

      <section style={styles.card}>

        <div style={styles.cardHeader}>

          <div>
            <h2 style={styles.cardTitle}>
              Trading Activity
            </h2>

            <p style={styles.cardSubtitle}>
              A quick overview of your current
              paper-trading activity.
            </p>
          </div>

        </div>


        <div style={styles.insightGrid}>

          <Insight
            icon={Activity}
            title="Orders Executed"
            value={totalOrders}
            text={
              totalOrders === 0
                ? "No trades executed yet."
                : "Orders successfully recorded in your paper account."
            }
          />

          <Insight
            icon={TrendingUp}
            title="BUY Activity"
            value={buyOrders}
            text={
              buyOrders === 0
                ? "No BUY orders yet."
                : `${buyOrders} BUY order${buyOrders === 1 ? "" : "s"} recorded.`
            }
          />

          <Insight
            icon={TrendingDown}
            title="SELL Activity"
            value={sellOrders}
            text={
              sellOrders === 0
                ? "No SELL orders yet."
                : `${sellOrders} SELL order${sellOrders === 1 ? "" : "s"} recorded.`
            }
          />

          <Insight
            icon={BarChart3}
            title="Realized Result"
            value={money(realizedPnl)}
            text={
              realizedPnl === 0
                ? "Current realized P&L is neutral."
                : realizedPnl > 0
                  ? "Current realized P&L is positive."
                  : "Current realized P&L is negative."
            }
          />

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer style={styles.footer}>
        TradeWise · Analytics for paper trading ·
        No real-money execution.
      </footer>

    </div>
  );
}


/* =========================================================
   METRIC CARD
========================================================= */

function MetricCard({
  icon: Icon,
  title,
  value,
  description,
  positive,
  negative,
}) {

  return (
    <div style={styles.metricCard}>

      <div style={styles.metricIcon}>
        <Icon size={18} />
      </div>

      <span style={styles.metricTitle}>
        {title}
      </span>

      <strong
        style={{
          ...styles.metricValue,
          ...(positive
            ? styles.positiveText
            : {}),
          ...(negative
            ? styles.negativeText
            : {}),
        }}
      >
        {value}
      </strong>

      <small style={styles.metricDescription}>
        {description}
      </small>

    </div>
  );
}


/* =========================================================
   DISTRIBUTION ROW
========================================================= */

function DistributionRow({
  label,
  value,
  percentage,
  type,
}) {

  return (
    <div style={styles.distributionRow}>

      <div style={styles.distributionTop}>

        <div style={styles.distributionLabel}>

          <span
            style={{
              ...styles.dot,
              background:
                type === "buy"
                  ? "#16a34a"
                  : "#dc2626",
            }}
          />

          {label}

        </div>

        <strong>
          {value}
        </strong>

      </div>


      <div style={styles.progressBackground}>

        <div
          style={{
            ...styles.progressBar,
            width: `${percentage}%`,
            background:
              type === "buy"
                ? "#16a34a"
                : "#dc2626",
          }}
        />

      </div>


      <small style={styles.percentage}>
        {percentage.toFixed(1)}%
      </small>

    </div>
  );
}


/* =========================================================
   VALUE ROW
========================================================= */

function ValueRow({
  label,
  value,
  icon: Icon,
  positive,
}) {

  return (
    <div style={styles.valueRow}>

      <div style={styles.valueLeft}>

        <div
          style={{
            ...styles.valueIcon,
            color: positive
              ? "#15803d"
              : "#dc2626",
            background: positive
              ? "#f0fdf4"
              : "#fef2f2",
          }}
        >
          <Icon size={17} />
        </div>

        <span>
          {label}
        </span>

      </div>

      <strong>
        {value}
      </strong>

    </div>
  );
}


/* =========================================================
   INSIGHT
========================================================= */

function Insight({
  icon: Icon,
  title,
  value,
  text,
}) {

  return (
    <div style={styles.insight}>

      <div style={styles.insightIcon}>
        <Icon size={18} />
      </div>

      <span style={styles.insightTitle}>
        {title}
      </span>

      <strong style={styles.insightValue}>
        {value}
      </strong>

      <p>
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   STYLES
========================================================= */

const styles = {

  page: {
    minHeight: "100%",
    padding: "34px",
    background: "#f5f8fc",
    color: "#14213d",
    boxSizing: "border-box",
  },

  loading: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#718096",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginBottom: "26px",
  },

  eyebrow: {
    margin: 0,
    color: "#155eef",
    fontSize: "12px",
    fontWeight: 800,
    letterSpacing: "1.3px",
  },

  title: {
    margin: "7px 0 6px",
    fontSize: "34px",
    fontWeight: 800,
    color: "#102a43",
  },

  subtitle: {
    margin: 0,
    color: "#718096",
    fontSize: "15px",
  },

  refresh: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 16px",
    borderRadius: "10px",
    border: "1px solid #d9e2ec",
    background: "#ffffff",
    color: "#334e68",
    fontWeight: 700,
    cursor: "pointer",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "13px 15px",
    marginBottom: "18px",
    borderRadius: "11px",
    border: "1px solid #fecaca",
    background: "#fef2f2",
    color: "#b91c1c",
    fontWeight: 600,
    fontSize: "13px",
  },

  metricsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "18px",
  },

  metricCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "15px",
    padding: "18px",
    boxShadow:
      "0 5px 18px rgba(15,23,42,.04)",
  },

  metricIcon: {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    background: "#eaf2ff",
    color: "#155eef",
    marginBottom: "12px",
  },

  metricTitle: {
    display: "block",
    color: "#718096",
    fontSize: "13px",
    marginBottom: "5px",
  },

  metricValue: {
    display: "block",
    color: "#102a43",
    fontSize: "23px",
  },

  metricDescription: {
    display: "block",
    marginTop: "6px",
    color: "#94a3b8",
    fontSize: "11px",
  },

  positiveText: {
    color: "#15803d",
  },

  negativeText: {
    color: "#dc2626",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "18px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    boxShadow:
      "0 7px 25px rgba(15,23,42,.045)",
    marginBottom: "18px",
  },

  cardHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "22px",
  },

  cardTitle: {
    margin: 0,
    fontSize: "20px",
    color: "#102a43",
  },

  cardSubtitle: {
    margin: "5px 0 0",
    color: "#829ab1",
    fontSize: "13px",
  },

  cardIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#eaf2ff",
    color: "#155eef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  distribution: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },

  distributionRow: {
    width: "100%",
  },

  distributionTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "9px",
  },

  distributionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#52606d",
    fontSize: "13px",
    fontWeight: 700,
  },

  dot: {
    width: "9px",
    height: "9px",
    borderRadius: "50%",
  },

  progressBackground: {
    width: "100%",
    height: "9px",
    background: "#edf2f7",
    borderRadius: "20px",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    borderRadius: "20px",
    transition: "width .4s ease",
  },

  percentage: {
    display: "block",
    marginTop: "6px",
    color: "#94a3b8",
    fontSize: "11px",
    textAlign: "right",
  },

  totalBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "25px",
    padding: "14px",
    borderRadius: "11px",
    background: "#f8fafc",
    color: "#155eef",
  },

  totalBoxSpan: {
    display: "block",
  },

  valueRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #eef2f7",
  },

  valueLeft: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "#52606d",
    fontSize: "13px",
    fontWeight: 600,
  },

  valueIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  divider: {
    height: "1px",
    background: "#e8eef5",
    margin: "18px 0",
  },

  netValue: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "15px",
    borderRadius: "11px",
    background: "#eef6ff",
    color: "#155eef",
  },

  netValueSpan: {
    display: "block",
  },

  pnlCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "26px",
    marginBottom: "18px",
    boxShadow:
      "0 7px 25px rgba(15,23,42,.045)",
  },

  pnlHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },

  pnlHeaderH2: {
    margin: "5px 0",
    fontSize: "22px",
    color: "#102a43",
  },

  pnlHeaderP: {
    margin: 0,
    color: "#718096",
    fontSize: "13px",
    maxWidth: "700px",
  },

  pnlIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  pnlPositive: {
    background: "#f0fdf4",
    color: "#15803d",
  },

  pnlNegative: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  pnlValue: {
    fontSize: "38px",
    fontWeight: 800,
    marginTop: "22px",
  },

  pnlDescription: {
    marginTop: "8px",
    color: "#718096",
    fontSize: "13px",
  },

  insightGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "14px",
  },

  insight: {
    padding: "17px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "#f8fafc",
  },

  insightIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "9px",
    background: "#eaf2ff",
    color: "#155eef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "11px",
  },

  insightTitle: {
    display: "block",
    color: "#718096",
    fontSize: "12px",
  },

  insightValue: {
    display: "block",
    color: "#102a43",
    fontSize: "20px",
    marginTop: "4px",
  },

  "insight p": {
    margin: "7px 0 0",
    color: "#829ab1",
    fontSize: "11px",
    lineHeight: 1.5,
  },

  footer: {
    textAlign: "center",
    padding: "25px 0 5px",
    color: "#94a3b8",
    fontSize: "12px",
  },

};


/* =========================================================
   RESPONSIVE / ANIMATION
========================================================= */

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "tradewise-analytics-styles"
  )
) {
  const style =
    document.createElement("style");

  style.id =
    "tradewise-analytics-styles";

  style.innerHTML = `

    @keyframes analytics-spin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    .analytics-spin {
      animation:
        analytics-spin
        1s linear infinite;
    }

    @media (max-width: 1000px) {
      .tradewise-analytics-grid {
        grid-template-columns: 1fr !important;
      }
    }

    @media (max-width: 700px) {
      .tradewise-analytics-metrics {
        grid-template-columns: 1fr 1fr !important;
      }
    }

  `;

  document.head.appendChild(style);
}


export default TradeAnalytics;