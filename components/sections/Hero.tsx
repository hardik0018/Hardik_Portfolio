"use client";

import { useRef, useState, useCallback, useMemo } from "react";
import Nav from "../Nav";
import Loader from "../Loader";
import FakeCursor from "../FakeCursor";
import CommentBubble, { type CommentBubbleHandle } from "../CommentBubble";
import Typewriter, { type TypewriterHandle } from "../Typewriter";
import { useReducedMotion } from "@/lib/useReducedMotion";

// Sub-components
import HeroEyebrow from "./Hero/components/HeroEyebrow";
import HeroWords from "./Hero/components/HeroWords";
import HeroCTA from "./Hero/components/HeroCTA";

// Hooks
import { useHeroAnimations } from "./Hero/hooks/useHeroAnimations";
import { useHeroDraggable } from "./Hero/hooks/useHeroDraggable";
import { useMouseParallax } from "./Hero/hooks/useMouseParallax";

// Constants
import { HERO_COPY } from "./Hero/constants";

/**
 * Hero component refactored for performance, reusability, and clean architecture.
 * Uses atomic components, custom hooks for GSAP logic, and 2025 best practices.
 */
export default function Hero() {
  const reduced = useReducedMotion();
  const [isEntranceFinished, setIsEntranceFinished] = useState(false);

  // Refs for animation and interaction
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const wordTopRef = useRef<HTMLDivElement>(null);
  const wordBottomRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const cursorOtherRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const selectionOtherRef = useRef<HTMLDivElement>(null);
  const commentRef = useRef<CommentBubbleHandle>(null);
  const commentElRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<TypewriterHandle>(null);
  const hoverBoxTopRef = useRef<HTMLDivElement>(null);
  const hoverBoxBottomRef = useRef<HTMLDivElement>(null);

  // Memoize refs object to prevent unnecessary hook re-runs
  const animationRefs = useMemo(() => ({
    root: rootRef,
    canvas: canvasRef,
    content: contentRef,
    loader: loaderRef,
    eyebrow: eyebrowRef,
    wordTop: wordTopRef,
    wordBottom: wordBottomRef,
    tagline: taglineRef,
    cta: ctaRef,
    typewriter: typewriterRef,
  }), []);

  const handleEntranceComplete = useCallback(() => {
    setIsEntranceFinished(true);
  }, []);

  // GSAP Animations (Entrance + Scroll)
  useHeroAnimations(animationRefs, handleEntranceComplete, reduced);

  // Mouse Parallax Effect
  useMouseParallax(contentRef, isEntranceFinished);

  // Draggable Interaction
  useHeroDraggable(
    wordTopRef,
    wordBottomRef,
    selectionRef,
    selectionOtherRef,
    hoverBoxTopRef,
    hoverBoxBottomRef,
    isEntranceFinished
  );

  return (
    <div
      ref={rootRef}
      className="relative w-full bg-background selection:bg-primary selection:text-primary-foreground overflow-x-hidden"
      style={{ minHeight: "200vh" }}
      role="banner"
    >
      <div
        ref={canvasRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-background border border-border/5 will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <main
          ref={contentRef}
          className="absolute inset-0 flex flex-col items-center justify-center z-10"
        >
          <div className="flex flex-col items-center px-4 text-center">
            <HeroEyebrow ref={eyebrowRef} />

            <HeroWords
              wordTopRef={wordTopRef}
              wordBottomRef={wordBottomRef}
              selectionRef={selectionRef}
              selectionOtherRef={selectionOtherRef}
              hoverBoxTopRef={hoverBoxTopRef}
              hoverBoxBottomRef={hoverBoxBottomRef}
            />

            <div className="mt-20 max-w-2xl">
              <p
                ref={taglineRef}
                className="text-lg text-muted-foreground md:text-xl font-medium tracking-tight"
              >
                <Typewriter ref={typewriterRef} />
              </p>
            </div>
          </div>
        </main>

        <HeroCTA ref={ctaRef} />

        <FakeCursor ref={cursorOtherRef} label={HERO_COPY.cursorOther} variant="other" />

        <div
          ref={commentElRef}
          className="pointer-events-none absolute z-[100] opacity-0"
          aria-hidden="true"
        >
          <CommentBubble ref={commentRef} author={HERO_COPY.cursorOther} />
        </div>
      </div>

      <Loader ref={loaderRef} />
    </div>
  );
}
