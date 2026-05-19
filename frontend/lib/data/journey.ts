export interface Stage {
  title: string;
  subtitle: string;
  date: string;
  description: string;
  icon: string; // We'll map this in the component
}

export const stages: Stage[] = [
  {
    title: "Demo",
    subtitle: "demo desc",
    date: "2020 - 2022",
    description:
      "lorum ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.",
    icon: "Sparkles",
  },
  {
    title: "Bachelor of Computer Application",
    subtitle: "Adarsh BCA College",
    date: "2022 - 2025",
    description:
      "Completed BCA with a focus on web development. Gained hands-on experience with React, Node.js, and the MERN stack through personal and academic projects.",
    icon: "GraduationCap",
  },
  {
    title: "Freelance Developer",
    subtitle: "Self-employed",
    date: "2024 - Present",
    description:
      "Providing freelance web development services using the MERN stack and modern UI libraries. Focused on delivering clean, responsive, user-friendly web solutions.",
    icon: "Briefcase",
  },
  {
    title: "MERN Stack Developer",
    subtitle: "Trionn® – UI/UX Design Agency",
    date: "Jun 2025 - Present",
    description:
      "Contributing to real-world projects, collaborating with senior developers, and enhancing skills in React, Node.js, Express, and MongoDB.",
    icon: "Rocket",
  },
];
