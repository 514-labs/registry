export type ConnectorErrorSource =
  | "transport"
  | "auth"
  | "rateLimit"
  | "deserialize"
  | "userHook"
  | "unknown";

export type ConnectorErrorCode =
  | "NETWORK_ERROR"
  | "TIMEOUT"
  | "AUTH_FAILED"
  | "RATE_LIMIT"
  | "INVALID_REQUEST"
  | "SERVER_ERROR"
  | "PARSING_ERROR"
  | "VALIDATION_ERROR"
  | "CANCELLED"
  | "UNSUPPORTED";

export class ConnectorError extends Error {
  code: ConnectorErrorCode;
  statusCode?: number;
  retryable?: boolean;
  details?: unknown;
  requestId?: string;
  source: ConnectorErrorSource;

  constructor(params: {
    message: string;
    code: ConnectorErrorCode;
    statusCode?: number;
    retryable?: boolean;
    details?: unknown;
    requestId?: string;
    source?: ConnectorErrorSource;
  }) {
    super(params.message);
    this.name = "ConnectorError";
    this.code = params.code;
    this.statusCode = params.statusCode;
    this.retryable = params.retryable;
    this.details = params.details;
    this.requestId = params.requestId;
    this.source = params.source ?? "unknown";
  }
}


