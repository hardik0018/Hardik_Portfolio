import { useEffect, useCallback, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_ANIMATION_CONFIG } from "../constants";

export function useMouseParallax(
  contentRef: RefObject<HTMLDivElement | null>,
  isEnabled: boolean
) {
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!contentRef.current || window.scrollY > 100) return;
    
    const { clientX, clientY } = e;
    const strength = HERO_ANIMATION_CONFIG.parallaxStrength;
    const xPos = (clientX / window.innerWidth - 0.5) * strength;
    const yPos = (clientY / window.innerHeight - 0.5) * strength;

    gsap.to(contentRef.current, {
      x: xPos,
      y: yPos,
      duration: 1.5,
      ease: "power3.out",
    });
  }, [contentRef]);

  useEffect(() => {
    if (!isEnabled || ScrollTrigger.isScrolling()) return;

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isEnabled, handleMouseMove]);
}
