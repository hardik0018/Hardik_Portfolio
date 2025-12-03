"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { ArrowRight, RotateCwIcon } from "lucide-react";
import { Footer } from "@/components/footer";

const page = () => {
  const [loading, setLoading] = useState(true);
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
        setLoading(true);
        const res = await fetch("/api/project");
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  return (
    <>
      <div className="py-20 bg-muted/50 relative">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="absolute top-5 left-5 md:left-28 md:top-20">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full group relative overflow-hidden border-primary text-primary"
            >
              <Link href="/" className="flex items-center gap-0 md:gap-2">
                <span className="absolute inset-0 z-0 bg-gradient-to-r from-primary/10 via-primary/20 to-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                <ArrowRight className="rotate-180 z-10 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                <span className="z-10 hidden md:block">BACK</span>
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-center mb-12"
          >
            <div className="inline-block rounded-lg bg-primary/10 px-3 dark:bg-white/80 py-1 text-sm text-primary mb-4">
              Portfolio
            </div>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              My Recent Projects
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Take a look at some of the projects I’ve worked on recently. Each
              one reflects my passion for development and attention to detail.
            </p>
          </motion.div>
          {loading ? (
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
        </div>
      </div>
      <Footer />
    </>
  );
};

export default page;
