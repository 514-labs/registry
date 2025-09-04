/* eslint-env jest */
import { createLoggingHooks } from "../../src/observability/logging-hooks";
import type { HookContext, HookType } from "../../src/types/hooks";
import type { HttpResponseEnvelope } from "../../src/types/envelopes";

describe("logging hooks", () => {
  describe("createLoggingHooks", () => {
    it("creates hooks with default configuration", () => {
      const hooks = createLoggingHooks();
      
      expect(hooks.beforeRequest).toHaveLength(1);
      expect(hooks.afterResponse).toHaveLength(1);
      expect(hooks.onError).toHaveLength(1);
      expect(hooks.onRetry).toHaveLength(1);
      
      expect(hooks.beforeRequest?.[0].name).toBe("log-before-request");
      expect(hooks.afterResponse?.[0].name).toBe("log-after-response");
      expect(hooks.onError?.[0].name).toBe("log-on-error");
      expect(hooks.onRetry?.[0].name).toBe("log-on-retry");
    });

    it("respects log level filtering", () => {
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      const hooks = createLoggingHooks({
        level: "warn",
        logger: mockLogger,
      });

      // beforeRequest and afterResponse use "info" level - should be filtered out
      const beforeRequestCtx: HookContext = {
        type: "beforeRequest" as HookType,
        operation: "test-operation",
        request: {
          method: "GET",
          url: "https://api.example.com/test",
          headers: { "User-Agent": "test" },
        },
      };

      hooks.beforeRequest?.[0].execute(beforeRequestCtx);
      expect(loggedEvents).toHaveLength(0); // Filtered out due to level

      // onError uses "error" level - should pass through
      const errorCtx: HookContext = {
        type: "onError" as HookType,
        operation: "test-operation",
        error: { message: "Test error", code: "TEST_ERROR" },
      };

      hooks.onError?.[0].execute(errorCtx);
      expect(loggedEvents).toHaveLength(1);
      expect(loggedEvents[0].level).toBe("error");
      expect(loggedEvents[0].event.event).toBe("http_error");
    });

    it("includes or excludes PII based on configuration", () => {
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      // Test with PII excluded (default)
      const hooksNoPII = createLoggingHooks({ logger: mockLogger });
      
      const requestWithPII: HookContext = {
        type: "beforeRequest" as HookType,
        operation: "test-operation",
        request: {
          method: "POST",
          url: "https://api.example.com/contacts?email=user@example.com&api_key=secret",
          headers: { "Authorization": "Bearer secret-token" },
          body: { sensitive: "data" },
        },
      };

      hooksNoPII.beforeRequest?.[0].execute(requestWithPII);
      const noPIIEvent = loggedEvents[0].event;
      
      expect(noPIIEvent.url).toBe("https://api.example.com/contacts"); // Query stripped
      expect(noPIIEvent.query).toBeUndefined();
      expect(noPIIEvent.headers).toBeUndefined();
      expect(noPIIEvent.body).toBeUndefined();

      // Test with PII included
      loggedEvents.length = 0;
      const hooksWithPII = createLoggingHooks({
        logger: mockLogger,
        includeQueryParams: true,
        includeHeaders: true,
        includeBody: true,
      });

      hooksWithPII.beforeRequest?.[0].execute(requestWithPII);
      const withPIIEvent = loggedEvents[0].event;
      
      expect(withPIIEvent.url).toBe("https://api.example.com/contacts?email=user@example.com&api_key=secret");
      expect(withPIIEvent.query).toEqual({ email: "user@example.com", api_key: "secret" });
      expect(withPIIEvent.headers).toEqual({ "Authorization": "Bearer secret-token" });
      expect(withPIIEvent.body).toEqual({ sensitive: "data" });
    });

    it("logs response with item count and metadata", () => {
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      const hooks = createLoggingHooks({ logger: mockLogger });

      const responseCtx: HookContext = {
        type: "afterResponse" as HookType,
        operation: "list-contacts",
        request: {
          method: "GET",
          url: "https://api.example.com/contacts",
        },
        response: {
          status: 200,
          data: {
            results: [
              { id: "1", email: "user1@example.com" },
              { id: "2", email: "user2@example.com" },
            ],
          },
          meta: {
            durationMs: 245,
            retryCount: 0,
            requestId: "req-123",
          },
        } as HttpResponseEnvelope<unknown>,
      };

      hooks.afterResponse?.[0].execute(responseCtx);
      const event = loggedEvents[0].event;

      expect(event.event).toBe("http_response");
      expect(event.operation).toBe("list-contacts");
      expect(event.status).toBe(200);
      expect(event.durationMs).toBe(245);
      expect(event.retryCount).toBe(0);
      expect(event.requestId).toBe("req-123");
      expect(event.itemCount).toBe(2); // Should count items in results array
    });

    it("handles different response data structures for item counting", () => {
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      const hooks = createLoggingHooks({ logger: mockLogger });

      // Test with "items" array
      const itemsResponseCtx: HookContext = {
        type: "afterResponse" as HookType,
        operation: "test",
        request: { method: "GET", url: "https://api.example.com/test" },
        response: {
          status: 200,
          data: { items: [{ id: "1" }, { id: "2" }, { id: "3" }] },
          meta: {},
        } as HttpResponseEnvelope<unknown>,
      };

      hooks.afterResponse?.[0].execute(itemsResponseCtx);
      expect(loggedEvents[0].event.itemCount).toBe(3);

      // Test with direct array
      loggedEvents.length = 0;
      const arrayResponseCtx: HookContext = {
        type: "afterResponse" as HookType,
        operation: "test",
        request: { method: "GET", url: "https://api.example.com/test" },
        response: {
          status: 200,
          data: [{ id: "1" }, { id: "2" }],
          meta: {},
        } as HttpResponseEnvelope<unknown>,
      };

      hooks.afterResponse?.[0].execute(arrayResponseCtx);
      expect(loggedEvents[0].event.itemCount).toBe(2);

      // Test with no countable items
      loggedEvents.length = 0;
      const singleResponseCtx: HookContext = {
        type: "afterResponse" as HookType,
        operation: "test",
        request: { method: "GET", url: "https://api.example.com/test" },
        response: {
          status: 200,
          data: { id: "1", name: "single item" },
          meta: {},
        } as HttpResponseEnvelope<unknown>,
      };

      hooks.afterResponse?.[0].execute(singleResponseCtx);
      expect(loggedEvents[0].event.itemCount).toBeUndefined();
    });

    it("gracefully handles malformed requests/responses", () => {
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      const hooks = createLoggingHooks({ logger: mockLogger });

      // Test with invalid URL - the hook swallows errors in try-catch, so no log is generated
      const malformedCtx: HookContext = {
        type: "beforeRequest" as HookType,
        operation: "test",
        request: {
          method: "GET",
          url: "not-a-valid-url",
        },
      };

      // Should not throw but also doesn't log due to URL parsing error being swallowed
      expect(() => hooks.beforeRequest?.[0].execute(malformedCtx)).not.toThrow();
      expect(loggedEvents).toHaveLength(0); // No log due to try-catch swallowing URL parsing error

      // Test with missing request
      const missingRequestCtx: HookContext = {
        type: "beforeRequest" as HookType,
        operation: "test",
        // request is missing
      };

      hooks.beforeRequest?.[0].execute(missingRequestCtx);
      expect(loggedEvents).toHaveLength(0); // Should skip logging when request is missing

      // Test with valid URL to ensure logging still works
      const validCtx: HookContext = {
        type: "beforeRequest" as HookType,
        operation: "test",
        request: {
          method: "GET",
          url: "https://api.example.com/test",
        },
      };

      hooks.beforeRequest?.[0].execute(validCtx);
      expect(loggedEvents).toHaveLength(1);
      expect(loggedEvents[0].event.url).toBe("https://api.example.com/test");
    });

    it("logs retry events with attempt information", () => {
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      const hooks = createLoggingHooks({ 
        level: "debug", // onRetry uses debug level
        logger: mockLogger 
      });

      const retryCtx: HookContext = {
        type: "onRetry" as HookType,
        operation: "test-operation",
        metadata: {
          operation: "override-operation",
          attempt: 2,
        },
      };

      hooks.onRetry?.[0].execute(retryCtx);
      const event = loggedEvents[0].event;

      expect(event.event).toBe("http_retry");
      expect(event.operation).toBe("override-operation"); // Should use metadata operation if available
      expect(event.attempt).toBe(2);
    });

    it("uses fallback operation when metadata is missing", () => {
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      const hooks = createLoggingHooks({ 
        level: "debug",
        logger: mockLogger 
      });

      const retryCtx: HookContext = {
        type: "onRetry" as HookType,
        operation: "fallback-operation",
        // no metadata
      };

      hooks.onRetry?.[0].execute(retryCtx);
      const event = loggedEvents[0].event;

      expect(event.operation).toBe("fallback-operation");
    });
  });
});
