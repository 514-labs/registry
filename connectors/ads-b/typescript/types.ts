// Standard error codes from specification
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',
  AUTH_FAILED = 'AUTH_FAILED',
  RATE_LIMIT = 'RATE_LIMIT',
  INVALID_REQUEST = 'INVALID_REQUEST',
  SERVER_ERROR = 'SERVER_ERROR',
  PARSING_ERROR = 'PARSING_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  CANCELLED = 'CANCELLED',
  UNSUPPORTED = 'UNSUPPORTED'
}

export enum ErrorSource {
  TRANSPORT = 'transport',
  AUTH = 'auth',
  RATE_LIMIT = 'rateLimit',
  DESERIALIZE = 'deserialize',
  USER_HOOK = 'userHook',
  UNKNOWN = 'unknown'
}

// Structured error class
export class ConnectorError extends Error {
  code: ErrorCode;
  statusCode?: number;
  details?: any;
  retryable: boolean;
  requestId?: string;
  source: ErrorSource;

  constructor(
    message: string,
    code: ErrorCode,
    options?: {
      statusCode?: number;
      details?: any;
      retryable?: boolean;
      requestId?: string;
      source?: ErrorSource;
      cause?: Error;
    }
  ) {
    super(message);
    this.name = 'ConnectorError';
    this.code = code;
    this.statusCode = options?.statusCode;
    this.details = options?.details;
    this.retryable = options?.retryable ?? false;
    this.requestId = options?.requestId;
    this.source = options?.source ?? ErrorSource.UNKNOWN;
    
    // Preserve original error
    if (options?.cause) {
      this.cause = options.cause;
    }
  }

  static fromHttpStatus(status: number, message?: string, requestId?: string): ConnectorError {
    // Determine error code and retryability based on status
    let code: ErrorCode;
    let retryable = false;

    if (status === 429) {
      code = ErrorCode.RATE_LIMIT;
      retryable = true;
    } else if (status === 408) {
      code = ErrorCode.TIMEOUT;
      retryable = true;
    } else if (status === 401 || status === 403) {
      code = ErrorCode.AUTH_FAILED;
    } else if (status >= 500) {
      code = ErrorCode.SERVER_ERROR;
      retryable = true;
    } else if (status >= 400) {
      code = ErrorCode.INVALID_REQUEST;
    } else {
      code = ErrorCode.SERVER_ERROR;
    }

    return new ConnectorError(
      message || `HTTP ${status} error`,
      code,
      {
        statusCode: status,
        retryable,
        requestId,
        source: ErrorSource.TRANSPORT
      }
    );
  }

  static fromError(error: any, requestId?: string): ConnectorError {
    if (error instanceof ConnectorError) {
      return error;
    }

    // Network errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
      return new ConnectorError(
        error.message,
        ErrorCode.NETWORK_ERROR,
        {
          retryable: true,
          requestId,
          source: ErrorSource.TRANSPORT,
          cause: error
        }
      );
    }

    // Timeout errors
    if (error.name === 'AbortError' || error.message?.includes('timeout')) {
      return new ConnectorError(
        'Request timeout',
        ErrorCode.TIMEOUT,
        {
          retryable: true,
          requestId,
          source: ErrorSource.TRANSPORT,
          cause: error
        }
      );
    }

    // Default unknown error
    return new ConnectorError(
      error.message || 'Unknown error',
      ErrorCode.NETWORK_ERROR,
      {
        requestId,
        source: ErrorSource.UNKNOWN,
        cause: error
      }
    );
  }
}