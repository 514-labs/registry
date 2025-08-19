"use client";

import { useEffect, useState } from "react";
import { Badge } from "@ui/components/badge";

export default function ReactionsBadge({
  urls,
  initial,
  className,
}: {
  urls?: string[];
  initial?: number;
  className?: string;
}) {
  const [count, setCount] = useState<number | undefined>(initial);

  useEffect(() => {
    let cancelled = false;
    async function run() {
      try {
        const res = await fetch("/api/reactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ urls: urls ?? [] }),
          next: { revalidate: 600 },
        });
        if (!res.ok) return;
        const json = (await res.json()) as { total?: number };
        if (!cancelled && typeof json.total === "number") setCount(json.total);
      } catch {
        // ignore
      }
    }
    if ((urls?.length ?? 0) > 0) run();
    return () => {
      cancelled = true;
    };
  }, [JSON.stringify(urls)]);

  if (!count || count <= 0) return null;
  return (
    <Badge
      variant="secondary"
      className={className ?? "text-sm flex items-center gap-1"}
    >
      <span>❤️</span>
      <span className="-ml-1">👍</span>
      <span>{count}</span>
    </Badge>
  );
}
