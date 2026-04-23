"use client"

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import CursorSVG from "../CursorSVG";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// ─── Types ────────────────────────────────────────────────────────────────────

type Statement = {
  id: string;
  label: string;
  number: string;
  /** Wrap accent words in {curly braces} to render italic + highlight. */
  text: string;
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const STATEMENTS: Statement[] = [
  {
    id: "01",
    number: "01",
    label: "p / Statement 01",
    text: "I design for those who crave {clarity} without sacrificing {energy}.",
  },
  {
    id: "02",
    number: "02",
    label: "p / Statement 02",
    text: "Merging {precision with play} — disciplined structure electrified with bold creative.",
  },
  {
    id: "03",
    number: "03",
    label: "p / Statement 03",
    text: "Every pixel earns its place; every motion {tells a story}.",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduced;
}

function parseSegments(src: string) {
  const segs: { text: string; italic: boolean; start: number; end: number }[] = [];
  const re = /\{([^}]+)\}|([^{]+)/g;
  let m: RegExpExecArray | null;
  let cursor = 0;
  while ((m = re.exec(src)) !== null) {
    const t = m[1] ?? m[2] ?? "";
    segs.push({ text: t, italic: !!m[1], start: cursor, end: cursor + t.length });
    cursor += t.length;
  }
  return { segments: segs, plain: src.replace(/[{}]/g, "") };
}

// Render typed text without React state — write directly to DOM
function renderTypedText(
  container: HTMLElement,
  segments: { text: string; italic: boolean; start: number; end: number }[],
  plain: string,
  tLen: number,
  showCursor: boolean,
) {
  const nodes: Node[] = [];
  for (let k = 0; k < segments.length; k++) {
    const seg = segments[k];
    if (tLen <= seg.start) break;
    const visible = Math.min(seg.text.length, tLen - seg.start);
    const slice = seg.text.slice(0, visible);
    if (seg.italic) {
      const em = document.createElement("em");
      em.className = "italic text-[#E4FE9A] not-italic font-medium drop-shadow-[0_0_24px_rgba(228,254,154,0.35)]";
      em.textContent = slice;
      nodes.push(em);
    } else {
      nodes.push(document.createTextNode(slice));
    }
    if (visible < seg.text.length) break;
  }
  if (showCursor && tLen < plain.length) {
    const cursor = document.createElement("span");
    cursor.className = "inline-block w-[3px] h-[0.85em] ml-1.5 bg-primary align-middle animate-pulse";
    nodes.push(cursor);
  }
  // Batch DOM write
  container.replaceChildren(...nodes);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Statements() {
  const reduced = useReducedMotion();

  const root = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const headingRefs = useRef<(HTMLHeadingElement | null)[]>([]);
  const headingInnerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const selectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tagRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numberRefs = useRef<(HTMLDivElement | null)[]>([]);
  const commentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorHardikRefs = useRef<(HTMLDivElement | null)[]>([]);
  const cursorYouRef = useRef<HTMLDivElement>(null);
  const stageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const parsed = useMemo(
    () => STATEMENTS.map((s) => ({ ...parseSegments(s.text), label: s.label, number: s.number })),
    [],
  );

  // ─── Per-statement duration ────────────────────────────────────────────────
  // Tuned to feel natural: enough scroll to read each statement comfortably
  // without feeling sluggish.
  const STMT_DUR = 3.2;

  useGSAP(
    () => {
      const pin = pinRef.current!;

      // ── GPU compositing hints — set once, never toggled ──────────────────
      // Promotes layers upfront so browser doesn't create/destroy them per frame
      STATEMENTS.forEach((_, i) => {
        const stage = stageRefs.current[i];
        const sel = selectionRefs.current[i];
        const head = headingRefs.current[i];
        if (stage) stage.style.willChange = "opacity, transform";
        if (sel) sel.style.willChange = "transform, opacity";
        if (head) head.style.willChange = "opacity";
        [numberRefs, tagRefs, commentRefs, cursorHardikRefs].forEach((refs) => {
          const el = refs.current[i];
          if (el) el.style.willChange = "opacity, transform";
        });
      });

      // ── Initial states ────────────────────────────────────────────────────
      STATEMENTS.forEach((_, i) => {
        gsap.set(stageRefs.current[i], {
          opacity: i === 0 ? 1 : 0,
          position: "absolute",
          inset: 0,
          // Use transform-based z layering — avoids stacking context thrash
          zIndex: i === 0 ? 10 : 0,
        });
        gsap.set(
          [
            numberRefs.current[i],
            tagRefs.current[i],
            commentRefs.current[i],
            cursorHardikRefs.current[i],
          ],
          { opacity: 0, y: 40 },
        );
        // Use scaleX/scaleY only — no filter:blur on selection box (expensive)
        gsap.set(selectionRefs.current[i], {
          opacity: 0,
          scaleX: 0,
          scaleY: 0.06,
          transformOrigin: "center center",
        });
        gsap.set(headingRefs.current[i], { opacity: 0 });
      });

      // ── Reduced motion: skip all animations ──────────────────────────────
      if (reduced) {
        STATEMENTS.forEach((_, i) => {
          gsap.set(
            [
              numberRefs.current[i],
              tagRefs.current[i],
              commentRefs.current[i],
              cursorHardikRefs.current[i],
              headingRefs.current[i],
              selectionRefs.current[i],
            ],
            { opacity: 1, scale: 1, scaleX: 1, scaleY: 1, y: 0 },
          );
          const inner = headingInnerRefs.current[i];
          if (inner) {
            renderTypedText(inner, parsed[i].segments, parsed[i].plain, parsed[i].plain.length, false);
          }
        });
        return;
      }

      // ── "You" cursor ambient drift ────────────────────────────────────────
      // Gentle sine wave — cheap, no layout impact
      gsap.to(cursorYouRef.current, {
        x: "+=16",
        y: "-=10",
        duration: 4.5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // ── Master scroll-driven timeline ─────────────────────────────────────
      const totalDur = STATEMENTS.length * STMT_DUR;

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: pin,
          start: "top top",
          end: () => `+=${totalDur * window.innerHeight * 0.8}`,
          pin: true,
          // scrub: true (boolean) = immediate 1:1 mapping, smoother than scrub:1.5
          // Use scrub: 0.8 for a tight, responsive feel without lag
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          fastScrollEnd: true, // snap-settle after fast scroll
        },
      });

      // ── Build sub-timelines ───────────────────────────────────────────────
      STATEMENTS.forEach((_, i) => {
        const base = i * STMT_DUR;
        const stage = stageRefs.current[i]!;
        const num = numberRefs.current[i]!;
        const tag = tagRefs.current[i]!;
        const sel = selectionRefs.current[i]!;
        const head = headingRefs.current[i]!;
        const comment = commentRefs.current[i]!;
        const hardik = cursorHardikRefs.current[i]!;
        const inner = headingInnerRefs.current[i]!;
        const { segments, plain } = parsed[i];

        // 0. Stage crossfade — opacity only, no transform (cheaper layer op)
        if (i > 0) {
          master.to(
            stageRefs.current[i - 1]!,
            { opacity: 0, duration: 0.15, ease: "none", zIndex: 0 },
            base,
          );
        }
        master.to(
          stage,
          { opacity: 1, zIndex: 10, duration: 0.15, ease: "none" },
          base,
        );

        // 1. Number badge
        master.fromTo(
          num,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" },
          base + 0.05,
        );

        // 2. Label badge
        master.fromTo(
          tag,
          { opacity: 0, y: 32, scale: 0.92 },
          { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" },
          base + 0.15,
        );

        // 3. Selection box — width then height, no blur
        master.fromTo(
          sel,
          { opacity: 0, scaleX: 0, scaleY: 0.06 },
          { opacity: 1, scaleX: 1, duration: 0.4, ease: "expo.out" },
          base + 0.35,
        );
        master.to(sel, { scaleY: 1, duration: 0.35, ease: "back.out(1.4)" }, base + 0.65);

        // 4. Heading fades in
        master.fromTo(
          head,
          { opacity: 0 },
          { opacity: 1, duration: 0.2, ease: "none" },
          base + 0.7,
        );

        // 5. Typewriter — DOM writes, zero React renders
        const counter = { n: 0 };
        let lastWritten = -1;
        master.to(
          counter,
          {
            n: plain.length,
            duration: 1.0,
            ease: "none",
            onUpdate() {
              const next = Math.round(counter.n);
              // Skip if value hasn't changed — avoids redundant DOM writes
              if (next === lastWritten) return;
              lastWritten = next;
              if (inner) renderTypedText(inner, segments, plain, next, true);
            },
            onStart() {
              lastWritten = -1;
              if (inner) renderTypedText(inner, segments, plain, 0, true);
            },
            onComplete() {
              if (inner) renderTypedText(inner, segments, plain, plain.length, false);
            },
          },
          base + 0.85,
        );

        // 6. Comment badge
        master.fromTo(
          comment,
          { opacity: 0, y: 18, scale: 0.88 },
          { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "back.out(2)" },
          base + 1.5,
        );

        // 7. Hardik cursor
        master.fromTo(
          hardik,
          { opacity: 0, x: 50, y: 25 },
          { opacity: 1, x: 0, y: 0, duration: 0.45, ease: "power3.out" },
          base + 1.65,
        );

        // 8. Exit — translate only, NO filter:blur (triggers repaint on GPU)
        // Instead: slide up + fade, which stays on the compositor thread
        const exitAt = i < STATEMENTS.length - 1 ? base + 2.55 : base + 2.4;

        master.to(
          [num, tag, comment, hardik],
          {
            opacity: 0,
            y: -24,
            duration: 0.4,
            ease: "power2.in",
            stagger: 0.03,
          },
          exitAt,
        );
        master.to(
          [head, sel],
          { opacity: 0, y: -8, duration: 0.35, ease: "power2.in" },
          exitAt + 0.05,
        );

        // Last statement: fade entire stage so no flash before next section
        if (i === STATEMENTS.length - 1) {
          master.to(stage, { opacity: 0, duration: 0.35, ease: "power2.in" }, exitAt + 0.35);
        }
      });
    },
    { scope: root, dependencies: [parsed, reduced] },
  );

  // ─── Render ───────────────────────────────────────────────────────────────
  // headingInnerRefs spans are intentionally empty — content written by GSAP onUpdate
  return (
    <div ref={root} className="relative">
      <section
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-background text-foreground"
        aria-label="Statements — Hardik Vatukiya"
      >
        {/* Subtle grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right,currentColor 1px,transparent 1px),linear-gradient(to bottom,currentColor 1px,transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative z-10 h-full flex items-center justify-center">
          {STATEMENTS.map((s, i) => {
            const { plain } = parsed[i];

            return (
              <div
                key={s.id}
                ref={(el) => { stageRefs.current[i] = el; }}
                className="absolute inset-0 flex flex-col items-center justify-center px-6"
              >
                <div className="relative mx-auto flex max-w-5xl flex-col items-center">

                  {/* Badge: Number */}
                  <div
                    ref={(el) => { numberRefs.current[i] = el; }}
                    className={cn(
                      "mb-10 font-mono text-sm tracking-[0.25em] px-4 py-1 rounded-[4px]",
                      "bg-primary/10 text-primary border border-primary/20",
                    )}
                  >
                    {s.number}
                  </div>

                  {/* Selection box + text area */}
                  <div className="relative">

                    {/* Figma-style selection box */}
                    <div
                      ref={(el) => { selectionRefs.current[i] = el; }}
                      className="absolute -inset-x-10 -inset-y-8 rounded-xl border border-primary/30 bg-primary/[0.025]"
                    >
                      <div className="absolute -top-[4px] -left-[4px] w-[9px] h-[9px] bg-background border-[1.5px] border-primary rounded-[1px]" />
                      <div className="absolute -top-[4px] -right-[4px] w-[9px] h-[9px] bg-background border-[1.5px] border-primary rounded-[1px]" />
                      <div className="absolute -bottom-[4px] -left-[4px] w-[9px] h-[9px] bg-background border-[1.5px] border-primary rounded-[1px]" />
                      <div className="absolute -bottom-[4px] -right-[4px] w-[9px] h-[9px] bg-background border-[1.5px] border-primary rounded-[1px]" />
                      <div className="absolute top-1/2 -left-[4px] -translate-y-1/2 w-[7px] h-[7px] bg-background border-[1.5px] border-primary/50" />
                      <div className="absolute top-1/2 -right-[4px] -translate-y-1/2 w-[7px] h-[7px] bg-background border-[1.5px] border-primary/50" />
                    </div>

                    {/* Badge: Label */}
                    <div
                      ref={(el) => { tagRefs.current[i] = el; }}
                      className="absolute -top-14 left-0 flex items-center gap-2 rounded-sm bg-label-violet px-3 py-1.5 font-mono text-[11px] text-white shadow-lg"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                      {s.label}
                    </div>

                    {/* Main heading — sr-only for a11y, inner span written by GSAP */}
                    <h2
                      ref={(el) => { headingRefs.current[i] = el; }}
                      className="relative max-w-[22ch] text-center text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-7xl"
                    >
                      <span className="sr-only">{plain}</span>
                      <span
                        aria-hidden
                        ref={(el) => { headingInnerRefs.current[i] = el; }}
                        className="relative"
                      />
                    </h2>

                    {/* Badge: Comment */}
                    <div
                      ref={(el) => { commentRefs.current[i] = el; }}
                      className="absolute -bottom-14 right-0 flex items-center gap-2 rounded-sm bg-label-violet px-3 py-1.5 font-mono text-[11px] text-white shadow-lg"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
                      content ▸ editing…
                    </div>
                  </div>

                  {/* Hardik Vatukiya collaborative cursor */}
                  <div
                    ref={(el) => { cursorHardikRefs.current[i] = el; }}
                    className="pointer-events-none absolute right-[-18%] top-[72%] flex items-start gap-1.5 z-20"
                  >
                    <CursorSVG variant="hardik" size={22} />
                    <span className="mt-3.5 rounded-sm bg-label-violet px-2.5 py-0.5 font-mono text-[11px] text-white shadow-xl">
                      Hardik Vatukiya
                    </span>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}