import { useState } from "react";
import axios from "axios";
import {
  ShieldCheck,
  Calculator,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

const API = "http://localhost:8081/api";
const token = localStorage.getItem("token");

const authConfig = {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
};

function RiskManagement() {
  const [activeTab, setActiveTab] =
    useState("risk-reward");

  /* =====================================================
     RISK / REWARD STATE
  ===================================================== */

  const [entryPrice, setEntryPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [riskResult, setRiskResult] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);
  const [riskError, setRiskError] = useState("");


  /* =====================================================
     POSITION SIZE STATE
  ===================================================== */

  const [capital, setCapital] = useState("");
  const [riskPercentage, setRiskPercentage] =
    useState("2");
  const [positionEntry, setPositionEntry] =
    useState("");
  const [positionStopLoss, setPositionStopLoss] =
    useState("");

  const [positionResult, setPositionResult] =
    useState(null);

  const [positionLoading, setPositionLoading] =
    useState(false);

  const [positionError, setPositionError] =
    useState("");


  /* =====================================================
     FORMAT MONEY
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
     RISK / REWARD CALCULATOR
  ===================================================== */

  const calculateRiskReward = async () => {

    setRiskError("");
    setRiskResult(null);

    if (
      !entryPrice ||
      !stopLoss ||
      !targetPrice ||
      !quantity
    ) {
      setRiskError(
        "Please fill in all fields."
      );
      return;
    }

    if (
      Number(entryPrice) <= 0 ||
      Number(stopLoss) <= 0 ||
      Number(targetPrice) <= 0 ||
      Number(quantity) <= 0
    ) {
      setRiskError(
        "All values must be greater than zero."
      );
      return;
    }

    if (
      Number(stopLoss) >=
      Number(entryPrice)
    ) {
      setRiskError(
        "Stop loss must be below the entry price."
      );
      return;
    }

    if (
      Number(targetPrice) <=
      Number(entryPrice)
    ) {
      setRiskError(
        "Target price must be above the entry price."
      );
      return;
    }

    try {

      setRiskLoading(true);

      const response =
  await axios.post(
    `${API}/risk/calculate`,
    {
      entryPrice:
        Number(entryPrice),

      stopLoss:
        Number(stopLoss),

      targetPrice:
        Number(targetPrice),

      quantity:
        Number(quantity),
    },
    authConfig
  );

      setRiskResult(
        response.data
      );

    } catch (error) {

      console.error(
        "Risk calculation failed:",
        error
      );

      setRiskError(
        error?.response?.data?.message ||
        "Unable to calculate risk/reward."
      );

    } finally {

      setRiskLoading(false);

    }
  };


  /* =====================================================
     POSITION SIZE CALCULATOR
  ===================================================== */

  const calculatePositionSize = async () => {

    setPositionError("");
    setPositionResult(null);

    if (
      !capital ||
      !riskPercentage ||
      !positionEntry ||
      !positionStopLoss
    ) {
      setPositionError(
        "Please fill in all fields."
      );
      return;
    }

    if (
      Number(capital) <= 0 ||
      Number(riskPercentage) <= 0 ||
      Number(positionEntry) <= 0 ||
      Number(positionStopLoss) <= 0
    ) {
      setPositionError(
        "All values must be greater than zero."
      );
      return;
    }

    if (
      Number(positionStopLoss) >=
      Number(positionEntry)
    ) {
      setPositionError(
        "Stop loss must be below the entry price."
      );
      return;
    }

    try {

      setPositionLoading(true);

      const response =
  await axios.post(
    `${API}/risk/position-size/calculate`,
    {
      capital:
        Number(capital),

      riskPercentage:
        Number(riskPercentage),

      entryPrice:
        Number(positionEntry),

      stopLoss:
        Number(positionStopLoss),
    },
    authConfig
  );

      setPositionResult(
        response.data
      );

    } catch (error) {

      console.error(
        "Position size calculation failed:",
        error
      );

      setPositionError(
        error?.response?.data?.message ||
        "Unable to calculate position size."
      );

    } finally {

      setPositionLoading(false);

    }
  };


  /* =====================================================
     RISK / REWARD RATIO LABEL
  ===================================================== */

  const getRatioLabel = () => {

    if (!riskResult) {
      return "";
    }

    const ratio =
      Number(
        riskResult.riskRewardRatio
      );

    if (ratio >= 3) {
      return "3:1 or better";
    }

    if (ratio >= 2) {
      return "2:1 or better";
    }

    if (ratio >= 1) {
      return "1:1 or better";
    }

    return "Below 1:1";
  };


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
            RISK MANAGEMENT
          </p>

          <h1 style={styles.title}>
            Plan Your Trade
          </h1>

          <p style={styles.subtitle}>
            Calculate risk, reward and position
            size before entering a paper trade.
          </p>

        </div>

        <div style={styles.headerIcon}>
          <ShieldCheck size={28} />
        </div>

      </div>


      {/* =================================================
          TABS
      ================================================= */}

      <div style={styles.tabs}>

        <button
          style={{
            ...styles.tab,
            ...(activeTab === "risk-reward"
              ? styles.activeTab
              : {}),
          }}
          onClick={() =>
            setActiveTab("risk-reward")
          }
        >

          <Target size={17} />

          Risk / Reward

        </button>


        <button
          style={{
            ...styles.tab,
            ...(activeTab === "position-size"
              ? styles.activeTab
              : {}),
          }}
          onClick={() =>
            setActiveTab("position-size")
          }
        >

          <Calculator size={17} />

          Position Size

        </button>


        <button
          style={{
            ...styles.tab,
            ...(activeTab === "planning"
              ? styles.activeTab
              : {}),
          }}
          onClick={() =>
            setActiveTab("planning")
          }
        >

          <ShieldCheck size={17} />

          Trade Planning

        </button>

      </div>


      {/* =================================================
          RISK / REWARD
      ================================================= */}

      {activeTab === "risk-reward" && (

        <div style={styles.mainGrid}>

          {/* CALCULATOR */}

          <section style={styles.card}>

            <div style={styles.cardHeader}>

              <div>

                <h2 style={styles.cardTitle}>
                  Risk / Reward Calculator
                </h2>

                <p style={styles.cardSubtitle}>
                  Calculate potential profit and
                  loss before entering a trade.
                </p>

              </div>

              <div style={styles.smallIcon}>
                <Target size={19} />
              </div>

            </div>


            <Field
              label="Entry Price"
              value={entryPrice}
              setValue={setEntryPrice}
              placeholder="Example: 3184.40"
            />

            <Field
              label="Stop Loss"
              value={stopLoss}
              setValue={setStopLoss}
              placeholder="Example: 3100"
            />

            <Field
              label="Target Price"
              value={targetPrice}
              setValue={setTargetPrice}
              placeholder="Example: 3350"
            />

            <Field
              label="Quantity"
              value={quantity}
              setValue={setQuantity}
              placeholder="Example: 10"
            />


            {riskError && (
              <ErrorBox
                message={riskError}
              />
            )}


            <button
              style={styles.primaryButton}
              onClick={
                calculateRiskReward
              }
              disabled={riskLoading}
            >

              {riskLoading ? (

                <>
                  <Loader2
                    size={18}
                    className="risk-spin"
                  />

                  Calculating...

                </>

              ) : (

                <>
                  <Calculator size={18} />

                  Calculate Risk / Reward
                </>

              )}

            </button>

          </section>


          {/* RESULT */}

          <section style={styles.card}>

            <div style={styles.cardHeader}>

              <div>

                <h2 style={styles.cardTitle}>
                  Trade Analysis
                </h2>

                <p style={styles.cardSubtitle}>
                  Your calculated trade metrics.
                </p>

              </div>

            </div>


            {!riskResult ? (

              <EmptyResult
                icon={Target}
                title="No calculation yet"
                description="Enter your trade values and calculate the risk/reward."
              />

            ) : (

              <>

                <div style={styles.ratioCard}>

                  <span>
                    Risk / Reward Ratio
                  </span>

                  <strong>
                    {riskResult.riskRewardRatio}
                    :1
                  </strong>

                  <small>
                    {getRatioLabel()}
                  </small>

                </div>


                <ResultRow
                  label="Entry Price"
                  value={money(
                    riskResult.entryPrice
                  )}
                />

                <ResultRow
                  label="Stop Loss"
                  value={money(
                    riskResult.stopLoss
                  )}
                  danger
                />

                <ResultRow
                  label="Target Price"
                  value={money(
                    riskResult.targetPrice
                  )}
                  success
                />

                <ResultRow
                  label="Quantity"
                  value={
                    riskResult.quantity
                  }
                />

                <div style={styles.divider} />


                <ResultRow
                  label="Risk Per Share"
                  value={money(
                    riskResult.riskPerShare
                  )}
                  danger
                />

                <ResultRow
                  label="Reward Per Share"
                  value={money(
                    riskResult.rewardPerShare
                  )}
                  success
                />

                <ResultRow
                  label="Total Risk"
                  value={money(
                    riskResult.totalRisk
                  )}
                  danger
                  strong
                />

                <ResultRow
                  label="Total Reward"
                  value={money(
                    riskResult.totalReward
                  )}
                  success
                  strong
                />

              </>

            )}

          </section>

        </div>

      )}


      {/* =================================================
          POSITION SIZE
      ================================================= */}

      {activeTab === "position-size" && (

        <div style={styles.mainGrid}>

          {/* CALCULATOR */}

          <section style={styles.card}>

            <div style={styles.cardHeader}>

              <div>

                <h2 style={styles.cardTitle}>
                  Position Size Calculator
                </h2>

                <p style={styles.cardSubtitle}>
                  Determine quantity based on
                  your maximum acceptable risk.
                </p>

              </div>

              <div style={styles.smallIcon}>
                <Calculator size={19} />
              </div>

            </div>


            <Field
              label="Trading Capital"
              value={capital}
              setValue={setCapital}
              placeholder="Example: 100000"
            />

            <Field
              label="Risk Percentage"
              value={riskPercentage}
              setValue={setRiskPercentage}
              placeholder="Example: 2"
            />


            <Field
              label="Entry Price"
              value={positionEntry}
              setValue={setPositionEntry}
              placeholder="Example: 500"
            />


            <Field
              label="Stop Loss"
              value={positionStopLoss}
              setValue={setPositionStopLoss}
              placeholder="Example: 480"
            />


            {positionError && (
              <ErrorBox
                message={
                  positionError
                }
              />
            )}


            <button
              style={styles.primaryButton}
              onClick={
                calculatePositionSize
              }
              disabled={
                positionLoading
              }
            >

              {positionLoading ? (

                <>
                  <Loader2
                    size={18}
                    className="risk-spin"
                  />

                  Calculating...

                </>

              ) : (

                <>
                  <Calculator size={18} />

                  Calculate Position Size

                </>

              )}

            </button>

          </section>


          {/* RESULT */}

          <section style={styles.card}>

            <div style={styles.cardHeader}>

              <div>

                <h2 style={styles.cardTitle}>
                  Position Analysis
                </h2>

                <p style={styles.cardSubtitle}>
                  Maximum quantity based on your
                  selected risk.
                </p>

              </div>

            </div>


            {!positionResult ? (

              <EmptyResult
                icon={Calculator}
                title="No calculation yet"
                description="Enter your capital and risk parameters to calculate position size."
              />

            ) : (

              <>

                <div style={styles.quantityCard}>

                  <span>
                    Recommended Quantity
                  </span>

                  <strong>
                    {positionResult.quantity}
                  </strong>

                  <small>
                    shares
                  </small>

                </div>


                <ResultRow
                  label="Trading Capital"
                  value={money(capital)}
                />

                <ResultRow
                  label="Risk Percentage"
                  value={`${riskPercentage}%`}
                />

                <ResultRow
                  label="Maximum Risk"
                  value={money(
                    positionResult.maximumRiskAmount
                  )}
                  danger
                  strong
                />

                <ResultRow
                  label="Entry Price"
                  value={money(
                    positionEntry
                  )}
                />

                <ResultRow
                  label="Stop Loss"
                  value={money(
                    positionStopLoss
                  )}
                  danger
                />

                <ResultRow
                  label="Risk Per Share"
                  value={money(
                    positionResult.riskPerShare
                  )}
                  danger
                />

              </>

            )}

          </section>

        </div>

      )}


      {/* =================================================
          TRADE PLANNING
      ================================================= */}

      {activeTab === "planning" && (

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>

              <h2 style={styles.cardTitle}>
                Trade Planning
              </h2>

              <p style={styles.cardSubtitle}>
                A simple checklist before placing
                a paper trade.
              </p>

            </div>

          </div>


          <div style={styles.planningGrid}>

            <PlanningCard
              icon={Target}
              title="Define Entry"
              description="Know exactly where your planned trade entry occurs."
            />

            <PlanningCard
              icon={AlertTriangle}
              title="Set Stop Loss"
              description="Define the maximum loss you are willing to accept."
            />

            <PlanningCard
              icon={TrendingUp}
              title="Set Target"
              description="Define a realistic profit objective before entering."
            />

            <PlanningCard
              icon={Calculator}
              title="Calculate Position"
              description="Use your risk percentage to determine quantity."
            />

            <PlanningCard
              icon={ShieldCheck}
              title="Check Risk / Reward"
              description="Understand the potential downside versus upside."
            />

            <PlanningCard
              icon={CheckCircle2}
              title="Record the Trade"
              description="Add the reason and strategy to your trading journal."
            />

          </div>

        </section>

      )}


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer style={styles.footer}>
        TradeWise · Risk management for paper trading
        · No real-money execution.
      </footer>

    </div>
  );
}


/* =========================================================
   FIELD
========================================================= */

function Field({
  label,
  value,
  setValue,
  placeholder,
}) {

  return (

    <div style={styles.field}>

      <label style={styles.label}>
        {label}
      </label>

      <input
        type="number"
        min="0"
        step="0.01"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          setValue(
            event.target.value
          )
        }
        style={styles.input}
      />

    </div>
  );
}


/* =========================================================
   RESULT ROW
========================================================= */

function ResultRow({
  label,
  value,
  danger,
  success,
  strong,
}) {

  return (

    <div style={styles.resultRow}>

      <span style={styles.resultLabel}>
        {label}
      </span>

      <strong
        style={{
          ...styles.resultValue,

          ...(danger
            ? styles.danger
            : {}),

          ...(success
            ? styles.successText
            : {}),

          ...(strong
            ? styles.strongValue
            : {}),
        }}
      >
        {value}
      </strong>

    </div>
  );
}


/* =========================================================
   ERROR BOX
========================================================= */

function ErrorBox({
  message,
}) {

  return (

    <div style={styles.error}>

      <AlertTriangle size={17} />

      <span>
        {message}
      </span>

    </div>
  );
}


/* =========================================================
   EMPTY RESULT
========================================================= */

function EmptyResult({
  icon: Icon,
  title,
  description,
}) {

  return (

    <div style={styles.empty}>

      <div style={styles.emptyIcon}>
        <Icon size={29} />
      </div>

      <h3>
        {title}
      </h3>

      <p>
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   PLANNING CARD
========================================================= */

function PlanningCard({
  icon: Icon,
  title,
  description,
}) {

  return (

    <div style={styles.planningCard}>

      <div style={styles.planningIcon}>
        <Icon size={20} />
      </div>

      <div>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

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

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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

  headerIcon: {
    width: "56px",
    height: "56px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "#eaf2ff",
    color: "#155eef",
  },

  tabs: {
    display: "flex",
    gap: "8px",
    padding: "6px",
    background: "#e9eef5",
    borderRadius: "13px",
    marginBottom: "20px",
    width: "fit-content",
  },

  tab: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "none",
    borderRadius: "9px",
    padding: "11px 16px",
    background: "transparent",
    color: "#52606d",
    fontWeight: 700,
    cursor: "pointer",
  },

  activeTab: {
    background: "#ffffff",
    color: "#155eef",
    boxShadow:
      "0 2px 8px rgba(15,23,42,.08)",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1fr) minmax(0, 1fr)",
    gap: "18px",
  },

  card: {
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px",
    boxShadow:
      "0 7px 25px rgba(15,23,42,.045)",
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

  smallIcon: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#eaf2ff",
    color: "#155eef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  field: {
    marginBottom: "16px",
  },

  label: {
    display: "block",
    marginBottom: "7px",
    color: "#334e68",
    fontSize: "13px",
    fontWeight: 700,
  },

  input: {
    width: "100%",
    height: "48px",
    boxSizing: "border-box",
    border: "1px solid #d9e2ec",
    borderRadius: "10px",
    padding: "0 13px",
    color: "#243b53",
    background: "#ffffff",
    fontSize: "14px",
    outline: "none",
  },

  primaryButton: {
    width: "100%",
    height: "50px",
    marginTop: "8px",
    border: "none",
    borderRadius: "10px",
    background: "#155eef",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 800,
    cursor: "pointer",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 13px",
    borderRadius: "9px",
    marginBottom: "15px",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    color: "#b91c1c",
    fontSize: "13px",
    fontWeight: 600,
  },

  empty: {
    minHeight: "350px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#718096",
  },

  emptyIcon: {
    width: "58px",
    height: "58px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "15px",
    background: "#eef4ff",
    color: "#155eef",
    marginBottom: "14px",
  },

  ratioCard: {
    padding: "22px",
    borderRadius: "13px",
    background: "#eef6ff",
    border: "1px solid #dbeafe",
    textAlign: "center",
    marginBottom: "18px",
  },

  ratioCardSpan: {
    display: "block",
  },

  quantityCard: {
    padding: "22px",
    borderRadius: "13px",
    background: "#f0fdf4",
    border: "1px solid #bbf7d0",
    textAlign: "center",
    marginBottom: "18px",
  },

  resultRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
    padding: "11px 0",
  },

  resultLabel: {
    color: "#718096",
    fontSize: "13px",
  },

  resultValue: {
    color: "#334e68",
    fontSize: "13px",
  },

  strongValue: {
    fontSize: "16px",
    color: "#102a43",
  },

  danger: {
    color: "#dc2626",
  },

  successText: {
    color: "#15803d",
  },

  divider: {
    height: "1px",
    background: "#e8eef5",
    margin: "10px 0",
  },

  planningGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "14px",
  },

  planningCard: {
    display: "flex",
    gap: "13px",
    padding: "18px",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    background: "#f8fafc",
  },

  planningIcon: {
    flexShrink: 0,
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#eaf2ff",
    color: "#155eef",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "12px",
    padding: "25px 0 5px",
  },

};


/* =========================================================
   ANIMATION
========================================================= */

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "tradewise-risk-styles"
  )
) {

  const style =
    document.createElement("style");

  style.id =
    "tradewise-risk-styles";

  style.innerHTML = `

    @keyframes risk-spin {
      from {
        transform: rotate(0deg);
      }

      to {
        transform: rotate(360deg);
      }
    }

    .risk-spin {
      animation:
        risk-spin
        1s linear infinite;
    }

    @media (max-width: 900px) {
      .tradewise-risk-grid {
        grid-template-columns: 1fr !important;
      }
    }

  `;

  document.head.appendChild(style);
}


export default RiskManagement;