# Connector Registry API

Base URL: `https://registry.514.ai`

---

## Endpoints

### 1. List All Connectors and Pipelines

Get all available connectors and pipelines in the registry.

```
GET /api/registry/contents
```

**When to use:** Browse all available connectors and pipelines, filter by type, language, or category.

**Response:**
```json
{
  "total": 150,
  "connectors": 120,
  "pipelines": 30,
  "items": [
    {
      "type": "connector",
      "id": "meta-ads",
      "name": "Meta Ads",
      "version": "v1",
      "language": "typescript",
      "category": "advertising",
      "tags": ["advertising", "marketing"],
      "capabilities": { "extract": true, "transform": false, "load": false }
    }
  ]
}
```

---

### 2. Discover Connectors

Get enriched connector list with reactions and creator avatars.

```
GET /api/discover/connectors
```

**When to use:** Display connectors in a discovery UI with social proof (reactions, creator info).

**Response:**
```json
[
  {
    "name": "Meta Ads",
    "description": "Extract campaign data from Meta Ads",
    "tags": ["Marketing"],
    "languages": ["Typescript"],
    "reactions": 5,
    "creatorAvatarUrl": "https://github.com/514-labs.png",
    "implementationCount": 1
  }
]
```

---

### 3. Get Connector Overview

Get all versions and implementations for a specific connector.

```
GET /api/connectors/{connectorId}
```

**Parameters:**
- `connectorId` - Connector identifier (e.g., `meta-ads`, `hubspot`)

**When to use:** Get an overview of available versions, providers, and implementations before drilling into details.

**Example:**
```bash
curl https://registry.514.ai/api/connectors/meta-ads
```

**Response:**
```json
{
  "id": "meta-ads",
  "name": "Meta Ads",
  "description": "Extract campaign data from Meta Ads",
  "tags": ["advertising", "marketing"],
  "category": "advertising",
  "homepage": "https://developers.facebook.com/docs/graph-api/",
  "license": "MIT",
  "versions": ["v1"],
  "providers": [
    {
      "authorId": "514-labs",
      "version": "v1",
      "avatarUrl": "https://github.com/514-labs.png",
      "implementations": [
        {
          "language": "typescript",
          "implementation": "default",
          "reactions": 1,
          "apiUrl": "/api/connectors/meta-ads/v1/514-labs/typescript/default",
          "webUrl": "/connectors/meta-ads/v1/514-labs/typescript/default"
        }
      ]
    }
  ]
}
```

---

### 4. Get Implementation Details

Get complete documentation, schemas, and metadata for a specific implementation.

```
GET /api/connectors/{connectorId}/{version}/{creator}/{language}/{implementation}
```

**Parameters:**
- `connectorId` - Connector identifier
- `version` - Version (e.g., `v1`, `v2`)
- `creator` - Author/organization (e.g., `514-labs`)
- `language` - Programming language (e.g., `typescript`, `python`)
- `implementation` - Implementation variant (e.g., `default`, `data-api`)

**When to use:** Get installation instructions, API schemas, configuration docs, and usage guides.

**Example:**
```bash
curl https://registry.514.ai/api/connectors/meta-ads/v1/514-labs/typescript/default
```

**Response:**
```json
{
  "id": "meta-ads",
  "name": "Meta Ads",
  "version": "v1",
  "creator": "514-labs",
  "language": "typescript",
  "implementation": "default",
  "urls": {
    "registry": "https://github.com/514-labs/registry/...",
    "issue": "https://github.com/514-labs/registry/issues/80",
    "source": "https://github.com/514-labs/registry/tree/main/...",
    "web": "/connectors/meta-ads/v1/514-labs/typescript/default"
  },
  "metaFiles": {
    "README.md": "# meta-ads\n\n...",
    "CHANGELOG.md": "# Changelog\n\n...",
    "LICENSE": "MIT"
  },
  "docs": [
    {
      "slug": "getting-started",
      "title": "Getting started",
      "content": "# Getting started\n\n..."
    },
    {
      "slug": "configuration",
      "title": "Configuration",
      "content": "# Configuration\n\n..."
    }
  ],
  "schema": {
    "endpoints": [
      {
        "method": "GET",
        "path": "/raw/campaigns",
        "title": "Meta Ads Raw Campaign",
        "params": [
          { "name": "id", "type": "string", "required": true },
          { "name": "name", "type": "string", "required": true }
        ]
      }
    ],
    "database": { "tables": [] },
    "files": [],
    "documentation": {
      "extracted/relational/README.md": "# Schema docs..."
    }
  }
}
```

---

## Common Usage Patterns

### Browse All Connectors
```bash
curl https://registry.514.ai/api/registry/contents | \
  jq '.items[] | select(.type == "connector") | {name, category}'
```

### Find TypeScript Implementations
```bash
curl https://registry.514.ai/api/registry/contents | \
  jq '.items[] | select(.language == "typescript")'
```

### Get Installation Instructions
```bash
curl https://registry.514.ai/api/connectors/meta-ads/v1/514-labs/typescript/default | \
  jq -r '.docs[] | select(.slug == "getting-started") | .content'
```

### Get API Schema
```bash
curl https://registry.514.ai/api/connectors/meta-ads/v1/514-labs/typescript/default | \
  jq '.schema.endpoints[] | {method, path, title}'
```

---

## Error Responses

All errors return JSON with an `error` field:

```json
{
  "error": "Connector not found"
}
```

**HTTP Status Codes:**
- `200` - Success
- `404` - Resource not found
- `500` - Server error
