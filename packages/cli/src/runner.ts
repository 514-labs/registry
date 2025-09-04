import type { Writable } from "node:stream";
import process from "node:process";
import path from "node:path";
import fs from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import { createDefaultLoggingHooks } from "./utils/logging";
import type { ConnectorConfig } from "./config";

type RunParams = {
  connectorName: string;
  language: string; // e.g., 'typescript'
  implementation: string; // e.g., 'typescript/data-api'
  operationName: string; // e.g., 'listContacts' | 'streamDeals'
  params?: any;
  limit?: number;
  config: ConnectorConfig;
  output: Writable;
  enableLogs: boolean;
};

type GenericConnector = {
  initialize(cfg: ConnectorConfig): Promise<void> | void;
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  [key: string]: any;
};

async function findRepoRoot(startDir: string): Promise<string> {
  let current = startDir;
  while (true) {
    try {
      const entries = await fs.readdir(current);
      if (entries.includes("connector-registry") || entries.includes("pnpm-workspace.yaml")) return current;
    } catch {}
    const parent = path.dirname(current);
    if (parent === current) return startDir; // fallback to start
    current = parent;
  }
}

async function resolveConnectorEntryFile(connector: string, language: string, implementation: string): Promise<string | null> {
  if (language !== "typescript") return null;
  const implParts = implementation.split("/");
  const implDir = implParts.join(path.sep); // e.g., typescript/data-api
  const here = path.dirname(fileURLToPath(import.meta.url));
  const repoRoot = await findRepoRoot(here);
  const registryRoot = path.join(repoRoot, "connector-registry", connector);
  try {
    const versionDirs = await fs.readdir(registryRoot, { withFileTypes: true });
    for (const versionDir of versionDirs) {
      if (!versionDir.isDirectory()) continue;
      if (versionDir.name.startsWith("_")) continue;
      const versionPath = path.join(registryRoot, versionDir.name);
      const authorDirs = await fs.readdir(versionPath, { withFileTypes: true });
      for (const authorDir of authorDirs) {
        if (!authorDir.isDirectory()) continue;
        if (authorDir.name.startsWith("_")) continue;
        const candidate = path.join(versionPath, authorDir.name, implDir, "dist", "src", "index.js");
        try {
          await fs.access(candidate);
          return candidate;
        } catch {}
      }
    }
  } catch {}
  return null;
}

async function dynamicImportConnector(connector: string, language: string, implementation: string): Promise<{ create: () => GenericConnector }> {
  // 1) Try workspace import first
  try {
    if (language === "typescript" && connector === "hubspot") {
      const mod = await import("@workspace/connector-hubspot");
      return { create: (mod as any).createHubSpotConnector };
    }
  } catch {}

  // 2) Fallback: import via file path inside this monorepo
  const entry = await resolveConnectorEntryFile(connector, language, implementation);
  if (entry) {
    const mod = await import(pathToFileURL(entry).toString());
    // Heuristic: exported factory starts with create<PascalCase>Connector
    const factory = Object.entries(mod).find(([k, v]) => k.startsWith("create") && typeof v === "function");
    if (factory) return { create: factory[1] as any };
  }
  throw new Error(`Unsupported or unresolved connector: ${connector} (${language}/${implementation})`);
}

export async function runConnectorOperation(params: RunParams): Promise<number> {
  const { connectorName, language, implementation, operationName, params: opParams, limit, config, output, enableLogs } = params;

  const { create } = await dynamicImportConnector(connectorName, language, implementation);
  const instance: GenericConnector = create();

  const cfg: ConnectorConfig = { ...config };
  if (enableLogs) {
    const hooks = createDefaultLoggingHooks();
    cfg.hooks = cfg.hooks ? { ...cfg.hooks, ...hooks } : hooks;
  }

  try {
    instance.initialize(cfg as any);
    await instance.connect();
    if (typeof instance[operationName] !== "function") {
      throw new Error(`Operation not found on connector: ${operationName}`);
    }
    const result = await instance[operationName](opParams ?? {});

    // Stream vs paged
    if (result && typeof (result as any)[Symbol.asyncIterator] === "function") {
      let count = 0;
      for await (const item of result as AsyncIterable<any>) {
        output.write(`${JSON.stringify(item)}\n`);
        count += 1;
        if (typeof limit === "number" && count >= limit) break;
      }
    } else if (result && typeof result === "object" && "data" in result) {
      output.write(`${JSON.stringify((result as any).data)}\n`);
    } else {
      output.write(`${JSON.stringify(result)}\n`);
    }
    await instance.disconnect();
    return 0;
  } catch (err: any) {
    // Pretty-print ConnectorError if present
    const connectorErr = err && err.name === "ConnectorError" ? err : null;
    const errorOut = connectorErr
      ? {
          name: err.name,
          message: err.message,
          code: err.code,
          statusCode: err.statusCode,
          retryable: err.retryable,
          details: err.details,
          requestId: err.requestId,
          source: err.source,
        }
      : { name: err?.name ?? "Error", message: String(err?.message ?? err) };
    const line = JSON.stringify({ error: errorOut });
    output.write(`${line}\n`);
    if (process.env.DEBUG) console.error(err);
    try {
      await instance.disconnect();
    } catch {}
    return 1;
  }
}

