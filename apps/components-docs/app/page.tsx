import ConnectorCard from "@/components/connector-card";
import Link from "next/link";
import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";
import { PagefindMeta } from "@/components/pagefind-meta";
import {
  listRegistry,
  getIssuePositiveReactionsCountFromMeta,
  getIssuePositiveReactionsCountFromUrl,
} from "@workspace/registry";
import type { ConnectorRootMeta } from "@workspace/registry/types";
import { Wrench, BadgeCheck, Activity, ScrollText } from "lucide-react";

const valueProps = [
  {
    text: "Easy to tweak for your use case",
    icon: <Wrench />,
  },
  {
    text: "Best practices backed in",
    icon: <BadgeCheck />,
  },
  {
    text: "Easy to monitor, debug and scale",
    icon: <Activity />,
  },
  {
    text: "Own it. MIT License Forever",
    icon: <ScrollText />,
  },
];

function Hero() {
  return (
    <div className="grid grid-cols-2 container max-w-6xl mx-auto gap-5 py-16">
      <div className="flex flex-col gap-10">
        <Badge variant="outline">
          This Project is a WIP. Join our{" "}
          <Link
            href="https://join.slack.com/t/moose-community/shared_invite/zt-2fjh5n3wz-cnOmM9Xe9DYAgQrNu8xKxg"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            slack
          </Link>{" "}
          to get involved
        </Badge>
        <h1 className="text-6xl mb-0">
          Connectors{" "}
          <span className="text-muted-foreground">as copyable code</span>
        </h1>
        <div className="flex flex-row gap-5">
          <Button asChild>
            <Link href="discover">All connectors</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs">Learn More</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <h2 className="text-lg text-muted-foreground">
          A starter kit for building, testing and sharing analytical connectors
          for extracting data and metadata from any anlytical data system.
          Heavily inspired by Shadcn/ui .
        </h2>
        <div className="flex flex-col gap-5 text-lg">
          {valueProps.map((prop) => (
            <div key={prop.text} className="flex flex-row gap-5 items-center">
              {prop.icon}
              {prop.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function Home() {
  // Clear definitions for filter categories (case-insensitive matching)
  const KNOWN_DOMAIN_TAGS_LOWER = new Set<string>([
    "ecommerce",
    "observability",
    "product analytics",
    "cdp",
    "analytics",
    "finance",
    "marketing",
    "sales",
  ]);
  const OPERATIONAL_TAGS_LOWER = new Set<string>(["saas", "database", "api"]);

  const SPECIAL_CAPS: Record<string, string> = {
    api: "API",
    cdp: "CDP",
    cdc: "CDC",
    saas: "SaaS",
  };

  function formatLabel(tag: string): string {
    return tag
      .split(" ")
      .map((word) => {
        const lower = word.toLowerCase();
        if (SPECIAL_CAPS[lower]) return SPECIAL_CAPS[lower];
        return `${lower.charAt(0).toUpperCase()}${lower.slice(1)}`;
      })
      .join(" ");
  }

  const registry = listRegistry();
  const connectors = await Promise.all(
    registry.map(async (conn) => {
      const meta = (conn.root.meta ?? {}) as ConnectorRootMeta;
      const displayName = (meta.title ??
        meta.name ??
        conn.connectorId) as string;
      const description = (meta.description ?? "") as string;
      const rawTags = ((meta.tags ?? []) as string[]).filter(Boolean);
      const category = ((meta.category ?? "") as string).toLowerCase();

      // Normalize tags for comparisons
      const tagsLower = rawTags.map((t) => t.toLowerCase());

      const domainsLower = rawTags
        .filter((t) => KNOWN_DOMAIN_TAGS_LOWER.has(t.toLowerCase()))
        .map((t) => t.toLowerCase());
      const domains = Array.from(new Set(domainsLower)).map(formatLabel);

      const otherTagsLower = tagsLower.filter(
        (t) => !KNOWN_DOMAIN_TAGS_LOWER.has(t) && !OPERATIONAL_TAGS_LOWER.has(t)
      );
      const otherTagsUniqueLower = Array.from(new Set(otherTagsLower));
      const displayTags = otherTagsUniqueLower.map(formatLabel);

      const extraction = ((): "batch" | "stream" => {
        if (tagsLower.includes("cdc") || category === "stream") return "stream";
        return "batch";
      })();
      // Primary provider and implementation details
      const firstProvider = conn.providers[0];
      const language = firstProvider?.implementations?.[0]?.language;
      const implementation =
        firstProvider?.implementations?.[0]?.implementation;
      const version = firstProvider?.path.split("/").slice(-2)[0];

      // Collect all unique languages across providers/implementations
      const languages = Array.from(
        new Set(
          conn.providers.flatMap((p) =>
            p.implementations.map((i) => i.language)
          )
        )
      );
      const comingSoon = languages.length === 0;
      const implementationCount = conn.providers.reduce(
        (sum, p) => sum + p.implementations.length,
        0
      );

      // Aggregate reactions across all provider issue URLs for robustness
      const issueUrlsRaw: Array<string | undefined> = conn.providers.flatMap(
        (p) => {
          const issues = p.meta?.issues ?? {};
          return Object.values(issues).flatMap((v) => {
            if (typeof v === "string") {
              // Ignore legacy string mapping (implicit default)
              return [] as string[];
            }
            // Only include explicit implementation URLs; skip any "default" key
            return Object.entries(v || {})
              .filter(([implKey]) => implKey !== "default")
              .map(([, url]) => url);
          });
        }
      );
      const uniqueIssueUrls = Array.from(
        new Set(issueUrlsRaw.filter((u): u is string => Boolean(u)))
      );
      let reactions = 0;
      if (uniqueIssueUrls.length > 0) {
        const counts = await Promise.all(
          uniqueIssueUrls.map((u) => getIssuePositiveReactionsCountFromUrl(u))
        );
        reactions = counts.reduce((a, b) => a + (b || 0), 0);
      } else if (firstProvider) {
        reactions = await getIssuePositiveReactionsCountFromMeta(
          firstProvider.meta,
          language ?? "",
          implementation
        );
      }

      // Creator avatar image (override > authorId github png > meta.author github png)
      const override = firstProvider?.meta?.avatarUrlOverride?.trim();
      const primaryName = firstProvider?.authorId;
      const secondaryName = firstProvider?.meta?.author?.trim();
      const creatorAvatarUrl =
        override ||
        (primaryName ? `https://github.com/${primaryName}.png` : undefined) ||
        (secondaryName ? `https://github.com/${secondaryName}.png` : undefined);

      // Collect all unique creators across providers for a facestack
      const creatorAvatarUrls = Array.from(
        new Map(
          conn.providers.map((p) => {
            const o = p.meta?.avatarUrlOverride?.trim();
            const primary = p.authorId;
            const secondary = p.meta?.author?.trim();
            const url =
              o ||
              (primary ? `https://github.com/${primary}.png` : undefined) ||
              (secondary ? `https://github.com/${secondary}.png` : undefined);
            return [p.authorId, url] as const;
          })
        ).values()
      )
        .filter((u): u is string => Boolean(u))
        .slice(0, 10);

      const deepHref =
        firstProvider && language && implementation && version
          ? `/connectors/${conn.connectorId}/${version}/${firstProvider.authorId}/${language}/${implementation}`
          : undefined;

      return {
        name: displayName,
        description,
        tags: displayTags,
        icon: `connector-logos/${conn.connectorId}.png`,
        href: deepHref ?? "#",
        sourceType: category ? formatLabel(category) : undefined,
        extraction,
        domains,
        language: language ? formatLabel(language) : undefined,
        languages: languages.map(formatLabel),
        comingSoon,
        implementationCount,
        reactions,
        creatorAvatarUrl,
        creatorAvatarUrls,
      };
    })
  );

  return (
    <div className="font-sans items-center justify-items-center min-h-screen space-y-4">
      <PagefindMeta type="docs" />
      <main className="flex flex-col items-center sm:items-start">
        <Hero />
        {/* Connectors */}
        <div className="mx-auto w-full max-w-6xl px-4  py-6">
          <div className="grid grid-cols-3 gap-5 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {connectors.map((connector) => (
              <ConnectorCard
                key={connector.name}
                name={connector.name}
                description={connector.description}
                icon={connector.icon}
                tags={connector.tags}
                href={connector.href}
                language={connector.language}
                languages={connector.languages}
                sourceType={connector.sourceType}
                domains={connector.domains}
                comingSoon={connector.comingSoon}
                implementationCount={connector.implementationCount}
                reactions={connector.reactions}
                creatorAvatarUrl={connector.creatorAvatarUrl}
                creatorAvatarUrls={connector.creatorAvatarUrls}
              />
            ))}
          </div>
        </div>
      </main>
      <footer className="flex flex-wrap items-center justify-center py-20">
        <span>
          Inspired by
          <Link
            className="pl-1 underline"
            href="https://ui.shadcn.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            shadcn/ui
          </Link>
        </span>
        <span>
          , Created with ❤️ by the folks at
          <Link
            className="pl-1 underline"
            href="https://www.fiveonefour.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            514 Labs
          </Link>
        </span>
      </footer>
    </div>
  );
}
