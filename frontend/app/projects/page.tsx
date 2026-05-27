import dynamic from "next/dynamic";
import { getProjects } from "@/lib/sanity.loader";
import type { Metadata } from "next";
import { siteName, siteUrl } from "@/lib/seo";

const WorkListing = dynamic(() => import("@/components/sections/WorkListing"), { ssr: true });

export const revalidate = 60; // Revalidate every 60 seconds

export const metadata: Metadata = {
  title: "Projects | Hardik Vatukiya — Full-Stack Developer",
  description: "Explore portfolio projects built by Hardik Vatukiya, showcasing modern frontend engineering, MERN stack integration, and high-performance user experiences.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    title: "Projects | Hardik Vatukiya — Full-Stack Developer",
    description: "Explore portfolio projects built by Hardik Vatukiya, showcasing modern frontend engineering, MERN stack integration, and high-performance user experiences.",
    url: "https://hardikvatukiya.vercel.app/projects",
    images: [
      {
        url: "/projects/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hardik Vatukiya Projects Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects | Hardik Vatukiya — Full-Stack Developer",
    description: "Explore portfolio projects built by Hardik Vatukiya, showcasing modern frontend engineering, MERN stack integration, and high-performance user experiences.",
    images: ["/projects/opengraph-image"],
  },
};

export default async function ProjectsPage() {
  const projectsData = await getProjects();
  const projects = projectsData || [];

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/projects#collectionpage`,
    "url": `${siteUrl}/projects`,
    "name": `Projects by Hardik Vatukiya`,
    "description": "Explore portfolio projects built by Hardik Vatukiya, showcasing modern frontend engineering, MERN stack integration, and high-performance user experiences.",
    "publisher": {
      "@type": "Person",
      "@id": `${siteUrl}/#person`,
      "name": siteName
    },
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": projects.map((project, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `${siteUrl}/projects/${project.slug}`,
        "name": project.title,
        "description": project.description
      }))
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c").replace(/>/g, "\\u003e"),
        }}
      />
      <WorkListing initialData={projectsData} />
    </>
  );
}

