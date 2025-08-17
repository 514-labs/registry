"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@ui/components/button";
import clsx from "clsx";

export function NavButton({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Button
      asChild
      variant="link"
      className={clsx(isActive && "underline underline-offset-4")}
      data-active={isActive ? "true" : undefined}
    >
      <Link href={href} aria-current={isActive ? "page" : undefined}>
        {label}
      </Link>
    </Button>
  );
}
