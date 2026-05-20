import ClientHome from "@/components/ClientHome";
import { getHero, getAbout, getProjects, getJourney, getSkills, getContact } from "@/lib/sanity.loader";

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
    <ClientHome
      heroData={heroData}
      aboutData={aboutData}
      projectsData={projectsData}
      journeyData={journeyData}
      skillsData={skillsData}
      contactData={contactData}
    />
  );
}
