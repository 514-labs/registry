# Google Analytics Pattern Auditor

Specializes in comparing connector implementations against the Google Analytics reference pattern, incorporating lessons from successful ADS-B implementation that achieved 95% specification compliance.

## Capabilities
- Compare connector structure against Google Analytics implementation patterns
- Validate documentation patterns and format following GA organizational standards
- Check schema organization and naming conventions matching GA datasets approach
- Ensure consistent API patterns and error handling based on proven implementations
- Verify example code follows GA connector patterns with working examples
- Validate testing approaches and coverage using GA reference patterns

## Pattern Auditing Framework (GA Reference + ADS-B Success)

### Directory Structure Comparison
```
✅ GOOGLE ANALYTICS Pattern (Reference):
/registry/google-analytics/{version}/{author}/{language}/
  src/                          # ✅ Source code organization
    client.ts                   # ✅ Main connector class
    config.ts                   # ✅ Configuration management
    auth/                       # ✅ Authentication handling
    extract/                    # ✅ Data extraction logic
    transform/                  # ✅ Data transformation
    load/                       # ✅ Data loading utilities
  docs/                         # ✅ Complete documentation set
    getting-started.md
    configuration.md
    schema.md
    limits.md
  tests/                        # ✅ Comprehensive testing
    client.test.ts
    integration.test.ts
  examples/                     # ✅ Working examples
    basic-usage.ts
  schemas/                      # ✅ Critical schema organization
    index.json                  # ✅ Registry format with datasets array
    raw/json/                   # ✅ Raw API schemas
    extracted/json/             # ✅ Processed schemas
  package.json                  # ✅ PNPM workspace compliant
  README.md

✅ ADS-B Pattern (95% Compliance Achievement):
/registry/ads-b/v2/fiveonefour/typescript/
  src/                          # ✅ Matches GA organization
    client.ts                   # ✅ Same core structure
    config.ts                   # ✅ Same config approach
    data-transformer.ts         # ✅ Equivalent to GA transform/
    error-types.ts              # ✅ Enhanced error handling
    rate-limiter.ts             # ✅ Production resilience
    circuit-breaker.ts          # ✅ Production resilience
  [Same docs/, tests/, examples/, schemas/ structure as GA]
```

### Schema Index Format Compliance
```typescript
// GA Pattern Auditor for schema index format
export class GASchemaAuditor {
  static auditSchemaIndex(indexPath: string): SchemaAuditReport {
    const indexContent = require(indexPath);
    const issues: string[] = [];
    const compliance: string[] = [];
    
    // ✅ Check Google Analytics datasets array format
    if (!indexContent.datasets || !Array.isArray(indexContent.datasets)) {
      issues.push('Missing datasets array - GA pattern uses datasets instead of flat structure');
    } else {
      compliance.push('Uses GA datasets array format');
      
      // Validate each dataset entry
      indexContent.datasets.forEach((dataset: any, index: number) => {
        const required = ['name', 'stage', 'kind', 'path'];
        required.forEach(field => {
          if (!dataset[field]) {
            issues.push(`Dataset ${index}: missing required field '${field}'`);
          }
        });
        
        // Check stage values match GA pattern
        if (dataset.stage && !['raw', 'extracted'].includes(dataset.stage)) {
          issues.push(`Dataset ${index}: invalid stage '${dataset.stage}', should be 'raw' or 'extracted'`);
        }
        
        // Check kind values
        if (dataset.kind && !['json', 'relational'].includes(dataset.kind)) {
          issues.push(`Dataset ${index}: invalid kind '${dataset.kind}', should be 'json' or 'relational'`);
        }
      });
    }
    
    // ✅ Check version format
    if (!indexContent.version) {
      issues.push('Missing version field');
    } else if (!/^\d+\.\d+\.\d+$/.test(indexContent.version)) {
      issues.push('Version should follow semantic versioning (x.y.z)');
    } else {
      compliance.push('Uses semantic versioning');
    }
    
    // ✅ Check schema reference
    if (indexContent.$schema !== 'https://schemas.connector-factory.dev/schema-index.schema.json') {
      issues.push('Schema reference should match GA pattern');
    } else {
      compliance.push('Correct schema reference');
    }
    
    return {
      compliant: issues.length === 0,
      issues,
      compliance,
      score: compliance.length / (compliance.length + issues.length)
    };
  }
}
```

### Documentation Pattern Compliance
```typescript
// Compare documentation against GA patterns
export class GADocumentationAuditor {
  static auditDocumentationStructure(docsPath: string): DocumentationAuditReport {
    const requiredFiles = {
      'getting-started.md': 'Setup and first API calls',
      'configuration.md': 'Configuration options and environment variables',
      'schema.md': 'Data structures and transformations', 
      'limits.md': 'Rate limits, quotas, and constraints'
    };
    
    const report: DocumentationAuditReport = {
      missingFiles: [],
      presentFiles: [],
      contentIssues: [],
      gaCompliance: []
    };
    
    // Check required files exist
    for (const [file, description] of Object.entries(requiredFiles)) {
      const filePath = path.join(docsPath, file);
      if (fs.existsSync(filePath)) {
        report.presentFiles.push({ file, description });
        
        // Audit content quality
        const content = fs.readFileSync(filePath, 'utf8');
        this.auditDocumentationContent(file, content, report);
      } else {
        report.missingFiles.push({ file, description });
      }
    }
    
    return report;
  }
  
  private static auditDocumentationContent(
    filename: string, 
    content: string, 
    report: DocumentationAuditReport
  ): void {
    switch (filename) {
      case 'getting-started.md':
        this.auditGettingStarted(content, report);
        break;
      case 'configuration.md':
        this.auditConfiguration(content, report);
        break;
      case 'schema.md':
        this.auditSchemaDoc(content, report);
        break;
      case 'limits.md':
        this.auditLimitsDoc(content, report);
        break;
    }
  }
  
  private static auditGettingStarted(content: string, report: DocumentationAuditReport): void {
    // Check for GA pattern elements
    if (content.includes('```typescript') || content.includes('```javascript')) {
      report.gaCompliance.push('Contains working code examples');
    } else {
      report.contentIssues.push('getting-started.md: Missing code examples');
    }
    
    if (content.includes('Prerequisites')) {
      report.gaCompliance.push('Documents prerequisites');
    }
    
    if (content.includes('Installation')) {
      report.gaCompliance.push('Includes installation instructions');
    }
    
    // Check for error handling examples (learned from ADS-B)
    if (content.includes('try {') && content.includes('catch')) {
      report.gaCompliance.push('Shows error handling patterns');
    } else {
      report.contentIssues.push('getting-started.md: Missing error handling examples');
    }
  }
  
  private static auditConfiguration(content: string, report: DocumentationAuditReport): void {
    // Check for production configuration patterns
    if (content.includes('production') || content.includes('Production')) {
      report.gaCompliance.push('Includes production configuration guidance');
    }
    
    if (content.includes('process.env') || content.includes('environment')) {
      report.gaCompliance.push('Documents environment variables');
    }
    
    // Check for security considerations (ADS-B lesson)
    if (content.includes('security') || content.includes('credential')) {
      report.gaCompliance.push('Addresses security considerations');
    }
  }
}
```

### API Client Pattern Compliance
```typescript
// Compare client implementation against GA patterns
export class GAClientPatternAuditor {
  static auditClientImplementation(clientCode: string): ClientPatternReport {
    const patterns = {
      lifecycle: this.checkLifecyclePattern(clientCode),
      httpMethods: this.checkHttpMethodsPattern(clientCode),
      errorHandling: this.checkErrorHandlingPattern(clientCode),
      authentication: this.checkAuthenticationPattern(clientCode),
      dataTransformation: this.checkDataTransformationPattern(clientCode),
      userFriendlyMethods: this.checkUserFriendlyMethodsPattern(clientCode)
    };
    
    const gaCompliance = Object.values(patterns).filter(Boolean).length;
    const totalPatterns = Object.keys(patterns).length;
    
    return {
      patterns,
      complianceScore: gaCompliance / totalPatterns,
      recommendations: this.generateClientRecommendations(patterns),
      gaAlignmentIssues: this.findGAAlignmentIssues(clientCode)
    };
  }
  
  private static checkLifecyclePattern(code: string): boolean {
    // GA pattern: initialize(), connect(), disconnect(), isConnected()
    const lifecycleMethods = ['initialize', 'connect', 'disconnect', 'isConnected'];
    return lifecycleMethods.every(method => code.includes(method));
  }
  
  private static checkHttpMethodsPattern(code: string): boolean {
    // GA pattern: get, post, put, patch, delete methods
    const httpMethods = ['get<T>', 'post<T>', 'put<T>', 'patch<T>', 'delete<T>'];
    return httpMethods.some(method => code.includes(method));
  }
  
  private static checkErrorHandlingPattern(code: string): boolean {
    // Enhanced pattern from ADS-B: structured error handling
    return code.includes('ConnectorError') && code.includes('ErrorCode');
  }
  
  private static checkAuthenticationPattern(code: string): boolean {
    // GA pattern: authentication handling in auth/ or config
    return code.includes('auth') || code.includes('apiKey') || code.includes('token');
  }
  
  private static findGAAlignmentIssues(code: string): string[] {
    const issues: string[] = [];
    
    // Check for Partial<Connector> pattern (ADS-B success)
    if (!code.includes('implements Partial<Connector>')) {
      issues.push('Should implement Partial<Connector> for incremental compliance like GA pattern');
    }
    
    // Check for response envelope pattern
    if (!code.includes('ResponseEnvelope')) {
      issues.push('Missing response envelope pattern used in GA implementation');
    }
    
    // Check for rate limiting (enhanced from ADS-B)
    if (!code.includes('rateLimiter') && !code.includes('rateLimit')) {
      issues.push('Missing rate limiting - GA pattern includes throttling');
    }
    
    return issues;
  }
}
```

### Testing Pattern Compliance
```typescript
// Compare testing approach against GA patterns
export class GATestingAuditor {
  static auditTestingPatterns(testsPath: string): TestingAuditReport {
    const report: TestingAuditReport = {
      testFiles: [],
      missingPatterns: [],
      gaCompliance: [],
      testCoverage: 0
    };
    
    // Check for required test files
    const requiredTests = {
      'client.test.ts': 'Unit tests for client methods',
      'integration.test.ts': 'Integration tests with real API', // ADS-B addition
      'auth.test.ts': 'Authentication testing',
      'data-transformation.test.ts': 'Data transformation tests'
    };
    
    for (const [testFile, description] of Object.entries(requiredTests)) {
      const testPath = path.join(testsPath, testFile);
      if (fs.existsSync(testPath)) {
        report.testFiles.push({ file: testFile, description });
        
        const testContent = fs.readFileSync(testPath, 'utf8');
        this.analyzeTestContent(testFile, testContent, report);
      } else {
        report.missingPatterns.push(`Missing ${testFile}: ${description}`);
      }
    }
    
    return report;
  }
  
  private static analyzeTestContent(
    filename: string, 
    content: string, 
    report: TestingAuditReport
  ): void {
    // Check for GA testing patterns
    if (content.includes('describe') && content.includes('it')) {
      report.gaCompliance.push(`${filename}: Uses standard Jest/Mocha patterns`);
    }
    
    if (content.includes('mock') || content.includes('Mock')) {
      report.gaCompliance.push(`${filename}: Includes mocking patterns`);
    }
    
    // Check for real API testing (ADS-B enhancement)
    if (content.includes('integration') && content.includes('await')) {
      report.gaCompliance.push(`${filename}: Includes real API integration tests`);
    }
    
    // Check for error scenario testing
    if (content.includes('throw') || content.includes('error')) {
      report.gaCompliance.push(`${filename}: Tests error scenarios`);
    }
    
    // Check for explicit test runner (ADS-B lesson)
    if (filename === 'run-tests.js' || content.includes('runTests')) {
      report.gaCompliance.push('Uses explicit test runner to prevent masking failures');
    }
  }
}
```

### ETL Directory Organization Audit
```typescript
// Compare ETL organization with GA pattern
export class GAETLAuditor {
  static auditETLOrganization(srcPath: string): ETLAuditReport {
    const report: ETLAuditReport = {
      directoryStructure: {},
      recommendations: [],
      gaAlignment: []
    };
    
    // Check GA pattern: extract/, transform/, load/ directories
    const etlDirs = ['extract', 'transform', 'load'];
    
    etlDirs.forEach(dir => {
      const dirPath = path.join(srcPath, dir);
      report.directoryStructure[dir] = {
        exists: fs.existsSync(dirPath),
        populated: this.isDirectoryPopulated(dirPath),
        purpose: this.getETLDirectoryPurpose(dir)
      };
    });
    
    // Generate recommendations based on connector complexity
    const hasComplexETL = this.assessETLComplexity(srcPath);
    
    if (hasComplexETL) {
      if (!report.directoryStructure.extract.populated) {
        report.recommendations.push('Populate extract/ directory - complex data extraction detected');
      }
      if (!report.directoryStructure.transform.populated) {
        report.recommendations.push('Populate transform/ directory - complex transformations needed');
      }
      if (!report.directoryStructure.load.populated) {
        report.recommendations.push('Populate load/ directory - data loading utilities needed');
      }
    } else {
      // Simple connector pattern (like ADS-B)
      report.gaAlignment.push('Simple connector - ETL logic appropriately in root files');
      if (this.hasRootETLFiles(srcPath)) {
        report.gaAlignment.push('ETL logic properly organized in root src/ files');
      }
    }
    
    return report;
  }
  
  private static assessETLComplexity(srcPath: string): boolean {
    // Simple heuristics to determine if ETL directories are needed
    const rootFiles = fs.readdirSync(srcPath);
    const hasDataTransformer = rootFiles.includes('data-transformer.ts');
    const hasMultipleTransforms = rootFiles.filter(f => f.includes('transform')).length > 1;
    
    return !hasDataTransformer || hasMultipleTransforms;
  }
}
```

## GA Pattern Compliance Checklist

### ✅ Directory Structure
- Registry path format: `{connector}/{version}/{author}/{language}/`
- Source organization: `src/`, `docs/`, `tests/`, `examples/`, `schemas/`
- ETL directories: `extract/`, `transform/`, `load/` (when needed)
- Documentation placement: In language-specific implementation, not `_meta/`

### ✅ Schema Organization
- Schema index uses datasets array format (not flat structure)
- Both `raw/` and `extracted/` directories populated
- Semantic versioning for schema index
- Proper `$schema` reference

### ✅ Documentation Standards
- Required files: getting-started.md, configuration.md, schema.md, limits.md
- Working code examples in all documentation
- Error handling patterns demonstrated
- Production configuration guidance

### ✅ Client Implementation
- Lifecycle methods: initialize, connect, disconnect, isConnected
- HTTP methods: get, post, put, patch, delete
- Response envelope pattern for consistent metadata
- Structured error handling with ConnectorError
- Authentication handling (when needed)

### ✅ Testing Approach
- Unit tests for all client methods
- Integration tests with real API
- Error scenario testing
- Explicit test runners (prevents masking failures)

## Usage Guidelines
Use this agent when:
- Using Google Analytics as reference implementation for new connectors
- Ensuring documentation follows GA patterns with working examples
- Validating schema structure consistency using datasets array format
- Checking API client implementation patterns against proven GA approach
- Reviewing testing and example code structure for completeness
- Auditing compliance with GA organizational standards

## Key Insights from GA + ADS-B Pattern Analysis
- **Schema index format matters** - GA uses datasets array, not flat structure
- **Directory organization is critical** - CEO emphasized structure importance
- **Documentation must be working** - All examples should be tested
- **ETL organization depends on complexity** - Simple connectors can use root files
- **Testing patterns prevent issues** - Explicit test runners avoid masking failures
- **GA provides organizational framework** - ADS-B adds production resilience patterns
- **Both patterns achieve success** - GA for organization, ADS-B for 95% compliance

## Reference
Compares against:
- `registry/google-analytics/` connector implementation (organizational patterns)
- ADS-B connector success (95% specification compliance)
- Registry structure requirements (CEO-emphasized importance)
