"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const body = document.body;

    if (isOpen) {
      body.style.overflow = "hidden";
      if (reduced) {
        gsap.set(circleRef.current, { clipPath: "circle(150% at 100% 0%)" });
      } else {
        gsap.to(circleRef.current, {
          clipPath: "circle(150% at 100% 0%)",
          duration: 0.8,
          ease: "expo.inOut",
        });
        gsap.from(".menu-link", {
          y: 40,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
          delay: 0.4,
          ease: "power3.out",
        });
      }
    } else {
      body.style.overflow = "";
      if (reduced) {
        gsap.set(circleRef.current, { clipPath: "circle(0% at 100% 0%)" });
      } else {
        gsap.to(circleRef.current, {
          clipPath: "circle(0% at 100% 0%)",
          duration: 0.6,
          ease: "expo.inOut",
        });
      }
    }

    return () => {
      body.style.overflow = "";
    };
  }, [isOpen, reduced]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 top-4 z-[100] flex min-h-11 min-w-11 flex-col items-center justify-center gap-1.5 rounded-full border border-white/10 bg-background/50 p-2 backdrop-blur-sm transition-colors hover:bg-background/70 sm:right-6 sm:top-6"
        aria-expanded={isOpen}
        aria-controls="site-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <span className={cn("w-6 h-0.5 bg-foreground transition-all", isOpen && "rotate-45 translate-y-2")} />
        <span className={cn("w-6 h-0.5 bg-foreground transition-all", isOpen && "opacity-0")} />
        <span className={cn("w-6 h-0.5 bg-foreground transition-all", isOpen && "-rotate-45 -translate-y-2")} />
      </button>

      <div
        id="site-menu"
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-[90] pointer-events-none",
          isOpen && "pointer-events-auto"
        )}
      >
        <div
          ref={circleRef}
          className="absolute inset-0 flex flex-col items-center justify-center bg-background p-6"
          style={{ clipPath: "circle(0% at 100% 0%)" }}
        >
          <div className="flex max-w-full flex-col gap-4 text-center sm:gap-6 md:gap-8">
            {["WORK", "ABOUT", "CONTACT", "ARCHIVE"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setIsOpen(false)}
                className="menu-link font-display text-4xl font-black leading-none text-stroke transition-colors hover:text-foreground sm:text-5xl md:text-7xl lg:text-9xl"
              >
                {link}
              </a>
            ))}
          </div>
          
          <div className="absolute bottom-8 flex flex-wrap justify-center gap-4 px-6 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground sm:bottom-12 sm:gap-6 md:gap-10 md:text-xs">
            <a href="#" className="hover:text-foreground transition-colors">Twitter</a>
            <a href="#" className="hover:text-foreground transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-foreground transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </>
  );
}
