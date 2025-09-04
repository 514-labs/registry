/**
 * Integration test for observability features in the HubSpot to ClickHouse pipeline
 * 
 * This test demonstrates how the observability features work within the context
 * of this Moose project, showing how they can be used to monitor and debug
 * the data pipeline from HubSpot to ClickHouse.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { createHubSpotConnector, createLoggingHooks, createMetricsHooks, InMemoryMetricsSink } from "../app/hubspot/src";
import type { ConnectorConfig } from "../app/hubspot/src/types/config";

describe("HubSpot Observability Integration", () => {
  describe("pipeline monitoring setup", () => {
    it("demonstrates observability setup for data pipeline", () => {
      const connector = createHubSpotConnector();
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      
      // Pipeline-specific logger that formats events for data monitoring
      const pipelineLogger = (level: string, event: Record<string, unknown>) => {
        const pipelineEvent = {
          timestamp: new Date().toISOString(),
          pipeline: "hubspot-to-clickhouse",
          phase: event.phase,
          operation: event.operation,
          level: level.toUpperCase(),
          ...event,
        };
        
        loggedEvents.push({ level, event: pipelineEvent });
      };

      // Metrics for monitoring pipeline health
      const { hooks: metricsHooks, sink } = createMetricsHooks(
        { sink: new InMemoryMetricsSink() },
        {
          pipeline: "hubspot-to-clickhouse",
          service: "data-ingestion",
          environment: "test",
        }
      );

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        enableLogging: {
          level: "info",
          includeQueryParams: false, // Don't log PII in data pipelines
          logger: pipelineLogger,
        },
        enableMetrics: true,
      };

      connector.initialize(config);

      // Verify observability hooks were configured
      expect((config as any).hooks?.beforeRequest).toBeDefined();
      expect((config as any).hooks?.afterResponse).toBeDefined();
      expect((config as any).hooks?.onError).toBeDefined();

      // Simulate pipeline operations
      const beforeRequestHook = (config as any).hooks.beforeRequest[0];
      const afterResponseHook = (config as any).hooks.afterResponse.find((h: any) => h.name === "log-after-response");

      beforeRequestHook.execute({
        type: "beforeRequest",
        operation: "extract-contacts",
        request: {
          method: "GET",
          url: "https://api.hubapi.com/crm/v3/objects/contacts",
        },
      });

      afterResponseHook.execute({
        type: "afterResponse", 
        operation: "extract-contacts",
        request: {
          method: "GET",
          url: "https://api.hubapi.com/crm/v3/objects/contacts",
        },
        response: {
          status: 200,
          data: { results: [{ id: "1" }, { id: "2" }, { id: "3" }] },
          meta: { durationMs: 250, retryCount: 0 },
        },
      });

      // Verify pipeline-specific logging
      expect(loggedEvents).toHaveLength(2);
      
      const requestLog = loggedEvents[0].event;
      expect(requestLog.pipeline).toBe("hubspot-to-clickhouse");
      expect(requestLog.operation).toBe("extract-contacts");
      expect(requestLog.phase).toBe("beforeRequest");

      const responseLog = loggedEvents[1].event;
      expect(responseLog.pipeline).toBe("hubspot-to-clickhouse");
      expect(responseLog.operation).toBe("extract-contacts");
      expect(responseLog.phase).toBe("afterResponse");
      expect(responseLog.itemCount).toBe(3);
      expect(responseLog.durationMs).toBe(250);
    });

    it("shows error tracking for pipeline failures", () => {
      const connector = createHubSpotConnector();
      const errors: Array<{ level: string; event: Record<string, unknown> }> = [];
      
      const errorLogger = (level: string, event: Record<string, unknown>) => {
        if (level === "error") {
          errors.push({ level, event });
        }
      };

      const { hooks: metricsHooks, sink } = createMetricsHooks(
        { sink: new InMemoryMetricsSink() },
        { pipeline: "hubspot-to-clickhouse" }
      );

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          ...createLoggingHooks({ level: "error", logger: errorLogger }),
          ...metricsHooks,
        },
      };

      connector.initialize(config);

      // Simulate a pipeline error
      const onErrorHook = config.hooks?.onError?.find(h => h.name === "log-on-error");
      const metricsErrorHook = config.hooks?.onError?.find(h => h.name === "metrics-on-error");

      const errorContext = {
        type: "onError" as const,
        operation: "extract-companies",
        error: {
          message: "Rate limit exceeded",
          code: "RATE_LIMITED",
          statusCode: 429,
          source: "hubspot-api",
        },
      };

      onErrorHook?.execute(errorContext);
      metricsErrorHook?.execute(errorContext);

      // Verify error logging
      expect(errors).toHaveLength(1);
      expect(errors[0].event.operation).toBe("extract-companies");
      expect(errors[0].event.code).toBe("RATE_LIMITED");

      // Verify error metrics
      const snapshot = (sink as InMemoryMetricsSink).getSnapshot();
      expect(snapshot.counters["http_errors_total|code=RATE_LIMITED,operation=extract-companies,pipeline=hubspot-to-clickhouse,source=hubspot-api"]).toBe(1);
    });
  });

  describe("data quality monitoring", () => {
    it("tracks data extraction metrics for quality monitoring", () => {
      const connector = createHubSpotConnector();
      const qualityMetrics = {
        totalRecords: 0,
        emptyResponses: 0,
        avgResponseTime: 0,
        operationCounts: {} as Record<string, number>,
      };

      // Custom hook for data quality tracking
      const dataQualityHook = {
        name: "data-quality-tracking",
        priority: 200,
        execute: (ctx: any) => {
          if (ctx.type === "afterResponse" && ctx.response) {
            const operation = ctx.operation;
            const data = ctx.response.data;
            const duration = ctx.response.meta?.durationMs || 0;

            // Track operation counts
            qualityMetrics.operationCounts[operation] = (qualityMetrics.operationCounts[operation] || 0) + 1;

            // Track record counts
            let recordCount = 0;
            if (Array.isArray(data?.results)) {
              recordCount = data.results.length;
            } else if (Array.isArray(data)) {
              recordCount = data.length;
            }

            qualityMetrics.totalRecords += recordCount;
            
            if (recordCount === 0) {
              qualityMetrics.emptyResponses++;
            }

            // Track response times
            const currentCount = Object.values(qualityMetrics.operationCounts).reduce((sum, count) => sum + count, 0);
            qualityMetrics.avgResponseTime = ((qualityMetrics.avgResponseTime * (currentCount - 1)) + duration) / currentCount;
          }
        },
      };

      const { hooks: metricsHooks, sink } = createMetricsHooks(
        { sink: new InMemoryMetricsSink() },
        { dataSource: "hubspot", destination: "clickhouse" }
      );

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          afterResponse: [dataQualityHook],
          ...metricsHooks,
        },
      };

      connector.initialize(config);

      // Simulate data extraction operations
      const operations = [
        { operation: "extract-contacts", records: 150, duration: 200 },
        { operation: "extract-companies", records: 75, duration: 150 },
        { operation: "extract-deals", records: 0, duration: 50 }, // Empty response
        { operation: "extract-contacts", records: 200, duration: 300 },
      ];

      operations.forEach(op => {
        const hooks = config.hooks?.afterResponse || [];
        hooks.forEach(hook => {
          hook.execute({
            type: "afterResponse",
            operation: op.operation,
            response: {
              status: 200,
              data: { results: new Array(op.records).fill({}).map((_, i) => ({ id: i })) },
              meta: { durationMs: op.duration },
            },
          });
        });
      });

      // Verify data quality metrics
      expect(qualityMetrics.totalRecords).toBe(425); // 150 + 75 + 0 + 200
      expect(qualityMetrics.emptyResponses).toBe(1);  // The deals extraction
      expect(qualityMetrics.operationCounts).toEqual({
        "extract-contacts": 2,
        "extract-companies": 1,
        "extract-deals": 1,
      });
      expect(qualityMetrics.avgResponseTime).toBe(175); // (200 + 150 + 50 + 300) / 4

      // Verify observability metrics also captured the data
      const snapshot = (sink as InMemoryMetricsSink).getSnapshot();
      const requestCountKeys = Object.keys(snapshot.counters).filter(k => k.includes("http_requests_total"));
      expect(requestCountKeys).toHaveLength(3); // One for each unique operation
    });
  });

  describe("performance monitoring", () => {
    it("monitors API performance for pipeline optimization", () => {
      const connector = createHubSpotConnector();
      const performanceData = {
        slowRequests: [] as Array<{ operation: string; duration: number }>,
        fastRequests: [] as Array<{ operation: string; duration: number }>,
        threshold: 1000, // 1 second threshold
      };

      // Performance monitoring hook
      const performanceHook = {
        name: "performance-monitor",
        priority: 100,
        execute: (ctx: any) => {
          if (ctx.type === "afterResponse" && ctx.response) {
            const duration = ctx.response.meta?.durationMs || 0;
            const operation = ctx.operation;

            if (duration > performanceData.threshold) {
              performanceData.slowRequests.push({ operation, duration });
            } else {
              performanceData.fastRequests.push({ operation, duration });
            }
          }
        },
      };

      const { hooks: metricsHooks, sink } = createMetricsHooks();

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          afterResponse: [performanceHook],
          ...metricsHooks,
        },
      };

      connector.initialize(config);

      // Simulate various performance scenarios
      const scenarios = [
        { operation: "list-contacts", duration: 250 },    // Fast
        { operation: "list-companies", duration: 1500 },  // Slow
        { operation: "get-contact", duration: 100 },      // Fast  
        { operation: "list-deals", duration: 2000 },      // Slow
        { operation: "get-company", duration: 150 },      // Fast
      ];

      scenarios.forEach(scenario => {
        const hooks = config.hooks?.afterResponse || [];
        hooks.forEach(hook => {
          hook.execute({
            type: "afterResponse",
            operation: scenario.operation,
            response: {
              status: 200,
              data: {},
              meta: { durationMs: scenario.duration },
            },
          });
        });
      });

      // Verify performance tracking
      expect(performanceData.slowRequests).toHaveLength(2);
      expect(performanceData.fastRequests).toHaveLength(3);
      
      expect(performanceData.slowRequests).toEqual(expect.arrayContaining([
        { operation: "list-companies", duration: 1500 },
        { operation: "list-deals", duration: 2000 },
      ]));

      // Verify observability captured duration metrics
      const snapshot = (sink as InMemoryMetricsSink).getSnapshot();
      const durationKeys = Object.keys(snapshot.observations).filter(k => k.includes("http_request_duration_ms"));
      expect(durationKeys.length).toBeGreaterThan(0);
    });
  });

  describe("testing patterns", () => {
    it("shows how to test pipeline observability in CI/CD", async () => {
      // This pattern would be useful in your CI/CD pipeline
      const connector = createHubSpotConnector();
      const testResults = {
        requestsCompleted: 0,
        errorsEncountered: 0,
        averageResponseTime: 0,
        coverage: {
          contacts: false,
          companies: false,
          deals: false,
        },
      };

      // Test observability sink
      const testSink = {
        incrementCounter: (name: string, value: number = 1, labels?: Record<string, any>) => {
          if (name === "http_requests_total" && labels?.success === true) {
            testResults.requestsCompleted += value;
          }
          if (name === "http_errors_total") {
            testResults.errorsEncountered += value;
          }

          // Track API coverage
          if (labels?.operation?.includes("contacts")) testResults.coverage.contacts = true;
          if (labels?.operation?.includes("companies")) testResults.coverage.companies = true;
          if (labels?.operation?.includes("deals")) testResults.coverage.deals = true;
        },
        
        observe: (name: string, value: number) => {
          if (name === "http_request_duration_ms") {
            const count = testResults.requestsCompleted + 1;
            testResults.averageResponseTime = ((testResults.averageResponseTime * testResults.requestsCompleted) + value) / count;
          }
        },
      };

      const { hooks: metricsHooks } = createMetricsHooks({ sink: testSink });

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: { ...metricsHooks },
      };

      connector.initialize(config);

      // Simulate pipeline test runs
      const testOperations = [
        { op: "extract-contacts", duration: 200, success: true },
        { op: "extract-companies", duration: 150, success: true },
        { op: "extract-deals", duration: 300, success: false }, // Simulate error
      ];

      for (const operation of testOperations) {
        if (operation.success) {
          const hook = config.hooks?.afterResponse?.[0];
          hook?.execute({
            type: "afterResponse",
            operation: operation.op,
            response: {
              status: 200,
              data: { results: [] },
              meta: { durationMs: operation.duration },
            },
          });
        } else {
          const hook = config.hooks?.onError?.[0];
          hook?.execute({
            type: "onError",
            operation: operation.op,
            error: { message: "Test error", code: "TEST_ERROR" },
          });
        }
      }

      // Assert test results (what you'd check in CI/CD)
      expect(testResults.requestsCompleted).toBe(2);
      expect(testResults.errorsEncountered).toBe(1);
      expect(testResults.averageResponseTime).toBe(175); // (200 + 150) / 2
      expect(testResults.coverage.contacts).toBe(true);
      expect(testResults.coverage.companies).toBe(true);
      expect(testResults.coverage.deals).toBe(false); // Failed, so not counted as successful coverage
    });
  });
});
