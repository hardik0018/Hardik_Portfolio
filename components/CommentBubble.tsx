"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export type CommentBubbleHandle = {
  /** Type new text into the bubble body with a typewriter effect */
  typeText: (text: string, duration?: number) => void;
  /** Clear the typed text */
  clear: () => void;
};

type Props = { author: string };

/**
 * Figma-style comment bubble.
 * Author label: uses theme foreground/background tokens.
 * Body: uses label-violet semantic token.
 */
const CommentBubble = forwardRef<CommentBubbleHandle, Props>(
  function CommentBubble({ author }, ref) {
    const bodyRef = useRef<HTMLSpanElement>(null);
    const caretRef = useRef<HTMLSpanElement>(null);

    useImperativeHandle(ref, () => ({
      typeText(text, duration = text.length * 0.045) {
        const proxy = { i: 0 };
        gsap.to(proxy, {
          i: text.length,
          duration,
          ease: "none",
          onUpdate() {
            if (bodyRef.current)
              bodyRef.current.textContent = text.slice(0, Math.round(proxy.i));
          },
        });
      },
      clear() {
        if (bodyRef.current) bodyRef.current.textContent = "";
      },
    }));

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-40 origin-top-left"
        style={{ opacity: 0, transform: "scale(0.85)" }}
      >
        {/* Author chip */}
        <div
          className={cn(
            "-mb-[2px] inline-block rounded-t-[4px] px-2 py-[3px] text-[10px] font-mono font-bold leading-none",
            "bg-foreground text-background"
          )}
        >
          {author}
        </div>

        {/* Body bubble */}
        <div
          className={cn(
            "rounded-b-[6px] rounded-tr-[6px] px-3 py-2 text-[12px] font-medium leading-snug shadow-xl min-w-[180px] max-w-[280px]",
            "bg-label-violet text-white"
          )}
        >
          <span ref={bodyRef} />
          {/* blinking caret */}
          <span
            ref={caretRef}
            aria-hidden="true"
            className="inline-block w-[2px] h-[12px] bg-white/80 ml-[2px] -mb-[2px] align-middle animate-pulse"
          />
        </div>
      </div>
    );
  }
);

export default CommentBubble;
