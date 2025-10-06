/**
 * Null Rate Check
 * Measures the percentage of null/undefined values for each field
 */

import type { QualityCheck, QualityCheckContext, QualityCheckResult } from '../types';

export class NullRateCheck implements QualityCheck {
  name = 'null-rate';
  description = 'Measures % of records with null/undefined values';
  enabled = true;

  execute(ctx: QualityCheckContext): QualityCheckResult {
    const nullCount = ctx.values.filter(v => v === null || v === undefined).length;
    const nullRate = ctx.total > 0 ? (nullCount / ctx.total) * 100 : 0;

    let status: 'pass' | 'warn' | 'fail';
    if (nullRate === 0) {
      status = 'pass';
    } else if (nullRate < 40) {
      status = 'warn';
    } else {
      status = 'fail';
    }

    return {
      checkName: this.name,
      fieldPath: ctx.fieldPath,
      status,
      value: nullRate,
      message: `${nullRate.toFixed(1)}% null`,
      recommendation: nullRate > 40
        ? `High null rate for ${ctx.fieldPath} - consider if this field is reliable`
        : undefined,
      metadata: {
        nullCount,
        nonNullCount: ctx.total - nullCount,
      }
    };
  }
}

