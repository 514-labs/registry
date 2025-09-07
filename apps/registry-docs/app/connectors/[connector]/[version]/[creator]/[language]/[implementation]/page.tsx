import Image from "next/image";
import { Badge } from "@ui/components/badge";
// import { Card } from "@ui/components/card";
// import { cn } from "@/lib/utils";
import {
  listConnectorIds,
  readConnector,
} from "@workspace/registry/connectors";
import { getIssuePositiveReactionsCountFromMeta } from "@workspace/registry";
import { PagefindMeta } from "@/components/pagefind-meta";
import { GitBranch, Code2, Wrench } from "lucide-react";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import ComboBox from "@/components/combobox";
// import { Separator } from "@ui/components/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/components/tabs";
import { existsSync, readdirSync, readFileSync } from "fs";
import { join } from "path";
// Render docs with markdown so we can enhance code blocks with our Snippet UI

import { MarkdownContent } from "@ui/components/markdown-content";
import SchemaDiagram from "@/components/schema-diagram";
import ConnectorImplSidebar from "@/components/connector-impl-sidebar";
import { getSchemaDiagramInputs } from "@/src/schema/processing";

export const dynamic = "force-static";
export const dynamicParams = false;

type Params = {
  connector: string;
  version: string;
  creator: string;
  language: string;
  implementation: string;
};

export async function generateStaticParams(): Promise<Params[]> {
  const params: Params[] = [];
  for (const connector of listConnectorIds()) {
    const conn = readConnector(connector);
    if (!conn) continue;
    for (const provider of conn.providers) {
      const version = provider.path.split("/").slice(-2)[0];
      for (const impl of provider.implementations) {
        params.push({
          connector,
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

export default async function ConnectorImplementationPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { connector, version, creator, language, implementation } =
    await params;
  const sp = await searchParams;
  // const page = (Array.isArray(sp.page) ? sp.page[0] : sp.page) ?? "readme";

  const conn = readConnector(connector);
  if (!conn) return null;

  const provider = conn.providers.find((p) => {
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

  const meta = conn.root.meta;
  const displayName = meta?.name ?? conn.connectorId;
  const description = meta?.description ?? "";
  const tags = meta?.tags ?? [];

  const reactions = await getIssuePositiveReactionsCountFromMeta(
    provider.meta,
    implEntry.language,
    implEntry.implementation
  );

  // Get URLs from metadata
  const registryUrl =
    provider.meta?.registryUrl ??
    meta?.registryUrl ??
    `https://github.com/514-labs/factory/tree/main/connector-registry/${connector}/${version}/${creator}`;

  // Get issue URL for current language/implementation
  const issueValue = provider.meta?.issues?.[implEntry.language];
  const issueUrl =
    typeof issueValue === "string"
      ? issueValue
      : issueValue && typeof issueValue === "object"
        ? (issueValue[implEntry.implementation] ?? issueValue["default"])
        : `https://github.com/514-labs/factory/issues`;

  // Build lists and navigation helpers
  const getProviderVersion = (pPath: string): string =>
    pPath.split("/").slice(-2)[0];
  const versions = Array.from(
    new Set(conn.providers.map((p) => getProviderVersion(p.path)))
  );
  const creatorsForVersion = Array.from(
    new Set(
      conn.providers
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

  type DocPage = { slug: string; title: string; content: string };
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
      const content = raw;
      return { slug, title, content } as DocPage;
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
  const providersForVersion = conn.providers.filter(
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
      conn.providers.find(
        (p) => p.authorId === c && getProviderVersion(p.path) === v
      ) ?? conn.providers.find((p) => getProviderVersion(p.path) === v)!;

    const lang = l ?? getDefaultLanguage(targetProvider);
    const impl =
      im ?? firstImplForLanguage(targetProvider, lang ?? language) ?? "default";
    return `/connectors/${connector}/${v}/${targetProvider.authorId}/${lang}/${impl}`;
  };

  return (
    <div className="container mx-auto py-16 ">
      <PagefindMeta type="connector" />
      <div className="grid grid-cols-12 gap-16">
        <div className="col-span-3">
          <ConnectorImplSidebar
            logoSrc={`/connector-logos/${conn.connectorId}.png`}
            title={displayName}
            identifier={conn.connectorId}
            description={description}
            tags={tags}
            sourceHref={registryUrl}
            reactionsHref={issueUrl}
            reactionsCount={reactions}
            creators={creatorsForVersion.map((c) => ({
              value: c,
              label: c,
              href: pathFor(version, c),
            }))}
            versions={versions.map((v) => ({
              value: v,
              label: v,
              href: pathFor(v, creator),
            }))}
            languages={languages.map((l) => ({
              value: l,
              label: l,
              href: pathFor(version, creator, l),
            }))}
            implementations={implementationsForLanguage.map((im) => ({
              value: im,
              label: im,
              href: pathFor(version, creator, language, im),
            }))}
            selectedCreator={creator}
            selectedVersion={version}
            selectedLanguage={language}
            selectedImplementation={implEntry.implementation}
          />
        </div>
        <div className="col-span-9 space-y-8">
          {(() => {
            const { database, endpoints, files, errors } =
              getSchemaDiagramInputs(implEntry.path);
            return (
              <SchemaDiagram
                database={database}
                endpoints={endpoints}
                files={files}
                errors={errors}
                connectorName={displayName}
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
                  <MarkdownContent content={d.content} />
                </TabsContent>
              ))}
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
