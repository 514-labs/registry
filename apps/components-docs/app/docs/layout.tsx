import Link from "next/link";
import type { ReactNode } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

function DocsNav() {
  const items = [
    { title: "Introduction", href: "/docs" },
    { title: "Installation", href: "/docs/installation" },
    {
      title: "Specifications",
      href: "/docs/specifications",
    },
  ];

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Docs</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>{item.title}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}

function DocsRightSidebar() {
  return (
    <Sidebar
      side="right"
      variant="inset"
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
    >
      <div className="text-sm font-semibold mb-3">On this page</div>
      <nav className="text-sm space-y-2">
        {/* Replace with a generated table of contents if desired */}
        <a
          className="text-muted-foreground hover:text-foreground block"
          href="#"
        >
          Section 1
        </a>
        <a
          className="text-muted-foreground hover:text-foreground block"
          href="#"
        >
          Section 2
        </a>
        <a
          className="text-muted-foreground hover:text-foreground block"
          href="#"
        >
          Section 3
        </a>
      </nav>
    </Sidebar>
  );
}

export default function DocsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1">
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
