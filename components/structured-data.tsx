export function StructuredData() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://hardikvatukiya.vercel.app";

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hardik Vatukiya",
    url: siteUrl,
    image: `${siteUrl}/icons/icon-512x512.png`,
    jobTitle: "Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Freelance",
    },
    sameAs: [
      "https://github.com/hardik0018",
      "https://linkedin.com/in/hardik-vatukiya",
      "https://instagram.com/hardik_vatukiya_07",
    ],
    email: "hardikvatukiya0014@gmail.com",
    description:
      "Full Stack Developer and Software Engineer building exceptional digital experiences.",
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hardik Vatukiya Portfolio",
    url: siteUrl,
    description:
      "Portfolio of Hardik Vatukiya - Full Stack Developer, Software Engineer. Building exceptional digital experiences with modern web technologies.",
    author: {
      "@type": "Person",
      name: "Hardik Vatukiya",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/projects?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const portfolioSchema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    "@id": `${siteUrl}/#portfolio`,
    name: "Hardik Vatukiya Portfolio",
    description:
      "Portfolio showcasing projects and skills of Hardik Vatukiya, a Full Stack Developer.",
    creator: {
      "@type": "Person",
      name: "Hardik Vatukiya",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
    </>
  );
}
