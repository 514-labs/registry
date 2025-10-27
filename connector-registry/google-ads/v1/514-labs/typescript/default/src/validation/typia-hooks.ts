import type { Hook } from '@connector-factory/core'

export function createTypiaValidationHooks(params?: { strict?: boolean }): { afterResponse: Hook[] } {
  const strict = Boolean(params?.strict)

  const validate = (path: string, data: unknown) => {
    try {
      // Type validation can be implemented using typia or zod
      // For now, basic runtime checks
      if (!Array.isArray(data) && typeof data !== 'object') {
        throw new Error(`Invalid response data type for ${path}`)
      }
    } catch (err: any) {
      if (strict) throw err
      console.warn('[validation] non-strict validation warning:', err?.message || String(err))
    }
  }

  const after: Hook = {
    name: 'validation:afterResponse',
    execute: async (ctx: any) => {
      if (ctx.type !== 'afterResponse' || !ctx.response || !ctx.request) return
      validate(ctx.request.path, ctx.response.data)
    }
  }

  return { afterResponse: [after] }
}
