"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatProjectDate, projects, type Project } from "@/lib/projects";
import { rememberPillar } from "@/lib/nav-memory";
import { site, whatIDo } from "@/lib/site";

type Props = {
  project: Project;
};

export function ProjectArticle({ project }: Props) {
  const pillar = whatIDo[project.pillar];
  const related = projects
    .filter((item) => item.slug !== project.slug && item.pillar === project.pillar)
    .concat(projects.filter((item) => item.slug !== project.slug && item.pillar !== project.pillar))
    .slice(0, 3);
  const hasCase = Boolean(project.sections?.length);

  return (
    <article className={`note${hasCase ? " note--case" : ""}`}>
      <header className="note-chrome">
        <Link href="/#desk" className="note-wordmark brand-mark is-lit" scroll={false}>
          <span className="brand-mark-name">{site.name}</span>
          <span className="brand-mark-hair" aria-hidden="true" />
        </Link>
        <nav className="note-nav">
          <Link href="/#work-do" scroll={false}>
            Work
          </Link>
          <Link href="/#projects" scroll={false}>
            Projects
          </Link>
          <Link href="/#contact" scroll={false}>
            Contact
          </Link>
        </nav>
      </header>

      <div className="note-lead">
        <p className="kicker">{project.category}</p>
        <h1>{project.title}</h1>
        {project.release ? <p className="note-release">{project.release}</p> : null}
        <p className="note-dek">{project.dek}</p>
        <p className="note-byline">
          <span>{site.name}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={project.date}>{formatProjectDate(project.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{project.readMinutes} min read</span>
        </p>
      </div>

      {project.frame ? (
        <figure className="note-frame">
          <span className="note-frame-box">
            <Image
              src={project.image}
              alt={project.imageAlt}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 52rem"
            />
          </span>
          <figcaption>{project.imageAlt}</figcaption>
        </figure>
      ) : (
        <figure className="note-hero">
          <Image
            src={project.image}
            alt={project.imageAlt}
            fill
            priority
            sizes="100vw"
          />
          <figcaption className="note-hero-cap">{project.imageAlt}</figcaption>
        </figure>
      )}

      <div className="note-body">
        {project.sections?.map((section, index) => (
          <section
            key={section.heading}
            className="note-section"
            style={{ "--section-i": index } as CSSProperties}
          >
            <p className="note-section-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h2>{section.heading}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
            {section.bullets?.length ? (
              <ul className="note-bullets">
                {section.bullets.map((item) => (
                  <li key={item.slice(0, 48)}>{item}</li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}

        {project.body?.map((paragraph, i) => (
          <p key={`${i}-${paragraph.slice(0, 32)}`}>{paragraph}</p>
        ))}

        {project.coda ? (
          <aside className="note-coda">
            <p className="kicker">{project.coda.heading}</p>
            <p>{project.coda.body}</p>
          </aside>
        ) : null}

        {project.tags?.length ? (
          <ul className="note-tags" aria-label="Craft tags">
            {project.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}

        {project.source ? (
          <p className="note-source">
            <a href={project.source.href} target="_blank" rel="noreferrer">
              {project.source.label}
              <span aria-hidden="true"> →</span>
            </a>
          </p>
        ) : null}
      </div>

      <aside className="note-pillar">
        <p className="kicker">Line of work</p>
        <h2>{pillar.title}</h2>
        <p>
          This note sits under {pillar.title.toLowerCase()} — one of three lines that keep a short market
          remembered.
        </p>
        <Link
          href={`/?pillar=${project.pillar}#work-do`}
          className="note-pillar-link"
          scroll={false}
          onClick={() => rememberPillar(project.pillar)}
        >
          Open {pillar.n} {pillar.title}
          <span aria-hidden="true"> →</span>
        </Link>
      </aside>

      {related.length > 0 ? (
        <div className="note-more">
          <p className="kicker">More field notes</p>
          <ul>
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/projects/${item.slug}`}>
                  <span>{item.title}</span>
                  <em>{item.category}</em>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <footer className="note-foot">
        <Link href="/#projects" className="note-back" scroll={false}>
          ← Back to projects
        </Link>
        <a className="mail" href={`mailto:${site.email}`}>
          {site.email}
        </a>
      </footer>
    </article>
  );
}
