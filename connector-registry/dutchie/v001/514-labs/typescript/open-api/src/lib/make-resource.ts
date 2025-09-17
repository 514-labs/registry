import { paginateCursor, type SendFn } from './paginate'

type PaginateFn<TItem> = (args: {
  send: SendFn
  path: string
  query?: Record<string, any>
  pageSize?: number
}) => AsyncGenerator<TItem[]>

function defaultListQuery(params?: { properties?: string[]; limit?: number; after?: string }) {
  const query: Record<string, any> = {}
  if (params?.properties?.length) query.properties = params.properties.join(',')
  if (params?.limit) query.limit = params.limit
  if (params?.after) query.after = params.after
  return query
}

function defaultGetQuery(params: { properties?: string[] }) {
  const query: Record<string, any> = {}
  if (params?.properties?.length) query.properties = params.properties.join(',')
  return query
}

export function makeCrudResource<
  TItem,
  TListResponse,
  TSingleResponse,
  TListParams extends Record<string, any> | undefined = undefined,
  TGetParams extends { id: string } & Record<string, any> = { id: '' } & Record<string, any>
>(
  objectPath: string,
  send: SendFn,
  options?: {
    buildListQuery?: (params?: TListParams) => Record<string, any>
    buildGetQuery?: (params: Omit<TGetParams, 'id'>) => Record<string, any>
    paginate?: PaginateFn<TItem>
  }
) {
  const paginateImpl: PaginateFn<TItem> = options?.paginate
    ?? (async function* (args) {
      for await (const items of paginateCursor<TItem>({ send: args.send, path: args.path, query: args.query, pageSize: args.pageSize })) {
        yield items
      }
    })

  const api = {
    list: (params?: TListParams) => {
      const query = options?.buildListQuery
        ? options.buildListQuery(params)
        : defaultListQuery(params as any)
      return send<TListResponse>({ method: 'GET', path: objectPath, query })
    },
    get: (params: TGetParams) => {
      const query = options?.buildGetQuery
        ? options.buildGetQuery(params as any)
        : defaultGetQuery(params as any)
      return send<TSingleResponse>({ method: 'GET', path: `${objectPath}/${params.id}`, query })
    },
    streamAll: async function* (params?: (TListParams extends undefined ? { pageSize?: number } : TListParams & { pageSize?: number })) {
      const listParams = params as any
      const query = options?.buildListQuery ? options.buildListQuery(listParams) : defaultListQuery(listParams)
      for await (const items of paginateImpl({ send, path: objectPath, query, pageSize: (params as any)?.pageSize })) {
        for (const item of items) yield item
      }
    },
    getAll: async (params?: (TListParams extends undefined ? { pageSize?: number; maxItems?: number } : TListParams & { pageSize?: number; maxItems?: number })) => {
      const results: TItem[] = []
      for await (const item of (api as any).streamAll(params)) {
        results.push(item)
        if ((params as any)?.maxItems && results.length >= (params as any).maxItems) break
      }
      return results
    },
  }
  return api
}
