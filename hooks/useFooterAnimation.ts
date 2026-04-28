"use client"

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "./useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export interface FooterAnimConfig {
  yOffset: number;
  duration: number;
  ease: string;
}

const DEFAULT_CONFIG: FooterAnimConfig = {
  yOffset: 30,
  duration: 0.8,
  ease: "power3.out",
};

/**
 * Hook to manage footer-specific scroll animations.
 * Handles the entrance of the right-column links and cleanup.
 */
export function useFooterAnimation(config: FooterAnimConfig = DEFAULT_CONFIG) {
  const reduced = useReducedMotion();
  const footerRef = useRef<HTMLElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const rightCol = rightColumnRef.current;
    if (!rightCol) return;

    if (reduced) {
      gsap.set(rightCol, { opacity: 1, y: 0 });
      return;
    }

    // Initial state
    gsap.set(rightCol, { opacity: 0, y: config.yOffset });

    // Entrance animation
    gsap.to(rightCol, {
      opacity: 1,
      y: 0,
      duration: config.duration,
      ease: config.ease,
      scrollTrigger: {
        trigger: footerRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: footerRef, dependencies: [reduced, config] });

  return { footerRef, rightColumnRef };
}
