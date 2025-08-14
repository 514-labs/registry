"use client";

import { useEffect, useState } from "react";

export function GithubStarsLive() {
  const [stars, setStars] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch("/api/github-stars")
      .then((r) => r.json())
      .then((d: { stars: number | null }) => {
        if (mounted) setStars(d?.stars ?? null);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  if (!stars) return null;
  return (
    <span className="text-xs tabular-nums">
      {new Intl.NumberFormat(undefined, { notation: "compact" }).format(stars)}
    </span>
  );
}


