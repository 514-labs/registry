"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="prose dark:prose-invert prose-neutral max-w-none p-8">
      <h2>Something went wrong</h2>
      <p className="text-sm opacity-80">{error.message}</p>
      <button
        onClick={reset}
        className="mt-4 rounded border px-3 py-1 text-sm hover:bg-muted"
      >
        Try again
      </button>
    </div>
  );
}
