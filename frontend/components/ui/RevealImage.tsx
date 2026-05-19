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
                const el = wrapperRef.current;
                if (!el) return;

                const animProps = {
                    clipPath: to,
                    duration,
                    delay: trigger === "load" ? delay : 0,
                    ease,
                    clearProps: "clipPath,willChange",
                };

                if (trigger === "scroll") {
                    gsap.to(el, {
                        ...animProps,
                        scrollTrigger: {
                            trigger: el,
                            start: scrollStart,
                            toggleActions: "play none none reverse",
                        },
                    });
                } else {
                    gsap.to(el, animProps);
                }
            },
            { scope: wrapperRef }
        );

            const { alt, ...restProps } = imageProps;

            return (
                <div
                    ref={setRef}
                    className={cn("overflow-hidden", wrapperClassName)}
                    // ↓ Applied via SSR inline style — hides image before first paint (no flash)
                    style={{ clipPath: from, willChange: "clip-path" }}
                >
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
