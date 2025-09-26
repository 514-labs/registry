import type { Hook } from "@connector-factory/core";
import type { MetricsLabels, MetricsOptions, MetricsSink } from "../types/config";

function labelsKey(labels?: MetricsLabels): string {
  if (!labels) return "";
  const entries = Object.entries(labels).filter(([, v]) => v !== undefined);
  entries.sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
  return entries.map(([k, v]) => `${k}=${String(v)}`).join(",");
}

export class InMemoryMetricsSink implements MetricsSink {
  private counters = new Map<string, number>();
  private observations = new Map<string, { count: number; sum: number }>();

  incrementCounter(name: string, value: number = 1, labels?: MetricsLabels): void {
    const key = `${name}|${labelsKey(labels)}`;
    const prev = this.counters.get(key) ?? 0;
    this.counters.set(key, prev + value);
  }

  observe(name: string, value: number, labels?: MetricsLabels): void {
    const key = `${name}|${labelsKey(labels)}`;
    const prev = this.observations.get(key) ?? { count: 0, sum: 0 };
    prev.count += 1;
    prev.sum += value;
    this.observations.set(key, prev);
  }

  getSnapshot() {
    const counters: Record<string, number> = {};
    for (const [k, v] of this.counters.entries()) counters[k] = v;
    const observations: Record<string, { count: number; sum: number; avg: number }> = {};
    for (const [k, v] of this.observations.entries()) observations[k] = { count: v.count, sum: v.sum, avg: v.count ? v.sum / v.count : 0 };
    return { counters, observations };
  }
}

export function createInMemoryMetricsSink(): { sink: InMemoryMetricsSink } {
  return { sink: new InMemoryMetricsSink() };
}

export function createMetricsHooks(options: MetricsOptions = {}, staticLabels: MetricsLabels = {}): { hooks: Partial<Record<"beforeRequest" | "afterResponse" | "onError" | "onRetry", Hook[]>>; sink: MetricsSink } {
  const sink: MetricsSink = options.sink ?? new InMemoryMetricsSink();
  const enabled = options.enabled !== false; // default true if provided via flag

  const hooks: Partial<Record<"beforeRequest" | "afterResponse" | "onError" | "onRetry", Hook[]>> = {};
  if (enabled) {
    hooks.afterResponse = [
      {
        name: "metrics-after-response",
        priority: 1000,
        execute: (ctx) => {
          if (ctx.type !== "afterResponse" || !ctx.response) return;
          try {
            const res: any = ctx.response;
            const success = res.status >= 200 && res.status < 300;
            const duration = Number(res.meta?.durationMs ?? 0);
            const labels: MetricsLabels = { ...staticLabels, operation: ctx.operation, status: res.status, success };
            sink.incrementCounter("http_requests_total", 1, labels);
            if (Number.isFinite(duration)) sink.observe("http_request_duration_ms", duration, labels);
          } catch {
            // swallow
          }
        },
      },
    ];

    hooks.onError = [
      {
        name: "metrics-on-error",
        priority: 1000,
        execute: (ctx) => {
          if (ctx.type !== "onError" || !ctx.error) return;
          try {
            const err: any = ctx.error;
            const labels: MetricsLabels = { ...staticLabels, operation: ctx.operation, code: err?.code, source: err?.source };
            sink.incrementCounter("http_errors_total", 1, labels);
          } catch {
            // swallow
          }
        },
      },
    ];

    hooks.onRetry = [
      {
        name: "metrics-on-retry",
        priority: 1000,
        execute: (ctx) => {
          if (ctx.type !== "onRetry") return;
          try {
            const op = (ctx.metadata as any)?.operation ?? ctx.operation;
            const labels: MetricsLabels = { ...staticLabels, operation: op };
            sink.incrementCounter("http_retries_total", 1, labels);
          } catch {
            // swallow
          }
        },
      },
    ];
  }

  return { hooks, sink };
}