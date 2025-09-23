"use client";

import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { Checkbox } from "@ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@ui/components/dropdown-menu";

export interface ConnectorFilterBarProps {
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

export interface ConnectorFilterButtonProps {
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

export function ConnectorFilterButton({
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
}: ConnectorFilterButtonProps) {
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

export interface ConnectorSearchInputProps {
  query: string;
  setQuery: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function ConnectorSearchInput({
  query,
  setQuery,
  placeholder = "Search connectors...",
  className = "flex-1",
}: ConnectorSearchInputProps) {
  return (
    <Input
      placeholder={placeholder}
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      className={className}
    />
  );
}

export default function ConnectorFilterBar({
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
}: ConnectorFilterBarProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Filter</h3>
        <ConnectorSearchInput
          query={query}
          setQuery={setQuery}
          placeholder="Search connectors..."
          className="w-full"
        />
      </div>

      {/* Source Type Filters */}
      {sourceTypes.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Source type</h4>
          <div className="space-y-2">
            {sourceTypes.map((sourceType) => {
              const isChecked = selectedSourceTypes.includes(sourceType);
              return (
                <div key={sourceType} className="flex items-center space-x-2">
                  <Checkbox
                    id={`source-${sourceType}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      setSelectedSourceTypes((prev) =>
                        checked
                          ? Array.from(new Set([...prev, sourceType]))
                          : prev.filter((p) => p !== sourceType)
                      )
                    }
                  />
                  <label
                    htmlFor={`source-${sourceType}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  >
                    {sourceType}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Extraction Pattern Filters */}
      {extractionPatterns.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Extraction</h4>
          <div className="space-y-2">
            {extractionPatterns.map((pattern) => {
              const isChecked = selectedExtractions.includes(pattern);
              return (
                <div key={pattern} className="flex items-center space-x-2">
                  <Checkbox
                    id={`extraction-${pattern}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      setSelectedExtractions((prev) =>
                        checked
                          ? Array.from(new Set([...prev, pattern]))
                          : prev.filter((p) => p !== pattern)
                      )
                    }
                  />
                  <label
                    htmlFor={`extraction-${pattern}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  >
                    {pattern}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Domain Filters */}
      {domains.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Domain</h4>
          <div className="space-y-2">
            {domains.map((domain) => {
              const isChecked = selectedDomains.includes(domain);
              return (
                <div key={domain} className="flex items-center space-x-2">
                  <Checkbox
                    id={`domain-${domain}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      setSelectedDomains((prev) =>
                        checked
                          ? Array.from(new Set([...prev, domain]))
                          : prev.filter((p) => p !== domain)
                      )
                    }
                  />
                  <label
                    htmlFor={`domain-${domain}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  >
                    {domain}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tags Filters */}
      {tags.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">Tags</h4>
          <div className="space-y-2">
            {tags.map((tag) => {
              const isChecked = selectedTags.includes(tag);
              return (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={isChecked}
                    onCheckedChange={(checked) =>
                      setSelectedTags((prev) =>
                        checked
                          ? Array.from(new Set([...prev, tag]))
                          : prev.filter((p) => p !== tag)
                      )
                    }
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                  >
                    {tag}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
