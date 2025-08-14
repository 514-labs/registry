# Getting started

This package provides a HubSpot CRM v3 connector. It exposes a simple lifecycle and typed domain methods for common objects.

## Install

- Inside this monorepo: `pnpm -w --filter @workspace/connector-hubspot build`
- In another project, copy this connector folder structure (root `_meta`, provider `_meta`, and `typescript/`) as needed.

## Quick start

```ts
import { createHubSpotConnector } from "@workspace/connector-hubspot";

async function main() {
  const hubspot = createHubSpotConnector();

  hubspot.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
  });
  await hubspot.connect();

  for await (const contact of hubspot.streamContacts({ pageSize: 100 })) {
    console.log(contact.id);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

See `docs/configuration.md` for all configuration options.
