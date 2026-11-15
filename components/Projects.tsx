import Image from "next/image";
import type { CSSProperties } from "react";
import { ProjectLink } from "@/components/ProjectLink";
import { Reveal } from "@/components/Reveal";
import { formatProjectDate, projects } from "@/lib/projects";
import { whatIDo } from "@/lib/site";

const ALTITUDE = ["Orbit", "System", "Ground"] as const;

function caseCode(index: number) {
  return `NF-${String(index + 1).padStart(2, "0")}`;
}

export function Projects() {
  return (
    <section className="field" id="projects">
      <Reveal as="header" className="field-head">
        <p className="kicker">Field dossier</p>
        <h2>Notes from a short list.</h2>
        <p>
          Classified by altitude — orbit signal, system pipeline, ground leadership. Not a campaign report.
        </p>
      </Reveal>

      <ol className="field-index">
        {projects.map((project, index) => (
          <li key={project.slug}>
            <ProjectLink
              href={`/projects/${project.slug}`}
              className={`field-entry${project.featured ? " is-lead" : ""}${project.frame ? " is-photo" : ""}`}
              style={
                project.photoPosition
                  ? ({ "--photo-pos": project.photoPosition } as CSSProperties)
                  : undefined
              }
            >
              <span className="field-entry-media" aria-hidden="true">
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 720px) 100vw, 28vw"
                  priority={index === 0}
                />
              </span>

              <span className="field-entry-body">
                <span className="field-entry-top">
                  <span className="field-entry-code">{caseCode(index)}</span>
                  <span className="field-entry-alt">{ALTITUDE[project.pillar]}</span>
                </span>

                <span className="field-entry-meta">
                  <span>{whatIDo[project.pillar].title}</span>
                  <span aria-hidden="true">·</span>
                  <time dateTime={project.date}>{formatProjectDate(project.date)}</time>
                </span>

                <span className="field-entry-title">{project.title}</span>

                <span className="field-entry-dek">{project.dek}</span>

                <span className="field-entry-go" aria-hidden="true">
                  Open note
                </span>
              </span>
            </ProjectLink>
          </li>
        ))}
      </ol>
    </section>
  );
}
