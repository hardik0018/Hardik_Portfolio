"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import ClientPage from "@/components/ClientPage";
import HeroSection from "@/components/sections/Hero";
import { LazySection } from "@/components/ui/LazySection";
import type { HeroData } from "@/components/sections/Hero";
import type { AboutData } from "@/components/sections/About";
import type { SanityProject } from "@/components/sections/Projects";
import type { JourneyStage } from "@/components/sections/Journey";
import type { SkillItem } from "@/components/sections/Skill";
import type { ContactData } from "@/components/sections/Contact";
import type { FAQData } from "@/lib/sanity.loader";

// Dynamic imports for heavy animation sections with ssr: false
// About is NOT lazy-gated — it's the 2nd section and must be in DOM before
// any scrolling occurs so GSAP pin + animation positions are always correct.
const AboutSection = dynamic(() => import("@/components/sections/About"), { ssr: false });
const Projects = dynamic(() => import("@/components/sections/Projects"), { ssr: false });
const Journey = dynamic(() => import("@/components/sections/Journey"), { ssr: false });
const Skill = dynamic(() => import("@/components/sections/Skill"), { ssr: false });
const FAQ = dynamic(() => import("@/components/sections/FAQ"), { ssr: true });
const Contact = dynamic(() => import("@/components/sections/Contact"), { ssr: false });

interface ClientHomeProps {
  heroData?: HeroData;
  aboutData?: AboutData;
  projectsData?: SanityProject[];
  journeyData?: JourneyStage[];
  skillsData?: SkillItem[];
  contactData?: ContactData;
  faqData?: FAQData;
}

export default function ClientHome({
  heroData,
  aboutData,
  projectsData,
  journeyData,
  skillsData,
  contactData,
  faqData,
}: ClientHomeProps) {
  return (
    <ClientPage>
      <div className="hero-container">
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <HeroSection initialData={heroData} />
        </Suspense>
      </div>

      {/*
        About is eagerly rendered — NO LazySection gate.
        Reason: About is pinned by GSAP (ClientPage.tsx). If it lazy-loads
        mid-scroll, its internal animations fire at already-past trigger
        positions (invisible content), and the pin spacer recalculates
        while the user is in motion, causing the scroll-jump bug.
      */}
      <div className="about-container">
        <Suspense fallback={<div className="h-screen w-full bg-foreground animate-pulse" />}>
          <AboutSection initialData={aboutData} />
        </Suspense>
      </div>

      {/*
        rootMargin="500px" preloads sections 500px before they enter the
        viewport — gives enough time for heavy GSAP sections to fully mount
        and measure heights BEFORE the user arrives, preventing mid-scroll
        layout recalculations and the associated scroll jank.
      */}
      <LazySection
        fallback={<div className="h-screen w-full bg-background animate-pulse" />}
        minHeight="100vh"
        rootMargin="500px"
      >
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <Projects initialData={projectsData} />
        </Suspense>
      </LazySection>

      <LazySection
        fallback={<div className="h-screen w-full bg-background animate-pulse" />}
        minHeight="100vh"
        rootMargin="500px"
      >
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <Journey initialData={journeyData} />
        </Suspense>
      </LazySection>

      <LazySection
        fallback={<div className="h-screen w-full bg-foreground animate-pulse" />}
        minHeight="100vh"
        rootMargin="300px"
      >
        <Suspense fallback={<div className="h-screen w-full bg-foreground animate-pulse" />}>
          <Skill initialData={skillsData} />
        </Suspense>
      </LazySection>

      <LazySection
        fallback={<div className="h-screen w-full bg-background animate-pulse" />}
        className="faq-container"
        minHeight="100vh"
        rootMargin="300px"
      >
        <Suspense fallback={<div className="w-full bg-background animate-pulse" />}>
          <FAQ initialData={faqData} />
        </Suspense>
      </LazySection>

      <LazySection
        fallback={<div className="h-screen w-full bg-background animate-pulse" />}
        className="contact-container"
        minHeight="100vh"
        rootMargin="300px"
      >
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <Contact initialData={contactData} />
        </Suspense>
      </LazySection>
    </ClientPage>
  );
}
