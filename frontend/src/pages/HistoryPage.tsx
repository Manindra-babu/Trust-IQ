import React, { useState, useEffect } from "react";
import { History, Trash2, Clock } from "lucide-react";

export const HistoryPage: React.FC = () => {
  const [historyItems, setHistoryItems] = useState<any[]>([]);

  const loadHistory = () => {
    try {
      const items = JSON.parse(localStorage.getItem("trustiq_history") || "[]");
      setHistoryItems(items);
    } catch {
      setHistoryItems([]);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("trustiq_history");
    setHistoryItems([]);
  };

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
          Local Session Records
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ fontSize: "1.375rem" }}>Analysis History</h1>
          {historyItems.length > 0 && (
            <button className="btn btn-secondary" style={{ fontSize: "0.75rem" }} onClick={clearHistory}>
              <Trash2 size={13} color="var(--color-danger)" />
              Purge Local History
            </button>
          )}
        </div>
        <p style={{ fontSize: "0.8125rem", marginTop: "0.2rem" }}>
          Queries and real inference results processed locally during your active sessions. Stored strictly in your browser.
        </p>
      </div>

      {historyItems.length === 0 ? (
        <div className="panel empty-state">
          <History size={32} className="empty-state-icon" />
          <h3 style={{ fontSize: "1rem" }}>No Analysis History Stored</h3>
          <p style={{ marginTop: "0.3rem", fontSize: "0.8125rem" }}>
            Submit queries in the Unified Analysis Workbench to generate inference logs.
          </p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Mode</th>
                <th>Query Text</th>
                <th>Primary Outcome</th>
                <th>Latency</th>
              </tr>
            </thead>
            <tbody>
              {historyItems.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontSize: "0.71875rem", whiteSpace: "nowrap", color: "var(--color-text-secondary)" }}>
                    {item.timestamp}
                  </td>
                  <td>
                    <span className="badge badge-primary" style={{ fontSize: "0.625rem", textTransform: "uppercase" }}>
                      {item.mode}
                    </span>
                  </td>
                  <td style={{ maxWidth: "350px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    "{item.text}"
                  </td>
                  <td>
                    <span className="badge badge-neutral" style={{ fontSize: "0.6875rem" }}>
                      {item.summary}
                    </span>
                  </td>
                  <td style={{ fontSize: "0.71875rem", whiteSpace: "nowrap" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      <Clock size={11} color="var(--color-text-muted)" />
                      {item.latency_ms} ms
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
