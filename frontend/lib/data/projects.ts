export type Project = {
  title: string;
  description: string;
  tags: string[];
  src: string;
  color: string;
  url: string;
  github: string;
  year: string;
};

export const projects: Project[] = [
  {
    title: "Echo Live",
    description: "Real-time Messaging Platform",
    tags: ["Node.js", "Socket.io", "React", "MongoDB"],
    src: "https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=800&auto=format&fit=crop",
    color: "#0F172A",
    url: "#",
    github: "#",
    year: "2024",
  },
  {
    title: "Campus Suite",
    description: "Campus Management System",
    tags: ["React", "Express", "MongoDB", "REST API"],
    src: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=800&auto=format&fit=crop",
    color: "#1E3A5F",
    url: "#",
    github: "#",
    year: "2024",
  },
  {
    title: "Fluvo Tap & Go",
    description: "Smart Parking System",
    tags: ["React", "Node.js", "Firebase"],
    src: "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?q=80&w=800&auto=format&fit=crop",
    color: "#0C4A6E",
    url: "#",
    github: "#",
    year: "2023",
  },
];
