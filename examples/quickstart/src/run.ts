import { config as loadEnv } from "dotenv";
import { mkdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { JsonPlaceholderConnector } from "./connector/jsonplaceholder";
import { createLoggingHook } from "./hooks/logging";

// Load .env if present
loadEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load pipeline.json (minimal fields used for this example)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pipeline = (await import(join(__dirname, "../pipeline.json"), { with: { type: "json" } })) as any;

async function ensureDir(path: string): Promise<void> {
  mkdirSync(path, { recursive: true });
}

function writeTextFile(path: string, content: string) {
  ensureDir(dirname(path));
  writeFileSync(path, content, { encoding: "utf-8" });
}

async function main() {
  const isTest = process.argv.includes("--test");

  const hooks = [createLoggingHook()];
  const connector = new JsonPlaceholderConnector({}, hooks);

  console.log("[runner] initializing connector...");
  await connector.initialize();

  const rawDir = join(__dirname, "../data/raw");
  const processedDir = join(__dirname, "../data/processed");
  await ensureDir(rawDir);
  await ensureDir(processedDir);

  const stream = pipeline.source?.stream ?? "posts";
  if (stream !== "posts") {
    console.warn(`[runner] Unsupported stream '${stream}', defaulting to 'posts'`);
  }

  const limit = isTest ? 5 : 25;
  console.log(`[runner] fetching ${limit} posts...`);

  const rawItems: unknown[] = [];
  for await (const post of connector.listPosts(limit)) {
    rawItems.push(post);
  }

  const rawPath = join(rawDir, "posts.json");
  writeTextFile(rawPath, JSON.stringify(rawItems, null, 2));
  console.log(`[runner] wrote raw: ${rawPath}`);

  const projected = (rawItems as any[]).map((p) => ({ id: p.id, title: p.title }));
  const ndjson = projected.map((p) => JSON.stringify(p)).join("\n") + "\n";
  const processedPath = join(processedDir, "posts.ndjson");
  writeTextFile(processedPath, ndjson);
  console.log(`[runner] wrote processed: ${processedPath}`);

  console.log("[runner] done.");
}

main().catch((err) => {
  console.error("[runner] fatal error", err);
  process.exit(1);
});