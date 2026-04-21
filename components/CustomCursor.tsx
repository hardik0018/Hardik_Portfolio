"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;

    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      
      // Dot - no lag
      gsap.set(dot, { x, y });
      
      // Ring - follow with lag
      gsap.to(ring, {
        x,
        y,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    const onMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const dataCursor = target.closest('[data-cursor]')?.getAttribute('data-cursor');

      if (dataCursor === 'view') {
        gsap.to(ring, { scale: 2, duration: 0.3 });
        ring.innerHTML = '<span class="text-[8px] font-bold uppercase tracking-widest">VIEW</span>';
      } else if (dataCursor === 'drag') {
        gsap.to(ring, { scale: 2, duration: 0.3 });
        ring.innerHTML = '<span class="text-[8px] font-bold uppercase tracking-widest">DRAG</span>';
      } else if (dataCursor === 'link') {
        gsap.to(ring, { scale: 0.5, backgroundColor: 'var(--accent)', duration: 0.3 });
      }
    };

    const onMouseLeave = () => {
      gsap.to(ring, { scale: 1, backgroundColor: 'transparent', duration: 0.3 });
      ring.innerHTML = '';
    };

    window.addEventListener("mousemove", onMouseMove);
    document.body.addEventListener("mouseover", onMouseEnter);
    document.body.addEventListener("mouseout", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeEventListener("mouseover", onMouseEnter);
      document.body.removeEventListener("mouseout", onMouseLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-[var(--accent)] rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2"
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-[44px] h-[44px] border border-[var(--text-primary)]/30 rounded-full pointer-events-none z-[9998] flex items-center justify-center -translate-x-1/2 -translate-y-1/2 text-[var(--accent)]"
      />
    </>
  );
}
