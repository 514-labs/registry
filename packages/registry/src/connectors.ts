/// <reference types="node" />
import { existsSync, readFileSync, readdirSync, statSync, Dirent } from "fs";
import { join, resolve, dirname } from "path";
import { fileURLToPath } from "url";
import type {
  ConnectorRootMeta,
  ProviderMeta,
  RegistryConnector,
} from "./types";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Resolve the monorepo root by walking up from the package directory
function findMonorepoRoot(startDir: string): string {
  // First, check environment variable
  if (process.env.MONOREPO_ROOT) {
    return process.env.MONOREPO_ROOT;
  }

  // Heuristics: look for common monorepo markers or the registries themselves
  let dir = startDir;
  for (let i = 0; i < 10; i += 1) {
    if (existsSync(join(dir, "pnpm-workspace.yaml"))) {
      return dir;
    }
    if (existsSync(join(dir, "connector-registry"))) {
      return dir;
    }
    if (existsSync(join(dir, "pipeline-registry"))) {
      return dir;
    }
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }

  // If we can't find the monorepo root, log an error in development
  if (process.env.NODE_ENV !== "production") {
    console.error(
      "[findMonorepoRoot] Failed to find monorepo root from:",
      startDir
    );
  }
  return startDir;
}

// Start from the package directory instead of process.cwd()
// This is more reliable in production builds
const packageDir = resolve(__dirname, "..", "..", "..");
const MONOREPO_ROOT = findMonorepoRoot(packageDir);
const CONNECTORS_REGISTRY_DIR = join(MONOREPO_ROOT, "connector-registry");

function readJsonSafe<T>(filePath: string): T | undefined {
  try {
    if (!existsSync(filePath)) return undefined;
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function getConnectorsRegistryPath(): string {
  return CONNECTORS_REGISTRY_DIR;
}

export function listConnectorIds(): string[] {
  if (!existsSync(CONNECTORS_REGISTRY_DIR)) {
    if (process.env.NODE_ENV !== "production") {
      console.error(
        "[listConnectorIds] Directory does not exist:",
        CONNECTORS_REGISTRY_DIR
      );
    }
    return [];
  }

  const entries: Dirent[] = readdirSync(CONNECTORS_REGISTRY_DIR, {
    withFileTypes: true,
  });

  const connectorIds = entries
    .filter((entry: Dirent) => entry.isDirectory())
    .map((entry: Dirent) => entry.name)
    .filter((name: string) => !name.startsWith(".") && !name.startsWith("_"))
    .filter((name: string) => /^[a-zA-Z0-9_-]+$/.test(name));

  return connectorIds;
}

export function readConnector(
  connectorId: string
): RegistryConnector | undefined {
  const connectorPath = join(CONNECTORS_REGISTRY_DIR, connectorId);
  if (!existsSync(connectorPath) || !statSync(connectorPath).isDirectory())
    return undefined;

  const rootMeta = readJsonSafe<ConnectorRootMeta>(
    join(connectorPath, "_meta", "connector.json")
  );
  const versionDirs: string[] = readdirSync(connectorPath, {
    withFileTypes: true,
  })
    .filter((entry: Dirent) => entry.isDirectory() && entry.name !== "_meta")
    .map((entry: Dirent) => entry.name);

  const providers = versionDirs.flatMap((versionId: string) => {
    const versionPath = join(connectorPath, versionId);
    const providerDirs: string[] = readdirSync(versionPath, {
      withFileTypes: true,
    })
      .filter(
        (entry: Dirent) => entry.isDirectory() && !entry.name.startsWith("_")
      )
      .map((entry: Dirent) => entry.name);

    return providerDirs.map((authorId: string) => {
      const providerPath = join(versionPath, authorId);
      const providerMeta = readJsonSafe<ProviderMeta>(
        join(providerPath, "_meta", "connector.json")
      );

      const implementations: Array<{
        language: string;
        implementation: string;
        path: string;
      }> = readdirSync(providerPath, { withFileTypes: true })
        .filter(
          (entry: Dirent) => entry.isDirectory() && !entry.name.startsWith("_")
        )
        .flatMap((languageDir: Dirent) => {
          const languagePath = join(providerPath, languageDir.name);
          const subDirs = readdirSync(languagePath, {
            withFileTypes: true,
          }).filter(
            (sub: Dirent) => sub.isDirectory() && !sub.name.startsWith("_")
          );

          if (subDirs.length === 0) {
            return [
              {
                language: languageDir.name,
                implementation: "default",
                path: languagePath,
              },
            ];
          }

          return subDirs.map((implDir: Dirent) => ({
            language: languageDir.name,
            implementation: implDir.name,
            path: join(languagePath, implDir.name),
          }));
        });

      return {
        authorId,
        path: providerPath,
        meta: providerMeta,
        implementations,
      };
    });
  });

  return {
    connectorId,
    root: { path: connectorPath, meta: rootMeta },
    providers,
  };
}

export function listConnectors(): RegistryConnector[] {
  return listConnectorIds()
    .map((id) => readConnector(id))
    .filter((c): c is RegistryConnector => Boolean(c));
}
