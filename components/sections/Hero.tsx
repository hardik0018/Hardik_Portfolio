"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Sculpture from "../Sculpture";
import CommentBubble, { type CommentBubbleHandle } from "../CommentBubble";
import FakeCursor from "../FakeCursor";
import Typewriter, { type TypewriterHandle } from "../Typewriter";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import HeroEyebrow from "./Hero/components/HeroEyebrow";
import HeroWords from "./Hero/components/HeroWords";
import { HERO_COPY } from "./Hero/constants";
import { useHeroAnimations } from "./Hero/hooks/useHeroAnimations";
import { useHeroDraggable } from "./Hero/hooks/useHeroDraggable";
import { useMouseParallax } from "./Hero/hooks/useMouseParallax";

export default function Hero() {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [isEntranceFinished, setIsEntranceFinished] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
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

  const animationRefs = useMemo(
    () => ({
      root: rootRef,
      canvas: canvasRef,
      content: contentRef,
      eyebrow: eyebrowRef,
      wordTop: wordTopRef,
      wordBottom: wordBottomRef,
      tagline: taglineRef,
      cta: ctaRef,
      typewriter: typewriterRef,
    }),
    []
  );

  const handleEntranceComplete = useCallback(() => {
    setIsEntranceFinished(true);
  }, []);

  useHeroAnimations(animationRefs, handleEntranceComplete, reduced);
  useMouseParallax(contentRef, isEntranceFinished && isDesktop && !reduced);

  useHeroDraggable(
    wordTopRef,
    wordBottomRef,
    selectionRef,
    selectionOtherRef,
    hoverBoxTopRef,
    hoverBoxBottomRef,
    cursorOtherRef,
    commentRef,
    commentElRef,
    isEntranceFinished && isDesktop && !reduced
  );

  return (
    <div
      ref={rootRef}
      className="relative w-full overflow-x-hidden selection:bg-accent selection:text-accent-foreground"
      style={{ minHeight: "100svh" }}
      role="banner"
    >
      <div
        ref={canvasRef}
        className="sticky top-0 h-[100svh] w-full overflow-hidden will-change-transform"
        style={{ transformOrigin: "center center" }}
      >
        <div className="absolute inset-0 z-0">
          <Sculpture />
        </div>

        <main
          ref={contentRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center mix-blend-difference"
        >
          <div className="flex w-full max-w-[1600px] flex-col items-center px-4 pb-12 pt-24 text-center sm:px-6 md:px-8 md:pb-16 md:pt-28">
            <div className="mb-4 overflow-hidden">
              <HeroEyebrow ref={eyebrowRef}>
                CREATIVE TECHNOLOGIST. DESIGNER. VISIONARY.
              </HeroEyebrow>
            </div>

            <HeroWords
              wordTopRef={wordTopRef}
              wordBottomRef={wordBottomRef}
              selectionRef={selectionRef}
              selectionOtherRef={selectionOtherRef}
              hoverBoxTopRef={hoverBoxTopRef}
              hoverBoxBottomRef={hoverBoxBottomRef}
            />

            <div className="mt-12 max-w-2xl px-4 sm:px-6 md:mt-16">
              <p
                ref={taglineRef}
                className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent/60 sm:text-xs"
              >
                SCROLL TO ENTER
              </p>
              <div className="mt-4 h-12">
                <Typewriter ref={typewriterRef} />
              </div>
            </div>
          </div>
        </main>

        <FakeCursor
          ref={cursorOtherRef}
          label={HERO_COPY.cursorOther}
          variant="other"
        />

        <div
          data-global-drag-line
          className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-px w-0 -translate-x-1/2 -translate-y-1/2 border-t border-dashed border-foreground/20 opacity-0"
          aria-hidden="true"
        />

        <div
          ref={commentElRef}
          className="pointer-events-none absolute z-[100] opacity-0"
          aria-hidden="true"
        >
          <CommentBubble ref={commentRef} />
        </div>
      </div>
    </div>
  );
}
