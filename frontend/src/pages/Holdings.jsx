import { useEffect, useState } from "react";
import axios from "axios";
import {
  RefreshCw,
  Wallet,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Loader2,
  AlertCircle,
} from "lucide-react";

const API = "http://localhost:8081/api";

function Holdings() {
  const [holdings, setHoldings] = useState([]);
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
     LOAD HOLDINGS
  ===================================================== */

  const loadHoldings = async () => {
    try {
      setError("");

      const response = await axios.get(
        `${API}/holdings`,
        config
      );

      setHoldings(response.data || []);
    } catch (err) {
      console.error(
        "Failed to load holdings:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load holdings."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useEffect(() => {
    loadHoldings();
  }, []);


  /* =====================================================
     REFRESH
  ===================================================== */

  const handleRefresh = () => {
    setRefreshing(true);
    loadHoldings();
  };


  /* =====================================================
     FORMAT
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
     TOTALS
  ===================================================== */

  const totalInvested = holdings.reduce(
    (sum, item) =>
      sum + Number(
        item.investedAmount || 0
      ),
    0
  );

  const totalCurrentValue = holdings.reduce(
    (sum, item) =>
      sum + Number(
        item.currentValue || 0
      ),
    0
  );

  const totalPnl = holdings.reduce(
    (sum, item) =>
      sum + Number(
        item.unrealizedPnl || 0
      ),
    0
  );


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loading}>
          <Loader2 size={30} className="holdings-spin" />

          <h2>
            Loading holdings...
          </h2>

          <p>
            Fetching your current positions.
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

      {/* HEADER */}

      <div style={styles.header}>

        <div>
          <p style={styles.eyebrow}>
            PORTFOLIO
          </p>

          <h1 style={styles.title}>
            Holdings
          </h1>

          <p style={styles.subtitle}>
            Track your current paper-trading
            positions and unrealized performance.
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
                ? "holdings-spin"
                : ""
            }
          />

          Refresh
        </button>

      </div>


      {/* ERROR */}

      {error && (
        <div style={styles.error}>
          <AlertCircle size={18} />

          <span>
            {error}
          </span>
        </div>
      )}


      {/* SUMMARY */}

      <div style={styles.summaryGrid}>

        <SummaryCard
          icon={Wallet}
          title="Total Invested"
          value={money(totalInvested)}
        />

        <SummaryCard
          icon={BarChart3}
          title="Current Value"
          value={money(totalCurrentValue)}
        />

        <SummaryCard
          icon={
            totalPnl >= 0
              ? TrendingUp
              : TrendingDown
          }
          title="Unrealized P&L"
          value={money(totalPnl)}
          positive={totalPnl >= 0}
        />

        <SummaryCard
          icon={Wallet}
          title="Positions"
          value={holdings.length}
        />

      </div>


      {/* HOLDINGS TABLE */}

      <section style={styles.card}>

        <div style={styles.cardHeader}>

          <div>
            <h2 style={styles.cardTitle}>
              Your Positions
            </h2>

            <p style={styles.cardSubtitle}>
              Live positions from your paper
              trading account.
            </p>
          </div>

          <span style={styles.badge}>
            {holdings.length}{" "}
            {holdings.length === 1
              ? "Position"
              : "Positions"}
          </span>

        </div>


        {holdings.length === 0 ? (

          <div style={styles.empty}>

            <div style={styles.emptyIcon}>
              <Wallet size={30} />
            </div>

            <h3>
              No holdings yet
            </h3>

            <p>
              Your BUY positions will appear
              here after placing a paper trade.
            </p>

          </div>

        ) : (

          <div style={styles.tableWrapper}>

            <table style={styles.table}>

              <thead>

                <tr>

                  <th>
                    Instrument
                  </th>

                  <th>
                    Quantity
                  </th>

                  <th>
                    Avg. Buy Price
                  </th>

                  <th>
                    Current Price
                  </th>

                  <th>
                    Invested
                  </th>

                  <th>
                    Current Value
                  </th>

                  <th>
                    Unrealized P&L
                  </th>

                </tr>

              </thead>


              <tbody>

                {holdings.map(
                  (holding, index) => {

                    const pnl =
                      Number(
                        holding.unrealizedPnl || 0
                      );

                    return (

                      <tr
                        key={
                          holding.id ||
                          holding.instrumentId ||
                          index
                        }
                      >

                        {/* INSTRUMENT */}

                        <td>

                          <div
                            style={
                              styles.instrument
                            }
                          >

                            <div
                              style={
                                styles.symbolIcon
                              }
                            >
                              {(
                                holding.symbol ||
                                holding.instrument?.symbol ||
                                "T"
                              ).substring(0, 1)}
                            </div>

                            <div>

                              <strong>
                                {
                                  holding.symbol ||
                                  holding.instrument?.symbol ||
                                  "—"
                                }
                              </strong>

                              <small>
                                {
                                  holding.companyName ||
                                  holding.instrument?.companyName ||
                                  ""
                                }
                              </small>

                            </div>

                          </div>

                        </td>


                        {/* QUANTITY */}

                        <td>
                          <strong>
                            {
                              holding.quantity ??
                              0
                            }
                          </strong>
                        </td>


                        {/* AVG PRICE */}

                        <td>
                          {money(
                            holding.averageBuyPrice
                          )}
                        </td>


                        {/* CURRENT PRICE */}

                        <td>
                          {money(
                            holding.currentPrice
                          )}
                        </td>


                        {/* INVESTED */}

                        <td>
                          {money(
                            holding.investedAmount
                          )}
                        </td>


                        {/* CURRENT VALUE */}

                        <td>
                          <strong>
                            {money(
                              holding.currentValue
                            )}
                          </strong>
                        </td>


                        {/* P&L */}

                        <td>

                          <span
                            style={{
                              ...styles.pnl,
                              ...(pnl >= 0
                                ? styles.profit
                                : styles.loss),
                            }}
                          >

                            {pnl >= 0 ? "+" : ""}
                            {money(pnl)}

                          </span>

                        </td>

                      </tr>

                    );
                  }
                )}

              </tbody>

            </table>

          </div>

        )}

      </section>


      {/* INFORMATION */}

      <div style={styles.info}>

        <BarChart3 size={20} />

        <div>

          <strong>
            How holdings work
          </strong>

          <p>
            Your average buy price is calculated
            from your paper BUY orders. Current
            value and unrealized P&L are based on
            the latest available market price.
          </p>

        </div>

      </div>


      <footer style={styles.footer}>
        TradeWise · Paper trading only ·
        No real-money execution.
      </footer>

    </div>
  );
}


/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  icon: Icon,
  title,
  value,
  positive,
}) {

  return (
    <div style={styles.summaryCard}>

      <div style={styles.summaryIcon}>
        <Icon size={18} />
      </div>

      <span style={styles.summaryTitle}>
        {title}
      </span>

      <strong
        style={{
          ...styles.summaryValue,
          ...(positive === true
            ? styles.profit
            : {}),
          ...(positive === false
            ? styles.loss
            : {}),
        }}
      >
        {value}
      </strong>

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

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "16px",
    marginBottom: "18px",
  },

  summaryCard: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "15px",
    padding: "18px",
    boxShadow:
      "0 5px 18px rgba(15, 23, 42, 0.04)",
  },

  summaryIcon: {
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

  summaryTitle: {
    display: "block",
    color: "#718096",
    fontSize: "13px",
    marginBottom: "5px",
  },

  summaryValue: {
    display: "block",
    fontSize: "21px",
    color: "#102a43",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    boxShadow:
      "0 7px 25px rgba(15, 23, 42, 0.045)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
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

  badge: {
    padding: "7px 10px",
    borderRadius: "8px",
    background: "#eef4ff",
    color: "#155eef",
    fontSize: "12px",
    fontWeight: 800,
  },

  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "850px",
  },

  instrument: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  symbolIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "9px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#eaf2ff",
    color: "#155eef",
    fontWeight: 800,
  },

  empty: {
    padding: "55px 20px",
    textAlign: "center",
    color: "#718096",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    margin: "0 auto 15px",
    borderRadius: "15px",
    background: "#eef4ff",
    color: "#155eef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  info: {
    display: "flex",
    gap: "12px",
    marginTop: "18px",
    padding: "16px",
    borderRadius: "13px",
    background: "#eef6ff",
    border: "1px solid #dbeafe",
    color: "#155eef",
  },

  footer: {
    textAlign: "center",
    padding: "25px 0 5px",
    color: "#94a3b8",
    fontSize: "12px",
  },

  pnl: {
    display: "inline-block",
    padding: "6px 9px",
    borderRadius: "7px",
    fontWeight: 800,
    fontSize: "12px",
  },

  profit: {
    color: "#15803d",
    background: "#f0fdf4",
  },

  loss: {
    color: "#dc2626",
    background: "#fef2f2",
  },

};


/* =========================================================
   TABLE STYLES
========================================================= */

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "tradewise-holdings-styles"
  )
) {

  const style = document.createElement("style");

  style.id =
    "tradewise-holdings-styles";

  style.innerHTML = `

    @keyframes holdings-spin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    .holdings-spin {
      animation:
        holdings-spin
        1s linear infinite;
    }

    .tradewise-holdings-table th {
      text-align: left;
      padding: 13px 10px;
      color: #829ab1;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: .5px;
      border-bottom: 1px solid #e8eef5;
    }

    .tradewise-holdings-table td {
      padding: 16px 10px;
      color: #334e68;
      font-size: 13px;
      border-bottom: 1px solid #eef2f7;
    }

  `;

  document.head.appendChild(style);
}


export default Holdings;