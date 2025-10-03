/**
 * Core types for quality check system
 */

export interface QualityCheckContext {
  /** All records being analyzed */
  records: any[];
  /** Field path (e.g., "metadata.logo") */
  fieldPath: string;
  /** All values for this field across all records */
  values: any[];
  /** Total number of records */
  total: number;
}

export type CheckStatus = 'pass' | 'warn' | 'fail';

export interface QualityCheckResult {
  /** Name of the check that produced this result */
  checkName: string;
  /** Field path this result is for */
  fieldPath: string;
  /** Status of the check */
  status: CheckStatus;
  /** Numeric or string value */
  value: number | string | boolean;
  /** Human-readable message */
  message: string;
  /** Optional recommendation for the user */
  recommendation?: string;
  /** Optional metadata for custom rendering */
  metadata?: Record<string, any>;
}

export interface QualityCheckSummary {
  /** Overall score (0-100) */
  score: number;
  /** Human-readable summary */
  summary: string;
  /** Additional details */
  details?: Record<string, any>;
}

export interface QualityCheck {
  /** Unique name for this check */
  name: string;
  /** Human-readable description */
  description: string;
  /** Whether this check is enabled */
  enabled: boolean;

  /**
   * Execute the check for a single field
   */
  execute(ctx: QualityCheckContext): QualityCheckResult;

  /**
   * Optional: Aggregate results across all fields into a summary
   */
  summarize?(results: QualityCheckResult[]): QualityCheckSummary;
}

export interface FieldQualityResults {
  fieldPath: string;
  checks: QualityCheckResult[];
}

export type RiskLevel = 'critical' | 'warning' | 'safe';

export interface FieldRisk {
  fieldPath: string;
  riskLevel: RiskLevel;
  completeness: number;
  nullCount: number;
  presentCount: number;
  recommendation: string;
}

export interface QualityAnalysisResults {
  recordCount: number;
  fieldResults: FieldQualityResults[];
  summaries: Record<string, QualityCheckSummary>;
  /** Fields categorized by risk level */
  risks?: {
    critical: FieldRisk[];
    warning: FieldRisk[];
    safe: FieldRisk[];
  };
}

