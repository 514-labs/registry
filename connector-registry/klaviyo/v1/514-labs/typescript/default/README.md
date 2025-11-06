# Klaviyo Connector (TypeScript)

TypeScript implementation of the Klaviyo API connector by 514-labs.

## Overview

The Klaviyo connector provides access to Klaviyo's marketing automation and CRM platform, enabling you to sync customer profiles, lists, and campaign data.

## Features

- **Profiles**: Access and manage customer/contact data
- **Lists**: Work with audience segments and subscription lists
- **Campaigns**: Retrieve email campaign information
- Cursor-based pagination for efficient data fetching
- Type-safe TypeScript implementation

## Quick Start

### Installation

```bash
pnpm install @workspace/connector-klaviyo
```

### Configuration

1. Get your Private API Key from [Klaviyo Settings](https://www.klaviyo.com/settings/account/api-keys)
2. Create a `.env` file (see `.env.example`)

```bash
KLAVIYO_API_KEY=your_private_api_key_here
```

### Basic Usage

```typescript
import { createConnector } from '@workspace/connector-klaviyo'

// Initialize the connector
const connector = createConnector()
connector.init({
  apiKey: process.env.KLAVIYO_API_KEY!,
})

// List profiles
for await (const page of connector.profiles.list({ pageSize: 100 })) {
  for (const profile of page) {
    console.log(`Profile: ${profile.attributes.email}`)
  }
}

// Get a specific profile
const profile = await connector.profiles.get('PROFILE_ID')
console.log(profile.attributes)

// List campaigns
for await (const page of connector.campaigns.list()) {
  for (const campaign of page) {
    console.log(`Campaign: ${campaign.attributes.name} - ${campaign.attributes.status}`)
  }
}

// List lists (audience segments)
for await (const page of connector.lists.list()) {
  for (const list of page) {
    console.log(`List: ${list.attributes.name}`)
  }
}
```

## Configuration Options

See `docs/configuration.md` for detailed configuration options.

## Schemas

Machine-readable schema definitions are available in `schemas/index.json` with accompanying Markdown documentation.

## Resources

- [Klaviyo API Documentation](https://developers.klaviyo.com/en/reference/api_overview)
- [Authentication Guide](https://developers.klaviyo.com/en/docs/authenticate_)

## License

See LICENSE file for details.

