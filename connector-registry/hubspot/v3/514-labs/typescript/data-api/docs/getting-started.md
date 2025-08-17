# Getting started

This package provides a HubSpot CRM v3 connector. It exposes a simple lifecycle and typed domain methods for common objects.

## Install

- Navigate to your project, specifically where you want to install the connector
- Run `bash -i <(curl https://connectors.514.ai/install.sh) hubspot v3 514-labs typescript`
- Add the connector to your workspaces if you have that configured
- Run `npm | pnpm install`

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
