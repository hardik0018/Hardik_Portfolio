import type { Metadata } from "next";
import ClientHome from "@/components/ClientHome";
import { getHero, getAbout, getJourney, getSkills, getContact, getFAQ, getAwards } from "@/lib/sanity.loader";
import { siteUrl } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import { getProfilePageSchema, getFaqSchema } from "@/lib/schema";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Hardik Vatukiya — Full-Stack Developer",
    description:
      "Full-Stack Developer from Rajkot, India. React, Next.js, Node.js. Available for freelance work.",
    creator: "@hardikvatukiya",
  },
};

export default async function Home() {
  const [heroData, aboutData, journeyData, skillsData, contactData, faqData, awardsData] = await Promise.all([
    getHero(),
    getAbout(),
    getJourney(),
    getSkills(),
    getContact(),
    getFAQ(),
    getAwards()
  ]);

  const profileSchema = getProfilePageSchema();
  const faqSchema = getFaqSchema(faqData?.items || []);

  const schemaGraph = {
    "@context": "https://schema.org",
    "@graph": [profileSchema, ...(faqSchema ? [faqSchema] : [])],
  };

  return (
    <>
      <JsonLd schema={schemaGraph} />
      <ClientHome
        heroData={heroData}
        aboutData={aboutData}
        journeyData={journeyData}
        skillsData={skillsData}
        contactData={contactData}
        faqData={faqData}
        awardsData={awardsData}
      />
    </>
  );
}
