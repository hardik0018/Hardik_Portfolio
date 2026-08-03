"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

interface ClientPageProps {
  children: React.ReactNode;
}

export default function ClientPage({ children }: ClientPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const heroElement = containerRef.current?.querySelector(".hero-container");
    const aboutElement = containerRef.current?.querySelector(".about-container");
    const contactElement = containerRef.current?.querySelector(".contact-container");

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      if (heroElement) {
        ScrollTrigger.create({
          trigger: heroElement,
          start: "top top",
          end: "bottom+=100% top",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      }

      if (aboutElement) {
        ScrollTrigger.create({
          trigger: aboutElement,
          start: "top top",
          end: "bottom+=100% top",
          pin: true,
          pinSpacing: false,
          invalidateOnRefresh: true,
        });
      }

      // Contact section "Reveal" from behind effect is removed to prevent layout jumps 
      // when the FAQ section dynamically changes height above it.
      // The contact section will now scroll normally.
    });

    // Ensure ScrollTrigger correctly measures everything after initial render
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  }, { scope: containerRef });

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-background text-foreground selection:bg-accent-primary selection:text-background overflow-x-hidden"
    >
      {children}
    </main>
  );
}
