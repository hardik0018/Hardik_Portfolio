import HomeClient from "@/components/home-client";
import { connectDB } from "@/lib/MongoDb";
import Project from "@/models/Project";

export default async function Page() {
    await connectDB();
    
    // Fetch projects on the server
    let projects = [];
    try {
        const data = await Project.find({ featured: true }).sort({ createdAt: -1 }).limit(4);
        projects = JSON.parse(JSON.stringify(data)); // Serialize for client component
    } catch (error) {
        console.error("Error fetching projects on SSR:", error);
    }

    return <HomeClient projects={projects} />;
}
