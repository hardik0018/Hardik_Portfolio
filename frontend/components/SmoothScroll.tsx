"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // 1. Disable browser scroll restoration to prevent jumps on page load
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // 2. Initialize Lenis with autoRaf disabled to tick manually via GSAP
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      autoRaf: false, // Sync manually via GSAP ticker
    });

    lenisRef.current = lenis;

    // Expose lenis globally for Header links
    (window as unknown as { lenis: typeof lenis }).lenis = lenis;

    // Sync scroll events with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // 3. Connect Lenis updates with GSAP ticker for perfect animation sync
    const updateLenis = (time: number) => {
      lenis.raf(time * 1000); // convert seconds to milliseconds
    };
    gsap.ticker.add(updateLenis);

    // Prevent GSAP lagSmoothing jumps
    gsap.ticker.lagSmoothing(0);

    // Force scroll to top on initial page load / refresh
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // 4. Full refresh after layout stabilizes
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 400);

    return () => {
      gsap.ticker.remove(updateLenis);
      lenis.destroy();
      clearTimeout(timer);
      lenisRef.current = null;
    };
  }, []);

  // Reset scroll and refresh ScrollTrigger on route changes (soft navigations)
  useEffect(() => {
    if (lenisRef.current) {
      window.scrollTo(0, 0);
      lenisRef.current.scrollTo(0, { immediate: true });

      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <>{children}</>;
}
