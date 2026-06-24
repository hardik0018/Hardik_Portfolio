"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type LogoVariant = "reveal" | "pulse" | "glitch" | "minimal" | "kinetic";

interface LogoProps {
    variant?: LogoVariant;
    className?: string;
    text?: string;
}

const Logo = ({ variant = "reveal", className, text = "HV" }: LogoProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<SVGSVGElement>(null);
    const textRef = useRef<SVGTextElement>(null);

    useGSAP(() => {
        if (!textRef.current || !svgRef.current) return;

        const el = textRef.current;
        // Clear existing timelines if any (though useGSAP handles cleanup)
        gsap.killTweensOf(el);

        const tl = gsap.timeline({
            repeat: -1,
            yoyo: variant !== "kinetic",
            repeatDelay: 1,
        });

        switch (variant) {
            case "reveal":
                tl.fromTo(el,
                    {
                        strokeDasharray: 200,
                        strokeDashoffset: 200,
                        fill: "transparent",
                    },
                    {
                        strokeDashoffset: 0,
                        duration: 1.5,
                        ease: "power2.inOut"
                    }
                ).to(el, {
                    fill: "var(--accent-primary)",
                    duration: 0.5
                }, "-=0.3");
                break;

            case "pulse":
                tl.to(el, {
                    scale: 1.1,
                    strokeWidth: 1.5,
                    duration: 0.8,
                    ease: "sine.inOut",
                    fill: "var(--accent-primary)",
                }).to(el, {
                    scale: 1,
                    strokeWidth: 0.5,
                    duration: 0.8,
                    ease: "sine.inOut",
                    fill: "transparent",
                });
                break;

            case "glitch":
                const glitchTl = gsap.timeline({ repeat: -1 });
                glitchTl.to(el, { x: 2, y: -1, duration: 0.1, ease: "none" })
                    .to(el, { x: -2, y: 1, duration: 0.1, ease: "none" })
                    .to(el, { x: 0, y: 0, duration: 0.1, ease: "none" })
                    .to(el, { opacity: 0.5, duration: 0.05 })
                    .to(el, { opacity: 1, duration: 0.05 })
                    .to({}, { duration: 2 }); // Pause
                break;

            case "kinetic":
                tl.to(el, {
                    rotateY: 360,
                    duration: 3,
                    ease: "none",
                });
                break;

            case "minimal":
                tl.fromTo(el,
                    { opacity: 0, y: 5 },
                    { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
                );
                break;
        }
    }, { scope: containerRef, dependencies: [variant] });

    return (
        <div
            ref={containerRef}
            className={cn("w-12 h-12 flex items-center justify-center overflow-hidden", className)}
        >
            <svg
                ref={svgRef}
                viewBox="0 0 32 32"
                className="w-full h-full overflow-visible"
                style={{ perspective: "1000px" }}
            >
                <text
                    ref={textRef}
                    x="50%"
                    y="52%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-hero font-black text-[18px] uppercase tracking-wider origin-center"
                    stroke="var(--accent-primary)"
                    strokeWidth="0.5"
                    fill="transparent"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {text}
                </text>
            </svg>
        </div>
    );
};

export default Logo;
