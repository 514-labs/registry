export class ConnectorError extends Error {
  public readonly code: string;
  public readonly source: string;
  public readonly retryable: boolean;
  public readonly statusCode?: number;

  constructor({
    message,
    code,
    source,
    retryable,
    statusCode,
  }: {
    message: string;
    code: string;
    source: string;
    retryable: boolean;
    statusCode?: number;
  }) {
    super(message);
    this.name = "ConnectorError";
    this.code = code;
    this.source = source;
    this.retryable = retryable;
    this.statusCode = statusCode;
  }
}