"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function DocsToc() {
  const pathname = usePathname();
  const [items, setItems] = useState<TocItem[]>([]);
  const observerRef = useRef<MutationObserver | null>(null);

  // Recompute on route change (within the docs layout) and when content mounts
  useEffect(() => {
    function collect() {
      const headings = Array.from(
        document.querySelectorAll<HTMLElement>(".prose h2, .prose h3")
      );

      const newItems: TocItem[] = headings.map((el) => {
        let id = el.id;
        if (!id) {
          id = slugify(el.innerText);
          // Ensure uniqueness if multiple identical headings
          let uniqueId = id;
          let suffix = 1;
          while (document.getElementById(uniqueId)) {
            uniqueId = `${id}-${suffix++}`;
          }
          id = uniqueId;
          el.id = id;
        }

        const level = el.tagName.toLowerCase() === "h2" ? 2 : 3;
        return { id, text: el.innerText, level: level as 2 | 3 };
      });

      setItems(newItems);
    }

    collect();

    // Also observe DOM changes (e.g. tabs switching) and refresh
    // Debounce updates to avoid excessive recalculation
    let scheduled = false;
    const onMutate = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        collect();
      });
    };

    observerRef.current?.disconnect();
    observerRef.current = new MutationObserver(onMutate);
    observerRef.current.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [pathname]);

  const hasItems = items.length > 0;

  const content = useMemo(() => {
    if (!hasItems) return null;
    return (
      <nav className="text-sm space-y-2">
        {items.map((item) => (
          <a
            key={item.id}
            className={
              "text-muted-foreground hover:text-foreground block " +
              (item.level === 3 ? "pl-4" : "")
            }
            href={`#${item.id}`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    );
  }, [items, hasItems]);

  return (
    <div>
      <div className="text-sm font-semibold mb-3">On this page</div>
      {content ?? (
        <div className="text-xs text-muted-foreground">No headings found</div>
      )}
    </div>
  );
}

export default DocsToc;
