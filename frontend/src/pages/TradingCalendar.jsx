import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Activity,
  RefreshCw,
} from "lucide-react";

const API_BASE = "http://localhost:8081/api";

function TradingCalendar() {
  const [calendarData, setCalendarData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchCalendar = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${API_BASE}/calendar`,
        authConfig
      );

      setCalendarData(response.data || []);
    } catch (err) {
      console.error("Calendar error:", err);
      setError(
        err.response?.data?.message ||
          "Unable to load trading calendar."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const firstDay = new Date(year, month, 1).getDay();

  const monthData = useMemo(() => {
    const map = {};

    calendarData.forEach((item) => {
      const date =
        item.date ||
        item.tradingDate ||
        item.day ||
        item.createdAt?.split("T")[0];

      if (!date) return;

      const dayNumber = Number(date.split("-")[2]);

      if (
        Number(date.split("-")[0]) === year &&
        Number(date.split("-")[1]) === month + 1
      ) {
        map[dayNumber] = item;
      }
    });

    return map;
  }, [calendarData, year, month]);

  const monthlyStats = useMemo(() => {
    let profitableDays = 0;
    let lossDays = 0;
    let totalPnl = 0;
    let totalTrades = 0;

    Object.values(monthData).forEach((item) => {
      const pnl = Number(
        item.pnl ??
          item.dailyPnl ??
          item.profitLoss ??
          item.realizedPnl ??
          0
      );

      const trades = Number(
        item.trades ??
          item.tradeCount ??
          item.totalTrades ??
          0
      );

      totalPnl += pnl;
      totalTrades += trades;

      if (pnl > 0) profitableDays++;
      if (pnl < 0) lossDays++;
    });

    return {
      profitableDays,
      lossDays,
      totalPnl,
      totalTrades,
    };
  }, [monthData]);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const getPnl = (item) => {
    return Number(
      item?.pnl ??
        item?.dailyPnl ??
        item?.profitLoss ??
        item?.realizedPnl ??
        0
    );
  };

  const getTrades = (item) => {
    return Number(
      item?.trades ??
        item?.tradeCount ??
        item?.totalTrades ??
        0
    );
  };

  const calendarCells = [];

  for (let i = 0; i < firstDay; i++) {
    calendarCells.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day);
  }

  return (
    <div style={styles.page}>
      <style>{`
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, minmax(0, 1fr));
          gap: 10px;
        }

        .calendar-day {
          min-height: 112px;
        }

        @media (max-width: 900px) {
          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .calendar-day {
            min-height: 90px;
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }

          .calendar-grid {
            gap: 5px;
          }

          .calendar-day {
            min-height: 70px;
            padding: 7px !important;
          }

          .day-label {
            font-size: 10px !important;
          }

          .pnl-value {
            font-size: 11px !important;
          }

          .trade-count {
            font-size: 9px !important;
          }
        }
      `}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.eyebrow}>PERFORMANCE</div>

          <h1 style={styles.title}>Trading Calendar</h1>

          <p style={styles.subtitle}>
            Track your daily trading performance and activity.
          </p>
        </div>

        <button
          onClick={fetchCalendar}
          style={styles.refreshButton}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div
        className="stats-grid"
        style={styles.statsGrid}
      >
        <StatCard
          icon={<TrendingUp size={20} />}
          label="Profitable Days"
          value={monthlyStats.profitableDays}
          description="Positive P&L days"
          type="profit"
        />

        <StatCard
          icon={<TrendingDown size={20} />}
          label="Loss Days"
          value={monthlyStats.lossDays}
          description="Negative P&L days"
          type="loss"
        />

        <StatCard
          icon={<Activity size={20} />}
          label="Total Trades"
          value={monthlyStats.totalTrades}
          description="Executed this month"
        />

        <StatCard
          icon={<TrendingUp size={20} />}
          label="Monthly P&L"
          value={formatCurrency(monthlyStats.totalPnl)}
          description="Realized performance"
          type={monthlyStats.totalPnl >= 0 ? "profit" : "loss"}
        />
      </div>

      {/* Calendar */}
      <div style={styles.calendarCard}>
        <div style={styles.calendarHeader}>
          <div>
            <div style={styles.calendarTitle}>
              {monthName} {year}
            </div>

            <div style={styles.calendarSubtitle}>
              Daily trading performance
            </div>
          </div>

          <div style={styles.monthControls}>
            <button
              onClick={previousMonth}
              style={styles.iconButton}
            >
              <ChevronLeft size={20} />
            </button>

            <button
              onClick={() =>
                setCurrentDate(new Date())
              }
              style={styles.todayButton}
            >
              Today
            </button>

            <button
              onClick={nextMonth}
              style={styles.iconButton}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {loading ? (
          <div style={styles.emptyState}>
            <Activity size={30} />
            <p>Loading trading calendar...</p>
          </div>
        ) : error ? (
          <div style={styles.errorState}>
            <p>{error}</p>

            <button
              onClick={fetchCalendar}
              style={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        ) : (
          <>
            {/* Weekday Headers */}
            <div
              className="calendar-grid"
              style={styles.weekHeader}
            >
              {[
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ].map((day) => (
                <div
                  key={day}
                  className="day-label"
                  style={styles.weekday}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div
              className="calendar-grid"
              style={styles.calendarGrid}
            >
              {calendarCells.map((day, index) => {
                if (!day) {
                  return (
                    <div
                      key={`empty-${index}`}
                      className="calendar-day"
                      style={styles.emptyDay}
                    />
                  );
                }

                const item = monthData[day];
                const pnl = getPnl(item);
                const trades = getTrades(item);

                const isProfit = pnl > 0;
                const isLoss = pnl < 0;

                return (
                  <div
                    key={day}
                    className="calendar-day"
                    style={{
                      ...styles.calendarDay,
                      ...(isProfit
                        ? styles.profitDay
                        : {}),
                      ...(isLoss
                        ? styles.lossDay
                        : {}),
                    }}
                  >
                    <div style={styles.dayNumber}>
                      {day}
                    </div>

                    {item ? (
                      <>
                        <div
                          className="pnl-value"
                          style={{
                            ...styles.pnlValue,
                            color: isProfit
                              ? "#159447"
                              : isLoss
                              ? "#dc2626"
                              : "#64748b",
                          }}
                        >
                          {pnl > 0 ? "+" : ""}
                          {formatCurrency(pnl)}
                        </div>

                        <div
                          className="trade-count"
                          style={styles.tradeCount}
                        >
                          {trades}{" "}
                          {trades === 1
                            ? "trade"
                            : "trades"}
                        </div>
                      </>
                    ) : (
                      <div style={styles.noActivity}>
                        No activity
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Legend */}
      <div style={styles.legendCard}>
        <div style={styles.legendTitle}>Performance Legend</div>

        <div style={styles.legendItems}>
          <Legend
            background="#ecfdf3"
            border="#bbf7d0"
            dot="#16a34a"
            text="Profitable day"
          />

          <Legend
            background="#fef2f2"
            border="#fecaca"
            dot="#dc2626"
            text="Loss-making day"
          />

          <Legend
            background="#f8fafc"
            border="#e2e8f0"
            dot="#94a3b8"
            text="No trading activity"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  type,
}) {
  return (
    <div style={styles.statCard}>
      <div
        style={{
          ...styles.statIcon,
          ...(type === "profit"
            ? styles.profitIcon
            : type === "loss"
            ? styles.lossIcon
            : {}),
        }}
      >
        {icon}
      </div>

      <div style={styles.statLabel}>{label}</div>

      <div
        style={{
          ...styles.statValue,
          color:
            type === "profit"
              ? "#159447"
              : type === "loss"
              ? "#dc2626"
              : "#082f55",
        }}
      >
        {value}
      </div>

      <div style={styles.statDescription}>
        {description}
      </div>
    </div>
  );
}

function Legend({
  background,
  border,
  dot,
  text,
}) {
  return (
    <div style={styles.legendItem}>
      <span
        style={{
          ...styles.legendDot,
          background: dot,
        }}
      />

      <span>{text}</span>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100%",
    background: "#f4f7fb",
    padding: "38px 40px 50px",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 20,
    marginBottom: 30,
  },

  eyebrow: {
    fontSize: 13,
    fontWeight: 800,
    letterSpacing: "1.4px",
    color: "#1769e0",
    marginBottom: 12,
  },

  title: {
    margin: 0,
    color: "#082f55",
    fontSize: 40,
    lineHeight: 1.1,
    fontWeight: 800,
  },

  subtitle: {
    margin: "12px 0 0",
    color: "#71839d",
    fontSize: 16,
  },

  refreshButton: {
    border: "1px solid #d7e1ee",
    background: "#ffffff",
    color: "#24425f",
    borderRadius: 12,
    padding: "14px 20px",
    fontSize: 15,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 10,
    cursor: "pointer",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 18,
    marginBottom: 22,
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #dce5ef",
    borderRadius: 18,
    padding: 22,
    boxShadow:
      "0 8px 24px rgba(20, 54, 90, 0.05)",
  },

  statIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    background: "#eaf2ff",
    color: "#1769e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },

  profitIcon: {
    background: "#ecfdf3",
    color: "#159447",
  },

  lossIcon: {
    background: "#fef2f2",
    color: "#dc2626",
  },

  statLabel: {
    color: "#71839d",
    fontSize: 14,
    marginBottom: 8,
  },

  statValue: {
    fontSize: 25,
    fontWeight: 800,
  },

  statDescription: {
    color: "#94a3b8",
    fontSize: 12,
    marginTop: 8,
  },

  calendarCard: {
    background: "#ffffff",
    border: "1px solid #dce5ef",
    borderRadius: 20,
    padding: 28,
    boxShadow:
      "0 8px 24px rgba(20, 54, 90, 0.05)",
  },

  calendarHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 20,
    marginBottom: 28,
  },

  calendarTitle: {
    fontSize: 25,
    fontWeight: 800,
    color: "#082f55",
  },

  calendarSubtitle: {
    marginTop: 6,
    color: "#8a9ab0",
    fontSize: 13,
  },

  monthControls: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "1px solid #dce5ef",
    background: "#ffffff",
    color: "#24425f",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  todayButton: {
    height: 40,
    borderRadius: 10,
    border: "1px solid #dce5ef",
    background: "#f8fafc",
    color: "#1769e0",
    padding: "0 15px",
    fontWeight: 700,
    cursor: "pointer",
  },

  weekHeader: {
    marginBottom: 8,
  },

  weekday: {
    textAlign: "center",
    color: "#8a9ab0",
    fontWeight: 700,
    fontSize: 12,
    padding: "8px 0",
  },

  calendarGrid: {
    gridTemplateColumns:
      "repeat(7, minmax(0, 1fr))",
  },

  emptyDay: {
    background: "transparent",
  },

  calendarDay: {
    border: "1px solid #e2e8f0",
    borderRadius: 12,
    padding: 12,
    background: "#fbfcfe",
    boxSizing: "border-box",
  },

  profitDay: {
    background: "#f0fdf4",
    borderColor: "#bbf7d0",
  },

  lossDay: {
    background: "#fff7f7",
    borderColor: "#fecaca",
  },

  dayNumber: {
    color: "#334e68",
    fontWeight: 800,
    fontSize: 13,
    marginBottom: 15,
  },

  pnlValue: {
    fontWeight: 800,
    fontSize: 13,
    marginBottom: 6,
  },

  tradeCount: {
    color: "#71839d",
    fontSize: 11,
  },

  noActivity: {
    color: "#b0bac7",
    fontSize: 11,
  },

  emptyState: {
    minHeight: 350,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#8a9ab0",
  },

  errorState: {
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#dc2626",
    gap: 15,
  },

  retryButton: {
    border: "none",
    background: "#1769e0",
    color: "#ffffff",
    borderRadius: 10,
    padding: "11px 18px",
    fontWeight: 700,
    cursor: "pointer",
  },

  legendCard: {
    marginTop: 18,
    background: "#ffffff",
    border: "1px solid #dce5ef",
    borderRadius: 16,
    padding: "18px 22px",
  },

  legendTitle: {
    color: "#082f55",
    fontWeight: 800,
    fontSize: 14,
    marginBottom: 14,
  },

  legendItems: {
    display: "flex",
    flexWrap: "wrap",
    gap: 24,
  },

  legendItem: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "#64748b",
    fontSize: 13,
  },

  legendDot: {
    width: 9,
    height: 9,
    borderRadius: "50%",
  },
};

export default TradingCalendar;