"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { buildStatementTimeline } from "@/lib/buildStatementTimeline";
import { ParsedStatement, StatementsAnimConfig } from "@/types/statements";
import { useMediaQuery } from "./useMediaQuery";
import { useReducedMotion } from "./useReducedMotion";
import { useTypewriter } from "./useTypewriter";

gsap.registerPlugin(ScrollTrigger);

export function useStatementsAnimation(
  parsed: ParsedStatement[],
  config: StatementsAnimConfig
) {
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const writeText = useTypewriter();

  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLElement | null)[]>([]);
  const numberRefs = useRef<(HTMLElement | null)[]>([]);
  const tagRefs = useRef<(HTMLElement | null)[]>([]);
  const selectionRefs = useRef<(HTMLElement | null)[]>([]);
  const headingRefs = useRef<(HTMLElement | null)[]>([]);
  const innerRefs = useRef<(HTMLElement | null)[]>([]);
  const commentRefs = useRef<(HTMLElement | null)[]>([]);
  const hardikRefs = useRef<(HTMLElement | null)[]>([]);

  useGSAP(
    () => {
      if (!pinRef.current) return;

      if (reduced || !isDesktop) {
        parsed.forEach((statement, index) => {
          const stage = stageRefs.current[index];

          if (stage) {
            gsap.set(stage, {
              opacity: 1,
              position: "relative",
              inset: "auto",
              zIndex: "auto",
            });
          }

          gsap.set(
            [
              numberRefs.current[index],
              tagRefs.current[index],
              commentRefs.current[index],
              headingRefs.current[index],
              selectionRefs.current[index],
            ].filter(Boolean),
            { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, y: 0 }
          );

          gsap.set(hardikRefs.current[index], { opacity: 0 });

          const inner = innerRefs.current[index];
          if (inner) {
            writeText(
              inner,
              statement.segments,
              statement.plain,
              statement.plain.length,
              false
            );
          }
        });
        return;
      }

      parsed.forEach((_, index) => {
        const stage = stageRefs.current[index];
        const num = numberRefs.current[index];
        const tag = tagRefs.current[index];
        const selection = selectionRefs.current[index];
        const heading = headingRefs.current[index];
        const comment = commentRefs.current[index];
        const hardik = hardikRefs.current[index];

        if (stage) {
          gsap.set(stage, {
            opacity: index === 0 ? 1 : 0,
            position: "absolute",
            inset: 0,
            zIndex: index === 0 ? 10 : 0,
          });
        }

        gsap.set([num, tag, comment, hardik].filter(Boolean), {
          opacity: 0,
          y: 40,
        });

        if (selection) {
          gsap.set(selection, {
            opacity: 0,
            scaleX: 0,
            scaleY: 0.06,
            transformOrigin: "center center",
          });
        }

        if (heading) {
          gsap.set(heading, { opacity: 0 });
        }
      });

      const totalDur = parsed.length * config.stmtDur;
      const master = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: () => `+=${totalDur * window.innerHeight * 0.8}`,
          pin: true,
          scrub: config.scrub,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
        },
      });

      const lastWritten = new Array(parsed.length).fill(-1);

      buildStatementTimeline(
        master,
        parsed,
        {
          stages: stageRefs.current,
          numbers: numberRefs.current,
          tags: tagRefs.current,
          selections: selectionRefs.current,
          headings: headingRefs.current,
          inners: innerRefs.current,
          comments: commentRefs.current,
          hardiks: hardikRefs.current,
        },
        config,
        (index, amount) => {
          const next = Math.round(amount);
          if (next === lastWritten[index]) return;

          lastWritten[index] = next;
          const inner = innerRefs.current[index];
          if (inner) {
            writeText(inner, parsed[index].segments, parsed[index].plain, next, true);
          }
        },
        (index) => {
          lastWritten[index] = -1;
          const inner = innerRefs.current[index];
          if (inner) {
            writeText(inner, parsed[index].segments, parsed[index].plain, 0, true);
          }
        },
        (index) => {
          const inner = innerRefs.current[index];
          if (inner) {
            writeText(
              inner,
              parsed[index].segments,
              parsed[index].plain,
              parsed[index].plain.length,
              false
            );
          }
        }
      );
    },
    { scope: rootRef, dependencies: [parsed, reduced, config, isDesktop] }
  );

  return {
    rootRef,
    pinRef,
    stageRefs,
    numberRefs,
    tagRefs,
    selectionRefs,
    headingRefs,
    innerRefs,
    commentRefs,
    hardikRefs,
  };
}
