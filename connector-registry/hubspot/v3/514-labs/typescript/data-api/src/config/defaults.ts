import type { ConnectorConfig } from "../types/config";

export function withDerivedDefaults(user: ConnectorConfig): ConnectorConfig {
  const validationEnabled = user.validation?.enabled ?? (process.env.CONNECTOR_VALIDATE === '1');
  return {
    baseUrl: user.baseUrl ?? 'https://api.hubapi.com',
    timeoutMs: user.timeoutMs ?? 30000,
    userAgent: user.userAgent ?? 'connector-factory/1.0',
    defaultHeaders: { ...(user.defaultHeaders ?? {}) },
    defaultQueryParams: { ...(user.defaultQueryParams ?? {}) },
    auth: user.auth,
    retry: { maxAttempts: 3, initialDelayMs: 1000, maxDelayMs: 30000, backoffMultiplier: 2, retryBudgetMs: 60000, respectRetryAfter: true, ...(user.retry ?? {}) },
    rateLimit: { ...(user.rateLimit ?? {}) },
    hooks: user.hooks ?? {},
    validation: { enabled: validationEnabled, strict: user.validation?.strict ?? false },
  };
}


