import Image from "next/image";
import { Badge } from "@ui/components/badge";
import Link from "next/link";
import { GitBranch, Code2, Wrench } from "lucide-react";
import { SiGithub } from "@icons-pack/react-simple-icons";
import ComboBox from "@/components/combobox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/components/tabs";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
import { marked } from "marked";
import { PagefindMeta } from "@/components/pagefind-meta";

import {
  getPipelineLineageDiagramInputs,
  getMooseLineageGraph,
} from "@/src/schema/processing";
import { listPipelineIds, readPipeline } from "@workspace/registry/pipelines";
import PipelineLineageDiagram from "@/components/pipeline-lineage-diagram";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = {
  pipeline: string;
  version: string;
  creator: string;
  language: string;
  implementation: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const pipeline of listPipelineIds()) {
    const p = readPipeline(pipeline);
    if (!p) continue;
    for (const provider of p.providers) {
      const version = provider.path.split("/").slice(-2)[0];
      for (const impl of provider.implementations) {
        params.push({
          pipeline,
          version,
          creator: provider.authorId,
          language: impl.language,
          implementation: impl.implementation ?? "default",
        });
      }
    }
  }
  return params;
}

export default async function PipelineImplementationPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { pipeline, version, creator, language, implementation } = await params;
  const sp = await searchParams;

  const reg = readPipeline(pipeline);
  if (!reg) return null;

  const provider = reg.providers.find((p) => {
    const pVersion = p.path.split("/").slice(-2)[0];
    return p.authorId === creator && pVersion === version;
  });
  if (!provider) return null;

  const implEntry =
    provider.implementations.find(
      (impl) =>
        impl.language === language && impl.implementation === implementation
    ) ?? provider.implementations.find((impl) => impl.language === language);
  if (!implEntry) return null;

  const meta = reg.root.meta;
  const displayName = meta?.title ?? meta?.name ?? reg.pipelineId;
  const description = meta?.description ?? "";
  const tags = meta?.tags ?? [];

  // URLs
  const registryUrl =
    meta?.registryUrl ??
    `https://github.com/514-labs/factory/tree/main/pipeline-registry/${pipeline}/${version}/${creator}`;

  // Build lists and navigation helpers
  const getProviderVersion = (pPath: string): string =>
    pPath.split("/").slice(-2)[0];
  const versions = Array.from(
    new Set(reg.providers.map((p) => getProviderVersion(p.path)))
  );
  const creatorsForVersion = Array.from(
    new Set(
      reg.providers
        .filter((p) => getProviderVersion(p.path) === version)
        .map((p) => p.authorId)
    )
  );
  const languages = Array.from(
    new Set(provider.implementations.map((i) => i.language))
  );
  const implementationsForLanguage = provider.implementations
    .filter((i) => i.language === language)
    .map((i) => i.implementation);

  // Discover docs in the selected implementation folder
  const docsDir = join(implEntry.path, "docs");
  const docFiles = existsSync(docsDir)
    ? readdirSync(docsDir)
        .filter(
          (f) =>
            f.toLowerCase().endsWith(".md") || f.toLowerCase().endsWith(".mdx")
        )
        .sort()
    : ([] as string[]);

  type DocPage = { slug: string; title: string; html: string };
  const preferredOrder = [
    "getting-started",
    "installation",
    "configuration",
    "usage",
    "examples",
    "limits",
    "troubleshooting",
    "faq",
  ];
  const docs: DocPage[] = docFiles
    .map((file) => {
      const filePath = join(docsDir, file);
      const raw = readFileSync(filePath, "utf-8");
      const firstHeadingMatch = raw.match(/^#\s+(.+)$/m);
      const title =
        firstHeadingMatch?.[1]?.trim() || file.replace(/\.(md|mdx)$/i, "");
      const slug = file.replace(/\.(md|mdx)$/i, "");
      const html = marked.parse(raw) as string;
      return { slug, title, html } as DocPage;
    })
    .sort((a, b) => {
      const ia = preferredOrder.indexOf(a.slug);
      const ib = preferredOrder.indexOf(b.slug);
      if (ia !== -1 && ib !== -1) return ia - ib;
      if (ia !== -1) return -1;
      if (ib !== -1) return 1;
      return a.slug.localeCompare(b.slug);
    });

  const defaultTab =
    docs.find((d) => d.slug === (Array.isArray(sp.page) ? sp.page[0] : sp.page))
      ?.slug ||
    docs.find((d) => d.slug === "getting-started")?.slug ||
    docs[0]?.slug;

  // Preload creator avatars for the current version
  const providersForVersion = reg.providers.filter(
    (p) => getProviderVersion(p.path) === version
  );
  const creatorAvatarsEntries = providersForVersion.map((p) => {
    const override = p.meta?.avatarUrlOverride?.trim();
    const primaryName = p.authorId;
    const secondaryName = p.meta?.author?.trim();
    const avatar =
      override ||
      (primaryName ? `https://github.com/${primaryName}.png` : null) ||
      (secondaryName ? `https://github.com/${secondaryName}.png` : null);
    return [p.authorId, avatar] as const;
  });
  const creatorAvatars: Record<string, string | null> = Object.fromEntries(
    creatorAvatarsEntries
  );

  const firstImplForLanguage = (prov: typeof provider, lang: string) => {
    const impls = prov.implementations.filter((i) => i.language === lang);
    return impls.length > 0 ? impls[0].implementation : "default";
  };

  const getDefaultLanguage = (prov: typeof provider) =>
    prov.implementations[0]?.language ?? language;

  const pathFor = (v: string, c: string, l?: string, im?: string): string => {
    const targetProvider =
      reg.providers.find(
        (p) => p.authorId === c && getProviderVersion(p.path) === v
      ) || reg.providers.find((p) => getProviderVersion(p.path) === v)!;

    const lang = l ?? getDefaultLanguage(targetProvider);
    const impl =
      im ?? firstImplForLanguage(targetProvider, lang ?? language) ?? "default";
    return `/pipelines/${pipeline}/${v}/${targetProvider.authorId}/${lang}/${impl}`;
  };

  // Attempt to show from → to logos when available
  const fromLogo = `/pipeline-logos/${reg.pipelineId}-from.png`;
  const toLogo = `/pipeline-logos/${reg.pipelineId}-to.png`;

  return (
    <div className="container mx-auto py-16 ">
      <PagefindMeta type="pipeline" />
      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-3">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Image
                src={fromLogo}
                alt={`from logo`}
                width={32}
                height={32}
                className="h-8 w-8 rounded-sm object-contain "
              />
              <span className="text-muted-foreground">→</span>
              <Image
                src={toLogo}
                alt={`to logo`}
                width={32}
                height={32}
                className="h-8 w-8 rounded-sm object-contain "
              />
            </div>
            <h1 className="text-2xl ">{displayName}</h1>
            <div className="flex flex-wrap gap-2 items-center">
              {tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}

              <Badge variant="secondary">
                <Link href={registryUrl} className="flex items-center gap-1">
                  <SiGithub className="size-3" />
                  <span>Source</span>
                </Link>
              </Badge>
            </div>
            <p className="text-muted-foreground">{description}</p>

            <div className="grid grid-cols-1 gap-2 ">
              <ComboBox
                withAvatars
                size="lg"
                value={creator}
                items={creatorsForVersion.map((c) => ({
                  value: c,
                  label: c,
                  href: pathFor(version, c),
                  avatarUrl: creatorAvatars[c] ?? undefined,
                }))}
                placeholder="Select author"
                disabled={creatorsForVersion.length <= 1}
              />

              <ComboBox
                withIcons
                size="lg"
                value={version}
                items={versions.map((v) => ({
                  value: v,
                  label: v,
                  href: pathFor(v, creator),
                  icon: <GitBranch />,
                }))}
                placeholder="Select version"
                disabled={versions.length <= 1}
              />

              <ComboBox
                withIcons
                size="lg"
                value={language}
                items={languages.map((l) => ({
                  value: l,
                  label: l,
                  href: pathFor(version, creator, l),
                  icon: <Code2 />,
                }))}
                placeholder="Select language"
                disabled={languages.length <= 1}
              />

              <ComboBox
                withIcons
                size="lg"
                value={implEntry.implementation}
                items={implementationsForLanguage.map((im) => ({
                  value: im,
                  label: im,
                  href: pathFor(version, creator, language, im),
                  icon: <Wrench />,
                }))}
                placeholder="Select implementation"
                disabled={implementationsForLanguage.length <= 1}
              />
            </div>
          </div>
        </div>

        <div className="col-span-9 space-y-8">
          <h1 className="text-2xl">Lineage</h1>
          {(() => {
            const sourceName =
              ((provider.meta as any)?.source?.connector?.name as
                | string
                | undefined) ||
              reg.pipelineId.split("-to-")[0] ||
              "Source";
            const destinationName =
              ((provider.meta as any)?.destination?.system as
                | string
                | undefined) ||
              reg.pipelineId.split("-to-")[1] ||
              "Destination";
            const transformations = Array.isArray(
              (provider.meta as any)?.transformations
            )
              ? (
                  (provider.meta as any)?.transformations as Array<
                    Record<string, any>
                  >
                ).map((t) => ({
                  name: (t as any).name ?? undefined,
                  type: (t as any).type ?? undefined,
                  description: (t as any).description ?? undefined,
                }))
              : [];
            const { database } = getPipelineLineageDiagramInputs(
              implEntry.path
            );
            const moose = getMooseLineageGraph(implEntry.path);
            const schemaTables = (database?.tables ?? []).map((t) => ({
              label: t.label,
              columns: (t.columns ?? []).map((c) => ({
                name: c.name,
                type: c.type,
              })),
            }));
            return (
              <PipelineLineageDiagram
                sourceName={sourceName}
                sourceIcon={fromLogo}
                destinationName={destinationName}
                destinationIcon={toLogo}
                transformations={transformations}
                schemaTables={schemaTables}
                mooseGraph={moose}
              />
            );
          })()}

          {docs.length === 0 ? (
            <div className="prose dark:prose-invert">
              <h1>Documentation</h1>
              <p className="text-muted-foreground">
                No docs found for this implementation.
              </p>
              <div className="text-sm text-muted-foreground mt-4">
                <div>Version: {version}</div>
                <div>Creator: {creator}</div>
                <div>Language: {language}</div>
                <div>Implementation: {implEntry.implementation}</div>
              </div>
            </div>
          ) : (
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList>
                {docs.map((d) => (
                  <TabsTrigger key={d.slug} value={d.slug}>
                    {d.title}
                  </TabsTrigger>
                ))}
              </TabsList>
              {docs.map((d) => (
                <TabsContent key={d.slug} value={d.slug}>
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: d.html }}
                  />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
