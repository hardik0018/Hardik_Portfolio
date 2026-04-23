"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";

export type TypewriterHandle = {
    /** Type a string into the element over `duration` seconds. */
    type: (text: string, duration?: number) => gsap.core.Tween;
    /** Erase the current text over `duration` seconds. */
    erase: (duration?: number) => gsap.core.Tween;
};

type Props = { className?: string; initial?: string };

/**
 * Imperative typewriter — the parent timeline calls `.type(...)` / `.erase(...)`
 * via the forwarded ref so we can compose typewriter beats inside a master
 * GSAP timeline (using `tl.add(handle.type(...))`).
 */
const Typewriter = forwardRef<TypewriterHandle, Props>(function Typewriter(
    { className, initial = "" },
    ref
) {
    const elRef = useRef<HTMLSpanElement>(null);
    const stateRef = useRef({ text: initial });

    useImperativeHandle(ref, () => ({
        type(text, duration = text.length * 0.04) {
            const state = stateRef.current;
            const start = state.text.length;
            const proxy = { i: 0 };
            return gsap.to(proxy, {
                i: text.length,
                duration,
                ease: "none",
                onUpdate: () => {
                    const n = Math.round(proxy.i);
                    state.text = text.slice(0, n);
                    if (elRef.current) elRef.current.textContent = state.text;
                },
            });
        },
        erase(duration = 0.6) {
            const state = stateRef.current;
            const proxy = { i: state.text.length };
            return gsap.to(proxy, {
                i: 0,
                duration,
                ease: "power1.in",
                onUpdate: () => {
                    const n = Math.round(proxy.i);
                    state.text = state.text.slice(0, n);
                    if (elRef.current) elRef.current.textContent = state.text;
                },
            });
        },
    }));

    return (
        <span className={className}>
            <span ref={elRef}>{initial}</span>
            <span className="ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[2px] animate-pulse bg-current align-middle" aria-hidden="true" />
        </span>
    );
});

export default Typewriter;
