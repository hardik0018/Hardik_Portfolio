import type { Metadata } from "next";
import ClientHome from "@/components/ClientHome";
import { getHero, getAbout, getProjects, getJourney, getSkills, getContact, getFAQ } from "@/lib/sanity.loader";
import { siteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Hardik Vatukiya — Full-Stack Developer | React, Next.js & Node.js Engineer",
  description:
    "Hardik Vatukiya is a Full-Stack Developer from Rajkot, India specializing in React, Next.js, Node.js, and MERN Stack. Building fast, accessible web applications. Available for freelance & contract work worldwide.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Hardik Vatukiya — Full-Stack Developer | React, Next.js & Node.js",
    description:
      "Hardik Vatukiya is a Full-Stack Developer from Rajkot, India specializing in React, Next.js, and Node.js. Available for freelance & contract work worldwide.",
    url: siteUrl,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Hardik Vatukiya — Full-Stack Developer specializing in React, Next.js and Node.js",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hardik Vatukiya — Full-Stack Developer",
    description:
      "Full-Stack Developer from Rajkot, India. React, Next.js, Node.js. Available for freelance work.",
    creator: "@hardikvatukiya",
    images: ["/opengraph-image"],
  },
};

export default async function Home() {
  const [heroData, aboutData, projectsData, journeyData, skillsData, contactData, faqData] = await Promise.all([
    getHero(),
    getAbout(),
    getProjects(),
    getJourney(),
    getSkills(),
    getContact(),
    getFAQ()
  ]);

  return (
    <ClientHome
      heroData={heroData}
      aboutData={aboutData}
      projectsData={projectsData}
      journeyData={journeyData}
      skillsData={skillsData}
      contactData={contactData}
      faqData={faqData}
    />
  );
}
