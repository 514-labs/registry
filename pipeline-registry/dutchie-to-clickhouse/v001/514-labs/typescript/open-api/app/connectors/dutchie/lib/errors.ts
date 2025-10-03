export type ConnectorErrorCode =
  | 'NETWORK_ERROR'
  | 'TIMEOUT'
  | 'AUTH_FAILED'
  | 'RATE_LIMIT'
  | 'INVALID_REQUEST'
  | 'SERVER_ERROR'
  | 'PARSING_ERROR'
  | 'VALIDATION_ERROR'
  | 'CANCELLED'
  | 'UNSUPPORTED'

export class ConnectorError extends Error {
  code: ConnectorErrorCode
  statusCode?: number
  retryable?: boolean
  details?: any
  requestId?: string
  source?: string
  constructor(args: { message: string; code: ConnectorErrorCode; statusCode?: number; retryable?: boolean; details?: any; requestId?: string; source?: string }) {
    super(args.message)
    this.code = args.code
    this.statusCode = args.statusCode
    this.retryable = args.retryable
    this.details = args.details
    this.requestId = args.requestId
    this.source = args.source
  }
}

export function mapError(e: unknown, status?: number, requestId?: string): ConnectorError {
  if (e instanceof ConnectorError) return e
  const msg = (e as any)?.message || String(e)
  if (/^VALIDATION_ERROR/.test(msg)) {
    return new ConnectorError({ message: msg, code: 'VALIDATION_ERROR', statusCode: status, retryable: false, source: 'deserialize', requestId })
  }
  // Timeout
  if ((e as any)?.code === 'ETIMEDOUT' || /timeout/i.test(msg)) {
    return new ConnectorError({ message: msg, code: 'TIMEOUT', statusCode: status, retryable: true, source: 'transport', requestId })
  }
  // Network
  if ((e as any)?.code === 'ENOTFOUND' || (e as any)?.code === 'ECONNRESET' || (e as any)?.code === 'EAI_AGAIN') {
    return new ConnectorError({ message: msg, code: 'NETWORK_ERROR', statusCode: status, retryable: true, source: 'transport', requestId })
  }
  // HTTP status categories
  if (status === 401 || status === 403) {
    return new ConnectorError({ message: msg, code: 'AUTH_FAILED', statusCode: status, retryable: false, source: 'auth', requestId })
  }
  if (status === 429) {
    return new ConnectorError({ message: msg, code: 'RATE_LIMIT', statusCode: status, retryable: true, source: 'rateLimit', requestId })
  }
  if (status && status >= 500) {
    return new ConnectorError({ message: msg, code: 'SERVER_ERROR', statusCode: status, retryable: true, source: 'transport', requestId })
  }
  if (status && status >= 400) {
    return new ConnectorError({ message: msg, code: 'INVALID_REQUEST', statusCode: status, retryable: false, source: 'transport', requestId })
  }
  return new ConnectorError({ message: msg, code: 'PARSING_ERROR', statusCode: status, retryable: false, source: 'unknown', requestId })
}


