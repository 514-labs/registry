# Testing Observability Features

This document explains how to test the observability features (logging and metrics) in the Meta Ads connector.

## Unit tests

- Logging hooks: verify level filtering, optional inclusion of query/headers/body
- Metrics hooks: verify request/response/error/retry events and durations

## Enabling observability

```ts
import { createMetaAdsConnector, InMemoryMetricsSink, createMetricsHooks } from "@workspace/connector-meta-ads";

const metaAds = createMetaAdsConnector();
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  logging: { enabled: true, level: "info" },
});

const sink = new InMemoryMetricsSink();
const hooks = createMetricsHooks(sink);
// Compose manually if desired
```

## Example assertions

```ts
// Logging: use a custom logger to capture events
const events: any[] = [];
const metaAds = createMetaAdsConnector();
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: "test-token" } },
  logging: { enabled: true, level: "info" },
});

// Metrics: inspect sink.events after calls
```

## Environment variables

For integration tests that hit the live API, set:

```bash
export META_ADS_ACCESS_TOKEN="your-facebook-access-token"
export META_ADS_ACCOUNT_ID="your-ad-account-id"  # Optional, for account-specific tests
```

Most tests should use mocks (e.g., `nock`) and won't require a real token.

## Testing Rate Limiting and Retries

```ts
import { createMetaAdsConnector } from "@workspace/connector-meta-ads";
import nock from "nock";

// Test rate limiting behavior
const metaAds = createMetaAdsConnector();
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: "test-token" } },
  rateLimit: { requestsPerSecond: 2, burstCapacity: 5 },
  logging: { enabled: true, level: "debug" },
});

// Mock rate limited response
nock("https://graph.facebook.com")
  .get("/v19.0/campaigns")
  .reply(429, { error: { message: "Rate limit exceeded" } }, {
    "Retry-After": "30"
  });

// Test retry behavior
nock("https://graph.facebook.com")
  .get("/v19.0/campaigns")
  .reply(200, { data: [] });

// Your test assertions here
```

## Testing Different API Versions

```ts
// Test with different Graph API versions
const metaAds = createMetaAdsConnector();
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  baseUrl: "https://graph.facebook.com/v18.0", // Test with older version
});
```