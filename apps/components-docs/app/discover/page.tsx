import { listRegistry } from "@workspace/registry";
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

export default function DiscoverPage() {
  const registry = listRegistry();
  const connectors = registry.map((conn) => {
    const meta = (conn.root.meta ?? {}) as ConnectorRootMeta;
    const displayName = (meta.title ?? meta.name ?? conn.connectorId) as string;
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
    return {
      name: displayName,
      description,
      tags: displayTags,
      icon: `connector-logos/${conn.connectorId}.png`,
      href: `/connectors/${conn.connectorId}`,
      sourceType: category ? formatLabel(category) : undefined,
      extraction,
      domains,
    };
  });

  return <DiscoverGrid connectors={connectors} />;
}
