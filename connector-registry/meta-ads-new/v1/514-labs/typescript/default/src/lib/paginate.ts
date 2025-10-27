// Re-export from types for compatibility
export type { HttpResponseEnvelope } from '../types/envelopes'

export type SendFn = <T = any>(args: {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  body?: unknown;
  operation?: string;
}) => Promise<import('../types/envelopes').HttpResponseEnvelope<T>>

// Optional: cursor pagination helper (commented)
// export async function* paginateCursor<T = any>(params: {
//   send: SendFn; path: string; query?: Record<string, any>; pageSize?: number;
//   extractItems?: (res: any) => T[]; extractNextCursor?: (res: any) => string | undefined;
// }) { /* ... see docs for an example ... */ }
