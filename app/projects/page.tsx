import { connectDB } from "@/lib/MongoDb";
import Project from "@/models/Project";
import Nav from "@/components/Nav";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
    let projects = [];
    try {
        await connectDB();
        const data = await Project.find().sort({ createdAt: -1 });
        projects = JSON.parse(JSON.stringify(data));
    } catch (error) {
        console.error("Error fetching projects:", error);
    }

    // Hand-picked display data if DB is empty
    const displayProjects = projects.length > 0 ? projects : [
        { _id: '1', title: 'Unifying Dealer Experience', tags: ['Product Design'], createdAt: new Date().toISOString() },
        { _id: '2', title: 'Allegion Access Management', tags: ['Enterprise UX'], createdAt: new Date().toISOString() },
        { _id: '3', title: 'Digital Tradition Scaling', tags: ['Growth · Loyalty'], createdAt: new Date().toISOString() },
    ];

    return (
        <main className="min-h-screen bg-background text-foreground pt-32 px-6">
            <Nav />
            <div className="max-w-[1400px] mx-auto">
                <header className="mb-24 flex flex-col items-start gap-4">
                    <div className="px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-[9px] font-mono tracking-[0.2em] text-primary">
                        INDEX / 2025
                    </div>
                    <h1 className="font-display text-6xl md:text-9xl tracking-tight leading-[0.8]">
                        ARCHIVE
                    </h1>
                    <p className="max-w-md text-muted-foreground font-mono text-[11px] uppercase tracking-widest mt-6 opacity-60">
                        A curated history of experimental interactions and enterprise solutions.
                    </p>
                </header>

                <div className="grid gap-px bg-border/5 border-y border-border/10">
                    {displayProjects.map((p: any) => (
                        <div 
                            key={p._id} 
                            className="group relative flex flex-col md:flex-row md:items-center justify-between py-10 px-4 hover:bg-white/[0.02] transition-colors overflow-hidden"
                        >
                            <div className="flex items-center gap-10 z-10">
                                <span className="font-mono text-[10px] text-muted-foreground/30 tabular-nums">
                                    {new Date(p.createdAt).getFullYear()}
                                </span>
                                <h2 className="text-3xl md:text-5xl font-medium tracking-tight group-hover:translate-x-3 transition-transform duration-700 ease-expo">
                                    {p.title}
                                </h2>
                            </div>
                            
                            <div className="flex items-center gap-16 z-10 mt-6 md:mt-0">
                                <div className="flex gap-2">
                                    {p.tags?.slice(0, 2).map((tag: string) => (
                                        <span key={tag} className="font-mono text-[9px] uppercase tracking-widest px-2 py-0.5 border border-white/10 rounded-sm text-muted-foreground/60">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="hidden md:flex h-10 w-10 items-center justify-center rounded-full border border-white/10 group-hover:bg-white group-hover:text-black transition-all duration-300">
                                    <span className="text-xl group-hover:rotate-45 transition-transform duration-300">→</span>
                                </div>
                            </div>

                            {/* Background hover effect */}
                            <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

// Custom ease for the project list
const customEase = "cubic-bezier(0.19, 1, 0.22, 1)";
