"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SkillIcon } from "../SkillIcons";
import { SectionHeader } from "../ui/SectionHeader";
import { urlFor } from "@/lib/sanity.image";
import Image from "next/image";

export interface SanityColor {
    _type?: string;
    hex: string;
}

export interface SkillItem {
    _id: string;
    name: string;
    category: string;
    percentage: number;
    icon: string;
    customIcon?: Parameters<typeof urlFor>[0];
    accentColor?: string | SanityColor;
    tintColor?: string | SanityColor;
    size: "wide" | "tall" | "mini" | "xl";
    order: string;
    colSpan?: string;
    rowSpan?: string;
    special?: "curve" | "highlight";
}

const getHexColor = (color: string | SanityColor | null | undefined): string => {
    if (!color) return "";
    if (typeof color === "string") return color;
    if (color && typeof color === "object" && 'hex' in color && color.hex) return color.hex;
    return "";
};



function useCardTilt(ref: React.RefObject<HTMLDivElement | null>) {
    const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const mx = e.clientX - r.left;
        const my = e.clientY - r.top;
        el.style.setProperty("--mx", `${mx}px`);
        el.style.setProperty("--my", `${my}px`);
        gsap.to(el, {
            rotateX: -((my / r.height) - 0.5) * 6,
            rotateY: ((mx / r.width) - 0.5) * 6,
            duration: 0.4,
            ease: "power2.out",
            transformPerspective: 900,
        });
    };
    const onMouseLeave = () => {
        if (!ref.current) return;
        gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 0.55, ease: "power3.out" });
    };
    return { onMouseMove, onMouseLeave };
}

function useEntrance(
    cardRef: React.RefObject<HTMLDivElement | null>,
    barRef: React.RefObject<HTMLElement | SVGPathElement | null>,
    skill: SkillItem,
    delay: number,
) {
    useGSAP(() => {
        const el = cardRef.current;
        if (!el) return;
        gsap.set(el, { opacity: 0, y: 28, scale: 0.97 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: el,
                start: "top 90%",
                toggleActions: "play reverse play reverse",
            },
        });

        tl.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out", delay });

        if (barRef.current) {
            if (skill.special === "curve") {
                tl.to(barRef.current, {
                    strokeDashoffset: 100 - skill.percentage,
                    duration: 1.2,
                    ease: "power2.inOut",
                }, "-=0.25");
            } else {
                tl.to(barRef.current as HTMLElement, {
                    width: `${skill.percentage}%`,
                    duration: 1.15,
                    ease: "power2.inOut",
                }, "-=0.25");
            }
        }
    }, { scope: cardRef });
}

function CardIcon({ skill, big = false }: { skill: SkillItem; big?: boolean }) {
    const sz = big ? 64 : 52;
    const img = big ? 36 : 28;
    const accent = getHexColor(skill.accentColor) || "#3b82f6";

    if (skill.customIcon) {
        return (
            <div
                className="shrink-0 flex items-center justify-center overflow-hidden"
                style={{
                    width: sz,
                    height: sz,
                    borderRadius: big ? "18px" : "16px",
                    background: `linear-gradient(135deg, ${accent} 40%, transparent 100%)`,
                    boxShadow: `0 8px 24px color-mix(in srgb, ${accent} 15%, transparent)`,
                    padding: "1px",
                }}
            >
                <div
                    className="w-full h-full flex items-center justify-center overflow-hidden"
                    style={{
                        borderRadius: big ? "17px" : "15px",
                        background: `color-mix(in srgb, ${accent} 8%, #0d0d0d 100%)`,
                    }}
                >
                    <Image
                        src={urlFor(skill.customIcon).width(128).height(128).url()}
                        alt={skill.name}
                        width={img}
                        height={img}
                    />
                </div>
            </div>
        );
    }
    return <SkillIcon name={skill.icon} color={accent} size={big ? "big" : "default"} />;
}

function Bar({
    barRef,
    accentColor,
}: {
    barRef: React.RefObject<HTMLDivElement | null>;
    accentColor: string | SanityColor | null | undefined;
}) {
    const accent = getHexColor(accentColor) || "#3b82f6";

    return (
        <div
            className="w-full overflow-hidden rounded-full"
            style={{
                height: "3px",
                background: `color-mix(in srgb, white 18%, transparent)`,
            }}
        >
            <div
                ref={barRef}
                className="h-full w-0 rounded-full"
                style={{
                    background: `linear-gradient(90deg, ${accent}, color-mix(in srgb, ${accent} 40%, white))`,
                    boxShadow: `0 0 12px color-mix(in srgb, ${accent} 55%, transparent)`,
                }}
            />
        </div>
    );
}

function Label({ skill }: { skill: SkillItem }) {
    return (
        <div className="flex flex-col min-w-0">
            <span className="text-[1.05rem] font-semibold leading-none text-white truncate">
                {skill.name}
            </span>
            <span
                className="mt-1.5 text-[0.79rem] leading-none truncate"
                style={{ color: `color-mix(in srgb, white 50%, transparent)` }}
            >
                {skill.category}
            </span>
        </div>
    );
}

function Shell({
    cardRef,
    skill,
    onMouseMove,
    onMouseLeave,
    className = "",
    children,
}: {
    cardRef: React.RefObject<HTMLDivElement | null>;
    skill: SkillItem;
    onMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
    onMouseLeave: () => void;
    className?: string;
    children: React.ReactNode;
}) {
    const accent = getHexColor(skill.accentColor) || "#3b82f6";
    const rawTint = getHexColor(skill.tintColor);
    const tint = rawTint && rawTint !== "transparent"
        ? rawTint
        : `color-mix(in srgb, ${accent} 12%, #0f0f12)`;

    return (
        <div
            ref={cardRef}
            className={`group relative overflow-hidden rounded-[26px] backdrop-blur-xl transition-transform duration-500 hover:-translate-y-1 ${className}`}
            style={{
                background: `linear-gradient(140deg, ${tint} 0%, color-mix(in srgb, ${tint} 20%, #070709) 100%)`,
                border: `1.5px solid color-mix(in srgb, ${accent} 35%, rgba(255, 255, 255, 0.08))`,
                boxShadow: `0 12px 36px rgba(0, 0, 0, 0.4), 0 0 20px color-mix(in srgb, ${accent} 8%, transparent)`,
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
        >
            <div
                className="pointer-events-none absolute inset-px rounded-[25px] border"
                style={{ borderColor: `color-mix(in srgb, white 6%, transparent)` }}
            />
            <div
                className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-700 group-hover:opacity-100"
                style={{
                    background: `radial-gradient(340px circle at var(--mx,50%) var(--my,50%),
                        color-mix(in srgb, ${skill.accentColor} 14%, transparent),
                        transparent 68%)`,
                }}
            />
            {children}
        </div>
    );
}

function WideCard({ skill, delay, className = "" }: { skill: SkillItem; delay: number; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const { onMouseMove, onMouseLeave } = useCardTilt(cardRef);
    useEntrance(cardRef, barRef as React.RefObject<HTMLElement | null>, skill, delay);

    return (
        <Shell
            cardRef={cardRef}
            skill={skill}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`w-full ${className}`}
        >
            <div className="relative z-10 flex h-full items-center gap-4 p-5">
                <CardIcon skill={skill} />
                <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2.5">
                        <Label skill={skill} />
                        <span className="shrink-0 text-[1.05rem] font-semibold leading-none tabular-nums text-white">
                            {skill.percentage}%
                        </span>
                    </div>
                    <Bar barRef={barRef} accentColor={skill.accentColor} />
                </div>
            </div>
        </Shell>
    );
}

function MiniCard({ skill, delay, className = "" }: { skill: SkillItem; delay: number; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const { onMouseMove, onMouseLeave } = useCardTilt(cardRef);
    useEntrance(cardRef, barRef as React.RefObject<HTMLElement | null>, skill, delay);

    return (
        <Shell
            cardRef={cardRef}
            skill={skill}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`w-full ${className}`}
        >
            <div className="relative z-10 flex h-full items-center gap-3.5 p-4 sm:p-5">
                <CardIcon skill={skill} />
                <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center justify-between gap-3 mb-2">
                        <Label skill={skill} />
                        <span className="shrink-0 text-[0.98rem] font-semibold leading-none tabular-nums text-white">
                            {skill.percentage}%
                        </span>
                    </div>
                    <Bar barRef={barRef} accentColor={skill.accentColor} />
                </div>
            </div>
        </Shell>
    );
}

function TallCard({ skill, delay, className = "" }: { skill: SkillItem; delay: number; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const { onMouseMove, onMouseLeave } = useCardTilt(cardRef);
    useEntrance(cardRef, barRef as React.RefObject<HTMLElement | null>, skill, delay);

    return (
        <Shell
            cardRef={cardRef}
            skill={skill}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`h-full w-full ${className}`}
        >
            <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 min-h-[220px]">
                {/* top row: icon + label */}
                <div className="flex items-center gap-4">
                    <CardIcon skill={skill} big />
                    <Label skill={skill} />
                </div>

                {/* bottom part: % + bar */}
                <div className="flex flex-col gap-3 mt-6">
                    <span className="text-[2.2rem] font-bold leading-none tracking-tight text-white">
                        {skill.percentage}%
                    </span>
                    <Bar barRef={barRef} accentColor={skill.accentColor} />
                </div>
            </div>
        </Shell>
    );
}

function XLCard({ skill, delay, className = "" }: { skill: SkillItem; delay: number; className?: string }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const { onMouseMove, onMouseLeave } = useCardTilt(cardRef);
    useEntrance(cardRef, pathRef as React.RefObject<SVGPathElement | null>, skill, delay);
    const accent = getHexColor(skill.accentColor) || "#3b82f6";

    return (
        <Shell
            cardRef={cardRef}
            skill={skill}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}
            className={`h-full w-full ${className}`}
        >
            <div className="relative z-10 flex h-full flex-col justify-between p-5 sm:p-6 min-h-[220px]">
                {/* top row: icon + label */}
                <div className="flex items-center gap-4">
                    <CardIcon skill={skill} big />
                    <div className="flex flex-col min-w-0">
                        <span className="text-[1.2rem] font-semibold leading-none text-white">
                            {skill.name}
                        </span>
                        <span
                            className="mt-1.5 text-[0.82rem] leading-none"
                            style={{ color: `color-mix(in srgb, white 50%, transparent)` }}
                        >
                            {skill.category}
                        </span>
                    </div>
                </div>

                {/* bottom part: % only */}
                <div className="mt-auto flex items-end justify-between">
                    <span className="text-[2.8rem] sm:text-[3.2rem] font-bold leading-none tracking-tight text-white z-10">
                        {skill.percentage}%
                    </span>
                </div>
            </div>
            {/* SVG curve container in background */}
            <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
                <svg
                    className="absolute bottom-4 right-4 h-[60%] w-[70%]"
                    viewBox="0 0 340 190"
                    preserveAspectRatio="none"
                >
                    <path
                        ref={pathRef}
                        fill="none"
                        stroke={accent}
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        d="M 10 160 C 90 180 150 110 210 60 C 250 25 285 20 325 20"
                        pathLength="100"
                        strokeDasharray="100"
                        strokeDashoffset="100"
                        style={{
                            filter: `drop-shadow(0 0 10px color-mix(in srgb, ${accent} 65%, transparent))`,
                        }}
                    />
                    <circle
                        cx="325" cy="20" r="7.5"
                        fill={accent}
                        style={{
                            filter: `drop-shadow(0 0 14px ${accent})`,
                        }}
                    />
                </svg>
            </div>
        </Shell>
    );
}

/* ─────────────────────────────── Section ─────────────────────────────────── */

function getGridStyles(skill: SkillItem, index: number): { className: string; Component: React.ComponentType<{ skill: SkillItem; delay: number; className?: string }> } {
    let Component: React.ComponentType<{ skill: SkillItem; delay: number; className?: string }> = WideCard;
    if (skill.size === "mini") Component = MiniCard;
    else if (skill.size === "tall") Component = TallCard;
    else if (skill.size === "xl") Component = XLCard;

    let gridClasses = "col-span-12";
    switch (index) {
        case 0:
            gridClasses = "sm:col-start-1 sm:col-span-4 sm:row-start-1";
            break;
        case 1:
            gridClasses = "sm:col-start-5 sm:col-span-4 sm:row-start-1";
            break;
        case 2:
            gridClasses = "sm:col-start-9 sm:col-span-4 sm:row-start-1";
            break;
        case 3:
            gridClasses = "sm:col-start-1 sm:col-span-3 sm:row-start-2 sm:row-span-2";
            break;
        case 4:
            gridClasses = "sm:col-start-4 sm:col-span-3 sm:row-start-2";
            break;
        case 5:
            gridClasses = "sm:col-start-7 sm:col-span-3 sm:row-start-2";
            break;
        case 6:
            gridClasses = "sm:col-start-4 sm:col-span-3 sm:row-start-3";
            break;
        case 7:
            gridClasses = "sm:col-start-7 sm:col-span-3 sm:row-start-3";
            break;
        case 8:
            gridClasses = "sm:col-start-10 sm:col-span-3 sm:row-start-2 sm:row-span-2";
            break;
        case 9:
            gridClasses = "sm:col-start-1 sm:col-span-3 sm:row-start-4";
            break;
        case 10:
            gridClasses = "sm:col-start-4 sm:col-span-3 sm:row-start-4";
            break;
        case 11:
            gridClasses = "sm:col-start-7 sm:col-span-3 sm:row-start-4";
            break;
        case 12:
            gridClasses = "sm:col-start-10 sm:col-span-3 sm:row-start-4";
            break;
        default:
            gridClasses = "sm:col-span-3";
    }

    return { className: gridClasses, Component };
}

export default function Skill({ initialData }: { initialData?: SkillItem[] }) {
    const limeRef = useRef<HTMLDivElement>(null);
    const blueRef = useRef<HTMLDivElement>(null);

    const skills = initialData || [];

    const sorted = [...skills].sort((a, b) => {
        const numA = parseInt(a.order.replace(/[^\d]/g, ""), 10) || 0;
        const numB = parseInt(b.order.replace(/[^\d]/g, ""), 10) || 0;
        return numA - numB;
    });

    const blobColorA = getHexColor(sorted[0]?.accentColor) || "transparent";
    const blobColorB = getHexColor(sorted[sorted.length - 1]?.accentColor) || "transparent";

    useGSAP(() => {
        gsap.to(limeRef.current, { x: 70, y: -46, duration: 15, ease: "sine.inOut", repeat: -1, yoyo: true });
        gsap.to(blueRef.current, { x: -70, y: 48, duration: 18, ease: "sine.inOut", repeat: -1, yoyo: true });
    }, []);

    return (
        <section
            id="skill"
            className="relative overflow-hidden bg-foreground px-5 py-24 font-sans sm:px-8 lg:px-10 lg:py-28"
        >
            <div
                ref={limeRef}
                className="absolute -left-36 h-120 w-120 rounded-full blur-[120px] pointer-events-none"
                style={{ background: `color-mix(in srgb, ${blobColorA} 30%, transparent)` }}
            />
            <div
                ref={blueRef}
                className="absolute -bottom-36 -right-20 h-120 w-120 rounded-full blur-[110px] pointer-events-none"
                style={{ background: `color-mix(in srgb, ${blobColorB} 40%, transparent)` }}
            />

            <SectionHeader
                variant="secondary"
                title="My Advantage"
                subtitle="A curated set of skills and tools I use to design, build and bring ideas to life."
            />

            <div className="relative z-10 mx-auto w-full max-w-7xl grid grid-cols-1 sm:grid-cols-12 gap-4 lg:gap-5">
                {sorted.map((skill, index) => {
                    const { className, Component } = getGridStyles(skill, index);
                    return (
                        <Component
                            key={skill._id}
                            skill={skill}
                            delay={index * 0.05}
                            className={className}
                        />
                    );
                })}
            </div>
        </section>
    );
}