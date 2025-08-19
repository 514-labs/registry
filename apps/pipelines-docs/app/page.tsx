import PipelineCard from "@/components/pipeline-card";
import Link from "next/link";
import { Button } from "@ui/components/button";
import { Badge } from "@ui/components/badge";
import { PagefindMeta } from "@/components/pagefind-meta";
import { listPipelines } from "@workspace/registry/pipelines";
import type {
  PipelineRootMeta,
  PipelineProviderMeta,
} from "@workspace/registry/pipelines";
import { Wrench, BadgeCheck, Activity, ScrollText } from "lucide-react";
import { existsSync } from "fs";
import { join } from "path";

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
          Pipelines{" "}
          <span className="text-muted-foreground">as copyable code</span>
        </h1>
        <div className="flex flex-row gap-5">
          <Button asChild>
            <Link href="discover">All pipelines</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/docs">Learn More</Link>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-10">
        <h2 className="text-lg text-muted-foreground">
          A starter kit for building, testing and sharing pipelines to move data
          from a source and landing it in an analytical data system. Built on
          the{" "}
          <Link
            href="https://docs.fiveonefour.com/moose"
            className=" text-primary"
          >
            MooseStack
          </Link>{" "}
          and heavily inspired by{" "}
          <Link href="https://ui.shadcn.com" className="text-primary">
            Shadcn/ui
          </Link>
          .
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

  const registry = listPipelines();
  // Helper to resolve an icon under public/pipeline-logos with any common extension
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
  const pipelines = await Promise.all(
    registry.map(async (p) => {
      const rootMeta = (p.root.meta ?? {}) as PipelineRootMeta;
      const displayName = (rootMeta.title ??
        rootMeta.name ??
        p.pipelineId) as string;
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

      // Source/Destination and schedule
      const destinationSystem = (firstMeta.destination as any)?.system as
        | string
        | undefined;
      const scheduleCron = firstMeta.schedule?.cron;
      const scheduleTimezone = firstMeta.schedule?.timezone;

      // Fallback derive source/destination from pipelineId (e.g., ga-to-clickhouse)
      let sourceSystem: string | undefined = undefined;
      if (!sourceSystem) {
        const parts = p.pipelineId.split("-to-");
        if (parts.length === 2) sourceSystem = parts[0];
      }
      const formattedTags = Array.from(
        new Set(rawTags.map((t) => t.trim()).filter(Boolean))
      ).map(formatLabel);

      const iconPath =
        getPublicLogoPath(p.pipelineId) ?? `pipeline-logos/${p.pipelineId}.png`;
      return {
        name: displayName,
        description,
        tags: formattedTags,
        icon: iconPath,
        href: "#",
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
      };
    })
  );

  return (
    <div className="font-sans items-center justify-items-center min-h-screen space-y-4">
      <PagefindMeta type="docs" />
      <main className="flex flex-col items-center sm:items-start">
        <Hero />
        {/* Pipelines */}
        <div className="mx-auto w-full max-w-6xl px-4 xl:px-0  py-6">
          <div className="grid grid-cols-3 gap-5 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            {pipelines.map((pipeline) => (
              <PipelineCard
                key={pipeline.name}
                name={pipeline.name}
                description={pipeline.description}
                icon={pipeline.icon}
                tags={pipeline.tags}
                href={pipeline.href}
                languages={pipeline.languages}
                comingSoon={pipeline.comingSoon}
                implementationCount={pipeline.implementationCount}
                creatorAvatarUrl={pipeline.creatorAvatarUrl}
                creatorAvatarUrls={pipeline.creatorAvatarUrls}
                sourceSystem={pipeline.sourceSystem}
                destinationSystem={pipeline.destinationSystem}
                scheduleCron={pipeline.scheduleCron}
                scheduleTimezone={pipeline.scheduleTimezone}
                fromIcon={pipeline.fromIcon}
                toIcon={pipeline.toIcon}
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
