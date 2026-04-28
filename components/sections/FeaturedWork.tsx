"use client";

import { useRef } from "react";
import type { StaticImageData } from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CursorSVG from "../CursorSVG";
import { AnimatedImage } from "../image";
import { RevealText, Shuffle } from "../TextAnimation";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils";
import caseCrm from "@/public/images/case-crm.png";
import caseHome from "@/public/images/case-home.png";
import caseBadges from "@/public/images/case-badges.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Case = {
  tag: string;
  title: string;
  blurb: string;
  stats: { v: string; l: string }[];
  image: StaticImageData;
  cursor: { top: string; left: string };
};

const CASES: Case[] = [
  {
    tag: "Full-Stack / Real-time",
    title: "Echo Live Messaging Platform",
    blurb:
      "A high-fidelity real-time communication platform built with the MERN stack and Socket.io, featuring instant messaging, user presence, and seamless media sharing.",
    stats: [
      { v: "0ms", l: "Latency messaging" },
      { v: "100%", l: "Real-time sync" },
    ],
    image: caseCrm,
    cursor: { top: "56%", left: "14%" },
  },
  {
    tag: "Management System",
    title: "Campus Suite Education Hub",
    blurb:
      "A comprehensive college management system streamlining administrative tasks, student records, and academic tracking for modern educational institutions.",
    stats: [
      { v: "Ease", l: "Management" },
      { v: "Secure", l: "Data Storage" },
    ],
    image: caseHome,
    cursor: { top: "55%", left: "15%" },
  },
  {
    tag: "IoT / Smart City",
    title: "Fluvo <br /> Parking Solution",
    blurb:
      "A Tap & Go smart parking system designed to simplify urban parking through real-time availability tracking and integrated payment gateways.",
    stats: [
      { v: "Fast", l: "Entry / Exit" },
      { v: "Smart", l: "Allocations" },
    ],
    image: caseBadges,
    cursor: { top: "57%", left: "14%" },
  },
];

export default function FeaturedWork() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  useGSAP(
    () => {
      const root = sectionRef.current;
      const stage = stageRef.current;

      if (!root || !stage) return;

      const slides = gsap.utils.toArray<HTMLElement>(".js-fw-slide", root);
      const mm = gsap.matchMedia();

      gsap.set(root, { autoAlpha: 1 });

      const getCursorXY = (cursor: Case["cursor"]) => {
        const bounds = stage.getBoundingClientRect();
        const top = Number.parseFloat(cursor.top) / 100;
        const left = Number.parseFloat(cursor.left) / 100;

        return {
          x: bounds.width * left,
          y: bounds.height * top,
        };
      };

      mm.add("(max-width: 767px)", () => {
        slides.forEach((slide) => {
          gsap.set(slide, {
            autoAlpha: 1,
            position: "relative",
            clearProps: "transform",
          });
        });
        gsap.set(cursorRef.current, { autoAlpha: 0, display: "none" });
      });

      mm.add("(min-width: 768px)", () => {
        slides.forEach((slide, index) => {
          gsap.set(slide, {
            autoAlpha: 1,
            yPercent: index === 0 ? 0 : 120,
            zIndex: index + 1,
            position: "absolute",
            inset: 0,
          });
        });

        const master = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        if (!reduced && cursorRef.current) {
          const initialPosition = getCursorXY(CASES[0].cursor);
          gsap.set(cursorRef.current, {
            autoAlpha: 0,
            display: "flex",
            x: initialPosition.x,
            y: initialPosition.y,
          });
          master.to(cursorRef.current, { autoAlpha: 1, duration: 0.1 });
        } else {
          gsap.set(cursorRef.current, { autoAlpha: 0, display: "none" });
        }

        CASES.forEach((item, index) => {
          const slide = slides[index];

          if (!reduced && cursorRef.current) {
            const nextPosition = getCursorXY(item.cursor);
            master.to(
              cursorRef.current,
              {
                x: nextPosition.x,
                y: nextPosition.y,
                duration: 1,
                ease: "power2.inOut",
              },
              index
            );
          }

          if (index === 0) return;

          master.fromTo(
            slide,
            { yPercent: 120 },
            {
              yPercent: 0,
              duration: 1,
              ease: "power2.inOut",
            },
            index
          );
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [reduced] }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-background py-16 md:py-0"
      id="work"
      style={{
        minHeight: reduced || !isDesktop ? "auto" : `${(CASES.length + 1) * 100}vh`,
      }}
    >
      <div
        ref={stageRef}
        className={cn(
          "relative overflow-hidden md:sticky md:top-0 md:h-[100svh]",
          reduced && "md:h-auto"
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 px-4 pt-2 sm:px-6 md:px-6 md:pt-12">
          <Shuffle
            text="FEATURED WORK"
            tag="h2"
            className="select-none font-display text-4xl leading-none sm:text-5xl md:text-7xl lg:text-8xl"
            segments={[
              { text: "FEATURED " },
              { text: "WORK", className: "text-stroke" },
            ]}
          />
        </div>

        <div className="relative inset-0 px-4 pb-2 pt-24 sm:px-6 md:absolute md:pb-6 md:pt-32 lg:pt-40">
          <div className="relative h-full">
            {CASES.map((c, i) => (
              <div
                key={c.title}
                className={cn(
                  "js-fw-slide relative mb-14 last:mb-0 md:absolute md:inset-0",
                  reduced && "md:relative md:mb-20"
                )}
                style={{ zIndex: i + 1 }}
              >
                <div className="relative flex h-full flex-col justify-center gap-8 bg-background py-4 md:py-0 lg:grid lg:grid-cols-12 lg:gap-16">
                  <div className="order-2 flex flex-col justify-center gap-6 lg:order-1 lg:col-span-5">
                    <div className="js-copy flex flex-col gap-4 md:gap-8">
                      <span className="js-tag inline-block font-mono text-[9px] uppercase tracking-[0.4em] text-accent/80">
                        {c.tag}
                      </span>

                      <div className="relative">
                        <RevealText
                          content={c.title}
                          customClass="font-display text-4xl leading-[0.85] sm:text-5xl md:max-w-[15ch] md:text-7xl lg:text-8xl"
                        />
                      </div>

                      <p className="js-blurb max-w-md text-sm leading-relaxed text-muted-foreground/80 md:text-base">
                        {c.blurb}
                      </p>

                      <div className="js-meta">
                        <div className="js-divider mb-6 h-px w-full bg-border md:mb-8" />
                        <div className="grid grid-cols-2 gap-6 md:gap-10">
                          {c.stats.map((s) => (
                            <div key={`${c.title}-${s.l}`} className="js-stat space-y-1">
                              <div className="font-display text-4xl text-foreground md:text-6xl">{s.v}</div>
                              <div className="font-mono text-[8px] uppercase leading-tight tracking-[0.3em] text-muted-foreground md:text-[9px]">
                                {s.l}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <button className="js-cta group mt-4 flex min-h-11 w-fit items-center gap-4 font-mono text-[9px] uppercase tracking-[0.3em] text-foreground transition-all duration-300 hover:gap-8">
                        VIEW CASE STUDY
                        <span className="text-accent transition-transform group-hover:translate-x-2">
                          →
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="order-1 flex items-center justify-center lg:order-2 lg:col-span-7">
                    <div className="glass-card relative aspect-[1.15] w-full overflow-hidden border-accent/10 bg-[#0a0a0a]/40 shadow-2xl shadow-accent/5 sm:aspect-[1.25] md:aspect-[1.4] lg:max-w-none">
                      <AnimatedImage
                        src={c.image}
                        alt={c.title}
                        fill
                        className="object-contain p-4 md:p-8"
                        priority={i === 0}
                        animationType="curtain"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          ref={cursorRef}
          className="pointer-events-none absolute left-0 top-0 z-50 hidden items-start gap-1 md:flex"
        >
          <CursorSVG variant="hardik" size={26} />
          <span className="mt-4 rounded-sm bg-label-violet px-2 py-0.5 font-mono text-[10px] font-bold text-label-lime shadow-xl">
            Hardik Vatukiya
          </span>
        </div>
      </div>
    </section>
  );
}
