/* eslint-env jest */
import {
  createHubSpotConnector,
  createLoggingHooks,
  createMetricsHooks,
  InMemoryMetricsSink,
} from "../../src";
import type { ConnectorConfig } from "../../src/types/config";
import type { Hook } from "../../src/types/hooks";

// Integration tests for manual observability composition
// These tests demonstrate how to get direct access to sinks and use custom wiring

describe("manual observability composition", () => {
  describe("direct sink access", () => {
    it("provides access to metrics sink for inspection", () => {
      const connector = createHubSpotConnector();
      
      const { hooks: metricsHooks, sink } = createMetricsHooks(
        { sink: new InMemoryMetricsSink() },
        { service: "hubspot" } // static labels
      );

      expect(sink).toBeInstanceOf(InMemoryMetricsSink);
      
      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          ...metricsHooks,
        },
      };

      connector.initialize(config);

      // Simulate some operations
      const afterResponseHook = config.hooks?.afterResponse?.[0];
      afterResponseHook?.execute({
        type: "afterResponse",
        operation: "list-contacts",
        response: {
          status: 200,
          data: { results: [{ id: "1" }, { id: "2" }] },
          meta: { durationMs: 150 },
        },
      });

      // Direct access to metrics for inspection
      const snapshot = (sink as InMemoryMetricsSink).getSnapshot();
      
      expect(snapshot.counters["http_requests_total|operation=list-contacts,service=hubspot,status=200,success=true"]).toBe(1);
      expect(snapshot.observations["http_request_duration_ms|operation=list-contacts,service=hubspot,status=200,success=true"]).toEqual({
        count: 1,
        sum: 150,
        avg: 150,
      });
    });

    it("allows custom sink implementation", () => {
      const connector = createHubSpotConnector();
      
      // Custom sink that tracks specific metrics
      const customMetrics = {
        totalRequests: 0,
        errorCount: 0,
        totalDuration: 0,
        operations: new Set<string>(),
      };

      const customSink = {
        incrementCounter: (name: string, value: number = 1, labels?: Record<string, any>) => {
          if (name === "http_requests_total") {
            customMetrics.totalRequests += value;
            if (labels?.operation) {
              customMetrics.operations.add(labels.operation);
            }
          }
          if (name === "http_errors_total") {
            customMetrics.errorCount += value;
          }
        },
        observe: (name: string, value: number, labels?: Record<string, any>) => {
          if (name === "http_request_duration_ms") {
            customMetrics.totalDuration += value;
          }
        },
      };

      const { hooks: metricsHooks } = createMetricsHooks({ sink: customSink });
      const logging = createLoggingHooks({ level: "info" });

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          ...logging,
          ...metricsHooks,
        },
      };

      connector.initialize(config);

      // Simulate operations
      const afterResponseHook = config.hooks?.afterResponse?.find(h => h.name === "metrics-after-response");
      const onErrorHook = config.hooks?.onError?.find(h => h.name === "metrics-on-error");

      // Successful request
      afterResponseHook?.execute({
        type: "afterResponse",
        operation: "get-contact",
        response: {
          status: 200,
          data: { id: "123" },
          meta: { durationMs: 100 },
        },
      });

      // Error
      onErrorHook?.execute({
        type: "onError",
        operation: "create-contact",
        error: { message: "Validation failed", code: "INVALID_INPUT" },
      });

      // Another successful request
      afterResponseHook?.execute({
        type: "afterResponse",
        operation: "list-companies",
        response: {
          status: 200,
          data: { results: [] },
          meta: { durationMs: 50 },
        },
      });

      // Verify custom sink captured the data
      expect(customMetrics.totalRequests).toBe(2);
      expect(customMetrics.errorCount).toBe(1);
      expect(customMetrics.totalDuration).toBe(150); // 100 + 50
      expect(Array.from(customMetrics.operations)).toEqual(expect.arrayContaining(["get-contact", "list-companies"]));
    });
  });

  describe("custom hook combination", () => {
    it("combines observability hooks with existing custom hooks", () => {
      const connector = createHubSpotConnector();
      const executionOrder: string[] = [];

      // Custom hooks with different priorities
      const customHook1: Hook = {
        name: "custom-early",
        priority: 100, // Higher priority (executes first)
        execute: (ctx) => {
          if (ctx.type === "beforeRequest") {
            executionOrder.push("custom-early");
          }
        },
      };

      const customHook2: Hook = {
        name: "custom-late",
        priority: 2000, // Lower priority (executes last)
        execute: (ctx) => {
          if (ctx.type === "beforeRequest") {
            executionOrder.push("custom-late");
          }
        },
      };

      const logging = createLoggingHooks({
        level: "debug",
        logger: (level, event) => {
          if (event.event === "http_request") {
            executionOrder.push("logging");
          }
        },
      });

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          beforeRequest: [customHook1, customHook2],
          ...logging,
        },
      };

      connector.initialize(config);

      // Trigger beforeRequest hooks
      const beforeRequestHooks = config.hooks?.beforeRequest || [];
      
      // Sort by priority (as the hook system would do)
      beforeRequestHooks.sort((a, b) => (a.priority || 0) - (b.priority || 0));
      
      // Execute hooks in priority order
      const ctx = {
        type: "beforeRequest" as const,
        operation: "test",
        request: { method: "GET", url: "https://api.example.com/test" },
      };

      beforeRequestHooks.forEach(hook => hook.execute(ctx));

      // Verify execution order based on priority
      expect(executionOrder).toEqual(["custom-early", "logging", "custom-late"]);
    });

    it("allows observability hooks to observe custom hook modifications", () => {
      const connector = createHubSpotConnector();
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];

      // Custom hook that modifies the response
      const transformHook: Hook = {
        name: "response-transformer",
        priority: 500, // Execute before observability hooks
        execute: (ctx) => {
          if (ctx.type === "afterResponse" && ctx.response && ctx.modifyResponse) {
            const originalData = (ctx.response as any).data;
            // Transform the response data
            const transformedData = {
              ...originalData,
              transformed: true,
              itemCount: Array.isArray(originalData?.results) ? originalData.results.length : 0,
            };
            ctx.modifyResponse({ data: transformedData });
          }
        },
      };

      const logging = createLoggingHooks({
        level: "info",
        logger: (level, event) => {
          loggedEvents.push({ level, event });
        },
      });

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          afterResponse: [transformHook],
          ...logging,
        },
      };

      connector.initialize(config);

      // Execute hooks in the order they would be called
      const ctx = {
        type: "afterResponse" as const,
        operation: "list-contacts",
        request: { method: "GET", url: "https://api.example.com/contacts" },
        response: {
          status: 200,
          data: { results: [{ id: "1" }, { id: "2" }] },
          meta: { durationMs: 200 },
        },
        modifyResponse: jest.fn(),
      };

      // Transform hook executes first (priority 500)
      transformHook.execute(ctx);
      
      // Then logging hook executes (priority 1000)
      const loggingHook = config.hooks?.afterResponse?.find(h => h.name === "log-after-response");
      loggingHook?.execute(ctx);

      // Verify logging captured the original response data
      expect(loggedEvents).toHaveLength(1);
      const logEvent = loggedEvents[0].event;
      expect(logEvent.operation).toBe("list-contacts");
      expect(logEvent.status).toBe(200);
      expect(logEvent.durationMs).toBe(200);
      expect(logEvent.itemCount).toBe(2); // Should count from original results array
    });
  });

  describe("static labels and configuration", () => {
    it("applies static labels to all metrics", () => {
      const connector = createHubSpotConnector();
      
      const { hooks: metricsHooks, sink } = createMetricsHooks(
        { sink: new InMemoryMetricsSink() },
        { 
          service: "hubspot-connector",
          environment: "test",
          version: "1.0.0",
        }
      );

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          ...metricsHooks,
        },
      };

      connector.initialize(config);

      // Simulate different types of operations
      const afterResponseHook = config.hooks?.afterResponse?.[0];
      const onErrorHook = config.hooks?.onError?.[0];

      afterResponseHook?.execute({
        type: "afterResponse",
        operation: "get-contact",
        response: {
          status: 200,
          data: { id: "123" },
          meta: { durationMs: 100 },
        },
      });

      onErrorHook?.execute({
        type: "onError",
        operation: "update-contact",
        error: { message: "Network timeout", code: "TIMEOUT" },
      });

      const snapshot = (sink as InMemoryMetricsSink).getSnapshot();
      
      // All metric keys should include static labels
      const counterKeys = Object.keys(snapshot.counters);
      const observationKeys = Object.keys(snapshot.observations);
      
      for (const key of [...counterKeys, ...observationKeys]) {
        expect(key).toContain("service=hubspot-connector");
        expect(key).toContain("environment=test");
        expect(key).toContain("version=1.0.0");
      }

      // Verify specific metrics exist with static labels
      expect(snapshot.counters).toHaveProperty(
        expect.stringMatching(/http_requests_total.*service=hubspot-connector.*environment=test.*version=1\.0\.0/)
      );
      expect(snapshot.counters).toHaveProperty(
        expect.stringMatching(/http_errors_total.*service=hubspot-connector.*environment=test.*version=1\.0\.0/)
      );
    });

    it("allows different configurations for logging and metrics", () => {
      const connector = createHubSpotConnector();
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];

      // Different configurations for each observability feature
      const logging = createLoggingHooks({
        level: "warn", // Only log warnings and errors
        includeQueryParams: false,
        includeHeaders: false,
        logger: (level, event) => {
          loggedEvents.push({ level, event });
        },
      });

      const { hooks: metricsHooks, sink } = createMetricsHooks(
        { enabled: true }, // Use default in-memory sink
        { service: "hubspot", team: "data-platform" }
      );

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          ...logging,
          ...metricsHooks,
        },
      };

      connector.initialize(config);

      // Simulate info-level events (should be filtered by logging but captured by metrics)
      const afterResponseHook = config.hooks?.afterResponse?.find(h => h.name === "metrics-after-response");
      const loggingHook = config.hooks?.afterResponse?.find(h => h.name === "log-after-response");

      const ctx = {
        type: "afterResponse" as const,
        operation: "list-deals",
        request: { method: "GET", url: "https://api.hubapi.com/deals" },
        response: {
          status: 200,
          data: { results: [] },
          meta: { durationMs: 300 },
        },
      };

      loggingHook?.execute(ctx);
      afterResponseHook?.execute(ctx);

      // Logging should be filtered (info level blocked by warn threshold)
      expect(loggedEvents).toHaveLength(0);

      // But metrics should still be captured
      const snapshot = (sink as InMemoryMetricsSink).getSnapshot();
      expect(Object.keys(snapshot.counters)).toHaveLength(1);
      expect(Object.keys(snapshot.observations)).toHaveLength(1);

      const counterKey = Object.keys(snapshot.counters)[0];
      expect(counterKey).toContain("service=hubspot");
      expect(counterKey).toContain("team=data-platform");
    });
  });

  describe("testing patterns", () => {
    it("demonstrates how to test observability in development", async () => {
      const connector = createHubSpotConnector();
      const testMetrics = {
        requestCount: 0,
        errorCount: 0,
        averageResponseTime: 0,
        operations: [] as string[],
      };

      // Create a test-friendly sink
      const testSink = {
        incrementCounter: (name: string, value: number = 1, labels?: Record<string, any>) => {
          if (name === "http_requests_total") {
            testMetrics.requestCount += value;
          }
          if (name === "http_errors_total") {
            testMetrics.errorCount += value;
          }
          if (labels?.operation && !testMetrics.operations.includes(labels.operation)) {
            testMetrics.operations.push(labels.operation);
          }
        },
        observe: (name: string, value: number, labels?: Record<string, any>) => {
          if (name === "http_request_duration_ms") {
            // Simple running average for testing
            const newTotal = testMetrics.averageResponseTime * (testMetrics.requestCount - 1) + value;
            testMetrics.averageResponseTime = newTotal / testMetrics.requestCount;
          }
        },
      };

      const { hooks: metricsHooks } = createMetricsHooks({ sink: testSink });
      const logging = createLoggingHooks({
        level: "debug",
        logger: (level, event) => {
          console.log(`[${level.toUpperCase()}] ${event.event}: ${event.operation}`);
        },
      });

      connector.initialize({
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          ...logging,
          ...metricsHooks,
        },
      });

      // Simulate a series of operations for testing
      const operations = [
        { op: "list-contacts", duration: 150, status: 200 },
        { op: "get-contact", duration: 80, status: 200 },
        { op: "create-contact", duration: 200, status: 201 },
        { op: "update-contact", duration: 120, error: true },
        { op: "list-contacts", duration: 100, status: 200 },
      ];

      const afterResponseHook = metricsHooks.afterResponse?.[0];
      const onErrorHook = metricsHooks.onError?.[0];

      for (const operation of operations) {
        if (operation.error) {
          onErrorHook?.execute({
            type: "onError",
            operation: operation.op,
            error: { message: "Update failed", code: "VALIDATION_ERROR" },
          });
        } else {
          afterResponseHook?.execute({
            type: "afterResponse",
            operation: operation.op,
            response: {
              status: operation.status,
              data: {},
              meta: { durationMs: operation.duration },
            },
          });
        }
      }

      // Verify test metrics
      expect(testMetrics.requestCount).toBe(4); // 4 successful requests
      expect(testMetrics.errorCount).toBe(1);   // 1 error
      expect(testMetrics.averageResponseTime).toBeCloseTo(137.5, 1); // (150+80+200+100)/4
      expect(testMetrics.operations).toEqual(expect.arrayContaining([
        "list-contacts", "get-contact", "create-contact", "update-contact"
      ]));
    });

    it("shows how to test with real sink inspection", () => {
      const connector = createHubSpotConnector();
      
      const { hooks: metricsHooks, sink } = createMetricsHooks(
        { sink: new InMemoryMetricsSink() },
        { service: "hubspot", environment: "test" }
      );

      connector.initialize({
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: { ...metricsHooks },
      });

      // In real tests, you would make actual HTTP calls through the connector
      // Here we simulate the hook execution
      const afterResponseHook = metricsHooks.afterResponse?.[0];

      // Simulate multiple requests with different outcomes
      const scenarios = [
        { operation: "contacts", status: 200, duration: 150 },
        { operation: "contacts", status: 200, duration: 120 },
        { operation: "companies", status: 404, duration: 50 },
        { operation: "deals", status: 200, duration: 200 },
      ];

      scenarios.forEach(scenario => {
        afterResponseHook?.execute({
          type: "afterResponse",
          operation: `list-${scenario.operation}`,
          response: {
            status: scenario.status,
            data: {},
            meta: { durationMs: scenario.duration },
          },
        });
      });

      // Later in tests/dev: sink.getSnapshot()
      const snapshot = (sink as InMemoryMetricsSink).getSnapshot();

      // Test specific metrics
      expect(snapshot.counters).toMatchObject(
        expect.objectContaining({
          "http_requests_total|environment=test,operation=list-contacts,service=hubspot,status=200,success=true": 2,
          "http_requests_total|environment=test,operation=list-companies,service=hubspot,status=404,success=false": 1,
          "http_requests_total|environment=test,operation=list-deals,service=hubspot,status=200,success=true": 1,
        })
      );

      // Test response time metrics
      const contactsResponseTime = snapshot.observations["http_request_duration_ms|environment=test,operation=list-contacts,service=hubspot,status=200,success=true"];
      expect(contactsResponseTime).toEqual({
        count: 2,
        sum: 270, // 150 + 120
        avg: 135,
      });
    });
  });
});
