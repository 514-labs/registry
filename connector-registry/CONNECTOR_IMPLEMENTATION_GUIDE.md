# Connector Implementation Guide

This guide provides comprehensive instructions for adding new connectors to the 514 Labs Connector Registry.

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Scaffolding a New Connector](#scaffolding-a-new-connector)
3. [Required Metadata Files](#required-metadata-files)
4. [Resource Implementation Patterns](#resource-implementation-patterns)
5. [Implementation Checklist](#implementation-checklist)
6. [File Templates](#file-templates)
7. [Naming Conventions](#naming-conventions)
8. [Common Patterns](#common-patterns)
9. [Schema Definitions](#schema-definitions)
10. [Testing Guidelines](#testing-guidelines)
11. [Best Practices](#best-practices)

---

## Directory Structure

Every connector follows this standardized structure:

```
connector-registry/
└── {connector-name}/                    # kebab-case (e.g., meta-ads, google-analytics)
    ├── _meta/
    │   ├── connector.json              # Root connector metadata
    │   └── README.md                   # Brief overview
    └── {version}/                       # v1, v001, v4, ga4, 2024-10-01, etc.
        ├── _meta/
        │   ├── version.json            # Version metadata
        │   └── README.md               # Version documentation
        └── {author}/                    # GitHub org or user (e.g., 514-labs)
            ├── _meta/
            │   └── README.md           # Author-specific overview
            └── {language}/              # typescript, python
                ├── _meta/
                │   └── connector.json  # Language-level metadata
                └── {implementation}/    # default, open-api, advanced
                    ├── _meta/
                    │   ├── connector.json    # Complete connector metadata
                    │   ├── README.md         # Implementation overview
                    │   ├── CHANGELOG.md      # Version history
                    │   └── LICENSE           # License file (usually MIT)
                    ├── src/                  # Source code
                    │   ├── index.ts          # Main export
                    │   ├── client.ts         # Connector class
                    │   ├── client/           # Connector implementation
                    │   ├── resources/        # Resource implementations (Pattern A)
                    │   ├── domains/          # Domain implementations (Pattern B)
                    │   ├── auth/             # Authentication strategies
                    │   ├── observability/    # Logging/metrics hooks
                    │   ├── lib/              # Shared utilities
                    │   ├── types/            # TypeScript type definitions
                    │   ├── validation/       # Validation hooks
                    │   └── generated/        # OpenAPI generated code
                    ├── tests/
                    │   ├── unit/             # Unit tests
                    │   └── integration/      # Integration tests
                    ├── docs/
                    │   ├── getting-started.md
                    │   ├── configuration.md
                    │   ├── schema.md
                    │   ├── limits.md
                    │   └── observability.md (optional)
                    ├── schemas/
                    │   ├── index.json        # Schema registry
                    │   ├── raw/              # Raw API schemas
                    │   │   ├── files/        # OpenAPI specs, etc.
                    │   │   ├── endpoints/    # Individual endpoint schemas
                    │   │   ├── json/         # JSON event schemas
                    │   │   └── relational/   # Relational table definitions
                    │   └── extracted/        # Transformed/normalized schemas
                    │       ├── endpoints/
                    │       ├── json/
                    │       └── relational/
                    ├── scripts/              # Utility scripts
                    ├── examples/             # Usage examples
                    ├── package.json          # Dependencies
                    ├── tsconfig.json         # TypeScript config
                    ├── tsconfig.test.json    # Test TypeScript config
                    ├── jest.integration.cjs  # Integration test config
                    ├── quality-check.yaml    # Quality validation config
                    ├── install.config.toml   # Installation config
                    ├── .env.example          # Example environment variables
                    ├── .gitignore            # Git ignore rules
                    └── README.md             # Implementation README
```

---

## Scaffolding a New Connector

The fastest way to create a new connector is using the scaffold command:

### Basic Scaffold Command

```bash
npx @514labs/registry scaffold connector typescript \
  --name my-connector \
  --scaffold-version v1 \
  --author 514-labs \
  --implementation default \
  --package-name @workspace/connector-my-connector \
  --resource widgets \
  --yes
```

### Command Options

| Option | Description | Example |
|--------|-------------|---------|
| `--name` | Connector name (kebab-case) | `shopify`, `meta-ads` |
| `--scaffold-version` | Scaffold template version | `v1` |
| `--author` | GitHub org or user | `514-labs`, `yourusername` |
| `--implementation` | Implementation name | `default`, `open-api`, `advanced` |
| `--package-name` | NPM package name | `@workspace/connector-shopify` |
| `--resource` | Default resource name | `orders`, `campaigns` |
| `--yes` | Skip confirmation prompts | |

### What Gets Generated

The scaffold creates:

1. Complete directory structure
2. Minimal, testable source code
3. Resource implementation template
4. Test examples (unit + integration)
5. Documentation templates
6. Schema directories
7. Metadata files at all levels
8. Configuration files

---

## Required Metadata Files

### 1. Root `_meta/connector.json`

Location: `{connector-name}/_meta/connector.json`

```json
{
  "$schema": "https://schemas.connector-factory.dev/connector-root.schema.json",
  "identifier": "meta-ads",
  "name": "Meta Ads",
  "category": "advertising",
  "tags": ["advertising", "marketing", "facebook", "instagram", "social media"],
  "description": "Extract campaign data, ad sets, ads, and insights from Meta Ads (Facebook Ads) using the Facebook Graph API",
  "homepage": "https://developers.facebook.com/docs/graph-api/"
}
```

**Required fields:**
- `identifier`: Same as directory name (kebab-case)
- `name`: Human-readable name (Title Case)
- `category`: Primary category (lowercase)
- `tags`: Array of relevant tags (lowercase)
- `description`: One sentence description
- `homepage`: API documentation URL

**Common categories:** `advertising`, `analytics`, `crm`, `retail`, `saas`, `database`, `marketing`, `ecommerce`

### 2. Version `{version}/_meta/version.json`

Location: `{connector-name}/{version}/_meta/version.json`

```json
{
  "name": "meta-ads",
  "version": "v1",
  "status": "beta",
  "releasedAt": "2024-10-15",
  "notes": "Initial release with support for campaigns, ad sets, ads, and insights via Facebook Graph API"
}
```

**Status values:** `alpha`, `beta`, `stable`, `deprecated`

### 3. Language-Level `{language}/_meta/connector.json`

Location: `{connector-name}/{version}/{author}/{language}/_meta/connector.json`

```json
{
  "identifier": "dutchie",
  "name": "Dutchie",
  "author": "514-labs",
  "version": "v001",
  "language": "typescript",
  "implementations": ["open-api", "default"]
}
```

### 4. Implementation `{implementation}/_meta/connector.json`

Location: `{connector-name}/{version}/{author}/{language}/{implementation}/_meta/connector.json`

```json
{
  "$schema": "https://schemas.connector-factory.dev/connector.schema.json",
  "identifier": "meta-ads",
  "name": "Meta Ads",
  "author": "514-labs",
  "authorType": "organization",
  "avatarUrlOverride": "",
  "version": "v1",
  "language": "typescript",
  "implementation": "default",
  "tags": ["advertising", "marketing", "facebook", "instagram", "social media"],
  "category": "advertising",
  "description": "Extract campaign data, ad sets, ads, and insights from Meta Ads (Facebook Ads) using the Facebook Graph API",
  "homepage": "https://developers.facebook.com/docs/graph-api/",
  "license": "MIT",
  "source": {
    "type": "api",
    "spec": "https://developers.facebook.com/docs/graph-api/reference/"
  },
  "capabilities": {
    "extract": true,
    "transform": false,
    "load": false
  },
  "maintainers": [],
  "issues": "",
  "registryUrl": "https://github.com/514-labs/registry/tree/main/connector-registry/meta-ads/v1/514-labs/typescript/default"
}
```

**authorType values:** `organization`, `individual`, `community`

**source.type values:** `api`, `database`, `file`, `stream`

---

## Resource Implementation Patterns

The Registry supports two primary resource patterns. Choose based on API characteristics.

### Pattern A: Simple Resource (Dutchie-style)

**Use when:**
- API returns complete datasets in a single call
- No server-side pagination
- Simple query parameter filtering
- Small to medium datasets

**Implementation using `makeCrudResource`:**

```typescript
// src/lib/make-resource.ts
import type { SendFn, Hook } from '@connector-factory/core';

type Paging = { pageSize?: number; maxItems?: number }

type GetAllOptions<ListParams extends Record<string, unknown> | undefined = undefined> = {
  params?: ListParams
  paging?: Paging
}

export function makeCrudResource<
  Item,
  ListParams extends Record<string, unknown> | undefined = undefined
>(
  objectPath: string,
  send: SendFn,
  options?: {
    buildListQuery?: (params?: ListParams) => Record<string, string | number | boolean | undefined>
    resourceHooks?: Partial<{ beforeRequest: Hook[]; afterResponse: Hook[]; onError: Hook[]; onRetry: Hook[] }>
  }
) {
  return {
    async *getAll(
      optionsIn?: GetAllOptions<ListParams>
    ): AsyncGenerator<ReadonlyArray<Item>> {
      const params = optionsIn?.params
      const pageSize = typeof optionsIn?.paging?.pageSize === 'number' ? optionsIn?.paging?.pageSize : undefined
      const maxItems = typeof optionsIn?.paging?.maxItems === 'number' ? optionsIn?.paging?.maxItems : undefined
      const query = buildQuery(params, options?.buildListQuery)

      const req = {
        method: 'GET',
        path: objectPath,
        query,
        operation: 'getAll',
        ...(options?.resourceHooks ? { resourceHooks: options.resourceHooks } : {}),
      }

      const res = await send<Item[]>(req)
      const items: Item[] = Array.isArray(res.data) ? res.data : []

      let start = 0
      let remainingItems = typeof maxItems === 'number' ? Math.max(0, maxItems) : undefined

      if (!pageSize || pageSize <= 0) {
        yield remainingItems !== undefined ? items.slice(0, remainingItems) : items
        return
      }

      while (start < items.length) {
        const end = Math.min(items.length, start + pageSize)
        let chunk = items.slice(start, end)
        if (remainingItems !== undefined) {
          if (remainingItems <= 0) break
          if (chunk.length > remainingItems) chunk = chunk.slice(0, remainingItems)
          remainingItems -= chunk.length
        }
        yield chunk
        start = end
      }
    },
  }
}
```

**Example resource:**

```typescript
// src/resources/products.ts
import { makeCrudResource } from '../lib/make-resource'
import type { SendFn } from '../lib/paginate'
import type { ProductDetail } from '../generated/types.gen'

export const createProductsResource = (send: SendFn) => {
  return makeCrudResource<ProductDetail, { isActive?: boolean; fromLastModifiedDateUTC?: string }>(
    '/products',
    send,
    {
      buildListQuery: (params) => ({
        ...(params?.isActive !== undefined ? { isActive: params.isActive } : {}),
        ...(params?.fromLastModifiedDateUTC ? { fromLastModifiedDateUTC: params.fromLastModifiedDateUTC } : {}),
      }),
    }
  )
}
```

### Pattern B: Factory/Domain (Meta Ads-style)

**Use when:**
- API implements cursor or offset pagination
- Large datasets requiring streaming
- Complex query parameters
- Need both individual item access (get) and bulk access (getAll)
- Multiple resources share similar patterns

**Implementation using `createDomainFactory`:**

```typescript
// src/domains/factory.ts
import type { HttpResponseEnvelope } from "../types/envelopes";

export type SendFn = <T = any>(args: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, any>;
  headers?: Record<string, string>;
  body?: unknown;
  operation?: string;
}) => Promise<HttpResponseEnvelope<T>>;

export interface DomainMethods<T> {
  list(params: { adAccountId: string; fields?: string[]; limit?: number; after?: string }): Promise<HttpResponseEnvelope<T[]>>;
  get(params: { adAccountId: string; id: string; fields?: string[] }): Promise<HttpResponseEnvelope<T>>;
  stream(params: { adAccountId: string; fields?: string[]; pageSize?: number }): AsyncIterable<T>;
  getAll(params: { adAccountId: string; fields?: string[]; pageSize?: number; maxItems?: number }): Promise<T[]>;
}

export function createDomainFactory<T>(
  basePath: string,
  sendFn: SendFn
): DomainMethods<T> {
  return {
    async list(params) {
      const { adAccountId, fields, limit, after } = params;
      const query: Record<string, any> = {};

      if (fields?.length) query.fields = fields.join(",");
      if (limit) query.limit = limit.toString();
      if (after) query.after = after;

      const path = basePath.replace("{ad_account_id}", adAccountId);

      return sendFn({
        method: "GET",
        path,
        query,
      });
    },

    async get(params) {
      const { adAccountId, id, fields } = params;
      const query: Record<string, any> = {};

      if (fields?.length) query.fields = fields.join(",");

      const path = basePath.replace("{ad_account_id}", adAccountId);

      return sendFn({
        method: "GET",
        path: `${path}/${id}`,
        query,
      });
    },

    async* stream(params) {
      const { adAccountId, fields, pageSize = 25 } = params;
      let after: string | undefined;

      do {
        const response = await this.list({
          adAccountId,
          fields,
          limit: pageSize,
          after,
        });

        if (response.data && Array.isArray(response.data)) {
          for (const item of response.data) {
            yield item;
          }
        }

        after = response.paging?.cursors?.after;
      } while (after);
    },

    async getAll(params) {
      const { maxItems = 1000, ...streamParams } = params;
      const items: T[] = [];
      let count = 0;

      for await (const item of this.stream(streamParams)) {
        items.push(item);
        count++;
        if (count >= maxItems) break;
      }

      return items;
    },
  };
}
```

**Example domain:**

```typescript
// src/domains/campaigns.ts
import { createDomainFactory } from "./factory";
import type { Campaign } from "../types/connector";
import type { SendFn } from "./factory";

export function buildCampaignsDomain(sendFn: SendFn) {
  return createDomainFactory<Campaign>(
    "/act_{ad_account_id}/campaigns",
    sendFn
  );
}
```

### Pattern Comparison

| Feature | Pattern A (Simple) | Pattern B (Factory) |
|---------|-------------------|---------------------|
| API Pagination | None (full dataset) | Cursor/offset based |
| Methods | `getAll()` generator | `list()`, `get()`, `stream()`, `getAll()` |
| Chunking | Client-side only | Server-side + client-side |
| Complexity | Low | Medium |
| Best For | Small APIs, simple resources | Large APIs, paginated resources |
| Examples | Dutchie, simple REST APIs | Meta Ads, Google APIs |

---

## Implementation Checklist

Use this checklist when implementing a new connector:

### Phase 1: Scaffolding & Setup
- [ ] Run scaffold command with appropriate parameters
- [ ] Verify directory structure is correct
- [ ] Review generated files and templates
- [ ] Initialize git tracking if not already done

### Phase 2: Metadata Configuration
- [ ] Update root `_meta/connector.json` with correct details
- [ ] Update root `_meta/README.md` with overview
- [ ] Configure version `_meta/version.json`
- [ ] Update version `_meta/README.md` with full documentation
- [ ] Configure language-level `_meta/connector.json`
- [ ] Update implementation `_meta/connector.json` with complete details
- [ ] Create `_meta/CHANGELOG.md` with initial version notes
- [ ] Add `_meta/LICENSE` file (MIT standard)
- [ ] Update implementation `_meta/README.md`

### Phase 3: API Client & Authentication
- [ ] Determine authentication method (Basic, Bearer, OAuth2, API Key)
- [ ] Implement authentication strategy in `src/auth/`
- [ ] Create connector base class extending `ApiConnectorBase`
- [ ] Configure default `baseUrl`, `timeoutMs`, `userAgent`
- [ ] Set up retry configuration
- [ ] Configure rate limiting
- [ ] Test authentication with live API

### Phase 4: Resource/Domain Implementation
- [ ] Choose Pattern A (Simple) or Pattern B (Factory) based on API
- [ ] Create resource/domain implementations in `src/resources/` or `src/domains/`
- [ ] Generate types from OpenAPI spec if available (`@hey-api/openapi-ts`)
- [ ] Define custom types in `src/types/` if needed
- [ ] Implement query parameter builders
- [ ] Register all resources in connector class
- [ ] Test each resource individually

### Phase 5: Observability & Validation
- [ ] Implement logging hooks in `src/observability/logging-hooks.ts`
- [ ] Implement metrics hooks in `src/observability/metrics-hooks.ts`
- [ ] Add validation hooks if using OpenAPI schema
- [ ] Configure observability in connector initialization
- [ ] Test logging and metrics capture

### Phase 6: Schema Definitions
- [ ] Create `schemas/index.json` registry
- [ ] Add OpenAPI spec to `schemas/raw/files/` if available
- [ ] Define individual endpoint schemas in `schemas/raw/endpoints/`
- [ ] Create JSON event schemas in `schemas/raw/json/` if needed
- [ ] Define relational tables in `schemas/raw/relational/tables.json`
- [ ] Create extracted/normalized schemas in `schemas/extracted/`
- [ ] Document schemas in `docs/schema.md`

### Phase 7: Testing
- [ ] Write unit tests for each resource in `tests/unit/`
- [ ] Write integration tests in `tests/integration/`
- [ ] Test rate limiting behavior
- [ ] Test retry logic
- [ ] Test error handling
- [ ] Test pagination (Pattern B)
- [ ] Test client-side chunking (Pattern A)
- [ ] Ensure all tests pass

### Phase 8: Documentation
- [ ] Complete `docs/getting-started.md` with installation & usage
- [ ] Complete `docs/configuration.md` with all config options
- [ ] Complete `docs/limits.md` with rate limit details
- [ ] Complete `docs/schema.md` with schema documentation
- [ ] Add `docs/observability.md` if relevant
- [ ] Create usage examples in `examples/`
- [ ] Update top-level `README.md`

### Phase 9: Quality & Configuration
- [ ] Create `quality-check.yaml` with resource samples
- [ ] Configure `install.config.toml`
- [ ] Create `.env.example` with all required variables
- [ ] Update `.gitignore` to exclude secrets
- [ ] Ensure no secrets are committed

### Phase 10: Verification & Testing
- [ ] Run all unit tests: `pnpm test`
- [ ] Run integration tests: `pnpm test:integration`
- [ ] Test installation via install script
- [ ] Verify types are exported correctly
- [ ] Test with a real API key/credentials
- [ ] Check that all resources work end-to-end
- [ ] Validate quality-check samples

---

## File Templates

### Root README Template

```markdown
# {Connector Name}

This directory contains the {Connector Name} connector implementations.

## Overview

{Brief description of what this connector does and which API it connects to}

## Versions

- [v1](./v1/_meta/README.md) - {Brief description of v1}

## Resources

The connector provides access to:

- **Resource 1** - Description
- **Resource 2** - Description
- **Resource 3** - Description

## Quick Start

```bash
bash -i <(curl https://registry.514.ai/install.sh) \
  --dest app/connectors/{connector-name} \
  {connector-name} v1 514-labs typescript default
```

See version-specific documentation for detailed usage instructions.
```

### Version README Template

```markdown
# {Connector Name} v{N}

{One sentence description of this connector and what it does}

## Features

- Feature 1 - description
- Feature 2 - description
- Feature 3 - description
- Built-in rate limiting and retry logic
- Comprehensive error handling
- TypeScript type safety

## Prerequisites

- Node.js >= 20
- API credentials from {Service Name}
- pnpm or npm

## Installation

### 1. Navigate to your project

```bash
cd /path/to/your/project
```

### 2. Run the installer

```bash
bash -i <(curl https://registry.514.ai/install.sh) \
  --dest app/connectors/{connector-name} \
  {connector-name} v{N} 514-labs typescript default
```

### 3. Set environment variables

```bash
export {CONNECTOR}_API_KEY=your_api_key_here
export {CONNECTOR}_API_SECRET=your_api_secret_here
```

Or create a `.env` file:

```env
{CONNECTOR}_API_KEY=your_api_key
{CONNECTOR}_API_SECRET=your_api_secret
```

### 4. Install dependencies

```bash
pnpm install
```

## Usage

### Basic Example

```typescript
import { create{Connector}Connector } from "@workspace/connector-{connector-name}";

async function main() {
  const connector = create{Connector}Connector();

  connector.initialize({
    auth: {
      type: "bearer",
      bearer: { token: process.env.{CONNECTOR}_API_KEY! }
    }
  });

  // Fetch all items
  for await (const page of connector.resources.getAll({
    paging: { pageSize: 50 }
  })) {
    console.log('Page:', page);
  }
}

main().catch(console.error);
```

### With Moose Projects

```typescript
import { create{Connector}Connector } from '../connectors/{connector-name}'
import { Task, Workflow } from "@514labs/moose-lib";

export const syncTask = new Task<null, void>("sync-{connector}", {
  run: async () => {
    const connector = create{Connector}Connector();
    connector.initialize({
      auth: {
        type: "bearer",
        bearer: { token: process.env.{CONNECTOR}_API_KEY! }
      }
    });

    for await (const page of connector.resources.getAll()) {
      // Process and insert data
      await YourPipeline.table!.insert(page);
    }
  },
  retries: 3,
  timeout: "5m",
});

export const syncWorkflow = new Workflow("sync-{connector}-workflow", {
  startingTask: syncTask,
  retries: 1,
  timeout: "10m",
});
```

## Configuration

See [configuration.md](./docs/configuration.md) for all available configuration options.

### Key Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | string | `https://api.service.com` | API base URL |
| `timeoutMs` | number | 30000 | Request timeout |
| `retry.maxAttempts` | number | 3 | Max retry attempts |
| `rateLimit.requestsPerSecond` | number | 10 | Rate limit |

## Available Resources

- `resources` - Access to resource data
- `entities` - Access to entity data
- `items` - Access to item data

See the [getting started guide](./docs/getting-started.md) for detailed usage.

## Rate Limits

This connector implements:
- Token bucket rate limiting
- Exponential backoff with jitter
- Retry-After header support
- Configurable concurrency limits

See [limits.md](./docs/limits.md) for details.

## Troubleshooting

### Authentication Errors

**Problem:** `AUTH_FAILED` error

**Solution:** Verify your API credentials are correct and not expired.

### Rate Limit Errors

**Problem:** `429 Too Many Requests`

**Solution:** Adjust `rateLimit.requestsPerSecond` in configuration.

### Timeout Errors

**Problem:** Requests timing out

**Solution:** Increase `timeoutMs` or reduce `paging.pageSize`.

## Support

- [Connector Factory Documentation](https://docs.connector-factory.dev)
- [GitHub Issues](https://github.com/514-labs/registry/issues)
- [Community Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)

## License

MIT License - see [LICENSE](./LICENSE) file
```

### CHANGELOG Template

```markdown
# Changelog

All notable changes to the {Connector Name} connector will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v1] - YYYY-MM-DD

### Added
- Initial release
- Support for {Resource 1}
- Support for {Resource 2}
- Support for {Resource 3}
- Rate limiting with token bucket algorithm
- Exponential backoff retry logic
- Comprehensive error handling
- TypeScript type definitions
- Unit and integration tests

### Features
- Pattern A/B resource implementation
- Client-side/server-side pagination
- Configurable batch sizes
- Observable logging and metrics hooks
- OpenAPI schema validation

### Authentication
- {Auth Type} authentication support
- Secure credential handling
- Automatic token refresh (if applicable)

### Documentation
- Getting started guide
- Configuration reference
- Schema documentation
- Rate limit guidance
- Usage examples
```

### LICENSE Template (MIT)

```
MIT License

Copyright (c) {YEAR} {AUTHOR}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

### quality-check.yaml Template

```yaml
# Quality check configuration for {Connector Name}
connector: {connector-name}
version: v{N}
implementation: typescript/default

# Resources to sample for quality analysis
resources:
  - name: resource1
    operation: resources.getAll
    sampleSize: 20
    params:
      paging:
        pageSize: 50

  - name: resource2
    operation: entities.getAll
    sampleSize: 10
    params:
      paging:
        pageSize: 25
```

### .env.example Template

```env
# {Connector Name} Configuration
# Copy to .env and fill in your actual values

# Authentication
{CONNECTOR}_API_KEY=your_api_key_here
{CONNECTOR}_API_SECRET=your_api_secret_here

# Optional: Override base URL
# {CONNECTOR}_BASE_URL=https://api.service.com

# Optional: Adjust rate limits
# {CONNECTOR}_RATE_LIMIT=10

# Optional: Enable debug logging
# {CONNECTOR}_LOG_LEVEL=debug
```

---

## Naming Conventions

### Directory Names

| Type | Convention | Examples |
|------|-----------|----------|
| Connector root | `kebab-case` | `meta-ads`, `google-analytics`, `sap-hana-cdc` |
| Version | Descriptive | `v1`, `v001`, `v4`, `ga4`, `2024-10-01` |
| Author | `kebab-case` GitHub handle | `514-labs`, `johndoe` |
| Language | `lowercase` | `typescript`, `python` |
| Implementation | `lowercase` or `kebab-case` | `default`, `open-api`, `advanced` |

### File Names

| Type | Convention | Examples |
|------|-----------|----------|
| Metadata | `lowercase.json` | `connector.json`, `version.json` |
| Documentation | `UPPERCASE.md` or `lowercase-with-dashes.md` | `README.md`, `CHANGELOG.md`, `getting-started.md` |
| TypeScript source | `kebab-case.ts` | `client.ts`, `make-resource.ts` |
| TypeScript types | `kebab-case.ts` | `connector.ts`, `errors.ts` |
| Config files | `lowercase.file` | `.env.example`, `.gitignore`, `tsconfig.json` |

### Code Identifiers

| Type | Convention | Examples |
|------|-----------|----------|
| Connector identifier | `kebab-case` (metadata) | `meta-ads`, `dutchie` |
| Package name | `@workspace/connector-{name}` | `@workspace/connector-meta-ads` |
| Class names | `PascalCase` | `MetaAdsApiConnector`, `DutchieConnector` |
| Function names | `camelCase` | `createMetaAdsConnector()`, `buildCampaignsDomain()` |
| Interface names | `PascalCase` | `DomainMethods`, `ConnectorConfig` |
| Type names | `PascalCase` | `SendFn`, `HttpResponseEnvelope` |
| Resource properties | `camelCase` | `connector.campaigns`, `connector.adSets` |
| Environment variables | `UPPER_SNAKE_CASE` | `META_ADS_API_KEY`, `DUTCHIE_API_KEY` |
| Tags | `lowercase` | `advertising`, `social media` |

---

## Common Patterns

### 1. Connector Base Class

All connectors extend `ApiConnectorBase` from `@connector-factory/core`:

```typescript
// src/client.ts
import { ApiConnectorBase } from "@connector-factory/core";
import type { ConnectorConfig } from "./types/config";

export class MyApiConnector extends ApiConnectorBase {
  initialize(userConfig: ConnectorConfig) {
    // Apply defaults
    const withDefaults = (u: ConnectorConfig): ConnectorConfig => ({
      baseUrl: u.baseUrl ?? 'https://api.service.com',
      timeoutMs: u.timeoutMs ?? 30000,
      userAgent: u.userAgent ?? 'connector-my-service',
      ...u,
    });

    super.initialize(withDefaults(userConfig) as any, (cfg: any) => cfg);

    // Add hooks for validation, logging, metrics
    this.setupHooks(userConfig);
  }

  private setupHooks(userConfig: ConnectorConfig) {
    // Validation hooks
    if (userConfig.validation?.enabled) {
      const hooks = createValidationHooks(userConfig.validation);
      this.addHooks(hooks);
    }

    // Logging hooks
    if (userConfig.logging?.enabled) {
      const hooks = createLoggingHooks(userConfig.logging);
      this.addHooks(hooks);
    }
  }

  private get sendLite() {
    return async (args: any) => (this as any).request(args);
  }

  // Resources
  get campaigns() { return createCampaignsResource(this.sendLite) }
  get users() { return createUsersResource(this.sendLite) }
}

export function createMyConnector(): MyApiConnector {
  return new MyApiConnector();
}
```

### 2. Authentication Patterns

#### Basic Auth

```typescript
connector.initialize({
  auth: {
    type: "basic",
    basic: {
      username: process.env.API_KEY!,
      password: process.env.API_SECRET
    }
  }
});
```

#### Bearer Token

```typescript
connector.initialize({
  auth: {
    type: "bearer",
    bearer: {
      token: process.env.API_TOKEN!
    }
  }
});
```

#### OAuth2

```typescript
connector.initialize({
  auth: {
    type: "oauth2",
    oauth2: {
      clientId: process.env.CLIENT_ID!,
      clientSecret: process.env.CLIENT_SECRET!,
      refreshToken: process.env.REFRESH_TOKEN!,
      accessToken: process.env.ACCESS_TOKEN,
      expiresAt: Date.now() + 3600000,
      tokenUrl: "https://api.service.com/oauth/token"
    }
  }
});
```

### 3. Rate Limiting Configuration

```typescript
connector.initialize({
  auth: { /* ... */ },
  rateLimit: {
    requestsPerSecond: 10,        // Max requests per second
    concurrentRequests: 5,        // Max concurrent requests
    burstCapacity: 20,            // Burst capacity
    adaptiveFromHeaders: true,    // Adapt from Retry-After headers
  }
});
```

### 4. Retry Configuration

```typescript
connector.initialize({
  auth: { /* ... */ },
  retry: {
    maxAttempts: 3,
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 2,
    retryableStatusCodes: [408, 425, 429, 500, 502, 503, 504],
    retryBudgetMs: 60000,
    respectRetryAfter: true,
  }
});
```

### 5. Logging Pattern

```typescript
// src/observability/logging-hooks.ts
import type { Hook } from '@connector-factory/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LoggingOptions {
  level?: LogLevel;
  includeQueryParams?: boolean;
  includeHeaders?: boolean;
  includeBody?: boolean;
  logger?: (level: string, event: Record<string, unknown>) => void;
}

export function createLogFunction(options: LoggingOptions) {
  const logger = options.logger || ((level, event) => {
    console.log(JSON.stringify({ level, ...event }));
  });

  return (level: string, event: Record<string, unknown>) => {
    logger(level, event);
  };
}

export function createLoggingHooks(options: LoggingOptions): {
  beforeRequest: Hook[];
  afterResponse: Hook[];
  onError: Hook[];
  onRetry: Hook[];
} {
  const logFn = createLogFunction(options);

  return {
    beforeRequest: [
      async (ctx) => {
        logFn('info', {
          event: 'request',
          method: ctx.method,
          path: ctx.path,
          ...(options.includeQueryParams ? { query: ctx.query } : {}),
          ...(options.includeHeaders ? { headers: ctx.headers } : {}),
        });
      }
    ],
    afterResponse: [
      async (ctx) => {
        logFn('info', {
          event: 'response',
          status: ctx.status,
          duration: ctx.duration,
        });
      }
    ],
    onError: [
      async (ctx) => {
        logFn('error', {
          event: 'error',
          error: ctx.error.message,
          code: ctx.error.code,
        });
      }
    ],
    onRetry: [
      async (ctx) => {
        logFn('warn', {
          event: 'retry',
          attempt: ctx.attempt,
          delay: ctx.delay,
        });
      }
    ],
  };
}
```

### 6. Error Handling Pattern

```typescript
// src/types/errors.ts
export type ErrorCode =
  | "AUTH_FAILED"
  | "RATE_LIMIT_EXCEEDED"
  | "INVALID_REQUEST"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "UNKNOWN";

export class ConnectorError extends Error {
  code: ErrorCode;
  status?: number;
  retryable: boolean;
  source: "network" | "auth" | "api" | "client";
  details?: Record<string, any>;

  constructor(params: {
    message: string;
    code: ErrorCode;
    status?: number;
    retryable: boolean;
    source: "network" | "auth" | "api" | "client";
    details?: Record<string, any>;
  }) {
    super(params.message);
    this.name = "ConnectorError";
    this.code = params.code;
    this.status = params.status;
    this.retryable = params.retryable;
    this.source = params.source;
    this.details = params.details;
  }
}
```

### 7. Type Generation from OpenAPI

Add to `package.json`:

```json
{
  "scripts": {
    "generate:types": "openapi-ts -i ./schemas/files/api-spec.json -o ./src/generated"
  },
  "devDependencies": {
    "@hey-api/openapi-ts": "0.84.0"
  }
}
```

Generate types:

```bash
pnpm run generate:types
```

Use generated types:

```typescript
import type { ProductDetail } from './generated/types.gen';
import { client } from './generated/client.gen';
```

---

## Schema Definitions

### Schema Directory Structure

```
schemas/
├── index.json                    # Master registry
├── raw/                          # Raw API schemas
│   ├── files/                    # OpenAPI, Swagger, etc.
│   │   └── openapi.json
│   ├── endpoints/                # Individual endpoint schemas
│   │   ├── campaigns.schema.json
│   │   └── ads.schema.json
│   ├── json/                     # JSON event schemas
│   │   ├── events.schema.json
│   │   └── README.md
│   └── relational/               # Raw table definitions
│       ├── tables.json
│       ├── tables.sql
│       └── README.md
└── extracted/                    # Transformed schemas
    ├── endpoints/
    │   ├── campaigns.schema.json
    │   └── ads.schema.json
    ├── json/
    │   ├── events.schema.json
    │   └── events.md
    └── relational/
        ├── tables.json
        ├── tables.sql
        └── README.md
```

### schemas/index.json Template

```json
{
  "entities": [
    {
      "name": "campaigns",
      "raw": {
        "json": "raw/endpoints/campaigns.schema.json",
        "relational": "raw/relational/tables.json"
      },
      "extracted": {
        "json": "extracted/endpoints/campaigns.schema.json",
        "relational": "extracted/relational/tables.json"
      }
    },
    {
      "name": "ads",
      "raw": {
        "json": "raw/endpoints/ads.schema.json",
        "relational": "raw/relational/tables.json"
      },
      "extracted": {
        "json": "extracted/endpoints/ads.schema.json",
        "relational": "extracted/relational/tables.json"
      }
    }
  ]
}
```

### Endpoint Schema Template

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Campaign",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "Unique campaign identifier"
    },
    "name": {
      "type": "string",
      "description": "Campaign name"
    },
    "status": {
      "type": "string",
      "enum": ["ACTIVE", "PAUSED", "ARCHIVED"],
      "description": "Campaign status"
    },
    "budget": {
      "type": "number",
      "description": "Campaign budget in cents"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "Creation timestamp"
    }
  },
  "required": ["id", "name", "status"]
}
```

### Relational Schema Template (tables.json)

```json
{
  "tables": [
    {
      "name": "campaigns",
      "description": "Marketing campaigns",
      "columns": [
        {
          "name": "id",
          "type": "STRING",
          "nullable": false,
          "description": "Unique campaign identifier"
        },
        {
          "name": "name",
          "type": "STRING",
          "nullable": false,
          "description": "Campaign name"
        },
        {
          "name": "status",
          "type": "STRING",
          "nullable": false,
          "description": "Campaign status"
        },
        {
          "name": "budget",
          "type": "INT64",
          "nullable": true,
          "description": "Campaign budget in cents"
        },
        {
          "name": "created_at",
          "type": "TIMESTAMP",
          "nullable": false,
          "description": "Creation timestamp"
        }
      ],
      "primaryKey": ["id"]
    }
  ]
}
```

---

## Testing Guidelines

### Unit Tests

Create unit tests in `tests/unit/` for:

1. **Resource methods** - Test each resource method
2. **Pagination logic** - Test client-side chunking
3. **Query builders** - Test parameter transformation
4. **Rate limiting** - Test limiter behavior
5. **Validation** - Test schema validation
6. **Error handling** - Test error scenarios

Example unit test:

```typescript
// tests/unit/campaigns.test.ts
import { createCampaignsResource } from '../../src/resources/campaigns';
import { SendFn } from '../../src/lib/types';

describe('Campaigns Resource', () => {
  it('should fetch all campaigns with pagination', async () => {
    const mockSend: SendFn = async () => ({
      data: [
        { id: '1', name: 'Campaign 1' },
        { id: '2', name: 'Campaign 2' },
      ],
      meta: {},
    });

    const campaigns = createCampaignsResource(mockSend);
    const pages: any[] = [];

    for await (const page of campaigns.getAll({ paging: { pageSize: 1 } })) {
      pages.push(page);
    }

    expect(pages).toHaveLength(2);
    expect(pages[0][0].id).toBe('1');
  });

  it('should handle empty response', async () => {
    const mockSend: SendFn = async () => ({ data: [], meta: {} });
    const campaigns = createCampaignsResource(mockSend);
    const pages: any[] = [];

    for await (const page of campaigns.getAll()) {
      pages.push(page);
    }

    expect(pages).toHaveLength(1);
    expect(pages[0]).toEqual([]);
  });
});
```

### Integration Tests

Create integration tests in `tests/integration/` for:

1. **End-to-end flows** - Test actual API calls
2. **Authentication** - Test auth mechanisms
3. **Rate limiting** - Test rate limit handling
4. **Error scenarios** - Test 429, 500, timeout, etc.

Example integration test:

```typescript
// tests/integration/campaigns.test.ts
import { createMyConnector } from '../../src';

describe('Campaigns Integration', () => {
  let connector: ReturnType<typeof createMyConnector>;

  beforeAll(() => {
    connector = createMyConnector();
    connector.initialize({
      auth: {
        type: 'bearer',
        bearer: { token: process.env.API_TOKEN! }
      }
    });
  });

  it('should fetch campaigns from live API', async () => {
    const pages: any[] = [];

    for await (const page of connector.campaigns.getAll({
      paging: { pageSize: 10, maxItems: 20 }
    })) {
      pages.push(page);
    }

    expect(pages.length).toBeGreaterThan(0);
    expect(pages[0].length).toBeGreaterThan(0);
    expect(pages[0][0]).toHaveProperty('id');
  }, 30000); // 30s timeout for API call
});
```

### Test Configuration

```javascript
// jest.integration.cjs
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/integration/**/*.test.ts'],
  moduleFileExtensions: ['ts', 'js'],
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: ['/node_modules/', '/generated/'],
  testTimeout: 30000,
};
```

### Running Tests

```bash
# Unit tests
pnpm test

# Integration tests (requires API credentials)
pnpm test:integration

# With coverage
pnpm test --coverage
```

---

## Best Practices

### 1. Security

- **Never commit secrets** - Use `.env` files and `.gitignore`
- **Provide `.env.example`** - Document all required variables
- **Secure credential handling** - Use environment variables
- **Token refresh** - Implement automatic refresh for OAuth2
- **Validate inputs** - Sanitize user inputs before API calls

### 2. Error Handling

- **Use typed errors** - Extend base `ConnectorError` class
- **Classify errors** - Distinguish auth, network, API, client errors
- **Mark retryability** - Indicate if error is retryable
- **Provide context** - Include request details in errors
- **Log errors properly** - Use structured logging

### 3. Rate Limiting

- **Respect API limits** - Configure appropriate rate limits
- **Use token bucket** - Leverage built-in rate limiter
- **Honor Retry-After** - Respect server rate limit signals
- **Adaptive limiting** - Enable `adaptiveFromHeaders`
- **Burst capacity** - Configure appropriate burst values

### 4. Performance

- **Stream large datasets** - Use generators for Pattern A
- **Server-side pagination** - Use Pattern B for paginated APIs
- **Concurrent requests** - Configure appropriate concurrency
- **Batch processing** - Use appropriate page sizes
- **Connection pooling** - Reuse HTTP connections

### 5. Type Safety

- **Generate types from OpenAPI** - Use `@hey-api/openapi-ts`
- **Export all types** - Make types available to consumers
- **Strict TypeScript** - Enable strict mode
- **Type all parameters** - No `any` types in public APIs
- **Document types** - Add JSDoc comments

### 6. Observability

- **Enable logging** - Provide structured logging
- **Add metrics** - Track requests, errors, retries
- **Include correlation IDs** - Track requests end-to-end
- **Performance tracking** - Measure request durations
- **Error tracking** - Log all errors with context

### 7. Documentation

- **Complete getting-started** - Provide working examples
- **Document all config** - Explain every option
- **Schema documentation** - Document data structures
- **Troubleshooting guide** - Address common issues
- **API reference** - Document all public methods

### 8. Testing

- **Unit test coverage** - Test all logic paths
- **Integration tests** - Test against live API
- **Mock appropriately** - Use nock or similar
- **Test edge cases** - Empty responses, errors, timeouts
- **CI/CD integration** - Run tests automatically

### 9. Versioning

- **Semantic versioning** - Follow semver principles
- **Maintain CHANGELOG** - Document all changes
- **Deprecation warnings** - Warn before breaking changes
- **Version documentation** - Keep docs version-specific
- **Migration guides** - Help users upgrade

### 10. Code Organization

- **Separation of concerns** - Keep files focused
- **Consistent patterns** - Follow established patterns
- **Reusable utilities** - Extract common logic
- **Clear naming** - Use descriptive names
- **Minimal dependencies** - Only depend on what's needed

---

## Example: Complete Connector Implementation

Here's a complete walkthrough of implementing a hypothetical "Shopify" connector:

### Step 1: Scaffold

```bash
npx @514labs/registry scaffold connector typescript \
  --name shopify \
  --scaffold-version v1 \
  --author 514-labs \
  --implementation default \
  --package-name @workspace/connector-shopify \
  --resource orders \
  --yes
```

### Step 2: Update Metadata

```json
// shopify/_meta/connector.json
{
  "$schema": "https://schemas.connector-factory.dev/connector-root.schema.json",
  "identifier": "shopify",
  "name": "Shopify",
  "category": "ecommerce",
  "tags": ["ecommerce", "retail", "pos", "sales"],
  "description": "Extract orders, products, customers, and inventory from Shopify stores",
  "homepage": "https://shopify.dev/docs/api"
}
```

### Step 3: Implement Authentication

```typescript
// src/client.ts
import { ApiConnectorBase } from "@connector-factory/core";
import type { ConnectorConfig } from "./types/config";

export class ShopifyApiConnector extends ApiConnectorBase {
  initialize(userConfig: ConnectorConfig) {
    const withDefaults = (u: ConnectorConfig): ConnectorConfig => ({
      baseUrl: u.baseUrl ?? `https://${u.shopDomain}.myshopify.com/admin/api/2024-01`,
      timeoutMs: u.timeoutMs ?? 30000,
      userAgent: u.userAgent ?? 'connector-shopify',
      ...u,
    });

    super.initialize(withDefaults(userConfig) as any, (cfg: any) => cfg);
  }

  private get sendLite() {
    return async (args: any) => this.send(args);
  }

  get orders() { return createOrdersResource(this.sendLite) }
  get products() { return createProductsResource(this.sendLite) }
  get customers() { return createCustomersResource(this.sendLite) }
}

export function createShopifyConnector() {
  return new ShopifyApiConnector();
}
```

### Step 4: Implement Resources (Pattern B for pagination)

```typescript
// src/domains/factory.ts
export function createShopifyDomainFactory<T>(
  endpoint: string,
  sendFn: SendFn
) {
  return {
    async list(params: { limit?: number; since_id?: string }) {
      return sendFn({
        method: "GET",
        path: endpoint,
        query: params,
      });
    },

    async* stream(params: { pageSize?: number } = {}) {
      const { pageSize = 50 } = params;
      let sinceId: string | undefined;

      do {
        const response = await this.list({
          limit: pageSize,
          since_id: sinceId,
        });

        if (response.data && Array.isArray(response.data)) {
          for (const item of response.data) {
            yield item;
          }

          if (response.data.length < pageSize) break;
          sinceId = response.data[response.data.length - 1].id;
        } else {
          break;
        }
      } while (sinceId);
    },

    async getAll(params: { pageSize?: number; maxItems?: number } = {}) {
      const { maxItems = 1000, ...streamParams } = params;
      const items: T[] = [];
      let count = 0;

      for await (const item of this.stream(streamParams)) {
        items.push(item);
        count++;
        if (count >= maxItems) break;
      }

      return items;
    },
  };
}
```

### Step 5: Create Resource Implementations

```typescript
// src/domains/orders.ts
import { createShopifyDomainFactory } from "./factory";
import type { SendFn } from "./factory";
import type { Order } from "../types/connector";

export function buildOrdersDomain(sendFn: SendFn) {
  return createShopifyDomainFactory<Order>("/orders.json", sendFn);
}
```

### Step 6: Define Types

```typescript
// src/types/connector.ts
export interface Order {
  id: string;
  order_number: number;
  created_at: string;
  total_price: string;
  customer: Customer;
  line_items: LineItem[];
}

export interface Customer {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LineItem {
  id: string;
  product_id: string;
  quantity: number;
  price: string;
}
```

### Step 7: Add Tests

```typescript
// tests/unit/orders.test.ts
import { buildOrdersDomain } from '../../src/domains/orders';

describe('Orders Domain', () => {
  it('should stream all orders with pagination', async () => {
    const mockSend = jest.fn()
      .mockResolvedValueOnce({
        data: [{ id: '1', order_number: 1001 }]
      })
      .mockResolvedValueOnce({
        data: []
      });

    const orders = buildOrdersDomain(mockSend);
    const items = [];

    for await (const item of orders.stream({ pageSize: 1 })) {
      items.push(item);
    }

    expect(items).toHaveLength(1);
    expect(mockSend).toHaveBeenCalledTimes(2);
  });
});
```

### Step 8: Create Documentation

```markdown
// docs/getting-started.md
# Getting Started with Shopify Connector

## Installation

```bash
bash -i <(curl https://registry.514.ai/install.sh) \
  --dest app/connectors/shopify \
  shopify v1 514-labs typescript default
```

## Configuration

```typescript
import { createShopifyConnector } from "@workspace/connector-shopify";

const shopify = createShopifyConnector();

shopify.initialize({
  shopDomain: process.env.SHOPIFY_SHOP_DOMAIN!,
  auth: {
    type: "bearer",
    bearer: { token: process.env.SHOPIFY_ACCESS_TOKEN! }
  }
});
```

## Usage

```typescript
// Fetch all orders
for await (const order of shopify.orders.stream({ pageSize: 50 })) {
  console.log(order);
}

// Get specific number of orders
const orders = await shopify.orders.getAll({ maxItems: 100 });
```
```

### Step 9: Define Schemas

```json
// schemas/index.json
{
  "entities": [
    {
      "name": "orders",
      "raw": {
        "json": "raw/endpoints/orders.schema.json",
        "relational": "raw/relational/tables.json"
      },
      "extracted": {
        "json": "extracted/endpoints/orders.schema.json",
        "relational": "extracted/relational/tables.json"
      }
    }
  ]
}
```

### Step 10: Create Quality Check Config

```yaml
# quality-check.yaml
connector: shopify
version: v1
implementation: typescript/default

resources:
  - name: orders
    operation: orders.stream
    sampleSize: 20
    params:
      pageSize: 50
```

---

## Support

For questions or issues with connector implementation:

- [Connector Factory Documentation](https://docs.connector-factory.dev)
- [Registry Specifications](../apps/registry-docs/content/docs/specifications/)
- [Community Slack](https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg)
- [GitHub Issues](https://github.com/514-labs/registry/issues)

---

## Appendix: Quick Reference

### Scaffold Command

```bash
npx @514labs/registry scaffold connector typescript \
  --name <connector-name> \
  --scaffold-version v1 \
  --author <github-org> \
  --implementation <impl-name> \
  --package-name @workspace/connector-<name> \
  --resource <resource-name> \
  --yes
```

### Pattern Selection

- **Pattern A (Simple)**: Full dataset, no pagination, client-side chunking
- **Pattern B (Factory)**: Cursor/offset pagination, large datasets, streaming

### Key Files Checklist

- [ ] `_meta/connector.json` (all levels)
- [ ] `_meta/README.md` (all levels)
- [ ] `_meta/version.json`
- [ ] `_meta/CHANGELOG.md`
- [ ] `_meta/LICENSE`
- [ ] `src/client.ts`
- [ ] `src/index.ts`
- [ ] `docs/getting-started.md`
- [ ] `docs/configuration.md`
- [ ] `docs/schema.md`
- [ ] `docs/limits.md`
- [ ] `schemas/index.json`
- [ ] `quality-check.yaml`
- [ ] `.env.example`
- [ ] `README.md`

### Test Commands

```bash
pnpm test                  # Unit tests
pnpm test:integration      # Integration tests
pnpm test --coverage       # With coverage
```

### Installation Test

```bash
bash -i <(curl https://registry.514.ai/install.sh) \
  --dest app/connectors/test \
  <connector> <version> <author> <language> <implementation>
```
