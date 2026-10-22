import React, { useState, useEffect } from "react";
import { RefreshCw, Terminal, Play, Cpu } from "lucide-react";
import { startTraining, fetchTrainingStatus } from "../services/api";
import type { TrainingStatusResponse } from "../types";

export const TrainingPage: React.FC = () => {
  const [selectedModule, setSelectedModule] = useState<string>("all");
  const [status, setStatus] = useState<TrainingStatusResponse | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const pollStatus = async () => {
    try {
      const data = await fetchTrainingStatus();
      setStatus(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    pollStatus();
    const interval = setInterval(pollStatus, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleStart = async () => {
    setIsStarting(true);
    setMessage(null);
    try {
      const res = await startTraining(selectedModule);
      setMessage(res.message);
      await pollStatus();
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
          ML Operations
        </div>
        <h1 style={{ fontSize: "1.375rem", marginBottom: "0.2rem" }}>Model Training & Serialization Center</h1>
        <p style={{ fontSize: "0.8125rem" }}>
          Train and evaluate classical machine learning models locally on your CPU. Persists estimators via joblib.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.25rem" }}>
        {/* Launcher Panel */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">
              <Cpu size={16} color="var(--color-primary)" />
              Train Artifacts
            </span>
            <span className="badge badge-primary">Local CPU Execution</span>
          </div>

          <div className="form-group">
            <label className="form-label">Select Target Module</label>
            <select
              className="form-control"
              value={selectedModule}
              onChange={(e) => setSelectedModule(e.target.value)}
              disabled={status?.is_training}
            >
              <option value="all">Train All 4 Modules Sequentially</option>
              <option value="evidence">Module A: FEVER Evidence Verification</option>
              <option value="misinformation">Module B: LIAR Misinformation Models</option>
              <option value="toxicity">Module C: Jigsaw Multi-Label Toxicity</option>
              <option value="fairness">Module D: Length-Aware Fairness Evaluator</option>
            </select>
          </div>

          <p style={{ fontSize: "0.78125rem", color: "var(--color-text-secondary)", marginBottom: "1rem" }}>
            Training runs as a non-blocking background thread on the FastAPI backend. You can continue using other views.
          </p>

          <button
            className="btn btn-primary"
            onClick={handleStart}
            disabled={status?.is_training || isStarting}
            style={{ width: "100%", padding: "0.55rem 1rem" }}
          >
            {status?.is_training ? (
              <>
                <RefreshCw size={14} style={{ animation: "spin 1s linear infinite" }} />
                Training in Progress...
              </>
            ) : (
              <>
                <Play size={14} />
                Execute Training Pipeline
              </>
            )}
          </button>

          {message && (
            <div style={{ marginTop: "0.75rem", fontSize: "0.78125rem", color: "var(--color-primary)", fontWeight: 600 }}>
              {message}
            </div>
          )}
        </div>

        {/* Engine Status */}
        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">Engine Lifecycle Status</span>
            <span className={`badge ${status?.is_training ? "badge-warning" : status?.status === "completed" ? "badge-success" : "badge-neutral"}`}>
              {status?.status ? status.status.toUpperCase() : "IDLE"}
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.78125rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Active Training Job:</span>
              <span style={{ fontWeight: 600 }}>{status?.is_training ? "Yes" : "No"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-secondary)" }}>Target Component:</span>
              <span style={{ fontWeight: 600 }}>{status?.current_module || "None"}</span>
            </div>
            {status?.last_error && (
              <div style={{ color: "var(--color-danger)", fontSize: "0.75rem" }}>
                Error: {status.last_error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">
            <Terminal size={15} />
            Real-Time Training Logs
          </span>
          <button className="btn btn-secondary" style={{ fontSize: "0.6875rem", padding: "0.15rem 0.45rem" }} onClick={pollStatus}>
            Refresh
          </button>
        </div>

        <div
          style={{
            backgroundColor: "#1A211D",
            color: "#D2DDD5",
            padding: "0.85rem",
            borderRadius: "var(--radius-xs)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.71875rem",
            maxHeight: "260px",
            overflowY: "auto",
            lineHeight: 1.55
          }}
        >
          {status?.recent_logs && status.recent_logs.length > 0 ? (
            status.recent_logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))
          ) : (
            <div style={{ color: "#748579" }}>No active training session. Start a training job to view real-time log output.</div>
          )}
        </div>
      </div>
    </div>
  );
};
