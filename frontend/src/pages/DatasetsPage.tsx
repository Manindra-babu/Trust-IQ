import React, { useState, useEffect } from "react";
import { Database, CheckCircle2, AlertCircle, ExternalLink } from "lucide-react";
import { fetchDatasets } from "../services/api";
import type { DatasetsResponse } from "../types";

export const DatasetsPage: React.FC = () => {
  const [data, setData] = useState<DatasetsResponse | null>(null);

  useEffect(() => {
    fetchDatasets()
      .then((res) => setData(res))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <div style={{ marginBottom: "1.25rem" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: "var(--color-primary)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.2rem" }}>
          Data Management Layer
        </div>
        <h1 style={{ fontSize: "1.375rem", marginBottom: "0.2rem" }}>Official Benchmark Datasets & Manifest</h1>
        <p style={{ fontSize: "0.8125rem" }}>
          Inspect official research corpora, verified local file paths, licensing provenance, and sample statistics.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
        {data?.datasets.map((ds, idx) => (
          <div key={idx} className="panel">
            <div className="panel-header">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <Database size={16} color="var(--color-primary)" />
                <span style={{ fontWeight: 600, fontSize: "0.9375rem" }}>{ds.name}</span>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {ds.is_downloaded ? (
                  <span className="badge badge-success">
                    <CheckCircle2 size={11} /> Local File Present
                  </span>
                ) : (
                  <span className="badge badge-warning">
                    <AlertCircle size={11} /> Download Required
                  </span>
                )}
                <a
                  href={ds.source_url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ fontSize: "0.6875rem", padding: "0.2rem 0.45rem" }}
                >
                  Source <ExternalLink size={11} />
                </a>
              </div>
            </div>

            <p style={{ fontSize: "0.8125rem", color: "var(--color-text-secondary)", marginBottom: "0.65rem" }}>
              {ds.description}
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", padding: "0.65rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)", fontSize: "0.75rem" }}>
              <div>
                <span style={{ color: "var(--color-text-secondary)" }}>Local Verified Path:</span>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", marginTop: "0.15rem", wordBreak: "break-all" }}>
                  {ds.local_path}
                </div>
              </div>
              <div>
                <span style={{ color: "var(--color-text-secondary)" }}>Verified Samples Count:</span>
                <div style={{ fontWeight: 700, marginTop: "0.15rem" }}>
                  {ds.samples ? ds.samples.toLocaleString() : "Pending"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preparation Command Guide */}
      <div className="panel">
        <div className="panel-header">
          <span className="panel-title">Automated Dataset Preparation Script</span>
          <span className="badge badge-neutral">CLI Guide</span>
        </div>
        <p style={{ fontSize: "0.8125rem", marginBottom: "0.6rem" }}>
          To download or re-verify the official datasets, run:
        </p>
        <pre style={{ padding: "0.65rem 0.85rem", backgroundColor: "var(--color-surface-subtle)", borderRadius: "var(--radius-xs)", border: "1px solid var(--color-border)", overflowX: "auto" }}>
          python scripts/prepare_datasets.py
        </pre>
      </div>
    </div>
  );
};
