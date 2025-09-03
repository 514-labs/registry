import type { Hook, HookType } from "./hooks";

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LoggingOptions {
  enabled?: boolean;
  level?: LogLevel;
  includeQueryParams?: boolean;
  includeHeaders?: boolean;
  includeBody?: boolean;
  logger?: (level: LogLevel, event: Record<string, unknown>) => void;
}

export interface MetricsLabels {
  [key: string]: string | number | boolean | undefined;
}

export interface MetricsSink {
  incrementCounter: (name: string, value?: number, labels?: MetricsLabels) => void;
  observe: (name: string, value: number, labels?: MetricsLabels) => void;
}

export interface MetricsOptions {
  enabled?: boolean;
  sink?: MetricsSink;
}

export interface ConnectorAuthConfig {
  type: "bearer" | "oauth2";
  bearer?: { token: string };
  oauth2?: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    accessToken?: string;
    expiresAt?: number; // epoch seconds
    tokenUrl?: string; // optional override
  };
}

export interface RetryConfig {
  maxAttempts?: number;
  initialDelayMs?: number;
  maxDelayMs?: number;
  backoffMultiplier?: number;
  retryableStatusCodes?: number[];
  retryBudgetMs?: number;
  respectRetryAfter?: boolean;
}

export interface RateLimitConfig {
  requestsPerSecond?: number;
  concurrentRequests?: number;
  burstCapacity?: number;
  adaptiveFromHeaders?: boolean;
}

export interface ConnectorConfig {
  baseUrl?: string;
  timeoutMs?: number;
  userAgent?: string;
  defaultHeaders?: Record<string, string>;
  defaultQueryParams?: Record<string, string | number | boolean>;
  auth: ConnectorAuthConfig;
  retry?: RetryConfig;
  rateLimit?: RateLimitConfig;
  hooks?: Partial<Record<HookType, Hook[]>>;
  // Observability (built-in hooks)
  enableLogging?: boolean | LoggingOptions;
  enableMetrics?: boolean | MetricsOptions;
}


