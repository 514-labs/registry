import { NextResponse } from "next/server";
import { basename, dirname } from "path";
import { listPipelines } from "@workspace/registry/pipelines";

export const dynamic = "force-static";

export async function GET() {
  const pipelines = listPipelines();

  const items = pipelines.flatMap((p) =>
    p.providers.flatMap((provider) =>
      provider.implementations.map((impl) => {
        const version = basename(dirname(provider.path));
        const author = provider.authorId;
        const tags = provider.meta?.tags ?? p.root.meta?.tags ?? [];
        const description =
          provider.meta?.description ?? p.root.meta?.description ?? "";
        const homepage = p.root.meta?.homepage;

        const providerBaseUrl =
          p.root.meta?.registryUrl ??
          `https://github.com/514-labs/factory/tree/main/pipeline-registry/${p.pipelineId}/${version}/${author}`;

        const githubUrl =
          impl.implementation === "default"
            ? `${providerBaseUrl}/${impl.language}`
            : `${providerBaseUrl}/${impl.language}/${impl.implementation}`;

        return {
          type: "pipeline",
          id: p.pipelineId,
          name: p.root.meta?.name ?? p.pipelineId,
          version,
          author,
          language: impl.language,
          implementation: impl.implementation,
          tags,
          description,
          homepage,
          githubUrl,
          providerGithubUrl: providerBaseUrl,
        };
      })
    )
  );

  return NextResponse.json(items);
}
