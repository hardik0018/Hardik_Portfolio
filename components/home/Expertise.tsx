"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";

const SKILLS = [
  {
    title: "WebGL / Three.js",
    desc: "Immersive 3D experiences and GPU-powered canvas animations that run at 60fps across all devices.",
    level: "Advanced",
    tag: "Rendering",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 2L26 8.5V19.5L14 26L2 19.5V8.5L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M14 2V26M2 8.5L26 19.5M26 8.5L2 19.5" stroke="currentColor" strokeWidth="0.75" strokeOpacity="0.3" />
      </svg>
    ),
    color: "rgba(200,241,53,1)",
    colorBg: "rgba(200,241,53,0.06)",
  },
  {
    title: "GSAP + ScrollTrigger",
    desc: "Scroll-driven timelines, SplitText reveals, and physics-based motion with frame-perfect precision.",
    level: "Advanced",
    tag: "Animation",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 14L12.5 10L16 14L19 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    color: "rgba(200,241,53,1)",
    colorBg: "rgba(200,241,53,0.06)",
  },
  {
    title: "React / Next.js",
    desc: "Full-stack apps with React Server Components, streaming, and consistently sub-second page loads.",
    level: "Expert",
    tag: "Framework",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path d="M14 14C14 14 8 8 4 10C2 11 2 14 4 16C6 18 10 17 14 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 14C14 14 20 20 24 18C26 17 26 14 24 12C22 10 18 11 14 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M14 14C14 14 8 20 10 24C11 26 14 26 16 24C18 22 17 18 14 14Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="14" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
    color: "rgba(120,180,255,1)",
    colorBg: "rgba(120,180,255,0.06)",
  },
  {
    title: "TypeScript",
    desc: "Type-safe codebases with zero runtime errors in production and airtight team collaboration.",
    level: "Advanced",
    tag: "Language",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="3" width="22" height="22" rx="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 11H19M14 11V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: "rgba(100,160,255,1)",
    colorBg: "rgba(100,160,255,0.06)",
  },
  {
    title: "Node.js / Express",
    desc: "REST APIs, WebSocket servers, and background job processing built for scale and resilience.",
    level: "Advanced",
    tag: "Backend",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 7V14L19 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    color: "rgba(80,220,120,1)",
    colorBg: "rgba(80,220,120,0.06)",
  },
  {
    title: "UI Engineering",
    desc: "Pixel-perfect implementation of complex design systems — bridging design intent and technical reality.",
    level: "Expert",
    tag: "Craft",
    icon: (
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <rect x="3" y="6" width="22" height="16" rx="3" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="8" cy="10" r="1.5" fill="currentColor" />
        <path d="M12 10H22M12 14H18M12 18H20" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />
      </svg>
    ),
    color: "rgba(255,160,80,1)",
    colorBg: "rgba(255,160,80,0.06)",
  },
];

export default function Expertise() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!trackRef.current || !sectionRef.current) return;
    const track = trackRef.current;
    ScrollTrigger.refresh();
    const totalScrollWidth = track.scrollWidth - (track.parentElement?.offsetWidth || window.innerWidth);
    if (totalScrollWidth <= 0) return;

    gsap.to(track, {
      x: -totalScrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top top",
        end: `+=${totalScrollWidth + 600}`,
        scrub: 1.2,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });

    gsap.from(".skill-card", {
      opacity: 0,
      y: 50,
      scale: 0.95,
      stagger: 0.07,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        once: true,
      },
    });
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="services"
      className="overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Noise grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02] z-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="h-screen flex flex-col justify-center relative z-10">

        {/* Header */}
        <div className="px-6 md:px-14 mb-14 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="w-6 h-[1px]" style={{ background: "rgba(200,241,53,0.5)" }} />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[var(--accent)]/50" style={{ fontFamily: "var(--font-cabinet)" }}>
                Services & Skills
              </span>
            </div>
            <h2
              className="text-5xl md:text-7xl lg:text-[7vw] leading-none tracking-[-0.04em] font-black"
              style={{ fontFamily: "var(--font-fraunces)", color: "var(--text-primary)" }}
            >
              The Stack.
            </h2>
          </div>

          <div className="hidden md:flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6H10M7 3L10 6L7 9" stroke="rgba(240,238,232,0.3)" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-[var(--text-primary)]/25" style={{ fontFamily: "var(--font-cabinet)" }}>
                Scroll to explore
              </span>
            </div>
          </div>
        </div>

        {/* Scrolling Track */}
        <div
          ref={trackRef}
          className="flex gap-4 will-change-transform"
          style={{ paddingLeft: "clamp(24px, 4vw, 56px)", paddingRight: "80px" }}
        >
          {SKILLS.map((skill, i) => (
            <div
              key={skill.title}
              className="skill-card group shrink-0 flex flex-col justify-between rounded-[24px] p-7 cursor-default"
              style={{
                width: "clamp(280px, 26vw, 340px)",
                height: "370px",
                background: "rgba(255,255,255,0.025)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255,255,255,0.07)",
                boxShadow: "0 4px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)",
                transition: "transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                gsap.to(el, { y: -8, scale: 1.02, duration: 0.4, ease: "power2.out" });
                el.style.borderColor = `${skill.color}20`;
                el.style.boxShadow = `0 20px 60px rgba(0,0,0,0.3), 0 0 40px ${skill.color}08, inset 0 1px 0 rgba(255,255,255,0.08)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                gsap.to(el, { y: 0, scale: 1, duration: 0.6, ease: "elastic.out(1,0.5)" });
                el.style.borderColor = "rgba(255,255,255,0.07)";
                el.style.boxShadow = "0 4px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)";
              }}
            >
              {/* Top */}
              <div className="flex items-start justify-between">
                <div className="p-2.5 rounded-xl" style={{ background: skill.colorBg, color: skill.color }}>
                  {skill.icon}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider"
                    style={{ background: `${skill.color}12`, color: skill.color, border: `1px solid ${skill.color}20`, fontFamily: "var(--font-cabinet)" }}>
                    {skill.level}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-[var(--text-primary)]/15"
                    style={{ border: "1px solid rgba(240,238,232,0.07)", fontFamily: "var(--font-cabinet)" }}>
                    {skill.tag}
                  </span>
                </div>
              </div>

              {/* Middle: Title + Desc */}
              <div>
                <h3 className="text-xl leading-tight mb-3 font-black text-[var(--text-primary)] tracking-[-0.02em]"
                  style={{ fontFamily: "var(--font-fraunces)" }}>
                  {skill.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-[var(--text-primary)]/35 font-light" style={{ fontFamily: "var(--font-cabinet)" }}>
                  {skill.desc}
                </p>
              </div>

              {/* Bottom: Number + progress */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--text-primary)]/12" style={{ fontFamily: "var(--font-cabinet)" }}>
                  {String(i + 1).padStart(2, "0")} / {String(SKILLS.length).padStart(2, "0")}
                </span>
                {/* Mini progress bar */}
                <div className="w-16 h-[2px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${((i + 1) / SKILLS.length) * 100}%`, background: skill.color, opacity: 0.5 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}