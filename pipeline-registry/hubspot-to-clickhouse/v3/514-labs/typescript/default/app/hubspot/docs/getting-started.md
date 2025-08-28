# Getting started

This package provides a HubSpot CRM v3 connector. It exposes a simple lifecycle and typed domain methods for common objects.

## Install

- Navigate to your project, specifically where you want to install the connector
- Run `bash -i <(curl https://connectors.514.ai/install.sh) hubspot v3 514-labs typescript`
- In the hubspot directory, run `npm install && npm run build`
- Update your project's `package.json` to understand the new connector folder. LLM is great for this!
- Run `npm install` from your project root to update your `node_modules` with the new connector

## Quick start

```ts
import { createHubSpotConnector } from "@workspace/connector-hubspot";

async function main() {
  const hubspot = createHubSpotConnector();

  hubspot.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
  });
  await hubspot.connect();

  // Fetch a page of contacts
  const { data: contactsPage } = await hubspot.listContacts({
    limit: 5,
    properties: ["firstname", "lastname"],
  });
  for (const contact of contactsPage.results) {
    console.log(`${contact.id}: ${contact.properties.firstname}`);
  }

  // Look up a single contact by id
  const { data: contactDetail } = await hubspot.getContact({
    id: contactsPage.results[0].id,
    properties: ["email"],
  });
  console.log("Email:", contactDetail.properties.email);

  // Stream deals lazily
  for await (const deal of hubspot.streamDeals({ pageSize: 100 })) {
    console.log("Deal", deal.id);
    break; // remove break to process all deals
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
```

See `docs/configuration.md` for all configuration options.
