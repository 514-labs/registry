import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import { z } from "zod";

// Minimal mirror of ConnectorConfig to avoid importing the connector package directly here
export type ConnectorConfig = {
  baseUrl?: string;
  timeoutMs?: number;
  userAgent?: string;
  defaultHeaders?: Record<string, string>;
  defaultQueryParams?: Record<string, string | number | boolean>;
  auth: { type: "bearer" | "oauth2"; bearer?: { token: string }; oauth2?: { clientId: string; clientSecret: string; refreshToken: string; accessToken?: string; expiresAt?: number; tokenUrl?: string } };
  retry?: { maxAttempts?: number; initialDelayMs?: number; maxDelayMs?: number; backoffMultiplier?: number; retryableStatusCodes?: number[]; retryBudgetMs?: number; respectRetryAfter?: boolean };
  rateLimit?: { requestsPerSecond?: number; concurrentRequests?: number; burstCapacity?: number; adaptiveFromHeaders?: boolean };
  hooks?: any;
};

export type HarnessConfig = {
  connector: string;
  language: string;
  implementation: string;
  enableLogs: boolean;
  connectorConfig: ConnectorConfig;
};

function parseEnvNumber(envVar: string | undefined, name: string): number | undefined {
  if (!envVar) return undefined;
  const parsed = Number(envVar);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid ${name}: "${envVar}" is not a valid number`);
  }
  return parsed;
}

const FileConfigSchema = z.object({
  baseUrl: z.string().optional(),
  timeoutMs: z.number().optional(),
  userAgent: z.string().optional(),
  defaultHeaders: z.record(z.string()).optional(),
  defaultQueryParams: z.record(z.union([z.string(), z.number(), z.boolean()])).optional(),
  auth: z.union([
    z.object({ type: z.literal("bearer"), bearer: z.object({ token: z.string() }) }),
    z.object({
      type: z.literal("oauth2"),
      oauth2: z.object({
        clientId: z.string(),
        clientSecret: z.string(),
        refreshToken: z.string(),
        accessToken: z.string().optional(),
        expiresAt: z.number().optional(),
        tokenUrl: z.string().optional(),
      }),
    }),
  ]),
  retry: z
    .object({
      maxAttempts: z.number().optional(),
      initialDelayMs: z.number().optional(),
      maxDelayMs: z.number().optional(),
      backoffMultiplier: z.number().optional(),
      retryableStatusCodes: z.array(z.number()).optional(),
      retryBudgetMs: z.number().optional(),
      respectRetryAfter: z.boolean().optional(),
    })
    .optional(),
  rateLimit: z
    .object({
      requestsPerSecond: z.number().optional(),
      concurrentRequests: z.number().optional(),
      burstCapacity: z.number().optional(),
      adaptiveFromHeaders: z.boolean().optional(),
    })
    .optional(),
});

export async function loadConfigFromFileOrEnv(filePath: string | null, opts: { connector: string; language: string; implementation: string; enableLogs: boolean }): Promise<HarnessConfig> {
  dotenv.config({ path: path.resolve(process.cwd(), ".env") });

  let connectorConfig: ConnectorConfig | undefined;

  if (filePath) {
    const fullPath = path.resolve(process.cwd(), filePath);
    const raw = await fs.readFile(fullPath, "utf8");
    const parsed = JSON.parse(raw);
    const cfg = FileConfigSchema.parse(parsed);
    connectorConfig = cfg as unknown as ConnectorConfig;
  }

  if (!connectorConfig) {
    // Map common env vars to a minimal ConnectorConfig
    // Try connector-specific env var first, then fallback to generic ones
    const connectorEnvVar = `${opts.connector.toUpperCase()}_API_KEY`;
    const token = process.env[connectorEnvVar] ?? process.env.API_TOKEN ?? process.env.TOKEN;
    if (!token) {
      throw new Error(
        `No config file provided and no token found in environment.\n` +
        `Expected one of: ${connectorEnvVar}, API_TOKEN, or TOKEN`
      );
    }
    const requestsPerSecond = parseEnvNumber(process.env.REQUESTS_PER_SECOND, "REQUESTS_PER_SECOND");
    connectorConfig = {
      auth: { type: "bearer", bearer: { token } },
      timeoutMs: parseEnvNumber(process.env.TIMEOUT_MS, "TIMEOUT_MS"),
      rateLimit: requestsPerSecond ? { requestsPerSecond } : undefined,
    };
  }

  return {
    connector: opts.connector,
    language: opts.language,
    implementation: opts.implementation,
    enableLogs: opts.enableLogs,
    connectorConfig,
  };
}

