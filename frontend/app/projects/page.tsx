import dynamic from "next/dynamic";
import { getProjects } from "@/lib/sanity.loader";

const WorkListing = dynamic(() => import("@/components/sections/WorkListing"), { ssr: true });

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProjectsPage() {
  const projectsData = await getProjects();

  return <WorkListing initialData={projectsData} />;
}
