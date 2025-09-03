import type { ConnectorConfig } from "../types/config";
import type { HttpResponseEnvelope } from "../types/envelopes";
import { HttpClient } from "../client/http-client";
import { TokenBucketLimiter } from "../rate-limit/token-bucket";
import type { SendFn } from "../domains/paginate";
import { paginateCursor } from "../domains/paginate";

export abstract class ApiConnectorBase {
  protected config?: ConnectorConfig;
  protected connected = false;
  protected http?: HttpClient;
  protected limiter?: TokenBucketLimiter;

  initialize(userConfig: ConnectorConfig, defaults: (u: ConnectorConfig) => ConnectorConfig, applyAuth?: (req: { headers: Record<string, string> }) => void) {
    this.config = defaults(userConfig);
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
    if (!this.http) throw new Error("Connector not initialized");
    return this.http;
  }

  protected async send<T>(opts: Parameters<HttpClient["request"]>[0]): Promise<HttpResponseEnvelope<T>> {
    if (this.limiter) await this.limiter.waitForSlot();
    return this.requireClient().request<T>(opts);
  }

  request(opts: Parameters<HttpClient["request"]>[0]) {
    return this.send(opts);
  }

  async *paginate<T = any>(options: { path: string; query?: Record<string, any>; pageSize?: number; extractItems?: (res: any) => T[]; extractNextCursor?: (res: any) => string | undefined }) {
    const sendLite: SendFn = async (args) => this.send<any>(args);
    yield* paginateCursor<T>({ send: sendLite, path: options.path, query: options.query, pageSize: options.pageSize, extractItems: options.extractItems, extractNextCursor: options.extractNextCursor });
  }
}

