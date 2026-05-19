import dynamic from "next/dynamic";
import { Suspense } from "react";
import ClientPage from "@/components/ClientPage";
import { getHero, getAbout, getProjects, getJourney, getSkills, getContact } from "@/lib/sanity.loader";

// Dynamic imports for heavy animation sections
const HeroSection = dynamic(() => import("@/components/sections/Hero"), { ssr: true });
const AboutSection = dynamic(() => import("@/components/sections/About"), { ssr: true });
const Projects = dynamic(() => import("@/components/sections/Projects"), { ssr: true });
const Journey = dynamic(() => import("@/components/sections/Journey"), { ssr: true });
const Skill = dynamic(() => import("@/components/sections/Skill"), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact"), { ssr: true });

export default async function Home() {
  const [heroData, aboutData, projectsData, journeyData, skillsData, contactData] = await Promise.all([
    getHero(),
    getAbout(),
    getProjects(),
    getJourney(),
    getSkills(),
    getContact()
  ]);

  return (
    <ClientPage>
      <div className="hero-container">
        <Suspense fallback={<div className="h-screen w-full bg-background" />}>
          <HeroSection initialData={heroData} />
        </Suspense>
      </div>

      <div className="about-container">
        <Suspense fallback={<div className="h-screen w-full bg-foreground" />}>
          <AboutSection initialData={aboutData} />
        </Suspense>
      </div>

      <Suspense fallback={<div className="h-screen w-full bg-background" />}>
        <Projects initialData={projectsData} />
      </Suspense>

      <Suspense fallback={<div className="h-screen w-full bg-background" />}>
        <Journey initialData={journeyData} />
      </Suspense>

      <Suspense fallback={<div className="h-screen w-full bg-background" />}>
        <Skill initialData={skillsData} />
      </Suspense>

      <div className="contact-container">
        <Suspense fallback={<div className="h-screen w-full bg-foreground" />}>
          <Contact initialData={contactData} />
        </Suspense>
      </div>
    </ClientPage>
  );
}
