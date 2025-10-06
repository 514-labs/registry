/**
 * Quality Analyzer
 * Orchestrates quality checks on connector data
 */

import { getEnabledChecks } from './checks';
import { extractFields } from './field-extractor';
import type { FieldQualityResults, FieldRisk, QualityAnalysisResults, QualityCheckSummary, RiskLevel } from './types';

// Risk thresholds
const CRITICAL_THRESHOLD = 50; // Below 50% is critical
const WARNING_THRESHOLD = 90; // Below 90% is warning

/**
 * Determine risk level based on completeness percentage
 */
function getRiskLevel(completeness: number): RiskLevel {
  if (completeness < CRITICAL_THRESHOLD) return 'critical';
  if (completeness < WARNING_THRESHOLD) return 'warning';
  return 'safe';
}

/**
 * Generate recommendation based on risk level and field path
 */
function getRecommendation(fieldPath: string, riskLevel: RiskLevel): string {
  if (riskLevel === 'critical') {
    return `Avoid using ${fieldPath} - too unreliable (<${CRITICAL_THRESHOLD}% complete). Use alternative field or exclude.`;
  }
  if (riskLevel === 'warning') {
    return `const value = record.${fieldPath} ?? 'default';`;
  }
  return 'Safe to use as-is';
}

/**
 * Run all enabled quality checks on the provided records
 */
export function analyzeQuality(records: any[]): QualityAnalysisResults {
  if (records.length === 0) {
    return {
      recordCount: 0,
      fieldResults: [],
      summaries: {},
      risks: {
        critical: [],
        warning: [],
        safe: [],
      },
    };
  }

  const checks = getEnabledChecks();
  const fieldDataList = extractFields(records);

  // Run all checks for each field
  const fieldResults: FieldQualityResults[] = fieldDataList.map(fieldData => {
    const checkResults = checks.map(check => {
      return check.execute({
        records,
        fieldPath: fieldData.fieldPath,
        values: fieldData.values,
        total: records.length,
      });
    });

    return {
      fieldPath: fieldData.fieldPath,
      checks: checkResults,
    };
  });

  // Generate summaries for checks that support it
  const summaries: Record<string, QualityCheckSummary> = {};

  for (const check of checks) {
    if (check.summarize) {
      // Collect all results for this check across all fields
      const checkResults = fieldResults
        .flatMap(fr => fr.checks)
        .filter(cr => cr.checkName === check.name);

      if (checkResults.length > 0) {
        summaries[check.name] = check.summarize(checkResults);
      }
    }
  }

  // Categorize fields by risk level
  const risks: { critical: FieldRisk[]; warning: FieldRisk[]; safe: FieldRisk[] } = {
    critical: [],
    warning: [],
    safe: [],
  };

  for (const fieldResult of fieldResults) {
    const completenessCheck = fieldResult.checks.find(c => c.checkName === 'completeness');
    if (completenessCheck) {
      const completeness = completenessCheck.value as number;
      const nullCount = completenessCheck.metadata?.nullCount ?? 0;
      const presentCount = completenessCheck.metadata?.presentCount ?? 0;
      const riskLevel = getRiskLevel(completeness);

      risks[riskLevel].push({
        fieldPath: fieldResult.fieldPath,
        riskLevel,
        completeness,
        nullCount,
        presentCount,
        recommendation: getRecommendation(fieldResult.fieldPath, riskLevel),
      });
    }
  }

  return {
    recordCount: records.length,
    fieldResults,
    summaries,
    risks,
  };
}

/**
 * Comparison between raw and normalized data
 */
export interface ComparisonResults {
  raw: QualityAnalysisResults;
  normalized: QualityAnalysisResults;
  transformation: {
    fieldsRemoved: string[];
    fieldsAdded: string[];
    qualityImpact: number;
  };
}

/**
 * Compare raw vs normalized data to understand transformations
 */
export function analyzeComparison(
  rawRecords: any[],
  normalizedRecords: any[]
): ComparisonResults {
  const rawAnalysis = analyzeQuality(rawRecords);
  const normalizedAnalysis = analyzeQuality(normalizedRecords);

  const rawFieldPaths = new Set(rawAnalysis.fieldResults.map(fr => fr.fieldPath));
  const normalizedFieldPaths = new Set(normalizedAnalysis.fieldResults.map(fr => fr.fieldPath));

  // Detect transformations
  const fieldsRemoved = Array.from(rawFieldPaths).filter(path => !normalizedFieldPaths.has(path));
  const fieldsAdded = Array.from(normalizedFieldPaths).filter(path => !rawFieldPaths.has(path));

  // Calculate quality impact (using completeness as the primary metric)
  const rawCompleteness = rawAnalysis.summaries['completeness']?.score ?? 0;
  const normalizedCompleteness = normalizedAnalysis.summaries['completeness']?.score ?? 0;
  const qualityImpact = normalizedCompleteness - rawCompleteness;

  return {
    raw: rawAnalysis,
    normalized: normalizedAnalysis,
    transformation: {
      fieldsRemoved,
      fieldsAdded,
      qualityImpact,
    },
  };
}

