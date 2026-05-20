"use client";

import AboutSection, { type AboutData } from "@/components/sections/About";
import Contact, { type ContactData } from "@/components/sections/Contact";
import Journey, { type JourneyStage } from "@/components/sections/Journey";
import Projects, { type SanityProject } from "@/components/sections/Projects";
import Skill, { type SkillItem } from "@/components/sections/Skill";

interface DeferredHomeSectionsProps {
  aboutData?: AboutData;
  projectsData?: SanityProject[];
  journeyData?: JourneyStage[];
  skillsData?: SkillItem[];
  contactData?: ContactData;
}

export default function DeferredHomeSections({
  aboutData,
  projectsData,
  journeyData,
  skillsData,
  contactData,
}: DeferredHomeSectionsProps) {
  return (
    <>
      <div className="about-container">
        <AboutSection initialData={aboutData} />
      </div>
      <Projects initialData={projectsData} />
      <Journey initialData={journeyData} />
      <Skill initialData={skillsData} />
      <div className="contact-container">
        <Contact initialData={contactData} />
      </div>
    </>
  );
}
