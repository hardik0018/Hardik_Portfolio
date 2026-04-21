"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Count from 0 to 100 over 1.8 seconds
    const obj = { val: 0 };
    gsap.to(obj, {
      val: 100,
      duration: 1.8,
      ease: "power2.inOut",
      onUpdate() {
        setCount(Math.round(obj.val));
      },
      onComplete() {
        // Exit: wipe upward
        gsap.to(containerRef.current, {
          clipPath: "inset(0 0 100% 0)",
          duration: 0.7,
          ease: "expo.inOut",
          onComplete: () => onComplete(),
        });
      },
    });
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      id="preloader"
      className="preloader fixed inset-0 z-[9999] bg-[var(--bg)] flex items-center justify-center overflow-hidden"
      style={{ clipPath: "inset(0 0 0% 0)" }}
    >
      <span
        style={{
          fontFamily: "var(--font-fraunces)",
          fontSize: "clamp(60px, 15vw, 180px)",
          fontWeight: 100,
          color: "rgba(240,238,232,0.15)",
          letterSpacing: "-0.04em",
          lineHeight: 1,
          minWidth: "3ch",
          textAlign: "right",
        }}
      >
        {count}
      </span>
    </div>
  );
}
