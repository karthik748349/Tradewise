import { useEffect, useState } from "react";
import axios from "axios";

function Journal() {
  const [instruments, setInstruments] = useState([]);
  const [entries, setEntries] = useState([]);

  const [form, setForm] = useState({
    instrumentId: "",
    reason: "",
    strategyTag: "",
    notes: "",
    entryPrice: "",
    stopLoss: "",
    targetPrice: "",
    screenshotUrl: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const token = localStorage.getItem("token");

  const authConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    loadInstruments();
    loadJournal();
  }, []);

  const loadInstruments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/instruments"
      );

      setInstruments(response.data);
    } catch (err) {
      console.error("Failed to load instruments:", err);
      setError("Failed to load instruments.");
    }
  };

  const loadJournal = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/api/journal",
        authConfig
      );

      setEntries(response.data);
    } catch (err) {
      console.error("Failed to load journal:", err);
      setError("Failed to load journal entries.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleScreenshotUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (
      !["image/png", "image/jpeg", "image/webp"].includes(
        file.type
      )
    ) {
      setError("Only PNG, JPEG and WebP images are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Screenshot must be 5 MB or smaller.");
      return;
    }

    setError("");
    setSuccess("");
    setUploadingScreenshot(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://localhost:8081/api/journal/screenshots",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm((previous) => ({
        ...previous,
        screenshotUrl: response.data.url,
      }));

      setSuccess("Screenshot uploaded successfully.");
    } catch (err) {
      console.error("Screenshot upload failed:", err);

      setError(
        err.response?.data?.message ||
          "Failed to upload screenshot."
      );
    } finally {
      setUploadingScreenshot(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.instrumentId) {
      setError("Please select an instrument.");
      return;
    }

    if (!form.reason.trim()) {
      setError("Please enter the reason for the trade.");
      return;
    }

    if (uploadingScreenshot) {
      setError("Please wait until the screenshot upload finishes.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        instrumentId: Number(form.instrumentId),
        reason: form.reason.trim(),
        strategyTag: form.strategyTag || null,
        notes: form.notes.trim() || null,
        entryPrice: form.entryPrice
          ? Number(form.entryPrice)
          : null,
        stopLoss: form.stopLoss
          ? Number(form.stopLoss)
          : null,
        targetPrice: form.targetPrice
          ? Number(form.targetPrice)
          : null,
        screenshotUrl: form.screenshotUrl || null,
      };

      await axios.post(
        "http://localhost:8081/api/journal",
        payload,
        authConfig
      );

      setSuccess("Trade journal entry saved successfully.");

      setForm({
        instrumentId: "",
        reason: "",
        strategyTag: "",
        notes: "",
        entryPrice: "",
        stopLoss: "",
        targetPrice: "",
        screenshotUrl: "",
      });

      const fileInput =
        document.getElementById("trade-screenshot");

      if (fileInput) {
        fileInput.value = "";
      }

      await loadJournal();
    } catch (err) {
      console.error("Failed to save journal:", err);

      setError(
        err.response?.data?.message ||
          "Failed to save journal entry."
      );
    } finally {
      setSaving(false);
    }
  };

  const getScreenshotUrl = (url) => {
    if (!url) {
      return "";
    }

    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }

    return `http://localhost:8081/api${url}`;
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
      return "-";
    }

    return `₹${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (value) => {
    if (!value) {
      return "-";
    }

    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div style={pageStyle}>
      <div style={headerStyle}>
        <div>
          <h1 style={titleStyle}>Trading Journal</h1>

          <p style={subtitleStyle}>
            Record the reason behind every trade and learn from
            your decisions.
          </p>
        </div>
      </div>

      {error && (
        <div style={errorStyle}>
          {error}
        </div>
      )}

      {success && (
        <div style={successStyle}>
          {success}
        </div>
      )}

      <div style={formCardStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>
              Record a Trade
            </h2>

            <p style={sectionSubtitleStyle}>
              Document your setup, strategy, risk and reasoning.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={gridStyle}>

            {/* Instrument */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Instrument *
              </label>

              <select
                name="instrumentId"
                value={form.instrumentId}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select instrument
                </option>

                {instruments.map((instrument) => (
                  <option
                    key={instrument.id}
                    value={instrument.id}
                  >
                    {instrument.symbol} -{" "}
                    {instrument.companyName}
                  </option>
                ))}
              </select>
            </div>

            {/* Strategy */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Strategy
              </label>

              <select
                name="strategyTag"
                value={form.strategyTag}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">
                  Select strategy
                </option>

                <option value="Breakout">
                  Breakout
                </option>

                <option value="Reversal">
                  Reversal
                </option>

                <option value="Swing">
                  Swing
                </option>

                <option value="Momentum">
                  Momentum
                </option>

                <option value="Trend Following">
                  Trend Following
                </option>

                <option value="Support/Resistance">
                  Support/Resistance
                </option>

                <option value="Intraday">
                  Intraday
                </option>

                <option value="Scalping">
                  Scalping
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {/* Entry Price */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Entry Price
              </label>

              <input
                type="number"
                step="0.01"
                name="entryPrice"
                value={form.entryPrice}
                onChange={handleChange}
                placeholder="₹0.00"
                style={inputStyle}
              />
            </div>

            {/* Stop Loss */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Stop Loss
              </label>

              <input
                type="number"
                step="0.01"
                name="stopLoss"
                value={form.stopLoss}
                onChange={handleChange}
                placeholder="₹0.00"
                style={inputStyle}
              />
            </div>

            {/* Target */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Target Price
              </label>

              <input
                type="number"
                step="0.01"
                name="targetPrice"
                value={form.targetPrice}
                onChange={handleChange}
                placeholder="₹0.00"
                style={inputStyle}
              />
            </div>

            {/* Screenshot */}
            <div style={fieldStyle}>
              <label style={labelStyle}>
                Trade Screenshot
              </label>

              <input
                id="trade-screenshot"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleScreenshotUpload}
                disabled={uploadingScreenshot}
                style={{
                  ...inputStyle,
                  padding: "9px",
                  cursor: uploadingScreenshot
                    ? "not-allowed"
                    : "pointer",
                }}
              />

              <span style={helperTextStyle}>
                PNG, JPG or WebP • Maximum 5 MB
              </span>

              {uploadingScreenshot && (
                <span style={uploadingStyle}>
                  Uploading screenshot...
                </span>
              )}

              {form.screenshotUrl &&
                !uploadingScreenshot && (
                  <div style={uploadedStyle}>
                    ✓ Screenshot uploaded
                  </div>
                )}
            </div>

            {/* Reason */}
            <div style={fullWidthFieldStyle}>
              <label style={labelStyle}>
                Why did you take this trade? *
              </label>

              <textarea
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Example: Strong breakout above resistance with high volume..."
                rows="4"
                style={textareaStyle}
              />
            </div>

            {/* Notes */}
            <div style={fullWidthFieldStyle}>
              <label style={labelStyle}>
                Additional Notes
              </label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Market conditions, confirmation, emotions, mistakes, observations..."
                rows="4"
                style={textareaStyle}
              />
            </div>
          </div>

          <div style={formFooterStyle}>
            <button
              type="submit"
              disabled={saving || uploadingScreenshot}
              style={{
                ...buttonStyle,
                opacity:
                  saving || uploadingScreenshot ? 0.7 : 1,
                cursor:
                  saving || uploadingScreenshot
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {saving
                ? "Saving..."
                : uploadingScreenshot
                ? "Uploading..."
                : "Save Journal Entry"}
            </button>
          </div>
        </form>
      </div>

      {/* Journal Entries */}
      <div style={entriesSectionStyle}>
        <div style={sectionHeaderStyle}>
          <div>
            <h2 style={sectionTitleStyle}>
              Journal Entries
            </h2>

            <p style={sectionSubtitleStyle}>
              Review your previous trading decisions.
            </p>
          </div>

          <div style={countBadgeStyle}>
            {entries.length}{" "}
            {entries.length === 1
              ? "Entry"
              : "Entries"}
          </div>
        </div>

        {loading ? (
          <div style={emptyCardStyle}>
            Loading journal entries...
          </div>
        ) : entries.length === 0 ? (
          <div style={emptyCardStyle}>
            <h3 style={{ marginTop: 0 }}>
              No journal entries yet
            </h3>

            <p style={{ color: "#64748b" }}>
              Record your first trade above to start
              building your trading journal.
            </p>
          </div>
        ) : (
          <div style={entriesGridStyle}>
            {entries.map((entry) => (
              <div
                key={entry.id}
                style={entryCardStyle}
              >
                <div style={entryTopStyle}>
                  <div>
                    <div style={symbolStyle}>
                      {entry.symbol}
                    </div>

                    <div style={dateStyle}>
                      {formatDate(entry.createdAt)}
                    </div>
                  </div>

                  {entry.strategyTag && (
                    <span style={strategyBadgeStyle}>
                      {entry.strategyTag}
                    </span>
                  )}
                </div>

                <div style={reasonStyle}>
                  {entry.reason}
                </div>

                <div style={priceGridStyle}>
                  <div style={priceBoxStyle}>
                    <span style={priceLabelStyle}>
                      Entry
                    </span>

                    <strong>
                      {formatCurrency(entry.entryPrice)}
                    </strong>
                  </div>

                  <div style={priceBoxStyle}>
                    <span style={priceLabelStyle}>
                      Stop Loss
                    </span>

                    <strong>
                      {formatCurrency(entry.stopLoss)}
                    </strong>
                  </div>

                  <div style={priceBoxStyle}>
                    <span style={priceLabelStyle}>
                      Target
                    </span>

                    <strong>
                      {formatCurrency(entry.targetPrice)}
                    </strong>
                  </div>
                </div>

                {entry.notes && (
                  <div style={notesBoxStyle}>
                    <div style={notesLabelStyle}>
                      Notes
                    </div>

                    <div style={notesTextStyle}>
                      {entry.notes}
                    </div>
                  </div>
                )}

                {/* Trade Screenshot */}
                {entry.screenshotUrl && (
                  <div style={screenshotContainerStyle}>
                    <div style={screenshotTitleStyle}>
                      Trade Screenshot
                    </div>

                    <img
                      src={getScreenshotUrl(
                        entry.screenshotUrl
                      )}
                      alt={`${entry.symbol} trade screenshot`}
                      style={screenshotImageStyle}
                      onError={(event) => {
                        event.currentTarget.style.display =
                          "none";
                      }}
                    />

                    <a
                      href={getScreenshotUrl(
                        entry.screenshotUrl
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={screenshotLinkStyle}
                    >
                      Open Full Screenshot →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* =========================
   PAGE STYLES
========================= */

const pageStyle = {
  padding: "32px",
  background: "#f8fafc",
  minHeight: "100vh",
};

const headerStyle = {
  marginBottom: "28px",
};

const titleStyle = {
  margin: 0,
  color: "#0f2747",
  fontSize: "30px",
  fontWeight: "700",
};

const subtitleStyle = {
  marginTop: "8px",
  color: "#64748b",
  fontSize: "15px",
};

const formCardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "16px",
  padding: "26px",
  marginBottom: "30px",
  boxShadow: "0 4px 16px rgba(15, 39, 71, 0.04)",
};

const entriesSectionStyle = {
  marginTop: "10px",
};

const sectionHeaderStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "20px",
  marginBottom: "18px",
};

const sectionTitleStyle = {
  margin: 0,
  color: "#0f2747",
  fontSize: "20px",
  fontWeight: "700",
};

const sectionSubtitleStyle = {
  margin: "6px 0 0",
  color: "#64748b",
  fontSize: "14px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
};

const fieldStyle = {
  display: "flex",
  flexDirection: "column",
};

const fullWidthFieldStyle = {
  gridColumn: "1 / -1",
  display: "flex",
  flexDirection: "column",
};

const labelStyle = {
  marginBottom: "8px",
  color: "#334155",
  fontSize: "13px",
  fontWeight: "600",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  minHeight: "44px",
  padding: "11px 13px",
  border: "1px solid #cbd5e1",
  borderRadius: "9px",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "14px",
  outline: "none",
};

const textareaStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "12px 13px",
  border: "1px solid #cbd5e1",
  borderRadius: "9px",
  background: "#ffffff",
  color: "#0f172a",
  fontSize: "14px",
  resize: "vertical",
  fontFamily: "inherit",
  outline: "none",
};

const helperTextStyle = {
  marginTop: "6px",
  color: "#94a3b8",
  fontSize: "11px",
};

const uploadingStyle = {
  marginTop: "7px",
  color: "#64748b",
  fontSize: "12px",
};

const uploadedStyle = {
  marginTop: "10px",
  padding: "8px 10px",
  borderRadius: "8px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  color: "#166534",
  fontSize: "12px",
};

const formFooterStyle = {
  display: "flex",
  justifyContent: "flex-end",
  marginTop: "24px",
};

const buttonStyle = {
  border: "none",
  borderRadius: "9px",
  padding: "12px 20px",
  minHeight: "44px",
  background: "#1b4f8a",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "700",
};

const errorStyle = {
  marginBottom: "18px",
  padding: "12px 15px",
  borderRadius: "9px",
  background: "#fef2f2",
  border: "1px solid #fecaca",
  color: "#b91c1c",
  fontSize: "14px",
};

const successStyle = {
  marginBottom: "18px",
  padding: "12px 15px",
  borderRadius: "9px",
  background: "#f0fdf4",
  border: "1px solid #bbf7d0",
  color: "#166534",
  fontSize: "14px",
};

const countBadgeStyle = {
  padding: "7px 12px",
  borderRadius: "999px",
  background: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "13px",
  fontWeight: "700",
};

const emptyCardStyle = {
  padding: "40px",
  textAlign: "center",
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  color: "#64748b",
};

const entriesGridStyle = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "18px",
};

const entryCardStyle = {
  background: "#ffffff",
  border: "1px solid #e2e8f0",
  borderRadius: "14px",
  padding: "20px",
  boxShadow: "0 3px 12px rgba(15, 39, 71, 0.04)",
};

const entryTopStyle = {
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "space-between",
  gap: "15px",
  marginBottom: "15px",
};

const symbolStyle = {
  color: "#0f2747",
  fontSize: "18px",
  fontWeight: "700",
};

const dateStyle = {
  marginTop: "4px",
  color: "#94a3b8",
  fontSize: "12px",
};

const strategyBadgeStyle = {
  padding: "6px 10px",
  borderRadius: "999px",
  background: "#eff6ff",
  color: "#1d4ed8",
  fontSize: "12px",
  fontWeight: "700",
  whiteSpace: "nowrap",
};

const reasonStyle = {
  color: "#334155",
  fontSize: "14px",
  lineHeight: "1.6",
  marginBottom: "18px",
};

const priceGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "8px",
  marginBottom: "16px",
};

const priceBoxStyle = {
  padding: "10px",
  borderRadius: "8px",
  background: "#f8fafc",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  fontSize: "13px",
  color: "#334155",
};

const priceLabelStyle = {
  color: "#94a3b8",
  fontSize: "11px",
  fontWeight: "600",
};

const notesBoxStyle = {
  padding: "12px",
  borderRadius: "9px",
  background: "#f8fafc",
  marginBottom: "15px",
};

const notesLabelStyle = {
  color: "#475569",
  fontSize: "12px",
  fontWeight: "700",
  marginBottom: "5px",
};

const notesTextStyle = {
  color: "#64748b",
  fontSize: "13px",
  lineHeight: "1.5",
};

const screenshotContainerStyle = {
  marginTop: "16px",
  paddingTop: "15px",
  borderTop: "1px solid #e2e8f0",
};

const screenshotTitleStyle = {
  color: "#475569",
  fontSize: "12px",
  fontWeight: "700",
  marginBottom: "10px",
};

const screenshotImageStyle = {
  width: "100%",
  maxHeight: "280px",
  objectFit: "contain",
  borderRadius: "10px",
  border: "1px solid #e2e8f0",
  background: "#f8fafc",
  display: "block",
};

const screenshotLinkStyle = {
  display: "inline-block",
  marginTop: "9px",
  color: "#1b4f8a",
  fontSize: "13px",
  fontWeight: "700",
  textDecoration: "none",
};

export default Journal;