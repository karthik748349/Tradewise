import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  CheckCircle2,
  CircleDollarSign,
  Loader2,
  RefreshCw,
  ShieldCheck,
  Wallet,
  AlertCircle,
} from "lucide-react";

const API = "http://localhost:8081/api";

function BuySell() {
  const [instruments, setInstruments] = useState([]);
  const [portfolio, setPortfolio] = useState(null);

  const [selectedInstrument, setSelectedInstrument] =
    useState(null);

  const [orderType, setOrderType] = useState("BUY");

  const [quantity, setQuantity] = useState(1);
  const [stopLoss, setStopLoss] = useState("");
  const [targetPrice, setTargetPrice] = useState("");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");


  /* =====================================================
     TOKEN
  ===================================================== */

  const token = localStorage.getItem("token");


  /* =====================================================
     AXIOS CONFIG
  ===================================================== */

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };


  /* =====================================================
     LOAD INSTRUMENTS + PORTFOLIO
  ===================================================== */

  const loadData = async () => {

    try {

      setLoading(true);
      setError("");

      const [instrumentResponse, portfolioResponse] =
        await Promise.all([

          axios.get(`${API}/instruments`),

          axios.get(
            `${API}/portfolio`,
            authConfig
          ),

        ]);

      const instrumentData =
        instrumentResponse.data || [];

      setInstruments(instrumentData);

      setPortfolio(
        portfolioResponse.data
      );

      if (
        instrumentData.length > 0 &&
        !selectedInstrument
      ) {
        setSelectedInstrument(
          instrumentData[0]
        );
      }

    } catch (err) {

      console.error(
        "Failed to load trading data:",
        err
      );

      setError(
        err?.response?.data?.message ||
        "Unable to load trading data."
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    loadData();

  }, []);


  /* =====================================================
     SELECTED PRICE
  ===================================================== */

  const currentPrice = useMemo(() => {

    if (!selectedInstrument) {
      return 0;
    }

    return Number(
      selectedInstrument.currentPrice ??
      selectedInstrument.latestPrice ??
      selectedInstrument.price ??
      selectedInstrument.closePrice ??
      0
    );

  }, [selectedInstrument]);


  /* =====================================================
     TOTAL ORDER VALUE
  ===================================================== */

  const totalAmount = useMemo(() => {

    return (
      currentPrice *
      Number(quantity || 0)
    );

  }, [currentPrice, quantity]);


  /* =====================================================
     RISK / REWARD
  ===================================================== */

  const riskAmount = useMemo(() => {

    if (
      orderType !== "BUY" ||
      !stopLoss ||
      currentPrice <= 0
    ) {
      return 0;
    }

    const difference =
      currentPrice - Number(stopLoss);

    if (difference <= 0) {
      return 0;
    }

    return difference *
      Number(quantity || 0);

  }, [
    orderType,
    stopLoss,
    currentPrice,
    quantity,
  ]);


  const rewardAmount = useMemo(() => {

    if (
      orderType !== "BUY" ||
      !targetPrice ||
      currentPrice <= 0
    ) {
      return 0;
    }

    const difference =
      Number(targetPrice) - currentPrice;

    if (difference <= 0) {
      return 0;
    }

    return difference *
      Number(quantity || 0);

  }, [
    orderType,
    targetPrice,
    currentPrice,
    quantity,
  ]);


  /* =====================================================
     FORMAT CURRENCY
  ===================================================== */

  const formatCurrency = (value) => {

    return `₹${Number(value || 0).toLocaleString(
      "en-IN",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }
    )}`;

  };


  /* =====================================================
     SELECT INSTRUMENT
  ===================================================== */

  const handleInstrumentChange = (event) => {

    const id = Number(event.target.value);

    const instrument =
      instruments.find(
        (item) => Number(item.id) === id
      );

    setSelectedInstrument(
      instrument || null
    );

    setMessage("");
    setError("");
  };


  /* =====================================================
     BUY / SELL SWITCH
  ===================================================== */

  const handleOrderType = (type) => {

    setOrderType(type);

    setMessage("");
    setError("");

    if (type === "SELL") {
      setStopLoss("");
      setTargetPrice("");
    }

  };


  /* =====================================================
     VALIDATION
  ===================================================== */

  const validateOrder = () => {

    if (!selectedInstrument) {
      return "Please select an instrument.";
    }

    if (
      !quantity ||
      Number(quantity) <= 0
    ) {
      return "Quantity must be greater than zero.";
    }

    if (currentPrice <= 0) {
      return "Current market price is unavailable.";
    }


    if (orderType === "BUY") {

      if (
        stopLoss &&
        Number(stopLoss) >= currentPrice
      ) {
        return "Stop loss must be below the entry price.";
      }

      if (
        targetPrice &&
        Number(targetPrice) <= currentPrice
      ) {
        return "Target price must be above the entry price.";
      }

      if (
        portfolio &&
        Number(portfolio.availableCash) <
          totalAmount
      ) {
        return "Insufficient available cash.";
      }

    }

    return null;
  };


  /* =====================================================
     PLACE ORDER
  ===================================================== */

  const handlePlaceOrder = async () => {

    setMessage("");
    setError("");

    const validationError =
      validateOrder();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {

      setPlacingOrder(true);

      let response;

      if (orderType === "BUY") {

        response = await axios.post(
          `${API}/orders/buy`,
          {
            instrumentId:
              selectedInstrument.id,

            quantity:
              Number(quantity),

            stopLoss:
              stopLoss
                ? Number(stopLoss)
                : null,

            targetPrice:
              targetPrice
                ? Number(targetPrice)
                : null,
          },
          authConfig
        );

      } else {

        response = await axios.post(
          `${API}/orders/sell`,
          {
            instrumentId:
              selectedInstrument.id,

            quantity:
              Number(quantity),
          },
          authConfig
        );

      }


      setMessage(
        `${orderType} order placed successfully. Order #${response.data.id}`
      );


      /* Refresh portfolio */

      const portfolioResponse =
        await axios.get(
          `${API}/portfolio`,
          authConfig
        );

      setPortfolio(
        portfolioResponse.data
      );


      /* Reset */

      setQuantity(1);
      setStopLoss("");
      setTargetPrice("");


    } catch (err) {

      console.error(
        "Order placement failed:",
        err
      );

      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        `Unable to place ${orderType} order.`
      );

    } finally {

      setPlacingOrder(false);

    }

  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {

    return (

      <div style={styles.page}>

        <div style={styles.loadingCard}>

          <Loader2
            size={30}
            style={{
              animation:
                "spin 1s linear infinite",
            }}
          />

          <h2>
            Loading trading workspace...
          </h2>

          <p>
            Fetching instruments and portfolio.
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

          <div style={styles.eyebrow}>
            PAPER TRADING
          </div>

          <h1 style={styles.title}>
            Buy / Sell
          </h1>

          <p style={styles.subtitle}>
            Place simulated orders using your
            virtual capital.
          </p>

        </div>


        <button
          style={styles.refreshButton}
          onClick={loadData}
        >

          <RefreshCw size={17} />

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
          SUCCESS
      ================================================= */}

      {message && (

        <div style={styles.success}>

          <CheckCircle2 size={18} />

          <span>
            {message}
          </span>

        </div>

      )}


      {/* =================================================
          ACCOUNT SUMMARY
      ================================================= */}

      <div style={styles.summaryGrid}>

        <SummaryCard
          icon={Wallet}
          title="Available Cash"
          value={
            portfolio
              ? formatCurrency(
                  portfolio.availableCash
                )
              : "—"
          }
        />

        <SummaryCard
          icon={CircleDollarSign}
          title="Portfolio Value"
          value={
            portfolio
              ? formatCurrency(
                  portfolio.portfolioValue
                )
              : "—"
          }
        />

        <SummaryCard
          icon={ShieldCheck}
          title="Initial Capital"
          value={
            portfolio
              ? formatCurrency(
                  portfolio.initialCapital
                )
              : "—"
          }
        />

        <SummaryCard
          icon={TrendingIcon}
          title="Order Value"
          value={formatCurrency(totalAmount)}
        />

      </div>


      {/* =================================================
          TRADING WORKSPACE
      ================================================= */}

      <div style={styles.workspace}>


        {/* =================================================
            ORDER FORM
        ================================================= */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>

              <h2 style={styles.cardTitle}>
                Place Order
              </h2>

              <p style={styles.cardSubtitle}>
                Configure your paper trade
              </p>

            </div>

          </div>


          {/* INSTRUMENT */}

          <label style={styles.label}>
            Instrument
          </label>

          <select
            value={
              selectedInstrument?.id || ""
            }
            onChange={
              handleInstrumentChange
            }
            style={styles.select}
          >

            {instruments.length === 0 ? (

              <option value="">
                No instruments available
              </option>

            ) : (

              instruments.map(
                (instrument) => (

                  <option
                    key={instrument.id}
                    value={instrument.id}
                  >
                    {instrument.symbol}
                    {" — "}
                    {instrument.companyName}
                  </option>

                )
              )

            )}

          </select>


          {/* CURRENT PRICE */}

          <div style={styles.priceBox}>

            <div>

              <span style={styles.mutedText}>
                Current Market Price
              </span>

              <strong style={styles.price}>
                {formatCurrency(
                  currentPrice
                )}
              </strong>

            </div>

            <div style={styles.exchange}>
              {selectedInstrument?.exchange ||
                "NSE"}
            </div>

          </div>


          {/* BUY / SELL */}

          <label style={styles.label}>
            Order Type
          </label>

          <div style={styles.orderSwitch}>

            <button
              type="button"
              onClick={() =>
                handleOrderType("BUY")
              }
              style={{
                ...styles.switchButton,
                ...(orderType === "BUY"
                  ? styles.buyActive
                  : {}),
              }}
            >

              <ArrowUpFromLine size={18} />

              BUY

            </button>


            <button
              type="button"
              onClick={() =>
                handleOrderType("SELL")
              }
              style={{
                ...styles.switchButton,
                ...(orderType === "SELL"
                  ? styles.sellActive
                  : {}),
              }}
            >

              <ArrowDownToLine size={18} />

              SELL

            </button>

          </div>


          {/* QUANTITY */}

          <label style={styles.label}>
            Quantity
          </label>

          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(event) =>
              setQuantity(
                event.target.value
              )
            }
            style={styles.input}
          />


          {/* STOP LOSS */}

          {orderType === "BUY" && (

            <>
              <label style={styles.label}>
                Stop Loss
                <span style={styles.optional}>
                  Optional
                </span>
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Example: 3100"
                value={stopLoss}
                onChange={(event) =>
                  setStopLoss(
                    event.target.value
                  )
                }
                style={styles.input}
              />


              {/* TARGET */}

              <label style={styles.label}>
                Target Price
                <span style={styles.optional}>
                  Optional
                </span>
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="Example: 3350"
                value={targetPrice}
                onChange={(event) =>
                  setTargetPrice(
                    event.target.value
                  )
                }
                style={styles.input}
              />

            </>

          )}


          {/* PLACE ORDER */}

          <button
            onClick={
              handlePlaceOrder
            }
            disabled={
              placingOrder ||
              !selectedInstrument
            }
            style={{
              ...styles.placeButton,
              ...(orderType === "SELL"
                ? styles.sellPlaceButton
                : {}),
              opacity:
                placingOrder ||
                !selectedInstrument
                  ? 0.65
                  : 1,
            }}
          >

            {placingOrder ? (

              <>
                <Loader2
                  size={18}
                  style={{
                    animation:
                      "spin 1s linear infinite",
                  }}
                />

                Placing Order...

              </>

            ) : (

              <>
                {orderType === "BUY"
                  ? <ArrowUpFromLine size={18} />
                  : <ArrowDownToLine size={18} />}

                PLACE {orderType} ORDER

              </>

            )}

          </button>

        </section>


        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>

              <h2 style={styles.cardTitle}>
                Order Summary
              </h2>

              <p style={styles.cardSubtitle}>
                Review before placing your trade
              </p>

            </div>

          </div>


          <div style={styles.instrumentHeader}>

            <div style={styles.instrumentIcon}>
              {selectedInstrument?.symbol?.charAt(
                0
              ) || "T"}
            </div>

            <div>

              <strong style={styles.instrumentSymbol}>
                {selectedInstrument?.symbol ||
                  "—"}
              </strong>

              <span style={styles.instrumentName}>
                {selectedInstrument?.companyName ||
                  "Select an instrument"}
              </span>

            </div>

          </div>


          <SummaryRow
            label="Order Type"
            value={orderType}
            highlight
          />

          <SummaryRow
            label="Quantity"
            value={quantity || 0}
          />

          <SummaryRow
            label="Execution Price"
            value={formatCurrency(
              currentPrice
            )}
          />

          <SummaryRow
            label="Total Amount"
            value={formatCurrency(
              totalAmount
            )}
            strong
          />


          <div style={styles.divider} />


          <div style={styles.riskTitle}>

            <ShieldCheck size={17} />

            Risk Planning

          </div>


          {orderType === "BUY" ? (

            <>

              <SummaryRow
                label="Stop Loss"
                value={
                  stopLoss
                    ? formatCurrency(
                        stopLoss
                      )
                    : "Not set"
                }
              />

              <SummaryRow
                label="Target"
                value={
                  targetPrice
                    ? formatCurrency(
                        targetPrice
                      )
                    : "Not set"
                }
              />

              <SummaryRow
                label="Potential Risk"
                value={
                  riskAmount > 0
                    ? formatCurrency(
                        riskAmount
                      )
                    : "—"
                }
                danger={
                  riskAmount > 0
                }
              />

              <SummaryRow
                label="Potential Reward"
                value={
                  rewardAmount > 0
                    ? formatCurrency(
                        rewardAmount
                      )
                    : "—"
                }
                success={
                  rewardAmount > 0
                }
              />

            </>

          ) : (

            <div style={styles.sellNotice}>

              <ArrowDownToLine size={18} />

              <div>

                <strong>
                  SELL order
                </strong>

                <p>
                  The system will verify that
                  you have enough holdings before
                  executing the order.
                </p>

              </div>

            </div>

          )}


          {/* CASH CHECK */}

          {orderType === "BUY" &&
            portfolio && (

              <div
                style={{
                  ...styles.cashCheck,
                  background:
                    Number(
                      portfolio.availableCash
                    ) >= totalAmount
                      ? "#f0fdf4"
                      : "#fef2f2",
                  color:
                    Number(
                      portfolio.availableCash
                    ) >= totalAmount
                      ? "#15803d"
                      : "#dc2626",
                }}
              >

                {Number(
                  portfolio.availableCash
                ) >= totalAmount ? (

                  <>
                    <CheckCircle2 size={17} />

                    Sufficient cash available

                  </>

                ) : (

                  <>
                    <AlertCircle size={17} />

                    Insufficient cash

                  </>

                )}

              </div>

            )}

        </section>

      </div>


      {/* =================================================
          INFORMATION
      ================================================= */}

      <section style={styles.infoCard}>

        <ShieldCheck size={21} />

        <div>

          <strong>
            TradeWise Paper Trading
          </strong>

          <p>
            All orders are simulated using
            virtual capital. No real-money
            transactions are performed.
          </p>

        </div>

      </section>


      <footer style={styles.footer}>
        TradeWise · Paper trading only ·
        Never connect real-money execution
        to this demo engine.
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
}) {

  return (

    <div style={styles.summaryCard}>

      <div style={styles.summaryIcon}>
        <Icon size={18} />
      </div>

      <span style={styles.summaryTitle}>
        {title}
      </span>

      <strong style={styles.summaryValue}>
        {value}
      </strong>

    </div>
  );
}


/* =========================================================
   SUMMARY ROW
========================================================= */

function SummaryRow({
  label,
  value,
  strong = false,
  highlight = false,
  danger = false,
  success = false,
}) {

  return (

    <div style={styles.summaryRow}>

      <span style={styles.rowLabel}>
        {label}
      </span>

      <strong
        style={{
          ...styles.rowValue,

          ...(strong
            ? styles.rowStrong
            : {}),

          ...(highlight
            ? styles.rowHighlight
            : {}),

          ...(danger
            ? styles.rowDanger
            : {}),

          ...(success
            ? styles.rowSuccess
            : {}),
        }}
      >
        {value}
      </strong>

    </div>
  );
}


/* =========================================================
   SIMPLE ICON
========================================================= */

function TrendingIcon(props) {
  return (
    <CircleDollarSign {...props} />
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

  loadingCard: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    color: "#64748b",
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
    fontSize: "13px",
    fontWeight: 800,
    letterSpacing: "1.3px",
  },

  title: {
    margin: "7px 0 6px",
    fontSize: "34px",
    lineHeight: 1.15,
    fontWeight: 800,
    color: "#102a43",
  },

  subtitle: {
    margin: 0,
    color: "#718096",
    fontSize: "15px",
  },

  refreshButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    border: "1px solid #d9e2ec",
    background: "#ffffff",
    color: "#334e68",
    borderRadius: "10px",
    padding: "11px 16px",
    fontWeight: 700,
    cursor: "pointer",
  },

  error: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    borderRadius: "12px",
    padding: "13px 16px",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: 600,
  },

  success: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f0fdf4",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    borderRadius: "12px",
    padding: "13px 16px",
    marginBottom: "18px",
    fontSize: "14px",
    fontWeight: 600,
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
    marginBottom: "13px",
  },

  summaryTitle: {
    display: "block",
    color: "#718096",
    fontSize: "13px",
    marginBottom: "5px",
  },

  summaryValue: {
    display: "block",
    fontSize: "22px",
    color: "#102a43",
  },

  workspace: {
    display: "grid",
    gridTemplateColumns:
      "minmax(0, 1.1fr) minmax(0, 0.9fr)",
    gap: "18px",
    alignItems: "start",
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

  label: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "8px",
    marginTop: "17px",
    color: "#334e68",
    fontSize: "13px",
    fontWeight: 700,
  },

  optional: {
    color: "#9fb3c8",
    fontWeight: 500,
    fontSize: "11px",
  },

  select: {
    width: "100%",
    height: "48px",
    border: "1px solid #d9e2ec",
    borderRadius: "10px",
    padding: "0 13px",
    background: "#ffffff",
    color: "#243b53",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },

  input: {
    width: "100%",
    height: "48px",
    border: "1px solid #d9e2ec",
    borderRadius: "10px",
    padding: "0 13px",
    background: "#ffffff",
    color: "#243b53",
    fontSize: "15px",
    outline: "none",
    boxSizing: "border-box",
  },

  priceBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f7faff",
    border: "1px solid #dbeafe",
    borderRadius: "12px",
    padding: "15px",
    marginTop: "15px",
  },

  mutedText: {
    display: "block",
    color: "#829ab1",
    fontSize: "12px",
    marginBottom: "4px",
  },

  price: {
    display: "block",
    fontSize: "23px",
    color: "#102a43",
  },

  exchange: {
    background: "#eaf2ff",
    color: "#155eef",
    borderRadius: "7px",
    padding: "6px 9px",
    fontSize: "12px",
    fontWeight: 800,
  },

  orderSwitch: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "8px",
  },

  switchButton: {
    height: "48px",
    borderRadius: "10px",
    border: "1px solid #d9e2ec",
    background: "#ffffff",
    color: "#52606d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    fontWeight: 800,
    cursor: "pointer",
  },

  buyActive: {
    background: "#15803d",
    color: "#ffffff",
    borderColor: "#15803d",
  },

  sellActive: {
    background: "#dc2626",
    color: "#ffffff",
    borderColor: "#dc2626",
  },

  placeButton: {
    width: "100%",
    height: "51px",
    marginTop: "24px",
    border: "none",
    borderRadius: "11px",
    background: "#155eef",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "9px",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: "14px",
    letterSpacing: "0.2px",
  },

  sellPlaceButton: {
    background: "#dc2626",
  },

  instrumentHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "15px",
    background: "#f8fafc",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  instrumentIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "11px",
    background: "#155eef",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: "17px",
  },

  instrumentSymbol: {
    display: "block",
    color: "#102a43",
    fontSize: "16px",
  },

  instrumentName: {
    display: "block",
    color: "#829ab1",
    fontSize: "12px",
    marginTop: "3px",
  },

  summaryRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "15px",
    padding: "10px 0",
  },

  rowLabel: {
    color: "#718096",
    fontSize: "13px",
  },

  rowValue: {
    color: "#334e68",
    fontSize: "13px",
  },

  rowStrong: {
    color: "#102a43",
    fontSize: "17px",
  },

  rowHighlight: {
    color: "#155eef",
    fontWeight: 800,
  },

  rowDanger: {
    color: "#dc2626",
  },

  rowSuccess: {
    color: "#15803d",
  },

  divider: {
    height: "1px",
    background: "#e8eef5",
    margin: "13px 0",
  },

  riskTitle: {
    display: "flex",
    alignItems: "center",
    gap: "7px",
    color: "#334e68",
    fontWeight: 800,
    fontSize: "13px",
    marginBottom: "5px",
  },

  sellNotice: {
    display: "flex",
    gap: "10px",
    padding: "13px",
    borderRadius: "10px",
    background: "#fff7ed",
    color: "#c2410c",
    marginTop: "10px",
    fontSize: "13px",
  },

  sellNoticeP: {
    margin: "4px 0 0",
  },

  cashCheck: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "11px 13px",
    borderRadius: "9px",
    marginTop: "14px",
    fontSize: "12px",
    fontWeight: 700,
  },

  infoCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    marginTop: "18px",
    padding: "16px",
    borderRadius: "13px",
    background: "#eef6ff",
    color: "#155eef",
    border: "1px solid #dbeafe",
  },

  footer: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "12px",
    padding: "25px 0 5px",
  },

};


/* =========================================================
   RESPONSIVE
========================================================= */

const styleSheet = document.createElement("style");

styleSheet.innerHTML = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1000px) {
  .tradewise-buy-sell-responsive {
    grid-template-columns: 1fr !important;
  }
}
`;

if (
  typeof document !== "undefined" &&
  !document.getElementById(
    "tradewise-buy-sell-styles"
  )
) {
  styleSheet.id =
    "tradewise-buy-sell-styles";

  document.head.appendChild(
    styleSheet
  );
}


export default BuySell;