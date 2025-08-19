/// <reference types="node" />
import { existsSync, readFileSync, readdirSync, statSync, Dirent } from "fs";
import { join, resolve } from "path";
import type {
  ConnectorRootMeta,
  ProviderMeta,
  RegistryConnector,
} from "./types";

// Resolve the monorepo root by walking up from the current working directory
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

// Try multiple strategies to find the monorepo root
function getMonorepoRoot(): string {
  // Strategy 1: Environment variable
  if (process.env.MONOREPO_ROOT) {
    return process.env.MONOREPO_ROOT;
  }

  // Strategy 2: Walk up from cwd
  const fromCwd = findMonorepoRoot(process.cwd());
  if (existsSync(join(fromCwd, "connector-registry"))) {
    return fromCwd;
  }

  // Strategy 3: Try common Next.js build paths
  const possibleRoots = [
    process.cwd(),
    resolve(process.cwd(), ".."),
    resolve(process.cwd(), "../.."),
    resolve(process.cwd(), "../../.."),
    "/vercel/path0", // Common Vercel build path
  ];

  for (const root of possibleRoots) {
    if (existsSync(join(root, "connector-registry"))) {
      return root;
    }
  }

  // Fallback to cwd
  return process.cwd();
}

const MONOREPO_ROOT = getMonorepoRoot();
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
