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
