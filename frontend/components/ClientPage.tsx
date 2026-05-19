"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ClientPageProps {
  children: React.ReactNode;
}

export default function ClientPage({ children }: ClientPageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

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
          });
        }

        if (aboutElement) {
          ScrollTrigger.create({
            trigger: aboutElement,
            start: "top top",
            end: "bottom+=100% top",
            pin: true,
            pinSpacing: false,
          });
        }

        // Contact section "Reveal" from behind
        const skillElement = containerRef.current?.querySelector("#skill");
        if (contactElement && skillElement) {
          gsap.set(contactElement, { yPercent: -100 });

          gsap.to(contactElement, {
            yPercent: 0,
            ease: "none",
            scrollTrigger: {
              trigger: skillElement,
              start: "bottom bottom",
              end: () => `+=${(contactElement as HTMLElement).offsetHeight}`,
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-background text-foreground selection:bg-accent-primary selection:text-background overflow-x-hidden"
    >
      {children}
    </main>
  );
}
