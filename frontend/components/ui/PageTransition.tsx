"use client";

import { useRef, useState, useEffect } from "react";
import { gsap } from "@/lib/gsap";

// Number of vertical strips for the cloth-reveal animation
const STRIP_COUNT = 8;

export default function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const stripsRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const progressNumRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (!overlayRef.current) return;

    // ── 1. PROGRESS COUNTER (0 → 100 over ~2.2s) ──────────────────────────
    // Uses a proxy object so GSAP can tween a plain number and we update DOM directly
    const counter = { value: 0 };

    const progressTween = gsap.to(counter, {
      value: 100,
      duration: 2.2,
      ease: "power1.inOut",
      delay: 0.3,
      onUpdate() {
        const v = Math.round(counter.value);
        if (progressNumRef.current) {
          progressNumRef.current.textContent = `${v}`;
        }
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${v}%`;
        }
      },
    });

    // ── 2. CARD ENTRANCE  ──────────────────────────────────────────────────
    const cardTl = gsap.timeline({ delay: 0.05 });
    cardTl
      .fromTo(
        cardRef.current,
        { autoAlpha: 0, y: 28, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }
      )
      .fromTo(
        taglineRef.current,
        { autoAlpha: 0, y: 12 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.25"
      )
      .fromTo(
        dotsRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.3, ease: "power2.out" },
        "-=0.2"
      );

    // ── 3. CLOTH REVEAL (multi-strip sweep) — fires after progress hits 100 ──
    // Each strip slides upward with a staggered delay, like a fabric being
    // whisked off a car. The stagger creates the diagonal "wave" feel.
    const strips = stripsRef.current
      ? Array.from(stripsRef.current.children)
      : [];

    const revealTl = gsap.timeline({
      delay: 2.2 + 0.3 + 0.15, // wait until counter finishes + small pause
      onComplete: () => setMounted(false),
    });

    // First: flash the card out
    revealTl.to(cardRef.current, {
      autoAlpha: 0,
      y: -20,
      scale: 0.96,
      duration: 0.3,
      ease: "power2.in",
    });

    // Then strips sweep upward diagonally
    revealTl.to(
      strips,
      {
        yPercent: -105,
        duration: 0.85,
        ease: "power4.inOut",
        stagger: {
          amount: 0.3,
          from: "start",
        },
      },
      "-=0.05"
    );

    return () => {
      progressTween.kill();
      cardTl.kill();
      revealTl.kill();
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-9999 overflow-hidden"
      aria-hidden="true"
    >
      {/* ── CLOTH STRIPS (sit behind the card, cover full screen) ─────────── */}
      <div
        ref={stripsRef}
        className="absolute inset-0 flex pointer-events-none"
        aria-hidden="true"
      >
        {Array.from({ length: STRIP_COUNT }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: `0 0 ${100 / STRIP_COUNT}%`,
              height: "100%",
              backgroundColor:
                i % 2 === 0 ? "var(--foreground)" : "var(--background)",
              // Slight hue variety using the theme's secondary bg on even strips
              // avoids a totally flat curtain
            }}
          />
        ))}
      </div>

      {/* ── LOADING CARD (sits above the strips) ────────────────────────── */}
      <div
        ref={cardRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--foreground)",
          visibility: "hidden", // GSAP fromTo sets this via autoAlpha
        }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(to right,rgba(255,255,255,0.03) 1px,transparent 1px)," +
              "linear-gradient(to bottom,rgba(255,255,255,0.03) 1px,transparent 1px)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />

        {/* Accent glow blob */}
        <div
          style={{
            position: "absolute",
            width: "520px",
            height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, var(--accent-primary) 0%, transparent 70%)",
            opacity: 0.07,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        />

        {/* Card content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            padding: "3rem 4rem",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.02)",
            backdropFilter: "blur(4px)",
            minWidth: "min(420px, 90vw)",
          }}
        >
          {/* Name / Brand */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: "var(--font-display, serif)",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "var(--background)",
                lineHeight: 1,
              }}
            >
              Hardik
            </div>
            <div
              style={{
                fontFamily: "var(--font-display, serif)",
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 900,
                letterSpacing: "-0.03em",
                color: "var(--accent-lime, #c1ff4a)",
                lineHeight: 1,
              }}
            >
              Vatukiya
            </div>
          </div>

          {/* Tagline */}
          <div
            ref={taglineRef}
            style={{
              visibility: "hidden",
              fontFamily: "var(--font-sans, system-ui)",
              fontSize: "0.75rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--text-muted)",
            }}
          >
            Full‑Stack Developer · Portfolio
          </div>

          {/* Progress bar area */}
          <div style={{ width: "100%" }}>
            {/* Track */}
            <div
              style={{
                width: "100%",
                height: "2px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              {/* Fill */}
              <div
                ref={progressBarRef}
                style={{
                  width: "0%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, var(--accent-primary), var(--accent-lime, #c1ff4a))",
                  borderRadius: "999px",
                  transition: "none",
                }}
              />
            </div>

            {/* Counter row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginTop: "0.6rem",
              }}
            >
              <div
                ref={dotsRef}
                style={{
                  visibility: "hidden",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <AnimatingDot delay={0} />
                <AnimatingDot delay={0.2} />
                <AnimatingDot delay={0.4} />
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "2px",
                  fontFamily: "var(--font-mono, monospace)",
                }}
              >
                <span
                  ref={progressNumRef}
                  style={{
                    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                    fontWeight: 700,
                    color: "var(--background)",
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    letterSpacing: "-0.04em",
                  }}
                >
                  0
                </span>
                <span
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    fontWeight: 400,
                  }}
                >
                  %
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── tiny inline animated dot ────────────────────────────────────────────────
function AnimatingDot({ delay }: { delay: number }) {
  const dotRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!dotRef.current) return undefined;
    const tween = gsap.to(dotRef.current, {
      autoAlpha: 0.2,
      yoyo: true,
      repeat: -1,
      duration: 0.5,
      ease: "power1.inOut",
      delay,
    });
    return () => { tween.kill(); };
  }, [delay]);

  return (
    <span
      ref={dotRef}
      style={{
        display: "inline-block",
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        backgroundColor: "var(--accent-primary)",
      }}
    />
  );
}
