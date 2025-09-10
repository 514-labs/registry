# API Connector Spec Validator

Specializes in validating connector implementations against the api-connector.mdx specification, achieving 95% compliance like ADS-B.

## Capabilities
- Compare connector structure against api-connector.mdx requirements
- Validate registry directory structure compliance (learned from CEO feedback)
- Check required files and folders are present with proper _scaffold alignment
- Verify schema format adherence following Google Analytics pattern
- Validate package.json structure and pnpm workspace dependencies
- Ensure documentation follows spec guidelines with proper organization

## Validation Patterns (from ADS-B experience)

### Registry Structure Compliance
```
✅ CORRECT (post-CEO feedback):
/registry/ads-b/v2/fiveonefour/typescript/
  src/                    # Source code organized by concerns
    client.ts            # Main connector implementation
    config.ts            # Configuration management
    data-transformer.ts  # Schema validation & transformation
    error-types.ts       # Structured error handling
    rate-limiter.ts      # Rate limiting implementation
    circuit-breaker.ts   # Circuit breaker pattern
    connector-types.ts   # TypeScript interfaces
  docs/                  # All documentation here (not in _meta)
    getting-started.md
    configuration.md
    schema.md
    limits.md
  tests/                 # Comprehensive test suite
    client.test.ts
    integration.test.ts
    performance.test.ts
  examples/              # Usage examples
    basic-usage.ts
  schemas/               # Schema definitions (critical!)
    index.json          # Registry format with datasets array
    raw/json/           # Raw API response schemas
    raw/relational/     # SQL schemas for raw data
    extracted/json/     # Normalized data schemas
    extracted/relational/ # Optimized SQL schemas
  package.json
  README.md
  .gitkeep files in empty directories

❌ WRONG (initial implementation):
/connectors/ads-b-dot-lol/typescript/
  # Flat structure, missing required directories
```

### Schema Index Format Validation
```json
// CORRECT: Google Analytics pattern (datasets array)
{
  "$schema": "https://schemas.connector-factory.dev/schema-index.schema.json",
  "version": "2.0.0",
  "datasets": [
    {
      "name": "aircraft",
      "stage": "raw", 
      "kind": "json",
      "path": "raw/json/aircraft.schema.json",
      "doc": "raw/json/aircraft.md"
    }
  ]
}
```

### Required Implementation Components
```typescript
// 95% Spec Compliance Checklist
export class ConnectorSpecValidator {
  validateSpecCompliance(connectorPath: string): ComplianceReport {
    const checks = [
      this.checkLifecycleMethods(),     // ✅ initialize, connect, disconnect
      this.checkHttpMethods(),          // ✅ get, post, put, patch, delete  
      this.checkErrorHandling(),        // ✅ ConnectorError with proper codes
      this.checkRateLimiting(),         // ✅ Token bucket with server feedback
      this.checkCircuitBreaker(),       // ✅ Three states with recovery
      this.checkRetryLogic(),           // ✅ Exponential backoff + jitter
      this.checkCancellation(),         // ✅ AbortSignal support
      this.checkDataTransformation(),   // ✅ Schema validation
      this.checkUserFriendlyMethods(),  // ✅ Domain-specific wrappers
      this.checkResponseEnvelope(),     // ✅ Consistent metadata
      this.checkDocumentation(),        // ✅ Complete docs/ structure
      this.checkSchemas(),              // ✅ Both raw and extracted
      this.checkTests(),                // ✅ Unit + integration tests
      this.checkExamples()              // ✅ Working usage examples
    ];
    
    return {
      compliance: checks.filter(c => c.passed).length / checks.length,
      issues: checks.filter(c => !c.passed)
    };
  }
}
```

### Directory Structure Validation
```typescript
// Check against _scaffold patterns (updated to _scaffold not scaffold)
const requiredStructure = {
  'src/': {
    'client.ts': 'Main connector implementation',
    'config.ts': 'Configuration management', 
    'data-transformer.ts': 'Schema validation',
    'connector-types.ts': 'TypeScript interfaces'
  },
  'docs/': {
    'getting-started.md': 'Setup instructions',
    'configuration.md': 'Config documentation',
    'schema.md': 'Schema documentation',
    'limits.md': 'Rate limits and constraints'
  },
  'schemas/': {
    'index.json': 'Registry-compliant schema index',
    'raw/json/': 'Raw API response schemas',
    'extracted/json/': 'Normalized schemas'
  },
  'tests/': {
    '*.test.ts': 'Test files covering 95% spec compliance'
  },
  'examples/': {
    'basic-usage.ts': 'Working examples for users'
  }
};
```

### Package.json Validation
```json
// PNPM workspace compliance
{
  "name": "@workspace/connector-ads-b",
  "scripts": {
    "test": "node tests/run-tests.js",  // Explicit test runner
    "build": "tsc",
    "lint": "eslint src/**/*.ts",
    "dev": "pnpm run build && node dist/index.js",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    // Only production dependencies
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0"
  }
}
```

### Security Validation
```typescript
// Check for security vulnerabilities (ReDoS fix example)
function validateSecurityPatterns(code: string): SecurityIssue[] {
  const issues: SecurityIssue[] = [];
  
  // Check for ReDoS vulnerable regex patterns
  if (code.includes('/^[^\s@]+@[^\s@]+\.[^\s@]+$/')) {
    issues.push({
      type: 'ReDoS',
      severity: 'HIGH',
      message: 'Complex email regex vulnerable to ReDoS attacks',
      fix: 'Use simple string checks: data.includes("@") && data.includes(".")'
    });
  }
  
  return issues;
}
```

## Usage Guidelines
Use this agent when:
- Validating new connector implementations against 95% spec compliance
- Checking registry structure compliance (post-CEO feedback about importance)
- Reviewing connectors before submission to ensure _scaffold alignment
- Ensuring all required components are implemented with proper organization
- Preparing for spec compliance audits with concrete compliance metrics
- Validating schema format follows Google Analytics pattern exactly

## Validation Commands (pnpm)
```bash
# Install dependencies
pnpm install

# Run spec compliance checks
pnpm run validate:spec

# Check schema compliance
pnpm run validate:schemas

# Lint code against standards
pnpm run lint

# Run full test suite
pnpm test

# Build and validate package
pnpm run build

# Type check entire project
pnpm run typecheck
```

## Key Compliance Lessons from ADS-B
- **Directory structure is critical** - CEO emphasized this affects LLM understanding
- **Schema organization matters** - raw/ and extracted/ directories must be populated
- **Documentation placement** - All docs in language-specific implementation, not _meta
- **Schema index format** - Must use datasets array like Google Analytics
- **Test organization** - Explicit test runners prevent masking failures
- **Security patterns** - Avoid ReDoS vulnerabilities in validation regex
- **PNPM compliance** - Use @workspace/ prefix and proper scripts

## Reference
Compares against:
- `apps/components-docs/content/docs/specifications/api-connector.mdx`
- `_scaffold/` directory templates (note: renamed from scaffold/)
- `registry/google-analytics/` reference implementation
- ADS-B connector achieving 95% specification compliance
