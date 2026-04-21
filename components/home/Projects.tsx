"use client";
import { useRef, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import gsap from "gsap";
import { AnimatedImage } from "../image";

const FALLBACK_PROJECTS = [
  {
    _id: "1",
    title: "Echo Live Messaging",
    tags: ["Next.js", "Socket.io", "Redis"],
    image: "https://picsum.photos/seed/echo/900/600",
    year: "2025",
    role: "Lead Engineer",
    size: "large",
    desc: "Real-time messaging platform with sub-50ms latency",
  },
  {
    _id: "2",
    title: "Campus Suite",
    tags: ["React", "PostgreSQL", "Node"],
    image: "https://picsum.photos/seed/campus/720/480",
    year: "2024",
    role: "Full-Stack",
    size: "medium",
    desc: "Unified campus management ecosystem",
  },
  {
    _id: "3",
    title: "Fluvo Tap & Go",
    tags: ["Next.js", "Redis", "Stripe"],
    image: "https://picsum.photos/seed/fluvo/720/480",
    year: "2024",
    role: "System Designer",
    size: "medium",
    desc: "Frictionless NFC payment infrastructure",
  },
  {
    _id: "4",
    title: "The Logic System",
    tags: ["Principles", "Brand", "Systems"],
    image: "https://picsum.photos/seed/logic/900/400",
    year: "2026",
    role: "Core Philosophy",
    size: "wide",
    desc: "Design system for the next decade of the web",
  },
];

function ProjectCard({ project, index }: { project: any; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const onEnter = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      gsap.to(el, {
        rotateY: x * 8,
        rotateX: -y * 5,
        scale: 1.01,
        transformPerspective: 1000,
        duration: 0.5,
        ease: "power2.out",
      });
    };
    const onLeave = () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, scale: 1, duration: 0.8, ease: "elastic.out(1,0.5)" });
    };
    el.addEventListener("mousemove", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => { el.removeEventListener("mousemove", onEnter); el.removeEventListener("mouseleave", onLeave); };
  }, []);

  const sizeClass: Record<string, string> = {
    large: "md:col-span-2 md:row-span-2 h-[480px] md:h-[640px]",
    medium: "md:col-span-1 md:row-span-1 h-[360px] md:h-[300px]",
    wide: "md:col-span-2 md:row-span-1 h-[280px] md:h-[300px]",
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`group relative overflow-hidden ${sizeClass[project.size] || "md:col-span-1 h-[300px]"}`}
      style={{
        borderRadius: "28px",
        border: "1px solid rgba(240,238,232,0.06)",
        transformStyle: "preserve-3d",
      }}
    >
      <Link href={project.href || "#"} className="block w-full h-full">
        {/* Image */}
        <div className="absolute inset-0 z-0">
          <AnimatedImage
            fill={true}
            src={project.image}
            alt={project.title}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)]/95 via-[var(--bg)]/30 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[var(--bg)]/50" />
        </div>

        {/* Glass hover shimmer */}
        <div className="absolute inset-0 z-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: "linear-gradient(135deg, rgba(200,241,53,0.04) 0%, transparent 50%)" }} />

        {/* Top row */}
        <div className="relative z-10 w-full p-6 flex justify-between items-start">
          <span className="px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider"
            style={{ background: "rgba(200,241,53,0.12)", border: "1px solid rgba(200,241,53,0.2)", color: "var(--accent)", fontFamily: "var(--font-cabinet)" }}>
            {project.year}
          </span>

          <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-400 group-hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
            }}>
            <span className="text-[var(--text-primary)]/70 group-hover:text-[var(--accent)] text-sm transition-colors">↗</span>
          </div>
        </div>

        {/* Bottom content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-6">
          {/* Glass pill: role */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3"
            style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.06)" }}>
            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--accent)]" style={{ fontFamily: "var(--font-cabinet)" }}>
              {project.role}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-[var(--text-primary)] leading-tight mb-2 tracking-tight"
            style={{ fontFamily: "var(--font-cabinet)" }}>
            {project.title}
          </h3>

          {project.desc && (
            <p className="text-[11px] text-[var(--text-primary)]/30 mb-3 leading-relaxed max-w-[300px] opacity-0 group-hover:opacity-100 transition-opacity duration-400"
              style={{ fontFamily: "var(--font-cabinet)" }}>
              {project.desc}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag: string) => (
              <span key={tag}
                className="text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md text-[var(--text-primary)]/35"
                style={{ border: "1px solid rgba(240,238,232,0.07)", fontFamily: "var(--font-cabinet)" }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function Projects({ projects }: { projects: any[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const auraY = useTransform(scrollYProgress, [0, 1], [-60, 60]);

  const sizes = ["large", "medium", "medium", "wide", "medium", "medium"];
  const displayProjects = (projects?.length > 0 ? projects : FALLBACK_PROJECTS).map((p, i) => ({
    ...p,
    size: p.size || sizes[i % sizes.length],
    tags: p.tags || ["Creative", "Development"],
    image: p.image || `https://picsum.photos/seed/${i}/720/480`,
    year: p.year || "2026",
    role: p.role || "Lead Developer",
  }));

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative py-28 md:py-40 px-6 overflow-hidden"
      style={{ background: "#070709" }}
    >
      {/* Noise grain */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.025]"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")", backgroundRepeat: "repeat", backgroundSize: "128px 128px" }} />

      {/* Ambient aura */}
      <motion.div style={{ y: auraY }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,241,53,0.04) 0%, transparent 70%)", filter: "blur(80px)" } as any} />

      <div className="max-w-[1440px] mx-auto relative z-10">

        {/* Section header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-5"
            >
              <span className="w-6 h-[1px] bg-[var(--accent)]/50" />
              <span className="text-[9px] font-black uppercase tracking-[0.5em] text-[var(--accent)]/50" style={{ fontFamily: "var(--font-cabinet)" }}>
                Case Studies
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl font-black leading-[0.85] tracking-[-0.04em] uppercase"
              style={{ fontFamily: "var(--font-cabinet)" }}
            >
              <span className="text-[var(--text-primary)]">Digital</span>
              <br />
              <span style={{ WebkitTextFillColor: "transparent", WebkitTextStroke: "1.5px rgba(240,238,232,0.2)" }}>
                Expeditions.
              </span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="hidden md:flex flex-col items-end gap-5"
          >
            <p className="text-sm text-[var(--text-primary)]/25 max-w-[280px] text-right leading-relaxed" style={{ fontFamily: "var(--font-cabinet)" }}>
              High-performance ecosystems bridging human curiosity and technical reality.
            </p>
            <Link href="/projects"
              className="group flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[var(--text-primary)]/40 hover:text-[var(--accent)] transition-colors duration-300 pb-1"
              style={{ borderBottom: "1px solid rgba(200,241,53,0.3)", fontFamily: "var(--font-cabinet)" }}>
              Full Collection
              <span className="group-hover:translate-x-0.5 transition-transform inline-block">↗</span>
            </Link>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {displayProjects.map((project, i) => (
            <ProjectCard key={project._id || i} project={project} index={i} />
          ))}

          {/* Philosophy Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="md:col-span-1 h-[300px] rounded-[28px] p-8 flex flex-col justify-between"
            style={{
              background: "rgba(200,241,53,0.04)",
              border: "1px solid rgba(200,241,53,0.1)",
              backdropFilter: "blur(20px)",
            }}
          >
            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-[var(--accent)]/50" style={{ fontFamily: "var(--font-cabinet)" }}>Philosophy</span>

            <div>
              <h4 className="text-xl font-black text-[var(--text-primary)] uppercase leading-tight tracking-[-0.02em] mb-3"
                style={{ fontFamily: "var(--font-cabinet)" }}>
                Performance<br />Over Polish.<br />Utility Over<br />Clutter.
              </h4>
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)]/20 group-hover:text-[var(--accent)] transition-colors" style={{ fontFamily: "var(--font-cabinet)" }}>
                  Core Philosophy
                </span>
                <span className="w-0 group-hover:w-8 h-[1px] bg-[var(--accent)] transition-all duration-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}