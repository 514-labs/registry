import Image from "next/image";
import { Badge } from "@ui/components/badge";
// import { Card } from "@ui/components/card";
// import { cn } from "@/lib/utils";
import { PagefindMeta } from "@/components/pagefind-meta";
import { GitBranch, Code2, Wrench } from "lucide-react";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import ComboBox from "@/components/combobox";
// import { Separator } from "@ui/components/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@ui/components/tabs";
import { readFileSync } from "fs";
import { join } from "path";
// Render docs with markdown so we can enhance code blocks with our Snippet UI

import { MarkdownContent } from "@ui/components/markdown-content";
import SchemaDiagram from "@/components/schema-diagram";
import ConnectorImplSidebar from "@/components/connector-impl-sidebar";

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
  // Read from pre-generated registry-contents.json
  const registryPath = join(process.cwd(), "public", "registry-contents.json");
  const registryData = JSON.parse(readFileSync(registryPath, "utf-8"));

  const params: Params[] = [];
  for (const item of registryData.items) {
    if (item.type === "connector") {
      params.push({
        connector: item.id,
        version: item.version,
        creator: item.authorId,
        language: item.language,
        implementation: item.implementation,
      });
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

  // Read from pre-generated JSON files
  const connectorOverviewPath = join(
    process.cwd(),
    "public",
    "api",
    "connectors",
    `${connector}.json`
  );
  const connectorOverview = JSON.parse(
    readFileSync(connectorOverviewPath, "utf-8")
  );

  const implDetailPath = join(
    process.cwd(),
    "public",
    "api",
    "connectors",
    connector,
    version,
    creator,
    language,
    `${implementation}.json`
  );
  const implDetail = JSON.parse(readFileSync(implDetailPath, "utf-8"));

  // Extract data from JSON
  const displayName = implDetail.name;
  const description = implDetail.description;
  const tags = implDetail.tags ?? [];
  const reactions = implDetail.reactions ?? 0;
  const registryUrl = implDetail.urls.registry;
  const issueUrl = implDetail.urls.issue;
  const viewSourceUrl = implDetail.urls.source;

  // Build navigation data from connector overview
  const versions = connectorOverview.versions as string[];
  const providersForVersion = connectorOverview.providers.filter(
    (p: any) => p.version === version
  );
  const creatorsForVersion = providersForVersion.map((p: any) => p.authorId) as string[];

  const currentProvider = connectorOverview.providers.find(
    (p: any) => p.authorId === creator && p.version === version
  );
  if (!currentProvider) return null;

  const languages = Array.from(
    new Set(currentProvider.implementations.map((i: any) => i.language))
  ) as string[];
  const implementationsForLanguage = currentProvider.implementations
    .filter((i: any) => i.language === language)
    .map((i: any) => i.implementation) as string[];

  // Creator avatars
  const creatorAvatars: Record<string, string | null> = Object.fromEntries(
    providersForVersion.map((p: any) => [p.authorId, p.avatarUrl])
  );

  // Docs from implDetail
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
  const docs: DocPage[] = (implDetail.docs ?? []).sort((a: DocPage, b: DocPage) => {
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

  // Helper functions for navigation
  const firstImplForLanguage = (prov: any, lang: string) => {
    const impls = prov.implementations.filter((i: any) => i.language === lang);
    return impls.length > 0 ? impls[0].implementation : "default";
  };

  const getDefaultLanguage = (prov: any) =>
    prov.implementations[0]?.language ?? language;

  const pathFor = (v: string, c: string, l?: string, im?: string): string => {
    const targetProvider =
      connectorOverview.providers.find(
        (p: any) => p.authorId === c && p.version === v
      ) ?? connectorOverview.providers.find((p: any) => p.version === v);

    if (!targetProvider) return `/connectors/${connector}`;

    const lang = l ?? getDefaultLanguage(targetProvider);
    const impl =
      im ?? firstImplForLanguage(targetProvider, lang ?? language) ?? "default";
    return `/connectors/${connector}/${v}/${targetProvider.authorId}/${lang}/${impl}`;
  };

  return (
    <div className="container mx-auto py-16 px-5 lg:px-0">
      <PagefindMeta type="connector" />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16">
        <div className="lg:col-span-3">
          <div className="sticky top-24 h-fit">
          <ConnectorImplSidebar
            logoSrc={`/connector-logos/${connector}.png`}
            title={displayName}
            identifier={connector}
            description={description}
            tags={tags}
            sourceHref={registryUrl}
            reactionsHref={issueUrl}
            reactionsCount={reactions}
            viewSourceHref={viewSourceUrl}
            creators={creatorsForVersion.map((c: string) => ({
              value: c,
              label: c,
              href: pathFor(version, c),
            }))}
            versions={versions.map((v: string) => ({
              value: v,
              label: v,
              href: pathFor(v, creator),
            }))}
            languages={languages.map((l: string) => ({
              value: l,
              label: l,
              href: pathFor(version, creator, l),
            }))}
            implementations={implementationsForLanguage.map((im: string) => ({
              value: im,
              label: im,
              href: pathFor(version, creator, language, im),
            }))}
            selectedCreator={creator}
            selectedVersion={version}
            selectedLanguage={language}
            selectedImplementation={implementation}
          />
          </div>
        </div>
        <div className="lg:col-span-9 space-y-8">
          <SchemaDiagram
            database={implDetail.schema.database}
            endpoints={implDetail.schema.endpoints}
            files={implDetail.schema.files}
            errors={implDetail.schema.errors}
            connectorName={displayName}
          />
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
                <div>Implementation: {implementation}</div>
              </div>
            </div>
          ) : (
            <Tabs defaultValue={defaultTab} className="w-full">
              <div className="w-full overflow-x-auto lg:overflow-visible">
                <TabsList className="w-full lg:w-auto lg:min-w-0 rounded-lg">
                  {docs.map((d) => (
                    <TabsTrigger key={d.slug} value={d.slug} className="whitespace-nowrap">
                      {d.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
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
