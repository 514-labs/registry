import type { Hook, HookContext } from './hooks'

/**
 * Create an afterResponse hook that maps an array payload from Input to Output.
 * - Applies to the request it is attached to (no global operation scoping here)
 * - Keeps transport core untyped while providing strong typing at creation site
 */
export function createMapArrayAfterResponseHook<Input, Output>(
  map: (item: Input) => Output
): Hook {
  return {
    name: 'transform:mapArray',
    execute: (ctx: HookContext) => {
      if (ctx.type !== 'afterResponse') return
      const data = ctx.response?.data
      if (!Array.isArray(data)) return
      const mapped = (data as unknown as Input[]).map(map)
      ctx.modifyResponse?.({ data: mapped })
    },
  }
}

/**
 * Spec-conformance normalizer (schema-agnostic):
 * - Deletes any object property whose value is strictly null (deep walk).
 * - Does not consult optional/required/nullable today (future enhancement).
 * - Controlled by HttpClient config: enabled unless dropNulls === false.
 * - Emits a single summary log per response when drops occur (console.log).
 * - Leaves undefined and all other values untouched; does not remove array elements.
 */
export function createSpecConformanceNormalizer(): Hook {
  return {
    name: 'normalize:specConformance',
    execute: (ctx: HookContext) => {
      // Run only on afterResponse events
      if (ctx.type !== 'afterResponse') return
      // Nothing to normalize if there is no data
      const root = ctx.response?.data
      if (root === null || root === undefined) return

      const dropped: string[] = []

      // Pure pruner:
      // - Builds a new structure while omitting properties whose value is null
      // - Never mutates inputs (arrays are mapped; objects are rebuilt)
      // - Records json-paths of removed properties for observability
      const prune = (value: unknown, path: string): unknown => {
        // Preserve undefined (untouched) and bail out on null (parent omits field)
        if (value === null || value === undefined) return value
        if (Array.isArray(value)) {
          // Map array elements; do not splice/remove array indices
          return (value as unknown[]).map((item, i) => prune(item, `${path}[${i}]`))
        }
        if (typeof value === 'object') {
          // Rebuild plain object, skipping null-valued children
          const src = value as Record<string, unknown>
          const out: Record<string, unknown> = {}
          for (const key of Object.keys(src)) {
            const next = src[key]
            if (next === null) {
              dropped.push(path ? `${path}.${key}` : key)
              continue
            }
            out[key] = prune(next, path ? `${path}.${key}` : key)
          }
          return out
        }
        // Primitive (string/number/boolean) or other non-object types
        return value
      }

      // Normalize a deep copy without mutating the original response payload
      const normalized = prune(root, '')
      ctx.modifyResponse?.({ data: normalized })

      if (dropped.length > 0) {
        try {
          const sample = dropped.slice(0, 5)
          // Lightweight summary log (replace with structured metrics if desired)
          console.log('[core] normalize: dropped null fields', { count: dropped.length, sample })
        } catch {}
      }
    },
  }
}
