"use client";

/*
  Prod was previously showing blank when refreshing the connector page:
  - Fetching stars inside the header (on the server) made the layout "dynamic" in prod.
    That forced connector pages to render at request time, where our registry files
    aren’t on disk. Then readConnector(...) returned nothing, so the body looked blank.
  - This component runs in the browser after the page loads and calls /api/github-stars.
    It does not turn the layout dynamic, so connector pages stay prebuilt and render fully.
*/

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
