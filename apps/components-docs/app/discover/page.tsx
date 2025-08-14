import {
  listRegistry,
  getIssuePositiveReactionsCountFromMeta,
  getIssuePositiveReactionsCountFromUrl,
} from "@workspace/registry";
import type { ConnectorRootMeta } from "@workspace/registry/types";
import DiscoverGrid from "@/app/discover/DiscoverGrid";

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

// Note: Uppercase versions derived at render time; we only match with lowercase constants above

export default async function DiscoverPage() {
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

      // Clear derivations: sourceType from category, domains from known domain tags,
      // extraction from CDC tag or stream category; everything else becomes display tags
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

      return {
        name: displayName,
        description,
        tags: displayTags,
        icon: `connector-logos/${conn.connectorId}.png`,
        href: `/connectors/${conn.connectorId}`,
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

  return <DiscoverGrid connectors={connectors} />;
}
