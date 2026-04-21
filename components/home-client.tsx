"use client";

import React, { useState } from "react";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/home/Hero";
import Marquee from "@/components/home/Marquee";
import Projects from "@/components/home/Projects";
import Expertise from "@/components/home/Expertise";
import About from "@/components/home/About";
import Contact from "@/components/home/Contact";
import { useScroll, useSpring, motion } from "framer-motion";

export default function HomeClient({ projects }: { projects: any[] }) {
  const [loaded, setLoaded] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <div className="relative bg-[var(--bg)] text-[var(--text-primary)]">
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}

      <div className={loaded ? "opacity-100" : "opacity-0 invisible"}>

        {/* Scroll Progress Bar */}
        <motion.div
          style={{ scaleX }}
          className="fixed top-0 left-0 right-0 h-[2px] bg-[var(--accent)] z-[100] origin-left"
        />

        <Navbar />

        <main>
          <Hero />
          <Marquee />
          <Projects projects={projects} />
          <Expertise />
          <About />
          <Contact />
        </main>
      </div>
    </div>
  );
}
