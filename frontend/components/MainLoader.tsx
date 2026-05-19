"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import Logo from "./ui/Logo";

const progressStops = [0, 18, 37, 56, 74, 92, 100];

export default function MainLoader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || !barRef.current) return;

      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const counter = { value: 0 };
      const ctx = gsap.context(() => {
        gsap.set("[data-loader-reveal]", { autoAlpha: 0, y: 18 });
        gsap.set("[data-loader-scale]", { autoAlpha: 0, scale: 0.92 });
        gsap.set("[data-loader-line]", { scaleX: 0, transformOrigin: "left center" });
        gsap.set(barRef.current, { scaleX: 0.04, transformOrigin: "left center" });

        if (reduceMotion) {
          gsap.set("[data-loader-reveal], [data-loader-scale]", { autoAlpha: 1, y: 0, scale: 1 });
          gsap.set("[data-loader-line], [data-loader-bar]", { scaleX: 1 });
          setProgress(100);
          return;
        }

        const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

        intro
          .to("[data-loader-scale]", {
            autoAlpha: 1,
            scale: 1,
            duration: 1,
            stagger: 0.08,
          })
          .to(
            "[data-loader-reveal]",
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.9,
              stagger: 0.06,
            },
            "-=0.62",
          )
          .to(
            "[data-loader-line]",
            {
              scaleX: 1,
              duration: 1,
              stagger: 0.08,
            },
            "-=0.48",
          );

        gsap.to("[data-loader-orbit]", {
          rotate: 360,
          transformOrigin: "50% 50%",
          duration: 9,
          repeat: -1,
          ease: "none",
          stagger: 0.75,
        });

        gsap.to("[data-loader-reverse-orbit]", {
          rotate: -360,
          transformOrigin: "50% 50%",
          duration: 13,
          repeat: -1,
          ease: "none",
        });

        gsap.to("[data-loader-pulse]", {
          scale: 1.08,
          autoAlpha: 0.72,
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.18,
        });

        gsap.to("[data-loader-spark]", {
          x: "random(-18, 18)",
          y: "random(-14, 14)",
          autoAlpha: "random(0.25, 0.9)",
          duration: "random(1.8, 3.2)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          stagger: 0.12,
        });

        const progressTl = gsap.timeline({ repeat: -1, repeatDelay: 0.25 });
        progressStops.forEach((stop, index) => {
          progressTl.to(counter, {
            value: stop,
            duration: index === 0 ? 0.1 : 0.48 + index * 0.05,
            ease: "power2.out",
            onUpdate: () => {
              const rounded = Math.round(counter.value);
              setProgress(rounded);
              if (percentRef.current) percentRef.current.textContent = String(rounded).padStart(2, "0");
            },
          });
        });

        gsap.to(barRef.current, {
          scaleX: 1,
          duration: progressTl.duration(),
          ease: "power2.inOut",
          repeat: -1,
          repeatDelay: 0.25,
        });
      }, root);

      return () => ctx.revert();
    },
    { scope: rootRef },
  );

  return (
    <div
      ref={rootRef}
      role="status"
      aria-live="polite"
      aria-label={`Loading portfolio ${progress}%`}
      className="fixed inset-0 z-9999 min-h-screen overflow-hidden bg-background text-foreground selection:bg-accent-primary selection:text-background"
      style={{ backgroundImage: "url(./hero_bg.svg)", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}

    >
      <div className="absolute left-[-20vw] top-[15vh] h-[52vw] w-[52vw] max-w-[720px] rounded-full border border-foreground/10" />
      <div className="absolute right-[-24vw] bottom-[-16vw] h-[58vw] w-[58vw] max-w-[780px] rounded-full border border-accent-primary/20" />
      <div className="absolute -left-36 -bottom-28 h-80 w-80 rounded-full border border-accent-secondary/15 sm:h-136 sm:w-136" />
      <main className="relative z-10 flex min-h-[calc(100vh-7rem)] flex-col items-center justify-center px-5 pb-9 pt-8 sm:px-8 lg:px-12">
        <div className="relative flex w-full max-w-5xl flex-1 flex-col items-center justify-center">
          <div data-loader-scale className="relative grid size-60 place-items-center sm:size-88 lg:size-108">
            <div data-loader-pulse className="absolute inset-[18%] rounded-full bg-accent-primary/10 blur-3xl" />
            <div data-loader-reverse-orbit className="absolute inset-[6%] rounded-full border border-dashed border-foreground/15" />
            <div data-loader-orbit className="absolute inset-[13%] rounded-full border border-accent-primary/35 border-b-transparent border-l-transparent" />
            <div data-loader-orbit className="absolute inset-[26%] rounded-full border border-accent-secondary/25 border-r-transparent border-t-transparent" />

            <span data-loader-spark className="absolute left-[19%] top-[36%] size-3 rounded-full bg-accent-primary shadow-[0_0_22px] shadow-accent-primary/60 sm:size-4" />
            <span data-loader-spark className="absolute right-[22%] top-[27%] size-2 rounded-full bg-accent-secondary shadow-[0_0_18px] shadow-accent-secondary/50" />
            <span data-loader-spark className="absolute bottom-[26%] left-[29%] size-1.5 rounded-full bg-foreground/60" />

            <div className="relative grid size-28 place-items-center rounded-full border border-foreground/10 bg-background/70 shadow-[0_32px_90px_rgba(0,0,0,0.09)] backdrop-blur-xl sm:size-40 lg:size-48">
              <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_50%_35%,rgba(193,255,74,0.24),transparent_42%)]" />
              <Logo className="size-20 sm:size-30 lg:size-50" />
            </div>
          </div>

          <section data-loader-reveal className="mt-12 w-full max-w-xl sm:mt-14 lg:max-w-3xl" aria-label="Loading progress">
            <div className="mb-3 flex items-end justify-between gap-4 font-sans uppercase">
              <span className="text-[0.68rem] font-bold tracking-[0.36em] text-foreground sm:text-xs">Loading Portfolio</span>
              <span className="font-display text-3xl leading-none text-accent-primary sm:text-5xl">
                <span ref={percentRef}>00</span><span className="ml-1 text-base sm:text-2xl">%</span>
              </span>
            </div>
            <div className="h-px w-full bg-foreground/15" />
            <div className="mt-3 rounded-full border border-foreground/15 bg-card-bg/80 p-1 shadow-[inset_0_1px_10px_rgba(0,0,0,0.08),0_18px_55px_rgba(0,0,0,0.08)]">
              <div className="relative h-3 overflow-hidden rounded-full bg-bg-tertiary sm:h-4">
                <div
                  ref={barRef}
                  data-loader-bar
                  className="absolute inset-y-0 left-0 w-full rounded-full bg-linear-to-r from-accent-primary via-foreground to-accent-secondary shadow-[0_0_24px_rgba(0,143,81,0.36)]"
                />
                <div className="absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 bg-white/45 blur-md" />
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-end justify-between gap-6 px-5 font-sans uppercase sm:px-8 lg:px-12">
        <div data-loader-reveal className="ml-auto flex items-center gap-4 text-[0.62rem] font-bold tracking-[0.32em] text-text-muted">
          <span className="grid size-9 place-items-center rounded-full border border-foreground/20 text-accent-primary sm:size-11">✦</span>
          <span>Focus <span className="mx-2 text-accent-primary">•</span> Minimal <span className="mx-2 text-accent-primary">•</span> Impact</span>
        </div>
      </footer>
    </div>
  );
}
