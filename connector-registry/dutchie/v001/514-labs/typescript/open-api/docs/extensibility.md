## Extending the Dutchie connector (adding new resources)

hey-api already generates all TypeScript types from the OpenAPI document into `src/generated/types.gen.ts`. To add support for a new object/endpoint, you generally only need to:

1) Locate the types you need
- Look in `src/generated/types.gen.ts` for the response type of your endpoint (e.g. `FooItem`).

2) Create a resource file
- Add `src/resources/foo.ts` and use `makeCrudResource` to bind the HTTP path and map query params. `getAll` performs a single GET and yields client-sized pages (local chunking via `pageSize`, with `maxItems` to stop early).

Example (map query params; chunk locally with `getAll`):

```ts
// src/resources/foo.ts
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { FooItem } from '../generated/types.gen'

export const createFooResource = (send: SendFn) => {
  return makeCrudResource<FooItem, { isActive?: boolean }>(
    '/foo',
    send,
    {
      buildListQuery: (params) => ({
        ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
      }),
    }
  )
}
```

3) Wire the resource into the connector
- Expose a getter in `src/client/dutchie-connector.ts` to make it available to consumers:

```ts
// src/client/dutchie-connector.ts
import { ApiConnectorBase } from '@connector-factory/core'
import { createFooResource } from '../resources/foo'

export class DutchieApiConnector extends ApiConnectorBase {
  ...
  get foo() { return createFooResource(this.sendLite) }
}
```

4) Add tests
- Unit test `getAll` using `nock`: mock one GET returning an array; assert chunking with `{ pageSize: 1 }` yields multiple pages; test param mapping.

5) (Optional) Validation
- If you enable validation (`initialize({ validation: { enabled: true } })`), the Typia-based hook will assert runtime shapes for known paths. If your new endpoint needs explicit checks, extend `createTypiaValidationHooks` to include your path.

Notes
- Dutchie endpoints like `/brand`, `/products`, `/inventory` return arrays; we use one GET and local chunking. If an endpoint truly paginates, add a custom iterator or extend `makeCrudResource` accordingly.
- You do not need runtime OpenAPI JSON; hey‑api types are compile‑time only. Requests use the shared core HTTP client (so logging/validation hooks apply automatically).

