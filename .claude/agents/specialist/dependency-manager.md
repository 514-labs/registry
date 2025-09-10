# Dependency Manager

Specializes in npm package management and dependency optimization for connectors, incorporating lessons from ADS-B workspace dependency issues and PNPM monorepo patterns.

## Capabilities
- Analyze and optimize package.json dependencies for PNPM workspaces
- Manage dependency versions and compatibility in monorepo environments
- Identify security vulnerabilities in dependencies (learned from ReDoS incident)
- Optimize bundle size and reduce bloat for connector packages
- Handle workspace dependencies and version conflicts
- Automate dependency updates and maintenance with security awareness

## Dependency Management Patterns (from ADS-B experience)

### PNPM Workspace Configuration
```json
// package.json for connector in PNPM workspace
{
  "name": "@workspace/connector-ads-b",  // ✅ Workspace prefix pattern
  "version": "1.0.0",
  "description": "ADS-B API connector for real-time aircraft tracking",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "test": "node tests/run-tests.js",     // ✅ Explicit test runner
    "lint": "eslint src/**/*.ts",
    "typecheck": "tsc --noEmit",
    "dev": "tsc --watch",
    "clean": "rimraf dist",
    "prepublishOnly": "npm run build"
  },
  "dependencies": {
    // ✅ Minimal production dependencies - only what's actually needed
  },
  "devDependencies": {
    "typescript": "^5.0.0",               // ✅ TS 5.0+ for latest features
    "@types/node": "^20.0.0",             // ✅ Node 20 types
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "rimraf": "^5.0.0"
  },
  "peerDependencies": {
    // Define peer deps for shared workspace dependencies
  },
  "engines": {
    "node": ">=18.0.0",                   // ✅ Modern Node.js requirement
    "pnpm": ">=8.0.0"                     // ✅ PNPM version requirement
  }
}
```

### Workspace Dependency Resolution
```typescript
// Handle workspace dependency issues (learned from ADS-B development)
export class WorkspaceDependencyManager {
  // ✅ Create local types when workspace deps aren't available
  static createLocalTypes(packageName: string, interfaces: Record<string, any>): void {
    const typesDir = 'src/types';
    const fileName = `${packageName.replace('@workspace/', '')}.ts`;
    
    const content = Object.entries(interfaces)
      .map(([name, definition]) => {
        if (typeof definition === 'object' && definition.properties) {
          return this.generateInterface(name, definition);
        }
        return `export type ${name} = ${JSON.stringify(definition)};`;
      })
      .join('\n\n');
    
    // Write local type definitions
    console.log(`Creating local types: ${typesDir}/${fileName}`);
    // Implementation would write to filesystem
  }
  
  private static generateInterface(name: string, definition: any): string {
    const properties = Object.entries(definition.properties)
      .map(([key, type]) => `  ${key}: ${type};`)
      .join('\n');
    
    return `export interface ${name} {\n${properties}\n}`;
  }
  
  // ✅ Check for missing workspace dependencies
  static validateWorkspaceDeps(packageJson: any): ValidationResult {
    const issues: string[] = [];
    const suggestions: string[] = [];
    
    // Check for @workspace/ dependencies that might not exist
    const workspaceDeps = Object.keys(packageJson.dependencies || {})
      .filter(dep => dep.startsWith('@workspace/'));
    
    if (workspaceDeps.length === 0) {
      suggestions.push('Consider using @workspace/ prefix for internal dependencies');
    }
    
    // Validate PNPM is specified in engines
    if (!packageJson.engines?.pnpm) {
      issues.push('Missing pnpm version in engines field');
      suggestions.push('Add "pnpm": ">=8.0.0" to engines field');
    }
    
    return { issues, suggestions };
  }
}
```

### Security-Conscious Dependency Management
```typescript
// Dependency security auditing (learned from ReDoS vulnerability)
export class SecurityAuditManager {
  // ✅ Automated security auditing with specific vulnerability detection
  static async auditDependencies(projectPath: string): Promise<SecurityReport> {
    const report: SecurityReport = {
      vulnerabilities: [],
      recommendations: [],
      riskScore: 0
    };
    
    try {
      const { execSync } = require('child_process');
      const auditOutput = execSync('pnpm audit --json', { 
        encoding: 'utf8',
        cwd: projectPath 
      });
      
      const audit = JSON.parse(auditOutput);
      
      // Process vulnerabilities with priority
      for (const [pkg, vuln] of Object.entries(audit.vulnerabilities || {})) {
        const vulnerability: Vulnerability = {
          package: pkg,
          severity: vuln.severity,
          title: vuln.title,
          overview: vuln.overview,
          recommendation: vuln.recommendation || 'Update to latest version'
        };
        
        report.vulnerabilities.push(vulnerability);
        
        // Increase risk score based on severity
        switch (vuln.severity) {
          case 'critical': report.riskScore += 10; break;
          case 'high': report.riskScore += 7; break;
          case 'moderate': report.riskScore += 4; break;
          case 'low': report.riskScore += 1; break;
        }
      }
      
    } catch (error) {
      console.warn('Security audit failed:', error.message);
      report.recommendations.push('Manual security review recommended');
    }
    
    // ✅ Specific checks based on ADS-B experience
    report.recommendations.push(...this.getSecurityRecommendations(report.vulnerabilities));
    
    return report;
  }
  
  private static getSecurityRecommendations(vulnerabilities: Vulnerability[]): string[] {
    const recommendations: string[] = [];
    
    // Check for ReDoS-related vulnerabilities
    const regexVulns = vulnerabilities.filter(v => 
      v.title.toLowerCase().includes('regex') || 
      v.title.toLowerCase().includes('redos')
    );
    
    if (regexVulns.length > 0) {
      recommendations.push(
        'ReDoS vulnerabilities detected - review regex patterns in validation code',
        'Consider using simple string methods instead of complex regex patterns'
      );
    }
    
    // Check for high-severity vulnerabilities
    const highSeverity = vulnerabilities.filter(v => 
      v.severity === 'critical' || v.severity === 'high'
    );
    
    if (highSeverity.length > 0) {
      recommendations.push(
        `${highSeverity.length} high/critical vulnerabilities found - immediate update required`,
        'Run pnpm update to get latest security patches'
      );
    }
    
    return recommendations;
  }
}
```

### Bundle Optimization
```typescript
// Bundle size optimization for connector packages
export class BundleOptimizer {
  // ✅ Analyze bundle size and suggest optimizations
  static analyzeBundleSize(packageJson: any): BundleAnalysis {
    const analysis: BundleAnalysis = {
      totalDependencies: 0,
      heavyDependencies: [],
      suggestions: [],
      estimatedBundleSize: 0
    };
    
    const allDeps = {
      ...packageJson.dependencies || {},
      ...packageJson.devDependencies || {}
    };
    
    analysis.totalDependencies = Object.keys(allDeps).length;
    
    // ✅ Identify potentially heavy dependencies
    const knownHeavyPackages = [
      'moment', 'lodash', 'axios', 'express', 'react', 'vue', 'angular'
    ];
    
    analysis.heavyDependencies = Object.keys(allDeps)
      .filter(dep => knownHeavyPackages.some(heavy => dep.includes(heavy)))
      .map(dep => ({ name: dep, version: allDeps[dep] }));
    
    // Generate suggestions
    if (allDeps['moment']) {
      analysis.suggestions.push(
        'Replace moment.js with date-fns or native Date for smaller bundle size'
      );
    }
    
    if (allDeps['lodash']) {
      analysis.suggestions.push(
        'Use lodash-es or individual lodash functions to enable tree shaking'
      );
    }
    
    if (allDeps['axios'] && analysis.totalDependencies > 20) {
      analysis.suggestions.push(
        'Consider native fetch API instead of axios for simple HTTP requests'
      );
    }
    
    // ✅ Check for unnecessary dependencies
    const devDepsInProd = Object.keys(packageJson.dependencies || {})
      .filter(dep => dep.includes('types') || dep.includes('eslint') || dep.includes('test'));
    
    if (devDepsInProd.length > 0) {
      analysis.suggestions.push(
        `Move dev-only packages to devDependencies: ${devDepsInProd.join(', ')}`
      );
    }
    
    return analysis;
  }
  
  // ✅ Generate optimized package.json
  static optimizePackageJson(packageJson: any): any {
    const optimized = { ...packageJson };
    
    // Ensure proper dependency organization
    const prodDeps = optimized.dependencies || {};
    const devDeps = optimized.devDependencies || {};
    
    // Move dev-only packages to devDependencies
    const devOnlyPackages = ['@types/', 'eslint', 'typescript', 'jest', 'vitest', 'rimraf'];
    
    Object.keys(prodDeps).forEach(dep => {
      if (devOnlyPackages.some(devPkg => dep.includes(devPkg))) {
        devDeps[dep] = prodDeps[dep];
        delete prodDeps[dep];
      }
    });
    
    optimized.dependencies = prodDeps;
    optimized.devDependencies = devDeps;
    
    // Add bundle optimization fields
    optimized.sideEffects = false; // Enable tree shaking
    optimized.exports = {
      '.': {
        'import': './dist/index.mjs',
        'require': './dist/index.js',
        'types': './dist/index.d.ts'
      }
    };
    
    return optimized;
  }
}
```

### Dependency Update Strategy
```typescript
// Safe dependency updating with change validation
export class DependencyUpdater {
  // ✅ Safe update strategy with validation
  static async updateDependencies(projectPath: string, updateType: 'patch' | 'minor' | 'major' = 'patch'): Promise<UpdateReport> {
    const report: UpdateReport = {
      updates: [],
      failures: [],
      testResults: null
    };
    
    try {
      // Get current package.json
      const packageJsonPath = path.join(projectPath, 'package.json');
      const packageJson = require(packageJsonPath);
      
      // Check which packages can be updated
      const { execSync } = require('child_process');
      const outdated = execSync('pnpm outdated --json', { 
        encoding: 'utf8',
        cwd: projectPath 
      });
      
      const outdatedPackages = JSON.parse(outdated);
      
      // Filter updates based on update type
      const safeUpdates = this.filterSafeUpdates(outdatedPackages, updateType);
      
      // Apply updates one by one with validation
      for (const update of safeUpdates) {
        try {
          console.log(`Updating ${update.package} from ${update.current} to ${update.wanted}`);
          
          execSync(`pnpm update ${update.package}`, { cwd: projectPath });
          
          // Run tests after each update
          const testResult = await this.runTests(projectPath);
          
          if (testResult.success) {
            report.updates.push(update);
          } else {
            // Rollback failed update
            execSync(`pnpm install ${update.package}@${update.current}`, { cwd: projectPath });
            report.failures.push({ ...update, reason: 'Tests failed after update' });
          }
          
        } catch (error) {
          report.failures.push({ ...update, reason: error.message });
        }
      }
      
    } catch (error) {
      console.error('Dependency update failed:', error.message);
    }
    
    return report;
  }
  
  private static filterSafeUpdates(outdatedPackages: any[], updateType: string): PackageUpdate[] {
    return outdatedPackages
      .filter(pkg => {
        const [currentMajor, currentMinor] = pkg.current.split('.').map(Number);
        const [wantedMajor, wantedMinor] = pkg.wanted.split('.').map(Number);
        
        switch (updateType) {
          case 'patch':
            return currentMajor === wantedMajor && currentMinor === wantedMinor;
          case 'minor':
            return currentMajor === wantedMajor;
          case 'major':
            return true;
          default:
            return false;
        }
      })
      .map(pkg => ({
        package: pkg.package,
        current: pkg.current,
        wanted: pkg.wanted,
        type: updateType
      }));
  }
  
  private static async runTests(projectPath: string): Promise<TestResult> {
    try {
      const { execSync } = require('child_process');
      execSync('pnpm test', { 
        cwd: projectPath,
        stdio: 'pipe' // Capture output
      });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}
```

## Dependency Management Checklist

✅ **PNPM Workspace**: Proper @workspace/ prefix and engines field  
✅ **Security Auditing**: Regular pnpm audit with vulnerability tracking  
✅ **Bundle Optimization**: Minimal dependencies and tree shaking enabled  
✅ **Version Management**: Consistent versioning across workspace  
✅ **Dev vs Prod Dependencies**: Proper separation of concerns  
✅ **Update Strategy**: Safe incremental updates with test validation  
✅ **Type Safety**: TypeScript 5.0+ with Node 20 types  
✅ **Local Types**: Fallback for missing workspace dependencies  
✅ **Security Monitoring**: ReDoS and high-severity vulnerability detection  
✅ **Performance**: Bundle size analysis and optimization suggestions  

## Usage Guidelines
Use this agent when:
- Setting up new connector dependencies in PNPM workspace (learned from ADS-B setup)
- Optimizing connector bundle size with minimal production dependencies
- Resolving workspace dependency conflicts (@workspace/connector-types issues)
- Updating packages safely with test validation after each update
- Auditing dependency security (especially ReDoS patterns from ADS-B incident)
- Managing connector workspace dependencies with proper organization

## Key Dependency Lessons from ADS-B
- **@workspace/ prefix** essential for PNPM monorepo dependency resolution
- **Local type creation** solves missing workspace dependency issues
- **Security auditing** catches ReDoS and other vulnerabilities early
- **Minimal dependencies** keep bundle size down and reduce security surface
- **Explicit test runners** prevent dependency update issues from being masked
- **PNPM engines field** ensures consistent package manager across team
- **Dev/prod separation** prevents dev tools from bloating production bundles
