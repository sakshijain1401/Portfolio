"use client";

import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { rememberHomeScroll, stampProjectsHash } from "@/lib/nav-memory";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  children: ReactNode;
};

export function ProjectLink({ href, children, onClick, ...rest }: Props) {
  return (
    <Link
      href={href}
      {...rest}
      onClick={(event) => {
        rememberHomeScroll();
        stampProjectsHash();
        onClick?.(event);
      }}
    >
      {children}
    </Link>
  );
}
