import type { SendFn, Hook } from '@connector-factory/core'

// Paging controls for client-side chunking
type Paging = { pageSize?: number; maxItems?: number }

// Options bag for getAll; parameterized by the resource-specific list params
type GetAllOptions<ListParams extends Record<string, unknown> | undefined = undefined> = {
  params?: ListParams
  paging?: Paging
}

/**
 * Build query string parameters for a resource list call.
 * - If a custom builder is provided, it maps typed list params to a plain query object.
 * - Paging fields (pageSize/maxItems) are stripped upstream and never reach this builder.
 * * - If no builder is provided, returns an empty query object.
 */
function buildQuery<ListParams extends Record<string, unknown> | undefined>(
  params: ListParams | undefined,
  custom?: (p?: ListParams) => Record<string, string | number | boolean | undefined>
) {
  if (custom) return custom(params)
  return {}
}

/**
 * Create a simple list-style resource with a single HTTP GET and local chunking.
 *
 * Semantics:
 * - Always performs one HTTP GET to the given path and expects an array response.
 * - getAll returns an async generator that yields arrays of items (client-side pages).
 * - pageSize controls local chunk size; no extra HTTP requests are made.
 * - maxItems limits the total number of items yielded across all chunks.
 * - Any resource-scoped hooks are forwarded to the transport; execution and merging with global
 *   hooks happen centrally in core before data is returned to the resource.
 */
export function makeCrudResource<
  Item,
  ListParams extends Record<string, unknown> | undefined = undefined
>(
  objectPath: string,
  send: SendFn,
  options?: {
    buildListQuery?: (params?: ListParams) => Record<string, string | number | boolean | undefined>
    resourceHooks?: Partial<{ beforeRequest: Hook[]; afterResponse: Hook[]; onError: Hook[]; onRetry: Hook[] }>
  }
) {

  return {
    /**
     * Async generator yielding arrays of items from a single HTTP GET.
     * - pageSize: number of items per yielded page. If omitted or <= 0, yield one page with all items.
     * - maxItems: maximum total items to yield across all pages; stop early once reached.
     */
    async *getAll(
      optionsIn?: GetAllOptions<ListParams>
    ): AsyncGenerator<ReadonlyArray<Item>> {
      const params = optionsIn?.params
      const pageSize = typeof optionsIn?.paging?.pageSize === 'number' ? optionsIn?.paging?.pageSize : undefined
      const maxItems = typeof optionsIn?.paging?.maxItems === 'number' ? optionsIn?.paging?.maxItems : undefined
      const query = buildQuery(params, options?.buildListQuery)

      const req: (Parameters<SendFn>[0] & { resourceHooks?: NonNullable<typeof options>['resourceHooks'] }) = {
        method: 'GET',
        path: objectPath,
        query,
        operation: 'getAll',
        ...(options?.resourceHooks ? { resourceHooks: options.resourceHooks } : {}),
      }
      // Core executes hooks (global + resourceHooks) before returning this envelope
      const res = await send<Item[]>(req)
      const items: Item[] = Array.isArray(res.data) ? res.data : []

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
