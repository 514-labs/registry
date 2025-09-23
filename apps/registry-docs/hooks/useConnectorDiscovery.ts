"use client";

import { useMemo, useState } from "react";
import type { DiscoverConnector } from "@/app/discover/connector/connector-discover-grid";

export type UseConnectorDiscoveryResult = {
  filtered: DiscoverConnector[];
  query: string;
  setQuery: (value: string) => void;
  selectedSourceTypes: string[];
  setSelectedSourceTypes: (updater: (prev: string[]) => string[]) => void;
  selectedExtractions: Array<"batch" | "stream">;
  setSelectedExtractions: (
    updater: (prev: Array<"batch" | "stream">) => Array<"batch" | "stream">
  ) => void;
  selectedDomains: string[];
  setSelectedDomains: (updater: (prev: string[]) => string[]) => void;
  selectedTags: string[];
  setSelectedTags: (updater: (prev: string[]) => string[]) => void;
  sourceTypes: string[];
  extractionPatterns: Array<"batch" | "stream">;
  domains: string[];
  tags: string[];
};

export function useConnectorDiscovery(
  connectors: DiscoverConnector[]
): UseConnectorDiscoveryResult {
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
      const haystack = `${c.name} ${c.description} ${(c.tags ?? []).join(" ")}`.toLowerCase();
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

  return {
    filtered,
    query,
    setQuery,
    selectedSourceTypes,
    setSelectedSourceTypes,
    selectedExtractions,
    setSelectedExtractions,
    selectedDomains,
    setSelectedDomains,
    selectedTags,
    setSelectedTags,
    sourceTypes,
    extractionPatterns,
    domains,
    tags,
  };
}

export default useConnectorDiscovery;


