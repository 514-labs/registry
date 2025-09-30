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
      if (ctx.type !== 'afterResponse') return
      const root = ctx.response?.data
      if (root === null || root === undefined) return

      const dropped: string[] = []

      const visit = (value: unknown, path: string) => {
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) visit(value[i], `${path}[${i}]`)
          return
        }
        if (value && typeof value === 'object') {
          const obj = value as Record<string, unknown>
          for (const key of Object.keys(obj)) {
            const v = obj[key]
            if (v === null) {
              delete obj[key]
              dropped.push(path ? `${path}.${key}` : key)
              continue
            }
            visit(v, path ? `${path}.${key}` : key)
          }
        }
      }

      // Clone shallowly to avoid mutating shared references; deep walk mutates in place
      const data = Array.isArray(root) ? [...root] : (typeof root === 'object' ? { ...(root as any) } : root)
      visit(data, '')
      ctx.modifyResponse?.({ data })

      if (dropped.length > 0) {
        try {
          const sample = dropped.slice(0, 5)
          console.log('[core] normalize: dropped null fields', { count: dropped.length, sample })
        } catch {}
      }
    },
  }
}
