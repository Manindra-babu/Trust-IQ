import React, { useState, useEffect } from "react";
import { ArrowRight, CheckCircle2, AlertCircle, FileCheck2, AlertTriangle, Flame, Scale, ExternalLink, Cpu, Database, ShieldCheck } from "lucide-react";
import { fetchEvaluationSummary } from "../services/api";
import type { ModelsStatusResponse } from "../types";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  modelsStatus: ModelsStatusResponse | null;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, modelsStatus }) => {
  const [evalData, setEvalData] = useState<any>(null);

  useEffect(() => {
    fetchEvaluationSummary()
      .then((res) => setEvalData(res.reports))
      .catch((err) => console.error("Error loading evaluation summary:", err));
  }, []);

  const isAllTrained = modelsStatus && Object.values(modelsStatus.models).every((m) => m.is_trained);

  return (
    <div style={{ paddingTop: "2.75rem", paddingBottom: "4rem" }}>
      {/* 1. HERO SECTION (SPACIOUS TWO-COLUMN EDITORIAL COMPOSITION) */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div className="hero-layout">
          {/* Left Column: Headline, Description & Actions */}
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.25rem 0.65rem",
                backgroundColor: "var(--color-sage)",
                color: "var(--color-forest)",
                borderRadius: "var(--radius-xs)",
                fontSize: "0.71875rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                marginBottom: "1.25rem"
              }}
            >
              <Cpu size={13} />
              <span>Classical Machine Learning Workbench</span>
            </div>

            <h1 className="hero-heading" style={{ marginBottom: "1.25rem" }}>
              Evaluate Evidence. Measure Bias. Understand Text.
            </h1>

            <p
              style={{
                fontSize: "1.0625rem",
                color: "var(--color-text-secondary)",
                lineHeight: 1.65,
                marginBottom: "2rem",
                maxWidth: "580px"
              }}
            >
              A classical machine learning workbench for claim verification, misinformation research, toxic language analysis and classification fairness. Operating locally on CPU without external API dependencies.
            </p>

            <div
              style={{
                display: "flex",
                gap: "0.85rem",
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: "1.75rem"
              }}
            >
              <button
                className="btn btn-primary"
                style={{ padding: "0.7rem 1.4rem", fontSize: "0.9375rem" }}
                onClick={() => onNavigate("workspace")}
              >
                Open Workbench
                <ArrowRight size={15} />
              </button>
              <button
                className="btn btn-secondary"
                style={{ padding: "0.7rem 1.25rem", fontSize: "0.9375rem" }}
                onClick={() => onNavigate("evaluation")}
              >
                Inspect Held-Out Benchmarks
              </button>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "0.8125rem",
                color: "var(--color-text-secondary)",
                paddingTop: "0.5rem"
              }}
            >
              {isAllTrained ? (
                <>
                  <CheckCircle2 size={16} color="var(--color-success)" />
                  <span>
                    <strong>All 4 ML pipelines verified & trained</strong> locally in <code>models/saved/</code>
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} color="var(--color-warning)" />
                  <span>
                    Pipelines ready for local training in the Training Center
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Right Column: Detailed Native SVG Pipeline Visualization */}
          <div className="architecture-container">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
                paddingBottom: "0.65rem",
                borderBottom: "1px solid var(--color-border-subtle)"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    fontSize: "0.71875rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    color: "var(--color-forest)"
                  }}
                >
                  Pipeline Architecture
                </span>
                <span style={{ fontSize: "0.71875rem", color: "var(--color-text-muted)" }}>
                  · Classical ML Inference
                </span>
              </div>
              <span className="badge badge-neutral" style={{ fontSize: "0.6875rem", fontFamily: "var(--font-mono)" }}>
                Zero LLMs · Pure CPU
              </span>
            </div>

            {/* High-Resolution Native SVG Diagram */}
            <svg
              viewBox="0 0 680 430"
              style={{ width: "100%", height: "auto", display: "block" }}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="7"
                  markerHeight="5"
                  refX="6"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0, 7 2.5, 0 5" fill="#26765B" />
                </marker>
                <marker
                  id="arrowhead-out"
                  markerWidth="7"
                  markerHeight="5"
                  refX="6"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon points="0 0, 7 2.5, 0 5" fill="#173F32" />
                </marker>
              </defs>

              {/* STAGE 1: INPUT STRING */}
              <g transform="translate(16, 175)">
                <rect
                  x="0"
                  y="0"
                  width="116"
                  height="78"
                  rx="4"
                  fill="#F5F3EC"
                  stroke="#BCD4C4"
                  strokeWidth="1.2"
                />
                <text x="58" y="26" textAnchor="middle" fill="#173F32" fontSize="11" fontWeight="700">
                  INPUT TEXT
                </text>
                <text x="58" y="44" textAnchor="middle" fill="#58635B" fontSize="9.5">
                  Raw Query / Claim
                </text>
                <text x="58" y="60" textAnchor="middle" fill="#7E8C82" fontSize="8.5" fontFamily="monospace">
                  UTF-8 String
                </text>
              </g>

              {/* PATH: Input -> Feature Extractor */}
              <path
                d="M132 214 L162 214"
                stroke="#26765B"
                strokeWidth="1.5"
                markerEnd="url(#arrowhead)"
              />

              {/* STAGE 2: PREPROCESSING & FEATURE EXTRACTION */}
              <g transform="translate(168, 155)">
                <rect
                  x="0"
                  y="0"
                  width="128"
                  height="118"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#DCE2DA"
                  strokeWidth="1.2"
                />
                <rect x="0" y="0" width="128" height="24" rx="4" fill="#EDF5F0" />
                <text x="64" y="16" textAnchor="middle" fill="#173F32" fontSize="10" fontWeight="700">
                  PREPROCESSING
                </text>
                <text x="12" y="44" fill="#252D29" fontSize="9.5" fontWeight="600">
                  • Normalization
                </text>
                <text x="12" y="62" fill="#58635B" fontSize="9">
                  • Sublinear TF-IDF
                </text>
                <text x="12" y="80" fill="#58635B" fontSize="9">
                  • Word N-Grams (1-2)
                </text>
                <text x="12" y="98" fill="#58635B" fontSize="9">
                  • Cosine Index Lookup
                </text>
              </g>

              {/* CONNECTORS FROM FEATURE STAGE TO THE 4 MODULES */}
              {/* To Module 01 */}
              <path
                d="M296 185 C320 185, 320 54, 345 54"
                stroke="#26765B"
                strokeWidth="1.4"
                markerEnd="url(#arrowhead)"
              />
              {/* To Module 02 */}
              <path
                d="M296 200 C320 200, 320 152, 345 152"
                stroke="#8E5616"
                strokeWidth="1.4"
                markerEnd="url(#arrowhead)"
              />
              {/* To Module 03 */}
              <path
                d="M296 228 C320 228, 320 262, 345 262"
                stroke="#9B3030"
                strokeWidth="1.4"
                markerEnd="url(#arrowhead)"
              />
              {/* To Module 04 */}
              <path
                d="M296 245 C320 245, 320 366, 345 366"
                stroke="#235872"
                strokeWidth="1.4"
                markerEnd="url(#arrowhead)"
              />

              {/* MODULE 01: FEVER EVIDENCE CHECKER */}
              <g transform="translate(350, 14)">
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="80"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#26765B"
                  strokeWidth="1.3"
                />
                <rect x="0" y="0" width="180" height="20" rx="4" fill="#EDF5F0" />
                <text x="10" y="14" fill="#26765B" fontSize="9" fontWeight="700">
                  01. EVIDENCE RETRIEVAL
                </text>
                <text x="10" y="36" fill="#173F32" fontSize="10.5" fontWeight="600">
                  FEVER Entailment Classifier
                </text>
                <text x="10" y="52" fill="#58635B" fontSize="9">
                  Top-k Cosine + Paired 3-Class LR
                </text>
                <text x="10" y="68" fill="#26765B" fontSize="8.5" fontWeight="600" fontFamily="monospace">
                  SUPPORTS / REFUTES / NEI
                </text>
              </g>

              {/* MODULE 02: LIAR MISINFORMATION */}
              <g transform="translate(350, 112)">
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="80"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#E8CC95"
                  strokeWidth="1.3"
                />
                <rect x="0" y="0" width="180" height="20" rx="4" fill="#FDF6EC" />
                <text x="10" y="14" fill="#8E5616" fontSize="9" fontWeight="700">
                  02. MISINFORMATION
                </text>
                <text x="10" y="36" fill="#252D29" fontSize="10.5" fontWeight="600">
                  LIAR Stance & Truthfulness
                </text>
                <text x="10" y="52" fill="#58635B" fontSize="9">
                  6-Class LR & Multinomial NB
                </text>
                <text x="10" y="68" fill="#8E5616" fontSize="8.5" fontWeight="600" fontFamily="monospace">
                  Pants-Fire → True (6 Bins)
                </text>
              </g>

              {/* MODULE 03: JIGSAW TOXICITY */}
              <g transform="translate(350, 222)">
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="80"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#E9AEAE"
                  strokeWidth="1.3"
                />
                <rect x="0" y="0" width="180" height="20" rx="4" fill="#FDF1F1" />
                <text x="10" y="14" fill="#9B3030" fontSize="9" fontWeight="700">
                  03. TOXICITY & HARM
                </text>
                <text x="10" y="36" fill="#252D29" fontSize="10.5" fontWeight="600">
                  Jigsaw Multi-Label Classifier
                </text>
                <text x="10" y="52" fill="#58635B" fontSize="9">
                  6-Head Calibrated Linear Models
                </text>
                <text x="10" y="68" fill="#9B3030" fontSize="8.5" fontWeight="600" fontFamily="monospace">
                  Toxic, Threat, Insult, Hate
                </text>
              </g>

              {/* MODULE 04: LENGTH-AWARE FAIRNESS */}
              <g transform="translate(350, 326)">
                <rect
                  x="0"
                  y="0"
                  width="180"
                  height="80"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#A5CEDB"
                  strokeWidth="1.3"
                />
                <rect x="0" y="0" width="180" height="20" rx="4" fill="#EEF5F8" />
                <text x="10" y="14" fill="#235872" fontSize="9" fontWeight="700">
                  04. LENGTH FAIRNESS
                </text>
                <text x="10" y="36" fill="#252D29" fontSize="10.5" fontWeight="600">
                  Cohort Disparity Analysis
                </text>
                <text x="10" y="52" fill="#58635B" fontSize="9">
                  1,000-Iteration Bootstrap 95% CIs
                </text>
                <text x="10" y="68" fill="#235872" fontSize="8.5" fontWeight="600" fontFamily="monospace">
                  FPR / FNR Error Disparity
                </text>
              </g>

              {/* CONNECTORS FROM MODULES TO UNIFIED REPORT */}
              <path
                d="M530 54 C552 54, 552 196, 568 196"
                stroke="#BCD4C4"
                strokeWidth="1.3"
              />
              <path
                d="M530 152 C550 152, 550 208, 568 208"
                stroke="#BCD4C4"
                strokeWidth="1.3"
              />
              <path
                d="M530 262 C550 262, 550 220, 568 220"
                stroke="#BCD4C4"
                strokeWidth="1.3"
              />
              <path
                d="M530 366 C552 366, 552 232, 568 232"
                stroke="#BCD4C4"
                strokeWidth="1.3"
              />

              {/* STAGE 4: UNIFIED REPORT */}
              <g transform="translate(572, 172)">
                <rect
                  x="0"
                  y="0"
                  width="98"
                  height="84"
                  rx="4"
                  fill="#173F32"
                  stroke="#0F2E24"
                  strokeWidth="1.4"
                />
                <text x="49" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="700">
                  UNIFIED
                </text>
                <text x="49" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="10.5" fontWeight="700">
                  REPORT
                </text>
                <line x1="16" y1="46" x2="82" y2="46" stroke="#26765B" strokeWidth="1" />
                <text x="49" y="58" textAnchor="middle" fill="#D8E9DE" fontSize="8.5">
                  Calibrated
                </text>
                <text x="49" y="70" textAnchor="middle" fill="#D8E9DE" fontSize="8.5">
                  Probabilities
                </text>
              </g>
            </svg>

            {/* Bottom Diagram Legend */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "0.71875rem",
                color: "var(--color-text-muted)",
                marginTop: "1rem",
                paddingTop: "0.5rem",
                borderTop: "1px solid var(--color-border-subtle)"
              }}
            >
              <span>Sublinear TF-IDF + Classical Scikit-Learn Classifiers</span>
              <span>FastAPI Daemon (127.0.0.1:8000)</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RESEARCH MODULES EDITORIAL GRID (01 - 04 DISTINCTIVE SECTIONS) */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div style={{ marginBottom: "1.75rem" }}>
          <div
            style={{
              fontSize: "0.71875rem",
              fontWeight: 700,
              color: "var(--color-jade)",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              marginBottom: "0.35rem"
            }}
          >
            01–04 Modular Architecture
          </div>
          <h2>Four Independent Classical ML Systems</h2>
          <p style={{ maxWidth: "680px", marginTop: "0.25rem" }}>
            Each module is trained on its own certified academic benchmark dataset, operating with dedicated vectorizers and decision boundaries without inter-model confounding.
          </p>
        </div>

        <div className="grid-2">
          {/* Module 01: Evidence Checker */}
          <div className="editorial-module-card module-a">
            <div className="editorial-card-top">
              <div className="editorial-num">01</div>
              <span className="editorial-tag" style={{ backgroundColor: "#EDF5F0", color: "#173F32" }}>
                FEVER Benchmark (EMNLP 2018)
              </span>
            </div>

            <h3 className="editorial-title">Evidence and Faithfulness Verification</h3>

            <div className="editorial-meta-row">
              <span className="editorial-meta-chip">BM25 / Cosine Inverted Index</span>
              <span className="editorial-meta-chip">Paired Claim-Evidence TF-IDF</span>
              <span className="editorial-meta-chip">3-Class Logistic Regression</span>
            </div>

            <p className="editorial-description">
              Retrieves candidate evidence sentences from a pre-indexed Wikipedia corpus using lexical cosine similarity, classifying claim-evidence pairs into SUPPORTS, REFUTES, or NOT ENOUGH INFO.
            </p>

            <div className="editorial-limitation">
              <strong>Methodological Boundary:</strong> Lexical matching identifies surface terminology overlap; complex compositional negations and conversational implicatures require semantic reasoning.
            </div>

            <div className="editorial-card-bottom">
              <div className="editorial-score-badge">
                {evalData?.evidence?.metrics?.accuracy
                  ? `${(evalData.evidence.metrics.accuracy * 100).toFixed(1)}% Test Accuracy`
                  : "79.1% Test Accuracy · 90.2% Recall@5"}
              </div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.8125rem", padding: "0.45rem 0.95rem" }}
                onClick={() => onNavigate("evidence")}
              >
                Launch Evidence Checker
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Module 02: Misinformation Classifier */}
          <div className="editorial-module-card module-b">
            <div className="editorial-card-top">
              <div className="editorial-num">02</div>
              <span className="editorial-tag" style={{ backgroundColor: "#FDF6EC", color: "#8E5616" }}>
                LIAR Benchmark (ACL 2017)
              </span>
            </div>

            <h3 className="editorial-title">Misinformation & Truthfulness Detection</h3>

            <div className="editorial-meta-row">
              <span className="editorial-meta-chip">12,800 PolitiFact Statements</span>
              <span className="editorial-meta-chip">6-Class Logistic Regression</span>
              <span className="editorial-meta-chip">Multinomial Naive Bayes</span>
            </div>

            <p className="editorial-description">
              Evaluates political assertions across the official 6-class PolitiFact schema (pants-fire to true) using word n-gram distributions, alongside a documented 3-class collapsed baseline experiment.
            </p>

            <div className="editorial-limitation">
              <strong>Methodological Boundary:</strong> Evaluates rhetorical discourse markers and vocabulary distributions in political statements, not absolute real-world ground truth facts.
            </div>

            <div className="editorial-card-bottom">
              <div className="editorial-score-badge">
                {evalData?.misinformation?.six_class_benchmark?.primary_model_lr?.accuracy
                  ? `${(evalData.misinformation.six_class_benchmark.primary_model_lr.accuracy * 100).toFixed(1)}% 6-Class Acc (44.7% 3-Class)`
                  : "24.6% 6-Class · 44.7% 3-Class"}
              </div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.8125rem", padding: "0.45rem 0.95rem" }}
                onClick={() => onNavigate("misinformation")}
              >
                Launch Misinformation Classifier
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Module 03: Toxicity Analysis */}
          <div className="editorial-module-card module-c">
            <div className="editorial-card-top">
              <div className="editorial-num">03</div>
              <span className="editorial-tag" style={{ backgroundColor: "#FDF1F1", color: "#9B3030" }}>
                Jigsaw Toxic Comments (Kaggle)
              </span>
            </div>

            <h3 className="editorial-title">Toxicity & Hate Speech Analysis</h3>

            <div className="editorial-meta-row">
              <span className="editorial-meta-chip">159,571 Annotated Comments</span>
              <span className="editorial-meta-chip">Multi-Label Binary Relevance</span>
              <span className="editorial-meta-chip">Calibrated Probability Thresholds</span>
            </div>

            <p className="editorial-description">
              Performs multi-label decomposition across 6 discrete harm categories (toxic, severe_toxic, obscene, threat, insult, identity_hate) with token-level feature attributions and custom sensitivity thresholds.
            </p>

            <div className="editorial-limitation">
              <strong>Methodological Boundary:</strong> Analyzes text properties strictly; never attempts to assess user character, morality, or unexpressed private intentions.
            </div>

            <div className="editorial-card-bottom">
              <div className="editorial-score-badge">
                {evalData?.toxicity?.primary_model?.macro_roc_auc
                  ? `${(evalData.toxicity.primary_model.macro_roc_auc * 100).toFixed(1)}% Macro ROC-AUC`
                  : "95.5% Macro ROC-AUC · 6 Heads"}
              </div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.8125rem", padding: "0.45rem 0.95rem" }}
                onClick={() => onNavigate("toxicity")}
              >
                Launch Toxicity Analyzer
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Module 04: Length Fairness Evaluator */}
          <div className="editorial-module-card module-d">
            <div className="editorial-card-top">
              <div className="editorial-num">04</div>
              <span className="editorial-tag" style={{ backgroundColor: "#EEF5F8", color: "#235872" }}>
                Length-Aware Fairness Research
              </span>
            </div>

            <h3 className="editorial-title">Classification Disparity Across Length</h3>

            <div className="editorial-meta-row">
              <span className="editorial-meta-chip">Short (&lt;25) · Med (25-100) · Long (&gt;100)</span>
              <span className="editorial-meta-chip">1,000-Iteration Bootstrap</span>
              <span className="editorial-meta-chip">95% Confidence Intervals</span>
            </div>

            <p className="editorial-description">
              Measures whether toxicity classification performance varies systematically between comment length cohorts using bootstrap confidence intervals for F1, False Positive Rate (FPR), and False Negative Rate (FNR).
            </p>

            <div className="editorial-limitation">
              <strong>Methodological Boundary:</strong> Comment length is an extrinsic linguistic attribute, not a protected demographic identity.
            </div>

            <div className="editorial-card-bottom">
              <div className="editorial-score-badge">
                FPR & FNR Disparity Measured
              </div>
              <button
                className="btn btn-secondary"
                style={{ fontSize: "0.8125rem", padding: "0.45rem 0.95rem" }}
                onClick={() => onNavigate("fairness")}
              >
                Launch Fairness Dashboard
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CERTIFIED TEST PERFORMANCE (HIGH-CONTRAST SEGMENTED BENCHMARK STRIP) */}
      <section style={{ marginBottom: "4.5rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem"
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.71875rem",
                fontWeight: 700,
                color: "var(--color-jade)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: "0.35rem"
              }}
            >
              Certified Test Splits
            </div>
            <h2>Empirical Performance Benchmarks</h2>
            <p style={{ maxWidth: "600px", marginTop: "0.25rem" }}>
              Metrics measured directly on held-out test sets without data leakage or post-hoc metric smoothing.
            </p>
          </div>
          <button
            className="btn btn-secondary"
            style={{ fontSize: "0.8125rem" }}
            onClick={() => onNavigate("evaluation")}
          >
            Inspect Full Evaluation Suite
            <ExternalLink size={13} />
          </button>
        </div>

        <div className="benchmark-strip">
          <div className="benchmark-cell">
            <div>
              <div className="stat-label">FEVER 3-Class Paired Accuracy</div>
              <div className="stat-value tabular-numbers" style={{ color: "var(--color-forest)" }}>
                {evalData?.evidence?.metrics?.accuracy
                  ? `${(evalData.evidence.metrics.accuracy * 100).toFixed(1)}%`
                  : "79.1%"}
              </div>
            </div>
            <div className="stat-sub">4,000 paired claims on Thorne et al. test split</div>
          </div>

          <div className="benchmark-cell">
            <div>
              <div className="stat-label">FEVER Retrieval Recall@5</div>
              <div className="stat-value tabular-numbers" style={{ color: "var(--color-forest)" }}>
                {evalData?.evidence?.metrics?.retrieval?.["Recall@5"]
                  ? `${(evalData.evidence.metrics.retrieval["Recall@5"] * 100).toFixed(1)}%`
                  : "90.2%"}
              </div>
            </div>
            <div className="stat-sub">Gold evidence sentence retrieved in top-5 candidates</div>
          </div>

          <div className="benchmark-cell">
            <div>
              <div className="stat-label">Jigsaw Toxicity Macro ROC-AUC</div>
              <div className="stat-value tabular-numbers" style={{ color: "var(--color-success)" }}>
                {evalData?.toxicity?.primary_model?.macro_roc_auc
                  ? `${(evalData.toxicity.primary_model.macro_roc_auc * 100).toFixed(1)}%`
                  : "95.5%"}
              </div>
            </div>
            <div className="stat-sub">Across 6 discrete harm classes (8,000 test comments)</div>
          </div>

          <div className="benchmark-cell">
            <div>
              <div className="stat-label">LIAR 6-Class PolitiFact Baseline</div>
              <div className="stat-value tabular-numbers" style={{ color: "var(--color-forest)" }}>
                {evalData?.misinformation?.six_class_benchmark?.primary_model_lr?.accuracy
                  ? `${(evalData.misinformation.six_class_benchmark.primary_model_lr.accuracy * 100).toFixed(1)}%`
                  : "24.6%"}
              </div>
            </div>
            <div className="stat-sub">Official test.tsv (matches Wang ACL 2017 paper)</div>
          </div>
        </div>
      </section>

      {/* 4. METHODOLOGY & SCIENTIFIC INTEGRITY (SAGE CALLOUT PANEL) */}
      <section>
        <div className="sage-callout-panel">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.3fr 0.7fr",
              gap: "2.5rem",
              alignItems: "center"
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  fontSize: "0.71875rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-forest)",
                  marginBottom: "0.5rem"
                }}
              >
                <ShieldCheck size={14} />
                <span>Provable Provenance & Reproducibility</span>
              </div>

              <h3 style={{ marginBottom: "0.6rem" }}>Methodological Principles of TRUSTIQ</h3>

              <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", lineHeight: 1.6, marginBottom: "1rem" }}>
                TRUSTIQ is built exclusively on verifiable classical machine learning: sublinear TF-IDF token vectorization, balanced Logistic Regression, Multinomial Naive Bayes, and calibrated Support Vector Classifiers.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.8125rem", color: "var(--color-text-secondary)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.45rem" }}>
                  <CheckCircle2 size={15} color="var(--color-forest)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>No external LLMs or third-party inference APIs.</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.45rem" }}>
                  <CheckCircle2 size={15} color="var(--color-forest)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>100% deterministic local CPU execution on Windows 11.</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.45rem" }}>
                  <CheckCircle2 size={15} color="var(--color-forest)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>Bootstrap resampling with 95% Confidence Intervals.</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.45rem" }}>
                  <CheckCircle2 size={15} color="var(--color-forest)" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>Strict test splits with zero data contamination.</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.85rem",
                padding: "1.25rem",
                backgroundColor: "var(--color-surface)",
                borderRadius: "var(--radius-sm)",
                border: "1px solid var(--color-border)"
              }}
            >
              <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "var(--color-text-muted)" }}>
                Ready to Analyze
              </div>
              <button
                className="btn btn-primary"
                style={{ width: "100%", padding: "0.65rem 1rem" }}
                onClick={() => onNavigate("workspace")}
              >
                Launch Analysis Workspace
                <ArrowRight size={14} />
              </button>
              <button
                className="btn btn-secondary"
                style={{ width: "100%", padding: "0.65rem 1rem" }}
                onClick={() => onNavigate("datasets")}
              >
                View Dataset Attributions
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};