# Observability (using the connector)

The connector exposes lightweight logging and a pluggable metrics hook so you can see what it’s doing during requests.

## Logging

Enable logging when you initialize the connector:

```ts
const conn = createDutchieConnector();
conn.initialize({
  auth: { type: 'basic', basic: { username: apiKey } },
  logging: { enabled: true, level: 'info' }, // default logger prints to console
});
```

What you’ll see:
- `http_request`: method, url (with optional query), and optionally headers/body if you enable them
- `http_response`: status, durationMs, retryCount, and itemCount (if the response data looks like an array or envelope with items)
- `http_error`: message/code/statusCode when errors occur
- `http_retry`: operation and attempt number when retries happen

Optional fields:

```ts
conn.initialize({
  auth: { type: 'basic', basic: { username: apiKey } },
  logging: {
    enabled: true,
    level: 'info',
    includeQueryParams: true,
    includeHeaders: true,
    includeBody: false,
    // Custom sink (replace console)
    logger: (level, event) => myLogger(level, event),
  },
});
```

## Metrics

If you want to aggregate timings and counts, attach the metrics hook during initialization. A simple in‑memory sink is provided for examples/tests:

```ts
import { createMetricsHooks, InMemoryMetricsSink } from './observability/metrics-hooks'

const sink = new InMemoryMetricsSink();
const conn = createDutchieConnector();
conn.initialize({
  auth: { type: 'basic', basic: { username: apiKey } },
  hooks: createMetricsHooks(sink), // attach metrics via hooks field
  logging: { enabled: true, level: 'info' }, // optional: also enable logging
});

// Inspect sink.events to export to your telemetry system
```

Events recorded by the default sink:

```ts
type MetricsEvent =
  | { type: 'request'; operation?: string }
  | { type: 'response'; operation?: string; status?: number; durationMs?: number }
  | { type: 'error'; operation?: string; code?: string }
  | { type: 'retry'; operation?: string; attempt?: number }

// Example
// sink.events => [
//   { type: 'request', operation: 'GET' },
//   { type: 'response', operation: 'GET', status: 200, durationMs: 42 },
// ]
```

## Tips

- Turn on logging first when debugging connectivity or auth.
- Keep `level: 'info'` for day‑to‑day; use `'debug'` only temporarily.
- Avoid `includeBody` unless you know payloads are small and don’t contain secrets.

