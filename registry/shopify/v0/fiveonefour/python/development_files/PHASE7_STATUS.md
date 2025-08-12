# Phase 7 Status — GraphQL Migration

- Date: 2025-08-11
- Owner: TBD

## Objective
Migrate the connector to use Shopify's GraphQL Admin API as the primary and only transport while maintaining full API Connector Specification compliance. No REST fallback in this release.

## Scope (updated)
- Implement `GraphQLTransport` with query execution, basic error mapping, and cost/throttle header capture
- Integrate GraphQL cursor-based pagination (default page size: 100)
- Make GraphQL the default (and only) transport path in `ShopifyConnector`
- Remove REST transport and REST Link header pagination
- Update docs to reflect GraphQL-only and required environment placeholders
- Prepare config (`RetryConfig.jitterFactor`) and rate limiter alignment
- Initial GraphQL resources to focus: Inventory and Orders

## Deliverables
- [x] `src/shopify_connector/transport/graphql.py`
- [x] GraphQL cursor pagination integrated with `paginate()` (default page size 100)
- [x] Connector routing switched to GraphQL-only
- [x] REST transport and REST pagination removed
- [x] Docs updated: Getting Started + README (GraphQL-only, env placeholders)
- [x] Config: `RetryConfig.jitterFactor` added; rate limiter uses config fields
- [~] Error mapping: throttling mapped to `RATE_LIMIT`; other GraphQL errors surfaced as `ServerError` (can be expanded)
- [~] Rate-limit/cost surfaced via headers; mapping into `meta.rateLimit` (requested/actual cost, throttleStatus) pending
- [ ] Live tests against dev store (no mocks) for Inventory and Orders
- [ ] OAuth support (near-term requirement)

## Tasks
- [x] Implement `GraphQLTransport`
- [x] Add cursor-based pagination helpers
- [x] Update connector to instantiate GraphQL (GraphQL-only)
- [x] Remove REST code paths and REST pagination
- [~] Map GraphQL errors to standardized error codes (initial handling in place)
- [~] Parse GraphQL cost/throttle into `meta.rateLimit` (headers captured; meta mapping next)
- [x] Update documentation
- [ ] Add and run live tests for GraphQL flows (Inventory, Orders)
- [ ] Add OAuth authentication flow

## Risks
- API cost model throttling — add adaptive backoff using GraphQL cost/throttle headers
- Schema drift — pin API version (2024-07) and validate queries
- Pagination edge cases — expand test coverage on large datasets

## Status
- In progress
  - GraphQL-only transport wired and working; paginator set to cursor-based
  - REST removed
  - Docs and config updated (placeholders for `SHOPIFY_SHOP`, `SHOPIFY_API_VERSION=2024-07`, `SHOPIFY_ACCESS_TOKEN`)
- Next
  - Implement `meta.rateLimit` mapping for GraphQL cost/throttle
  - Build inventory and orders queries out further and validate live
  - Add OAuth flow
