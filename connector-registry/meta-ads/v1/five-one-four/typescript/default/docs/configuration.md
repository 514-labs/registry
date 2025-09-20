# Configuration

The connector accepts a `ConnectorConfig` during `initialize`. It uses the shared HTTP client from `@connector-factory/core` with hooks, retries, and a token‑bucket rate limiter.

```ts
type ConnectorConfig = {
  // Transport
  baseUrl?: string;                         // default: https://graph.facebook.com
  timeoutMs?: number;                       // default: 30000
  userAgent?: string;                       // default: connector-meta-ads
  defaultHeaders?: Record<string, string>;  // e.g., { Accept: "application/json" }
  defaultQueryParams?: Record<string, string | number | boolean>;

  // Auth
  auth: {
    type: "bearer" | "oauth2";             // Meta Ads uses Bearer token authentication
    bearer?: { token: string };            // Facebook Graph API access token
    oauth2?: {
      clientId: string;
      clientSecret: string;
      refreshToken: string;
      accessToken?: string;
      expiresAt?: number;
      tokenUrl?: string;                   // default: https://graph.facebook.com/oauth/access_token
    };
  };

  // Retries
  retry?: {
    maxAttempts?: number;                   // default: 3
    initialDelayMs?: number;                // default: 1000
    maxDelayMs?: number;                    // default: 30000
    backoffMultiplier?: number;             // default: 2
    retryableStatusCodes?: number[];        // default: [408, 425, 429, 500, 502, 503, 504]
    retryBudgetMs?: number;                 // default: 60000
    respectRetryAfter?: boolean;            // default: true
  };

  // Rate limit
  rateLimit?: {
    requestsPerSecond?: number;             // default: 25 (Facebook's rate limit)
    concurrentRequests?: number;            // default: 10
    burstCapacity?: number;                 // default: 50
    adaptiveFromHeaders?: boolean;          // default: true
  };

  // Hooks
  hooks?: {
    beforeRequest?: Function[];
    afterResponse?: Function[];
    onRetry?: Function[];
    onError?: Function[];
  };
}
```

Defaults are applied in `createMetaAdsConnector().initialize()`; you can override anything as needed.

## Validation

You can enable response validation for Meta Ads API responses:

```ts
const metaAds = createMetaAdsConnector();
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  validation: { enabled: true, strict: false },
});
```

- When `strict=true`, a validation error throws; otherwise validation errors are logged and ignored.

## Observability

Built-in logging and metrics hooks can be enabled without writing any custom code:

```ts
import { createMetaAdsConnector } from "@workspace/connector-meta-ads";

const metaAds = createMetaAdsConnector();
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  logging: { enabled: true, level: "info" },
});
```

- Logging hook emits compact request/response/error/retry events
- Metrics hook records request/response/error/retry counts and durations

### Manual composition

```ts
import { InMemoryMetricsSink, createMetricsHooks } from "@workspace/connector-meta-ads";

const sink = new InMemoryMetricsSink();
const hooks = createMetricsHooks(sink);

metaAds.initialize({
  auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  hooks: { ...hooks },
});

// later: inspect sink.events
```

## Meta Ads Specific Configuration

### Account ID

Many Meta Ads API endpoints require an account ID (Ad Account ID). You can configure this globally:

```ts
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  defaultQueryParams: {
    account_id: process.env.META_ADS_ACCOUNT_ID
  },
});
```

### API Version

The connector defaults to the latest stable Facebook Graph API version. You can specify a different version:

```ts
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  baseUrl: "https://graph.facebook.com/v19.0", // Use specific API version
});
```

### Fields and Parameters

Configure default fields for API calls:

```ts
metaAds.initialize({
  auth: { type: "bearer", bearer: { token: process.env.META_ADS_ACCESS_TOKEN! } },
  defaultQueryParams: {
    fields: "id,name,status,objective,spend,impressions,clicks"
  },
});
```
