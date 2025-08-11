import type { ConnectorConfig } from "../types/config";
import type { HttpResponseEnvelope } from "../types/envelopes";
import { ConnectorError } from "../types/errors";
import { applyHookPipeline } from "./middleware/hook-middleware";
import http from "node:http";
import https from "node:https";
import { URL } from "node:url";

export interface HttpRequestOptions {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  headers?: Record<string, string>;
  body?: unknown;
  timeoutMs?: number;
  operation?: string;
}

export interface HttpClientOptions {
  applyAuth?: (req: { headers: Record<string, string> }) => void;
}

export class HttpClient {
  constructor(private config: ConnectorConfig, private options: HttpClientOptions = {}) {}

  private buildUrl(path: string, query?: Record<string, any>) {
    const url = new URL(path.startsWith("http") ? path : `${this.config.baseUrl}${path}`);
    const qp = { ...(this.config.defaultQueryParams ?? {}), ...(query ?? {}) };
    for (const [k, v] of Object.entries(qp)) {
      if (v === undefined || v === null) continue;
      url.searchParams.set(k, String(v));
    }
    return url.toString();
  }

  private async sleep(ms: number) {
    return new Promise((r) => setTimeout(r, ms));
  }

  private calculateDelay(attempt: number): number {
    const initial = this.config.retry?.initialDelayMs ?? 1000;
    const max = this.config.retry?.maxDelayMs ?? 30000;
    const mult = this.config.retry?.backoffMultiplier ?? 2;
    const base = Math.min(initial * Math.pow(mult, attempt - 1), max);
    const jitter = base * (0.5 + Math.random() * 0.5);
    return Math.floor(jitter);
  }

  private shouldRetry(status: number, attempt: number): boolean {
    const retryables = this.config.retry?.retryableStatusCodes ?? [408, 425, 429, 500, 502, 503, 504];
    const withinAttempts = attempt < (this.config.retry?.maxAttempts ?? 3);
    return withinAttempts && retryables.includes(status);
  }

  async request<T = any>(opts: HttpRequestOptions): Promise<HttpResponseEnvelope<T>> {
    const start = Date.now();
    const path = opts.path.startsWith("/") ? opts.path : `/${opts.path}`;
    const url = this.buildUrl(path, opts.query);

    const headers: Record<string, string> = {
      ...(this.config.defaultHeaders ?? {}),
      ...(opts.headers ?? {}),
    };

    // Apply connector-provided auth (provider-specific)
    if (this.options.applyAuth) {
      this.options.applyAuth({ headers });
    }

    const req: { method: HttpRequestOptions["method"]; url: string; headers: Record<string, string>; body?: unknown } = {
      method: opts.method,
      url,
      headers,
      body: opts.body,
    };

    let aborted = false;
    let abortReason: string | undefined;
    const hooks = applyHookPipeline(this.config.hooks ?? {}, opts.operation ?? opts.method, (type) => ({
      type,
      operation: opts.operation,
      request: req,
      abort: (reason?: string) => {
        aborted = true;
        abortReason = reason ?? "Aborted by hook";
      },
    }));

    await hooks.beforeRequest();
    if (aborted) {
      throw new ConnectorError({ message: abortReason || "Aborted", code: "CANCELLED", source: "userHook" });
    }

    const timeoutMs = opts.timeoutMs ?? this.config.timeoutMs ?? 30000;

    let attempt = 0;
    let lastError: unknown;
    const retryBudget = this.config.retry?.retryBudgetMs ?? 60000;
    const budgetDeadline = start + retryBudget;

    while (true) {
      attempt += 1;
      try {
        const { status, headers: resHeaders, text } = await this.nodeHttpRequest(req.url, {
          method: req.method,
          headers: req.headers,
          body: req.body ? (typeof req.body === "string" ? req.body : JSON.stringify(req.body)) : undefined,
          timeoutMs,
        });

        const hdrs: Record<string, string> = {};
        for (const [k, v] of Object.entries(resHeaders)) {
          const value = Array.isArray(v) ? v.join(", ") : (v ?? "");
          hdrs[k.toLowerCase()] = value as string;
        }
        let data: any = undefined;
        try {
          data = text ? JSON.parse(text) : undefined;
        } catch (e) {
          throw new ConnectorError({ message: "Failed to parse JSON", code: "PARSING_ERROR", source: "deserialize" });
        }

        const retryAfter = Number(hdrs["retry-after"]);
        const rateLimit = {
          limit: Number(hdrs["x-hubspot-ratelimit-daily"] ?? hdrs["x-hubspot-ratelimit-secondly"]),
          remaining: Number(hdrs["x-hubspot-ratelimit-daily-remaining"] ?? hdrs["x-hubspot-ratelimit-secondly-remaining"]),
          reset: Number(hdrs["x-hubspot-ratelimit-reset"]),
          retryAfterSeconds: Number.isFinite(retryAfter) ? retryAfter : undefined,
        };

        const envelope: HttpResponseEnvelope<T> = {
          data: data as T,
          status,
          headers: hdrs,
          meta: {
            timestamp: new Date().toISOString(),
            durationMs: Date.now() - start,
            requestId: hdrs["x-request-id"] ?? hdrs["x-trace"],
            retryCount: attempt - 1,
            rateLimit,
          },
        };

        if (!(status >= 200 && status < 300) && this.shouldRetry(status, attempt)) {
          await hooks.onRetry(attempt);
          const delayMs = this.config.retry?.respectRetryAfter && rateLimit.retryAfterSeconds
            ? rateLimit.retryAfterSeconds * 1000
            : this.calculateDelay(attempt);
          if (Date.now() + delayMs > budgetDeadline) {
            throw new ConnectorError({ message: "Retry budget exceeded", code: "TIMEOUT" });
          }
          await this.sleep(delayMs);
          continue;
        }

        await hooks.afterResponse(envelope);
        return envelope;
      } catch (err: any) {
        lastError = err;
        await hooks.onError(err);
        if (err?.code === "ETIMEDOUT" || err?.message === "Request timed out") {
          throw new ConnectorError({ message: "Request timed out", code: "TIMEOUT", source: "transport", retryable: true });
        }
        if (err instanceof ConnectorError) {
          if (this.shouldRetry(err.statusCode ?? 0, attempt) && Date.now() < budgetDeadline) {
            await hooks.onRetry(attempt);
            await this.sleep(this.calculateDelay(attempt));
            continue;
          }
          throw err;
        }
        // Generic transport error
        if (attempt < (this.config.retry?.maxAttempts ?? 3) && Date.now() < budgetDeadline) {
          await hooks.onRetry(attempt);
          await this.sleep(this.calculateDelay(attempt));
          continue;
        }
        throw new ConnectorError({ message: String(err?.message ?? err), code: "NETWORK_ERROR", source: "transport", retryable: true });
      }
    }
  }

  private nodeHttpRequest(
    urlStr: string,
    opts: { method: string; headers?: Record<string, string>; body?: string; timeoutMs: number }
  ): Promise<{ status: number; headers: http.IncomingHttpHeaders; text: string }> {
    return new Promise((resolve, reject) => {
      const u = new URL(urlStr);
      const isHttps = u.protocol === "https:";
      const lib = isHttps ? https : http;
      const req = lib.request(
        {
          protocol: u.protocol,
          hostname: u.hostname,
          port: u.port || (isHttps ? 443 : 80),
          path: `${u.pathname}${u.search}`,
          method: opts.method,
          headers: opts.headers,
        },
        (res) => {
          const chunks: Buffer[] = [];
          res.on("data", (c) => chunks.push(Buffer.isBuffer(c) ? c : Buffer.from(c)));
          res.on("end", () => {
            const text = Buffer.concat(chunks).toString("utf8");
            resolve({ status: res.statusCode || 0, headers: res.headers, text });
          });
        }
      );
      req.setTimeout(opts.timeoutMs, () => {
        req.destroy(new Error("Request timed out"));
      });
      req.on("error", (err) => reject(err));
      if (opts.body) req.write(opts.body);
      req.end();
    });
  }
}


