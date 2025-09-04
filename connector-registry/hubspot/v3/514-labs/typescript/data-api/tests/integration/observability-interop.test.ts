/* eslint-env jest */
import { createHubSpotConnector, createLoggingHooks, createMetricsHooks } from "../../src";
import type { ConnectorConfig } from "../../src/types/config";
import type { Hook } from "../../src/types/hooks";

// Integration tests demonstrating interoperability between observability hooks and existing custom hooks
// Shows how built-in hooks work alongside complex custom hook chains

describe("observability hook interoperability", () => {
  describe("priority-based execution order", () => {
    it("executes hooks in priority order (lower number = higher priority)", () => {
      const connector = createHubSpotConnector();
      const executionOrder: string[] = [];

      // Create hooks with different priorities
      const highPriorityHook: Hook = {
        name: "high-priority",
        priority: 100,
        execute: () => executionOrder.push("high-priority"),
      };

      const mediumPriorityHook: Hook = {
        name: "medium-priority", 
        priority: 500,
        execute: () => executionOrder.push("medium-priority"),
      };

      const lowPriorityHook: Hook = {
        name: "low-priority",
        priority: 2000,
        execute: () => executionOrder.push("low-priority"),
      };

      const logging = createLoggingHooks({
        logger: () => executionOrder.push("observability-logging"),
      });

      const { hooks: metrics } = createMetricsHooks();
      
      // Observability hooks have priority 1000
      const observabilityHook = metrics.afterResponse?.[0];
      if (observabilityHook) {
        const originalExecute = observabilityHook.execute;
        observabilityHook.execute = (ctx) => {
          executionOrder.push("observability-metrics");
          return originalExecute.call(observabilityHook, ctx);
        };
      }

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          afterResponse: [mediumPriorityHook, lowPriorityHook, highPriorityHook],
          ...logging,
          ...metrics,
        },
      };

      connector.initialize(config);

      // Sort hooks by priority (as the hook system should do)
      const hooks = config.hooks?.afterResponse || [];
      hooks.sort((a, b) => (a.priority || 0) - (b.priority || 0));

      // Execute all hooks
      const ctx = {
        type: "afterResponse" as const,
        operation: "test",
        request: { method: "GET", url: "https://api.example.com" },
        response: {
          status: 200,
          data: {},
          meta: { durationMs: 100 },
        },
      };

      hooks.forEach(hook => hook.execute(ctx));

      expect(executionOrder).toEqual([
        "high-priority",      // 100
        "medium-priority",    // 500  
        "observability-logging", // 1000
        "observability-metrics", // 1000
        "low-priority",       // 2000
      ]);
    });

    it("handles hooks with no priority (defaults to 0)", () => {
      const connector = createHubSpotConnector();
      const executionOrder: string[] = [];

      const noPriorityHook: Hook = {
        name: "no-priority",
        // priority is undefined/missing
        execute: () => executionOrder.push("no-priority"),
      };

      const logging = createLoggingHooks({
        logger: () => executionOrder.push("logging"),
      });

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          beforeRequest: [noPriorityHook],
          ...logging,
        },
      };

      connector.initialize(config);

      const hooks = config.hooks?.beforeRequest || [];
      hooks.sort((a, b) => (a.priority || 0) - (b.priority || 0));

      const ctx = {
        type: "beforeRequest" as const,
        operation: "test",
        request: { method: "GET", url: "https://api.example.com" },
      };

      hooks.forEach(hook => hook.execute(ctx));

      // No priority (0) should execute before logging (1000)
      expect(executionOrder).toEqual(["no-priority", "logging"]);
    });
  });

  describe("data transformation chains", () => {
    it("allows custom hooks to transform data before observability hooks log it", () => {
      const connector = createHubSpotConnector();
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];

      // Custom hook that enriches the request with metadata
      const requestEnrichmentHook: Hook = {
        name: "request-enrichment",
        priority: 100, // Execute before logging
        execute: (ctx) => {
          if (ctx.type === "beforeRequest" && ctx.request) {
            // Add custom headers or modify request
            const req = ctx.request as any;
            req.headers = {
              ...req.headers,
              "X-Request-ID": "custom-123",
              "X-Client-Version": "1.2.3",
            };
          }
        },
      };

      // Custom hook that transforms response data
      const responseTransformHook: Hook = {
        name: "response-transform",
        priority: 500, // Execute before observability (1000)
        execute: (ctx) => {
          if (ctx.type === "afterResponse" && ctx.response && ctx.modifyResponse) {
            const res = ctx.response as any;
            // Transform the response to include computed fields
            const transformedData = {
              ...res.data,
              _metadata: {
                transformedAt: new Date().toISOString(),
                recordCount: Array.isArray(res.data?.results) ? res.data.results.length : 0,
              },
            };
            ctx.modifyResponse({ data: transformedData });
          }
        },
      };

      const logging = createLoggingHooks({
        level: "info",
        includeHeaders: true,
        logger: (level, event) => loggedEvents.push({ level, event }),
      });

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          beforeRequest: [requestEnrichmentHook],
          afterResponse: [responseTransformHook],
          ...logging,
        },
      };

      connector.initialize(config);

      // Execute hooks in priority order
      const beforeRequestCtx = {
        type: "beforeRequest" as const,
        operation: "list-contacts",
        request: {
          method: "GET",
          url: "https://api.hubapi.com/contacts",
          headers: { "User-Agent": "test-client" },
        },
      };

      const afterResponseCtx = {
        type: "afterResponse" as const,
        operation: "list-contacts",
        request: beforeRequestCtx.request,
        response: {
          status: 200,
          data: { results: [{ id: "1" }, { id: "2" }] },
          meta: { durationMs: 150 },
        },
        modifyResponse: jest.fn(),
      };

      // Execute transformation hooks first
      requestEnrichmentHook.execute(beforeRequestCtx);
      responseTransformHook.execute(afterResponseCtx);

      // Then execute logging hooks
      const beforeLoggingHook = config.hooks?.beforeRequest?.find(h => h.name === "log-before-request");
      const afterLoggingHook = config.hooks?.afterResponse?.find(h => h.name === "log-after-response");

      beforeLoggingHook?.execute(beforeRequestCtx);
      afterLoggingHook?.execute(afterResponseCtx);

      expect(loggedEvents).toHaveLength(2);

      // Verify that logging captured the enriched request
      const requestLog = loggedEvents[0].event;
      expect(requestLog.headers).toEqual({
        "User-Agent": "test-client",
        "X-Request-ID": "custom-123",
        "X-Client-Version": "1.2.3",
      });

      // Verify logging captured the original response (before transformation)
      const responseLog = loggedEvents[1].event;
      expect(responseLog.itemCount).toBe(2); // Original results array length
    });

    it("demonstrates error handling with custom error enrichment", () => {
      const connector = createHubSpotConnector();
      const loggedErrors: Array<{ level: string; event: Record<string, unknown> }> = [];

      // Custom hook that enriches errors with additional context
      const errorEnrichmentHook: Hook = {
        name: "error-enrichment",
        priority: 500, // Execute before observability logging
        execute: (ctx) => {
          if (ctx.type === "onError" && ctx.error) {
            const err = ctx.error as any;
            // Add additional context to the error
            err.enrichedContext = {
              timestamp: new Date().toISOString(),
              operation: ctx.operation,
              userAgent: "test-client/1.0",
              correlationId: "corr-123",
            };
            
            // Potentially classify the error
            if (err.statusCode >= 500) {
              err.errorCategory = "server-error";
            } else if (err.statusCode >= 400) {
              err.errorCategory = "client-error";
            } else {
              err.errorCategory = "unknown";
            }
          }
        },
      };

      const logging = createLoggingHooks({
        level: "error",
        logger: (level, event) => loggedErrors.push({ level, event }),
      });

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          onError: [errorEnrichmentHook],
          ...logging,
        },
      };

      connector.initialize(config);

      const errorCtx = {
        type: "onError" as const,
        operation: "create-contact",
        error: {
          message: "Validation failed",
          code: "INVALID_INPUT",
          statusCode: 400,
          source: "api-validation",
        },
      };

      // Execute enrichment first, then logging
      errorEnrichmentHook.execute(errorCtx);
      
      const errorLoggingHook = config.hooks?.onError?.find(h => h.name === "log-on-error");
      errorLoggingHook?.execute(errorCtx);

      expect(loggedErrors).toHaveLength(1);
      
      const errorLog = loggedErrors[0].event;
      expect(errorLog.message).toBe("Validation failed");
      expect(errorLog.code).toBe("INVALID_INPUT");
      expect(errorLog.statusCode).toBe(400);
      
      // Note: The error enrichment happened on the error object itself,
      // but the logging hook may not capture all enriched fields
      // depending on its implementation
    });
  });

  describe("custom metrics and logging combinations", () => {
    it("demonstrates custom business metrics alongside observability metrics", () => {
      const connector = createHubSpotConnector();
      
      // Custom metrics for business logic
      const businessMetrics = {
        contactsCreated: 0,
        companiesQueried: 0,
        apiCallsByType: {} as Record<string, number>,
        errorsByCategory: {} as Record<string, number>,
      };

      const businessMetricsHook: Hook = {
        name: "business-metrics",
        priority: 200, // Execute early
        execute: (ctx) => {
          if (ctx.type === "afterResponse" && ctx.response) {
            const operation = ctx.operation;
            
            // Track business-specific metrics
            if (operation.includes("create") && operation.includes("contact")) {
              businessMetrics.contactsCreated++;
            }
            if (operation.includes("companies")) {
              businessMetrics.companiesQueried++;
            }
            
            // Track API call patterns
            businessMetrics.apiCallsByType[operation] = 
              (businessMetrics.apiCallsByType[operation] || 0) + 1;
          }
          
          if (ctx.type === "onError" && ctx.error) {
            const err = ctx.error as any;
            const category = err.statusCode >= 500 ? "server" : "client";
            businessMetrics.errorsByCategory[category] = 
              (businessMetrics.errorsByCategory[category] || 0) + 1;
          }
        },
      };

      // Standard observability
      const { hooks: observabilityMetrics, sink } = createMetricsHooks();
      const logging = createLoggingHooks({ level: "info" });

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          afterResponse: [businessMetricsHook],
          onError: [businessMetricsHook],
          ...logging,
          ...observabilityMetrics,
        },
      };

      connector.initialize(config);

      // Simulate various operations
      const operations = [
        { type: "afterResponse", op: "create-contact", status: 201 },
        { type: "afterResponse", op: "list-companies", status: 200 },
        { type: "afterResponse", op: "create-contact", status: 201 },
        { type: "onError", op: "update-company", statusCode: 500 },
        { type: "afterResponse", op: "list-companies", status: 200 },
      ];

      operations.forEach(operation => {
        if (operation.type === "afterResponse") {
          const hooks = config.hooks?.afterResponse || [];
          hooks.forEach(hook => {
            hook.execute({
              type: "afterResponse",
              operation: operation.op,
              response: {
                status: operation.status,
                data: {},
                meta: { durationMs: 100 },
              },
            });
          });
        } else {
          const hooks = config.hooks?.onError || [];
          hooks.forEach(hook => {
            hook.execute({
              type: "onError",
              operation: operation.op,
              error: { message: "Error", statusCode: operation.statusCode },
            });
          });
        }
      });

      // Verify business metrics
      expect(businessMetrics.contactsCreated).toBe(2);
      expect(businessMetrics.companiesQueried).toBe(2);
      expect(businessMetrics.apiCallsByType).toEqual({
        "create-contact": 2,
        "list-companies": 2,
      });
      expect(businessMetrics.errorsByCategory).toEqual({
        "server": 1,
      });

      // Verify observability metrics are also captured
      const snapshot = sink.getSnapshot();
      expect(Object.keys(snapshot.counters)).toContain(
        expect.stringMatching(/http_requests_total/)
      );
      expect(Object.keys(snapshot.counters)).toContain(
        expect.stringMatching(/http_errors_total/)
      );
    });
  });

  describe("complex hook chains", () => {
    it("handles complex scenarios with authentication, caching, and observability", () => {
      const connector = createHubSpotConnector();
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];

      // Mock cache
      const cache = new Map<string, { data: any; timestamp: number }>();
      const CACHE_TTL = 60000; // 1 minute

      // Authentication hook that adds/refreshes tokens
      const authHook: Hook = {
        name: "auth-management",
        priority: 50, // Very high priority
        execute: (ctx) => {
          if (ctx.type === "beforeRequest" && ctx.request) {
            const req = ctx.request as any;
            req.headers = {
              ...req.headers,
              "Authorization": "Bearer refreshed-token",
              "X-Auth-Timestamp": new Date().toISOString(),
            };
          }
        },
      };

      // Caching hook
      const cachingHook: Hook = {
        name: "response-cache",
        priority: 100, // High priority
        execute: (ctx) => {
          if (ctx.type === "beforeRequest" && ctx.request) {
            const req = ctx.request as any;
            const cacheKey = `${req.method}:${req.url}`;
            const cached = cache.get(cacheKey);
            
            if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
              // Mark request as cached
              req._cached = true;
            }
          }
          
          if (ctx.type === "afterResponse" && ctx.response && !((ctx.request as any)?._cached)) {
            const req = ctx.request as any;
            const cacheKey = `${req.method}:${req.url}`;
            cache.set(cacheKey, {
              data: (ctx.response as any).data,
              timestamp: Date.now(),
            });
          }
        },
      };

      // Business logic hook
      const businessLogicHook: Hook = {
        name: "business-logic",
        priority: 300,
        execute: (ctx) => {
          if (ctx.type === "afterResponse" && ctx.response && ctx.modifyResponse) {
            const res = ctx.response as any;
            // Add business-specific transformations
            const enhanced = {
              ...res.data,
              _businessContext: {
                processedAt: new Date().toISOString(),
                cached: !!(ctx.request as any)?._cached,
                transformationVersion: "1.0",
              },
            };
            ctx.modifyResponse({ data: enhanced });
          }
        },
      };

      // Observability
      const logging = createLoggingHooks({
        level: "debug",
        includeHeaders: true,
        logger: (level, event) => loggedEvents.push({ level, event }),
      });

      const { hooks: metrics, sink } = createMetricsHooks({}, { 
        service: "hubspot",
        cacheEnabled: "true" 
      });

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "initial-token" } },
        hooks: {
          beforeRequest: [authHook, cachingHook],
          afterResponse: [cachingHook, businessLogicHook],
          ...logging,
          ...metrics,
        },
      };

      connector.initialize(config);

      // Execute a complete request/response cycle
      const requestCtx = {
        type: "beforeRequest" as const,
        operation: "list-contacts",
        request: {
          method: "GET",
          url: "https://api.hubapi.com/crm/v3/objects/contacts",
          headers: { "User-Agent": "test" },
        },
      };

      const responseCtx = {
        type: "afterResponse" as const,
        operation: "list-contacts",
        request: requestCtx.request,
        response: {
          status: 200,
          data: { results: [{ id: "1", name: "John" }] },
          meta: { durationMs: 120 },
        },
        modifyResponse: jest.fn(),
      };

      // Execute all beforeRequest hooks in priority order
      const beforeHooks = config.hooks?.beforeRequest || [];
      beforeHooks.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      beforeHooks.forEach(hook => hook.execute(requestCtx));

      // Execute all afterResponse hooks in priority order  
      const afterHooks = config.hooks?.afterResponse || [];
      afterHooks.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      afterHooks.forEach(hook => hook.execute(responseCtx));

      // Verify the complete flow worked
      
      // 1. Auth hook should have modified headers
      expect(requestCtx.request.headers).toEqual({
        "User-Agent": "test",
        "Authorization": "Bearer refreshed-token",
        "X-Auth-Timestamp": expect.any(String),
      });

      // 2. Cache should have stored the response
      const cacheKey = "GET:https://api.hubapi.com/crm/v3/objects/contacts";
      expect(cache.has(cacheKey)).toBe(true);

      // 3. Business logic hook should have been called (modifyResponse called)
      expect(responseCtx.modifyResponse).toHaveBeenCalled();

      // 4. Logging should have captured enriched request with auth headers
      const requestLog = loggedEvents.find(e => e.event.event === "http_request");
      expect(requestLog?.event.headers).toEqual({
        "User-Agent": "test",
        "Authorization": "Bearer refreshed-token",
        "X-Auth-Timestamp": expect.any(String),
      });

      // 5. Metrics should include cache labels
      const snapshot = sink.getSnapshot();
      const counterKeys = Object.keys(snapshot.counters);
      expect(counterKeys.some(key => key.includes("cacheEnabled=true"))).toBe(true);
    });
  });
});
