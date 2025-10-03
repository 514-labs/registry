// Adapter exports: reuse core paginate for cursor strategy to match HubSpot/core behavior
export type { SendFn } from '../core'
export { paginateCursor } from '../core'

export async function* paginateOffset<T = any>(params: {
  send: import('../core').SendFn;
  path: string;
  query?: Record<string, any>;
  pageSize?: number;
  extractItems?: (res: any) => T[];
  extractTotal?: (res: any) => number | undefined;
}) {
  const extractItems = params.extractItems ?? ((res: any) => (Array.isArray(res) ? res : res?.items ?? []) as T[])
  let offset = (params.query?.offset as number | undefined) ?? 0
  const limit = params.pageSize ?? (params.query?.limit as number | undefined) ?? 100
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await params.send<any>({ method: 'GET', path: params.path, query: { ...(params.query ?? {}), limit, offset }, operation: 'paginate' })
    const items = extractItems(res.data)
    if (!items.length) break
    yield items
    offset += items.length
    if (items.length < limit) break
  }
}
