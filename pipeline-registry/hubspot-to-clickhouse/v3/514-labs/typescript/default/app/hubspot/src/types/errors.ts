export type ConnectorErrorSource =
  | "transport"
  | "auth"
  | "rateLimit"
  | "deserialize"
  | "userHook"
  | "unknown";

export class ConnectorError extends Error {
  code: string;
  statusCode?: number;
  retryable?: boolean;
  details?: unknown;
  requestId?: string;
  source: ConnectorErrorSource;

  constructor(params: {
    message: string;
    code: string;
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


