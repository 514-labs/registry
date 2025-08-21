import { NextResponse } from "next/server";
import { listPipelines } from "@workspace/registry/pipelines";

export const dynamic = "force-static";

export async function GET() {
  // Flatten to a list of pipeline permutations suitable for the installer
  // Shape: [{ name, version, author, language, implementation }]
  const pipelines = listPipelines();

  // Re-derive properties accurately since we have all components in paths
  const accurate = pipelines.flatMap((p) =>
    p.providers.flatMap((provider) =>
      provider.implementations.map((impl) => {
        // provider.path: pipeline-registry/<id>/<version>/<author>
        const parts = provider.path.split("/");
        const len = parts.length;
        const version = parts[len - 2];
        const author = parts[len - 1];
        return {
          name: p.pipelineId,
          version,
          author,
          language: impl.language,
          implementation: impl.implementation,
        };
      })
    )
  );

  return NextResponse.json(accurate);
}
