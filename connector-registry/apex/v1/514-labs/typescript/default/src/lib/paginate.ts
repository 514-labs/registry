// TODO: Implement pagination for your API (see CONNECTOR_GUIDE.md Phase 4)
// TODO: Choose pattern: offset-based, cursor-based, or page-number-based
// TODO: Update query parameters to match your API ($limit/$offset, cursor, page/per_page, etc.)
export type HttpResponseEnvelope<T> = { data: T }

export type SendFn = <T = any>(args: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  body?: unknown;
  operation?: string;
}) => Promise<HttpResponseEnvelope<T>>

/**
 * Apex API pagination response structure
 */
export interface ApexPaginatedResponse<T> {
  data?: T[]
  [key: string]: any // Can be batches, buyers, brands, etc.
  links?: {
    first?: string
    last?: string
    next?: string
    prev?: string
  }
  meta?: {
    current_page: number
    from: number | null
    last_page: number
    per_page: number
    to: number | null
    total: number
    path?: string
    links?: Array<{ url: string | null; label: string; active: boolean }>
  }
}

/**
 * Page-based pagination for Apex API
 * Uses page number and per_page parameters (default per_page: 15, max: 500)
 */
export async function* paginatePages<T = any>(params: {
  send: SendFn
  path: string
  query?: Record<string, any>
  pageSize?: number
  maxItems?: number
  extractItems: (res: any) => T[]
}): AsyncGenerator<ReadonlyArray<T>> {
  const { send, path, query = {}, pageSize = 15, maxItems, extractItems } = params
  
  let page = 1
  let totalFetched = 0

  while (true) {
    const remaining = maxItems !== undefined ? maxItems - totalFetched : undefined
    const currentLimit = remaining !== undefined && remaining < pageSize ? remaining : pageSize

    if (remaining !== undefined && remaining <= 0) break

    const response = await send<ApexPaginatedResponse<T>>({
      method: 'GET',
      path,
      query: { ...query, page, per_page: currentLimit },
    })

    const items = extractItems(response.data)
    if (items.length === 0) break

    totalFetched += items.length
    yield items

    // Check if there's a next page
    const hasNext = response.data?.links?.next !== undefined && response.data?.links?.next !== null
    const meta = response.data?.meta
    
    if (!hasNext || (meta && page >= meta.last_page)) break
    
    page++
  }
}
