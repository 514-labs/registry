// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect */
import { createMetricsHooks, InMemoryMetricsSink, createInMemoryMetricsSink } from "../../src/observability/metrics-hooks";
import type { HookContext, HookType } from "../../src/types/hooks";
import type { HttpResponseEnvelope } from "../../src/types/envelopes";
import type { MetricsLabels, MetricsSink } from "../../src/types/config";

describe("metrics hooks", () => {
  describe("InMemoryMetricsSink", () => {
    it("increments counters correctly", () => {
      const sink = new InMemoryMetricsSink();

      sink.incrementCounter("test_counter", 1, { operation: "test", status: "200" });
      sink.incrementCounter("test_counter", 2, { operation: "test", status: "200" });
      sink.incrementCounter("test_counter", 1, { operation: "test", status: "404" }); // Different labels

      const snapshot = sink.getSnapshot();
      
      expect(snapshot.counters["test_counter|operation=test,status=200"]).toBe(3);
      expect(snapshot.counters["test_counter|operation=test,status=404"]).toBe(1);
    });

    it("observes values and calculates averages", () => {
      const sink = new InMemoryMetricsSink();

      sink.observe("response_time", 100, { operation: "get_contacts" });
      sink.observe("response_time", 200, { operation: "get_contacts" });
      sink.observe("response_time", 150, { operation: "get_contacts" });

      const snapshot = sink.getSnapshot();
      const key = "response_time|operation=get_contacts";
      
      expect(snapshot.observations[key].count).toBe(3);
      expect(snapshot.observations[key].sum).toBe(450);
      expect(snapshot.observations[key].avg).toBe(150);
    });

    it("handles labels correctly", () => {
      const sink = new InMemoryMetricsSink();

      // Test with no labels
      sink.incrementCounter("no_labels");
      
      // Test with labels
      sink.incrementCounter("with_labels", 1, { operation: "test", status: 200 });
      
      // Test with undefined label values (should be filtered out)
      sink.incrementCounter("partial_labels", 1, { operation: "test", status: undefined });

      const snapshot = sink.getSnapshot();
      
      expect(snapshot.counters["no_labels|"]).toBe(1);
      expect(snapshot.counters["with_labels|operation=test,status=200"]).toBe(1);
      expect(snapshot.counters["partial_labels|operation=test"]).toBe(1);
    });

    it("sorts labels consistently", () => {
      const sink = new InMemoryMetricsSink();

      // Add the same metric with labels in different orders
      sink.incrementCounter("test", 1, { z: "last", a: "first", m: "middle" });
      sink.incrementCounter("test", 1, { a: "first", m: "middle", z: "last" });
      sink.incrementCounter("test", 1, { m: "middle", z: "last", a: "first" });

      const snapshot = sink.getSnapshot();
      const keys = Object.keys(snapshot.counters);
      
      // Should have only one key since labels should be sorted consistently
      expect(keys).toHaveLength(1);
      expect(keys[0]).toBe("test|a=first,m=middle,z=last");
      expect(snapshot.counters[keys[0]]).toBe(3);
    });
  });

  describe("createInMemoryMetricsSink", () => {
    it("creates an InMemoryMetricsSink instance", () => {
      const { sink } = createInMemoryMetricsSink();
      expect(sink).toBeInstanceOf(InMemoryMetricsSink);
    });
  });

  describe("createMetricsHooks", () => {
    it("creates hooks with default configuration", () => {
      const { hooks, sink } = createMetricsHooks();
      
      expect(hooks.afterResponse).toHaveLength(1);
      expect(hooks.onError).toHaveLength(1);
      expect(hooks.onRetry).toHaveLength(1);
      expect(sink).toBeInstanceOf(InMemoryMetricsSink);
      
      expect(hooks.afterResponse?.[0].name).toBe("metrics-after-response");
      expect(hooks.onError?.[0].name).toBe("metrics-on-error");
      expect(hooks.onRetry?.[0].name).toBe("metrics-on-retry");
    });

    it("uses provided sink when specified", () => {
      const customSink: MetricsSink = {
        incrementCounter: jest.fn(),
        observe: jest.fn(),
      };

      const { hooks, sink } = createMetricsHooks({ sink: customSink });
      
      expect(sink).toBe(customSink);
    });

    it("can be disabled via configuration", () => {
      const { hooks } = createMetricsHooks({ enabled: false });
      
      expect(hooks.afterResponse).toBeUndefined();
      expect(hooks.onError).toBeUndefined();
      expect(hooks.onRetry).toBeUndefined();
    });

    it("records successful requests", () => {
      const { hooks, sink } = createMetricsHooks();
      const inMemorySink = sink as InMemoryMetricsSink;

      const successCtx: HookContext = {
        type: "afterResponse" as HookType,
        operation: "list-contacts",
        response: {
          status: 200,
          data: { results: [] },
          meta: {
            durationMs: 250,
            retryCount: 0,
          },
        } as HttpResponseEnvelope<unknown>,
      };

      hooks.afterResponse?.[0].execute(successCtx);
      
      const snapshot = inMemorySink.getSnapshot();
      expect(snapshot.counters["http_requests_total|operation=list-contacts,status=200,success=true"]).toBe(1);
      expect(snapshot.observations["http_request_duration_ms|operation=list-contacts,status=200,success=true"]).toEqual({
        count: 1,
        sum: 250,
        avg: 250,
      });
    });

    it("records failed requests", () => {
      const { hooks, sink } = createMetricsHooks();
      const inMemorySink = sink as InMemoryMetricsSink;

      const errorCtx: HookContext = {
        type: "afterResponse" as HookType,
        operation: "get-contact",
        response: {
          status: 404,
          data: { error: "Not found" },
          meta: {
            durationMs: 100,
            retryCount: 2,
          },
        } as HttpResponseEnvelope<unknown>,
      };

      hooks.afterResponse?.[0].execute(errorCtx);
      
      const snapshot = inMemorySink.getSnapshot();
      expect(snapshot.counters["http_requests_total|operation=get-contact,status=404,success=false"]).toBe(1);
      expect(snapshot.observations["http_request_duration_ms|operation=get-contact,status=404,success=false"]).toEqual({
        count: 1,
        sum: 100,
        avg: 100,
      });
    });

    it("records errors", () => {
      const { hooks, sink } = createMetricsHooks();
      const inMemorySink = sink as InMemoryMetricsSink;

      const errorCtx: HookContext = {
        type: "onError" as HookType,
        operation: "create-contact",
        error: {
          message: "Network error",
          code: "NETWORK_ERROR",
          source: "http-client",
        },
      };

      hooks.onError?.[0].execute(errorCtx);
      
      const snapshot = inMemorySink.getSnapshot();
      expect(snapshot.counters["http_errors_total|code=NETWORK_ERROR,operation=create-contact,source=http-client"]).toBe(1);
    });

    it("records retries", () => {
      const { hooks, sink } = createMetricsHooks();
      const inMemorySink = sink as InMemoryMetricsSink;

      const retryCtx: HookContext = {
        type: "onRetry" as HookType,
        operation: "update-contact",
        metadata: {
          operation: "retry-operation",
          attempt: 2,
        },
      };

      hooks.onRetry?.[0].execute(retryCtx);
      
      const snapshot = inMemorySink.getSnapshot();
      expect(snapshot.counters["http_retries_total|operation=retry-operation"]).toBe(1);
    });

    it("applies static labels to all metrics", () => {
      const staticLabels: MetricsLabels = {
        service: "hubspot",
        environment: "test",
      };

      const { hooks, sink } = createMetricsHooks({}, staticLabels);
      const inMemorySink = sink as InMemoryMetricsSink;

      const successCtx: HookContext = {
        type: "afterResponse" as HookType,
        operation: "list-contacts",
        response: {
          status: 200,
          data: {},
          meta: { durationMs: 100 },
        } as HttpResponseEnvelope<unknown>,
      };

      hooks.afterResponse?.[0].execute(successCtx);
      
      const snapshot = inMemorySink.getSnapshot();
      const keys = Object.keys(snapshot.counters);
      
      expect(keys[0]).toContain("environment=test");
      expect(keys[0]).toContain("service=hubspot");
      expect(keys[0]).toContain("operation=list-contacts");
    });

    it("handles missing response data gracefully", () => {
      const { hooks, sink } = createMetricsHooks();
      const inMemorySink = sink as InMemoryMetricsSink;

      const incompleteCtx: HookContext = {
        type: "afterResponse" as HookType,
        operation: "test",
        // response is missing
      };

      // Should not throw
      expect(() => hooks.afterResponse?.[0].execute(incompleteCtx)).not.toThrow();
      
      // Should not record any metrics
      const snapshot = inMemorySink.getSnapshot();
      expect(Object.keys(snapshot.counters)).toHaveLength(0);
      expect(Object.keys(snapshot.observations)).toHaveLength(0);
    });

    it("handles non-numeric duration values", () => {
      const { hooks, sink } = createMetricsHooks();
      const inMemorySink = sink as InMemoryMetricsSink;

      const badDurationCtx: HookContext = {
        type: "afterResponse" as HookType,
        operation: "test",
        response: {
          status: 200,
          data: {},
          meta: {
            durationMs: "invalid" as any, // Invalid duration
          },
        } as HttpResponseEnvelope<unknown>,
      };

      hooks.afterResponse?.[0].execute(badDurationCtx);
      
      const snapshot = inMemorySink.getSnapshot();
      
      // Should still record the counter
      expect(snapshot.counters["http_requests_total|operation=test,status=200,success=true"]).toBe(1);
      
      // Should not record duration observation
      expect(Object.keys(snapshot.observations)).toHaveLength(0);
    });

    it("uses metadata operation when available for retries", () => {
      const { hooks, sink } = createMetricsHooks();
      const inMemorySink = sink as InMemoryMetricsSink;

      const retryWithMetadataCtx: HookContext = {
        type: "onRetry" as HookType,
        operation: "fallback-operation",
        metadata: {
          operation: "metadata-operation",
          attempt: 3,
        },
      };

      hooks.onRetry?.[0].execute(retryWithMetadataCtx);
      
      const snapshot = inMemorySink.getSnapshot();
      expect(snapshot.counters["http_retries_total|operation=metadata-operation"]).toBe(1);

      // Test without metadata
      const retryWithoutMetadataCtx: HookContext = {
        type: "onRetry" as HookType,
        operation: "fallback-operation",
        // no metadata
      };

      hooks.onRetry?.[0].execute(retryWithoutMetadataCtx);
      
      // Get updated snapshot since we executed another hook
      const updatedSnapshot = (sink as InMemoryMetricsSink).getSnapshot();
      expect(updatedSnapshot.counters["http_retries_total|operation=fallback-operation"]).toBe(1);
    });
  });
});
