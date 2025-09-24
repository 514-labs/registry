# Dutchie (TypeScript)

This folder contains ready‑to‑use Dutchie connector source code. It’s meant to live inside your app and be imported via a relative path.

## Quick start

1) Set your API key in the environment

```
DUTCHIE_API_KEY=<your_api_key>
```

2) Use the connector in your code

```ts
// Adjust the relative import to where this folder resides in your app
import { createDutchieConnector } from './connectors/dutchie'

async function main() {
  const conn = createDutchieConnector()
  conn.initialize({
    auth: { type: 'basic', basic: { username: process.env.DUTCHIE_API_KEY! } },
    // Optional: request/response logs to console
    logging: { enabled: true, level: 'info' },
  })

  // Stream brands in pages of 100 (single GET, client-side chunking)
  for await (const page of conn.brand.getAll({ pageSize: 100, maxItems: 500 })) {
    for (const brand of page) {
      // do something with brand
    }
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
```

## Debugging

Enable logging with a config:

```ts
conn.initialize({
  auth: { type: 'basic', basic: { username: apiKey } },
  logging: { enabled: true, level: 'info' }, // default logger prints to console
})
```

You’ll see events like `http_request` and `http_response` with URL, status, duration, etc.

Define custom logger with a config:

```ts
conn.initialize({
  auth: { type: 'basic', basic: { username: apiKey } },
  logging: { enabled: true, level: 'info', logger: (level, event) => mySink(level, event) },
})
```

## Full documentation

- [Dutchie connector docs](https://registry.514.ai/connectors/dutchie/v001/514-labs/typescript/open-api)
- [Source repository](https://github.com/514-labs/registry/tree/main/connector-registry/dutchie/v001/514-labs/typescript/open-api)
