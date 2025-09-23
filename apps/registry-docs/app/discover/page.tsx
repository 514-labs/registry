import {
  buildDiscoverConnectors,
  buildDiscoverPipelines,
} from "@/lib/discover";
import { DiscoveryGridDetailed } from "./discovery-grids";

export default async function DiscoverPage() {
  const [connectors, pipelines] = await Promise.all([
    buildDiscoverConnectors(),
    buildDiscoverPipelines(),
  ]);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 xl:px-0 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Discover</h1>
        <p className="text-muted-foreground mt-1">
          Browse and discover connectors and pipelines for your data
          infrastructure
        </p>
      </div>
      <DiscoveryGridDetailed connectors={connectors} pipelines={pipelines} />
    </div>
  );
}
