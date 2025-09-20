import type { ConnectorConfig } from "@connector-factory/core";

export function withDerivedDefaults(userConfig: ConnectorConfig): ConnectorConfig {
  const apiVersion = "v23.0"; // Use current stable version to avoid auto-upgrade

  return {
    ...userConfig,
    baseUrl: userConfig.baseUrl || `https://graph.facebook.com/${apiVersion}`,
    rateLimit: {
      requestsPerSecond: 200, // Facebook Graph API default rate limit
      burstCapacity: 600,
      adaptiveFromHeaders: true,
      ...userConfig.rateLimit,
    },
    timeoutMs: userConfig.timeoutMs || 30000,
    retry: {
      maxAttempts: 3,
      backoffMultiplier: 2,
      initialDelayMs: 1000,
      maxDelayMs: 10000,
      ...userConfig.retry,
    },
    hooks: userConfig.hooks || {},
  };
}