import type { ConnectorConfig } from "../types/config";

export function withDerivedDefaults(user: ConnectorConfig): ConnectorConfig {
  const base: ConnectorConfig = {
    baseUrl: "https://api.hubapi.com",
    timeoutMs: 30000,
    userAgent: "connector-factory-hubspot/0.1.0",
    defaultHeaders: {
      Accept: "application/json",
    },
    defaultQueryParams: {},
    auth: user.auth,
    retry: {
      maxAttempts: 3,
      initialDelayMs: 1000,
      maxDelayMs: 30000,
      backoffMultiplier: 2,
      retryableStatusCodes: [408, 425, 429, 500, 502, 503, 504],
      retryBudgetMs: 60000,
      respectRetryAfter: true,
    },
    rateLimit: {
      // HubSpot documented burst limit baseline (varies by plan); start conservative
      requestsPerSecond: 15,
      concurrentRequests: 10,
      burstCapacity: 30,
      adaptiveFromHeaders: true,
    },
    hooks: {},
  };
  return {
    ...base,
    ...user,
    retry: { ...base.retry, ...user.retry },
    rateLimit: { ...base.rateLimit, ...user.rateLimit },
    defaultHeaders: { ...base.defaultHeaders, ...user.defaultHeaders },
    defaultQueryParams: { ...base.defaultQueryParams, ...user.defaultQueryParams },
  };
}


