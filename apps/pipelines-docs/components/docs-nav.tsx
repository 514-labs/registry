"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@workspace/ui/components/sidebar";

export default function DocsNav() {
  const pathname = usePathname() ?? "/";

  const items = [
    { title: "Introduction", href: "/docs" },
    { title: "Installation", href: "/docs/installation" },
    { title: "Quickstart", href: "/docs/quickstart" },
    { title: "Scaffold", href: "/docs/scaffold" },
    { title: "Lineage", href: "/docs/lineage" },
    {
      title: "Specifications",
      href: "/docs/specifications",
    },
  ];

  const isActivePath = (href: string) => {
    if (href === "/docs") return pathname === "/docs";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Docs</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
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
