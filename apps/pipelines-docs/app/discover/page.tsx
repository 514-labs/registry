export const dynamic = "force-static";
export const revalidate = false;

import DiscoverGrid from "@/app/discover/DiscoverGrid";
import { buildDiscoverPipelines } from "@/lib/discover";

export default async function DiscoverPage() {
  const pipelines = buildDiscoverPipelines();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 xl:px-0 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Discover pipelines</h1>
      </div>
      <DiscoverGrid pipelines={pipelines} />
    </div>
  );
}
