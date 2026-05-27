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

    // 2. Initialize Lenis with autoRaf: false, as we drive it via GSAP ticker
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      autoRaf: false, // Prevents fighting between Lenis RAF and GSAP ticker
    });

    lenisRef.current = lenis;

    // Expose lenis globally for Header links
    (window as unknown as { lenis: typeof lenis }).lenis = lenis;

    // Sync scroll events with ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Sync Lenis with GSAP's ticker (converting seconds to ms)
    const rafUpdate = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafUpdate);
    gsap.ticker.lagSmoothing(0);

    // 3. Force scroll to top on initial page load / refresh
    window.scrollTo(0, 0);
    lenis.scrollTo(0, { immediate: true });

    // 4. Force a ScrollTrigger refresh after a short delay once hydration/layout stabilizes
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 250);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafUpdate);
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
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  return <>{children}</>;
}
