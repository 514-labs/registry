# Getting started

```ts
import { createConnector } from './src'

const conn = createConnector()
conn.initialize({
  baseUrl: 'https://api.example.com',
  auth: { type: 'bearer', bearer: { token: process.env.API_TOKEN! } },
  logging: { enabled: true, level: 'info' },
})

for await (const page of conn.myResource.getAll({ pageSize: 100, maxItems: 500 })) {
  console.log(page.length)
}
```
