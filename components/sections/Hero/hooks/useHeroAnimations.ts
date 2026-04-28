import { RefObject, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CommentBubbleHandle } from "@/components/CommentBubble";
import { TypewriterHandle } from "@/components/Typewriter";
import { positionSelectionTo, setSelectionMode } from "@/lib/gsap-utils";
import { HERO_ANIMATION_CONFIG, HERO_COPY } from "../constants";

type HeroAnimationRefs = {
  root: RefObject<HTMLDivElement | null>;
  canvas: RefObject<HTMLDivElement | null>;
  content: RefObject<HTMLDivElement | null>;
  eyebrow: RefObject<HTMLParagraphElement | null>;
  wordTop: RefObject<HTMLDivElement | null>;
  wordBottom: RefObject<HTMLDivElement | null>;
  tagline: RefObject<HTMLParagraphElement | null>;
  cta: RefObject<HTMLAnchorElement | null>;
  typewriter: RefObject<TypewriterHandle | null>;
  cursorYou?: RefObject<HTMLDivElement | null>;
  cursorOther?: RefObject<HTMLDivElement | null>;
  selection?: RefObject<HTMLDivElement | null>;
  selectionOther?: RefObject<HTMLDivElement | null>;
  comment?: RefObject<HTMLDivElement | null>;
  commentHandle?: RefObject<CommentBubbleHandle | null>;
};

export function useHeroAnimations(
  refs: HeroAnimationRefs,
  onEntranceComplete: () => void,
  reduced: boolean
) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const {
      root,
      canvas,
      eyebrow,
      wordTop,
      wordBottom,
      tagline,
      cta,
      typewriter,
      cursorYou,
      cursorOther,
      selection,
      selectionOther,
      comment,
      commentHandle,
    } = refs;

    const ctx = gsap.context(() => {
      const phrases = [
        "MERN Stack Developer",
        "Creative Thinker",
        "Problem Solver",
        "UI/UX Designer",
      ];

      const tw = typewriter.current;
      let activeTween: gsap.core.Tween | null = null;
      let activeDelay: ReturnType<typeof gsap.delayedCall> | null = null;

      const clearTaglineTimers = () => {
        activeTween?.kill();
        activeDelay?.kill();
      };

      const setStaticTagline = () => {
        clearTaglineTimers();
        tw?.set(phrases[0]);
      };

      if (reduced) {
        gsap.set(
          [eyebrow.current, wordTop.current, wordBottom.current, tagline.current, cta.current].filter(Boolean),
          {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            filter: "none",
            clearProps: "transform",
          }
        );
        gsap.set(document.querySelectorAll('[data-nav="true"]'), {
          opacity: 1,
          y: 0,
        });
        gsap.set(
          [
            cursorYou?.current,
            cursorOther?.current,
            selection?.current,
            selectionOther?.current,
            comment?.current,
          ].filter(Boolean),
          { opacity: 0 }
        );
        setStaticTagline();
        onEntranceComplete();

        return clearTaglineTimers;
      }

      if (wordTop.current) {
        gsap.set(wordTop.current, {
          opacity: 0,
          y: 120,
          filter: "blur(12px)",
          rotateX: 15,
        });
      }

      if (wordBottom.current) {
        gsap.set(wordBottom.current, {
          opacity: 0,
          y: 120,
          scale: 0.95,
        });
      }

      gsap.set([tagline.current, cta.current].filter(Boolean), {
        opacity: 0,
        y: 40,
      });

      if (eyebrow.current) {
        gsap.set(eyebrow.current, { textContent: "" });
      }

      gsap.set(document.querySelectorAll('[data-nav="true"]'), {
        opacity: 0,
        y: -20,
      });

      gsap.set(
        [cursorYou?.current, cursorOther?.current, selection?.current, selectionOther?.current, comment?.current].filter(
          Boolean
        ),
        { opacity: 0 }
      );

      if (cursorYou?.current) {
        gsap.set(cursorYou.current, { scale: 0.5, x: -80, y: -40 });
      }

      if (cursorOther?.current) {
        gsap.set(cursorOther.current, { x: "50vw", y: "50vh" });
      }

      if (comment?.current) {
        gsap.set(comment.current, { scale: 0.8, x: 250, y: -80 });
      }

      const entranceTl = gsap.timeline({
        defaults: { ease: "expo.out" },
        onComplete: onEntranceComplete,
      });

      entranceTl
        .to(
          { value: 0 },
          {
            value: 100,
            duration: HERO_ANIMATION_CONFIG.entranceDuration,
            ease: "power2.inOut",
          }
        )
        .addLabel("entrance", ">-0.2")
        .to(
          document.querySelectorAll('[data-nav="true"]'),
          { opacity: 1, y: 0, duration: 1.5, stagger: 0.12 },
          "entrance"
        )
        .to(
          wordTop.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            rotateX: 0,
            duration: 1.4,
          },
          "entrance+=0.3"
        )
        .to(
          wordBottom.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.4,
          },
          "entrance+=0.4"
        )
        .to(tagline.current, { opacity: 1, y: 0, duration: 1.2 }, "entrance+=0.7")
        .to(cta.current, { opacity: 1, y: 0, duration: 1.2 }, "entrance+=0.8");

      const startTaglineLoop = () => {
        if (!tw) return;

        let index = 0;

        const playNext = () => {
          const currentPhrase = phrases[index];
          activeTween = tw.type(currentPhrase);
          activeTween.eventCallback("onComplete", () => {
            activeDelay = gsap.delayedCall(2, () => {
              activeTween = tw.erase(0.6, currentPhrase.length);
              activeTween.eventCallback("onComplete", () => {
                index = (index + 1) % phrases.length;
                activeDelay = gsap.delayedCall(0.5, playNext);
              });
            });
          });
        };

        playNext();
      };

      entranceTl.add(startTaglineLoop, "entrance+=0.8");

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const interactLabel = "entrance+=1.2";

        if (cursorYou?.current) {
          entranceTl.to(
            cursorYou.current,
            {
              opacity: 1,
              scale: 1,
              x: 20,
              y: -20,
              duration: 0.5,
              ease: "back.out(2)",
            },
            interactLabel
          );
        }

        if (cursorOther?.current && wordTop.current && selection?.current) {
          entranceTl
            .to(
              cursorOther.current,
              { opacity: 1, x: 50, y: -20, duration: 1.2, ease: "power3.inOut" },
              interactLabel + "+=0.3"
            )
            .add(() => {
              if (wordTop.current && selection.current) {
                positionSelectionTo(wordTop.current, selection.current);
                setSelectionMode(selection.current, "drag");
              }
            }, interactLabel + "+=1.5")
            .to(cursorOther.current, { scale: 0.9, duration: 0.1 }, interactLabel + "+=1.5")
            .to(selection.current, { opacity: 1, duration: 0.1 }, interactLabel + "+=1.5")
            .to(
              [wordTop.current, selection.current, cursorOther.current],
              { x: "+=120", duration: 0.8, ease: "power2.inOut" },
              interactLabel + "+=1.6"
            )
            .add(() => {
              if (selection.current) setSelectionMode(selection.current, "snap");
            }, interactLabel + "+=2.4")
            .to(cursorOther.current, { scale: 1, duration: 0.1 }, interactLabel + "+=2.4")
            .to(
              [wordTop.current, selection.current],
              { x: 0, duration: 1.8, ease: "elastic.out(1.1, 0.45)" },
              interactLabel + "+=2.5"
            );

          if (comment?.current && commentHandle?.current) {
            entranceTl
              .to(
                cursorOther.current,
                { x: 220, y: -80, duration: 1.2, ease: "power3.inOut" },
                interactLabel + "+=2.8"
              )
              .to(
                comment.current,
                { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)" },
                interactLabel + "+=4.0"
              )
              .add(() => {
                commentHandle.current?.typeText(HERO_COPY.comment);
              }, interactLabel + "+=4.2")
              .to(
                [
                  cursorYou?.current,
                  cursorOther?.current,
                  selection.current,
                  comment.current,
                ].filter(Boolean),
                { opacity: 0, duration: 0.5, ease: "power2.in" },
                interactLabel + "+=7.0"
              );
          }
        }

        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=100%",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        })
          .to(
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
            0
          )
          .to(
            [eyebrow.current, tagline.current],
            { opacity: 0.2, ease: "none", duration: 0.3 },
            0
          )
          .to(
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
            0.4
          );
      });

      mm.add("(max-width: 767px)", () => {
        gsap.to(canvas.current, {
          yPercent: -10,
          scale: 0.96,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });

      return () => {
        clearTaglineTimers();
        mm.revert();
      };
    }, root);

    return () => ctx.revert();
  }, [refs, reduced, onEntranceComplete]);
}
