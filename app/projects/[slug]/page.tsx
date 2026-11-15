import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectArticle } from "@/components/ProjectArticle";
import { getProject, projects } from "@/lib/projects";
import { site } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: site.name };

  return {
    title: `${project.title} — ${site.name}`,
    description: project.dek,
  };
}

export default async function ProjectPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return <ProjectArticle project={project} />;
}
