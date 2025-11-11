export type HttpResponseEnvelope<T> = { data: T }

export type SendFn = <T = any>(args: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  body?: unknown;
  operation?: string;
}) => Promise<HttpResponseEnvelope<T>>

// Offset-based pagination for Apex Trading API
export async function* paginateOffset<T = any>(params: {
  send: SendFn;
  path: string;
  query?: Record<string, any>;
  pageSize?: number;
  maxItems?: number;
}): AsyncGenerator<ReadonlyArray<T>> {
  const { send, path, query = {}, pageSize = 100, maxItems } = params
  let offset = 0
  let totalFetched = 0

  while (true) {
    const remaining = maxItems !== undefined ? maxItems - totalFetched : undefined
    const currentLimit = remaining !== undefined ? Math.min(pageSize, remaining) : pageSize

    if (remaining !== undefined && remaining <= 0) break

    const response = await send<T[]>({
      method: 'GET',
      path,
      query: { ...query, limit: currentLimit, offset },
    })

    const items = Array.isArray(response.data) ? response.data : []
    if (items.length === 0) break

    totalFetched += items.length
    offset += items.length
    yield items

    if (items.length < currentLimit) break
  }
}

// Cursor-based pagination helper (if needed for some endpoints)
export async function* paginateCursor<T = any>(params: {
  send: SendFn;
  path: string;
  query?: Record<string, any>;
  pageSize?: number;
  extractItems: (res: any) => T[];
  extractNextCursor: (res: any) => string | undefined;
}): AsyncGenerator<ReadonlyArray<T>> {
  const { send, path, query = {}, pageSize, extractItems, extractNextCursor } = params
  let cursor: string | undefined = undefined

  while (true) {
    const response = await send({
      method: 'GET',
      path,
      query: {
        ...query,
        ...(cursor ? { cursor } : {}),
        ...(pageSize ? { limit: pageSize } : {}),
      },
    })

    const items = extractItems(response.data)
    if (items.length === 0) break

    yield items

    cursor = extractNextCursor(response.data)
    if (!cursor) break
  }
}
