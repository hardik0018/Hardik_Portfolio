"use client";

import { motion } from "framer-motion";
import { Briefcase, GraduationCap } from "lucide-react";

const experiences = [
  {
    id: 1,
    title: "Class 11-12",
    company: "Shree Sahajanda High School",
    period: "2020 - 2022",
    description:
      "Completed Class 11–12 in Commerce stream from Shree Sahajanda High School. Built a strong academic foundation before transitioning into the tech field during college.",
    type: "education",
  },
  {
    id: 2,
    title: "Bechalor of computer application",
    company: "Adarsh BCA College",
    period: "2022 - 2025",
    description:
      "Completed Bachelor of Computer Applications with a focus on web development. Gained hands-on experience with React, Node.js, and the MERN stack through personal and academic projects.",
    type: "education",
  },
  {
    id: 3,
    title: "Freelance Developer",
    company: "Self-employed",
    period: "2024 - Present",
    description:
      "Providing freelance web development services using the MERN stack and modern UI libraries. Focused on delivering clean, responsive, and user-friendly web solutions.",
    type: "work",
  },
  {
    id: 4,
    title: "MERN Stack Developer",
    company: "Trionn® – UI/UX Design Agency",
    period: "Jun 2025 - Present",
    description:
      "Currently working as a MERN Stack Developer at Trionn. Contributing to real-world projects, collaborating with senior developers, and enhancing skills in React, Node.js, Express, and MongoDB.",
    type: "work",
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="py-20 bg-muted/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block dark:bg-white/80 rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
            Journey
          </div>
          <h2 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            Experience & Education
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A snapshot of my academic and project-based experience.
          </p>
        </motion.div>
        <div className="relative max-w-3xl mx-auto">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/20 via-primary/50 to-primary/20" />

          {/* Timeline items */}
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative mb-12 ${
                index % 2 === 0 ? "left-timeline" : "right-timeline"
              }`}
            >
              <div
                className={`flex items-center flex-col sm:flex-row ${
                  index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
                }`}
              >
                <div
                  className={`w-full sm:w-1/2 ${
                    index % 2 === 0 ? "sm:pr-8 sm:text-right" : "sm:pl-8"
                  }`}
                >
                  <div className="p-4 rounded-xl bg-background/80 backdrop-blur-sm border border-primary/10 dark:border-primary/20 transition-all duration-300 hover:border-primary/70 dark:hover:border-primary/80">
                    <h3 className="font-bold text-xl">{exp.title}</h3>
                    <h4 className="text-primary font-medium">{exp.company}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {exp.period}
                    </p>
                    <p className="text-muted-foreground ">{exp.description}</p>
                  </div>
                </div>
                <div className="z-10 flex items-center justify-center w-12 h-12 rounded-full bg-background border border-primary shadow-lg">
                  {exp.type === "work" ? (
                    <Briefcase className="h-6 w-6 text-primary" />
                  ) : (
                    <GraduationCap className="h-6 w-6 text-primary" />
                  )}
                </div>
                <div className="w-1/2" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
