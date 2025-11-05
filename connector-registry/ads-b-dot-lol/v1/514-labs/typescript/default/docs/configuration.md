# Configuration

The ADS-B.lol connector has minimal configuration requirements since the API is open and doesn't require authentication.

## Basic Configuration

```typescript
import { createConnector } from './src'

const conn = createConnector()
conn.init({
  // Optional: override the base URL (defaults to https://api.adsb.lol)
  baseUrl: 'https://api.adsb.lol',
})
```

## Optional Configuration

### Logging

Enable request/response logging:

```typescript
conn.init({
  logging: {
    enabled: true,              // Enable logging
    level: 'info',              // Log level: 'debug' | 'info' | 'warn' | 'error'
    includeQueryParams: true,   // Include query parameters in logs
    includeHeaders: false,      // Include headers in logs
    includeBody: false,         // Include response body in logs
  },
})
```

### Metrics

Enable metrics collection:

```typescript
conn.init({
  metrics: {
    enabled: true,  // Enable metrics collection
  },
})
```

### Custom Base URL

If using a self-hosted ADS-B instance or mirror:

```typescript
conn.init({
  baseUrl: 'https://your-custom-adsb-server.com',
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | `https://api.adsb.lol` | Base URL for the ADS-B API |
| `logging.enabled` | `boolean` | `false` | Enable request/response logging |
| `logging.level` | `'debug'\|'info'\|'warn'\|'error'` | `'info'` | Minimum log level |
| `logging.includeQueryParams` | `boolean` | `false` | Include query parameters in logs |
| `logging.includeHeaders` | `boolean` | `false` | Include headers in logs |
| `logging.includeBody` | `boolean` | `false` | Include response body in logs |
| `metrics.enabled` | `boolean` | `false` | Enable metrics collection |

## No Authentication Required

The ADS-B.lol API is completely open and free to use. No API keys, tokens, or other credentials are required.

## Rate Limiting

As of the current API documentation, there are no published rate limits. However, be respectful of the service and avoid excessive request rates.

## Data License

All data from ADSB.lol is provided under the [Open Database License (ODbL) 1.0](https://opendatacommons.org/licenses/odbl/1.0/), making it freely available for both personal and commercial use.
