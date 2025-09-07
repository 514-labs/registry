import { listPipelines } from "@workspace/registry/pipelines";
import type {
  PipelineRootMeta,
  PipelineProviderMeta,
} from "@workspace/registry/pipelines";
import { existsSync } from "fs";
import { join } from "path";

export type DiscoverPipeline = {
  name: string;
  description: string;
  icon: string; // path relative to public
  href: string;
  tags: string[];

  languages?: string[];
  comingSoon?: boolean;
  implementationCount?: number;

  // Optional meta visualizations / filters
  sourceType?: string;
  extraction?: "batch" | "stream";
  domains?: string[];

  // Scheduling and endpoints
  scheduleCron?: string;
  scheduleTimezone?: string;
  sourceSystem?: string;
  destinationSystem?: string;
  fromIcon?: string;
  toIcon?: string;

  // Creators
  creatorAvatarUrl?: string;
  creatorAvatarUrls?: string[];
};

// Filter helpers (case-insensitive)
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

// Resolve an icon under public/pipeline-logos with any common extension
function getPublicLogoPath(basename: string): string | undefined {
  const candidateDirs = [
    // When process.cwd() is app root (next dev/build from apps/pipelines-docs)
    join(process.cwd(), "public", "pipeline-logos"),
    // When process.cwd() is monorepo root (run from workspace root)
    join(process.cwd(), "apps", "pipelines-docs", "public", "pipeline-logos"),
  ];
  const exts = [".svg", ".png", ".webp", ".jpg", ".jpeg"];
  for (const dir of candidateDirs) {
    for (const ext of exts) {
      const fp = join(dir, `${basename}${ext}`);
      if (existsSync(fp)) return `/pipeline-logos/${basename}${ext}`;
    }
  }
  return undefined;
}

export function buildDiscoverPipelines(): DiscoverPipeline[] {
  const registry = listPipelines();
  const pipelines = registry.map((p) => {
    const rootMeta = (p.root.meta ?? {}) as PipelineRootMeta;
    const displayName = (rootMeta.name ?? p.pipelineId) as string;
    const description = (rootMeta.description ?? "") as string;
    const rawTags = ((rootMeta.tags ?? []) as string[]).filter(Boolean);

    const firstProvider = p.providers[0];
    const firstMeta = (firstProvider?.meta ?? {}) as PipelineProviderMeta;

    // Collect languages
    const languages = Array.from(
      new Set(
        p.providers.flatMap((prov) =>
          prov.implementations.map((i) => i.language)
        )
      )
    );
    const comingSoon = languages.length === 0;
    const implementationCount = p.providers.reduce(
      (sum, prov) => sum + prov.implementations.length,
      0
    );

    // Avatars (override > authorId > meta.author)
    const override = firstMeta.avatarUrlOverride?.trim();
    const primaryName = firstProvider?.authorId;
    const secondaryName = firstMeta.author?.trim();
    const creatorAvatarUrl =
      override ||
      (primaryName ? `https://github.com/${primaryName}.png` : undefined) ||
      (secondaryName ? `https://github.com/${secondaryName}.png` : undefined);
    const creatorAvatarUrls = Array.from(
      new Map(
        p.providers.map((prov) => {
          const o = prov.meta?.avatarUrlOverride?.trim();
          const primary = prov.authorId;
          const secondary = prov.meta?.author?.trim();
          const url =
            o ||
            (primary ? `https://github.com/${primary}.png` : undefined) ||
            (secondary ? `https://github.com/${secondary}.png` : undefined);
          return [prov.authorId, url] as const;
        })
      ).values()
    )
      .filter((u): u is string => Boolean(u))
      .slice(0, 10);

    // Destination and schedule (source derived from pipelineId if not specified)
    const destinationSystem = (firstMeta.destination as any)?.system as
      | string
      | undefined;
    const scheduleCron = firstMeta.schedule?.cron;
    const scheduleTimezone = firstMeta.schedule?.timezone;
    let sourceSystem: string | undefined = (firstMeta.source as any)?.connector
      ?.name as string | undefined;
    if (!sourceSystem) {
      const parts = p.pipelineId.split("-to-");
      if (parts.length === 2) sourceSystem = parts[0];
    }

    const tagsLower = rawTags.map((t) => t.toLowerCase());
    const domainsLower = tagsLower.filter((t) =>
      KNOWN_DOMAIN_TAGS_LOWER.has(t)
    );
    const domains = Array.from(new Set(domainsLower)).map(formatLabel);
    const otherTagsLower = tagsLower.filter(
      (t) => !KNOWN_DOMAIN_TAGS_LOWER.has(t) && !OPERATIONAL_TAGS_LOWER.has(t)
    );
    const displayTags = Array.from(new Set(otherTagsLower)).map(formatLabel);

    const iconPath =
      getPublicLogoPath(p.pipelineId) ?? `pipeline-logos/${p.pipelineId}.png`;

    // Deep link to first available implementation
    const firstVersion = firstProvider?.path.split("/").slice(-2)[0];
    const firstLanguage = firstProvider?.implementations?.[0]?.language;
    const firstImplementation =
      firstProvider?.implementations?.[0]?.implementation;
    const deepHref =
      firstProvider && firstVersion && firstLanguage && firstImplementation
        ? `/pipelines/${p.pipelineId}/${firstVersion}/${firstProvider.authorId}/${firstLanguage}/${firstImplementation}`
        : "#";

    return {
      name: displayName,
      description,
      tags: displayTags,
      icon: iconPath,
      href: deepHref,
      languages: languages.map(formatLabel),
      comingSoon,
      implementationCount,
      creatorAvatarUrl,
      creatorAvatarUrls,
      sourceSystem,
      destinationSystem,
      scheduleCron,
      scheduleTimezone,
      fromIcon: getPublicLogoPath(`${p.pipelineId}-from`),
      toIcon: getPublicLogoPath(`${p.pipelineId}-to`),
      domains,
    } as DiscoverPipeline;
  });

  return pipelines;
}
