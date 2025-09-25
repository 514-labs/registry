import type { ConnectorConfig } from "../types/config";
import type { Hook, HookType } from "@connector-factory/core";
import { createLoggingHooks } from "../observability/logging-hooks";
import { createMetricsHooks } from "../observability/metrics-hooks";

export function withDerivedDefaults(user: ConnectorConfig): ConnectorConfig {
  const base: ConnectorConfig = {
    baseUrl: 'https://api.hubapi.com',
    timeoutMs: 30000,
    userAgent: 'connector-factory-hubspot/0.1.0',
    defaultHeaders: {
      Accept: 'application/json',
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
    circuitBreaker: {
      enabled: true,
      threshold: 5,
      coolDownMs: 60000,
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

  const validationEnabled = user.validation?.enabled ?? (process.env.CONNECTOR_VALIDATE === '1');

  const merged: ConnectorConfig = {
    ...base,
    ...user,
    retry: { ...base.retry, ...user.retry },
    circuitBreaker: { ...base.circuitBreaker, ...user.circuitBreaker },
    rateLimit: { ...base.rateLimit, ...user.rateLimit },
    defaultHeaders: { ...base.defaultHeaders, ...user.defaultHeaders },
    defaultQueryParams: { ...base.defaultQueryParams, ...user.defaultQueryParams },
    validation: {
      enabled: validationEnabled,
      strict: user.validation?.strict ?? false,
    },
  };

  // Append built-in hooks based on enable flags
  const hooks: Partial<Record<HookType, Hook[]>> = { ...(merged.hooks ?? {}) };

  if (merged.enableLogging) {
    const loggingOptions = typeof merged.enableLogging === "object" ? merged.enableLogging : { enabled: true };
    const logging = createLoggingHooks(loggingOptions);
    for (const phase of ["beforeRequest", "afterResponse", "onError", "onRetry"] as HookType[]) {
      const toAdd = (logging as any)[phase] as Hook[] | undefined;
      if (toAdd?.length) hooks[phase] = [ ...(hooks[phase] ?? []), ...toAdd ];
    }
  }

  if (merged.enableMetrics) {
    const metricsOptions = typeof merged.enableMetrics === "object" ? merged.enableMetrics : { enabled: true };
    const { hooks: metrics } = createMetricsHooks(metricsOptions as any);
    for (const phase of ["beforeRequest", "afterResponse", "onError", "onRetry"] as HookType[]) {
      const toAdd = (metrics as any)[phase] as Hook[] | undefined;
      if (toAdd?.length) hooks[phase] = [ ...(hooks[phase] ?? []), ...toAdd ];
    }
  }

  merged.hooks = hooks;
  return merged;
}


