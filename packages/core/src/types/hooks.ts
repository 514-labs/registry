import type { HttpResponseEnvelope } from './envelopes';

export type HookType = 'beforeRequest' | 'afterResponse' | 'onError' | 'onRetry';

// Transport-level request shape passed to hooks
export interface TransportRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: unknown;
  // Optional extras that callers may set
  path?: string;
  operation?: string;
}

export type BeforeRequestContext = {
  type: 'beforeRequest';
  operation?: string;
  request: TransportRequest;
  modifyRequest: (updates: Partial<TransportRequest>) => void;
  abort: (reason?: string) => void;
};

export type AfterResponseContext = {
  type: 'afterResponse';
  operation?: string;
  request: TransportRequest;
  response: HttpResponseEnvelope<unknown>;
  modifyResponse: (updates: Partial<HttpResponseEnvelope<unknown>>) => void;
};

export type OnErrorContext = {
  type: 'onError';
  operation?: string;
  error: unknown;
  request?: TransportRequest;
};

export type OnRetryContext = {
  type: 'onRetry';
  operation?: string;
  metadata: { attempt: number; operation: string };
};

export type HookContext =
  | BeforeRequestContext
  | AfterResponseContext
  | OnErrorContext
  | OnRetryContext;

export interface Hook {
  name: string;
  priority?: number;
  execute: (ctx: HookContext) => Promise<void> | void;
}
