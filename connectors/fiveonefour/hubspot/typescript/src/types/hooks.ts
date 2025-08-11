import type { HttpResponseEnvelope } from "./envelopes";

export type HookType = "beforeRequest" | "afterResponse" | "onError" | "onRetry";

export interface HookContext {
  type: HookType;
  operation?: string;
  request?: Record<string, unknown>;
  response?: HttpResponseEnvelope<unknown>;
  error?: unknown;
  metadata?: Record<string, unknown>;
  modifyRequest?: (updates: Record<string, unknown>) => void;
  modifyResponse?: (updates: Partial<HttpResponseEnvelope<unknown>>) => void;
  abort?: (reason?: string) => void;
}

export interface Hook {
  name: string;
  priority?: number;
  execute: (ctx: HookContext) => Promise<void> | void;
}


