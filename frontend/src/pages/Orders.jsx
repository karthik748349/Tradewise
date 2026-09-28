import { useEffect, useState } from "react";
import axios from "axios";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not authenticated.");
      setLoading(false);
      return;
    }

    axios
      .get("http://localhost:8081/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setOrders(response.data);
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        setError("Failed to load order history.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const formatCurrency = (value) => {
    return `₹${Number(value || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (loading) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Order History</h2>
        <p>Loading orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "30px" }}>
        <h2>Order History</h2>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "8px" }}>Order History</h2>

      <p style={{ color: "#64748b", marginBottom: "24px" }}>
        View all your paper trading transactions.
      </p>

      {orders.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            background: "#ffffff",
          }}
        >
          <h3>No orders yet</h3>
          <p style={{ color: "#64748b" }}>
            Your BUY and SELL transactions will appear here.
          </p>
        </div>
      ) : (
        <div
          style={{
            overflowX: "auto",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              minWidth: "850px",
            }}
          >
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                <th style={thStyle}>Symbol</th>
                <th style={thStyle}>Type</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Execution Price</th>
                <th style={thStyle}>Total Amount</th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Date</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td style={tdStyle}>
                    <strong>{order.symbol}</strong>
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#64748b",
                        marginTop: "3px",
                      }}
                    >
                      {order.companyName}
                    </div>
                  </td>

                  <td style={tdStyle}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 10px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "700",
                        background:
                          order.orderType === "BUY"
                            ? "#dcfce7"
                            : "#fee2e2",
                        color:
                          order.orderType === "BUY"
                            ? "#166534"
                            : "#991b1b",
                      }}
                    >
                      {order.orderType}
                    </span>
                  </td>

                  <td style={tdStyle}>{order.quantity}</td>

                  <td style={tdStyle}>
                    {formatCurrency(order.executionPrice)}
                  </td>

                  <td style={tdStyle}>
                    <strong>{formatCurrency(order.totalAmount)}</strong>
                  </td>

                  <td style={tdStyle}>{order.status}</td>

                  <td style={tdStyle}>
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const thStyle = {
  padding: "14px 16px",
  textAlign: "left",
  fontSize: "13px",
  color: "#475569",
  borderBottom: "1px solid #e2e8f0",
  whiteSpace: "nowrap",
};

const tdStyle = {
  padding: "14px 16px",
  borderBottom: "1px solid #f1f5f9",
  fontSize: "14px",
  color: "#1e293b",
  whiteSpace: "nowrap",
};

export default Orders;