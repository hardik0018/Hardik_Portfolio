"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, useScroll, useTransform } from "framer-motion";
import HeroScene from "../HeroScene";
import { AnimatedImage } from "../image";

/* ─── Magnetic Button ─────────────────────────────────────────────────── */
function MagneticBtn({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      const dist = Math.sqrt(x * x + y * y);
      if (dist < 120) {
        gsap.to(el, { x: x * 0.45, y: y * 0.45, duration: 0.4, ease: "power2.out" });
      }
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { window.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);
  return <a ref={ref} href={href} className={className}>{children}</a>;
}

/* ─── Floating Glass Card ─────────────────────────────────────────────── */
function GlassCard({ children, style, className = "" }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, { rotateY: x * 18, rotateX: -y * 12, transformPerspective: 800, duration: 0.5, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 1.2, ease: "elastic.out(1,0.5)" });
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);
  return (
    <div
      ref={ref}
      className={`absolute ${className}`}
      style={{
        background: "rgba(255,255,255,0.04)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        border: "1px solid rgba(255,255,255,0.09)",
        borderRadius: "20px",
        boxShadow: "0 8px 48px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
        transformStyle: "preserve-3d",
        cursor: "default",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 0.3 });

    // Noise overlay fade
    tl.from(".hero-noise", { opacity: 0, duration: 2, ease: "power2.inOut" }, 0)
      // Ambient orbs
      .from(".hero-orb", { scale: 0, opacity: 0, stagger: 0.2, duration: 2.5, ease: "power3.out" }, 0.1)
      // Image clip reveal
      .from(".hero-img-wrap", { clipPath: "inset(0% 0% 100% 0%)", duration: 1.6, ease: "expo.inOut" }, 0.4)
      // Heading characters
      .from(".hero-char", { y: "110%", opacity: 0, stagger: 0.03, duration: 1.1, ease: "expo.out" }, 0.5)
      // Sub elements
      .from(".hero-sub", { opacity: 0, y: 20, stagger: 0.1, duration: 0.9, ease: "power3.out" }, 1.1)
      // Glass cards stagger in
      .from(".glass-card-item", { opacity: 0, y: 30, scale: 0.9, stagger: 0.15, duration: 1.0, ease: "power3.out" }, 0.9)
      // Bottom ticker
      .from(".hero-ticker", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, 1.4);
  }, { scope: containerRef });

  const { scrollY } = useScroll();
  const imgY = useTransform(scrollY, [0, 800], [0, 140]);
  const textY = useTransform(scrollY, [0, 800], [0, -100]);
  const orbY = useTransform(scrollY, [0, 800], [0, 80]);

  const headline = "Digital\nSuperiority".split("");

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* ── Noise Grain Overlay ─────────────────────────────────────── */}
      <div className="hero-noise pointer-events-none absolute inset-0 z-30 opacity-[0.035]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px 128px", mixBlendMode: "overlay" }} />

      {/* ── Ambient Orbs ────────────────────────────────────────────── */}
      <motion.div style={{ y: orbY }} className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="hero-orb absolute top-[5%] left-[8%] w-[520px] h-[520px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(200,241,53,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="hero-orb absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(120,80,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }} />
        <div className="hero-orb absolute bottom-[10%] left-[30%] w-[600px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(200,241,53,0.04) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </motion.div>

      {/* ── Blueprint Grid ──────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0 opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(200,241,53,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(200,241,53,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

      {/* ── WebGL Scene ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-1 opacity-30">
        <HeroScene />
      </div>

      {/* ── Main Content ────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-[1440px] px-6 lg:px-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-20 pt-24 pb-16">

        {/* Left: Typography ─────────────────────────────────────────── */}
        <motion.div style={{ y: textY }} className="flex-1 order-2 lg:order-1 text-center lg:text-left">

          {/* Eyebrow */}
          <div className="hero-sub mb-6 inline-flex items-center gap-3 px-4 py-2 rounded-full"
            style={{ background: "rgba(200,241,53,0.07)", border: "1px solid rgba(200,241,53,0.15)" }}>
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_10px_var(--accent)]" />
            <span className="text-[10px] font-black uppercase tracking-[0.35em] text-[var(--accent)]">Available for Projects</span>
          </div>

          {/* Main Headline */}
          <div className="overflow-hidden mb-2">
            <h1
              className="text-[13vw] lg:text-[7.5vw] leading-[0.88] font-black uppercase tracking-[-0.04em] text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              {"Crafting".split("").map((c, i) => (
                <span key={i} className="hero-char inline-block italic font-light text-[0.58em] text-[var(--accent)]">
                  {c === " " ? "\u00A0" : c}
                </span>
              ))}
            </h1>
          </div>
          <div className="overflow-hidden mb-1">
            <h1
              className="text-[13vw] lg:text-[7.5vw] leading-[0.88] font-black uppercase tracking-[-0.04em] text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              {"Digital".split("").map((c, i) => (
                <span key={`d${i}`} className="hero-char inline-block">{c === " " ? "\u00A0" : c}</span>
              ))}
            </h1>
          </div>
          <div className="overflow-hidden mb-10">
            <h1
              className="text-[13vw] lg:text-[7.5vw] leading-[0.88] font-black uppercase tracking-[-0.04em]"
              style={{ fontFamily: "var(--font-cabinet)", WebkitTextFillColor: "transparent", WebkitTextStroke: "1.5px rgba(240,238,232,0.5)" }}
            >
              {"Superiority".split("").map((c, i) => (
                <span key={`s${i}`} className="hero-char inline-block">{c === " " ? "\u00A0" : c}</span>
              ))}
            </h1>
          </div>

          {/* Value pills */}
          <div className="hero-sub flex flex-wrap justify-center lg:justify-start gap-3 mb-10">
            {["Performance", "Precision", "Passion"].map((v, i) => (
              <span key={i} className="px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-primary)]/40 italic"
                style={{ border: "1px solid rgba(240,238,232,0.07)", background: "rgba(255,255,255,0.02)" }}>
                {v}
              </span>
            ))}
          </div>

          {/* Body copy */}
          <p className="hero-sub text-base md:text-lg text-[var(--text-primary)]/35 font-light leading-relaxed mb-10 max-w-md mx-auto lg:mx-0"
            style={{ fontFamily: "var(--font-cabinet)" }}>
            I architect high-performance digital ecosystems where{" "}
            <span className="text-[var(--text-primary)]">human authenticity</span> meets{" "}
            <span className="text-[var(--accent)]">technical rigor</span>.
          </p>

          {/* CTAs */}
          <div className="hero-sub flex flex-col sm:flex-row items-center gap-5 justify-center lg:justify-start">
            <MagneticBtn
              href="#work"
              className="group relative overflow-hidden px-9 py-4 rounded-xl font-black uppercase tracking-widest text-[11px] transition-all duration-300"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
                fontFamily: "var(--font-cabinet)",
                boxShadow: "0 0 40px rgba(200,241,53,0.2)",
              }}
            >
              <span className="relative z-10 flex items-center gap-2">Explore Work <span className="group-hover:translate-x-1 transition-transform inline-block">↗</span></span>
              <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            </MagneticBtn>

            <a href="#contact"
              className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)]/30 hover:text-[var(--accent)] transition-colors duration-300 border-b border-transparent hover:border-[var(--accent)] pb-0.5"
              style={{ fontFamily: "var(--font-cabinet)" }}>
              Let's Connect
            </a>
          </div>
        </motion.div>

        {/* Right: Image + Glass Cards ─────────────────────────────── */}
        <div className="flex-1 order-1 lg:order-2 w-full max-w-[480px] lg:max-w-none relative">
          <motion.div
            style={{ y: imgY }}
            className="hero-img-wrap relative aspect-[4/5] lg:aspect-[3/4] w-full rounded-[2.5rem] overflow-hidden group"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", transformStyle: "preserve-3d" } as any}
          >
            <AnimatedImage
              src="/hero.webp"
              alt="Hardik Vatukiya"
              animationType="wave-reveal"
              fill
              priority
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.02]"
            />
            {/* Gradient vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/80 via-[var(--bg)]/10 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg)]/20 to-transparent" />
          </motion.div>

          {/* Glass Card: Role */}
          <GlassCard className="glass-card-item top-8 -left-6 lg:-left-14 p-5" style={{ minWidth: "180px" }}>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--accent)] mb-1.5" style={{ fontFamily: "var(--font-cabinet)" }}>Role</p>
            <p className="text-sm font-black text-[var(--text-primary)]" style={{ fontFamily: "var(--font-cabinet)" }}>Full-Stack Engineer</p>
            <p className="text-[10px] text-[var(--text-primary)]/30 mt-1" style={{ fontFamily: "var(--font-cabinet)" }}>@ Trionn® Design</p>
          </GlassCard>

          {/* Glass Card: Location */}
          <GlassCard className="glass-card-item top-32 -right-4 lg:-right-10 p-5" style={{ minWidth: "160px" }}>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)]/30 mb-1.5" style={{ fontFamily: "var(--font-cabinet)" }}>Based In</p>
            <p className="text-sm font-black text-[var(--text-primary)]" style={{ fontFamily: "var(--font-cabinet)" }}>Ahmedabad, IN</p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="text-[10px]">🕐</span>
              <span className="text-[9px] text-[var(--text-primary)]/25" style={{ fontFamily: "var(--font-cabinet)" }}>IST +5:30</span>
            </div>
          </GlassCard>

          {/* Glass Card: Stats */}
          <GlassCard className="glass-card-item bottom-24 -left-4 lg:-left-12 p-5" style={{ minWidth: "200px" }}>
            <div className="flex gap-5">
              {[["50+", "Projects"], ["4+", "Years"]].map(([n, l]) => (
                <div key={l}>
                  <p className="text-2xl font-black text-[var(--accent)]" style={{ fontFamily: "var(--font-fraunces)" }}>{n}</p>
                  <p className="text-[9px] font-black uppercase tracking-wider text-[var(--text-primary)]/25" style={{ fontFamily: "var(--font-cabinet)" }}>{l}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Glass Card: Status pill at bottom */}
          <GlassCard className="glass-card-item bottom-6 left-1/2 -translate-x-1/2" style={{ padding: "12px 20px", whiteSpace: "nowrap" }}>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-primary)]/70" style={{ fontFamily: "var(--font-cabinet)" }}>Open to Strategic Projects</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* ── Bottom Ticker ─────────────────────────────────────────── */}
      <div className="hero-ticker absolute bottom-0 left-0 right-0 py-4 overflow-hidden z-20"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] gap-16">
          {[...Array(6)].map((_, i) =>
            ["Full-Stack", "WebGL", "GSAP", "Next.js", "Three.js", "TypeScript", "Node.js"].map((t, j) => (
              <span key={`${i}-${j}`} className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)]/15 flex items-center gap-8"
                style={{ fontFamily: "var(--font-cabinet)" }}>
                {t} <span className="text-[var(--accent)]/40">·</span>
              </span>
            ))
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}