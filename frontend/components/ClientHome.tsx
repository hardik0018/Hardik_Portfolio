"use client";

import { Suspense } from "react";
import ClientPage from "@/components/ClientPage";
import HeroSection from "@/components/sections/Hero";
import AwardsSection, { type AwardsData } from "@/components/sections/Awards";

import type { HeroData } from "@/components/sections/Hero";
import type { AboutData } from "@/components/sections/About";
import type { JourneyStage } from "@/components/sections/Journey";
import type { SkillItem } from "@/components/sections/Skill";
import type { ContactData } from "@/components/sections/Contact";
import type { FAQData } from "@/lib/sanity.loader";

import AboutSection from "@/components/sections/About";
import Journey from "@/components/sections/Journey";
import Skill from "@/components/sections/Skill";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";

interface ClientHomeProps {
  heroData?: HeroData;
  aboutData?: AboutData;
  journeyData?: JourneyStage[];
  skillsData?: SkillItem[];
  contactData?: ContactData;
  faqData?: FAQData;
  awardsData?: AwardsData;
}

export default function ClientHome({
  heroData,
  aboutData,
  journeyData,
  skillsData,
  contactData,
  faqData,
  awardsData,
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


      <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
        <Journey initialData={journeyData} />
      </Suspense>

      <Suspense fallback={<div className="w-full bg-foreground animate-pulse" />}>
        <AwardsSection initialData={awardsData} />
      </Suspense>

      <Suspense fallback={<div className="h-screen w-full bg-foreground animate-pulse" />}>
        <Skill initialData={skillsData} />
      </Suspense>

      <div className="faq-container">
        <Suspense fallback={<div className="w-full bg-background animate-pulse" />}>
          <FAQ initialData={faqData} />
        </Suspense>
      </div>

      <div className="contact-container">
        <Suspense fallback={<div className="h-screen w-full bg-background animate-pulse" />}>
          <Contact initialData={contactData} />
        </Suspense>
      </div>
    </ClientPage>
  );
}
