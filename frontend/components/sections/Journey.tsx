"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { GraduationCap, Briefcase, Rocket, Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import { SectionHeader } from "../ui/SectionHeader";

export interface JourneyStage {
    _id: string;
    date: string;
    title: string;
    subtitle: string;
    description: string;
    icon: string;
}

// Icon mapping for stages
const ICON_MAP: Record<string, React.ReactNode> = {
    Sparkles: <Sparkles className="h-8 w-8" />,
    GraduationCap: <GraduationCap className="h-8 w-8" />,
    Briefcase: <Briefcase className="h-8 w-8" />,
    Rocket: <Rocket className="h-8 w-8" />,
};

// ─── Card Component ───────────────────────────────────────────────────────────

const WaypointCard = ({
    stage,
    index,
    isActive,
    isCurrent,
}: {
    stage: JourneyStage;
    index: number;
    isActive: boolean;
    isCurrent: boolean;
}) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const isEven = index % 2 === 0;

    useGSAP(
        () => {
            const card = cardRef.current;
            if (!card) return;

            const badge = card.querySelector(".js-badge");
            const heading = card.querySelector(".js-heading");
            const sub = card.querySelector(".js-sub");
            const body = card.querySelector(".js-body");
            const cta = card.querySelector(".js-cta");
            const iconEl = card.querySelector(".js-icon");

            gsap.set([badge, heading, sub, body, cta].filter(Boolean), {
                autoAlpha: 0,
                y: 20,
            });
            gsap.set(iconEl, { autoAlpha: 0, scale: 0.5, rotate: -15 });

            const isMobile = window.innerWidth < 768;
            gsap.set(card, {
                autoAlpha: 0,
                x: isMobile ? 0 : (isEven ? -50 : 50),
                y: isMobile ? 30 : 0,
                scale: 0.98
            });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: card,
                    start: "top 90%",
                    end: "top 90%",
                    toggleActions: "play none none reverse",
                },
            });

            tl.to(
                card,
                {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: 0.8,
                    ease: "power3.out",
                }
            )
                .to(
                    [badge, heading, sub, body, cta].filter(Boolean),
                    {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out",
                        stagger: 0.08,
                    },
                    "-=0.6"
                )
                .to(
                    iconEl,
                    {
                        autoAlpha: 0.2,
                        scale: 1,
                        rotate: 0,
                        duration: 0.8,
                        ease: "elastic.out(1, 0.7)",
                    },
                    "-=0.6"
                );

            if (window.matchMedia("(hover: hover)").matches) {
                const handleEnter = () => {
                    gsap.to(card, { y: -8, scale: 1.01, duration: 0.4, ease: "power2.out", overwrite: "auto" });
                    if (iconEl) gsap.to(iconEl, { autoAlpha: 0.4, scale: 1.1, rotate: 5, duration: 0.4, overwrite: "auto" });
                };
                const handleLeave = () => {
                    gsap.to(card, { y: 0, scale: 1, duration: 0.4, ease: "power2.out", overwrite: "auto" });
                    if (iconEl) gsap.to(iconEl, { autoAlpha: 0.2, scale: 1, rotate: 0, duration: 0.4, overwrite: "auto" });
                };

                card.addEventListener("mouseenter", handleEnter);
                card.addEventListener("mouseleave", handleLeave);

                return () => {
                    card.removeEventListener("mouseenter", handleEnter);
                    card.removeEventListener("mouseleave", handleLeave);
                };
            }
        },
        { scope: cardRef }
    );

    return (
        <div
            className={cn(
                "js-card-container relative flex flex-col md:flex-row gap-8 md:gap-16 mb-16 md:mb-40 last:mb-0 items-center",
                isEven ? "md:flex-row" : "md:flex-row-reverse"
            )}
        >
            <div
                ref={cardRef}
                className={cn(
                    "js-card-content bg-[color-mix(in_srgb,var(--background),transparent_60%)] backdrop-blur-[20px] border-[color-mix(in_srgb,var(--foreground),transparent_90%)] shadow-[inset_0_0_20px_0_color-mix(in_srgb,var(--background),transparent_90%)] md:backdrop-blur-3xl flex-1 w-full p-6 md:p-10 rounded-4xl md:rounded-[2.5rem] border transition-all duration-200 relative overflow-hidden cursor-default",
                    isActive
                        ? isCurrent
                            ? "ring-1 ring-primary/30 shadow-xl grayscale-0"
                            : "ring-1 ring-border grayscale-0"
                        : "ring-1 ring-border/50 grayscale-[0.5]"
                )}
            >
                <div className={cn(
                    "js-icon absolute top-0 right-0 p-6 md:p-8 text-accent-primary pointer-events-none transition-all duration-100",
                    isCurrent ? "opacity-40 scale-110" : "opacity-20 scale-100"
                )}>
                    {ICON_MAP[stage.icon] || <Sparkles className="h-8 w-8" />}
                </div>

                <div className="space-y-4 md:space-y-6 relative z-10">
                    <div className={cn(
                        "js-badge inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-1.5 rounded-full transition-colors duration-100 font-mono text-[9px] md:text-[10px] tracking-widest uppercase",
                        isCurrent ? "bg-accent-primary/20 border border-accent-primary/40 text-accent-primary" : "bg-bg-secondary border border-border text-text-muted"
                    )}>
                        <Sparkles className="h-3 w-3" /> {stage.date}
                    </div>

                    <div className="space-y-2">
                        <h3 className={cn(
                            "js-heading text-xl md:text-3xl font-display font-bold uppercase tracking-tight transition-colors duration-100",
                            isCurrent ? "text-foreground" : "text-text-muted"
                        )}>
                            {stage.title}
                        </h3>
                        <p className="js-sub text-[10px] md:text-sm font-mono text-text-muted uppercase tracking-[0.2em] flex items-center gap-2">
                            <span className={cn("h-px w-4 transition-all duration-300", isCurrent ? "bg-accent-primary w-8" : "bg-accent-primary/30")} /> {stage.subtitle}
                        </p>
                    </div>

                    <p className={cn(
                        "js-body leading-relaxed text-sm md:text-base transition-colors duration-200 max-w-xl",
                        isCurrent ? "text-foreground/80" : "text-text-muted/70"
                    )}>
                        {stage.description}
                    </p>

                    <div className="js-cta pt-2 md:pt-4 flex items-center gap-3 text-[9px] md:text-[10px] font-mono uppercase tracking-[0.3em] text-accent-primary group cursor-pointer hover:text-accent-secondary transition-colors">
                        View Details
                        <span className="w-6 md:w-8 h-px bg-accent-primary/30 group-hover:w-12 group-hover:bg-accent-secondary transition-all duration-200" />
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                <div className={cn(
                    "absolute -bottom-12 -left-12 w-32 h-32 rounded-full blur-xl md:blur-3xl pointer-events-none transition-all duration-300",
                    isCurrent ? "bg-accent-primary/20 opacity-100 scale-150" : isActive ? "bg-accent-primary/10 opacity-50" : "bg-accent-primary/5 opacity-0"
                )} />
            </div>

            <div className="hidden md:block w-32 shrink-0" />
            <div className="hidden md:block flex-1" />
        </div>
    );
};

// ─── Journey Section ──────────────────────────────────────────────────────────

export default function Journey({ initialData }: { initialData?: JourneyStage[] }) {
    const sectionRef = useRef<HTMLElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRefs = useRef<(SVGPathElement | null)[]>([]);
    const headRef = useRef<SVGGElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const [activeStages, setActiveStages] = React.useState<Set<number>>(new Set([0]));
    const [currentStage, setCurrentStage] = React.useState(0);

    const stages = initialData || [];

    useGSAP(
        () => {
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top top",
                end: "bottom bottom",
                pin: bgRef.current,
                pinSpacing: false,
                invalidateOnRefresh: true,
            });

            const mm = gsap.matchMedia();

            mm.add({
                isDesktop: "(min-width: 768px)",
                isMobile: "(max-width: 767px)",
            }, (context) => {
                const { isDesktop } = context.conditions as { isDesktop: boolean; isMobile: boolean };

                const eyebrow = headerRef.current?.querySelector(".js-eyebrow");
                const headlines = headerRef.current?.querySelectorAll(".js-headline");
                const headlineArr = headlines ? Array.from(headlines) : [];

                gsap.set([eyebrow, ...headlineArr].filter(Boolean), { autoAlpha: 0, y: 30 });

                const headerTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: headerRef.current,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                });

                if (eyebrow) {
                    headerTl.to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power3.out" });
                }

                if (headlineArr.length > 0) {
                    headerTl.to(
                        headlineArr,
                        {
                            autoAlpha: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power3.out",
                            stagger: 0.1,
                        },
                        "-=0.6"
                    );
                }

                const pathData = new Map<number, { length: number; path: SVGPathElement }>();

                const updatePaths = () => {
                    const container = containerRef.current;
                    const svg = svgRef.current;
                    if (!container || !svg) return;

                    const containerRect = container.getBoundingClientRect();
                    const cardElements = container.querySelectorAll(".js-card-content");
                    if (cardElements.length === 0) return;

                    const cardRects = Array.from(cardElements).map(card => card.getBoundingClientRect());

                    pathRefs.current.forEach((pathEl, i) => {
                        if (!pathEl || i >= cardRects.length - 1) return;

                        const fr = cardRects[i];
                        const tr = cardRects[i + 1];

                        let d = "";

                        if (isDesktop) {
                            const isEven = i % 2 === 0;
                            const x1 = (isEven ? fr.right : fr.left) - containerRect.left;
                            const y1 = fr.top + fr.height / 2 - containerRect.top;
                            const x2 = (tr.left + tr.width / 2 - containerRect.left) + 0.1;
                            const y2 = tr.top - containerRect.top;

                            const curveOffset = 250;
                            const topOffset = 200;

                            const cp1x = x1 + (isEven ? curveOffset : -curveOffset);
                            const cp1y = y1;
                            const cp2x = x2;
                            const cp2y = y2 - topOffset;

                            d = `M ${x1} ${y1} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${x2} ${y2}`;
                        } else {
                            const x1 = fr.left + fr.width / 2 - containerRect.left;
                            const y1 = fr.bottom - containerRect.top;
                            const x2 = (tr.left + tr.width / 2 - containerRect.left) + 0.1;
                            const y2 = tr.top - containerRect.top;

                            const midY = (y1 + y2) / 2;
                            d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;
                        }

                        pathEl.setAttribute("d", d);
                        const length = pathEl.getTotalLength();
                        pathData.set(i, { length, path: pathEl });

                        pathEl.style.strokeDasharray = String(length);
                        pathEl.style.strokeDashoffset = String(length);
                    });

                    ScrollTrigger.refresh();
                };

                let resizeTimer: number;
                const throttledUpdate = () => {
                    cancelAnimationFrame(resizeTimer);
                    resizeTimer = requestAnimationFrame(updatePaths);
                };

                updatePaths();
                window.addEventListener("resize", throttledUpdate);

                const lastActiveRef = { current: "" };

                const mainTimeline = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 20%",
                        end: "bottom 80%",
                        scrub: 1.5,
                        invalidateOnRefresh: true,
                        onUpdate: (self) => {
                            const gp = self.progress;
                            const currentActive = [0];
                            const totalConnectors = stages.length - 1;

                            pathRefs.current.forEach((_, i) => {
                                const segStart = i / totalConnectors;
                                const segPct = Math.max(0, Math.min(1, (gp - segStart) * totalConnectors));
                                if (segPct > 0.1) currentActive.push(i + 1);
                            });

                            const activeKey = currentActive.join(",");
                            if (activeKey !== lastActiveRef.current) {
                                setActiveStages(new Set(currentActive));
                                lastActiveRef.current = activeKey;
                            }
                        }
                    },
                });

                pathRefs.current.forEach((pathEl, i) => {
                    if (!pathEl) return;
                    const data = pathData.get(i);
                    if (!data) return;

                    const totalConnectors = stages.length - 1;
                    const startTime = i / totalConnectors;

                    mainTimeline.to(pathEl, {
                        strokeDashoffset: 0,
                        duration: 1 / totalConnectors,
                        ease: "none",
                        onUpdate: function () {
                            if (!headRef.current) return;
                            const progress = this.progress();
                            if (progress > 0 && progress < 1) {
                                try {
                                    const point = pathEl.getPointAtLength(data.length * progress);
                                    gsap.set(headRef.current, {
                                        x: point.x,
                                        y: point.y,
                                        autoAlpha: 1,
                                        overwrite: "auto"
                                    });
                                } catch { }
                            } else if (progress <= 0 || progress >= 1) {
                                gsap.set(headRef.current, { autoAlpha: 0 });
                            }
                        }
                    }, startTime);
                });

                const cards = containerRef.current?.querySelectorAll(".js-card-content");
                cards?.forEach((card, i) => {
                    ScrollTrigger.create({
                        trigger: card,
                        start: "top center",
                        end: "bottom center",
                        onToggle: (self) => {
                            if (self.isActive) setCurrentStage(i);
                        },
                    });
                });

                const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                const shape1Wrap = sectionRef.current?.querySelector(".js-bg-shape-1-wrap") as HTMLElement | null;
                const shape2Wrap = sectionRef.current?.querySelector(".js-bg-shape-2-wrap") as HTMLElement | null;
                const shape1El = sectionRef.current?.querySelector(".js-bg-shape-1") as HTMLElement | null;
                const shape2El = sectionRef.current?.querySelector(".js-bg-shape-2") as HTMLElement | null;

                if (!shape1El || !shape2El || !shape1Wrap || !shape2Wrap) return () => { window.removeEventListener("resize", throttledUpdate); cancelAnimationFrame(resizeTimer); };

                gsap.set([shape1Wrap, shape2Wrap], { autoAlpha: 0, scale: 0.7 });

                const entranceTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top 75%",
                        toggleActions: "play none none reverse",
                    },
                    defaults: { ease: "power3.out" },
                });

                entranceTl
                    .to(shape1Wrap, { autoAlpha: 0.09, scale: 1.1, duration: 2.4 })
                    .to(shape2Wrap, { autoAlpha: 0.13, scale: 1, duration: 2 }, "-=2");

                const w = window.innerWidth;
                const h = window.innerHeight;

                const scrollTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: 2,
                    },
                });

                scrollTl
                    .fromTo(shape1Wrap,
                        { x: w * -0.05, y: h * -0.08, rotate: -15, skewX: 0, skewY: 0 },
                        { x: w * 0.72, y: h * 0.85, rotate: 310, skewX: 4, skewY: -3, ease: "none" },
                        0
                    )
                    .fromTo(shape2Wrap,
                        { x: w * 0.12, y: h * 0.12, rotate: 20 },
                        { x: w * -0.62, y: h * -0.78, rotate: -660, scale: 1.5, ease: "none" },
                        0
                    );

                if (reduceMotion) {
                    return () => {
                        window.removeEventListener("resize", throttledUpdate);
                        cancelAnimationFrame(resizeTimer);
                    };
                }

                const orbit1 = { t: 0, ox: 0, oy: 0 };
                const orbit2 = { t: Math.PI / 2, ox: 0, oy: 0 };

                const r1x = isDesktop ? 38 : 18;
                const r1y = isDesktop ? 22 : 12;
                const r2x = isDesktop ? 28 : 14;
                const r2y = isDesktop ? 40 : 20;

                const freq1x = 0.0004, freq1y = 0.00063;
                const freq2x = 0.00055, freq2y = 0.00035;

                const mouse = { x: 0.5, y: 0.5 };
                const targetMouse = { x: 0.5, y: 0.5 };

                let windowWidth = window.innerWidth;
                let windowHeight = window.innerHeight;

                const onMouseMove = (e: MouseEvent) => {
                    targetMouse.x = e.clientX / windowWidth;
                    targetMouse.y = e.clientY / windowHeight;
                };

                const updateWindowSize = () => {
                    windowWidth = window.innerWidth;
                    windowHeight = window.innerHeight;
                };

                window.addEventListener("resize", updateWindowSize);
                window.addEventListener("mousemove", onMouseMove);

                let frame: number;
                let lastTs = 0;

                const tick = (ts: number) => {
                    const dt = ts - lastTs;
                    lastTs = ts;

                    orbit1.t += dt;
                    orbit2.t += dt;

                    orbit1.ox = Math.sin(orbit1.t * freq1x) * r1x;
                    orbit1.oy = Math.sin(orbit1.t * freq1y + Math.PI / 4) * r1y;
                    orbit2.ox = Math.sin(orbit2.t * freq2x + Math.PI / 3) * r2x;
                    orbit2.oy = Math.sin(orbit2.t * freq2y) * r2y;

                    mouse.x += (targetMouse.x - mouse.x) * 0.035;
                    mouse.y += (targetMouse.y - mouse.y) * 0.035;

                    if (isDesktop) {
                        const tiltX1 = (mouse.y - 0.5) * 18;
                        const tiltY1 = (mouse.x - 0.5) * -18;
                        const tiltX2 = (mouse.y - 0.5) * -24;
                        const tiltY2 = (mouse.x - 0.5) * 24;

                        gsap.set(shape1El, {
                            x: orbit1.ox,
                            y: orbit1.oy,
                            rotationX: tiltX1,
                            rotationY: tiltY1,
                            transformPerspective: 800,
                            overwrite: false,
                        });
                        gsap.set(shape2El, {
                            x: orbit2.ox,
                            y: orbit2.oy,
                            rotationX: tiltX2,
                            rotationY: tiltY2,
                            transformPerspective: 600,
                            overwrite: false,
                        });
                        frame = requestAnimationFrame(tick);
                    }
                };

                if (isDesktop) {
                    frame = requestAnimationFrame(tick);
                }

                const shape1Rotate = sectionRef.current?.querySelector(".js-bg-shape-1-rotate") as HTMLElement | null;
                const shape2Rotate = sectionRef.current?.querySelector(".js-bg-shape-2-rotate") as HTMLElement | null;

                if (shape1Rotate) {
                    gsap.to(shape1Rotate, {
                        rotate: 360,
                        duration: isDesktop ? 80 : 120,
                        repeat: -1,
                        ease: "none",
                    });
                }

                if (shape2Rotate) {
                    gsap.to(shape2Rotate, {
                        rotate: -360,
                        duration: isDesktop ? 55 : 80,
                        repeat: -1,
                        ease: "none",
                    });
                }

                return () => {
                    window.removeEventListener("resize", throttledUpdate);
                    window.removeEventListener("resize", updateWindowSize);
                    window.removeEventListener("mousemove", onMouseMove);
                    cancelAnimationFrame(frame);
                    cancelAnimationFrame(resizeTimer);
                };
            });
        },
        { scope: sectionRef, dependencies: [stages] }
    );

    return (
        <section
            id="journey"
            ref={sectionRef}
            className="relative bg-background py-16 overflow-hidden"
        >
            {/* Background Pinned Layer */}
            <div ref={bgRef}
                style={{ backgroundImage: "url(./hero_bg.svg)", backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}
                className="absolute top-0 left-0 w-full h-screen pointer-events-none z-0">
                <div className="absolute inset-0 bg-linear-to-b from-background via-bg-secondary/30 to-background transition-colors duration-200" />
                <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] rounded-full bg-[radial-gradient(circle,var(--accent-primary)/0.15)_0%,] animate-float-slow md:mix-blend-multiply dark:md:mix-blend-screen" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,var(--accent-secondary)/0.15)_0%,] animate-float md:mix-blend-multiply dark:md:mix-blend-screen" />

                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `radial-gradient(circle at center, var(--foreground) 1px, transparent 1px)`,
                        backgroundSize: "32px 32px"
                    }}
                />

                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="js-bg-shape-1-wrap absolute top-[5%] left-[2%] pointer-events-none opacity-0 will-change-transform">
                        <div className="js-bg-shape-1-rotate inline-block will-change-transform">
                            <Image
                                src="/flavor_1.svg"
                                alt=""
                                loading="eager"
                                aria-hidden="true"
                                className="js-bg-shape-1 will-change-transform"
                                style={{ transformStyle: "preserve-3d" }}
                                width={500}
                                height={500}
                            />
                        </div>
                    </div>

                    <div className="js-bg-shape-2-wrap absolute bottom-[5%] right-[2%] pointer-events-none opacity-0 will-change-transform">
                        <div className="js-bg-shape-2-rotate inline-block will-change-transform">
                            <Image
                                src="/flavor.svg"
                                loading="eager"
                                alt=""
                                aria-hidden="true"
                                className="js-bg-shape-2 will-change-transform"
                                style={{ transformStyle: "preserve-3d" }}
                                width={260}
                                height={260}
                            />
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--background)/0.8)_100%] pointer-events-none" />
                <div className="absolute top-0 inset-x-0 h-32 bg-linear-to-b from-background to-transparent pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-32 bg-linear-to-t from-background to-transparent pointer-events-none" />
            </div>

            <div className="w-full px-6 md:px-12 lg:px-20 relative z-10">
                <SectionHeader title="My Journey" />

                <div ref={containerRef} className="relative min-h-[500px]">
                    <div className="absolute inset-0 z-0 pointer-events-none">
                        <svg
                            ref={svgRef}
                            className="h-full w-full overflow-visible"
                            fill="none"
                        >
                            <defs>
                                <linearGradient id="journey-gradient" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="var(--accent-primary)" />
                                    <stop offset="100%" stopColor="var(--accent-secondary)" />
                                </linearGradient>
                            </defs>

                            {stages.length > 1 && stages.slice(0, -1).map((_, i) => (
                                <path
                                    key={i}
                                    ref={(el) => { pathRefs.current[i] = el; }}
                                    stroke="var(--foreground)"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                />
                            ))}

                            <g ref={headRef} style={{ opacity: 0 }}>
                                <circle r="6" fill="var(--foreground)" className="drop-shadow-[0_0_15px_var(--accent-primary)]" />
                                <circle r="12" fill="none" stroke="var(--foreground)" strokeWidth="1" className="animate-pulse opacity-80" />
                            </g>
                        </svg>
                    </div>

                    <div className="relative z-10 space-y-12 md:space-y-0">
                        {stages.map((stage, i) => (
                            <WaypointCard
                                key={stage._id}
                                stage={stage}
                                index={i}
                                isActive={activeStages.has(i)}
                                isCurrent={currentStage === i}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};