# Connector Implementation Guide

This guide walks you through implementing your `apex` connector from scaffold to production.

**📖 For detailed step-by-step instructions, see:**
`connector-registry/_scaffold/CONNECTOR_IMPLEMENTATION_GUIDE.md`

Or view online: [Connector Implementation Guide](../../../../../../_scaffold/CONNECTOR_IMPLEMENTATION_GUIDE.md)

## Quick Checklist

### Phase 1: Understand Your API ✓
- [ ] Read the `apex` API documentation
- [ ] Identify authentication method
- [ ] Understand pagination pattern
- [ ] Note rate limits
- [ ] Identify key endpoints

### Phase 2: Scaffold ✓
- [x] Connector scaffolded

### Phase 3: Configure Authentication
- [ ] Update `ConnectorConfig` type in `src/client/connector.ts`
- [ ] Implement `init()` method to set up auth
- [ ] Update `.env.example` with required credentials

### Phase 4: Implement Pagination
- [ ] Choose pagination pattern (offset/cursor/page)
- [ ] Implement in `src/lib/paginate.ts`
- [ ] Test with API to verify it works

### Phase 5: Implement Resources
- [ ] Define resource types in `src/resources/batches.ts`
- [ ] Implement list/get/create methods as needed
- [ ] Add resource getters to connector class

### Phase 6: Add Schemas
- [ ] Create JSON schemas in `schemas/raw/json/`
- [ ] Add documentation `.md` files
- [ ] Register in `schemas/index.json`

### Phase 7: Update Documentation
- [ ] Update `README.md` with examples
- [ ] Document config in `docs/configuration.md`
- [ ] Update `.env.example`

### Phase 8: Write Tests
- [ ] Update `tests/resource.test.ts`
- [ ] Add observability tests if using logging/metrics
- [ ] Test pagination edge cases

### Phase 9: Build & Test
- [ ] Run `pnpm run build` - should complete without errors
- [ ] Run `pnpm test` - all tests should pass
- [ ] Try `examples/basic-usage.ts` with real API

### Phase 10: Real-World Testing
- [ ] Test with real credentials
- [ ] Verify pagination with large datasets
- [ ] Test error handling
- [ ] Test rate limiting (if applicable)

## Common Patterns

See the detailed guide for code examples of:
- Simple API key authentication
- Bearer token authentication
- OAuth2 authentication
- Offset-based pagination
- Cursor-based pagination
- Page number pagination

## Reference Connectors

Look at these for examples:
- **Socrata** (`connector-registry/socrata/`): Simple API with offset pagination
- **Meta Ads** (`connector-registry/meta-ads/`): OAuth2 with cursor pagination
- **Google Analytics** (`connector-registry/google-analytics/`): Service account auth

## Need Help?

Refer to the full implementation guide at:
`connector-registry/_scaffold/CONNECTOR_IMPLEMENTATION_GUIDE.md`
