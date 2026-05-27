"use client";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, memo, forwardRef } from "react";
import { ExternalLink } from "lucide-react";
import { urlFor } from "@/lib/sanity.image";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../ui/SectionHeader";

export interface SanityProject {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  year: string;
  tags: string[];
  src: Parameters<typeof urlFor>[0] & { alt?: string };
  github: string;
  url: string;
  color?: {
    hex: string;
  };
}

const GitHubIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const ProjectRow = memo(
  forwardRef<HTMLDivElement, {
    project: SanityProject;
    index: number;
    isActive: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  }>(
    ({ project, index, isActive, onMouseEnter, onMouseLeave }, ref) => {
      const router = useRouter();
      const imageUrl = project.src ? urlFor(project.src).width(1200).height(675).fit('crop').auto('format').url() : "";

      return (
        <div
          ref={ref}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("a")) return;
            if (project.slug) {
              router.push(`/projects/${project.slug}`);
            }
          }}
          className={cn(
            "group relative w-full border-t border-border transition-all duration-300 overflow-hidden cursor-pointer",
            isActive ? "text-background" : "text-foreground"
          )}
        >
          {/* Full-width active background */}
          <div
            className={cn(
              "absolute inset-0 -z-10 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]",
              isActive
                ? "bg-foreground translate-y-0"
                : "bg-foreground translate-y-full"
            )}
          />

          <div className="mx-auto px-6 md:px-12 w-full py-4 md:py-6">
            <div className="flex items-center justify-between gap-6">
              {/* Left — index + title + description */}
              <div className="flex items-center gap-6 md:gap-16 flex-1 min-w-0">
                {/* Number */}
                <div className="flex flex-col items-center min-w-[32px] md:min-w-[48px]">
                  <span
                    className={cn(
                      "text-[10px] md:text-sm font-mono opacity-60",
                      isActive ? "text-background" : "text-accent-primary"
                    )}
                  >
                    0{index + 1}
                  </span>
                </div>

                {/* Title + description */}
                <div className="flex flex-col gap-1 md:gap-2 flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-baseline md:gap-6">
                    <h3 className="text-[1.4rem] md:text-[2.8rem] font-normal tracking-tighter font-display uppercase leading-tight md:leading-none">
                      {project.title}
                    </h3>
                    <span className="text-xs md:text-xl font-normal opacity-60 italic truncate">
                      {project.description}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right — year (hidden on small mobile) */}
              <div className="hidden sm:flex items-center gap-4 shrink-0">
                <span
                  className={cn(
                    "text-xs font-mono opacity-40",
                    isActive ? "text-background" : "text-foreground"
                  )}
                >
                  {project.year}
                </span>
              </div>

              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center gap-4 shrink-0">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} GitHub`}
                    className={cn(
                      "w-10 h-10 border rounded-lg flex items-center justify-center transition-all duration-150 hover:scale-105",
                      isActive
                        ? "border-background/40 text-background hover:bg-background/10"
                        : "border-border text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <GitHubIcon className="w-4 h-4" />
                  </a>
                )}

                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} live site`}
                    className={cn(
                      "flex items-center gap-2 px-5 py-2.5 border rounded-xl text-[11px] font-semibold uppercase tracking-widest transition-all duration-150 hover:scale-105",
                      isActive
                        ? "border-background/40 text-background hover:bg-background/10"
                        : "border-border bg-background text-foreground hover:bg-foreground/5"
                    )}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Live
                  </a>
                )}
              </div>
            </div>

            {/* Mobile Expandable Content */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 24 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
                  className="lg:hidden w-full overflow-hidden"
                >
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tags?.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-[9px] border border-background/30 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm bg-background/10 text-background"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Image */}
                  {imageUrl && (
                    <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl mb-6">
                      <Image
                        src={imageUrl}
                        alt={`${project.title} project showcase — developed by Hardik Vatukiya`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 400px"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                    </div>
                  )}

                  {/* Mobile Actions */}
                  <div className="flex items-center gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 h-12 border border-background/40 rounded-xl text-[10px] font-bold uppercase tracking-widest text-background bg-background/10 active:scale-95 transition-transform"
                      >
                        <GitHubIcon className="w-4 h-4" />
                        GitHub
                      </a>
                    )}
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-[1.5] flex items-center justify-center gap-2 h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest bg-background text-foreground active:scale-95 transition-transform shadow-lg"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View Project
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop Tags (visible when active) */}
            <div
              className={cn(
                "hidden lg:flex flex-wrap gap-2 mt-4 transition-all duration-300",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
              )}
            >
              {project.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className="text-[10px] border border-background/30 px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-sm bg-background/10 text-background"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }
  )
);
ProjectRow.displayName = "ProjectRow";

export default function Projects({ initialData }: { initialData?: SanityProject[] }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showModal, setShowModal] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  const projects = initialData || [];

  useGSAP(
    () => {
      // Pin the Projects Title
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        pin: titleRef.current,
        pinSpacing: false,
      });

      // Mouse Move Tracking for Modal using quickTo for high performance
      let activeModalEl: HTMLDivElement | null = null;
      let xTo: ((val: number) => void) | null = null;
      let yTo: ((val: number) => void) | null = null;

      const moveModal = (e: MouseEvent) => {
        const el = modalRef.current;
        if (!el) {
          activeModalEl = null;
          xTo = null;
          yTo = null;
          return;
        }

        if (el !== activeModalEl) {
          activeModalEl = el;
          xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
          yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
        }

        if (xTo && yTo) {
          xTo(e.clientX);
          yTo(e.clientY);
        }
      };

      window.addEventListener("mousemove", moveModal);

      // Mobile only: Update Active Index based on scroll
      const mm = gsap.matchMedia();
      mm.add("(max-width: 1023px)", () => {
        projects.forEach((_, index) => {
          ScrollTrigger.create({
            trigger: rowsRef.current[index],
            start: "top 60%",
            end: "bottom 40%",
            onEnter: () => setActiveIndex(index),
            onEnterBack: () => setActiveIndex(index),
            onLeave: () => {
              if (index === projects.length - 1) setActiveIndex(-1);
            },
            onLeaveBack: () => {
              if (index === 0) setActiveIndex(-1);
            }
          });
        });
      });

      return () => {
        window.removeEventListener("mousemove", moveModal);
        mm.revert();
      };
    },
    { scope: containerRef, dependencies: [projects] }
  );

  const activeProject = projects[activeIndex];

  return (
    <div id="projects" ref={containerRef} className="relative z-30 bg-background overflow-visible pb-20">
      {/* Pinned Header */}
      <div ref={titleRef} className="w-full bg-background border-b border-border z-30 pt-5 md:pt-8 pb-2">
        <SectionHeader title="Projects" />
      </div>

      {/* Scrollable Project List */}
      <div className="flex flex-col relative">
        {projects.map((project, index) => (
          <ProjectRow
            key={project._id}
            ref={(el) => { rowsRef.current[index] = el; }}
            project={project}
            index={index}
            isActive={activeIndex === index}
            onMouseEnter={() => {
              setActiveIndex(index);
              setShowModal(true);
            }}
            onMouseLeave={() => {
              setActiveIndex(-1);
              setShowModal(false);
            }}
          />
        ))}
        <div className="border-t border-border" />
      </div>

      <AnimatePresence>
        {showModal && activeProject?.src && (
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.5, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 5 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none overflow-hidden rounded-xl shadow-[0_60px_120px_rgba(0,0,0,0.4)] z-[100] hidden lg:block -translate-x-1/2 -translate-y-1/2"
            style={{
              boxShadow: `0 60px 120px ${activeProject.color?.hex || '#000000'}55`,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                exit={{ clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.25, ease: [0.76, 0, 0.24, 1] }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={urlFor(activeProject.src).width(600).height(800).fit('crop').auto('format').url()}
                  alt={`${activeProject.title} project preview — developed by Hardik Vatukiya`}
                  fill
                  className="object-cover"
                  sizes="400px"
                  priority
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

                {/* Project info overlay */}
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-2xl font-normal tracking-tighter uppercase mb-3 font-display leading-none">
                    {activeProject.title}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProject.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] border border-white/30 px-2.5 py-1 rounded-md uppercase tracking-widest backdrop-blur-md bg-white/10"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
