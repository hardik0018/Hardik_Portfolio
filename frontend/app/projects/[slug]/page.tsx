import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Code2, ExternalLink } from "lucide-react";
import { getProjectBySlug, getProjectSlugs } from "@/lib/sanity.loader";
import { urlFor } from "@/lib/sanity.image";
import { projectsOgImage, siteName, siteUrl, twitterCreator } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getProjectSchema, getBreadcrumbSchema, getArticleSchema } from "@/lib/schema";

export const revalidate = 60;

type PageProps = {
  params: Promise<{ slug: string }>;
};

function projectImageUrl(project: Awaited<ReturnType<typeof getProjectBySlug>>, width = 1200, height = 630) {
  if (!project?.src) return projectsOgImage;
  return urlFor(project.src).width(width).height(height).fit("crop").auto("format").url();
}

export async function generateStaticParams() {
  const slugs = await getProjectSlugs();
  return (slugs || []).map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      robots: { index: false, follow: false },
    };
  }

  const title = `${project.title} | Hardik Vatukiya — Full-Stack Developer`;
  const description = project.description || `Explore ${project.title}, a project built by ${siteName} specializing in MERN stack, React, and modern web development.`;
  const image = projectImageUrl(project);
  const canonical = `/projects/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: `${siteUrl}${canonical}`,
      siteName,
      locale: "en_IN",
      type: "article",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: project.src?.alt || `${project.title} project screenshot by Hardik Vatukiya — Full-Stack Developer`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: twitterCreator,
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const image = projectImageUrl(project, 1600, 900);
  const projectSchema = getProjectSchema({
    title: project.title,
    slug: slug,
    description: project.description,
    year: project.year,
    tags: project.tags,
    github: project.github,
    url: project.url,
    image,
    dateModified: project._updatedAt,
  });

  const breadcrumbsSchema = getBreadcrumbSchema([
    { name: "Home", item: "/" },
    { name: "Projects", item: "/projects" },
    { name: project.title, item: `/projects/${slug}` },
  ]);

  const articleSchema = getArticleSchema({
    title: project.title,
    description: project.description || `Case study on ${project.title}`,
    image,
    url: `${siteUrl}/projects/${slug}`,
    datePublished: project._updatedAt,
    dateModified: project._updatedAt,
    authorName: siteName,
  });

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [projectSchema, breadcrumbsSchema, articleSchema],
  };

  return (
    <main className="min-h-screen bg-background px-6 pb-24 pt-32 text-foreground md:px-12">
      <JsonLd schema={schemaGraph} />
      <article className="mx-auto max-w-6xl">
        <Link href="/projects" className="text-xs font-bold uppercase tracking-widest text-text-muted transition-colors hover:text-foreground">
          Back to projects
        </Link>

        <header className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent-primary">{project.year}</p>
            <h1 className="mt-4 max-w-4xl font-display text-5xl uppercase leading-none tracking-tight md:text-7xl">
              {project.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-muted md:text-xl">
              {project.description}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-end">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background">
                <Code2 className="h-4 w-4" />
                GitHub
              </a>
            )}
            {project.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-accent-primary px-5 py-3 text-xs font-bold uppercase tracking-widest text-background transition-opacity hover:opacity-85">
                <ExternalLink className="h-4 w-4" />
                Live site
              </a>
            )}
          </div>
        </header>

        {project.src && (
          <div className="relative mt-12 aspect-video overflow-hidden rounded-[12px] border border-border bg-bg-secondary">
            <Image
              src={image}
              alt={project.src.alt || `${project.title} project screenshot by Hardik Vatukiya — Full-Stack Developer`}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        {project.tags?.length ? (
          <section aria-label="Project technologies" className="mt-10 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="rounded-full border border-border px-4 py-2 text-xs font-bold uppercase tracking-widest text-text-muted">
                {tag}
              </span>
            ))}
          </section>
        ) : null}
      </article>
    </main>
  );
}
