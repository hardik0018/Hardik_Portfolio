"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";

export type TypewriterHandle = {
    set: (text: string) => void;
    /** Type a string into the element over `duration` seconds. */
    type: (text: string, duration?: number) => gsap.core.Tween;
    /** Erase the current text over `duration` seconds. */
    erase: (duration?: number, fromLength?: number) => gsap.core.Tween;
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
    const caretRef = useRef<HTMLSpanElement>(null);
    const stateRef = useRef({ text: initial });

    useImperativeHandle(ref, () => ({
        set(text) {
            stateRef.current.text = text;
            if (elRef.current) elRef.current.textContent = text;
            if (caretRef.current) caretRef.current.style.opacity = "0";
        },
        type(text, duration = text.length * 0.03) {
            const state = stateRef.current;
            const proxy = { i: 0 };
            
            if (caretRef.current) caretRef.current.style.opacity = "1";

            return gsap.to(proxy, {
                i: text.length,
                duration,
                ease: "none",
                onStart: () => {
                    // Clear any lingering text before starting to type new text
                    state.text = "";
                    if (elRef.current) elRef.current.textContent = "";
                },
                onUpdate: () => {
                    const n = Math.round(proxy.i);
                    state.text = text.slice(0, n);
                    if (elRef.current) elRef.current.textContent = state.text;
                },
                onComplete: () => {
                    if (caretRef.current) caretRef.current.style.opacity = "0";
                }
            });
        },
    erase(duration = 0.6, fromLength?: number) {
            const state = stateRef.current;
            const startLen = fromLength ?? state.text.length;
            const proxy = { i: startLen };
            
            if (caretRef.current) caretRef.current.style.opacity = "1";

            return gsap.to(proxy, {
                i: 0,
                duration,
                ease: "power1.in",
                onUpdate: () => {
                    const n = Math.round(proxy.i);
                    // If we forced a length but the actual text is different, 
                    // we need a reference to the text we're erasing.
                    // But in a sequence, we usually know what was typed last.
                    state.text = state.text.slice(0, n);
                    if (elRef.current) elRef.current.textContent = state.text;
                },
                onComplete: () => {
                    if (caretRef.current) caretRef.current.style.opacity = "0";
                }
            });
        },
    }));

    return (
        <span className={className}>
            <span ref={elRef}>{initial}</span>
            <span 
                ref={caretRef}
                className="ml-0.5 inline-block h-[1em] w-[2px] -translate-y-[2px] animate-pulse bg-current align-middle opacity-0 transition-opacity duration-200" 
                aria-hidden="true" 
            />
        </span>
    );
});

export default Typewriter;
