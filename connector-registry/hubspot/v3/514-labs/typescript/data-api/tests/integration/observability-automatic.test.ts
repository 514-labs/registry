/* eslint-env jest */
import { createHubSpotConnector } from "../../src";
import type { ConnectorConfig } from "../../src/types/config";

// Integration tests for automatic observability configuration
// These tests demonstrate the "quick start" approach using enableLogging and enableMetrics flags

describe("automatic observability configuration", () => {
  describe("enableLogging flag", () => {
    it("enables logging with default configuration", () => {
      const connector = createHubSpotConnector();
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        enableLogging: { level: "info", logger: mockLogger },
      };

      connector.initialize(config);

      // Make a mock request to trigger logging
      const mockRequest = async () => {
        // Simulate a request/response cycle by directly calling the hooks
        // In real usage, this would happen automatically through the HTTP client
        const beforeRequestHook = (config as any).hooks?.beforeRequest?.[0];
        const afterResponseHook = (config as any).hooks?.afterResponse?.[0];

        if (beforeRequestHook) {
          beforeRequestHook.execute({
            type: "beforeRequest",
            operation: "test-operation",
            request: {
              method: "GET",
              url: "https://api.hubapi.com/crm/v3/objects/contacts",
            },
          });
        }

        if (afterResponseHook) {
          afterResponseHook.execute({
            type: "afterResponse",
            operation: "test-operation",
            request: {
              method: "GET",
              url: "https://api.hubapi.com/crm/v3/objects/contacts",
            },
            response: {
              status: 200,
              data: { results: [{ id: "1" }, { id: "2" }] },
              meta: { durationMs: 150, retryCount: 0 },
            },
          });
        }
      };

      return mockRequest().then(() => {
        expect(loggedEvents).toHaveLength(2);
        
        // Check beforeRequest log
        expect(loggedEvents[0].level).toBe("info");
        expect(loggedEvents[0].event.event).toBe("http_request");
        expect(loggedEvents[0].event.operation).toBe("test-operation");
        expect(loggedEvents[0].event.method).toBe("GET");
        expect(loggedEvents[0].event.url).toBe("https://api.hubapi.com/crm/v3/objects/contacts");
        
        // Check afterResponse log
        expect(loggedEvents[1].level).toBe("info");
        expect(loggedEvents[1].event.event).toBe("http_response");
        expect(loggedEvents[1].event.operation).toBe("test-operation");
        expect(loggedEvents[1].event.status).toBe(200);
        expect(loggedEvents[1].event.durationMs).toBe(150);
        expect(loggedEvents[1].event.itemCount).toBe(2);
      });
    });

    it("enables logging with boolean flag (uses defaults)", () => {
      const connector = createHubSpotConnector();
      const consoleLogs: string[] = [];
      
      // Mock console.info to capture logs
      const originalConsoleInfo = console.info;
      console.info = (message: string) => {
        consoleLogs.push(message);
      };

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        enableLogging: true, // Boolean flag should use defaults
      };

      try {
        connector.initialize(config);

        // Verify that hooks were added
        expect((config as any).hooks?.beforeRequest).toBeDefined();
        expect((config as any).hooks?.afterResponse).toBeDefined();
        expect((config as any).hooks?.onError).toBeDefined();
        expect((config as any).hooks?.onRetry).toBeDefined();

        expect((config as any).hooks.beforeRequest).toHaveLength(1);
        expect((config as any).hooks.beforeRequest[0].name).toBe("log-before-request");

      } finally {
        console.info = originalConsoleInfo;
      }
    });

    it("allows PII configuration through flags", () => {
      const connector = createHubSpotConnector();
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        enableLogging: {
          level: "info",
          includeQueryParams: true,
          includeHeaders: true,
          includeBody: true,
          logger: mockLogger,
        },
      };

      connector.initialize(config);

      // Simulate request with PII
      const beforeRequestHook = (config as any).hooks?.beforeRequest?.[0];
      beforeRequestHook?.execute({
        type: "beforeRequest",
        operation: "test-operation",
        request: {
          method: "POST",
          url: "https://api.hubapi.com/crm/v3/objects/contacts?email=user@example.com",
          headers: { "Authorization": "Bearer secret-token" },
          body: { email: "user@example.com", name: "John Doe" },
        },
      });

      const event = loggedEvents[0].event;
      expect(event.url).toContain("email=user@example.com");
      expect(event.query).toEqual({ email: "user@example.com" });
      expect(event.headers).toEqual({ "Authorization": "Bearer secret-token" });
      expect(event.body).toEqual({ email: "user@example.com", name: "John Doe" });
    });
  });

  describe("enableMetrics flag", () => {
    it("enables metrics with default configuration", async () => {
      const connector = createHubSpotConnector();

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        enableMetrics: true,
      };

      connector.initialize(config);

      // Verify that metric hooks were added
      expect((config as any).hooks?.afterResponse).toBeDefined();
      expect((config as any).hooks?.onError).toBeDefined();
      expect((config as any).hooks?.onRetry).toBeDefined();

      expect((config as any).hooks.afterResponse).toHaveLength(1);
      expect((config as any).hooks.afterResponse[0].name).toBe("metrics-after-response");

      expect((config as any).hooks.onError).toHaveLength(1);
      expect((config as any).hooks.onError[0].name).toBe("metrics-on-error");

      expect((config as any).hooks.onRetry).toHaveLength(1);
      expect((config as any).hooks.onRetry[0].name).toBe("metrics-on-retry");
    });

    it("allows metrics configuration through object flag", () => {
      const connector = createHubSpotConnector();
      
      // Create a custom sink for testing
      const customCounters = new Map<string, number>();
      const customObservations = new Map<string, { count: number; sum: number }>();
      
      const customSink = {
        incrementCounter: (name: string, value: number = 1, labels?: Record<string, any>) => {
          const key = `${name}:${JSON.stringify(labels || {})}`;
          customCounters.set(key, (customCounters.get(key) || 0) + value);
        },
        observe: (name: string, value: number, labels?: Record<string, any>) => {
          const key = `${name}:${JSON.stringify(labels || {})}`;
          const existing = customObservations.get(key) || { count: 0, sum: 0 };
          existing.count += 1;
          existing.sum += value;
          customObservations.set(key, existing);
        },
      };

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        enableMetrics: {
          enabled: true,
          sink: customSink,
        },
      };

      connector.initialize(config);

      // Simulate a response to trigger metrics
      const afterResponseHook = (config as any).hooks?.afterResponse?.[0];
      afterResponseHook?.execute({
        type: "afterResponse",
        operation: "list-contacts",
        response: {
          status: 200,
          data: { results: [{ id: "1" }] },
          meta: { durationMs: 100 },
        },
      });

      // Verify custom sink was used
      expect(customCounters.size).toBe(1);
      expect(customObservations.size).toBe(1);
      
      const counterKey = Array.from(customCounters.keys())[0];
      expect(counterKey).toContain("http_requests_total");
      expect(customCounters.get(counterKey)).toBe(1);
    });
  });

  describe("combined logging and metrics", () => {
    it("enables both logging and metrics together", () => {
      const connector = createHubSpotConnector();
      const loggedEvents: Array<{ level: string; event: Record<string, unknown> }> = [];
      
      const mockLogger = (level: string, event: Record<string, unknown>) => {
        loggedEvents.push({ level, event });
      };

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        enableLogging: { level: "info", logger: mockLogger },
        enableMetrics: true,
      };

      connector.initialize(config);

      // Should have both logging and metrics hooks
      expect((config as any).hooks?.beforeRequest).toHaveLength(1); // Only logging
      expect((config as any).hooks?.afterResponse).toHaveLength(2); // Both logging and metrics
      expect((config as any).hooks?.onError).toHaveLength(2); // Both logging and metrics
      expect((config as any).hooks?.onRetry).toHaveLength(2); // Both logging and metrics

      // Verify hook names
      const afterResponseHooks = (config as any).hooks.afterResponse;
      const hookNames = afterResponseHooks.map((h: any) => h.name);
      expect(hookNames).toContain("log-after-response");
      expect(hookNames).toContain("metrics-after-response");
    });

    it("maintains hook execution order (priority-based)", () => {
      const connector = createHubSpotConnector();

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        enableLogging: true,
        enableMetrics: true,
      };

      connector.initialize(config);

      // All built-in observability hooks should have priority 1000
      const afterResponseHooks = (config as any).hooks.afterResponse;
      for (const hook of afterResponseHooks) {
        expect(hook.priority).toBe(1000);
      }
    });

    it("works with existing custom hooks", () => {
      const connector = createHubSpotConnector();
      
      const customHook = {
        name: "custom-transform",
        priority: 500, // Lower priority than observability hooks
        execute: jest.fn(),
      };

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        hooks: {
          afterResponse: [customHook],
        },
        enableLogging: true,
        enableMetrics: true,
      };

      connector.initialize(config);

      // Should preserve existing hooks and add observability hooks
      const afterResponseHooks = (config as any).hooks.afterResponse;
      expect(afterResponseHooks).toHaveLength(3); // 1 custom + 2 observability
      
      // Custom hook should still be there
      expect(afterResponseHooks.some((h: any) => h.name === "custom-transform")).toBe(true);
      expect(afterResponseHooks.some((h: any) => h.name === "log-after-response")).toBe(true);
      expect(afterResponseHooks.some((h: any) => h.name === "metrics-after-response")).toBe(true);
    });
  });

  describe("disabling observability", () => {
    it("does not add hooks when observability is not enabled", () => {
      const connector = createHubSpotConnector();

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        // No enableLogging or enableMetrics flags
      };

      connector.initialize(config);

      // Should not have observability hooks
      expect((config as any).hooks?.beforeRequest || []).toHaveLength(0);
      expect((config as any).hooks?.afterResponse || []).toHaveLength(0);
      expect((config as any).hooks?.onError || []).toHaveLength(0);
      expect((config as any).hooks?.onRetry || []).toHaveLength(0);
    });

    it("can disable metrics explicitly", () => {
      const connector = createHubSpotConnector();

      const config: ConnectorConfig = {
        auth: { type: "bearer", bearer: { token: "test-token" } },
        enableLogging: true,
        enableMetrics: { enabled: false },
      };

      connector.initialize(config);

      // Should have only logging hooks, not metrics
      expect((config as any).hooks?.beforeRequest).toHaveLength(1); // logging
      expect((config as any).hooks?.afterResponse).toHaveLength(1); // logging only
      expect((config as any).hooks?.onError).toHaveLength(1); // logging only
      expect((config as any).hooks?.onRetry).toHaveLength(1); // logging only

      const afterResponseHook = (config as any).hooks.afterResponse[0];
      expect(afterResponseHook.name).toBe("log-after-response");
    });
  });

  // Example demonstrating the "What you get" from the documentation
  it("provides one-line JSON events and in-memory metrics as documented", async () => {
    const loggedEvents: string[] = [];
    const originalConsoleInfo = console.info;
    
    // Capture console output
    console.info = (message: string) => {
      loggedEvents.push(message);
    };

    try {
      const connector = createHubSpotConnector();
      
      connector.initialize({
        auth: { type: "bearer", bearer: { token: process.env.HUBSPOT_TOKEN || "test-token" } },
        enableLogging: { level: "info" }, // or true for defaults
        enableMetrics: true,              // in-memory counters + timings
      });

      // The implementation creates the hooks automatically
      // In a real scenario, making actual HTTP requests would trigger these hooks
      // Here we simulate the hooks being called

      const config = (connector as any).config;
      expect(config.hooks.beforeRequest).toBeDefined();
      expect(config.hooks.afterResponse).toBeDefined();
      expect(config.hooks.onError).toBeDefined();
      expect(config.hooks.onRetry).toBeDefined();

      // What you get:
      // - Logging: one-line JSON events for beforeRequest, afterResponse, onError, onRetry
      expect(config.hooks.beforeRequest.some((h: any) => h.name === "log-before-request")).toBe(true);
      expect(config.hooks.afterResponse.some((h: any) => h.name === "log-after-response")).toBe(true);
      expect(config.hooks.onError.some((h: any) => h.name === "log-on-error")).toBe(true);
      expect(config.hooks.onRetry.some((h: any) => h.name === "log-on-retry")).toBe(true);

      // - Metrics: counters and duration observations in an in-memory sink
      expect(config.hooks.afterResponse.some((h: any) => h.name === "metrics-after-response")).toBe(true);
      expect(config.hooks.onError.some((h: any) => h.name === "metrics-on-error")).toBe(true);
      expect(config.hooks.onRetry.some((h: any) => h.name === "metrics-on-retry")).toBe(true);

    } finally {
      console.info = originalConsoleInfo;
    }
  });
});
