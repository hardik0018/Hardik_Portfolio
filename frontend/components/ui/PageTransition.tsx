"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

export default function PageTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;

      const tl = gsap.timeline({
        onComplete: () => {
          setIsVisible(false);
        },
      });

      // Curved curtain slide-up reveal:
      // Starts as a solid full-screen rectangle (d = M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z).
      // 1. Pulls the center of the bottom edge upwards to create an elegant curve (Q 50 45 0 100).
      // 2. Collapses the entire shape to the top edge (d = M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z).
      tl.to(path, {
        attr: { d: "M 0 0 L 100 0 L 100 100 Q 50 45 0 100 Z" },
        duration: 0.55,
        ease: "power2.in",
      }).to(path, {
        attr: { d: "M 0 0 L 100 0 L 100 0 Q 50 0 0 0 Z" },
        duration: 0.55,
        ease: "power3.out",
      });
    },
    { scope: containerRef }
  );

  if (!isVisible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 pointer-events-none w-screen h-screen"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ fill: "var(--background)" }}
      >
        <path
          ref={pathRef}
          d="M 0 0 L 100 0 L 100 100 Q 50 100 0 100 Z"
        />
      </svg>
    </div>
  );
}
