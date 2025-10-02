/**
 * Quality Check Registry
 * 
 * This is the central registry for all quality checks. Add or remove checks here
 * to control what runs during quality analysis.
 *
 * ============================================================================
 * HOW TO ADD A NEW QUALITY CHECK
 * ============================================================================
 * 
 * 1. Create a new check file (e.g., `my-check.ts`) in this directory:
 *
 *    import type { QualityCheck, QualityCheckContext, QualityCheckResult } from '../types';
 * 
 *    export class MyCheck implements QualityCheck {
 *      name = 'my-check';
 *      description = 'What this check does';
 *      enabled = true;
 *
 *      execute(ctx: QualityCheckContext): QualityCheckResult {
 *        // Your logic here
 *        const myValue = ctx.values.filter(v => someCondition(v)).length;
 *
 *        return {
 *          checkName: this.name,
 *          fieldPath: ctx.fieldPath,
 *          status: myValue > threshold ? 'pass' : 'fail',
 *          value: myValue,
 *          message: `${myValue} items match condition`,
 *          recommendation: myValue < threshold ? 'Fix this issue' : undefined
 *        };
 *      }
 *    }
 *
 * 2. Import and register it in the DEFAULT_QUALITY_CHECKS array below
 *
 * 3. Rebuild: `pnpm build`
 *
 * That's it! Your check will automatically run for all fields.
 *
 * ============================================================================
 * AVAILABLE CONTEXT IN execute()
 * ============================================================================
 *
 * - ctx.records: any[]     - All records being analyzed
 * - ctx.fieldPath: string  - Field path (e.g., "user.name")
 * - ctx.values: any[]      - All values for this field across records
 * - ctx.total: number      - Total number of records
 *
 * ============================================================================
 * RETURN VALUE (QualityCheckResult)
 * ============================================================================
 *
 * - checkName: string            - Your check's name
 * - fieldPath: string            - Field being checked
 * - status: 'pass'|'warn'|'fail' - Result status
 * - value: number|string|boolean - Main result value
 * - message: string              - Human-readable message
 * - recommendation?: string      - Optional advice for users
 * 
 * ============================================================================
 */

import type { QualityCheck } from '../types';
import { CompletenessCheck } from './completeness';
import { NullRateCheck } from './null-rate';
import { TypeConsistencyCheck } from './type-consistency';
import { SampleValuesCheck } from './sample-values';

/**
 * Registry of all available quality checks
 * Add or remove checks here to control what runs
 */
export const DEFAULT_QUALITY_CHECKS: QualityCheck[] = [
  new CompletenessCheck(),
  new NullRateCheck(),
  new TypeConsistencyCheck(),
  new SampleValuesCheck(),
];

/**
 * Get enabled quality checks
 */
export function getEnabledChecks(): QualityCheck[] {
  return DEFAULT_QUALITY_CHECKS.filter(check => check.enabled);
}

// Re-export check classes for external use
export { CompletenessCheck } from './completeness';
export { NullRateCheck } from './null-rate';
export { TypeConsistencyCheck } from './type-consistency';
export { SampleValuesCheck } from './sample-values';

