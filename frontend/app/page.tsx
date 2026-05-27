import ClientHome from "@/components/ClientHome";
import { getHero, getAbout, getProjects, getJourney, getSkills, getContact, getFAQ } from "@/lib/sanity.loader";

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
