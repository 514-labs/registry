import { NextResponse } from "next/server";
import { readdirSync, Dirent, existsSync, readFileSync } from "fs";
import { join } from "path";
import { getRegistryPath } from "@workspace/registry";
import type { ProviderMeta } from "@workspace/registry/types";

export const dynamic = "force-static";

function readJsonSafe<T = unknown>(filePath: string): T | undefined {
  try {
    if (!existsSync(filePath)) return undefined;
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch (error) {
    console.error(`Error parsing JSON file: ${filePath}`, error);
    return undefined;
  }
}

function isVisibleDir(entry: Dirent): boolean {
  return entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith(".");
}

export async function GET() {
  const registryDir = getRegistryPath();
  const result: ProviderMeta[] = [];

  // Walk: registry/<name>/<version>/<author>/<language>
  const connectorDirs = readdirSync(registryDir, { withFileTypes: true }).filter(isVisibleDir);
  for (const connectorEntry of connectorDirs) {
    const name = connectorEntry.name;
    const connectorPath = join(registryDir, name);

    const versionEntries = readdirSync(connectorPath, { withFileTypes: true }).filter(isVisibleDir);
    for (const versionEntry of versionEntries) {
      const version = versionEntry.name;
      const versionPath = join(connectorPath, version);

      const authorEntries = readdirSync(versionPath, { withFileTypes: true }).filter(isVisibleDir);
      for (const authorEntry of authorEntries) {
        const authorPath = join(versionPath, authorEntry.name);
        const authorMeta = readJsonSafe<ProviderMeta>(join(authorPath, "_meta", "connector.json"));
        if (authorMeta) {
          // Push the author-level meta object exactly as-is
          result.push(authorMeta);
        }
      }
    }
  }

  return NextResponse.json({ connectors: result });
}


