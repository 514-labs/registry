// Jest globals are available in test environment
import { createMetaAdsConnector } from '../src/index'

describe('Meta Ads Connector', () => {
  it('should create connector successfully', () => {
    const connector = createMetaAdsConnector()
    expect(connector).toBeDefined()
  })

  it('should initialize with bearer auth', () => {
    const connector = createMetaAdsConnector()
    expect(() => {
      connector.initialize({
        auth: { type: "bearer", bearer: { token: "test-token" } },
      })
    }).not.toThrow()
  })

  it('should support configuration options from docs', () => {
    const connector = createMetaAdsConnector()
    expect(() => {
      connector.initialize({
        auth: { type: "bearer", bearer: { token: "test-token" } },
        baseUrl: "https://graph.facebook.com",
        timeoutMs: 30000,
        userAgent: "connector-meta-ads",
        rateLimit: {
          requestsPerSecond: 25,
          burstCapacity: 50,
          concurrentRequests: 10,
          adaptiveFromHeaders: true
        },
        retry: {
          maxAttempts: 3,
          initialDelayMs: 1000,
          maxDelayMs: 30000,
          respectRetryAfter: true
        }
      })
    }).not.toThrow()
  })

  it('should support validation configuration', () => {
    const connector = createMetaAdsConnector()
    expect(() => {
      connector.initialize({
        auth: { type: "bearer", bearer: { token: "test-token" } },
        validation: { enabled: true, strict: false },
      })
    }).not.toThrow()
  })

  it('should support observability configuration', () => {
    const connector = createMetaAdsConnector()
    expect(() => {
      connector.initialize({
        auth: { type: "bearer", bearer: { token: "test-token" } },
        logging: { enabled: true, level: "info" },
      })
    }).not.toThrow()
  })
})
