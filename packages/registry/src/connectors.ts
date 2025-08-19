/// <reference types="node" />
import { existsSync, readFileSync, readdirSync, statSync, Dirent } from "fs";
import { join, resolve } from "path";
import type {
  ConnectorRootMeta,
  ProviderMeta,
  RegistryConnector,
} from "./types";

// Resolve the monorepo root by walking up from the current working directory
function findMonorepoRoot(startDir: string): string | undefined {
  let dir = startDir;
  for (let i = 0; i < 7; i += 1) {
    const candidate = join(dir, "pnpm-workspace.yaml");
    if (existsSync(candidate)) return dir;
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return undefined;
}

function findUpwardsForDir(
  startDir: string,
  targetDirName: string
): string | undefined {
  let dir = startDir;
  for (let i = 0; i < 10; i += 1) {
    const candidate = join(dir, targetDirName);
    if (existsSync(candidate)) return candidate;
    const parent = resolve(dir, "..");
    if (parent === dir) break;
    dir = parent;
  }
  return undefined;
}

function resolveConnectorsRegistryDir(): string {
  // 1) Explicit override
  const fromEnv = process.env.CONNECTORS_REGISTRY_DIR;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  // 2) Monorepo root (during local/dev builds)
  const mono = findMonorepoRoot(process.cwd());
  if (mono) {
    const p = join(mono, "connector-registry");
    if (existsSync(p)) return p;
  }

  // 3) Look upwards from CWD and from this file's dir (for standalone/serverless)
  const fromCwd = findUpwardsForDir(process.cwd(), "connector-registry");
  if (fromCwd) return fromCwd;
  const fromHere = findUpwardsForDir(__dirname, "connector-registry");
  if (fromHere) return fromHere;

  // 4) Fallback to CWD/connector-registry (may not exist, but keeps path consistent)
  return join(process.cwd(), "connector-registry");
}

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
  return resolveConnectorsRegistryDir();
}

export function listConnectorIds(): string[] {
  const registryDir = getConnectorsRegistryPath();
  const entries: Dirent[] = readdirSync(registryDir, {
    withFileTypes: true,
  });
  return entries
    .filter((entry: Dirent) => entry.isDirectory())
    .map((entry: Dirent) => entry.name)
    .filter((name: string) => !name.startsWith(".") && !name.startsWith("_"))
    .filter((name: string) => /^[a-zA-Z0-9_-]+$/.test(name));
}

export function readConnector(
  connectorId: string
): RegistryConnector | undefined {
  const registryDir = getConnectorsRegistryPath();
  const connectorPath = join(registryDir, connectorId);
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
