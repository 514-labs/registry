import DiscoverGrid from "@/app/discover/DiscoverGrid";
import { buildDiscoverConnectors } from "@/lib/discover";

export default async function DiscoverPage() {
  const connectors = await buildDiscoverConnectors();
  return (
    <div className="mx-auto w-full max-w-6xl px-4 xl:px-0 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Discover connectors</h1>
      </div>
      <DiscoverGrid connectors={connectors} />
    </div>
  );
}
