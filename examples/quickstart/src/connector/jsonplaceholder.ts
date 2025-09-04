import { z } from "zod";

export type RequestContext = {
  url: string;
  method: string;
  headers: Record<string, string>;
  query?: Record<string, string | number | boolean>;
};

export type ResponseContext<T> = {
  status: number;
  headers: Record<string, string>;
  data: T;
  meta: { timestamp: string; durationMs: number };
};

export type Hook = {
  beforeRequest?: (req: RequestContext) => Promise<void> | void;
  afterResponse?: (res: ResponseContext<unknown>, req: RequestContext) => Promise<void> | void;
  onError?: (error: unknown, req: RequestContext) => Promise<void> | void;
};

export type JsonPlaceholderConfig = {
  baseUrl?: string;
};

const Post = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});
export type Post = z.infer<typeof Post>;

export class JsonPlaceholderConnector {
  private readonly baseUrl: string;
  private readonly hooks: Hook[];

  constructor(config: JsonPlaceholderConfig = {}, hooks: Hook[] = []) {
    this.baseUrl = config.baseUrl ?? "https://jsonplaceholder.typicode.com";
    this.hooks = hooks;
  }

  async initialize(): Promise<void> {
    // No-op for this public API; validate base URL is reachable.
    const req: RequestContext = { url: `${this.baseUrl}/posts?_limit=1`, method: "GET", headers: {} };
    const start = performance.now();
    try {
      for (const h of this.hooks) await h.beforeRequest?.(req);
      const res = await fetch(req.url, { method: req.method, headers: req.headers });
      const durationMs = performance.now() - start;
      const data = (await res.json()) as unknown;
      const ctx: ResponseContext<unknown> = {
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        data,
        meta: { timestamp: new Date().toISOString(), durationMs },
      };
      for (const h of this.hooks) await h.afterResponse?.(ctx, req);
      if (!res.ok) throw new Error(`Initialization check failed: HTTP ${res.status}`);
    } catch (err) {
      for (const h of this.hooks) await h.onError?.(err, req);
      throw err;
    }
  }

  async *listPosts(limit = 25): AsyncGenerator<Post, void, void> {
    const url = new URL(`${this.baseUrl}/posts`);
    url.searchParams.set("_limit", String(limit));

    const req: RequestContext = { url: url.toString(), method: "GET", headers: {} };
    const start = performance.now();
    try {
      for (const h of this.hooks) await h.beforeRequest?.(req);
      const res = await fetch(req.url, { method: req.method, headers: req.headers });
      const durationMs = performance.now() - start;
      const items = (await res.json()) as unknown;

      const ctx: ResponseContext<unknown> = {
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        data: items,
        meta: { timestamp: new Date().toISOString(), durationMs },
      };
      for (const h of this.hooks) await h.afterResponse?.(ctx, req);

      if (!res.ok) throw new Error(`Failed to list posts: HTTP ${res.status}`);

      const parsed = z.array(Post).safeParse(items);
      if (!parsed.success) throw new Error(`Schema validation failed: ${parsed.error.message}`);

      for (const item of parsed.data) {
        yield item;
      }
    } catch (err) {
      for (const h of this.hooks) await h.onError?.(err, req);
      throw err;
    }
  }
}