"use client";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";
import { cn } from "@/lib/utils";

export type CommentBubbleHandle = {
  /** Type new text into the bubble body with a typewriter effect */
  typeText: (text: string, duration?: number) => void;
  /** Set text immediately without animation */
  setText: (text: string) => void;
  /** Clear the typed text */
  clear: () => void;
};

/**
 * Figma-style comment bubble.
 * Author label: uses theme foreground/background tokens.
 * Body: uses label-violet semantic token.
 */
const CommentBubble = forwardRef<CommentBubbleHandle>(
  function CommentBubble({ }, ref) {
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
      setText(text) {
        if (bodyRef.current) bodyRef.current.textContent = text;
      },
      clear() {
        if (bodyRef.current) bodyRef.current.textContent = "";
      },
    }));

    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-40 origin-top-left flex flex-col items-start"
      >
        <div
          className={cn(
            "rounded-[24px] rounded-tl-[0px] px-4 py-2 text-[15px] font-medium leading-snug shadow-2xl",
            "bg-label-violet text-white whitespace-nowrap min-w-[10px]"
          )}
        >
          <span ref={bodyRef} className="" />
          <span
            ref={caretRef}
            aria-hidden="true"
            className="inline-block w-[1.5px] h-[16px] bg-black/70 ml-[2px] -mb-[3px] align-middle animate-pulse"
          />
        </div>
      </div>
    );
  }
);

export default CommentBubble;
