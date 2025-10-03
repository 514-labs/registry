import type { HookType, Hook } from "../types/hooks";

export interface HttpRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  operation?: string;
  resourceHooks?: Partial<Record<HookType, Hook[]>>;
}

export interface HttpClientOptions {
  applyAuth?: (req: { headers: Record<string, string> }) => void;
}
