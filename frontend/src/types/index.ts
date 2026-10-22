export interface RetrievedEvidenceItem {
  id: string;
  wiki_title: string;
  sentence_id: number;
  text: string;
  relevance_score: number;
  provenance: string;
}

export interface EvidenceResult {
  is_trained: boolean;
  claim: string;
  predicted_label: string | null;
  confidence_scores: Record<string, number> | null;
  retrieved_evidence: RetrievedEvidenceItem[];
  retrieval_status: string;
  limitations: string[];
}

export interface MisinformationResult {
  is_trained: boolean;
  statement: string;
  predicted_label_6class: string | null;
  confidence_scores_6class: Record<string, number> | null;
  predicted_label_3class: string | null;
  model_comparison_baseline: string | null;
  warning: string;
  limitations: string[];
}

export interface ToxicityCategory {
  label: string;
  probability: number;
  is_positive: boolean;
  threshold: number;
}

export interface ToxicityResult {
  is_trained: boolean;
  comment: string;
  token_count: number;
  length_cohort: string;
  overall_toxic: boolean;
  categories: Record<string, ToxicityCategory>;
  influential_tokens: string[];
  warning: string;
}

export interface UnifiedAnalysisResponse {
  input_text: string;
  processing_time_ms: number;
  timestamp: string;
  evidence: EvidenceResult | null;
  misinformation: MisinformationResult | null;
  toxicity: ToxicityResult | null;
  system_readiness: Record<string, boolean>;
}

export interface ModelStatusItem {
  module: string;
  is_trained: boolean;
  files_present: string[];
  evaluation_available: boolean;
}

export interface ModelsStatusResponse {
  models: Record<string, ModelStatusItem>;
}

export interface DatasetInfoItem {
  name: string;
  source_url: string;
  is_downloaded: boolean;
  local_path: string;
  samples: number | null;
  description: string;
}

export interface DatasetsResponse {
  datasets: DatasetInfoItem[];
}

export interface FairnessReport {
  module: string;
  dataset: string;
  target_label: string;
  timestamp: string;
  boundaries: Record<string, string>;
  groups: Record<string, {
    samples: number;
    positive_count: number;
    negative_count: number;
    base_rate: number;
    precision: number;
    recall: number;
    f1_score: number;
    fpr: number;
    fnr: number;
    confusion_matrix: { tn: number; fp: number; fn: number; tp: number };
    confidence_intervals_95: {
      f1_ci: [number, number];
      fpr_ci: [number, number];
      fnr_ci: [number, number];
    };
    token_statistics: { min: number; median: number; mean: number; max: number };
  }>;
  disparities: {
    delta_f1_short_vs_long: number;
    delta_fpr_short_vs_long: number;
    largest_metric_difference: string;
    statistical_gap_verdict: string;
  };
  research_questions: {
    q1_performance_difference: string;
    q2_largest_differences: string;
    q3_sufficient_data: string;
    q4_frequent_errors: string;
    q5_limitations: string;
  };
}

export interface EvaluationSummaryResponse {
  status: string;
  reports: {
    evidence: any;
    misinformation: any;
    toxicity: any;
    fairness: FairnessReport | null;
  };
}

export interface TrainingStatusResponse {
  is_training: boolean;
  current_module: string | null;
  status: string;
  last_error: string | null;
  recent_logs: string[];
}
