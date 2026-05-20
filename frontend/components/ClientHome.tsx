"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import ClientPage from "@/components/ClientPage";
import HeroSection from "@/components/sections/Hero";
import { LazySection } from "@/components/ui/LazySection";
import type { AboutData } from "@/components/sections/About";
import type { HeroData } from "@/components/sections/Hero";
import type { JourneyStage } from "@/components/sections/Journey";
import type { SanityProject } from "@/components/sections/Projects";
import type { SkillItem } from "@/components/sections/Skill";
import type { ContactData } from "@/components/sections/Contact";

// Dynamic imports for heavy animation sections with ssr: false
const AboutSection = dynamic(() => import("@/components/sections/About"), { ssr: false });
const Projects = dynamic(() => import("@/components/sections/Projects"), { ssr: false });
const Journey = dynamic(() => import("@/components/sections/Journey"), { ssr: false });
const Skill = dynamic(() => import("@/components/sections/Skill"), { ssr: false });
const Contact = dynamic(() => import("@/components/sections/Contact"), { ssr: false });

interface ClientHomeProps {
  heroData?: HeroData;
  aboutData?: AboutData;
  projectsData?: SanityProject[];
  journeyData?: JourneyStage[];
  skillsData?: SkillItem[];
  contactData?: ContactData;
}

export default function ClientHome({
  heroData,
  aboutData,
  projectsData,
  journeyData,
  skillsData,
  contactData,
}: ClientHomeProps) {
  return (
    <ClientPage>
      <div className="hero-container">
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <HeroSection initialData={heroData} />
        </Suspense>
      </div>

      <LazySection
        fallback={<div className="h-screen w-full bg-background animate-pulse" />}
        className="about-container"
        minHeight="100vh"
        rootMargin="-10px"
      >
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <AboutSection initialData={aboutData} />
        </Suspense>
      </LazySection>

      <LazySection
        fallback={<div className="h-screen w-full bg-background animate-pulse" />}
        minHeight="100vh"
      >
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <Projects initialData={projectsData} />
        </Suspense>
      </LazySection>

      <LazySection
        fallback={<div className="h-screen w-full bg-background animate-pulse" />}
        minHeight="100vh"
      >
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <Journey initialData={journeyData} />
        </Suspense>
      </LazySection>

      <LazySection
        fallback={<div className="h-screen w-full bg-foreground animate-pulse" />}
        minHeight="100vh"
      >
        <Suspense fallback={<div className="h-screen w-full bg-foreground animate-pulse" />}>
          <Skill initialData={skillsData} />
        </Suspense>
      </LazySection>

      <LazySection
        fallback={<div className="h-screen w-full bg-background animate-pulse" />}
        className="contact-container"
        minHeight="100vh"
      >
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <Contact initialData={contactData} />
        </Suspense>
      </LazySection>
    </ClientPage>
  );
}
