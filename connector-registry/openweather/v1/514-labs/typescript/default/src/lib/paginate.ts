/**
 * OpenWeather API does not use pagination.
 * All endpoints return single data points or fixed-size collections.
 * This file is kept for potential future use if pagination is needed.
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
