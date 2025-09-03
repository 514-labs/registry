import { z } from "zod";
import { withDerivedDefaults } from "./defaults";
import type { ConnectorConfig } from "../types/config";

const authSchema = z
  .object({
    type: z.union([z.literal("bearer"), z.literal("oauth2")]),
    bearer: z
      .object({
        token: z.string().min(1, "Missing required field auth.bearer.token"),
      })
      .optional(),
    oauth2: z
      .object({
        clientId: z.string().min(1, "Missing required field auth.oauth2.clientId"),
        clientSecret: z
          .string()
          .min(1, "Missing required field auth.oauth2.clientSecret"),
        refreshToken: z
          .string()
          .min(1, "Missing required field auth.oauth2.refreshToken"),
        accessToken: z.string().optional(),
        expiresAt: z.number().int().positive().optional(),
        tokenUrl: z.string().url().optional(),
      })
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.type === "bearer") {
      if (!val.bearer || !val.bearer.token) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Missing required field auth.bearer.token",
          path: ["bearer", "token"],
        });
      }
    }
    if (val.type === "oauth2") {
      if (!val.oauth2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Missing required fields: auth.oauth2.clientId, auth.oauth2.clientSecret, auth.oauth2.refreshToken",
          path: ["oauth2"],
        });
      }
    }
  });

const retrySchema = z
  .object({
    maxAttempts: z.number().int().min(0).max(100).optional(),
    initialDelayMs: z.number().int().min(0).max(3_600_000).optional(),
    maxDelayMs: z.number().int().min(0).max(3_600_000).optional(),
    backoffMultiplier: z.number().min(1).max(100).optional(),
    retryableStatusCodes: z.array(z.number().int()).optional(),
    retryBudgetMs: z.number().int().min(0).max(3_600_000).optional(),
    respectRetryAfter: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    if (
      typeof val.maxDelayMs === "number" &&
      typeof val.initialDelayMs === "number" &&
      val.maxDelayMs < val.initialDelayMs
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "retry.maxDelayMs must be >= retry.initialDelayMs",
        path: ["maxDelayMs"],
      });
    }
  });

const rateLimitSchema = z.object({
  requestsPerSecond: z.number().int().min(0).max(1_000_000).optional(),
  concurrentRequests: z.number().int().min(1).max(10_000).optional(),
  burstCapacity: z.number().int().min(0).max(1_000_000).optional(),
  adaptiveFromHeaders: z.boolean().optional(),
});

const connectorConfigSchema = z.object({
  baseUrl: z.string().url().optional(),
  timeoutMs: z.number().int().positive().max(600_000).optional(),
  userAgent: z.string().min(1).optional(),
  defaultHeaders: z.record(z.string()).optional(),
  defaultQueryParams: z
    .record(z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  auth: authSchema,
  retry: retrySchema.optional(),
  rateLimit: rateLimitSchema.optional(),
  hooks: z.any().optional(),
});

function formatZodIssues(issues: z.ZodIssue[]): string {
  return issues
    .map((i) => {
      const path = i.path && i.path.length > 0 ? i.path.join(".") + ": " : "";
      return `${path}${i.message}`;
    })
    .join("; ");
}

export function validateConfig(userConfig: ConnectorConfig): ConnectorConfig {
  try {
    const parsed = connectorConfigSchema.parse(userConfig);
    const resolved = withDerivedDefaults(parsed);
    // Basic post-derive sanity checks (values will be present due to defaults)
    if (resolved.timeoutMs !== undefined && resolved.timeoutMs <= 0) {
      throw new Error("timeoutMs must be > 0");
    }
    return resolved;
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      const details = formatZodIssues(err.issues);
      throw new Error(`Invalid configuration: ${details}`);
    }
    throw err;
  }
}

