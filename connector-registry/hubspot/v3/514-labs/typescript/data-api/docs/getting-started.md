# Getting started

This package provides a HubSpot CRM v3 connector. It exposes a simple lifecycle and typed domain methods for common objects.

## Install

### 1. Navigate to your project

Choose the directory in your project where you want to install the connector.

### 2. Run the installer

```bash
bash -i <(curl https://connectors.514.ai/install.sh) hubspot v3 514-labs typescript data-api
```

### 3. Build the connector

From the generated `hubspot` directory, install dependencies and build:

```bash
npm install
npm run build
```

### 4. Update project configuration

Update your project's `package.json` to include the new connector folder. LLM is great for this!

### 5. Install dependencies in the project root

```bash
npm install
```

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

## Available APIs

The connector wraps several HubSpot CRM endpoints and exposes typed helpers for
common objects:

- **Contacts** – `listContacts`, `getContact`, `streamContacts`, `getContacts`
- **Companies** – `listCompanies`, `getCompany`, `streamCompanies`,
  `getCompanies`
- **Deals** – `listDeals`, `getDeal`, `streamDeals`, `getDeals`
- **Tickets** – `listTickets`, `getTicket`, `streamTickets`, `getTickets`
- **Engagements** (`notes`, `calls`, `emails`, `meetings`, `tasks`) –
  `listEngagements`, `getEngagement`, `streamEngagements`, `getEngagements`

Each method maps directly to the corresponding [HubSpot CRM API](https://developers.hubspot.com/docs/reference/api) endpoint so
you can quickly work with data in your workspace.

See `docs/configuration.md` for all configuration options.
