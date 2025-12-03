"use client";
import {
  SiJavascript,
  SiReact,
  SiTypescript,
  SiNextdotjs,
  SiTailwindcss,
  SiMongodb,
  SiPostgresql,
  SiBootstrap,
  SiExpress,
  SiFirebase,
  SiFigma,
  SiN8N,
} from "react-icons/si";
import { FaNodeJs } from "react-icons/fa";
import { motion } from "framer-motion";

const skills = [
  { name: "JavaScript", icon: SiJavascript },
  { name: "React", icon: SiReact },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Bootstrap", icon: SiBootstrap },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Tailwind CSS", icon: SiTailwindcss },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Node", icon: FaNodeJs },
  { name: "Express", icon: SiExpress },
  { name: "Firebase", icon: SiFirebase },
  { name: "Figma", icon: SiFigma },
  { name: "n8n", icon: SiN8N},
];

export function SkillsSection() {
  return (
    <section id="skills" className="py-20 bg-muted/50 relative overflow-hidden">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block rounded-lg dark:bg-white/80 bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            Expertise
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            My Skills & Proficiency
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            I've worked with a variety of technologies in the web development
            world. Here's a snapshot of my technical skills and proficiency
            levels.
          </p>
        </motion.div>
        <div className="grid gap-6  sm:grid-cols-2 grid-cols-3 lg:grid-cols-3">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex items-center justify-center gap-4 p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/10 transition-all hover:shadow-lg dark:border-primary/20 hover:border-primary/70 dark:hover:border-primary/80"
              >
                <Icon className="text-primary w-8 h-8 sm:w-6 sm:h-6 lg:w-6 lg:h-6" />
                <span className="font-medium hidden sm:block lg:block">
                  {skill.name}
                </span>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <h3 className="text-xl font-bold mb-6 text-center">
            Other Skills & Tools
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              "Git",
              "Figma",
              "Jest",
              "Redux",
              "Webpack",
              "Vercel",
              "Netlify",
              "Postman",
              "Firebase",
              "Heroku",
            ].map((tool, index) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border border-primary/10 text-sm transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
