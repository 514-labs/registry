"use client";

import ConnectorCard from "@/components/connector-card";
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

type DiscoverConnector = {
  name: string;
  description: string;
  icon: string;
  tags: string[];
  href: string;
  sourceType?: string; // from registry meta.category
  extraction?: "batch" | "stream"; // derived from tags/category
  domains?: string[]; // derived from tags minus operational ones
  language?: string;
  languages?: string[];
  reactions?: number;
  creatorAvatarUrl?: string;
  creatorAvatarUrls?: string[];
  comingSoon?: boolean;
  implementationCount?: number;
};

export default function DiscoverGrid({
  connectors,
}: {
  connectors: DiscoverConnector[];
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
    for (const c of connectors) {
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
  }, [connectors]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matchesText = (c: DiscoverConnector) => {
      if (!q) return true;
      const haystack =
        `${c.name} ${c.description} ${c.tags.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    };
    const matchesSourceType = (c: DiscoverConnector) => {
      if (selectedSourceTypes.length === 0) return true;
      return c.sourceType ? selectedSourceTypes.includes(c.sourceType) : false;
    };
    const matchesExtraction = (c: DiscoverConnector) => {
      if (selectedExtractions.length === 0) return true;
      return c.extraction ? selectedExtractions.includes(c.extraction) : false;
    };
    const matchesDomains = (c: DiscoverConnector) => {
      if (selectedDomains.length === 0) return true;
      const cDomains = c.domains ?? [];
      return cDomains.some((d) => selectedDomains.includes(d));
    };
    const matchesTags = (c: DiscoverConnector) => {
      if (selectedTags.length === 0) return true;
      const cTagsLower = (c.tags ?? []).map((t) => t.toLowerCase());
      return selectedTags.some((t) => cTagsLower.includes(t.toLowerCase()));
    };

    return connectors.filter(
      (c) =>
        matchesText(c) &&
        matchesSourceType(c) &&
        matchesExtraction(c) &&
        matchesDomains(c) &&
        matchesTags(c)
    );
  }, [
    connectors,
    query,
    selectedSourceTypes,
    selectedExtractions,
    selectedDomains,
    selectedTags,
  ]);

  return (
    <main className="mx-auto w-full max-w-6xl px-4 lg:px-6 py-6">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Discover connectors</h1>
      </div>
      <div>
        <div className="mb-6 flex flex-row items-center justify-between gap-4">
          <Input
            placeholder="Search connectors..."
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
        {filtered.map((connector) => (
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
    </main>
  );
}
