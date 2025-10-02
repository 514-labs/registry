/**
 * Quality Analyzer
 * Orchestrates quality checks on connector data
 */

import type { QualityAnalysisResults, FieldQualityResults, QualityCheck } from './types';
import { getEnabledChecks } from './checks';
import { extractFields } from './field-extractor';

/**
 * Run all enabled quality checks on the provided records
 */
export function analyzeQuality(records: any[]): QualityAnalysisResults {
  if (records.length === 0) {
    return {
      recordCount: 0,
      fieldResults: [],
      summaries: {},
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
  const summaries: Record<string, any> = {};

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

  return {
    recordCount: records.length,
    fieldResults,
    summaries,
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

