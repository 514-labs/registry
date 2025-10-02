export { loadConfigFromFileOrEnv } from "./config";
export { runConnectorOperation } from "./runner";
export type { HarnessConfig } from "./config";

// Quality check exports
export { analyzeQuality, analyzeComparison } from "./quality/analyzer";
export { displayQualityReport, displayComparisonReport, displaySummary } from "./quality/reporter";
export { loadQualityCheckConfig } from "./analysis/config-loader";
export { checkQuality } from "./commands/check-quality";
export { getEnabledChecks, DEFAULT_QUALITY_CHECKS } from "./quality/checks";
export { loadConnector } from "./connectors/loader";
export { executeResource } from "./connectors/executor";
export { createCaptureHooks } from "./analysis/capture-hooks";

// Quality check types
export type {
  QualityCheck,
  QualityCheckContext,
  QualityCheckResult,
  QualityCheckSummary,
  QualityAnalysisResults,
  FieldQualityResults,
  CheckStatus
} from "./quality/types";
export type { ComparisonResults } from "./quality/analyzer";
export type { QualityCheckConfig, QualityCheckResource } from "./analysis/config-loader";
export type { CheckQualityOptions } from "./commands/check-quality";
export type { ConnectorInstance } from "./connectors/loader";
export type { ResourceExecutionResult, ResourceConfig } from "./connectors/executor";
export type { CaptureResult } from "./analysis/capture-hooks";
