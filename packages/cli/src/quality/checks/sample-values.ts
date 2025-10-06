/**
 * Sample Values Check
 * Collects sample values for inspection (always passes, informational only)
 */

import type { QualityCheck, QualityCheckContext, QualityCheckResult } from '../types';

export class SampleValuesCheck implements QualityCheck {
  name = 'sample-values';
  description = 'Collects sample values for inspection';
  enabled = true;

  execute(ctx: QualityCheckContext): QualityCheckResult {
    const nonNullValues = ctx.values.filter(v => v !== null && v !== undefined);
    const samples = nonNullValues.slice(0, 5);

    return {
      checkName: this.name,
      fieldPath: ctx.fieldPath,
      status: 'pass', // Informational only
      value: samples.length,
      message: `${samples.length} sample(s) collected`,
      metadata: {
        samples: samples.map(s => {
          if (typeof s === 'string') return `"${s}"`;
          if (Array.isArray(s)) return `[${s.length} items]`;
          if (typeof s === 'object') return '{object}';
          return String(s);
        })
      }
    };
  }
}

