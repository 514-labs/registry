import type { DiscoverConnector, DiscoverPipeline } from "@/lib/discover";
import { DiscoveryGridDetailed } from "./discovery-grids";
import { readFile } from "fs/promises";
import { join } from "path";

async function getDiscoverData(): Promise<{
  connectors: DiscoverConnector[];
  pipelines: DiscoverPipeline[];
}> {
  // Read from pre-generated JSON files in public directory
  // These are generated during build by scripts/generate-registry-data.ts
  const publicDir = join(process.cwd(), "public", "api", "discover");

  try {
    const [connectorsJson, pipelinesJson] = await Promise.all([
      readFile(join(publicDir, "connectors.json"), "utf-8"),
      readFile(join(publicDir, "pipelines.json"), "utf-8"),
    ]);

    return {
      connectors: JSON.parse(connectorsJson),
      pipelines: JSON.parse(pipelinesJson),
    };
  } catch (error) {
    console.error("Failed to read discover data:", error);
    return { connectors: [], pipelines: [] };
  }
}

export default async function DiscoverPage() {
  const { connectors, pipelines } = await getDiscoverData();
  return (
    <div className="mx-auto w-full max-w-6xl p-5 xl:px-0">
      <div className="mb-6 py-30">
        <h1 className="text-5xl">Discover</h1>
        <p className="text-muted-foreground mt-1">
          Browse and discover connectors and pipelines for your data
          infrastructure
        </p>
      </div>
      <DiscoveryGridDetailed connectors={connectors} pipelines={pipelines} />
    </div>
  );
}
