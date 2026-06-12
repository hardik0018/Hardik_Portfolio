import { siteUrl, siteName, defaultDescription } from "./seo";

export function getPersonSchema() {
  return {
    "@type": "Person" as const,
    "@id": `${siteUrl}/#person`,
    name: siteName,
    jobTitle: "Full-Stack Developer",
    url: siteUrl,
    email: "hello@hardikvatukiya.dev",
    description: defaultDescription,
    image: `${siteUrl}/opengraph-image`,
    sameAs: [
      "https://github.com/hardikvatukiya",
      "https://linkedin.com/in/hardikvatukiya",
    ],
    knowsAbout: [
      "React",
      "Next.js",
      "Node.js",
      "Express.js",
      "MongoDB",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "GSAP",
      "Framer Motion",
      "Three.js",
      "SEO",
      "AIO",
      "Web Accessibility (WCAG)",
      "MERN Stack",
      "Sanity CMS",
      "REST APIs",
      "GraphQL"
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Rajkot",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
  };
}

export function getWebsiteSchema() {
  return {
    "@type": "WebSite" as const,
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: siteName,
    description: defaultDescription,
    publisher: {
      "@id": `${siteUrl}/#person`,
    },
  };
}

export function getProfilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage" as const,
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: `${siteName} — Full-Stack Developer & MERN Stack Portfolio`,
    description: defaultDescription,
    about: {
      "@id": `${siteUrl}/#person`,
    },
  };
}

export interface SchemaProject {
  title: string;
  slug?: string;
  description: string;
  year: string;
  tags?: string[];
  github?: string;
  url?: string;
  image?: string;
  dateModified?: string;
}

export function getProjectSchema(project: SchemaProject) {
  const projectUrl = project.slug ? `${siteUrl}/projects/${project.slug}` : project.url || siteUrl;
  
  return {
    "@type": "SoftwareApplication" as const,
    "@id": `${projectUrl}#softwareapplication`,
    name: project.title,
    applicationCategory: "WebApplication",
    operatingSystem: "Windows, macOS, Linux, Android, iOS",
    description: project.description,
    url: projectUrl,
    image: project.image || `${siteUrl}/projects/opengraph-image`,
    author: {
      "@id": `${siteUrl}/#person`,
    },
    genre: "Web Development",
    keywords: project.tags?.join(", ") || "",
    softwareRequirements: "Modern Web Browser",
    sameAs: [project.url, project.github].filter(Boolean) as string[],
  };
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function getBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@type": "BreadcrumbList" as const,
    "@id": `${siteUrl}/#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.item.startsWith("http") ? item.item : `${siteUrl}${item.item}`,
    })),
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function getFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage" as const,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
