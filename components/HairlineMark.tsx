import type { ReactNode } from "react";

type Props = {
  name: string;
  href?: string;
  lit?: boolean;
  className?: string;
  children?: ReactNode;
};

/** Signature brand mark: name + the short-list hairline. */
export function HairlineMark({ name, href = "#desk", lit = false, className = "", children }: Props) {
  const classes = `brand-mark${lit ? " is-lit" : ""}${className ? ` ${className}` : ""}`;

  if (href.startsWith("/") || href.startsWith("http")) {
    return (
      <a className={classes} href={href}>
        <span className="brand-mark-name">{name}</span>
        <span className="brand-mark-hair" aria-hidden="true" />
        {children}
      </a>
    );
  }

  return (
    <a className={classes} href={href}>
      <span className="brand-mark-name">{name}</span>
      <span className="brand-mark-hair" aria-hidden="true" />
      {children}
    </a>
  );
}
