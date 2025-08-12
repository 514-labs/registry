import type { ReactNode } from "react";
import DocsToc from "@/components/docs-toc";
import DocsNav from "@/components/docs-nav";
import { PagefindMeta } from "@/components/pagefind-meta";

import {
  Sidebar,
  SidebarFooter,
  SidebarInset,
} from "@workspace/ui/components/sidebar";

function DocsRightSidebar() {
  return (
    <Sidebar
      side="right"
      variant="inset"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <DocsToc />
    </Sidebar>
  );
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1">
      <PagefindMeta type="docs" />
      {/* Left navigation */}
      <Sidebar
        variant="inset"
        className="top-(--header-height) h-[calc(100svh-var(--header-height))]! pl-4"
      >
        <DocsNav />

        <SidebarFooter>
          <div className="px-2 text-xs text-muted-foreground">
            v1 • Docs Layout
          </div>
        </SidebarFooter>
      </Sidebar>

      {/* Main content area (center column) */}
      <SidebarInset>
        <div className="mx-auto w-full max-w-2xl px-4 py-8 lg:px-8">
          {children}
        </div>
      </SidebarInset>

      {/* Right sidebar (TOC) */}
      <DocsRightSidebar />
    </div>
  );
}
