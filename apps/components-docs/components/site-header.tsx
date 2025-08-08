"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@ui/components/theme-toggle";
import { Button } from "@ui/components/button";
import { SidebarTrigger } from "@ui/components/sidebar";

export function SiteHeader() {
  const pathname = usePathname() ?? "/";

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="flex justify-between items-center p-4 w-full h-[var(--header-height)] sticky top-0 z-10 bg-background">
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="link"
          className={
            isActivePath("/") ? "underline underline-offset-4" : undefined
          }
        >
          <Link href="/" aria-current={isActivePath("/") ? "page" : undefined}>
            Connectors
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className={
            isActivePath("/discover")
              ? "underline underline-offset-4"
              : undefined
          }
        >
          <Link
            href="/discover"
            aria-current={isActivePath("/discover") ? "page" : undefined}
          >
            Discover
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className={
            isActivePath("/create") ? "underline underline-offset-4" : undefined
          }
        >
          <Link
            href="/create"
            aria-current={isActivePath("/create") ? "page" : undefined}
          >
            Create
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className={
            isActivePath("/publish")
              ? "underline underline-offset-4"
              : undefined
          }
        >
          <Link
            href="/publish"
            aria-current={isActivePath("/publish") ? "page" : undefined}
          >
            Publish
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className={
            isActivePath("/host") ? "underline underline-offset-4" : undefined
          }
        >
          <Link
            href="/host"
            aria-current={isActivePath("/host") ? "page" : undefined}
          >
            Host
          </Link>
        </Button>
        <Button
          asChild
          variant="link"
          className={
            isActivePath("/docs") ? "underline underline-offset-4" : undefined
          }
        >
          <Link
            href="/docs"
            aria-current={isActivePath("/docs") ? "page" : undefined}
          >
            Docs
          </Link>
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <ThemeToggle />
      </div>
    </header>
  );
}
