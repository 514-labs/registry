import type { SendFn } from './paginate'

/**
 * Create a simple resource API at the given path.
 *
 * Exposes a single getAll async generator that fetches once and yields client-side chunks.
 * This default suits APIs that don't expose server-side pagination.
 *
 * For real pagination, add a paginate helper and layer getAll on top.
 */
export function makeCrudResource<
  Item,
  ListParams extends Record<string, any> | undefined = undefined
>(
  objectPath: string,
  send: SendFn,
  options?: {
    buildListQuery?: (params?: ListParams) => Record<string, any>
  }
) {
  return {
    async *getAll(
      params?: (ListParams extends undefined
        ? { pageSize?: number; maxItems?: number }
        : ListParams & { pageSize?: number; maxItems?: number })
    ): AsyncGenerator<ReadonlyArray<Item>> {
      const listQuery = options?.buildListQuery?.(params as any) ?? {}
      const res = await send<Item[]>({ method: 'GET', path: objectPath, query: listQuery, operation: 'getAll' })
      const data = Array.isArray(res.data) ? res.data : []

      const pageSize = (params as any)?.pageSize as number | undefined
      const maxItems = (params as any)?.maxItems as number | undefined

      let start = 0
      let remaining = typeof maxItems === 'number' ? Math.max(0, maxItems) : undefined

      if (!pageSize || pageSize <= 0) {
        yield remaining !== undefined ? data.slice(0, remaining) : data
        return
      }

      while (start < data.length) {
        const end = Math.min(data.length, start + pageSize)
        let chunk = data.slice(start, end)
        if (remaining !== undefined) {
          if (remaining <= 0) break
          if (chunk.length > remaining) chunk = chunk.slice(0, remaining)
          remaining -= chunk.length
        }
        yield chunk
        start = end
      }
    },
  }
}
