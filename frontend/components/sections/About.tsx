"use client";

import { useRef } from "react";
import { Globe2, Sparkles } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import dynamic from "next/dynamic";

const GlobePolaroids = dynamic(
  () => import("@/components/ui/cobe-globe-polaroids").then((mod) => mod.GlobePolaroids),
  { ssr: false, loading: () => <div className="h-full w-full rounded-full bg-background/5 animate-pulse" /> }
);

export interface AboutData {
  tagline: string;
  name: string;
  bio: string;
  philosophy: string;
  experience: {
    title: string;
    role: string;
    mark: string;
  }[];
}

const defaultBio = "A dedicated MERN Stack Developer with a passion for building full-stack applications that are fast, accessible, and designed to solve real-world problems.";
const defaultExperience = [
  { mark: "TR", title: "Trionn®", role: "2024–Present" },
];

function SplitLine({ text }: { text: string }) {
  return (
    <span className="block overflow-hidden">
      {text.split(" ").map((word, index) => {
        return (
          <span
            key={`${word}-${index}`}
            className={`about-word inline-block pr-[0.26em]`}
          >
            {word}
          </span>
        );
      })}
    </span>
  );
}

function AccentRule({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative block h-px w-24 overflow-visible bg-background ${className}`}
    >
      <span className="absolute right-3 top-1/2 h-[3px] w-7 -translate-y-1/2 rounded-full bg-accent-primary blur-[3px]" />
    </span>
  );
}

function SectionRule({ label, delay = 0 }: { label: string; delay?: number }) {
  return (
    <div
      className="about-reveal mt-7 mb-4 flex items-center gap-4"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <p className="font-sans text-[0.62rem] font-black uppercase tracking-[0.44em] text-background">
        {label}
      </p>
      <span className="about-rule relative h-px flex-1 overflow-visible bg-background/10">
        <span className="absolute right-0 top-1/2 h-[3px] w-12 -translate-y-1/2 rounded-full bg-background blur-xs" />
      </span>
    </div>
  );
}

export default function AboutSection({ initialData }: { initialData?: AboutData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const bio = initialData?.bio || defaultBio;
  const exp = initialData?.experience || defaultExperience;
  const name = initialData?.name || "Hardik Vatukiya";
  const tagline = initialData?.tagline || "Hey, I'm";

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        // Title slide up with clip path
        gsap.fromTo(
          ".about-title span",
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.5,
            ease: "expo.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 75%",
            },
          }
        );

        // Bio words - High-end scroll reveal
        gsap.fromTo(
          ".about-word",
          {
            opacity: 0,
            y: 12,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.02,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".about-copy",
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // Name & Tagline reveal
        gsap.fromTo(
          ".about-reveal",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.12,
            scrollTrigger: {
              trigger: ".about-details",
              start: "top 85%",
            },
          }
        );

        // Experience cards stagger
        gsap.fromTo(
          ".experience-card",
          {
            x: -20,
            opacity: 0,
            scale: 0.98
          },
          {
            x: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power4.out",
            stagger: 0.15,
            scrollTrigger: {
              trigger: ".experience-grid",
              start: "top 85%",
            },
          }
        );

        // Rule scale
        gsap.fromTo(
          ".about-rule",
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "expo.out",
            stagger: 0.2,
            scrollTrigger: {
              trigger: ".about-details",
              start: "top 85%",
            },
          }
        );

        // Floating animation for globe badge
        gsap.to(".about-globe", {
          y: -8,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut"
        });

        // Parallax — scoped to the About section's pin window.
        // Since About is pinned (top top → bottom+=100% top), we use
        // start:"top top" so the parallax is active while About is in view.
        gsap.to(".about-left", {
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom+=80% top",
            scrub: 1.4,
          },
        });

        gsap.to(".about-right", {
          yPercent: 2,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom+=80% top",
            scrub: 1.4,
          },
        });
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-foreground text-background lg:min-h-screen"
    >
      {/* Ambient radial layers */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_22%_56%,color-mix(in_srgb,var(--accent-primary)_14%,transparent),transparent_26%),radial-gradient(circle_at_80%_8%,rgba(255,255,255,0.045),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgba(255,255,255,0.025),transparent_35%,rgba(255,255,255,0.012))]" />

      <div className="relative z-10 grid w-full lg:min-h-screen lg:grid-cols-[0.54fr_1fr]">

        {/* ── LEFT PANEL ── */}
        <div className="about-left relative flex min-h-[620px] flex-col justify-between overflow-hidden border-background/10 px-6 pt-16 pb-10 sm:min-h-[700px] sm:px-10 lg:min-h-screen lg:border-r lg:px-[4.5vw] lg:pt-[11vh] lg:pb-[8vh] xl:px-[5.5vw] xl:pt-[12vh]">

          {/* Title */}
          <div className="relative z-20">
            <h2 className="about-title overflow-visible whitespace-nowrap font-display text-[5.2rem] leading-[0.82] tracking-tighter text-background sm:text-[8rem] lg:text-[4.6rem] xl:text-[7.4rem] 2xl:text-[9.5rem]">
              <span className="block bg-clip-text text-background">
                About
              </span>
            </h2>
          </div>

          {/* Globe graphic */}
          <div className="about-reveal absolute left-1/2 top-[53%] h-[260px] w-[260px] -translate-x-1/2 -translate-y-1/2 sm:h-[380px] sm:w-[380px] lg:top-[55%] lg:h-[320px] lg:w-[320px] xl:h-[420px] xl:w-[420px]">
            <div className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-primary)_22%,transparent),transparent_64%)] blur-3xl" />
            <GlobePolaroids className="h-full w-full" />
          </div>

          {/* Globe badge */}
          <div className="about-reveal about-globe relative z-10 flex items-center gap-4 sm:ml-5 lg:ml-0 xl:ml-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-background/65 text-background shadow-[0_0_20px_color-mix(in_srgb,var(--background)_18%,transparent)]">
              <Globe2 className="h-6 w-6" />
            </div>
            <p className="font-display text-[0.95rem] leading-snug text-background/75 sm:text-base lg:text-[0.92rem] xl:text-base">
              Available globally for freelance or full-time opportunities.
            </p>
          </div>
        </div>

        {/* ── RIGHT PANEL ── */}
        {/* Right panel grows with its content (no clipping) — section height
            controlled by the outer lg:min-h-screen wrapper. */}
        <div className="about-right about-details no-scrollbar relative px-6 pt-10 pb-14 sm:px-10 sm:pt-14 lg:px-[5vw] lg:pt-[6vh] lg:pb-[5vh] xl:px-[4.8vw]">
          <div className="mx-auto w-full max-w-[900px]">

            {/* Name */}
            <div className="about-reveal">
              <span className="font-hero text-2xl italic text-background sm:text-3xl">
                {tagline}
              </span>
              <h3 className="mt-2 font-display text-5xl font-bold tracking-tight text-background sm:text-6xl xl:text-7xl">
                {name}
              </h3>
              <AccentRule className="mt-6 opacity-40" />
            </div>

            {/* Bio with vertical accent */}
            <div className="relative mt-10 max-w-[800px] pl-8">
              <div className="absolute left-0 top-0 h-full w-[2px] bg-linear-to-b from-background/20 via-background/10 to-transparent">
                <div className="absolute top-1/4 left-[-2px] h-8 w-1.5 bg-background/30 blur-[2px]" />
              </div>
              <div className="about-copy font-body text-[1.5rem] leading-[1.3] text-background sm:text-[1.8rem] xl:text-[2rem]">
                <SplitLine key={bio} text={bio} />
              </div>
            </div>

            {/* Tagline with sparkle */}
            <div className="about-reveal mt-10 flex items-center gap-4">
              <Sparkles className="h-5 w-5 shrink-0 text-background/40" />
              <p className="font-body text-lg text-background/70 sm:text-xl">
                Where <span className="italic text-background">performance</span> meets <span className="italic text-background">design</span>, and <span className="italic text-background">engineering</span> creates impact.
              </p>
            </div>

            {/* Experience */}
            <SectionRule label="Experience" />

            <div className="experience-grid grid gap-4 lg:grid-cols-2">
              {exp.map((item, i) => (
                <div
                  key={i}
                  className="experience-card group relative flex items-center gap-5 rounded-xl border border-background/10 bg-background/3 p-5 transition-all duration-500 hover:border-background/30 hover:bg-background/6 sm:p-6"
                >
                  <div className="absolute right-4 top-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <Sparkles className="h-4 w-4 text-accent-primary" />
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-background/10 bg-background/5 font-display text-xl font-bold text-background sm:h-14 sm:w-14">
                    {item.mark === "spark" ? (
                      <Sparkles className="h-7 w-7 text-background/60" />
                    ) : (
                      item.mark
                    )}
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-medium text-background sm:text-2xl">
                      {item.title}
                    </h3>
                    <p className="mt-1 font-body text-sm text-background/80 sm:text-base">
                      {item.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}