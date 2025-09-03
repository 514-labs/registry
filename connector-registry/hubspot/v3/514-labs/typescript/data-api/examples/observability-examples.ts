/**
 * Observability Examples for HubSpot Connector
 * 
 * This file demonstrates different ways to enable and use the observability features
 * (logging and metrics) with the HubSpot connector. These examples match the patterns
 * described in the documentation.
 */

import {
  createHubSpotConnector,
  createLoggingHooks,
  createMetricsHooks,
  InMemoryMetricsSink,
} from "../app/hubspot/src";
import type { ConnectorConfig } from "../app/hubspot/src/types/config";

// ============================================================================
// 1. QUICK START (AUTOMATIC, NO CUSTOM CODE)
// ============================================================================

/**
 * Simplest way to enable observability - just use the flags
 */
async function quickStartExample() {
  console.log("=== Quick Start Example ===");
  
  const connector = createHubSpotConnector();
  
  connector.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
    enableLogging: { level: "info" }, // or true for defaults
    enableMetrics: true,              // in-memory counters + timings
  });

  await connector.connect();
  
  // Make some API calls - observability will automatically log and measure them
  try {
    const contacts = await connector.listContacts({ limit: 5 });
    console.log(`Retrieved ${(contacts.data as any)?.results?.length || 0} contacts`);
    
    const companies = await connector.listCompanies({ limit: 3 });
    console.log(`Retrieved ${(companies.data as any)?.results?.length || 0} companies`);
    
  } catch (error) {
    console.error("API call failed:", error);
  }
  
  await connector.disconnect();
  
  // What you get:
  // - Logging: one-line JSON events for beforeRequest, afterResponse, onError, onRetry
  // - Metrics: counters and duration observations in an in-memory sink (internal by default)
}

// ============================================================================
// 2. LOGGING OPTIONS
// ============================================================================

/**
 * Demonstrates different logging configurations
 */
async function loggingOptionsExample() {
  console.log("\n=== Logging Options Example ===");
  
  const connector = createHubSpotConnector();
  
  // Custom logger that formats output nicely for development
  const devLogger = (level: string, event: Record<string, unknown>) => {
    const timestamp = new Date().toISOString();
    const operation = event.operation || "unknown";
    const status = event.status ? ` [${event.status}]` : "";
    const duration = event.durationMs ? ` (${event.durationMs}ms)` : "";
    
    console.log(`${timestamp} ${level.toUpperCase()}: ${operation}${status}${duration}`);
    
    // In development, you might want to see full details
    if (level === "error" || process.env.NODE_ENV === "development") {
      console.log("  Details:", JSON.stringify(event, null, 2));
    }
  };
  
  connector.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
    enableLogging: {
      level: "info",
      includeQueryParams: false,  // PII control: exclude query params
      includeHeaders: false,      // PII control: exclude headers
      includeBody: false,         // PII control: exclude request/response bodies
      logger: devLogger,          // Custom formatting
    },
  });

  await connector.connect();
  
  try {
    // This will log the request/response with custom formatting
    await connector.getContacts({ pageSize: 2, maxItems: 2 });
  } catch (error) {
    // Errors will be logged with full details
    console.error("Operation failed");
  }
  
  await connector.disconnect();
}

/**
 * Production logging example with structured JSON and PII protection
 */
async function productionLoggingExample() {
  console.log("\n=== Production Logging Example ===");
  
  const connector = createHubSpotConnector();
  
  // Production logger that writes structured logs
  const productionLogger = (level: string, event: Record<string, unknown>) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      service: "hubspot-connector",
      version: "1.0.0",
      ...event,
    };
    
    // In production, you'd send this to your logging service
    console.log(JSON.stringify(logEntry));
  };
  
  connector.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
    enableLogging: {
      level: "warn",              // Only log warnings and errors in production
      includeQueryParams: false,  // Never include query params (may contain PII)
      includeHeaders: false,      // Never include headers (contain auth tokens)
      includeBody: false,         // Never include request bodies (may contain PII)
      logger: productionLogger,
    },
  });

  await connector.connect();
  
  try {
    await connector.listContacts({ limit: 1 });
    console.log("Success - no log output (info level filtered by warn threshold)");
  } catch (error) {
    console.log("Error - would be logged");
  }
  
  await connector.disconnect();
}

// ============================================================================
// 3. METRICS OPTIONS
// ============================================================================

/**
 * Basic metrics example with in-memory sink
 */
async function basicMetricsExample() {
  console.log("\n=== Basic Metrics Example ===");
  
  const connector = createHubSpotConnector();
  
  connector.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
    enableMetrics: true, // Uses default in-memory sink
  });

  await connector.connect();
  
  try {
    // Make several API calls to generate metrics
    await connector.listContacts({ limit: 5 });
    await connector.listCompanies({ limit: 3 });
    await connector.listDeals({ limit: 2 });
    
    console.log("Metrics are being collected internally but not directly accessible with automatic setup");
    console.log("Use manual composition (see next example) for direct access to metrics");
    
  } catch (error) {
    console.error("API calls failed:", error);
  }
  
  await connector.disconnect();
}

// ============================================================================
// 4. MANUAL COMPOSITION (FOR DIRECT SINK ACCESS)
// ============================================================================

/**
 * Manual composition for direct access to metrics sink
 */
async function manualCompositionExample() {
  console.log("\n=== Manual Composition Example ===");
  
  const connector = createHubSpotConnector();
  
  // Create logging hooks with custom configuration
  const logging = createLoggingHooks({ 
    level: "info",
    logger: (level, event) => {
      console.log(`[${level.toUpperCase()}] ${event.event}: ${event.operation}`);
    },
  });
  
  // Create metrics hooks with direct sink access
  const { hooks: metricsHooks, sink } = createMetricsHooks(
    { sink: new InMemoryMetricsSink() },
    { service: "hubspot", environment: "development" } // static labels
  );
  
  connector.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
    hooks: {
      ...logging,
      ...metricsHooks,
      // plus any custom hooks you already have
    },
  });

  await connector.connect();
  
  try {
    // Make some API calls
    await connector.listContacts({ limit: 5 });
    await connector.listCompanies({ limit: 3 });
    
    // Now we can inspect the metrics directly!
    const snapshot = (sink as InMemoryMetricsSink).getSnapshot();
    
    console.log("\n--- Metrics Snapshot ---");
    console.log("Request counts:");
    Object.entries(snapshot.counters).forEach(([key, value]) => {
      if (key.includes("http_requests_total")) {
        console.log(`  ${key}: ${value}`);
      }
    });
    
    console.log("\nResponse times:");
    Object.entries(snapshot.observations).forEach(([key, value]) => {
      if (key.includes("http_request_duration_ms")) {
        console.log(`  ${key}: ${value.count} requests, avg ${Math.round(value.avg)}ms`);
      }
    });
    
  } catch (error) {
    console.error("API calls failed:", error);
    
    // Check error metrics
    const snapshot = (sink as InMemoryMetricsSink).getSnapshot();
    console.log("\nError counts:");
    Object.entries(snapshot.counters).forEach(([key, value]) => {
      if (key.includes("http_errors_total")) {
        console.log(`  ${key}: ${value}`);
      }
    });
  }
  
  await connector.disconnect();
}

/**
 * Custom metrics sink example for integrating with external monitoring
 */
async function customSinkExample() {
  console.log("\n=== Custom Sink Example ===");
  
  const connector = createHubSpotConnector();
  
  // Custom sink that could integrate with Prometheus, StatsD, etc.
  const customSink = {
    incrementCounter: (name: string, value: number = 1, labels?: Record<string, any>) => {
      const labelsStr = labels ? Object.entries(labels).map(([k, v]) => `${k}=${v}`).join(", ") : "";
      console.log(`COUNTER ${name}{${labelsStr}} +${value}`);
      
      // In real implementation, you'd send to your metrics backend:
      // statsd.increment(name, value, labels);
      // prometheus.getCounter(name).labels(labels).inc(value);
    },
    
    observe: (name: string, value: number, labels?: Record<string, any>) => {
      const labelsStr = labels ? Object.entries(labels).map(([k, v]) => `${k}=${v}`).join(", ") : "";
      console.log(`HISTOGRAM ${name}{${labelsStr}} ${value}`);
      
      // In real implementation:
      // statsd.histogram(name, value, labels);
      // prometheus.getHistogram(name).labels(labels).observe(value);
    },
  };
  
  const { hooks: metricsHooks } = createMetricsHooks({ sink: customSink });
  
  connector.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
    hooks: { ...metricsHooks },
  });

  await connector.connect();
  
  try {
    console.log("Making API calls (watch for metric output):");
    await connector.listContacts({ limit: 2 });
  } catch (error) {
    console.error("API call failed - error metrics will be emitted");
  }
  
  await connector.disconnect();
}

// ============================================================================
// 5. INTEROP WITH EXISTING HOOKS
// ============================================================================

/**
 * Shows how observability hooks work with existing custom hooks
 */
async function hookInteropExample() {
  console.log("\n=== Hook Interoperability Example ===");
  
  const connector = createHubSpotConnector();
  
  // Existing custom hooks (maybe you already have these)
  const requestIdHook = {
    name: "add-request-id",
    priority: 100, // High priority
    execute: (ctx: any) => {
      if (ctx.type === "beforeRequest" && ctx.request) {
        ctx.request.headers = {
          ...ctx.request.headers,
          "X-Request-ID": `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
      }
    },
  };
  
  const responseTransformHook = {
    name: "transform-response",
    priority: 500, // Medium priority
    execute: (ctx: any) => {
      if (ctx.type === "afterResponse" && ctx.response && ctx.modifyResponse) {
        const data = ctx.response.data;
        const transformed = {
          ...data,
          _metadata: {
            transformedAt: new Date().toISOString(),
            version: "1.0",
          },
        };
        ctx.modifyResponse({ data: transformed });
      }
    },
  };
  
  // Observability hooks
  const logging = createLoggingHooks({ 
    level: "info",
    includeHeaders: true, // Will see our custom request ID
    logger: (level, event) => {
      console.log(`[${level}] ${event.event} - ${event.operation}`);
      if (event.headers && (event.headers as any)["X-Request-ID"]) {
        console.log(`  Request ID: ${(event.headers as any)["X-Request-ID"]}`);
      }
    },
  });
  
  const { hooks: metricsHooks, sink } = createMetricsHooks();
  
  connector.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
    hooks: {
      // Your existing hooks
      beforeRequest: [requestIdHook],
      afterResponse: [responseTransformHook],
      // Observability hooks get appended (priority 1000)
      ...logging,
      ...metricsHooks,
    },
  });

  await connector.connect();
  
  try {
    console.log("Making API call with custom hooks + observability:");
    await connector.listContacts({ limit: 2 });
    
    console.log("\nHooks executed in this order (by priority):");
    console.log("1. add-request-id (100) - added X-Request-ID header");
    console.log("2. transform-response (500) - transformed response data");
    console.log("3. observability hooks (1000) - logged and measured");
    
  } catch (error) {
    console.error("API call failed");
  }
  
  await connector.disconnect();
}

// ============================================================================
// 6. COMPLETE PRODUCTION EXAMPLE
// ============================================================================

/**
 * Complete example showing production-ready observability setup
 */
async function productionExample() {
  console.log("\n=== Production Example ===");
  
  const connector = createHubSpotConnector();
  
  // Production logging configuration
  const logging = createLoggingHooks({
    level: "warn", // Only warnings and errors
    includeQueryParams: false, // PII protection
    includeHeaders: false,     // Token protection
    includeBody: false,        // Data protection
    logger: (level, event) => {
      // In production, send to your logging service (Datadog, Splunk, etc.)
      const logEntry = {
        timestamp: new Date().toISOString(),
        level: level.toUpperCase(),
        service: "hubspot-integration",
        environment: process.env.NODE_ENV || "development",
        ...event,
      };
      
      // For demo, just log to console
      if (level === "error" || level === "warn") {
        console.error(JSON.stringify(logEntry));
      }
    },
  });
  
  // Production metrics with custom sink
  const productionMetricsSink = {
    incrementCounter: (name: string, value: number = 1, labels?: Record<string, any>) => {
      // Send to Prometheus, StatsD, CloudWatch, etc.
      console.log(`METRIC: ${name} += ${value}`, labels);
    },
    observe: (name: string, value: number, labels?: Record<string, any>) => {
      // Send timing metrics
      console.log(`TIMING: ${name} = ${value}ms`, labels);
    },
  };
  
  const { hooks: metricsHooks } = createMetricsHooks(
    { sink: productionMetricsSink },
    { 
      service: "hubspot-integration",
      environment: process.env.NODE_ENV || "development",
      version: process.env.APP_VERSION || "1.0.0",
    }
  );
  
  // Custom business logic hooks
  const auditHook = {
    name: "audit-log",
    priority: 200,
    execute: (ctx: any) => {
      if (ctx.type === "afterResponse" && ctx.response) {
        // Log successful operations for compliance
        if (ctx.operation.includes("create") || ctx.operation.includes("update")) {
          console.log(`AUDIT: ${ctx.operation} completed successfully`);
        }
      }
    },
  };
  
  connector.initialize({
    auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN! } },
    hooks: {
      afterResponse: [auditHook],
      ...logging,
      ...metricsHooks,
    },
  });

  await connector.connect();
  
  try {
    await connector.listContacts({ limit: 1 });
    console.log("Production setup running - check logs and metrics above");
  } catch (error) {
    console.error("Production error handling triggered");
  }
  
  await connector.disconnect();
}

// ============================================================================
// RUN EXAMPLES
// ============================================================================

async function runAllExamples() {
  // Only run examples if we have a token
  if (!process.env.HUBSPOT_TOKEN) {
    console.log("⚠️  Set HUBSPOT_TOKEN environment variable to run live examples");
    console.log("Examples are designed to work with or without a real token for demonstration");
  }
  
  try {
    await quickStartExample();
    await loggingOptionsExample(); 
    await productionLoggingExample();
    await basicMetricsExample();
    await manualCompositionExample();
    await customSinkExample();
    await hookInteropExample();
    await productionExample();
    
    console.log("\n✅ All examples completed!");
    console.log("\n📖 Key takeaways:");
    console.log("   • Use enableLogging/enableMetrics flags for quick setup");
    console.log("   • Use manual composition when you need direct sink access");
    console.log("   • Control PII exposure with includeQueryParams/includeHeaders/includeBody");
    console.log("   • Observability hooks work alongside your existing custom hooks");
    console.log("   • Built-in hooks use priority 1000 - set custom hooks lower/higher as needed");
    
  } catch (error) {
    console.error("Example failed:", error);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  runAllExamples().catch(console.error);
}

export {
  quickStartExample,
  loggingOptionsExample,
  productionLoggingExample,
  basicMetricsExample,
  manualCompositionExample,
  customSinkExample,
  hookInteropExample,
  productionExample,
};
