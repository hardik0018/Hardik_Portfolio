"use client";

import { useRef, useState, useEffect } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Logo from "./ui/Logo";

// ─── Global State ────────────────────────────────────────────────────────────
// This persists across client-side navigations but resets on a full page reload
let hasLoadedOnce = false;

// ─── Progress stops ───────────────────────────────────────────────────────────
const progressStops = [0, 18, 37, 56, 74, 92, 100];

import { buildCloth, drawCloth, animateClothWhisk, ClothState } from "@/lib/clothPhysics";

// ─── Theme colours for progress bar ───────────────────────────────────────────
const C_GREEN  = "0, 143, 81";    // --accent-primary #008f51
const C_BLUE   = "0, 0, 221";     // --accent-secondary #0000dd
const C_LIME   = "193, 255, 74";  // --accent-lime #c1ff4a


// ─── Component ───────────────────────────────────────────────────────────────
export default function MainLoader() {
  const rootRef    = useRef<HTMLDivElement>(null);
  const barRef     = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const initialCoverRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const revealFired = useRef(false);
  const clothStateRef = useRef<ClothState | null>(null);

  // ── Build cloth and draw initial flat state ───────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;
    clothStateRef.current = buildCloth(W, H);
    const ctx = canvas.getContext("2d");
    if (ctx) drawCloth(ctx, clothStateRef.current, W, H, false);

    const onResize = () => {
      const nW = window.innerWidth, nH = window.innerHeight;
      canvas.width  = nW;
      canvas.height = nH;
      clothStateRef.current = buildCloth(nW, nH);
      const c2 = canvas.getContext("2d");
      if (c2) drawCloth(c2, clothStateRef.current, nW, nH, false);
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      window.removeEventListener("resize", onResize);
      if (clothStateRef.current) cancelAnimationFrame(clothStateRef.current.rafId);
    };
  }, []);

  // ── Lock scrolling while loader is visible ────────────────────────────────
  useEffect(() => {
    if (visible && !hasLoadedOnce) {
      document.body.style.overflow = "hidden";
      const checkLenis = setInterval(() => {
        const w = window as unknown as { lenis?: { start: () => void; stop: () => void } };
        if (w.lenis) {
          w.lenis.stop();
          clearInterval(checkLenis);
        }
      }, 50);
      return () => {
        clearInterval(checkLenis);
        document.body.style.overflow = "";
        const w = window as unknown as { lenis?: { start: () => void; stop: () => void } };
        if (w.lenis) {
          w.lenis.start();
        }
      };
    } else {
      document.body.style.overflow = "";
      const w = window as unknown as { lenis?: { start: () => void; stop: () => void } };
      if (w.lenis) {
        w.lenis.start();
      }
    }
  }, [visible]);

  // ── Loading progress + entrance ───────────────────────────────────────────
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !barRef.current) return;

      if (hasLoadedOnce) {
        setVisible(false);
        return;
      }

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const counter = { value: 0 };

      const ctx = gsap.context(() => {
        gsap.set("[data-loader-reveal]", { autoAlpha: 0, y: 20 });
        gsap.set("[data-loader-scale]",  { autoAlpha: 0, scale: 0.9 });
        gsap.set(barRef.current,         { scaleX: 0.04, transformOrigin: "left center" });

        if (reduceMotion) {
          gsap.set("[data-loader-reveal],[data-loader-scale]", { autoAlpha: 1, y: 0, scale: 1 });
          setVisible(false);
          return;
        }

        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .to("[data-loader-scale]",  { autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.08 })
          .to("[data-loader-reveal]", { autoAlpha: 1, y: 0, duration: 0.8, stagger: 0.05 }, "-=0.55");

        gsap.to("[data-loader-orbit]", { rotate: 360, transformOrigin: "50% 50%", duration: 9, repeat: -1, ease: "none", stagger: 0.75 });
        gsap.to("[data-loader-reverse-orbit]", { rotate: -360, transformOrigin: "50% 50%", duration: 13, repeat: -1, ease: "none" });
        gsap.to("[data-loader-pulse]", { scale: 1.08, autoAlpha: 0.72, duration: 1.8, repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.18 });
        gsap.to("[data-loader-spark]", { x: "random(-18,18)", y: "random(-14,14)", autoAlpha: "random(0.25,0.9)", duration: "random(1.8,3.2)", repeat: -1, yoyo: true, ease: "sine.inOut", stagger: 0.12 });

        const progressTl = gsap.timeline();
        progressStops.forEach((stop, i) => {
          progressTl.to(counter, {
            value: stop,
            duration: i === 0 ? 0.1 : 0.48 + i * 0.05,
            ease: "power2.out",
            onUpdate: () => {
              const v = Math.round(counter.value);
              if (percentRef.current) percentRef.current.textContent = String(v).padStart(2, "0");
            },
          });
        });

        gsap.to(barRef.current, { scaleX: 1, duration: progressTl.duration(), ease: "power2.inOut" });

        progressTl.call(() => {
          if (revealFired.current) return;
          revealFired.current = true;

          const canvas = canvasRef.current;
          if (!canvas) { setVisible(false); return; }

          // Start cloth physics after brief pause to show 100%
          // Now the DOM content follows the canvas cloth physics instead of fading away early
          setTimeout(() => {
            if (initialCoverRef.current) gsap.set(initialCoverRef.current, { autoAlpha: 0 });
            if (clothStateRef.current) {
               animateClothWhisk(canvas, clothStateRef.current, contentRef.current, () => {
                 hasLoadedOnce = true;
                 setVisible(false);
               });
            } else {
               hasLoadedOnce = true;
               setVisible(false);
            }
          }, 400);
        });
      }, root);

      return () => ctx.revert();
    },
    { scope: rootRef },
  );

  if (!visible) return null;

  return (
    /*
     * Root has NO background — so as canvas cloth clears transparent holes
     * during the physics reveal, the actual page beneath shows through.
     * The solid appearance during loading comes from the canvas cloth itself.
     */
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      className="fixed inset-0 z-9999 min-h-screen overflow-hidden"
    >
      {/*
       * LAYER ORDER (bottom → top):
       *   z-1 canvas cloth  — dark opaque fabric, provides loading background
       *   z-2 loading content — floats above the cloth
       *
       * This way the orbital animation is VISIBLE on the dark cloth background.
       * When cloth flies away, transparent canvas holes reveal the page below.
       */}

      {/* ── z-0: Initial solid cover to prevent FOUC ──────────────────── */}
      <div ref={initialCoverRef} className="absolute inset-0 z-0 bg-background" />

      {/* ── z-1: Canvas cloth ──────────────────────────────────────────── */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-1"
      />

      {/* ── z-2: Loading content ───────────────────────────────────────── */}
      <div ref={contentRef} className="absolute inset-0 z-2">

        {/* Decorative ambient rings (subtle on dark cloth) */}
        <div className="absolute left-[-20vw] top-[15vh] h-[52vw] w-[52vw] max-w-[720px] rounded-full border border-foreground/8" />
        <div className="absolute right-[-24vw] bottom-[-16vw] h-[58vw] w-[58vw] max-w-[780px] rounded-full border border-accent-primary/20" />
        <div className="absolute -left-36 -bottom-28 h-80 w-80 rounded-full border border-accent-secondary/15 sm:h-136 sm:w-136" />

        <main className="relative z-10 flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center px-5 pb-9 pt-8 sm:px-8 lg:px-12">
          <div className="relative flex w-full max-w-5xl flex-1 flex-col items-center justify-center">

            {/* Orbital animation */}
            <div data-loader-scale className="relative grid size-60 place-items-center sm:size-88 lg:size-108">
              <div data-loader-pulse className="absolute inset-[18%] rounded-full bg-accent-primary/15 blur-3xl" />
              <div data-loader-reverse-orbit className="absolute inset-[6%] rounded-full border border-dashed border-foreground/12" />
              <div data-loader-orbit className="absolute inset-[13%] rounded-full border border-accent-primary/40 border-b-transparent border-l-transparent" />
              <div data-loader-orbit className="absolute inset-[26%] rounded-full border border-accent-secondary/30 border-r-transparent border-t-transparent" />

              {/* Sparks */}
              <span data-loader-spark className="absolute left-[19%] top-[36%] size-3 rounded-full bg-accent-primary shadow-[0_0_22px] shadow-accent-primary/70 sm:size-4" />
              <span data-loader-spark className="absolute right-[22%] top-[27%] size-2 rounded-full bg-accent-secondary shadow-[0_0_18px] shadow-accent-secondary/60" />
              <span data-loader-spark className="absolute bottom-[26%] left-[29%] size-1.5 rounded-full bg-accent-lime/80" />

              {/* Logo circle — frosted glass disc floating on the dark cloth */}
              <div className="relative grid size-28 place-items-center rounded-full border border-foreground/10 bg-foreground/5 shadow-[0_0_60px_rgba(0,143,81,0.15),0_32px_90px_rgba(0,0,0,0.1)] backdrop-blur-xl sm:size-40 lg:size-48">
                <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(193,255,74,0.28),transparent_50%)]" />
                <Logo className="size-20 sm:size-30 lg:size-50" />
              </div>
            </div>

            {/* Progress section */}
            <section
              data-loader-reveal
              className="mt-12 w-full max-w-xl sm:mt-14 lg:max-w-3xl"
              aria-label="Loading progress"
            >
              {/* Label + counter */}
              <div className="mb-4 flex items-end justify-between gap-4 font-sans uppercase">
                <div className="flex flex-col gap-1">
                  <span className="text-[0.62rem] font-bold tracking-[0.4em] text-foreground/40">
                    Portfolio
                  </span>
                  <span className="text-[0.72rem] font-bold tracking-[0.32em] text-foreground/80">
                    Loading
                  </span>
                </div>
                <span className="font-display leading-none text-accent-primary">
                  <span
                    ref={percentRef}
                    className="text-4xl font-black tabular-nums tracking-tighter sm:text-6xl"
                  >
                    00
                  </span>
                  <span className="ml-1 text-lg font-normal text-accent-primary/60 sm:text-2xl">
                    %
                  </span>
                </span>
              </div>

              {/* Progress track */}
              <div className="h-px w-full bg-foreground/10" />
              <div className="mt-3 overflow-hidden rounded-full border border-foreground/10 bg-foreground/5 p-[3px]">
                <div className="relative h-2.5 overflow-hidden rounded-full bg-foreground/8 sm:h-3.5">
                  <div
                    ref={barRef}
                    data-loader-bar
                    className="absolute inset-y-0 left-0 w-full rounded-full shadow-[0_0_28px_rgba(0,143,81,0.55)]"
                    style={{
                      background: `linear-gradient(90deg,
                        rgba(${C_GREEN},1) 0%,
                        rgba(${C_LIME},0.9) 50%,
                        rgba(${C_BLUE},1) 100%)`,
                    }}
                  />
                  {/* Sheen highlight */}
                  <div className="absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 bg-white/30 blur-sm" />
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer tagline */}
        <footer className="pointer-events-none absolute inset-x-0 bottom-6 z-10 flex items-end justify-between gap-6 px-5 font-sans sm:px-8 lg:px-12">
          <div data-loader-reveal className="ml-auto flex items-center gap-4">
            <span className="grid size-9 place-items-center rounded-full border border-foreground/12 text-accent-primary sm:size-11">
              ✦
            </span>
            <span className="text-[0.62rem] font-bold uppercase tracking-[0.32em] text-foreground/45">
              Focus
              <span className="mx-2 text-accent-primary">•</span>
              Minimal
              <span className="mx-2 text-accent-primary">•</span>
              Impact
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
