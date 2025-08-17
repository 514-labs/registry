import type { HttpResponseEnvelope } from "../types/envelopes";

export type SendFn = <T = any>(args: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  body?: unknown;
  operation?: string;
}) => Promise<HttpResponseEnvelope<T>>;

export async function* paginateCursor<T = any>(params: {
  send: SendFn;
  path: string;
  query?: Record<string, any>;
  pageSize?: number;
  extractItems?: (res: any) => T[];
  extractNextCursor?: (res: any) => string | undefined;
}) {
  const extractItems = params.extractItems ?? ((res: any) => (res?.results ?? []) as T[]);
  const extractNext = params.extractNextCursor ?? ((res: any) => res?.paging?.next?.after as string | undefined);
  let after: string | undefined = params.query?.after as string | undefined;
  const limit = params.pageSize ?? (params.query?.limit as number | undefined) ?? 100;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const res = await params.send<any>({ method: "GET", path: params.path, query: { ...(params.query ?? {}), limit, after }, operation: "paginate" });
    const items = extractItems(res.data);
    yield items;
    const next = extractNext(res.data);
    if (!next) break;
    after = next;
  }
}


