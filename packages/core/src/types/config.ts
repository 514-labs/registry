import type { Hook, HookType } from './hooks';

export interface ConnectorAuthConfig {
  type: 'bearer' | 'oauth2' | 'basic';
  bearer?: { token: string };
  basic?: { username: string; password?: string };
  oauth2?: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    accessToken?: string;
    expiresAt?: number;
    tokenUrl?: string;
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
  /** Drop null-valued properties from responses before resource transforms (default: true). */
  dropNulls?: boolean;
}
