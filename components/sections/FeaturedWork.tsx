"use client"

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import { Button } from "@/components/ui/Button";
import CursorSVG from "../CursorSVG";

import caseCrm from "@/public/images/case-crm.png";
import caseHome from "@/public/images/case-home.png";
import caseBadges from "@/public/images/case-badges.png";
import caseLoyalty from "@/public/images/case-loyalty.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Types ────────────────────────────────────────────────────────────────────

type Case = {
    tag: string;
    title: string;
    blurb: string;
    stats: { v: string; l: string }[];
    image: StaticImageData;
};

// ─── Data ────────────────────────────────────────────────────────────────────

const CASES: Case[] = [
    {
        tag: "Product Design",
        title: "Unifying Dealer Experience",
        blurb:
            "Transform how automotive dealerships manage customer relationships by creating a modern, intuitive CRM that helps salespeople focus on what matters most—selling cars and building relationships.",
        stats: [
            { v: "5x", l: "Faster customer lookup" },
            { v: "60%", l: "Reduction in context switching" },
        ],
        image: caseCrm,
    },
    {
        tag: "Enterprise UX",
        title: "Making Complexity Disappear",
        blurb:
            "Transform Access Management from an outdated portal into a modern, intuitive system that empowers administrators to efficiently manage users across Allegion's growing application portfolio.",
        stats: [
            { v: "↓", l: "Time to manage users" },
            { v: "↑", l: "Visibility into user base" },
        ],
        image: caseHome,
    },
    {
        tag: "Growth · Loyalty",
        title: "Scaling Digital Engagement",
        blurb:
            "Transform a beloved in‑store tradition into a scalable digital engagement platform — giving every participant a personal profile and a reason to keep coming back.",
        stats: [
            { v: "Double Digit", l: "Subscription growth" },
            { v: "High", l: "Registration rate" },
        ],
        image: caseBadges,
    },
    {
        tag: "Retail · Loyalty",
        title: "The Future of Loyalty",
        blurb:
            "Make loyalty felt, not buried — embedding rewards and recognition into the moments that matter most, so members feel valued every visit.",
        stats: [
            { v: "3x", l: "Reward touchpoints" },
            { v: "2", l: "Shipped loyalty programs" },
        ],
        image: caseLoyalty,
    },
];

// ─── Animation config ─────────────────────────────────────────────────────────
//
// SLIDE_DUR: timeline units per case (not seconds — scrub maps scroll → progress)
// Breakdown per slide:
//   0.0–0.3  : entrance of tag + selection frame
//   0.2–0.6  : title word-by-word stagger
//   0.5–0.9  : blurb + stats fade in
//   0.8–1.1  : mockup slides in from right
//   1.1–1.4  : CTA + cursor settle
//   1.4–2.2  : hold (readable plateau)
//   2.2–2.8  : exit stagger upward (last slide skips)
const SLIDE_DUR = 1.8;

// ─── Component ────────────────────────────────────────────────────────────────

export default function FeaturedWork() {
    const sectionRef = useRef<HTMLElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    useGSAP(
        () => {
            const root = sectionRef.current!;
            const slides = gsap.utils.toArray<HTMLElement>(".js-fw-slide");

            // ── GPU hints — set once upfront ────────────────────────────────────────
            slides.forEach((slide) => {
                slide.querySelectorAll<HTMLElement>(
                    ".js-tag, .js-sel, .js-title-word, .js-blurb, .js-stat, .js-cta, .js-mockup",
                ).forEach((el) => {
                    el.style.willChange = "opacity, transform";
                });
            });

            // ── Initial hidden states ────────────────────────────────────────────────
            slides.forEach((slide, i) => {
                // All slides hidden except first (opacity handled per-element below)
                gsap.set(slide, {
                    opacity: i === 0 ? 1 : 0,
                    position: "absolute",
                    inset: 0,
                    zIndex: i === 0 ? 10 : 0,
                    pointerEvents: i === 0 ? "auto" : "none",
                });

                // Per-element initial states — using autoAlpha for better visibility management
                gsap.set(slide.querySelectorAll(".js-tag"), { autoAlpha: 0, y: 20 });
                gsap.set(slide.querySelectorAll(".js-sel"), { autoAlpha: 0, scaleX: 0, scaleY: 0.1, transformOrigin: "left center" });
                gsap.set(slide.querySelectorAll(".js-title-word"), { autoAlpha: 0, y: 48, rotateX: -20, transformOrigin: "bottom center" });
                gsap.set(slide.querySelectorAll(".js-blurb"), { autoAlpha: 0, y: 24 });
                gsap.set(slide.querySelectorAll(".js-stat"), { autoAlpha: 0, y: 20 });
                gsap.set(slide.querySelectorAll(".js-cta"), { autoAlpha: 0, x: -16 });
                gsap.set(slide.querySelectorAll(".js-mockup"), { autoAlpha: 0, x: 80, rotateY: 8, transformOrigin: "left center" });
                gsap.set(slide.querySelectorAll(".js-divider"), { scaleX: 0, transformOrigin: "left center" });

                // If it's the first slide, ensure it's ready to be seen as soon as section is pinned
                if (i === 0) {
                    gsap.set(slide, { autoAlpha: 1 });
                }            });

            // ── Cursor initial ──────────────────────────────────────────────────────
            gsap.set(cursorRef.current, { opacity: 0 });

            // ── Master timeline ────────────────────────────────────────────────────
            const totalDur = CASES.length * SLIDE_DUR;

            const master = gsap.timeline({
                scrollTrigger: {
                    trigger: root,
                    start: "top top",
                    end: () => `+=${CASES.length * SLIDE_DUR * window.innerHeight * 0.85}`,
                    pin: true,
                    scrub: 0.6,
                    onLeave: () => gsap.to(root, { autoAlpha: 0, duration: 0.2 }),
                    onEnterBack: () => gsap.to(root, { autoAlpha: 1, duration: 0.2 }),
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    fastScrollEnd: true,
                },
            });

            // Fade in the whole section once GSAP is ready (prevents flash of static content)
            master.to(root, { autoAlpha: 1, duration: 0.1 }, 0);


            // ── Cursor ambient drift (independent of scroll) ──────────────────────
            gsap.to(cursorRef.current, {
                opacity: 1,
                duration: 0.001,
                delay: 0.1,
            });
            gsap.to(cursorRef.current, {
                x: "+=22",
                y: "-=14",
                duration: 4.2,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
            });

            // ── Per-slide animation blocks ─────────────────────────────────────────
            CASES.forEach((_, i) => {
                const base = i * SLIDE_DUR;
                const slide = slides[i];

                const tag = slide.querySelectorAll(".js-tag");
                const sel = slide.querySelectorAll(".js-sel");
                const titleWords = slide.querySelectorAll(".js-title-word");
                const blurb = slide.querySelectorAll(".js-blurb");
                const stats = slide.querySelectorAll(".js-stat");
                const divider = slide.querySelectorAll(".js-divider");
                const cta = slide.querySelectorAll(".js-cta");
                const mockup = slide.querySelectorAll(".js-mockup");

                // ── Crossfade from previous slide ──────────────────────────────────
                if (i > 0) {
                    const prev = slides[i - 1];
                    // Previous slide elements exit upward — staggered, NO blur
                    master.to(
                        prev.querySelectorAll(".js-tag, .js-title-word"),
                        { opacity: 0, y: -40, stagger: 0.04, duration: 0.35, ease: "power2.in" },
                        base - 0.65,
                    );
                    master.to(
                        prev.querySelectorAll(".js-blurb, .js-stat, .js-cta"),
                        { opacity: 0, y: -28, stagger: 0.03, duration: 0.3, ease: "power2.in" },
                        base - 0.55,
                    );
                    master.to(
                        prev.querySelectorAll(".js-mockup"),
                        { opacity: 0, x: -60, duration: 0.4, ease: "power2.in" },
                        base - 0.55,
                    );
                    // Kill previous slide layer
                    master.set(prev, { opacity: 0, zIndex: 0, pointerEvents: "none" }, base - 0.05);

                    // Activate current slide
                    master.set(slide, { opacity: 1, zIndex: 10, pointerEvents: "auto" }, base - 0.05);

                    // Move cursor scroll-position (absolute within pinned section)
                    master.to(
                        cursorRef.current,
                        {
                            top: i % 2 === 0 ? "22%" : "60%",
                            left: i % 2 === 0 ? "42%" : "38%",
                            duration: 0.8,
                            ease: "power2.inOut",
                        },
                        base - 0.3,
                    );
                } else {
                    // First slide cursor start
                    master.to(
                        cursorRef.current,
                        { top: "22%", left: "42%", duration: 0.01 },
                        0,
                    );
                }

                // ── Entrance choreography ──────────────────────────────────────────
                // 1. Tag badge rises
                master.to(tag, { autoAlpha: 1, y: 0, duration: 0.3, ease: "power3.out" }, base + 0.05);

                // 2. Selection frame expands: width first, then height
                master.to(sel, { autoAlpha: 1, scaleX: 1, duration: 0.35, ease: "expo.out" }, base + 0.1);
                master.to(sel, { scaleY: 1, duration: 0.3, ease: "back.out(1.3)" }, base + 0.38);

                // 3. Title words — 3D flip-in stagger
                master.to(titleWords, {
                    autoAlpha: 1,
                    y: 0,
                    rotateX: 0,
                    stagger: 0.05,
                    duration: 0.5,
                    ease: "expo.out",
                }, base + 0.15);

                // 4. Blurb paragraph
                master.to(blurb, { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out" }, base + 0.5);

                // 5. Stats divider expands, then stat values pop in
                master.to(divider, { autoAlpha: 1, scaleX: 1, duration: 0.3, ease: "expo.out" }, base + 0.6);
                master.to(stats, {
                    autoAlpha: 1, y: 0,
                    stagger: 0.05,
                    duration: 0.25,
                    ease: "back.out(1.5)",
                }, base + 0.65);

                // 6. CTA slides in from left
                master.to(cta, { autoAlpha: 1, x: 0, duration: 0.25, ease: "power2.out" }, base + 0.85);

                // 7. Mockup — slide in faster
                master.to(mockup, {
                    autoAlpha: 1,
                    x: 0,
                    scale: 1,
                    rotateY: 0,
                    duration: 0.6,
                    ease: "expo.out",
                }, base + 0.2);

                // ── Exit stagger ──────────────────────────────────────────
                // Higher plateau for the last project so the user can actually read it
                const exitAt = i < CASES.length - 1 ? base + (SLIDE_DUR * 0.9) : base + (SLIDE_DUR * 1.05);
                
                master.to(
                    slide.querySelectorAll(".js-tag, .js-title-word, .js-blurb, .js-stat, .js-cta, .js-divider"),
                    { autoAlpha: 0, y: -20, stagger: 0.01, duration: 0.3, ease: "power2.in" },
                    exitAt
                );
                
                // For the very last case, also hide the selection markers and cursor at the end
                if (i === CASES.length - 1) {
                    master.to(sel, { autoAlpha: 0, duration: 0.3 }, exitAt);
                    master.to(cursorRef.current, { autoAlpha: 0, duration: 0.3 }, exitAt);
                }

                master.to(mockup, { autoAlpha: 0, x: -30, duration: 0.35, ease: "power2.in" }, exitAt + 0.05);
                master.to(slide, { autoAlpha: 0, duration: 0.1, overwrite: "auto" }, exitAt + 0.4);
            });
        },
        { scope: sectionRef },
    );

    // ─── Render ───────────────────────────────────────────────────────────────
    // Title words are split at the space level for per-word entrance stagger.
    // The split happens in JSX — no JS runtime needed, no layout shift.

    return (
        <section
            ref={sectionRef}
            className="relative h-screen w-full overflow-hidden bg-background opacity-0"
            id="work"
        >
            {/* Grid overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)",
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Section header — always visible, above pin */}
            <div className="absolute top-0 left-0 right-0 z-30 px-6 pt-8 pointer-events-none">
                <h2 className="font-display text-5xl md:text-8xl leading-none select-none">
                    FEATURED <span className="text-outline">WORK</span>
                </h2>
            </div>

            {/* Slide container */}
            <div className="absolute inset-0 pt-32 px-6 pb-6">
                <div className="relative h-full">
                    {CASES.map((c, i) => (
                        <div
                            key={i}
                            className="js-fw-slide absolute inset-0 grid grid-cols-1 md:grid-cols-12 gap-10 items-center"
                        >
                            {/* ── Left: Content ── */}
                            <div className="col-span-1 md:col-span-5 flex flex-col justify-center gap-8">

                                {/* Tag */}
                                <span className="js-tag inline-block text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-mono">
                                    {c.tag}
                                </span>

                                {/* Title with Figma selection frame */}
                                <div className="relative">
                                    {/* Selection frame — animates independently */}
                                    <div className="js-sel absolute -inset-x-6 -inset-y-4 border border-white/10 rounded-xl pointer-events-none">
                                        <div className="absolute -top-[3px] -left-[3px] w-[6px] h-[6px] bg-white border border-black" />
                                        <div className="absolute -top-[3px] -right-[3px] w-[6px] h-[6px] bg-white border border-black" />
                                        <div className="absolute -bottom-[3px] -left-[3px] w-[6px] h-[6px] bg-white border border-black" />
                                        <div className="absolute -bottom-[3px] -right-[3px] w-[6px] h-[6px] bg-white border border-black" />
                                    </div>

                                    {/* Title: each word is a separate span for per-word stagger */}
                                    <h3 className="font-display text-4xl md:text-6xl max-w-[12ch] leading-[0.95]">
                                        {c.title.split(" ").map((word, wi) => (
                                            <span
                                                key={wi}
                                                className="js-title-word inline-block mr-[0.22em] last:mr-0"
                                                style={{ display: "inline-block" }}
                                            >
                                                {word}
                                            </span>
                                        ))}
                                    </h3>
                                </div>

                                {/* Blurb */}
                                <p className="js-blurb text-muted-foreground text-sm md:text-base leading-relaxed max-w-sm">
                                    {c.blurb}
                                </p>

                                {/* Stats */}
                                <div>
                                    <div className="js-divider h-px w-full bg-white/5 mb-8" />
                                    <div className="grid grid-cols-2 gap-10">
                                        {c.stats.map((s, si) => (
                                            <div key={si} className="js-stat space-y-1.5">
                                                <div className="font-display text-4xl md:text-5xl">{s.v}</div>
                                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-mono leading-tight">
                                                    {s.l}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA */}
                                <button className="js-cta flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] font-mono hover:gap-6 transition-all duration-300 text-white w-fit">
                                    VIEW CASE STUDY <span className="text-base opacity-60">→</span>
                                </button>
                            </div>

                            {/* ── Right: Mockup ── */}
                            <div className="col-span-1 md:col-span-7 flex justify-center" style={{ perspective: "1200px" }}>
                                <div className="js-mockup relative w-full aspect-[1.4] rounded-xl overflow-hidden bg-[#111] border border-white/10 shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]">
                                    <Image
                                        src={c.image}
                                        alt={c.title}
                                        fill
                                        className="object-cover"
                                        priority={i === 0}
                                    />
                                    {/* Subtle corner accent */}
                                    <div className="absolute top-3 left-3 w-5 h-5 border-t border-l border-white/20 rounded-tl-sm" />
                                    <div className="absolute bottom-3 right-3 w-5 h-5 border-b border-r border-white/10 rounded-br-sm" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── Collaborative cursor — positioned absolute within pinned section ── */}
            {/* NOT fixed: fixed breaks inside GSAP-pinned containers */}
            <div
                ref={cursorRef}
                className="absolute pointer-events-none z-50 flex items-start gap-1"
                style={{ top: "22%", left: "42%" }}
            >
                <CursorSVG variant="violet" size={26} />
                <span className="mt-4 rounded-sm bg-label-violet px-2 py-0.5 font-mono text-[10px] font-bold text-white shadow-xl">
                    Hardik Vatukiya
                </span>
            </div>
        </section>
    );
}