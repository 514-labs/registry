"use client";

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

export interface PipelineFilterBarProps {
  query: string;
  setQuery: (value: string) => void;
  sourceTypes: string[];
  extractionPatterns: Array<"batch" | "stream">;
  domains: string[];
  tags: string[];

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
}

export interface PipelineFilterButtonProps {
  sourceTypes: string[];
  extractionPatterns: Array<"batch" | "stream">;
  domains: string[];
  tags: string[];
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
}

export function PipelineFilterButton({
  sourceTypes,
  extractionPatterns,
  domains,
  tags,
  selectedSourceTypes,
  setSelectedSourceTypes,
  selectedExtractions,
  setSelectedExtractions,
  selectedDomains,
  setSelectedDomains,
  selectedTags,
  setSelectedTags,
}: PipelineFilterButtonProps) {
  return (
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
  );
}

export interface PipelineSearchInputProps {
  query: string;
  setQuery: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PipelineSearchInput({
  query,
  setQuery,
  placeholder = "Search pipelines...",
  className = "flex-1",
}: PipelineSearchInputProps) {
  return (
    <Input
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className={className}
    />
  );
}

export default function PipelineFilterBar({
  query,
  setQuery,
  sourceTypes,
  extractionPatterns,
  domains,
  tags,
  selectedSourceTypes,
  setSelectedSourceTypes,
  selectedExtractions,
  setSelectedExtractions,
  selectedDomains,
  setSelectedDomains,
  selectedTags,
  setSelectedTags,
}: PipelineFilterBarProps) {
  return (
    <div className="mb-6 flex flex-row items-center justify-between gap-4">
      <PipelineSearchInput query={query} setQuery={setQuery} />
      <PipelineFilterButton
        sourceTypes={sourceTypes}
        extractionPatterns={extractionPatterns}
        domains={domains}
        tags={tags}
        selectedSourceTypes={selectedSourceTypes}
        setSelectedSourceTypes={setSelectedSourceTypes}
        selectedExtractions={selectedExtractions}
        setSelectedExtractions={setSelectedExtractions}
        selectedDomains={selectedDomains}
        setSelectedDomains={setSelectedDomains}
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
      />
    </div>
  );
}
