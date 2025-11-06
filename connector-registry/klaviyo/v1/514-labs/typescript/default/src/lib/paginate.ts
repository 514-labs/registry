/**
 * Klaviyo API pagination implementation
 * 
 * Klaviyo uses cursor-based pagination with the following structure:
 * - Query parameters: page[cursor], page[size]
 * - Response structure: { data: [...], links: { next: "url", prev: "url" } }
 * - Next cursor is extracted from links.next URL
 */

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
 * Klaviyo API response structure with cursor pagination
 */
export interface KlaviyoPaginatedResponse<T> {
  data: T[]
  links?: {
    self?: string
    next?: string | null
    prev?: string | null
  }
}

/**
 * Extract cursor from Klaviyo's links.next URL
 * Example: https://a.klaviyo.com/api/profiles/?page[cursor]=bmV4dDo6aWQ6OjAxRzFNOFFRVjZW...
 */
function extractCursorFromUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('page[cursor]') ?? undefined
  } catch {
    return undefined
  }
}

/**
 * Cursor-based pagination for Klaviyo API
 */
export async function* paginateCursor<T = any>(params: {
  send: SendFn
  path: string
  query?: Record<string, any>
  pageSize?: number
  maxItems?: number
}): AsyncGenerator<ReadonlyArray<T>> {
  const { send, path, query = {}, pageSize = 100, maxItems } = params
  let cursor: string | undefined = undefined
  let totalFetched = 0

  while (true) {
    const remaining = maxItems !== undefined ? maxItems - totalFetched : undefined
    const currentSize = remaining !== undefined ? Math.min(pageSize, remaining) : pageSize

    if (remaining !== undefined && remaining <= 0) break

    // Build query with cursor pagination
    const paginatedQuery = {
      ...query,
      'page[size]': currentSize,
      ...(cursor ? { 'page[cursor]': cursor } : {}),
    }

    const response = await send<KlaviyoPaginatedResponse<T>>({
      method: 'GET',
      path,
      query: paginatedQuery,
    })

    const items = response.data?.data ?? []
    if (items.length === 0) break

    totalFetched += items.length
    yield items

    // Extract next cursor from links
    cursor = extractCursorFromUrl(response.data?.links?.next)
    if (!cursor) break

    // If we got fewer items than requested, we're at the end
    if (items.length < currentSize) break
  }
}
