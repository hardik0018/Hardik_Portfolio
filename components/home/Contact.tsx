"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

function MagneticBtn({ children, href, style }: { children: React.ReactNode; href: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      const dist = Math.sqrt(x * x + y * y);
      if (dist < 130) gsap.to(el, { x: x * 0.4, y: y * 0.4, duration: 0.4, ease: "power2.out" });
    };
    const onLeave = () => gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: "elastic.out(1,0.4)" });
    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => { window.removeEventListener("mousemove", onMove); el.removeEventListener("mouseleave", onLeave); };
  }, []);
  return <a ref={ref} href={href} style={style}>{children}</a>;
}

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  // 3D perspective tilt on mouse
  useEffect(() => {
    const el = headlineRef.current;
    const section = containerRef.current;
    if (!el || !section) return;

    const onMove = (e: MouseEvent) => {
      const r = section.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, {
        rotateY: x * 16,
        rotateX: -y * 8,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out",
      });
    };
    const onLeave = () => gsap.to(el, { rotateY: 0, rotateX: 0, duration: 1.2, ease: "elastic.out(1,0.4)" });
    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);
    return () => { section.removeEventListener("mousemove", onMove); section.removeEventListener("mouseleave", onLeave); };
  }, []);

  useGSAP(() => {
    gsap.from(".contact-item", {
      opacity: 0,
      y: 40,
      stagger: 0.12,
      duration: 1.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 70%",
        once: true,
      },
    });
  }, { scope: containerRef });

  return (
    <section
      id="contact"
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ background: "var(--bg)", paddingTop: "clamp(80px,12vw,180px)", paddingBottom: "clamp(80px,12vw,180px)" }}
    >
      {/* Noise grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* Grid lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: "linear-gradient(rgba(200,241,53,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(200,241,53,0.6) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }} />

      {/* Bottom ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,241,53,0.07) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* Center top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(200,241,53,0.04) 0%, transparent 70%)", filter: "blur(60px)" }} />

      {/* Top border */}
      <div className="absolute top-0 left-0 right-0 h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, rgba(200,241,53,0.15) 30%, rgba(200,241,53,0.15) 70%, transparent)" }} />

      <div className="max-w-6xl mx-auto px-6 text-center relative z-10">

        {/* Eyebrow */}
        <div className="contact-item inline-flex items-center gap-3 px-4 py-2 rounded-full mb-10"
          style={{ background: "rgba(200,241,53,0.05)", border: "1px solid rgba(200,241,53,0.12)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-pulse shadow-[0_0_8px_var(--accent)]" />
          <span className="text-[9px] font-black uppercase tracking-[0.45em] text-[var(--accent)]/70" style={{ fontFamily: "var(--font-cabinet)" }}>
            Start a Project
          </span>
        </div>

        {/* Main 3D Headline */}
        <h2
          ref={headlineRef}
          className="contact-item cursor-default"
          style={{
            fontFamily: "var(--font-fraunces)",
            fontWeight: 800,
            fontSize: "clamp(52px, 9vw, 130px)",
            lineHeight: 1.0,
            letterSpacing: "-0.04em",
            color: "var(--text-primary)",
            transformStyle: "preserve-3d",
            marginBottom: "clamp(48px, 8vw, 80px)",
          }}
        >
          Let's Build{" "}
          <span
            style={{
              WebkitTextFillColor: "transparent",
              WebkitTextStroke: "1.5px rgba(200,241,53,0.7)",
              display: "inline-block",
            }}
          >
            Together.
          </span>
        </h2>

        {/* Email link */}
        <div className="contact-item mb-10">
          <a
            href="mailto:hardikvatukiya0014@gmail.com"
            className="group inline-flex items-center gap-3 transition-all duration-300"
            style={{ color: "rgba(240,238,232,0.3)", fontFamily: "var(--font-cabinet)", fontWeight: 300, fontSize: "clamp(14px, 2vw, 22px)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,238,232,0.3)")}
          >
            <span
              className="border-b transition-all duration-400 pb-1"
              style={{ borderColor: "rgba(240,238,232,0.08)" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "rgba(240,238,232,0.08)")}
            >
              hardikvatukiya0014@gmail.com
            </span>
            <span style={{ color: "var(--accent)" }} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform inline-block">↗</span>
          </a>
        </div>

        {/* Magnetic CTA */}
        <div className="contact-item mb-20 flex justify-center">
          <MagneticBtn
            href="mailto:hardikvatukiya0014@gmail.com"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              padding: "18px 40px",
              borderRadius: "100px",
              background: "var(--accent)",
              color: "var(--bg)",
              fontFamily: "var(--font-cabinet)",
              fontWeight: 900,
              fontSize: "11px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              boxShadow: "0 0 60px rgba(200,241,53,0.25), 0 4px 20px rgba(0,0,0,0.3)",
              transition: "box-shadow 0.3s ease, transform 0.3s ease",
            }}
          >
            Get In Touch
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </MagneticBtn>
        </div>

        {/* Divider */}
        <div className="contact-item w-24 h-[1px] mx-auto mb-10"
          style={{ background: "rgba(255,255,255,0.06)" }} />

        {/* Social links */}
        <div className="contact-item flex justify-center gap-8 md:gap-12">
          {[
            { label: "GitHub", href: "https://github.com/hardik0018" },
            { label: "LinkedIn", href: "https://linkedin.com/in/hardik-vatukiya" },
            { label: "Instagram", href: "https://instagram.com/hardik_vatukiya_07" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 transition-colors duration-300"
              style={{ color: "rgba(240,238,232,0.2)", fontFamily: "var(--font-cabinet)" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(240,238,232,0.2)")}
            >
              <span className="text-[9px] font-black uppercase tracking-[0.45em]">{link.label}</span>
              <span className="w-0 group-hover:w-full h-[1px] bg-[var(--accent)] transition-all duration-400 opacity-50" />
            </a>
          ))}
        </div>

        {/* Footer credit */}
        <div className="contact-item mt-20 pt-10"
          style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)]/10" style={{ fontFamily: "var(--font-cabinet)" }}>
            © 2026 Hardik Vatukiya · Designed & Built with obsession
          </p>
        </div>
      </div>
    </section>
  );
}