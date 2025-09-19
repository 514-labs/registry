export type ConnectorConfig = {
  apiKey: string
  validation?: {
    enabled?: boolean
    strict?: boolean
    openApi?: any
  }
  rateLimit?: {
    requestsPerSecond?: number
    burstCapacity?: number
    concurrentRequests?: number
    adaptiveFromHeaders?: boolean
  }
  retry?: {
    maxAttempts?: number
    initialDelayMs?: number
    maxDelayMs?: number
    backoffMultiplier?: number
    budgetMs?: number
  }
  circuitBreaker?: {
    failureThreshold: number
    coolDownMs: number
  }
  timeoutMs?: number
  userAgent?: string
}
