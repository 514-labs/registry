// Local connector types - these would eventually be in @workspace/connector-types

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface ConnectorConfig {
  baseUrl: string;
  timeout?: number;
  userAgent?: string;
  proxy?: { host: string; port: number; protocol?: string; credentials?: unknown };
  tls?: { verify?: boolean; minVersion?: string; caBundle?: string; certificates?: unknown };
  pooling?: { maxConnections?: number; keepAlive?: boolean };
  auth?: { type: "api_key" | "bearer" | "basic" | "oauth2" | "custom"; credentials: unknown };
  retry?: {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    backoffMultiplier?: number;
    retryableStatusCodes?: number[];
    retryableErrors?: string[];
    retryBudgetMs?: number;
    respectRetryAfter?: boolean;
    idempotency?: boolean;
  };
  rateLimit?: {
    requestsPerSecond?: number;
    requestsPerMinute?: number;
    requestsPerHour?: number;
    concurrentRequests?: number;
    burstCapacity?: number;
    adaptiveFromHeaders?: boolean;
  };
  defaultHeaders?: Record<string, string>;
  defaultQueryParams?: Record<string, string | number>;
  hooks?: Partial<Record<HookType, Hook[]>>;
}

export type HookType = "beforeRequest" | "afterResponse" | "onError" | "onRetry";

export interface HookContext {
  type: HookType;
  request?: RequestOptions;
  response?: ResponseEnvelope<unknown>;
  error?: unknown;
  metadata?: Record<string, unknown>;
  modifyRequest?: (updates: Partial<RequestOptions>) => void;
  modifyResponse?: (updates: Partial<ResponseEnvelope<unknown>>) => void;
  abort?: (reason?: string) => void;
}

export interface Hook {
  name: string;
  priority?: number;
  execute: (ctx: HookContext) => Promise<void> | void;
}

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
  timeout?: number;
}

export interface ResponseEnvelope<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  meta?: {
    timestamp: string;
    duration: number;
    retryCount?: number;
    rateLimit?: {
      limit?: number;
      remaining?: number;
      reset?: string;
      retryAfter?: number;
    };
    requestId?: string;
  };
}

export interface Connector {
  initialize: (config: ConnectorConfig) => Promise<void> | void;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  isConnected: () => boolean;
  request: <T = unknown>(options: RequestOptions) => Promise<ResponseEnvelope<T>>;
  get: <T = unknown>(path: string, options?: Omit<RequestOptions, "method" | "path">) => Promise<ResponseEnvelope<T>>;
  post: <T = unknown>(path: string, data?: unknown, options?: Omit<RequestOptions, "method" | "path" | "body">) => Promise<ResponseEnvelope<T>>;
  put: <T = unknown>(path: string, data?: unknown, options?: Omit<RequestOptions, "method" | "path" | "body">) => Promise<ResponseEnvelope<T>>;
  patch: <T = unknown>(path: string, data?: unknown, options?: Omit<RequestOptions, "method" | "path" | "body">) => Promise<ResponseEnvelope<T>>;
  delete: <T = unknown>(path: string, options?: Omit<RequestOptions, "method" | "path" | "body">) => Promise<ResponseEnvelope<T>>;
  batch?: <T = unknown>(requests: RequestOptions[]) => Promise<ResponseEnvelope<T>[]>;
  paginate?: <T = unknown>(options: { path: string; pageSize?: number; strategy?: "cursor" | "offset" | "page" | "link-header" }) => AsyncIterable<T[]>;
}