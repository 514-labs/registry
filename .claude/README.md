# 🚀 Claude Code Connector Factory Workflow Guide

*Production-ready connector development using enriched agents with real-world patterns from ADS-B connector achieving 95% specification compliance.*

This guide describes how to use the custom `.claude` configuration to build production-ready API connectors efficiently using battle-tested patterns.

## 📋 Table of Contents
- [Overview](#overview)
- [🤖 Agent Directory](#-agent-directory)
- [Complete Connector Development Workflow](#complete-connector-development-workflow)
- [Agent Reference](#agent-reference)
- [Command Reference](#command-reference)
- [Automated Hooks](#automated-hooks)
- [Example Workflows](#example-workflows)
- [Success Metrics](#success-metrics)

## Overview

The `.claude` directory contains specialized agents, commands, and hooks designed specifically for building connectors in the connector factory. These tools have been **enriched with real-world patterns** from the ADS-B connector implementation that achieved 95% specification compliance, incorporating lessons from security vulnerabilities, performance optimizations, and production debugging.

## 🤖 Agent Directory

**📋 [Complete Agent Directory](AGENTS.md)** - Comprehensive guide to all 15 enriched agents with real examples and usage patterns.

### 🎯 Quick Agent Reference

**Core Development:** [`api-schema-analyzer`](agents/api-schema-analyzer.md) • [`connector-client-builder`](agents/connector-client-builder.md) • [`data-transformation-expert`](agents/data-transformation-expert.md) • [`typescript-expert`](agents/typescript-expert.md)

**Quality Assurance:** [`connector-testing-specialist`](agents/connector-testing-specialist.md) • [`api-connector-spec-validator`](agents/api-connector-spec-validator.md) • [`scaffold-pattern-matcher`](agents/scaffold-pattern-matcher.md) • [`connector-debugger`](agents/connector-debugger.md)

**Security & Reliability:** [`security-auditor`](agents/security-auditor.md) • [`api-reliability-engineer`](agents/api-reliability-engineer.md) • [`performance-optimizer`](agents/performance-optimizer.md) • [`dependency-manager`](agents/dependency-manager.md)

**Architecture & Documentation:** [`conversation-insights-extractor`](agents/conversation-insights-extractor.md) • [`connector-architecture-reviewer`](agents/connector-architecture-reviewer.md) • [`registry-documentation-generator`](agents/registry-documentation-generator.md) • [`google-analytics-pattern-auditor`](agents/google-analytics-pattern-auditor.md)

## Complete Connector Development Workflow

### 🎯 Phase 1: API Discovery & Analysis

1. **Analyze the API** **(Enriched with ADS-B patterns)**
   ```
   Use the api-schema-analyzer agent to analyze the API response from [API_URL] and generate initial schemas
   ```
   - Examines API responses with real-world extraction patterns
   - Generates JSON schemas following registry standards
   - Creates both raw and extracted schema variants for ETL pipelines
   - Identifies data structures with proper indexing strategies
   - **Real Example**: *Generated complete aircraft tracking schemas from ADS-B.lol API*

2. **Validate Against Specification** **(95% Compliance Patterns)**
   ```
   Use the api-connector-spec-validator to check if our structure meets the registry requirements
   ```
   - Ensures compliance with `api-connector.mdx` requirements
   - Validates registry directory structure (CEO-emphasized importance)
   - Checks required metadata files and _scaffold alignment
   - **Real Example**: *ADS-B connector systematic validation achieving 95% compliance*

### 🔧 Phase 2: Implementation

3. **Build the Client** **(Production Resilience)**
   ```
   Use the connector-client-builder agent to create a robust HTTP client for [API_NAME] with rate limiting
   ```
   - Implements structured error handling with correlation IDs
   - Adds three-state circuit breaker patterns (CLOSED/OPEN/HALF_OPEN)
   - Configures token bucket rate limiting with server feedback
   - Sets up retry logic with exponential backoff + jitter
   - **Real Example**: *ADS-B client achieving enterprise-grade reliability*

4. **Add Data Transformation** **(Security-Conscious)**
   ```
   Use the data-transformation-expert to design ETL pipelines for converting raw API data
   ```
   - Creates type-safe field mappings without vulnerabilities
   - Implements schema validation avoiding ReDoS patterns
   - Handles data normalization with structured error reporting
   - **Real Example**: *Secure email validation replacing ReDoS-vulnerable regex*

5. **Ensure TypeScript Quality**
   ```
   Use the typescript-expert to review and optimize TypeScript patterns in the connector
   ```
   - Designs robust interfaces
   - Implements type guards
   - Optimizes compilation

### 🧪 Phase 3: Testing & Security

6. **Create Test Suite**
   ```
   Use the connector-testing-specialist to build comprehensive tests for the connector
   ```
   - Unit tests for components
   - Integration tests with API
   - Mock server setup
   - Performance benchmarks

7. **Security Audit** **(Real Vulnerability Detection)**
   ```
   /security-check
   ```
   Or:
   ```
   Use the security-auditor to review the connector implementation for vulnerabilities
   ```
   - Detects ReDoS vulnerabilities like those caught by GitHub alerts
   - Reviews credential sanitization in logging
   - Validates input sanitization without introducing new vulnerabilities
   - **Real Example**: *ReDoS vulnerability detection and fix in ADS-B connector*

### 📚 Phase 4: Documentation & Review

8. **Generate Documentation**
   ```
   Use the registry-documentation-generator to create comprehensive docs for the connector
   ```
   - Creates README files
   - Generates getting-started guides
   - Documents configuration options
   - Provides usage examples

9. **Architecture Review**
   ```
   Use the connector-architecture-reviewer to validate the connector design and patterns
   ```
   - Reviews code organization
   - Validates performance patterns
   - Ensures best practices

10. **Pattern Validation**
    ```
    Use the google-analytics-pattern-auditor to ensure consistency with reference implementations
    ```
    - Compares against GA connector
    - Validates documentation format
    - Checks testing patterns

### ⚡ Phase 5: Optimization & Production

11. **Performance Optimization**
    ```
    /optimize
    ```
    Or:
    ```
    Use the performance-optimizer to analyze and improve connector performance
    ```
    - Profiles execution
    - Optimizes HTTP patterns
    - Reduces memory usage

12. **Add Reliability Features**
    ```
    Use the api-reliability-engineer to add production resilience patterns
    ```
    - Implements circuit breakers
    - Adds monitoring hooks
    - Handles API versioning

13. **Debug Issues**
    ```
    Use the connector-debugger to troubleshoot any API connection or data issues
    ```
    - Analyzes error patterns
    - Debugs transformations
    - Investigates performance

## Agent Reference

### Core Development Agents
- **api-schema-analyzer** - API response analysis and schema generation
- **connector-client-builder** - HTTP client implementation with resilience
- **data-transformation-expert** - ETL pipeline design and optimization
- **typescript-expert** - TypeScript patterns and type safety

### Quality Assurance Agents
- **api-connector-spec-validator** - Registry specification compliance
- **scaffold-pattern-matcher** - _scaffold template adherence
- **google-analytics-pattern-auditor** - Reference implementation comparison
- **connector-architecture-reviewer** - Design pattern validation

### Testing & Security Agents
- **connector-testing-specialist** - Comprehensive test strategies
- **security-auditor** - Vulnerability assessment
- **connector-debugger** - Issue troubleshooting

### Optimization Agents
- **performance-optimizer** - Performance tuning
- **api-reliability-engineer** - Production resilience
- **dependency-manager** - Package optimization
- **conversation-insights-extractor** - Conversation analysis and decision tracking
- **registry-documentation-generator** - Documentation creation

## Command Reference

### Development Commands
- `/explain [code]` - Get detailed explanations
- `/refactor [target]` - Systematic code refactoring
- `/setup [project]` - Initialize connector structure

### Testing Commands
- `/test [target]` - Run test suites
- `/security-check` - Security vulnerability scan
- `/perf-monitor` - Performance analysis

### Optimization Commands
- `/optimize [component]` - Performance optimization
- `/dependency-update` - Update dependencies safely
- `/memory-ops` - Memory usage analysis

### Specialized Commands
- `/mcp-debug` - Debug MCP protocol issues
- `/review` - Code review workflow

## Automated Hooks

### 🔍 typescript-dev.sh
Automatically runs on TypeScript file changes:
- Type checking with `tsc --noEmit`
- Linting if configured
- Prettier formatting checks
- Scans all connector TypeScript implementations

### 🔒 security-check.sh
Automatically runs security audits:
- npm audit for vulnerabilities
- Credential exposure detection
- Unsafe pattern scanning

### ✅ lint-check.sh
Automatically runs linting:
- Executes `npm run lint` if available
- Ensures code quality standards

## Example Workflows

### 🆕 Creating a New Connector from Scratch

```bash
# 1. Start with API analysis
"Analyze the API at https://api.example.com/v1/data"
# Claude uses api-schema-analyzer

# 2. Set up the structure
"Create the connector structure for example-api following the _scaffold pattern"
# Claude uses scaffold-pattern-matcher

# 3. Build the client
"Implement the HTTP client with rate limiting and error handling"
# Claude uses connector-client-builder

# 4. Add transformations
"Design the data transformation pipeline for the example-api responses"
# Claude uses data-transformation-expert

# 5. Create tests
"Build a comprehensive test suite for the connector"
# Claude uses connector-testing-specialist

# 6. Generate docs
"Create documentation following the Google Analytics pattern"
# Claude uses registry-documentation-generator

# 7. Final review
"Review the connector for production readiness"
# Claude uses connector-architecture-reviewer
```

### 🔧 Fixing a Failing Connector

```bash
# 1. Debug the issue
"Debug why the connector is failing to connect"
# Claude uses connector-debugger

# 2. Check security
/security-check
# Runs automated security scan

# 3. Optimize performance
/optimize client
# Claude uses performance-optimizer

# 4. Update dependencies
/dependency-update
# Claude uses dependency-manager
```

### 📈 Optimizing an Existing Connector

```bash
# 1. Performance analysis
/perf-monitor
# Analyzes current performance

# 2. Optimize code
"Use the performance-optimizer to improve response times"

# 3. Add reliability
"Add circuit breaker and retry patterns"
# Claude uses api-reliability-engineer

# 4. Refactor for clarity
/refactor src/client.ts
# Systematic refactoring
```

## 💡 Pro Tips

1. **Use agents proactively** - Don't wait for Claude to suggest them
2. **Chain agents together** - They work well in sequence
3. **Leverage hooks** - Let automation catch issues early
4. **Follow the workflow** - The phases build on each other
5. **Reference patterns** - Use GA connector as a gold standard

## 🚀 Quick Start for New Connector

```bash
# Just say:
"I need to build a connector for [API_NAME]. Let's start with analyzing their API at [API_URL]"

# Claude will automatically:
# 1. Use api-schema-analyzer
# 2. Guide you through each phase
# 3. Suggest appropriate agents
# 4. Run automated checks
```

## 📊 Workflow Diagram

```
API Discovery → Schema Analysis → Client Building → 
Data Transform → Testing → Security → Documentation → 
Optimization → Production Readiness → Deployment
```

Each phase has specialized agents enriched with real-world patterns to ensure quality and efficiency!

---

## 📊 Success Metrics

**Based on ADS-B Connector Implementation:**

- ✅ **95% Specification Compliance** achieved through systematic agent usage
- ✅ **Zero Security Vulnerabilities** after ReDoS detection and fix
- ✅ **100% Test Coverage** with real API integration testing
- ✅ **Production-Ready Architecture** with circuit breakers and rate limiting
- ✅ **Complete Documentation** with working code examples

## 🔄 Agent Evolution

These agents are **living documents** that evolve based on:

- ✅ Real-world implementation experiences (like ADS-B)
- ✅ Security incidents and vulnerability discoveries
- ✅ Performance optimization learnings
- ✅ User feedback and common issues
- ✅ Registry specification updates

**Last Updated:** Enriched with ADS-B connector patterns achieving 95% specification compliance
