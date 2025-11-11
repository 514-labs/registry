export type HttpResponseEnvelope<T> = { data: T }

export type SendFn = <T = any>(args: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  body?: unknown;
  operation?: string;
}) => Promise<HttpResponseEnvelope<T>>

// Incremental sync pagination using updated_at_from parameter
export async function* paginateIncremental<T = any>(params: {
  send: SendFn;
  path: string;
  query?: Record<string, any>;
  updatedAtFrom?: string;
  pageSize?: number;
  maxItems?: number;
}): AsyncGenerator<ReadonlyArray<T>> {
  const { send, path, query = {}, updatedAtFrom, pageSize = 100, maxItems } = params
  let offset = 0
  let totalFetched = 0

  while (true) {
    const remaining = maxItems !== undefined ? maxItems - totalFetched : undefined
    const currentLimit = remaining !== undefined ? Math.min(pageSize, remaining) : pageSize

    if (remaining !== undefined && remaining <= 0) break

    const response = await send<T[]>({
      method: 'GET',
      path,
      query: { 
        ...query, 
        limit: currentLimit, 
        offset,
        ...(updatedAtFrom ? { updated_at_from: updatedAtFrom } : {})
      },
    })

    const items = Array.isArray(response.data) ? response.data : []
    if (items.length === 0) break

    totalFetched += items.length
    offset += items.length
    yield items

    if (items.length < currentLimit) break
  }
}

// Standard offset pagination
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
