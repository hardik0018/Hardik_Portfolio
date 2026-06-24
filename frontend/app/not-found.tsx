"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP } from "@/lib/gsap";
import { Home } from "lucide-react";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);

  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);
  const blob3Ref = useRef<HTMLDivElement>(null);

  // Setup GSAP floating animations for the blobs
  useGSAP(() => {
    // Float Blob 1 (Lime accent)
    gsap.to(blob1Ref.current, {
      x: "8vw",
      y: "-5vh",
      scale: 1.15,
      duration: 16,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Float Blob 2 (Primary green accent)
    gsap.to(blob2Ref.current, {
      x: "-7vw",
      y: "8vh",
      scale: 0.9,
      duration: 20,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });

    // Float Blob 3 (Secondary blue accent)
    gsap.to(blob3Ref.current, {
      x: "5vw",
      y: "-8vh",
      scale: 1.05,
      duration: 14,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, { scope: containerRef });

  // Handle interactive coordinates, spotlight, and text tilt
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Set initial values
    const rect = container.getBoundingClientRect();
    container.style.setProperty("--mouse-x", `${rect.width / 2}px`);
    container.style.setProperty("--mouse-y", `${rect.height / 2}px`);

    const updatePosition = (clientX: number, clientY: number) => {
      const containerRect = container.getBoundingClientRect();
      const x = clientX - containerRect.left;
      const y = clientY - containerRect.top;

      // Smoothly animate the spotlight position variables using GSAP
      gsap.to(container, {
        "--mouse-x": `${x}px`,
        "--mouse-y": `${y}px`,
        duration: 0.45,
        ease: "power2.out",
      });

      // 3D Parallax Tilt for the 404 numbers card
      if (tiltRef.current) {
        const cx = clientX - containerRect.left - containerRect.width / 2;
        const cy = clientY - containerRect.top - containerRect.height / 2;

        const rotateX = -(cy / containerRect.height) * 24; // Max 24 deg rotation
        const rotateY = (cx / containerRect.width) * 24;

        gsap.to(tiltRef.current, {
          rotateX,
          rotateY,
          transformPerspective: 1000,
          duration: 0.5,
          ease: "power2.out",
        });
      }

      // Parallax Shadow shifting in the opposite direction
      if (shadowRef.current) {
        const cx = clientX - containerRect.left - containerRect.width / 2;
        const cy = clientY - containerRect.top - containerRect.height / 2;

        const sx = -(cx / containerRect.width) * 35; // Shift offset
        const sy = -(cy / containerRect.height) * 35;

        gsap.to(shadowRef.current, {
          x: sx,
          y: sy,
          duration: 0.45,
          ease: "power2.out",
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  // Magnetic Button Effect
  const handleButtonMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = buttonRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    // Pull button 35% towards cursor
    gsap.to(el, {
      x: x * 0.35,
      y: y * 0.35,
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleButtonMouseLeave = () => {
    const el = buttonRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      scale: 1,
      duration: 0.6,
      ease: "elastic.out(1.1, 0.4)",
    });
  };

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground relative overflow-hidden px-6 text-center select-none font-sans"
      style={{
        "--mouse-x": "50%",
        "--mouse-y": "50%",
      } as React.CSSProperties}
    >
      {/* Dynamic Background glowing blobs (Visible inside spotlight) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div
          ref={blob1Ref}
          className="absolute w-[45vw] h-[45vw] min-w-[320px] min-h-[320px] rounded-full blur-[130px] opacity-25"
          style={{
            background: "radial-gradient(circle, var(--accent-lime) 0%, transparent 70%)",
            top: "10%",
            left: "15%",
          }}
        />
        <div
          ref={blob2Ref}
          className="absolute w-[50vw] h-[50vw] min-w-[350px] min-h-[350px] rounded-full blur-[140px] opacity-15"
          style={{
            background: "radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)",
            bottom: "15%",
            right: "10%",
          }}
        />
        <div
          ref={blob3Ref}
          className="absolute w-[40vw] h-[40vw] min-w-[280px] min-h-[280px] rounded-full blur-[110px] opacity-12"
          style={{
            background: "radial-gradient(circle, var(--accent-secondary) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
      </div>

      {/* Highlighted Grid Pattern (Revealed within spotlight radius) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,143,81,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,143,81,0.025)_1px,transparent_1px)] bg-size-[28px_28px] pointer-events-none z-10" />

      {/* Rotating Radar/Compass Outline (Decorative overlay matching the "Lost" theme) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] md:w-[650px] md:h-[650px] pointer-events-none opacity-15 z-10">
        <svg viewBox="0 0 200 200" className="w-full h-full text-accent-primary animate-[spin_180s_linear_infinite]">
          <circle cx="100" cy="100" r="98" fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="1 3" />
          <circle cx="100" cy="100" r="82" fill="none" stroke="currentColor" strokeWidth="0.1" />
          <circle cx="100" cy="100" r="62" fill="none" stroke="currentColor" strokeWidth="0.2" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeWidth="0.15" />
          <line x1="100" y1="0" x2="100" y2="200" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2 2" />
          <line x1="0" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.1" strokeDasharray="2 2" />
          <path d="M 100 2 L 100 8 M 100 192 L 100 198 M 2 100 L 8 100 M 192 100 L 198 100" stroke="currentColor" strokeWidth="0.6" />
        </svg>
      </div>

      {/* Light Spotlight Mask Overlay (Shades borders with light opaque color, cuts out around cursor) */}
      <div
        className="absolute inset-0 pointer-events-none z-20"
        style={{
          background: "radial-gradient(circle 280px at var(--mouse-x) var(--mouse-y), transparent 0%, rgba(253, 253, 253, 0.6) 45%, var(--background) 95%)",
        }}
      />

      {/* Content wrapper */}
      <div className="relative z-30 max-w-2xl mx-auto flex flex-col items-center">
        {/* 3D Tilting 404 Container */}
        <div ref={tiltRef} className="relative w-full flex items-center justify-center py-6 select-none will-change-transform">
          {/* Interactive Depth Shadow */}
          <div
            ref={shadowRef}
            className="absolute text-[10rem] sm:text-[14rem] md:text-[17rem] font-bold tracking-tighter leading-none select-none text-foreground/55 blur-sm pointer-events-none font-sans"
            style={{ transform: "translate(0px, 0px)" }}
          >
            404
          </div>

          {/* Main 404 Heading */}
          <h1 className="relative text-[10rem] sm:text-[14rem] md:text-[17rem] font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-linear-to-b from-foreground via-foreground to-foreground drop-shadow-[0_25px_50px_rgba(0,0,0,0.04)] select-none font-sans">
            404
          </h1>
        </div>

        {/* Text descriptions */}
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2 font-sans mt-4">
          You&apos;ve drifted off the grid.
        </h2>
        <p className="text-sm sm:text-base text-foreground max-w-md mx-auto font-body font-light leading-relaxed">
          The coordinates you are trying to reach do not exist. The destination has faded into the background or been relocated.
        </p>

        {/* Magnetic Button Area */}
        <div
          className="relative mt-8 inline-block py-4 px-10 group cursor-pointer"
          onMouseMove={handleButtonMouseMove}
          onMouseLeave={handleButtonMouseLeave}
        >
          <div ref={buttonRef} className="relative z-30">
            <Link
              href="/"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-accent-primary text-background transition-all duration-300 group-hover:bg-transparent group-hover:text-accent-primary border border-accent-primary cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              Return to Safety
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
