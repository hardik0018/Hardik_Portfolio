"use client";

import { Button } from "@/components/ui/button";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import { FlipWords } from "./ui/flip-words";

export function HeroSection() {
  const words = [
    "MERN Developer",
    "UI/UX Designer",
    "Problem Solver",
    "Creative Thinker",
  ];

  return (
    <AnimatedGradient className="relative overflow-hidden py-20 md:py-32 lg:py-40">
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl"
          >
            <span className="block text-primary dark:text-white">
              Hardik Vatukiya
            </span>
            <span className="block mt-1 h-16">
              <FlipWords words={words} />
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-lg text-muted-foreground"
          >
            Creating seamless, accessible digital solutions for real-world
            problems.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              variant="ghost"
              className="group relative overflow-hidden bg-secondary/30 rounded-full px-6 py-2 transition-all duration-300 ease-out"
            >
              <Link href="#contact" className="flex items-center ">
                <span className="relative z-10">Hire Me</span>
                {/* <span className="absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span> */}
                <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="group relative overflow-hidden rounded-full bg-secondary/30 px-6 py-2 transition-all duration-300 ease-out"
            >
              <Link
                href="https://drive.google.com/file/d/1zYfnfMV2D59Eqfd1B2y2s0i2o-s5kJCX/view?usp=sharing"
                className="flex items-center"
                target="_blank"
              >
                <span className="relative z-10">Download Resume</span>

                <Download className="relative z-10 ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-y-1" />
              </Link>
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8 flex justify-center gap-4"
          >
            <Link
              href="https://github.com/hardik0018"
              target="_blank"
              className="group relative rounded-full p-2 text-secondary-foreground transition-colors dark:hover:text-neutral-300 hover:text-primary"
            >
              <span className="absolute inset-0 rounded-full bg-secondary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <Github className="relative z-10 h-6 w-6" />
            </Link>
            <Link
              href="https://linkedin.com/in/hardik-vatukiya"
              target="_blank"
              className="group relative rounded-full p-2 text-secondary-foreground transition-colors dark:hover:text-neutral-300 hover:text-primary"
            >
              <span className="absolute inset-0 rounded-full bg-secondary/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
              <Linkedin className="relative z-10 h-6 w-6" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </AnimatedGradient>
  );
}
