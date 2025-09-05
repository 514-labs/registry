// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-env jest */ /* global jest, describe, it, expect, fail */
import { createHubSpotConnector } from "../../src";
import { ConnectorError } from "@connector-factory/core";

describe("hubspot lifecycle", () => {
  it("initialize/connect/disconnect", async () => {
    const hs = createHubSpotConnector();
    hs.initialize({ auth: { type: "bearer", bearer: { token: "x" } } });
    expect(hs.isConnected()).toBe(false);
    await hs.connect();
    expect(hs.isConnected()).toBe(true);
    await hs.disconnect();
    expect(hs.isConnected()).toBe(false);
  });

  it("should accept rate limiting configuration", () => {
    const hs = createHubSpotConnector();
    const config = {
      auth: { type: "bearer" as const, bearer: { token: "test-token" } },
      rateLimit: {
        requestsPerSecond: 10,
        adaptiveFromHeaders: true
      }
    };

    // Should not throw when initializing with rate limiting enabled
    expect(() => {
      hs.initialize(config);
    }).not.toThrow();
  });

  describe("error handling", () => {
    it("should throw ConnectorError when making requests before initialization", async () => {
      const hs = createHubSpotConnector();

      await expect(
        hs.request({ path: "/test", method: "GET" })
      ).rejects.toThrow(ConnectorError);
    });

    it("should throw ConnectorError with proper metadata when not initialized", async () => {
      const hs = createHubSpotConnector();

      try {
        await hs.request({ path: "/test", method: "GET" });
        fail("Expected ConnectorError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ConnectorError);
        expect(error.code).toBe("NOT_INITIALIZED");
        expect(error.source).toBe("application");
        expect(error.retryable).toBe(false);
        expect(error.message).toContain("not initialized");
      }
    });
  });

  describe("backward compatibility", () => {
    it("should work without rate limiting configuration", () => {
      const hs = createHubSpotConnector();
      const config = {
        auth: { type: "bearer" as const, bearer: { token: "test-token" } }
        // No rateLimit configuration
      };

      expect(() => {
        hs.initialize(config);
      }).not.toThrow();
    });

    it("should work with minimal configuration", () => {
      const hs = createHubSpotConnector();
      const config = {
        auth: { type: "bearer" as const, bearer: { token: "test-token" } }
      };

      expect(() => {
        hs.initialize(config);
      }).not.toThrow();
    });
  });
});


