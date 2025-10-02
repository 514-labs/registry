/**
 * Quality Reporter
 * Formats and displays quality check results
 */

import type { QualityAnalysisResults, FieldQualityResults, ComparisonResults } from './analyzer';

export interface ReportOptions {
  verbose: boolean;
}

/**
 * Display quality analysis results
 */
export function displayQualityReport(
  resourceName: string,
  results: QualityAnalysisResults,
  options: ReportOptions = { verbose: false }
): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 QUALITY REPORT: ${resourceName}`);
  console.log(`${'='.repeat(60)}\n`);

  console.log(`Total Records: ${results.recordCount}\n`);

  // Display summaries
  if (results.summaries['completeness']) {
    const summary = results.summaries['completeness'];
    console.log(`Overall Completeness: ${summary.score.toFixed(1)}%\n`);

    // High quality fields
    if (summary.details?.highQuality?.length > 0) {
      console.log(`✅ High Quality (>90% complete):`);
      for (const fieldPath of summary.details.highQuality) {
        const fieldResult = results.fieldResults.find(fr => fr.fieldPath === fieldPath);
        const completeness = fieldResult?.checks.find(c => c.checkName === 'completeness');
        if (completeness) {
          console.log(`   ${fieldPath}: ${(completeness.value as number).toFixed(1)}%`);
        }
      }
      console.log('');
    }

    // Medium quality fields
    if (summary.details?.mediumQuality?.length > 0) {
      console.log(`⚠️  Medium Quality (60-90% complete):`);
      for (const fieldPath of summary.details.mediumQuality) {
        const fieldResult = results.fieldResults.find(fr => fr.fieldPath === fieldPath);
        const completeness = fieldResult?.checks.find(c => c.checkName === 'completeness');
        const nullRate = fieldResult?.checks.find(c => c.checkName === 'null-rate');
        if (completeness && nullRate) {
          console.log(`   ${fieldPath}: ${(completeness.value as number).toFixed(1)}% (${(nullRate.value as number).toFixed(1)}% null)`);
        }
      }
      console.log('');
    }

    // Low quality fields
    if (summary.details?.lowQuality?.length > 0) {
      console.log(`🔴 Low Quality (<60% complete):`);
      for (const fieldPath of summary.details.lowQuality) {
        const fieldResult = results.fieldResults.find(fr => fr.fieldPath === fieldPath);
        const completeness = fieldResult?.checks.find(c => c.checkName === 'completeness');
        const nullRate = fieldResult?.checks.find(c => c.checkName === 'null-rate');
        if (completeness && nullRate) {
          console.log(`   ${fieldPath}: ${(completeness.value as number).toFixed(1)}% (${(nullRate.value as number).toFixed(1)}% null)`);
        }
      }
      console.log('');
    }
  }

  // Display recommendations
  displayRecommendations(results);

  console.log(`${'='.repeat(60)}\n`);
}

/**
 * Display comparison report (raw vs normalized)
 */
export function displayComparisonReport(
  resourceName: string,
  comparison: ComparisonResults,
  options: ReportOptions = { verbose: false }
): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📊 QUALITY REPORT: ${resourceName} (Raw API vs Connector Output)`);
  console.log(`${'='.repeat(60)}\n`);

  const rawCompleteness = comparison.raw.summaries['completeness']?.score ?? 0;
  const normCompleteness = comparison.normalized.summaries['completeness']?.score ?? 0;

  // Transformation summary
  console.log(`RAW API RESPONSE:`);
  console.log(`  Records: ${comparison.raw.recordCount}`);
  console.log(`  Total fields: ${comparison.raw.fieldResults.length}`);
  console.log(`  Overall completeness: ${rawCompleteness.toFixed(1)}%\n`);

  console.log(`CONNECTOR OUTPUT:`);
  console.log(`  Records: ${comparison.normalized.recordCount}`);
  console.log(`  Total fields: ${comparison.normalized.fieldResults.length}`);
  console.log(`  Overall completeness: ${normCompleteness.toFixed(1)}%\n`);

  console.log(`⚙️  TRANSFORMATIONS APPLIED:`);
  console.log(`  • ${comparison.transformation.fieldsRemoved.length} fields removed`);
  console.log(`  • ${comparison.transformation.fieldsAdded.length} fields added`);
  const impact = comparison.transformation.qualityImpact >= 0 ? '+' : '';
  console.log(`  • Quality impact: ${impact}${comparison.transformation.qualityImpact.toFixed(1)}%\n`);

  // Show removed fields
  if (comparison.transformation.fieldsRemoved.length > 0) {
    console.log(`❌ REMOVED BY CONNECTOR:`);
    const showCount = Math.min(10, comparison.transformation.fieldsRemoved.length);
    for (const fieldPath of comparison.transformation.fieldsRemoved.slice(0, showCount)) {
      // Find null rate in raw data
      const rawField = comparison.raw.fieldResults.find(fr => fr.fieldPath === fieldPath);
      const nullRate = rawField?.checks.find(c => c.checkName === 'null-rate');
      if (nullRate) {
        const reason = (nullRate.value as number) === 100 ? 'all-null' : 
                      (nullRate.value as number) >= 90 ? 'mostly-null' : 'unknown';
        console.log(`   ${fieldPath}: ${(nullRate.value as number).toFixed(0)}% null (${reason})`);
      }
    }
    if (comparison.transformation.fieldsRemoved.length > showCount) {
      console.log(`   ... and ${comparison.transformation.fieldsRemoved.length - showCount} more`);
    }
    console.log(`\n   ℹ️  Connector drops fields that are null in all/most records`);
    console.log(`   ⚠️  If you need to check field existence, these won't be in output\n`);
  }

  // Show quality insights
  console.log(`💡 QUALITY INSIGHTS:\n`);

  const normSummary = comparison.normalized.summaries['completeness'];
  if (normSummary?.details?.highQuality?.length > 0) {
    console.log(`✅ Safe to use without checks:`);
    for (const fieldPath of normSummary.details.highQuality.slice(0, 5)) {
      const fieldResult = comparison.normalized.fieldResults.find(fr => fr.fieldPath === fieldPath);
      const completeness = fieldResult?.checks.find(c => c.checkName === 'completeness');
      if (completeness) {
        console.log(`   • ${fieldPath} (${(completeness.value as number).toFixed(0)}% complete)`);
      }
    }
    if (normSummary.details.highQuality.length > 5) {
      console.log(`   ... and ${normSummary.details.highQuality.length - 5} more`);
    }
  }

  if (normSummary?.details?.mediumQuality?.length > 0) {
    console.log(`\n⚠️  Need defensive coding:`);
    for (const fieldPath of normSummary.details.mediumQuality.slice(0, 5)) {
      const fieldResult = comparison.normalized.fieldResults.find(fr => fr.fieldPath === fieldPath);
      const completeness = fieldResult?.checks.find(c => c.checkName === 'completeness');
      if (completeness) {
        console.log(`   • ${fieldPath} (${(completeness.value as number).toFixed(0)}% complete)`);
      }
    }
    if (normSummary.details.mediumQuality.length > 5) {
      console.log(`   ... and ${normSummary.details.mediumQuality.length - 5} more`);
    }
    console.log(`   → Use optional chaining or default values`);
  }

  if (comparison.transformation.fieldsRemoved.length > 0) {
    console.log(`\n❌ Not available in connector output:`);
    const showCount = Math.min(5, comparison.transformation.fieldsRemoved.length);
    for (const fieldPath of comparison.transformation.fieldsRemoved.slice(0, showCount)) {
      const rawField = comparison.raw.fieldResults.find(fr => fr.fieldPath === fieldPath);
      const nullRate = rawField?.checks.find(c => c.checkName === 'null-rate');
      if (nullRate) {
        console.log(`   • ${fieldPath} (${(nullRate.value as number).toFixed(0)}% null in API)`);
      }
    }
    if (comparison.transformation.fieldsRemoved.length > showCount) {
      console.log(`   ... and ${comparison.transformation.fieldsRemoved.length - showCount} more`);
    }
    console.log(`   → If you need these, fetch from raw API directly`);
  }

  // Overall assessment
  console.log('');
  if (comparison.transformation.qualityImpact > 5) {
    console.log(`✅ Connector improved data quality by ${comparison.transformation.qualityImpact.toFixed(1)}%`);
    console.log(`   (Removed sparse/null fields, improving signal-to-noise ratio)`);
  } else if (comparison.transformation.qualityImpact < -5) {
    console.log(`⚠️  Connector reduced data quality by ${Math.abs(comparison.transformation.qualityImpact).toFixed(1)}%`);
    console.log(`   (May be removing fields you need)`);
  } else {
    const sign = comparison.transformation.qualityImpact >= 0 ? '+' : '';
    console.log(`✓ Connector maintains data quality (${sign}${comparison.transformation.qualityImpact.toFixed(1)}% impact)`);
  }

  console.log(`\n${'='.repeat(60)}\n`);
}

/**
 * Display recommendations based on analysis results
 */
function displayRecommendations(results: QualityAnalysisResults): void {
  const recommendations = new Set<string>();

  // Collect unique recommendations from all checks
  for (const fieldResult of results.fieldResults) {
    for (const check of fieldResult.checks) {
      if (check.recommendation) {
        recommendations.add(check.recommendation);
      }
    }
  }

  if (recommendations.size > 0) {
    console.log(`💡 RECOMMENDATIONS:\n`);
    for (const rec of Array.from(recommendations).slice(0, 5)) {
      console.log(`• ${rec}`);
    }
    if (recommendations.size > 5) {
      console.log(`• ... and ${recommendations.size - 5} more recommendations`);
    }
    console.log('');
  }

  // Overall assessment
  const completeness = results.summaries['completeness'];
  if (completeness) {
    if (completeness.score < 70) {
      console.log(`⚠️  Overall completeness is ${completeness.score.toFixed(1)}%`);
      console.log(`   Consider if this connector meets your data quality requirements\n`);
    } else if (completeness.score >= 90) {
      console.log(`✅ Excellent data quality! This connector is production-ready.\n`);
    } else {
      console.log(`✓ Good data quality (${completeness.score.toFixed(1)}%)`);
      console.log(`  Review medium/low quality fields for your specific use case\n`);
    }
  }
}

/**
 * Display summary across multiple resources
 */
export function displaySummary(results: Array<{ resourceName: string; results: QualityAnalysisResults }>): void {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📈 OVERALL SUMMARY`);
  console.log(`${'='.repeat(60)}\n`);

  console.log(`Resources Analyzed: ${results.length}\n`);

  for (const result of results) {
    const completeness = result.results.summaries['completeness']?.score ?? 0;
    const icon = completeness >= 90 ? '✅' : completeness >= 70 ? '⚠️' : '🔴';
    console.log(
      `${icon} ${result.resourceName}: ${completeness.toFixed(1)}% (${result.results.recordCount} records)`
    );
  }

  console.log('');

  const avgCompleteness =
    results.length > 0
      ? results.reduce((sum, r) => sum + (r.results.summaries['completeness']?.score ?? 0), 0) / results.length
      : 0;

  console.log(`Average Completeness: ${avgCompleteness.toFixed(1)}%`);

  if (avgCompleteness >= 90) {
    console.log(`\n✅ This connector has excellent overall data quality!`);
  } else if (avgCompleteness >= 70) {
    console.log(`\n✓ This connector has good overall data quality`);
    console.log(`  Review individual resources for specific concerns`);
  } else {
    console.log(`\n⚠️  This connector has moderate data quality`);
    console.log(`   Carefully evaluate if it meets your requirements`);
  }

  console.log('');
}

