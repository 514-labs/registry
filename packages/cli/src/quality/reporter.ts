/**
 * Quality Reporter
 * Displays quality check results using inverted pyramid design
 */

import { Table } from 'console-table-printer';

import type { ComparisonResults } from './analyzer';
import type { FieldRisk, QualityAnalysisResults } from './types';

// Constants
const SEPARATOR_LENGTH = 70;
const MAX_FIELDS_TO_SHOW = 5;
const MAX_SAMPLE_FIELDS = 10;

export interface ReportOptions {
  verbose: boolean;
}

interface ResourceAnalysis {
  name: string;
  completeness: number;
  rawCompleteness: number;
  recordCount: number;
  criticalCount: number;
  warningCount: number;
  safeCount: number;
  warning: FieldRisk[];
  critical: FieldRisk[];
}

// Module-level state for collecting analyses across resources
let resourceAnalyses: ResourceAnalysis[] = [];

/**
 * Get overall assessment based on completeness and issue counts
 */
function getAssessment(avgCompleteness: number, criticalCount: number, warningCount: number): {
  message: string;
  emoji: string;
} {
  if (avgCompleteness >= 95 && criticalCount === 0 && warningCount === 0) {
    return { message: 'Production Ready', emoji: '✅' };
  }
  
  if (avgCompleteness >= 90 && criticalCount === 0) {
    return { message: 'Production Ready (with minor caveats)', emoji: '✅' };
  }
  
  if (avgCompleteness >= 80 && criticalCount === 0) {
    return { message: 'Good (use with caution)', emoji: '⚠️ ' };
  }
  
  if (avgCompleteness >= 70) {
    return { message: 'Fair (significant quality issues)', emoji: '⚠️ ' };
  }
  
  return { message: 'Poor (not recommended for production)', emoji: '🔴' };
}

/**
 * Display comparison report (raw vs normalized) - CONCISE by default
 */
export function displayComparisonReport(
  resourceName: string,
  comparison: ComparisonResults,
  options: ReportOptions = { verbose: false }
): void {
  const { normalized } = comparison;
  const risks = normalized.risks ?? { critical: [], warning: [], safe: [] };
  const completeness = normalized.summaries['completeness']?.score ?? 0;

  // Collect analysis for final summary
  const rawCompleteness = comparison.raw.summaries['completeness']?.score ?? 0;

  resourceAnalyses.push({
    name: resourceName,
    completeness,
    rawCompleteness,
    recordCount: normalized.recordCount,
    criticalCount: risks.critical.length,
    warningCount: risks.warning.length,
    safeCount: risks.safe.length,
    warning: risks.warning,
    critical: risks.critical,
  });

  // CONCISE MODE (default) - Only show if there are issues
  if (!options.verbose) {
    const hasIssues = risks.critical.length > 0 || risks.warning.length > 0;
    if (!hasIssues) {
      return; // Perfect resource - don't clutter output
    }

    console.log(`\n${resourceName.toUpperCase()}`);
    
    const table = new Table({
      columns: [
        { name: 'risk', title: '', alignment: 'left' },
        { name: 'field', title: 'Field', alignment: 'left' },
        { name: 'completeness', title: 'Complete', alignment: 'right' },
        { name: 'nulls', title: 'Nulls', alignment: 'right' },
        { name: 'action', title: 'Action', alignment: 'left' },
      ],
    });

    // Add critical issues (up to MAX_FIELDS_TO_SHOW)
    for (const field of risks.critical.slice(0, MAX_FIELDS_TO_SHOW)) {
      table.addRow({
        risk: '🔴',
        field: field.fieldPath,
        completeness: `${field.completeness.toFixed(0)}%`,
        nulls: `${field.nullCount}/${normalized.recordCount}`,
        action: 'AVOID',
      });
    }
    
    if (risks.critical.length > MAX_FIELDS_TO_SHOW) {
      table.addRow({
        risk: '',
        field: `... ${risks.critical.length - MAX_FIELDS_TO_SHOW} more critical fields`,
        completeness: '',
        nulls: '',
        action: '',
      });
    }

    // Add warnings (up to MAX_FIELDS_TO_SHOW)
    for (const field of risks.warning.slice(0, MAX_FIELDS_TO_SHOW)) {
      table.addRow({
        risk: '⚠️ ',
        field: field.fieldPath,
        completeness: `${field.completeness.toFixed(0)}%`,
        nulls: `${field.nullCount}/${normalized.recordCount}`,
        action: 'null checks',
      });
    }
    
    if (risks.warning.length > MAX_FIELDS_TO_SHOW) {
      table.addRow({
        risk: '',
        field: `... ${risks.warning.length - MAX_FIELDS_TO_SHOW} more warning fields`,
        completeness: '',
        nulls: '',
        action: '',
      });
    }

    table.printTable();
    return;
  }

  // VERBOSE MODE - Full details
  console.log(`\n${'='.repeat(SEPARATOR_LENGTH)}`);
  console.log(`📊 DETAILED ANALYSIS: ${resourceName}`);
  console.log(`${'='.repeat(SEPARATOR_LENGTH)}\n`);

  console.log(`RECORDS: ${normalized.recordCount}`);
  console.log(`RAW API: ${comparison.raw.fieldResults.length} fields → CONNECTOR OUTPUT: ${normalized.fieldResults.length} fields`);
  console.log(`TRANSFORMATION: ${comparison.transformation.fieldsRemoved.length} removed, ${comparison.transformation.fieldsAdded.length} added\n`);

  if (risks.critical.length > 0) {
    console.log(`🔴 CRITICAL ISSUES (avoid using):`);
    for (const field of risks.critical) {
      console.log(`  ${field.fieldPath}`);
      console.log(`    • ${field.completeness.toFixed(1)}% complete (${field.nullCount}/${normalized.recordCount} null)`);
      console.log(`    • ${field.recommendation}`);
    }
    console.log('');
  }

  if (risks.warning.length > 0) {
    console.log(`⚠️  WARNINGS (use with caution):`);
    for (const field of risks.warning) {
      console.log(`  ${field.fieldPath}`);
      console.log(`    • ${field.completeness.toFixed(1)}% complete (${field.nullCount}/${normalized.recordCount} null)`);
      console.log(`    • Fix: ${field.recommendation}`);
    }
    console.log('');
  }

  if (risks.safe.length > 0) {
    console.log(`✅ SAFE FIELDS (>90% complete): ${risks.safe.length} fields`);
    const sampleFields = risks.safe.slice(0, MAX_SAMPLE_FIELDS).map(f => f.fieldPath).join(', ');
    console.log(`   ${sampleFields}${risks.safe.length > MAX_SAMPLE_FIELDS ? '...' : ''}\n`);
  }

  if (comparison.transformation.fieldsRemoved.length > 0) {
    console.log(`🗑️  REMOVED BY CONNECTOR: ${comparison.transformation.fieldsRemoved.length} fields (all-null in raw API)`);
    const sample = comparison.transformation.fieldsRemoved.slice(0, MAX_FIELDS_TO_SHOW).join(', ');
    console.log(`   ${sample}${comparison.transformation.fieldsRemoved.length > MAX_FIELDS_TO_SHOW ? '...' : ''}\n`);
  }

  console.log(`${'='.repeat(SEPARATOR_LENGTH)}\n`);
}

/**
 * Display overall summary (INVERTED PYRAMID - decision first)
 */
export function displaySummary(): void {
  if (resourceAnalyses.length === 0) {
    console.log('\n✅ All resources passed quality checks!\n');
    return;
  }

  const totalRecords = resourceAnalyses.reduce((sum, r) => sum + r.recordCount, 0);
  const avgCompleteness = resourceAnalyses.reduce((sum, r) => sum + r.completeness, 0) / resourceAnalyses.length;
  const totalCritical = resourceAnalyses.reduce((sum, r) => sum + r.criticalCount, 0);
  const totalWarnings = resourceAnalyses.reduce((sum, r) => sum + r.warningCount, 0);
  const totalIssues = totalCritical + totalWarnings;

  const assessment = getAssessment(avgCompleteness, totalCritical, totalWarnings);

  console.log(`\n${'='.repeat(SEPARATOR_LENGTH)}`);
  console.log(`📊 QUALITY CHECK SUMMARY`);
  console.log(`${'='.repeat(SEPARATOR_LENGTH)}\n`);

  // 1. DECISION FIRST (inverted pyramid)
  console.log(`${assessment.emoji} ASSESSMENT: ${assessment.message}`);
  console.log(`   • ${avgCompleteness.toFixed(1)}% average completeness`);

  // Show transformation impact
  const avgRaw = resourceAnalyses.reduce((sum, r) => sum + r.rawCompleteness, 0) / resourceAnalyses.length;
  const transformationImpact = avgCompleteness - avgRaw;

  if (Math.abs(transformationImpact) > 1) {
    const icon = transformationImpact > 0 ? '📈' : '📉';
    const direction = transformationImpact > 0 ? 'improved' : 'worsened';
    console.log(`   ${icon} Connector ${direction} quality by ${Math.abs(transformationImpact).toFixed(1)}%`);
  } else {
    console.log(`   ✅ Connector preserved data quality (no transformation loss)`);
  }

  if (totalCritical > 0) {
    console.log(`   • ${totalCritical} critical field(s) - avoid using`);
  }
  if (totalWarnings > 0) {
    console.log(`   • ${totalWarnings} field(s) need null handling`);
  }
  console.log(`   • ${resourceAnalyses.length} resource(s) analyzed, ${totalRecords} total records\n`);

  // 2. ACTION REQUIRED (if there are issues)
  if (totalIssues > 0) {
    console.log(`${'─'.repeat(SEPARATOR_LENGTH)}`);
    console.log(`⚠️  ACTION REQUIRED\n`);

    if (totalCritical > 0) {
      console.log(`🔴 Critical fields (<50% complete):`);
      console.log(`   → Don't use these - too unreliable`);
      console.log(`   → Use alternative fields or exclude from sync\n`);
    }

    if (totalWarnings > 0) {
      console.log(`⚠️  Warning fields (50-90% complete):`);
      console.log(`   → Add null checks to your code:\n`);

      // Show example from first warning field
      const firstWarning = resourceAnalyses
        .flatMap(r => r.warning)
        .find(w => w !== undefined);

      if (firstWarning) {
        const exampleField = firstWarning.fieldPath;
        console.log(`   const value = record.${exampleField} ?? 'default';`);
        console.log(`   const name = record.${exampleField}?.toUpperCase() ?? 'Unknown';\n`);
      }
    }

    // Show data source attribution (always available now)
    console.log(`📊 DATA SOURCE ATTRIBUTION:\n`);

    if (transformationImpact < -2) {
      console.log(`   🚨 Connector is dropping valid data (${Math.abs(transformationImpact).toFixed(1)}% quality loss)`);
      console.log(`   → Connector needs investigation/fixes\n`);
    } else {
      console.log(`   ✅ Issues originate from source API, not connector`);
      console.log(`   → Connector is working correctly\n`);
    }

    console.log(`${'─'.repeat(SEPARATOR_LENGTH)}\n`);
  }

  // 3. RESOURCE TABLE
  console.log(`Resource Summary:`);

  const summaryTable = new Table({
    columns: [
      { name: 'resource', title: 'Resource', alignment: 'left' },
      { name: 'completeness', title: 'Completeness', alignment: 'right' },
      { name: 'records', title: 'Records', alignment: 'right' },
      { name: 'critical', title: 'Critical', alignment: 'right' },
      { name: 'warning', title: 'Warning', alignment: 'right' },
      { name: 'safe', title: 'Safe', alignment: 'right' },
      { name: 'attribution', title: 'Attribution', alignment: 'left' },
    ],
  });

  for (const analysis of resourceAnalyses) {
    const impact = analysis.completeness - analysis.rawCompleteness;
    let attribution: string;

    if (impact < -2) {
      attribution = 'Connector issue';
    } else if (impact > 2) {
      attribution = 'Connector improved';
    } else {
      attribution = 'API (no change)';
    }

    summaryTable.addRow({
      resource: analysis.name,
      completeness: `${analysis.completeness.toFixed(1)}%`,
      records: analysis.recordCount,
      critical: analysis.criticalCount,
      warning: analysis.warningCount,
      safe: analysis.safeCount,
      attribution,
    });
  }

  summaryTable.printTable();

  // 4. GUIDANCE
  if (totalIssues > 0) {
    console.log(`💡 NEXT STEPS:\n`);

    if (totalCritical > 0) {
      console.log(`   1. Review critical fields - consider if connector meets your needs`);
    }
    if (totalWarnings > 0) {
      console.log(`   2. Add null checks for warning fields (see examples above)`);
    }
    console.log(`   3. Run with --verbose for detailed field-level analysis\n`);
  }

  // 5. EXIT CODE GUIDANCE
  if (totalCritical > 0) {
    console.log(`🔴 Exit code: 2 (critical issues present)`);
  } else if (totalWarnings > 0) {
    console.log(`⚠️  Exit code: 1 (warnings present)`);
  } else {
    console.log(`✅ Exit code: 0 (all checks passed)`);
  }

  console.log(`\n${'='.repeat(SEPARATOR_LENGTH)}\n`);

  // Reset for next run
  resourceAnalyses = [];
}

/**
 * Get exit code based on analysis results
 */
export function getExitCode(): number {
  const totalCritical = resourceAnalyses.reduce((sum, r) => sum + r.criticalCount, 0);
  const totalWarnings = resourceAnalyses.reduce((sum, r) => sum + r.warningCount, 0);

  if (totalCritical > 0) return 2;
  if (totalWarnings > 0) return 1;
  return 0;
}
