import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Code2, ExternalLink } from "lucide-react";
import { getProjectBySlug, getProjectSlugs } from "@/lib/sanity.loader";
import { urlFor } from "@/lib/sanity.image";
import { projectsOgImage, siteName, siteUrl, twitterCreator } from "@/lib/seo";

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

  const title = `${project.title} - Project`;
  const description = project.description || `A project by ${siteName}.`;
  const image = projectImageUrl(project);
  const canonical = `/projects/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${project.title} | ${siteName}`,
      description,
      url: `${siteUrl}${canonical}`,
      siteName,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: project.src?.alt || `${project.title} project screenshot`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      creator: twitterCreator,
      title: `${project.title} | ${siteName}`,
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
  const projectUrl = `${siteUrl}/projects/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${projectUrl}#creativework`,
    name: project.title,
    headline: project.title,
    description: project.description,
    url: projectUrl,
    image,
    datePublished: project.year,
    dateModified: project._updatedAt,
    creator: {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      name: siteName,
    },
    keywords: project.tags?.join(", "),
    sameAs: [project.url, project.github].filter(Boolean),
  };

  return (
    <main className="min-h-screen bg-background px-6 pb-24 pt-32 text-foreground md:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
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
              alt={project.src.alt || `${project.title} project screenshot`}
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
