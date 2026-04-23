"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Big bottom-right loading counter (0% → 100%).
 * The parent timeline tweens an internal counter object and writes
 * the value into this element via gsap's `onUpdate`.
 */
const Loader = forwardRef<HTMLDivElement>(function Loader(_, ref) {
    return (
        <div
            ref={ref}
            aria-hidden="true"
            className={cn(
                "fixed bottom-10 right-10 z-50 font-display tabular text-[clamp(80px,15vw,240px)] font-black leading-none tracking-tighter text-foreground"
            )}
        >
            0%
        </div>
    );
});

export default Loader;
