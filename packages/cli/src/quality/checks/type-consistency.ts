/**
 * Type Consistency Check
 * Detects fields with inconsistent types across records
 */

import type { QualityCheck, QualityCheckContext, QualityCheckResult, QualityCheckSummary } from '../types';

function getValueType(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  if (value instanceof Date) return 'date';
  return typeof value;
}

export class TypeConsistencyCheck implements QualityCheck {
  name = 'type-consistency';
  description = 'Detects fields with inconsistent types';
  enabled = true;

  execute(ctx: QualityCheckContext): QualityCheckResult {
    const types = new Set<string>();
    const nonNullValues = ctx.values.filter(v => v !== null && v !== undefined);

    nonNullValues.forEach(v => types.add(getValueType(v)));

    const isConsistent = types.size <= 1;
    const typesList = Array.from(types).join(', ');

    return {
      checkName: this.name,
      fieldPath: ctx.fieldPath,
      status: isConsistent ? 'pass' : 'warn',
      value: isConsistent,
      message: isConsistent 
        ? `Consistent type: ${typesList || 'none'}` 
        : `Inconsistent types: ${typesList}`,
      recommendation: !isConsistent
        ? `Add type guards when accessing ${ctx.fieldPath}`
        : undefined,
      metadata: {
        types: Array.from(types),
        typeCount: types.size,
      }
    };
  }

  summarize(results: QualityCheckResult[]): QualityCheckSummary {
    const inconsistent = results.filter(r => !r.value);
    const consistencyRate = ((results.length - inconsistent.length) / results.length) * 100;

    return {
      score: consistencyRate,
      summary: `${consistencyRate.toFixed(1)}% of fields have consistent types`,
      details: {
        inconsistentFields: inconsistent.map(r => r.fieldPath),
      }
    };
  }
}

