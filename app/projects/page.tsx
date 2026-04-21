import ProjectsClient from "@/components/projects-client";
import { connectDB } from "@/lib/MongoDb";
import Project from "@/models/Project";

export default async function ProjectsPage() {
    await connectDB();
    
    let projects = [];
    try {
        const data = await Project.find().sort({ createdAt: -1 });
        projects = JSON.parse(JSON.stringify(data));
    } catch (error) {
        console.error("Error fetching projects on SSR:", error);
    }

    return <ProjectsClient projects={projects} />;
}
