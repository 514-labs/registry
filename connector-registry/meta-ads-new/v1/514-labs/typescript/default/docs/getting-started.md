# Getting started

## Basic Usage

```ts
import { createConnector } from './src'

const conn = createConnector()
conn.initialize({
  baseUrl: 'https://api.example.com',
  auth: { type: 'bearer', bearer: { token: process.env.API_TOKEN! } },
  logging: { enabled: true, level: 'info' },
})

// Fetch all items with client-side pagination
for await (const page of conn.campaigns.getAll({
  params: {
    // Add any resource-specific filter params here
  },
  paging: {
    pageSize: 100,  // Items per page
    maxItems: 500,  // Max total items to fetch
  },
})) {
  console.log(`Received ${page.length} items`)
  // Process each page of items
  page.forEach(item => {
    console.log(item.id)
  })
}
```

## Without Pagination

If you want all items in a single page:

```ts
for await (const page of conn.campaigns.getAll()) {
  // All items in a single page
  console.log(`Total items: ${page.length}`)
}
```

## With Filters

```ts
for await (const page of conn.campaigns.getAll({
  params: {
    // Resource-specific filters (see resource file for available params)
  },
  paging: { pageSize: 50 },
})) {
  // Process filtered results
}
```
