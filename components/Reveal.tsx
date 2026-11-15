"use client";

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  as?: "div" | "header" | "section";
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

/** Quiet scroll entrance — elevates section moments without noise. */
export function Reveal({ children, className = "", as: Tag = "div", ...rest }: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.classList.add("is-revealed");
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("is-revealed");
          io.disconnect();
        }
      },
      { threshold: 0.18, rootMargin: "0px 0px -6% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      className={`reveal${className ? ` ${className}` : ""}`}
      {...rest}
    >
      {children}
    </Tag>
  );
}
