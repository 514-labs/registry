"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, Workflow, Code2 } from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@workspace/ui/components/sidebar";

export default function DocsNav() {
  const pathname = usePathname() ?? "/";

  const gettingStartedItems = [
    { title: "Introduction", href: "/docs" },
    { title: "Installation", href: "/docs/installation" },
  ];

  const connectorItems = [
    { title: "Quickstart", href: "/docs/connectors/quickstart" },
    { title: "Creating Connectors", href: "/docs/connectors/creating" },
    { title: "Connector Scaffold", href: "/docs/connectors/scaffold" },
    { title: "Specifications", href: "/docs/connectors/specifications" },
  ];

  const pipelineItems = [
    { title: "Quickstart", href: "/docs/pipelines/quickstart" },
    { title: "Creating Pipelines", href: "/docs/pipelines/creating" },
    { title: "Pipeline Scaffold", href: "/docs/pipelines/scaffold" },
    { title: "Specifications", href: "/docs/pipelines/specifications" },
    { title: "Lineage", href: "/docs/pipelines/lineage" },
  ];

  const apiItems = [{ title: "Registry API", href: "/docs/api" }];

  const isActivePath = (href: string) => {
    if (href === "/docs") return pathname === "/docs";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Getting Started</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {gettingStartedItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActivePath(item.href)}>
                  <Link
                    href={item.href}
                    aria-current={isActivePath(item.href) ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Connectors
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {connectorItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActivePath(item.href)}>
                  <Link
                    href={item.href}
                    aria-current={isActivePath(item.href) ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Workflow className="h-4 w-4" />
          Pipelines
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {pipelineItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActivePath(item.href)}>
                  <Link
                    href={item.href}
                    aria-current={isActivePath(item.href) ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SidebarSeparator />

      <SidebarGroup>
        <SidebarGroupLabel className="flex items-center gap-2">
          <Code2 className="h-4 w-4" />
          API
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {apiItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActivePath(item.href)}>
                  <Link
                    href={item.href}
                    aria-current={isActivePath(item.href) ? "page" : undefined}
                  >
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
