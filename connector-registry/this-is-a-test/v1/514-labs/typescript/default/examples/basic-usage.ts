import { createConnector } from '../src'

const conn = createConnector()
conn.initialize({
  baseUrl: 'https://api.example.com',
  auth: { type: 'bearer', bearer: { token: 'YOUR_TOKEN' } },
})

console.log('Connector initialized')

// Example usage:
// for await (const page of conn.data.getAll({ pageSize: 100, maxItems: 200 })) {
//   console.log(page)
// }
