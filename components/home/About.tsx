"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import AnimatedImage from "../image/AnimatedImage";

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: to,
      duration: 2.2,
      ease: "power3.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
      onUpdate() {
        if (ref.current) ref.current.textContent = Math.round(obj.val) + suffix;
      },
    });
  });
  return <span ref={ref}>0{suffix}</span>;
}

const STATS = [
  { val: 50, suffix: "+", label: "Projects Shipped", desc: "Production-grade" },
  { val: 4, suffix: "+", label: "Years in Practice", desc: "Deep expertise" },
  { val: 12, suffix: "ms", label: "Avg Response Time", desc: "Benchmark" },
  { val: 100, suffix: "%", label: "Client Satisfaction", desc: "Every time" },
];

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(".about-image-col", {
      opacity: 0,
      x: -40,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: ".about-image-col", start: "top 75%", once: true },
    });

    gsap.from(".about-text-item", {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".about-text", start: "top 75%", once: true },
    });

    gsap.from(".stat-card", {
      opacity: 0,
      y: 20,
      scale: 0.95,
      stagger: 0.1,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: ".stats-grid", start: "top 80%", once: true },
    });
  }, { scope: containerRef });

  return (
    <section
      id="about"
      ref={containerRef}
      className="relative py-28 md:py-40 px-6 overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Noise grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,241,53,0.03) 0%, transparent 70%)", filter: "blur(80px)" }} />

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section label */}
        <div className="flex items-center gap-3 mb-16">
          <span className="w-6 h-[1px] bg-[var(--accent)]/50" />
          <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[var(--accent)]/50" style={{ fontFamily: "var(--font-cabinet)" }}>
            The Builder
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-16 md:gap-24 items-start">

          {/* ── Image Column ────────────────────────────────────────── */}
          <div className="about-image-col relative">
            <div className="relative rounded-[28px] overflow-hidden aspect-[3/4]"
              style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
              <AnimatedImage
                fill={true}
                animationType="wave-reveal"
                src="./hero.webp"
                alt="Hardik Vatukiya"
                fillColor="var(--bg)"
                borderRadius={28}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/70 via-transparent to-transparent" />
            </div>

            {/* Floating glass card over image */}
            <div
              className="absolute -bottom-6 -right-4 md:-right-10 p-5 rounded-[20px]"
              style={{
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
                minWidth: "180px",
              }}
            >
              <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--accent)]/60 mb-2" style={{ fontFamily: "var(--font-cabinet)" }}>Currently at</p>
              <p className="text-sm font-black text-[var(--text-primary)]" style={{ fontFamily: "var(--font-cabinet)" }}>Trionn® Design</p>
              <p className="text-[10px] text-[var(--text-primary)]/30 mt-1" style={{ fontFamily: "var(--font-cabinet)" }}>Agency · Ahmedabad</p>
            </div>
          </div>

          {/* ── Text Column ─────────────────────────────────────────── */}
          <div className="about-text">
            <h2
              className="about-text-item text-4xl md:text-5xl lg:text-[3.8vw] leading-tight tracking-[-0.03em] mb-8 font-bold italic text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-fraunces)" }}
            >
              Obsessed with<br />detail.
            </h2>

            <p className="about-text-item text-base md:text-lg leading-relaxed mb-5 font-light"
              style={{ color: "rgba(240,238,232,0.4)", fontFamily: "var(--font-cabinet)" }}>
              I build things that feel <span className="text-[var(--text-primary)]">alive</span>.
              Not just functional interfaces, but experiences users remember —
              where every transition is intentional and every interaction has weight.
            </p>

            <p className="about-text-item text-base leading-relaxed mb-14 font-light"
              style={{ color: "rgba(240,238,232,0.25)", fontFamily: "var(--font-cabinet)" }}>
              Currently bridging the gap between design and engineering at{" "}
              <span className="text-[var(--accent)]">Trionn® Design Agency</span>.
              BCA graduate, Ahmedabad.
            </p>

            {/* Stats Grid */}
            <div className="stats-grid grid grid-cols-2 gap-3">
              {STATS.map((s, i) => (
                <div
                  key={s.label}
                  className="stat-card p-5 rounded-[20px] group cursor-default"
                  style={{
                    background: "rgba(255,255,255,0.02)",
                    backdropFilter: "blur(20px)",
                    WebkitBackdropFilter: "blur(20px)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "rgba(200,241,53,0.15)";
                    e.currentTarget.style.boxShadow = "0 0 30px rgba(200,241,53,0.05), inset 0 1px 0 rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                    e.currentTarget.style.boxShadow = "inset 0 1px 0 rgba(255,255,255,0.04)";
                  }}
                >
                  <div className="text-3xl md:text-4xl leading-none font-black mb-1 text-[var(--accent)]"
                    style={{ fontFamily: "var(--font-fraunces)" }}>
                    <AnimatedCounter to={s.val} suffix={s.suffix} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-[0.35em] text-[var(--text-primary)]/20 block mb-1" style={{ fontFamily: "var(--font-cabinet)" }}>
                    {s.label}
                  </span>
                  <span className="text-[9px] italic text-[var(--text-primary)]/12" style={{ fontFamily: "var(--font-cabinet)" }}>
                    {s.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}