import type { ConnectorConfig } from "../types/config";
import type { HttpResponseEnvelope } from "../types/envelopes";
import { ConnectorError } from "../types/errors";
import { HttpClient } from "../client/http-client";
import { TokenBucketLimiter } from "../rate-limit/token-bucket";
import type { SendFn } from "../domains/paginate";
import { paginateCursor } from "../domains/paginate";

export interface RateLimitOptions {
  onRateLimitSignal?: (info: NonNullable<NonNullable<HttpResponseEnvelope["meta"]>["rateLimit"]>) => void;
}

export abstract class ApiConnectorBase {
  protected config?: ConnectorConfig;
  protected connected = false;
  protected http?: HttpClient;
  protected limiter?: TokenBucketLimiter;
  protected rateLimitOptions?: RateLimitOptions;

  initialize(userConfig: ConnectorConfig, defaults: (u: ConnectorConfig) => ConnectorConfig, applyAuth?: (req: { headers: Record<string, string> }) => void, rateLimitOptions?: RateLimitOptions) {
    this.config = defaults(userConfig);
    this.rateLimitOptions = rateLimitOptions;
    this.http = new HttpClient(this.config, { applyAuth });
    const rps = this.config.rateLimit?.requestsPerSecond ?? 0;
    const capacity = this.config.rateLimit?.burstCapacity ?? rps;
    if (rps > 0) this.limiter = new TokenBucketLimiter({ capacity, refillPerSec: rps });
  }

  async connect() {
    this.connected = true;
  }

  async disconnect() {
    this.connected = false;
  }

  isConnected() {
    return this.connected;
  }

  protected requireClient(): HttpClient {
    if (!this.http) {
      throw new ConnectorError({
        message: "Connector not initialized - call initialize() first",
        code: "NOT_INITIALIZED",
        source: "application",
        retryable: false
      });
    }
    return this.http;
  }

  protected async send<T>(opts: Parameters<HttpClient["request"]>[0]): Promise<HttpResponseEnvelope<T>> {
    if (this.limiter) await this.limiter.waitForSlot();
    const response = await this.requireClient().request<T>(opts);
    
    // Trigger rate limit signal callback if configured
    if (this.rateLimitOptions?.onRateLimitSignal && response.meta?.rateLimit) {
      this.rateLimitOptions.onRateLimitSignal(response.meta.rateLimit);
    }
    
    return response;
  }

  request(opts: Parameters<HttpClient["request"]>[0]) {
    return this.send(opts);
  }

  async *paginate<T = any>(options: { path: string; query?: Record<string, any>; pageSize?: number; extractItems?: (res: any) => T[]; extractNextCursor?: (res: any) => string | undefined }) {
    const sendLite: SendFn = async (args) => this.send<any>(args);
    yield* paginateCursor<T>({ send: sendLite, path: options.path, query: options.query, pageSize: options.pageSize, extractItems: options.extractItems, extractNextCursor: options.extractNextCursor });
  }
}

