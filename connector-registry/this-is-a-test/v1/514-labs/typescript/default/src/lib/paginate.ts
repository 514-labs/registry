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

// Optional: cursor pagination helper (commented)
// export async function* paginateCursor<T = any>(params: {
//   send: SendFn; path: string; query?: Record<string, any>; pageSize?: number;
//   extractItems?: (res: any) => T[]; extractNextCursor?: (res: any) => string | undefined;
// }) { /* ... see docs for an example ... */ }
