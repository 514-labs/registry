/**
 * Completeness Check
 * Measures the percentage of records with non-null values for each field
 */

import type { QualityCheck, QualityCheckContext, QualityCheckResult, QualityCheckSummary } from '../types';

export class CompletenessCheck implements QualityCheck {
  name = 'completeness';
  description = 'Measures % of records with non-null values';
  enabled = true;

  execute(ctx: QualityCheckContext): QualityCheckResult {
    const nullCount = ctx.values.filter(v => v === null || v === undefined).length;
    const completeness = ctx.total > 0 ? ((ctx.total - nullCount) / ctx.total) * 100 : 0;

    let status: 'pass' | 'warn' | 'fail';
    if (completeness > 90) {
      status = 'pass';
    } else if (completeness >= 60) {
      status = 'warn';
    } else {
      status = 'fail';
    }

    return {
      checkName: this.name,
      fieldPath: ctx.fieldPath,
      status,
      value: completeness,
      message: `${completeness.toFixed(1)}% complete`,
      recommendation: completeness < 60 
        ? `Use optional chaining or default values for ${ctx.fieldPath}`
        : undefined,
      metadata: {
        nullCount,
        presentCount: ctx.total - nullCount,
      }
    };
  }

  summarize(results: QualityCheckResult[]): QualityCheckSummary {
    const avg = results.reduce((sum, r) => sum + (r.value as number), 0) / results.length;

    const highQuality = results.filter(r => (r.value as number) > 90);
    const mediumQuality = results.filter(r => {
      const v = r.value as number;
      return v >= 60 && v <= 90;
    });
    const lowQuality = results.filter(r => (r.value as number) < 60);

    return {
      score: avg,
      summary: `Overall completeness: ${avg.toFixed(1)}%`,
      details: {
        highQuality: highQuality.map(r => r.fieldPath),
        mediumQuality: mediumQuality.map(r => r.fieldPath),
        lowQuality: lowQuality.map(r => r.fieldPath),
      }
    };
  }
}

