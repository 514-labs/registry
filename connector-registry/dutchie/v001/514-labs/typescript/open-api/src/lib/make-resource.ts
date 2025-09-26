import type { SendFn } from './paginate'

/**
 * Build query string parameters for a resource list call.
 * - If a custom builder is provided, it maps typed params to a plain query object.
 * - Otherwise returns an empty object.
 */
function buildQuery<ListParams extends Record<string, any> | undefined>(
  params: ListParams | undefined,
  custom?: (p?: ListParams) => Record<string, any>
) {
  if (custom) return custom(params)
  return {}
}

/**
 * Create a simple list-style resource with a single HTTP GET and local chunking.
 *
 * Semantics:
 * - Always performs one HTTP GET to the given path and expects an array response.
 * - getAll returns an async generator that yields arrays of items (pages).
 * - pageSize controls local chunk size; no extra HTTP requests are made.
 * - maxItems limits the total number of items yielded across all chunks.
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
  type GetAllOptions = (ListParams extends undefined
    ? { pageSize?: number; maxItems?: number }
    : ListParams & { pageSize?: number; maxItems?: number })

  return {
    /**
     * Async generator yielding arrays of items from a single HTTP GET.
     * - pageSize: chunk size for local slicing (<= 0 or undefined => single chunk of all items)
     * - maxItems: stop after emitting up to this many items (applies across chunks)
     */
    async *getAll(
      params?: GetAllOptions
    ): AsyncGenerator<ReadonlyArray<Item>> {
      const queryParams = params as any
      const query = buildQuery(queryParams, options?.buildListQuery)
      const res = await send<Item[]>({ method: 'GET', path: objectPath, query, operation: 'getAll' })
      const items: Item[] = Array.isArray(res.data) ? res.data : []

      const pageSize = (params as any)?.pageSize as number | undefined
      const maxItems = (params as any)?.maxItems as number | undefined

      let start = 0
      let remainingItems = typeof maxItems === 'number' ? Math.max(0, maxItems) : undefined

      if (!pageSize || pageSize <= 0) {
        yield remainingItems !== undefined ? items.slice(0, remainingItems) : items
        return
      }

      while (start < items.length) {
        const end = Math.min(items.length, start + pageSize)
        let chunk = items.slice(start, end)
        if (remainingItems !== undefined) {
          if (remainingItems <= 0) break
          if (chunk.length > remainingItems) chunk = chunk.slice(0, remainingItems)
          remainingItems -= chunk.length
        }
        yield chunk
        start = end
      }
    },
  }
}
