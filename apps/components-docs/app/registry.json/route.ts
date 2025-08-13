import { NextResponse } from "next/server";
import { readdirSync, Dirent, existsSync, readFileSync } from "fs";
import { join } from "path";
import { getRegistryPath } from "@workspace/registry";

export const dynamic = "force-static";

type JsonValue = unknown;

function readJsonSafe<T = JsonValue>(filePath: string): T | undefined {
  try {
    if (!existsSync(filePath)) return undefined;
    const raw = readFileSync(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

function isVisibleDir(entry: Dirent): boolean {
  return entry.isDirectory() && !entry.name.startsWith("_") && !entry.name.startsWith(".");
}

export async function GET() {
  const registryDir = getRegistryPath();
  const result: JsonValue[] = [];

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
        const authorMeta = readJsonSafe(join(authorPath, "_meta", "connector.json"));
        if (authorMeta) {
          // Push the author-level meta object exactly as-is
          result.push(authorMeta);
        }
      }
    }
  }

  return NextResponse.json({ connectors: result });
}


