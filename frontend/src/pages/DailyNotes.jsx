import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  CalendarDays,
  Save,
  RefreshCw,
  FileText,
  BookOpen,
} from "lucide-react";

const API_BASE = "http://localhost:8081/api";

function DailyNotes() {
  const [notes, setNotes] = useState([]);
  const getLocalDate = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const [selectedDate, setSelectedDate] = useState(getLocalDate);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getAuthConfig = (includeJson = false) => {
    const token = localStorage.getItem("token");

    const headers = {};

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (includeJson) {
      headers["Content-Type"] = "application/json";
    }

    return { headers };
  };

  const fetchNotes = async () => {
    try {
      setFetching(true);
      setError("");

      const response = await axios.get(
        `${API_BASE}/notes`,
        getAuthConfig()
      );

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.content || [];

      setNotes(data);

      const todayNote = data.find((item) => {
        const date =
          item.date ||
          item.noteDate ||
          item.createdAt?.split("T")[0];

        return date === selectedDate;
      });

      if (todayNote) {
        setNote(
          todayNote.note ||
            todayNote.content ||
            todayNote.text ||
            ""
        );
      } else {
        setNote("");
      }
    } catch (err) {
      console.error("Notes error:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(
          "Your session is not authorized. Please log in again and try again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to load daily trading notes."
        );
      }
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleDateChange = (event) => {
    const date = event.target.value;

    setSelectedDate(date);
    setMessage("");

    const existingNote = notes.find((item) => {
      const itemDate =
        item.date ||
        item.noteDate ||
        item.createdAt?.split("T")[0];

      return itemDate === date;
    });

    setNote(
      existingNote
        ? existingNote.note ||
            existingNote.content ||
            existingNote.text ||
            ""
        : ""
    );
  };

  const saveNote = async () => {
    if (!note.trim()) {
      setError("Please write something before saving.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please log in again.");
        return;
      }

      await axios.post(
  `${API_BASE}/notes`,
  {
    noteDate: selectedDate,
    content: note.trim(),
  },
  getAuthConfig(true)
);

      setMessage("Trading note saved successfully.");

      await fetchNotes();
    } catch (err) {
      console.error("Save note error:", err);

      if (err.response?.status === 401 || err.response?.status === 403) {
        setError(
          "Your session is not authorized. Please log in again and try again."
        );
      } else {
        setError(
          err.response?.data?.message ||
            "Unable to save the trading note."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(
      `${dateString}T00:00:00`
    ).toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div style={styles.page}>
      <style>{`
        .notes-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.5fr) minmax(300px, 0.8fr);
          gap: 22px;
        }

        .notes-history {
          max-height: 580px;
          overflow-y: auto;
        }

        @media (max-width: 950px) {
          .notes-layout {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .page-header {
            flex-direction: column !important;
            align-items: flex-start !important;
          }

          .date-row {
            flex-direction: column !important;
            align-items: stretch !important;
          }

          .date-input {
            width: 100% !important;
          }
        }
      `}</style>

      {/* Header */}
      <div
        className="page-header"
        style={styles.header}
      >
        <div>
          <div style={styles.eyebrow}>
            TRADING JOURNAL
          </div>

          <h1 style={styles.title}>
            Daily Trading Notes
          </h1>

          <p style={styles.subtitle}>
            Record your market observations, ideas and
            lessons from each trading day.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchNotes}
          style={styles.refreshButton}
        >
          <RefreshCw size={18} />
          Refresh
        </button>
      </div>

      <div className="notes-layout">
        {/* Editor */}
        <div style={styles.editorCard}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitle}>
                Today's Market Notes
              </div>

              <div style={styles.cardSubtitle}>
                Capture what you observed during the
                session.
              </div>
            </div>

            <div style={styles.headerIcon}>
              <FileText size={21} />
            </div>
          </div>

          <div
            className="date-row"
            style={styles.dateRow}
          >
            <div>
              <label style={styles.label}>
                Trading Date
              </label>

              <div style={styles.dateWrapper}>
                <CalendarDays
                  size={18}
                  color="#1769e0"
                />

                <input
                  className="date-input"
                  type="date"
                  value={selectedDate}
                  onChange={handleDateChange}
                  style={styles.dateInput}
                />
              </div>
            </div>

            <div style={styles.selectedDate}>
              {formatDate(selectedDate)}
            </div>
          </div>

          <div style={styles.noteSection}>
            <label style={styles.label}>
              Market Observations
            </label>

            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setMessage("");
                setError("");
              }}
              placeholder={
                "Example:\n\nMarket opened positively but IT stocks weakened after noon. TCS showed strong support around ₹3,150. Banking stocks remained relatively stable.\n\nThings to watch tomorrow: IT sector momentum, TCS breakout confirmation..."
              }
              style={styles.textarea}
            />

            <div style={styles.editorFooter}>
              <span style={styles.characterCount}>
                {note.length} characters
              </span>

              <button
                type="button"
                onClick={saveNote}
                disabled={loading}
                style={{
                  ...styles.saveButton,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                <Save size={18} />

                {loading
                  ? "Saving..."
                  : "Save Trading Note"}
              </button>
            </div>
          </div>

          {message && (
            <div style={styles.successMessage}>
              ✓ {message}
            </div>
          )}

          {error && (
            <div style={styles.errorMessage}>
              {error}
            </div>
          )}
        </div>

        {/* History */}
        <div style={styles.historyCard}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitle}>
                Previous Notes
              </div>

              <div style={styles.cardSubtitle}>
                Your recent trading observations.
              </div>
            </div>

            <div style={styles.headerIcon}>
              <BookOpen size={21} />
            </div>
          </div>

          {fetching ? (
            <div style={styles.emptyState}>
              Loading notes...
            </div>
          ) : notes.length === 0 ? (
            <div style={styles.emptyState}>
              <BookOpen size={34} />

              <div style={styles.emptyTitle}>
                No notes yet
              </div>

              <div style={styles.emptyText}>
                Start recording your daily market
                observations.
              </div>
            </div>
          ) : (
            <div
              className="notes-history"
              style={styles.notesHistory}
            >
              {notes
                .slice()
                .sort((a, b) => {
                  const dateA =
                    a.date ||
                    a.noteDate ||
                    a.createdAt ||
                    "";

                  const dateB =
                    b.date ||
                    b.noteDate ||
                    b.createdAt ||
                    "";

                  return dateB.localeCompare(dateA);
                })
                .map((item, index) => {
                  const itemDate =
                    item.date ||
                    item.noteDate ||
                    item.createdAt?.split("T")[0];

                  const itemText =
                    item.note ||
                    item.content ||
                    item.text ||
                    "";

                  return (
                    <button
                      type="button"
                      key={item.id || index}
                      onClick={() => {
                        if (itemDate) {
                          setSelectedDate(itemDate);
                        }

                        setNote(itemText);
                        setMessage("");
                        setError("");
                      }}
                      style={styles.historyItem}
                    >
                      <div style={styles.historyDate}>
                        {itemDate
                          ? formatDate(itemDate)
                          : "Trading Note"}
                      </div>

                      <div style={styles.historyText}>
                        {itemText.length > 150
                          ? `${itemText.substring(
                              0,
                              150
                            )}...`
                          : itemText}
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Tips */}
      <div style={styles.tipsCard}>
        <div style={styles.tipsTitle}>
          What to record in your daily notes
        </div>

        <div style={styles.tipsGrid}>
          <Tip
            title="Market Context"
            text="Overall market direction, sector strength and major events."
          />

          <Tip
            title="Trade Ideas"
            text="Stocks or setups you are watching for the next session."
          />

          <Tip
            title="Lessons Learned"
            text="What worked, what did not and what you can improve."
          />

          <Tip
            title="Tomorrow's Plan"
            text="Levels, watchlist items and conditions to monitor."
          />
        </div>
      </div>
    </div>
  );
}

function Tip({ title, text }) {
  return (
    <div style={styles.tip}>
      <div style={styles.tipTitle}>{title}</div>
      <div style={styles.tipText}>{text}</div>
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
    maxWidth: 720,
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

  editorCard: {
    background: "#ffffff",
    border: "1px solid #dce5ef",
    borderRadius: 20,
    padding: 28,
    boxShadow:
      "0 8px 24px rgba(20, 54, 90, 0.05)",
  },

  historyCard: {
    background: "#ffffff",
    border: "1px solid #dce5ef",
    borderRadius: 20,
    padding: 28,
    boxShadow:
      "0 8px 24px rgba(20, 54, 90, 0.05)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 15,
    marginBottom: 28,
  },

  cardTitle: {
    color: "#082f55",
    fontSize: 21,
    fontWeight: 800,
  },

  cardSubtitle: {
    marginTop: 6,
    color: "#8a9ab0",
    fontSize: 13,
  },

  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    background: "#eaf2ff",
    color: "#1769e0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  dateRow: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 20,
    marginBottom: 24,
  },

  label: {
    display: "block",
    color: "#516b87",
    fontSize: 13,
    fontWeight: 700,
    marginBottom: 8,
  },

  dateWrapper: {
    display: "flex",
    alignItems: "center",
    gap: 9,
    border: "1px solid #dce5ef",
    background: "#f8fafc",
    borderRadius: 10,
    padding: "0 12px",
    height: 44,
  },

  dateInput: {
    border: "none",
    outline: "none",
    background: "transparent",
    color: "#24425f",
    fontSize: 14,
    fontWeight: 600,
  },

  selectedDate: {
    color: "#1769e0",
    fontSize: 14,
    fontWeight: 700,
    paddingBottom: 12,
  },

  noteSection: {
    marginTop: 5,
  },

  textarea: {
    width: "100%",
    minHeight: 360,
    resize: "vertical",
    border: "1px solid #dce5ef",
    borderRadius: 14,
    background: "#fbfcfe",
    padding: 18,
    boxSizing: "border-box",
    outline: "none",
    color: "#243b53",
    fontSize: 15,
    lineHeight: 1.7,
    fontFamily: "Arial, sans-serif",
  },

  editorFooter: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 15,
    marginTop: 14,
  },

  characterCount: {
    color: "#94a3b8",
    fontSize: 12,
  },

  saveButton: {
    border: "none",
    background: "#1769e0",
    color: "#ffffff",
    borderRadius: 11,
    padding: "13px 19px",
    fontSize: 14,
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: 9,
    cursor: "pointer",
  },

  successMessage: {
    marginTop: 15,
    padding: "12px 15px",
    borderRadius: 10,
    background: "#ecfdf3",
    color: "#15803d",
    border: "1px solid #bbf7d0",
    fontSize: 13,
    fontWeight: 600,
  },

  errorMessage: {
    marginTop: 15,
    padding: "12px 15px",
    borderRadius: 10,
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
    fontSize: 13,
    fontWeight: 600,
  },

  notesHistory: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  historyItem: {
    width: "100%",
    textAlign: "left",
    border: "1px solid #e2e8f0",
    background: "#fbfcfe",
    borderRadius: 12,
    padding: 15,
    cursor: "pointer",
  },

  historyDate: {
    color: "#1769e0",
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 8,
  },

  historyText: {
    color: "#52677f",
    fontSize: 13,
    lineHeight: 1.55,
  },

  emptyState: {
    minHeight: 300,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#9aaabd",
    gap: 10,
  },

  emptyTitle: {
    color: "#52677f",
    fontSize: 16,
    fontWeight: 700,
  },

  emptyText: {
    color: "#9aaabd",
    fontSize: 13,
    maxWidth: 230,
    lineHeight: 1.5,
  },

  tipsCard: {
    marginTop: 20,
    background: "#ffffff",
    border: "1px solid #dce5ef",
    borderRadius: 18,
    padding: 24,
    boxShadow:
      "0 8px 24px rgba(20, 54, 90, 0.04)",
  },

  tipsTitle: {
    color: "#082f55",
    fontWeight: 800,
    fontSize: 16,
    marginBottom: 18,
  },

  tipsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: 14,
  },

  tip: {
    background: "#f8fafc",
    borderRadius: 12,
    padding: 15,
  },

  tipTitle: {
    color: "#1769e0",
    fontSize: 13,
    fontWeight: 800,
    marginBottom: 7,
  },

  tipText: {
    color: "#71839d",
    fontSize: 12,
    lineHeight: 1.55,
  },
};

export default DailyNotes;