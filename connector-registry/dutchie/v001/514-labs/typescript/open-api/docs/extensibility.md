## Extending the Dutchie connector (adding new resources)

hey-api already generates all TypeScript types from the OpenAPI document into `src/generated/types.gen.ts`. To add support for a new object/endpoint, you generally only need to:

1) Locate the types you need
- Look in `src/generated/types.gen.ts` for the response type of your endpoint (e.g., `FooGetResponses[200]` or a concrete item type like `FooItem`).

2) Create a resource file
- Add `src/resources/foo.ts` and use `makeCrudResource` to bind the HTTP path and map query params.

Example (offset/cursor choice and query params are per-endpoint):

```ts
// src/resources/foo.ts
import { makeCrudResource } from '../lib/make-resource';
import type { SendFn } from '../lib/paginate';
import type { FooItem } from '../generated/types.gen';

export const createFooResource = (send: SendFn) => {
  return makeCrudResource<
    FooItem,               // list item type
    FooItem[],             // list response type
    FooItem,               // single item type
    { isActive?: boolean } // list params (optional)
  >(
    '/foo',
    send,
    {
      // Map typed params -> query string
      buildListQuery: (params) => ({
        ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
      }),
      // Optional: override pagination if endpoint uses limit/offset
      // paginate: ({ send, path, pageSize }) => paginateOffset<FooItem>({ send, path, pageSize }),
    }
  );
};
```

3) Wire the resource into the connector
- Expose a getter in `src/client/dutchie-connector.ts` to make it available to consumers:

```ts
// src/client/dutchie-connector.ts
import { createFooResource } from '../resources/foo';

export class DutchieApiConnector extends ApiConnectorBase {
  // ...
  private get sendLite() { return async (args: any) => (this as any).request(args) }
  get foo() { return createFooResource(this.sendLite as any) }
}
```

4) Add tests
- Unit test the list/get methods using `nock` just like existing resources.

5) (Optional) Validation
- If you enable validation (`initialize({ validation: { enabled: true } })`), the Typia-based hook will assert runtime shapes for known paths. If your new endpoint needs explicit checks, extend `createTypiaValidationHooks` to include your path.

Notes
- Choose pagination strategy per endpoint: default cursor (built-in) vs. `paginateOffset` for limit/offset APIs.
- You do not need to touch the OpenAPI JSON at runtime -- hey-api types are compile-time only, and requests use the core HTTP client.

