"use client";

import PipelineCard from "@/components/pipeline-card";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@ui/components/dropdown-menu";
import { useMemo, useState } from "react";

type DiscoverPipeline = {
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

export default function DiscoverGrid({
  pipelines,
}: {
  pipelines: DiscoverPipeline[];
}) {
  const [query, setQuery] = useState("");
  const [selectedSourceTypes, setSelectedSourceTypes] = useState<string[]>([]);
  const [selectedExtractions, setSelectedExtractions] = useState<
    Array<"batch" | "stream">
  >([]);
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { sourceTypes, extractionPatterns, domains, tags } = useMemo(() => {
    const sourceTypesSet = new Set<string>();
    const extractionSet = new Set<"batch" | "stream">();
    const domainsSet = new Set<string>();
    const tagsSet = new Set<string>();
    for (const c of pipelines) {
      if (c.sourceType) sourceTypesSet.add(c.sourceType);
      if (c.extraction) extractionSet.add(c.extraction);
      if (c.domains) for (const d of c.domains) domainsSet.add(d);
      if (c.tags) for (const t of c.tags) tagsSet.add(t);
    }
    return {
      sourceTypes: Array.from(sourceTypesSet).sort(),
      extractionPatterns: Array.from(extractionSet).sort(),
      domains: Array.from(domainsSet).sort(),
      tags: Array.from(tagsSet).sort(),
    };
  }, [pipelines]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchesText = (c: DiscoverPipeline) => {
      if (!q) return true;
      const haystack =
        `${c.name} ${c.description} ${c.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    };
    const matchesSourceType = (c: DiscoverPipeline) => {
      if (selectedSourceTypes.length === 0) return true;
      return c.sourceType ? selectedSourceTypes.includes(c.sourceType) : false;
    };
    const matchesExtraction = (c: DiscoverPipeline) => {
      if (selectedExtractions.length === 0) return true;
      return c.extraction ? selectedExtractions.includes(c.extraction) : false;
    };
    const matchesDomains = (c: DiscoverPipeline) => {
      if (selectedDomains.length === 0) return true;
      const cDomains = c.domains ?? [];
      return cDomains.some((d) => selectedDomains.includes(d));
    };
    const matchesTags = (c: DiscoverPipeline) => {
      if (selectedTags.length === 0) return true;
      const cTagsLower = (c.tags ?? []).map((t) => t.toLowerCase());
      return selectedTags.some((t) => cTagsLower.includes(t.toLowerCase()));
    };

    return pipelines.filter(
      (c) =>
        matchesText(c) &&
        matchesSourceType(c) &&
        matchesExtraction(c) &&
        matchesDomains(c) &&
        matchesTags(c)
    );
  }, [
    pipelines,
    query,
    selectedSourceTypes,
    selectedExtractions,
    selectedDomains,
    selectedTags,
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 lg:px-6 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Discover pipelines</h1>
      </div>
      <div>
        <div className="mb-6 flex flex-row items-center justify-between gap-4">
          <Input
            placeholder="Search pipelines..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">Filters</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64">
              <DropdownMenuLabel>Source type</DropdownMenuLabel>
              {sourceTypes.map((st) => {
                const checked = selectedSourceTypes.includes(st);
                return (
                  <DropdownMenuCheckboxItem
                    key={st}
                    checked={checked}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(on) =>
                      setSelectedSourceTypes((prev) =>
                        on
                          ? Array.from(new Set([...prev, st]))
                          : prev.filter((p) => p !== st)
                      )
                    }
                  >
                    {st}
                  </DropdownMenuCheckboxItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Extraction</DropdownMenuLabel>
              {extractionPatterns.map((ex) => {
                const checked = selectedExtractions.includes(ex);
                return (
                  <DropdownMenuCheckboxItem
                    key={ex}
                    checked={checked}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(on) =>
                      setSelectedExtractions((prev) =>
                        on
                          ? Array.from(new Set([...prev, ex]))
                          : prev.filter((p) => p !== ex)
                      )
                    }
                  >
                    {ex}
                  </DropdownMenuCheckboxItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Domain</DropdownMenuLabel>
              {domains.map((d) => {
                const checked = selectedDomains.includes(d);
                return (
                  <DropdownMenuCheckboxItem
                    key={d}
                    checked={checked}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(on) =>
                      setSelectedDomains((prev) =>
                        on
                          ? Array.from(new Set([...prev, d]))
                          : prev.filter((p) => p !== d)
                      )
                    }
                  >
                    {d}
                  </DropdownMenuCheckboxItem>
                );
              })}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Tags</DropdownMenuLabel>
              {tags.map((t) => {
                const checked = selectedTags.includes(t);
                return (
                  <DropdownMenuCheckboxItem
                    key={t}
                    checked={checked}
                    onSelect={(e) => e.preventDefault()}
                    onCheckedChange={(on) =>
                      setSelectedTags((prev) =>
                        on
                          ? Array.from(new Set([...prev, t]))
                          : prev.filter((p) => p !== t)
                      )
                    }
                  >
                    {t}
                  </DropdownMenuCheckboxItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
        {filtered.map((p) => (
          <PipelineCard
            key={p.name}
            name={p.name}
            description={p.description}
            icon={p.icon}
            tags={p.tags}
            href={p.href}
            languages={p.languages}
            comingSoon={p.comingSoon}
            implementationCount={p.implementationCount}
            creatorAvatarUrl={p.creatorAvatarUrl}
            creatorAvatarUrls={p.creatorAvatarUrls}
            sourceSystem={p.sourceSystem}
            destinationSystem={p.destinationSystem}
            scheduleCron={p.scheduleCron}
            scheduleTimezone={p.scheduleTimezone}
            fromIcon={p.fromIcon}
            toIcon={p.toIcon}
          />
        ))}
      </div>
    </main>
  );
}
