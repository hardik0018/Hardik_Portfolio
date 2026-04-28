import gsap from "gsap";
import { ParsedStatement, StatementsAnimConfig } from "@/types/statements";

interface TimelineRefs {
  stages: (HTMLElement | null)[];
  numbers: (HTMLElement | null)[];
  tags: (HTMLElement | null)[];
  selections: (HTMLElement | null)[];
  headings: (HTMLElement | null)[];
  inners: (HTMLElement | null)[];
  comments: (HTMLElement | null)[];
  hardiks: (HTMLElement | null)[];
}

/**
 * Builds the master GSAP timeline for the statements section.
 * Extracted into a pure factory function for testability and clarity.
 */
export function buildStatementTimeline(
  master: gsap.core.Timeline,
  parsed: ParsedStatement[],
  refs: TimelineRefs,
  config: StatementsAnimConfig,
  onTypewriterUpdate: (index: number, progress: number) => void,
  onTypewriterStart: (index: number) => void,
  onTypewriterComplete: (index: number) => void
) {
  const { stmtDur, typewriterDur } = config;

  parsed.forEach((_, i) => {
    const base = i * stmtDur;
    const stage = refs.stages[i];
    const num = refs.numbers[i];
    const tag = refs.tags[i];
    const sel = refs.selections[i];
    const head = refs.headings[i];
    const comment = refs.comments[i];
    const hardik = refs.hardiks[i];

    // Skip if crucial elements are missing
    if (!stage || !num || !tag || !sel || !head || !comment || !hardik) return;

    // 0. Stage crossfade
    if (i > 0 && refs.stages[i - 1]) {
      master.to(
        refs.stages[i - 1],
        { opacity: 0, duration: 0.15, ease: "none", zIndex: 0 },
        base
      );
    }
    master.to(
      stage,
      { opacity: 1, zIndex: 10, duration: 0.15, ease: "none" },
      base
    );

    // 1. Number badge
    master.fromTo(
      num,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
      base + 0.05
    );

    // 2. Label badge
    master.fromTo(
      tag,
      { opacity: 0, y: 32, scale: 0.92 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" },
      base + 0.15
    );

    // 3. Selection box
    master.fromTo(
      sel,
      { opacity: 0, scaleX: 0, scaleY: 0.06 },
      { opacity: 1, scaleX: 1, duration: 0.4, ease: "expo.out" },
      base + 0.35
    );
    master.to(sel, { scaleY: 1, duration: 0.35, ease: "back.out(1.4)" }, base + 0.65);

    // 4. Heading fades in
    master.fromTo(
      head,
      { opacity: 0 },
      { opacity: 1, duration: 0.2, ease: "none" },
      base + 0.7
    );

    // 5. Typewriter
    const counter = { n: 0 };
    master.to(
      counter,
      {
        n: parsed[i].plain.length,
        duration: typewriterDur,
        ease: "none",
        onStart: () => onTypewriterStart(i),
        onUpdate: () => onTypewriterUpdate(i, counter.n),
        onComplete: () => onTypewriterComplete(i)
      },
      base + 0.85
    );

    // 6. Comment badge
    master.fromTo(
      comment,
      { opacity: 0, y: 18, scale: 0.88 },
      { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2)" },
      base + 1.5
    );

    // 7. Hardik cursor
    master.fromTo(
      hardik,
      { opacity: 0, x: 50, y: 25 },
      { opacity: 1, x: 0, y: 0, duration: 0.45, ease: "power3.out" },
      base + 1.65
    );

    // 8. Exit choreography
    const exitAt = i < parsed.length - 1 ? base + 2.55 : base + 2.4;

    master.to(
      [num, tag, comment, hardik],
      {
        opacity: 0,
        y: -24,
        duration: 0.4,
        ease: "power2.in",
        stagger: 0.03,
      },
      exitAt
    );
    master.to(
      [head, sel],
      { opacity: 0, y: -8, duration: 0.35, ease: "power2.in" },
      exitAt + 0.05
    );

    if (i === parsed.length - 1) {
      master.to(stage, { opacity: 0, duration: 0.35, ease: "power2.in" }, exitAt + 0.35);
    }
  });
}
