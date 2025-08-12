export interface HttpResponseEnvelope<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  meta?: {
    timestamp: string;
    durationMs: number;
    requestId?: string;
    retryCount?: number;
    rateLimit?: {
      limit?: number;
      remaining?: number;
      reset?: number;
      retryAfterSeconds?: number;
    };
  };
}


