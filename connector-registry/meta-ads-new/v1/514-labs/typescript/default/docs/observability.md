# Observability

## Logging
```ts
conn.initialize({
  logging: { enabled: true, level: 'info', includeQueryParams: true, includeHeaders: true, includeBody: false }
})
```
Emits http_request and http_response with optional fields.

## Metrics
```ts
import { createMetricsHooks, InMemoryMetricsSink } from '../src/observability/metrics-hooks'
const sink = new InMemoryMetricsSink()
conn.initialize({ hooks: createMetricsHooks(sink) })
```
Inspect sink.events for telemetry.
