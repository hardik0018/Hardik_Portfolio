"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Expose lenis globally for Header links
    (window as unknown as { lenis: typeof lenis }).lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const rafUpdate = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(rafUpdate);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(rafUpdate);
    };
  }, []);

  return <>{children}</>;
}
