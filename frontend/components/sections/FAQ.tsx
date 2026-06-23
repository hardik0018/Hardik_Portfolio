"use client";

import React, { useRef, useState, useCallback } from "react";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import type { FAQData } from "@/lib/sanity.loader";
import { cn } from "@/lib/utils";
import { Plus, Minus, HelpCircle } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  initialData?: FAQData;
}

// ─── Default FAQ data ─────────────────────────────────────────────────────────

const DEFAULT_ITEMS: FAQItem[] = [
  {
    question: "Who are you and what do you build?",
    answer:
      "I'm Hardik Vatukiya — a full-stack developer and UI engineer specialising in high-performance, animation-rich web experiences. I bridge the gap between design precision and engineering quality.",
  },
  {
    question: "Are you available for freelance projects?",
    answer:
      "Yes — selectively. I work with startups and product teams to build polished digital products. Reach out through the contact section with your project idea and we'll figure out the fit.",
  },
  {
    question: "What does your development process look like?",
    answer:
      "Research → Wireframe → Prototype → Build → Polish. I prefer async collaboration via Notion and Figma with weekly milestone check-ins so there are no surprises at the end.",
  },
  {
    question: "What is your primary tech stack?",
    answer:
      "Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP 3, Framer Motion, and Sanity v5. I'm stack-agnostic and comfortable jumping into new tooling when the project calls for it.",
  },
  {
    question: "How long does a typical project take?",
    answer:
      "A polished landing page takes 1–2 weeks. A full-stack product with auth, CMS, and custom animations typically runs 4–8 weeks, depending on scope and feedback speed.",
  },
  {
    question: "Can you work from a Figma file or do you handle design too?",
    answer:
      "Both. I can execute faithfully from a Figma file, or take complete ownership of the visual direction — typography, spacing, colour, and motion — entirely from scratch.",
  },
  {
    question: "What makes your work different from other developers?",
    answer:
      "I treat motion as a first-class design tool, not an afterthought. Every animation I write earns its place by guiding attention, communicating system state, or reinforcing brand identity.",
  },
  {
    question: "How do I get started working with you?",
    answer:
      "Use the contact form below. Share your project idea, rough timeline, and budget range. I'll reply within 24 hours with an initial assessment and clear next steps.",
  },
];

// ─── Bento grid layout ────────────────────────────────────────────────────────
// 3-column grid on lg, 2-column on sm, 1-column on xs
// Pattern: wide(2col) | narrow(1col) | narrow(1col) | featured(2col) | narrow | wide | narrow | narrow

type CardSize = "wide" | "narrow" | "featured";

const CARD_SIZES: CardSize[] = [
  "wide",     // 0
  "narrow",   // 1
  "narrow",   // 2
  "featured", // 3 — dark hero card
  "narrow",   // 4
  "wide",     // 5
  "narrow",   // 6
  "narrow",   // 7
];

// ─── 3D Tilt Hook ─────────────────────────────────────────────────────────────

function useCardTilt(
  ref: React.RefObject<HTMLDivElement | null>,
  intensity = 8
) {
  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;
      const r  = el.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      el.style.setProperty("--glow-x", `${(mx / r.width)  * 100}%`);
      el.style.setProperty("--glow-y", `${(my / r.height) * 100}%`);
      gsap.to(el, {
        rotateX: -((my / r.height) - 0.5) * intensity,
        rotateY:  ((mx / r.width)  - 0.5) * intensity,
        duration: 0.4,
        ease: "power2.out",
        transformPerspective: 900,
      });
    },
    [ref, intensity]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: "power3.out",
    });
  }, [ref]);

  return { onMouseMove, onMouseLeave };
}

// ─── Bento Card ───────────────────────────────────────────────────────────────

function BentoCard({
  item,
  size,
  index,
}: {
  item: FAQItem;
  size: CardSize;
  index: number;
}) {
  const isFeatured = size === "featured";
  const [open, setOpen] = useState(isFeatured);

  const cardRef   = useRef<HTMLDivElement>(null);
  const answerRef = useRef<HTMLDivElement>(null);

  const { onMouseMove, onMouseLeave } = useCardTilt(
    cardRef,
    isFeatured ? 4 : 7
  );

  // GSAP accordion — owns height + opacity, never uses CSS 'hidden'
  const toggle = useCallback(() => {
    const el = answerRef.current;
    if (!el) return;

    if (!open) {
      gsap.set(el, { visibility: "visible", overflow: "hidden" });
      const fullH = el.scrollHeight;
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        {
          height: fullH,
          opacity: 1,
          duration: 0.44,
          ease: "power3.out",
          onComplete: () => gsap.set(el, { height: "auto" }),
        }
      );
    } else {
      gsap.to(el, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power3.in",
        onComplete: () => gsap.set(el, { visibility: "hidden" }),
      });
    }
    setOpen((p) => !p);
  }, [open]);

  // Index badge e.g. "01", "02"…
  const badge = String(index + 1).padStart(2, "0");

  return (
    <div
      ref={cardRef}
      className={cn(
        "faq-bento-card group relative overflow-hidden rounded-2xl border cursor-pointer select-none h-full",
        "transition-colors duration-300",
        isFeatured
          ? "bg-[#0a0a0a] border-white/[0.07]"
          : "bg-card-bg border-border/60 hover:border-[#008f51]/40"
      )}
      style={{ transformStyle: "preserve-3d" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={toggle}
      role="button"
      tabIndex={0}
      aria-expanded={open}
      onKeyDown={(e) =>
        (e.key === "Enter" || e.key === " ") && toggle()
      }
    >
      {/* Cursor-tracked radial glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl z-0"
        style={{
          background: `radial-gradient(220px circle at var(--glow-x,50%) var(--glow-y,50%), ${
            isFeatured
              ? "rgba(193,255,74,0.09)"
              : "rgba(0,143,81,0.07)"
          }, transparent 70%)`,
        }}
      />

      {/* Lime top-strip — featured card only */}
      {isFeatured && (
        <div
          aria-hidden="true"
          className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#c1ff4a] to-transparent z-10"
        />
      )}

      {/* Content */}
      <div className="relative z-10 p-5 sm:p-6 h-full flex flex-col gap-3">

        {/* Row: index number + toggle */}
        <div className="flex items-center justify-between gap-2">
          <span
            className={cn(
              "font-mono text-xs font-medium tabular-nums leading-none",
              isFeatured ? "text-[#c1ff4a]" : "text-[#008f51]"
            )}
          >
            {badge}
          </span>

          <div
            className={cn(
              "flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 shrink-0",
              isFeatured
                ? "border-white/20 text-white group-hover:border-[#c1ff4a] group-hover:text-[#c1ff4a]"
                : "border-border text-foreground/60 group-hover:border-[#008f51] group-hover:text-[#008f51]"
            )}
          >
            {open ? <Minus size={11} /> : <Plus size={11} />}
          </div>
        </div>

        {/* Question */}
        <h3
          className={cn(
            "font-display leading-[1.2] tracking-tight",
            isFeatured
              ? "text-[1.35rem] sm:text-[1.6rem] text-white"
              : size === "wide"
              ? "text-[1.05rem] sm:text-[1.2rem] text-foreground"
              : "text-[0.96rem] sm:text-[1.05rem] text-foreground"
          )}
        >
          {item.question}
        </h3>

        {/* Thin divider — visible when collapsed */}
        {!open && (
          <div
            className={cn(
              "h-px mt-auto",
              isFeatured ? "bg-white/[0.08]" : "bg-border"
            )}
          />
        )}

        {/* Answer — GSAP controls height/opacity */}
        <div
          ref={answerRef}
          style={{
            height:     open ? "auto" : 0,
            opacity:    open ? 1      : 0,
            overflow:   "hidden",
            visibility: open ? "visible" : "hidden",
          }}
          aria-hidden={!open}
        >
          <p
            className={cn(
              "font-sans text-sm leading-relaxed",
              isFeatured ? "text-white/65" : "text-text-muted"
            )}
          >
            {item.answer}
          </p>

          {isFeatured && (
            <div className="mt-5 inline-flex items-center gap-2 text-[#c1ff4a] text-xs font-semibold font-sans">
              <HelpCircle size={11} />
              Have more questions? Let&apos;s chat →
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function FAQ({ initialData }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const gridRef    = useRef<HTMLDivElement>(null);

  const items    = initialData?.items?.length ? initialData.items : DEFAULT_ITEMS;
  const title    = initialData?.title || "Frequently Asked Questions";
  const subtitle = initialData?.subtitle;

  // ── GSAP scroll-reveal ────────────────────────────────────────────────────
  useGSAP(
    () => {
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* Header */
      if (headerRef.current) {
        if (reduced) {
          gsap.set(headerRef.current, { autoAlpha: 1, y: 0 });
        } else {
          gsap.set(headerRef.current, { autoAlpha: 0, y: 36 });
          ScrollTrigger.create({
            trigger: headerRef.current,
            start: "top 88%",
            onEnter: () =>
              gsap.to(headerRef.current, {
                autoAlpha: 1,
                y: 0,
                duration: 0.85,
                ease: "power3.out",
              }),
          });
        }
      }

      /* Bento cards stagger */
      const cards = gridRef.current?.querySelectorAll(".faq-bento-card");
      if (!cards?.length) return;

      if (reduced) {
        gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });
      } else {
        gsap.set(cards, { autoAlpha: 0, y: 36, scale: 0.97 });
        ScrollTrigger.create({
          trigger: gridRef.current,
          start: "top 85%",
          onEnter: () =>
            gsap.to(cards, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              ease: "power3.out",
              stagger: { amount: 0.5, from: "start" },
            }),
        });
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="faq"
      aria-label="Frequently Asked Questions"
      className="relative w-full overflow-hidden bg-background py-10 sm:py-14"
    >
      {/* Subtle dot-grid background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(0,0,0,0.04) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Ambient glow top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(0,143,81,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-5 sm:px-8">

        {/* ── Header ── */}
        <div ref={headerRef} className="mb-12 sm:mb-14">
            <SectionHeader title={title} subtitle={subtitle}/>

        
        </div>

        {/* ── Bento Grid ── */}
        {/*
          Layout on lg (3 cols):
            Row 1: [wide=2] [narrow=1]  → items 0,1
            Row 2: [narrow=1] [featured=2] → items 2,3
            Row 3: [wide=2] [narrow=1]  → items 4,5  (wait — wide is 2, narrow is 1 = 3 total ✓)
            Row 4: [narrow=1] [narrow=1] [narrow=1] → items 6,7 (only 2 items left, fills 2 cols)

          sm (2 cols): wide = col-span-2, narrow = col-span-1, featured = col-span-2
          xs (1 col): all full width
        */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          role="list"
          aria-label="FAQ items"
        >
          {items.slice(0, 8).map((item, i) => {
            const size = CARD_SIZES[i] ?? "narrow";

            // Column span classes applied directly on the card's outer wrapper
            const colSpan = cn(
              // mobile: always full width (grid-cols-1 handles it)
              // sm: wide/featured → 2 cols, narrow → 1 col
              size === "wide" || size === "featured"
                ? "sm:col-span-2"
                : "sm:col-span-1",
              // lg: wide/featured → 2 cols, narrow → 1 col
              size === "wide" || size === "featured"
                ? "lg:col-span-2"
                : "lg:col-span-1"
            );

            return (
              <div key={i} className={colSpan} role="listitem">
                <BentoCard item={item} size={size} index={i} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
