"use client";

/**
 * RevealImage
 * ─────────────────────────────────────────────────────────────────
 * A drop-in replacement for Next.js <Image> that animates the image
 * in with a clip-path reveal.  Zero flash — initial state is applied
 * via inline style (SSR-safe) so the image is hidden before first paint.
 *
 * Usage:
 *   <RevealImage
 *     src="/photo.jpg"
 *     alt="..."
 *     fill
 *     transition="iris"        // see TransitionType below
 *     trigger="scroll"         // "load" | "scroll"
 *     delay={0.2}
 *     duration={1.4}
 *     ease="power3.inOut"
 *     wrapperClassName="relative w-full h-64"
 *   />
 * ─────────────────────────────────────────────────────────────────
 */

import React, { useRef } from "react";
import Image, { ImageProps } from "next/image";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";

// ── Transition catalogue ───────────────────────────────────────────────────────

export type TransitionType =
    | "top-down"      // reveals from top  → bottom
    | "bottom-up"     // reveals from bottom → top
    | "left-right"    // reveals from left  → right
    | "right-left"    // reveals from right → left
    | "center-h"      // expands from vertical centre out
    | "center-v"      // expands from horizontal centre out
    | "diagonal-tl"   // diagonal wipe: top-left corner
    | "diagonal-tr"   // diagonal wipe: top-right corner
    | "iris";         // circle expands from center (ellipse clip)

interface ClipSet {
    from: string;
    to: string;
    /** Use "ellipse" clip-path syntax (iris). Default: polygon */
    kind?: "ellipse" | "polygon";
}

const TRANSITIONS: Record<TransitionType, ClipSet> = {
    "top-down": {
        from: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        to:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    "bottom-up": {
        from: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
        to:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    "left-right": {
        from: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        to:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    "right-left": {
        from: "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
        to:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    "center-h": {
        from: "polygon(50% 0%, 50% 0%, 50% 100%, 50% 100%)",
        to:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    "center-v": {
        from: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)",
        to:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    "diagonal-tl": {
        from: "polygon(0% 0%, 0% 0%, 0% 0%, 0% 0%)",
        to:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    "diagonal-tr": {
        from: "polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)",
        to:   "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    },
    iris: {
        kind: "ellipse",
        from: "ellipse(0% 0% at 50% 50%)",
        to:   "ellipse(150% 150% at 50% 50%)",
    },
};

// ── Props ──────────────────────────────────────────────────────────────────────

export interface RevealImageProps extends Omit<ImageProps, "className"> {
    /** Clip-path animation style. Default: "top-down" */
    transition?: TransitionType;
    /** "load" = plays on mount. "scroll" = plays when element enters viewport. Default: "load" */
    trigger?: "load" | "scroll";
    /** Delay in seconds before animation starts. Default: 0 */
    delay?: number;
    /** Animation duration in seconds. Default: 1.3 */
    duration?: number;
    /** GSAP ease string. Default: "power3.inOut" */
    ease?: string;
    /** ScrollTrigger start offset. Only used when trigger="scroll". Default: "top 85%" */
    scrollStart?: string;
    /** Extra classes on the outer wrapper div */
    wrapperClassName?: string;
    /** Extra classes on the Next.js Image element */
    className?: string;
}

// ── Component ──────────────────────────────────────────────────────────────────

const RevealImage = React.forwardRef<HTMLDivElement, RevealImageProps>(
    (
        {
            transition = "top-down",
            trigger = "load",
            delay = 0,
            duration = 1.3,
            ease = "power3.inOut",
            scrollStart = "top 85%",
            wrapperClassName,
            className,
            ...imageProps
        },
        outerRef
    ) => {
        const EASE_MAP: Record<string, string> = {
            "power1.in": "cubic-bezier(0.55, 0.085, 0.68, 0.53)",
            "power1.out": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
            "power1.inOut": "cubic-bezier(0.455, 0.03, 0.515, 0.955)",
            "power2.in": "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
            "power2.out": "cubic-bezier(0.215, 0.61, 0.355, 1)",
            "power2.inOut": "cubic-bezier(0.7, 0, 0.3, 1)",
            "power3.in": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
            "power3.out": "cubic-bezier(0.165, 0.84, 0.44, 1)",
            "power3.inOut": "cubic-bezier(0.645, 0.045, 0.355, 1)",
            "power4.in": "cubic-bezier(0.895, 0.03, 0.685, 0.22)",
            "power4.out": "cubic-bezier(0.165, 0.84, 0.44, 1)",
            "power4.inOut": "cubic-bezier(0.77, 0, 0.175, 1)",
            "none": "linear",
            "linear": "linear"
        };

        const wrapperRef = useRef<HTMLDivElement>(null);
        const { from, to } = TRANSITIONS[transition];

        // Merge forwarded ref + internal ref
        const setRef = (el: HTMLDivElement | null) => {
            (wrapperRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            if (typeof outerRef === "function") outerRef(el);
            else if (outerRef) (outerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        };

        useGSAP(
            () => {
                if (trigger !== "scroll") return;
                const el = wrapperRef.current;
                if (!el) return;

                const animProps = {
                    clipPath: to,
                    duration,
                    ease,
                    clearProps: "clipPath,willChange",
                };

                gsap.to(el, {
                    ...animProps,
                    scrollTrigger: {
                        trigger: el,
                        start: scrollStart,
                        toggleActions: "play none none reverse",
                    },
                });
            },
            { scope: wrapperRef }
        );

        const { alt, ...restProps } = imageProps;
        const isLoad = trigger === "load";
        const cssEase = EASE_MAP[ease] || "ease-in-out";
        const animName = `reveal-${transition}`;

        return (
            <div
                ref={setRef}
                className={cn("overflow-hidden", wrapperClassName)}
                style={
                    isLoad
                        ? {
                              clipPath: to,
                              animationName: animName,
                              animationDuration: `${duration}s`,
                              animationDelay: `${delay}s`,
                              animationTimingFunction: cssEase,
                              animationFillMode: "both",
                              willChange: "clip-path",
                          }
                        : { clipPath: from, willChange: "clip-path" }
                }
            >
                {isLoad && (
                    <style dangerouslySetInnerHTML={{
                        __html: `
                            @keyframes ${animName} {
                                from { clip-path: ${from}; }
                                to { clip-path: ${to}; }
                            }
                        `
                    }} />
                )}
                <Image
                    className={cn("w-full h-full", className)}
                    alt={alt || ""}
                    {...restProps}
                />
            </div>
        );
    }
);

RevealImage.displayName = "RevealImage";

export { RevealImage };
