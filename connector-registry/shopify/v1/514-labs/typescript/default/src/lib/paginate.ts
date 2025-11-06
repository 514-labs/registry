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
 * Shopify uses cursor-based pagination with Link headers.
 * The API returns pagination info in the Link header with rel="next" and rel="previous".
 */
export async function* paginateCursor<T = any>(params: {
  send: SendFn;
  path: string;
  query?: Record<string, any>;
  pageSize?: number;
  maxItems?: number;
  extractItems: (res: any) => T[];
}): AsyncGenerator<ReadonlyArray<T>> {
  const { send, path, query = {}, pageSize = 50, maxItems, extractItems } = params
  
  let currentPath = path
  let currentQuery = { ...query, limit: pageSize }
  let totalFetched = 0

  while (true) {
    const remaining = maxItems !== undefined ? maxItems - totalFetched : undefined
    if (remaining !== undefined && remaining <= 0) break

    const response = await send({
      method: 'GET',
      path: currentPath,
      query: currentQuery,
    })

    const items = extractItems(response.data)
    if (items.length === 0) break

    const itemsToYield = remaining !== undefined && items.length > remaining
      ? items.slice(0, remaining)
      : items

    totalFetched += itemsToYield.length
    yield itemsToYield

    // Extract next page URL from Link header if available
    // Shopify returns: Link: <https://shop.myshopify.com/admin/api/2024-10/products.json?page_info=xxx>; rel="next"
    const linkHeader = (response as any).headers?.link
    if (!linkHeader) break

    const nextLink = parseLinkHeader(linkHeader, 'next')
    if (!nextLink) break

    // Extract page_info from the next link
    const pageInfo = extractPageInfo(nextLink)
    if (!pageInfo) break

    currentQuery = { ...query, limit: pageSize, page_info: pageInfo } as any
  }
}

function parseLinkHeader(header: string, rel: string): string | undefined {
  const links = header.split(',')
  for (const link of links) {
    const match = link.match(/<([^>]+)>;\s*rel="([^"]+)"/)
    if (match && match[2] === rel) {
      return match[1]
    }
  }
  return undefined
}

function extractPageInfo(url: string): string | undefined {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get('page_info') || undefined
  } catch {
    return undefined
  }
}
