/**
 * Type definitions for HTTP request/response handling.
 * 
 * Note: ADS-B.lol API returns all aircraft in a single response,
 * so server-side pagination is not needed. Pagination is handled
 * client-side in the aircraft resource.
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
