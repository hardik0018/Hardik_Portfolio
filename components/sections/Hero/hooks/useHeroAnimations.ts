import { useEffect, useRef, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HERO_COPY, HERO_ANIMATION_CONFIG } from "../constants";
import { TypewriterHandle } from "@/components/Typewriter";

export function useHeroAnimations(
  refs: {
    root: RefObject<HTMLDivElement | null>;
    canvas: RefObject<HTMLDivElement | null>;
    content: RefObject<HTMLDivElement | null>;
    loader: RefObject<HTMLDivElement | null>;
    eyebrow: RefObject<HTMLParagraphElement | null>;
    wordTop: RefObject<HTMLDivElement | null>;
    wordBottom: RefObject<HTMLDivElement | null>;
    tagline: RefObject<HTMLParagraphElement | null>;
    cta: RefObject<HTMLAnchorElement | null>;
    typewriter: RefObject<TypewriterHandle | null>;
  },
  onEntranceComplete: () => void,
  reduced: boolean,
) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const {
      root,
      canvas,
      loader,
      eyebrow,
      wordTop,
      wordBottom,
      tagline,
      cta,
      typewriter,
    } = refs;

    if (reduced) {
      const targets = [
        wordTop.current,
        wordBottom.current,
        tagline.current,
        cta.current,
      ].filter(Boolean);
      if (targets.length > 0) {
        gsap.set(targets, {
          opacity: 1,
          y: 0,
          filter: "none",
        });
      }
      gsap.set(document.querySelectorAll('[data-nav="true"]'), {
        opacity: 1,
        y: 0,
      });
      if (loader.current) loader.current.style.display = "none";
      if (eyebrow.current) eyebrow.current.textContent = HERO_COPY.eyebrow;
      typewriter.current?.type(HERO_COPY.taglineB, 0);
      onEntranceComplete();
      return;
    }

    const ctx = gsap.context(() => {
      // Initial states
      if (wordTop.current) {
        gsap.set(wordTop.current, {
          opacity: 0,
          y: 140,
          filter: "blur(60px)",
          rotateX: 15,
        });
      }
      if (wordBottom.current) {
        gsap.set(wordBottom.current, { opacity: 0, y: 120, scale: 0.95 });
      }
      const tagCtaTargets = [tagline.current, cta.current].filter(Boolean);
      if (tagCtaTargets.length > 0) {
        gsap.set(tagCtaTargets, { opacity: 0, y: 40 });
      }
      if (eyebrow.current) {
        gsap.set(eyebrow.current, { textContent: "" });
      }
      gsap.set(document.querySelectorAll('[data-nav="true"]'), {
        opacity: 0,
        y: -20,
      });

      const entranceTl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: onEntranceComplete,
      });

      const counter = { v: 0 };
      entranceTl.to(counter, {
        v: 100,
        duration: HERO_ANIMATION_CONFIG.entranceDuration,
        ease: "power2.inOut",
        onUpdate: () => {
          if (loader.current)
            loader.current.textContent = `${Math.round(counter.v)}%`;
        },
      });

      entranceTl.to(
        loader.current,
        {
          opacity: 0,
          y: -40,
          duration: 0.8,
          ease: "power4.in",
          onComplete: () => {
            if (loader.current) loader.current.style.display = "none";
          },
        },
        ">=0.1",
      );

      entranceTl.addLabel("entrance", ">-0.2");
      entranceTl.to(
        document.querySelectorAll('[data-nav="true"]'),
        { opacity: 1, y: 0, duration: 1.5, stagger: 0.12 },
        "entrance",
      );

      const ep = { i: 0 };
      entranceTl.to(
        ep,
        {
          i: HERO_COPY.eyebrow.length,
          duration: 1.4,
          ease: "none",
          onUpdate: () => {
            if (eyebrow.current)
              eyebrow.current.textContent = HERO_COPY.eyebrow.slice(
                0,
                Math.round(ep.i),
              );
          },
        },
        "entrance+=0.5",
      );

      entranceTl.to(
        wordTop.current,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          rotateX: 0,
          duration: 2.8,
        },
        "entrance+=0.8",
      );

      entranceTl.to(
        wordBottom.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 2.8,
        },
        "entrance+=1.0",
      );

      entranceTl.to(
        tagline.current,
        { opacity: 1, y: 0, duration: 1.6 },
        "entrance+=1.6",
      );

      if (typewriter.current) {
        entranceTl.add(
          typewriter.current.type(HERO_COPY.taglineA, 1.0),
          "entrance+=1.6",
        );
      }

      entranceTl.to(
        cta.current,
        { opacity: 1, y: 0, duration: 1.6 },
        "entrance+=2.0",
      );

      // Scroll Animation — Hero recedes and vanishes in ~1 viewport of scroll
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          // Keep this short so there is zero dead-zone before Statements pin
          end: "+=100%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Phase 1 (0 → 0.4): tilt + shrink + border radius
      scrollTl.to(
        canvas.current,
        {
          rotateX: HERO_ANIMATION_CONFIG.scrollRotationX,
          rotateY: HERO_ANIMATION_CONFIG.scrollRotationY,
          scale: HERO_ANIMATION_CONFIG.scrollScale,
          y: "-6vh",
          filter: "blur(0.5px)",
          borderRadius: "44px",
          borderColor: "#a78bfa",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          ease: "power2.inOut",
          transformOrigin: "50% 80%",
          duration: 0.4,
        },
        0,
      );

      scrollTl.to(
        [eyebrow.current, tagline.current],
        { opacity: 0.2, ease: "none", duration: 0.3 },
        0,
      );

      // Phase 2 (0.4 → 1.0): fly up and vanish
      scrollTl.to(
        canvas.current,
        {
          y: "-120vh",
          scale: 0.45,
          opacity: 0,
          rotateX: 40,
          filter: "blur(6px)",
          ease: "expo.in",
          duration: 0.6,
        },
        0.4,
      );
    }, root);

    return () => ctx.revert();
  }, [refs, reduced, onEntranceComplete]);
}
