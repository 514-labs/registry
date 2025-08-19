/// <reference types="node" />
import { existsSync, readFileSync, readdirSync, statSync, Dirent } from "fs";
import { join, resolve } from "path";

// NOTE: Keep pipelines registry processing separate from connectors.
// This module intentionally only exposes path utilities and enumeration helpers
// that are tailored to pipeline-registry structure.

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

function resolvePipelinesRegistryDir(): string {
  const fromEnv = process.env.PIPELINES_REGISTRY_DIR;
  if (fromEnv && existsSync(fromEnv)) return fromEnv;

  const mono = findMonorepoRoot(process.cwd());
  if (mono) {
    const p = join(mono, "pipeline-registry");
    if (existsSync(p)) return p;
  }

  const fromCwd = findUpwardsForDir(process.cwd(), "pipeline-registry");
  if (fromCwd) return fromCwd;
  const fromHere = findUpwardsForDir(__dirname, "pipeline-registry");
  if (fromHere) return fromHere;

  return join(process.cwd(), "pipeline-registry");
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

export function getPipelinesRegistryPath(): string {
  return resolvePipelinesRegistryDir();
}

export type PipelineRootMeta = {
  $schema?: string;
  name: string;
  title?: string;
  tags?: string[];
  description?: string;
  homepage?: string;
  registryUrl?: string;
};

export type PipelineProviderMeta = {
  $schema?: string;
  name: string;
  author: string;
  authorType?: "user" | "organization";
  avatarUrlOverride?: string;
  version?: string;
  description?: string;
  tags?: string[];
  schedule?: { cron?: string; timezone?: string };
  source?: Record<string, unknown>;
  systems?: Array<Record<string, unknown>>;
  transformations?: Array<Record<string, unknown>>;
  destination?: Record<string, unknown>;
  lineage?: {
    nodes?: Array<Record<string, unknown>>;
    edges?: Array<Record<string, unknown>>;
  };
  maintainers?: Array<Record<string, unknown>>;
};

export type RegistryPipeline = {
  pipelineId: string; // e.g. "ga-to-clickhouse"
  root: { path: string; meta?: PipelineRootMeta };
  providers: Array<{
    authorId: string;
    path: string;
    meta?: PipelineProviderMeta;
    implementations: Array<{
      language: string;
      implementation: string;
      path: string;
    }>;
  }>;
};

export function listPipelineIds(): string[] {
  const registryDir = getPipelinesRegistryPath();
  const entries: Dirent[] = readdirSync(registryDir, {
    withFileTypes: true,
  });
  return entries
    .filter((entry: Dirent) => entry.isDirectory())
    .map((entry: Dirent) => entry.name)
    .filter((name: string) => !name.startsWith(".") && !name.startsWith("_"))
    .filter((name: string) => /^[a-zA-Z0-9_-]+$/.test(name));
}

export function readPipeline(pipelineId: string): RegistryPipeline | undefined {
  const registryDir = getPipelinesRegistryPath();
  const pipelinePath = join(registryDir, pipelineId);
  if (!existsSync(pipelinePath) || !statSync(pipelinePath).isDirectory())
    return undefined;

  const rootMeta = readJsonSafe<PipelineRootMeta>(
    join(pipelinePath, "_meta", "pipeline.json")
  );
  const versionDirs: string[] = readdirSync(pipelinePath, {
    withFileTypes: true,
  })
    .filter((entry: Dirent) => entry.isDirectory() && entry.name !== "_meta")
    .map((entry: Dirent) => entry.name);

  const providers = versionDirs.flatMap((versionId: string) => {
    const versionPath = join(pipelinePath, versionId);
    const providerDirs: string[] = readdirSync(versionPath, {
      withFileTypes: true,
    })
      .filter(
        (entry: Dirent) => entry.isDirectory() && !entry.name.startsWith("_")
      )
      .map((entry: Dirent) => entry.name);

    return providerDirs.map((authorId: string) => {
      const providerPath = join(versionPath, authorId);
      const providerMeta = readJsonSafe<PipelineProviderMeta>(
        join(providerPath, "_meta", "pipeline.json")
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
    pipelineId,
    root: { path: pipelinePath, meta: rootMeta },
    providers,
  };
}

export function listPipelines(): RegistryPipeline[] {
  return listPipelineIds()
    .map((id) => readPipeline(id))
    .filter((p): p is RegistryPipeline => Boolean(p));
}
