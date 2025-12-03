"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { HoverEffect } from "./ui/card-hover-effect";
import { useEffect, useState } from "react";
import { Circle, RotateCwIcon } from "lucide-react";

export function ProjectsSection() {
  const [Loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([
    {
      title: "",
      description: "",
      image: "",
      tags: [],
      liveUrl: "",
      githubUrl: "",
      featured: false,
    },
  ]);
  useEffect(() => {
    async function fetchProjects() {
      try {
        const res = await fetch("/api/project");

        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setProjects(data.filter((project: any) => project.featured));
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);
  return (
    <section id="projects" className="py-20 bg-muted/50">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-block rounded-lg bg-primary/10 px-3 dark:bg-white/80 py-1 text-sm text-primary mb-4">
            Portfolio
          </div>
          <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
            My Recent Projects
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Here are some of my recent projects. Each project showcases my
            skills and passion for development.
          </p>
        </motion.div>
        {Loading ? (
          <div className="text-center ">
            <RotateCwIcon
              size={30}
              className="inline text-primary animate-spin ml-2"
            />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center text-muted-foreground">
            No featured projects found.
          </div>
        ) : (
          <HoverEffect projects={projects} />
        )}
        {!Loading && projects.length > 0 && (
          <div className="mt-12 text-center">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full group relative overflow-hidden border-primary text-primary"
            >
              <Link href="/projects">
                <span className="relative z-10">View All Projects</span>
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
