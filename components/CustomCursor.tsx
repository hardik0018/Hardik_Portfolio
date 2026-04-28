"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import CursorSVG from "./CursorSVG";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch || reduced) return;

    const el = cursorRef.current;
    if (!el) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.32, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.32, ease: "power3.out" });

    gsap.set(el, { opacity: 0 });

    const onMove = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      gsap.to(el, { opacity: 1, duration: 0.25, overwrite: "auto" });
    };

    const onDown = () => gsap.to(el, { scale: 0.88, duration: 0.1, ease: "power2.out" });
    const onUp = () => gsap.to(el, { scale: 1, duration: 0.18, ease: "power2.out" });
    const onLeave = () => gsap.to(el, { opacity: 0, duration: 0.25 });
    const onEnter = () => gsap.to(el, { opacity: 1, duration: 0.25 });

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
    };
  }, [reduced]);

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] flex items-center will-change-transform"
      style={{ opacity: 0 }}
    >
      <CursorSVG variant="you" size={20} />
      <span
        className="ml-[5px] rounded-[5px] px-[9px] py-[4px] text-[11px] font-semibold leading-none whitespace-nowrap select-none bg-select-blue text-white shadow-[0_2px_10px_rgba(0,0,0,0.3)] tracking-tight"
        style={{
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
        }}
      >
        You
      </span>
    </div>
  );
}
