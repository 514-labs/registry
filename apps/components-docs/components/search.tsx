"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/components/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@ui/components/dialog";
import { Input } from "@ui/components/input";
import { Button } from "@ui/components/button";
import { ScrollArea } from "@ui/components/scroll-area";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PagefindModule = any;

type SearchResultData = {
  url: string;
  excerpt?: string;
  meta?: Record<string, unknown> & { title?: string; type?: string };
  sub_results?: Array<{
    url: string;
    title?: string;
    excerpt?: string;
  }>;
};

async function importPagefind(): Promise<PagefindModule> {
  // Pagefind bundle is emitted to /pagefind during export
  try {
    // Avoid static analysis by TypeScript and bundlers; load at runtime
    const dyn = Function("u", "return import(u)") as (
      src: string
    ) => Promise<PagefindModule>;
    const pf = await dyn("/pagefind/pagefind.js");
    return pf as PagefindModule;
  } catch {
    // In dev, the pagefind bundle may not exist; return a stub that no-ops
    return {
      init: async () => {},
      options: async () => {},
      debouncedSearch: async () => null,
      search: async () => ({ results: [] }),
      preload: () => {},
    } as PagefindModule;
  }
}

async function ensureInitialized(bundlePath?: string) {
  const pagefind = await importPagefind();
  if (bundlePath) {
    await pagefind.options({ bundlePath });
  }
  await pagefind.init();
  return pagefind;
}

async function runSearch(
  query: string,
  filters?: Record<string, string | string[]>
): Promise<SearchResultData[]> {
  const pagefind = await ensureInitialized();
  const searchOptions: { filters?: Record<string, string | string[]> } = {};
  if (filters && Object.keys(filters).length > 0) {
    searchOptions.filters = filters;
  }
  const result = await pagefind.search(query, searchOptions);
  if (!result || !result.results) return [];

  const firstTen = (
    result.results as Array<{ data: () => Promise<SearchResultData> }>
  ).slice(0, 10);
  const loaded = await Promise.all(firstTen.map((r) => r.data()));
  return loaded;
}

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("all");
  const [allResults, setAllResults] = useState<SearchResultData[]>([]);
  const [connectorResults, setConnectorResults] = useState<SearchResultData[]>(
    []
  );
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      // Hint the index chunks while the user thinks
      importPagefind().then((pf) => pf.preload(""));
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    let cancelled = false;
    async function doSearch() {
      if (!query) {
        setAllResults([]);
        setConnectorResults([]);
        return;
      }

      const [all, comps] = await Promise.all([
        runSearch(query),
        // Filter only pages tagged with meta.type === "connector"
        runSearch(query, { type: "connector" }),
      ]);
      if (!cancelled) {
        setAllResults(all);
        setConnectorResults(comps);
      }
    }
    doSearch();
    return () => {
      cancelled = true;
    };
  }, [query]);

  const renderResults = useCallback(
    (results: SearchResultData[]) => {
      if (results.length === 0) {
        return <div className="text-sm text-muted-foreground">No results</div>;
      }
      return (
        <ul className="space-y-3">
          {results.map((r) => {
            const title =
              (r.meta?.title as string | undefined) ??
              r.sub_results?.[0]?.title ??
              r.url;
            // Remove .html extension for Next.js routing
            const url = (r.url || "#").replace(/\.html$/, "");

            return (
              <li
                key={r.url}
                className="rounded-lg border p-3 hover:bg-accent cursor-pointer"
                onClick={() => {
                  router.push(url);
                  onOpenChange(false);
                }}
              >
                <div className="text-sm font-medium line-clamp-1">{title}</div>
                {r.excerpt ? (
                  <div
                    className="text-xs text-muted-foreground mt-1"
                    dangerouslySetInnerHTML={{ __html: r.excerpt }}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      );
    },
    [router, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Search</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            ref={inputRef}
            placeholder="Search docs and connectors…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="connectors">Connectors</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <ScrollArea className="max-h-[60vh] pr-2">
                {renderResults(allResults)}
              </ScrollArea>
            </TabsContent>
            <TabsContent value="connectors">
              <ScrollArea className="max-h-[60vh] pr-2">
                {renderResults(connectorResults)}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SearchButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        Search
      </Button>
      <SearchDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
