"use client";

import React from "react";
import Image from "next/image";
import TransitionLink from "@/components/ui/TransitionLink";
import { ExternalLink } from "lucide-react";
import FlowArt, { FlowSection } from "@/components/ui/story-scroll";
import { Button } from "@/components/ui/Button";
import { urlFor } from "@/lib/sanity.image";
import type { SanityProject } from "./Projects";

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

export default function ProjectsShowcase({
  initialData,
}: {
  initialData?: SanityProject[];
}) {
  const projects = initialData || [];

  // Theme-aligned color palettes mapping to overall design
  const themePalettes = [
    { bg: "var(--foreground)", text: "var(--background)", border: "border-white/20" },
    { bg: "var(--background)", text: "var(--foreground)", border: "border-black/10" },
    { bg: "var(--accent-primary)", text: "var(--background)", border: "border-white/20" },
    { bg: "var(--bg-secondary)", text: "var(--foreground)", border: "border-black/10" },
    { bg: "var(--accent-secondary)", text: "var(--background)", border: "border-white/20" },
  ];

  return (
    <div className="bg-background">
      <div className="px-6 md:px-12 py-10 md:py-16">
        <div className="font-display font-normal uppercase tracking-tight leading-none text-foreground">
          <span className="text-[3.5rem] sm:text-[5rem] md:text-[6.5rem] lg:text-[8rem] block">
            Projects
          </span>
        </div>
      </div>
      <FlowArt aria-label="Projects Showcase">
        {projects.map((project, index) => {
          const imageUrl = project.src
            ? urlFor(project.src).width(1200).height(800).fit("crop").auto("format").url()
            : "";

          const palette = themePalettes[index % themePalettes.length];
          const isDark = index % 2 === 0;

          // Ambient blob colors matching each card's aesthetic
          const blobGradients = [
            "from-purple-500/20 to-emerald-500/10",
            "from-blue-500/10 to-orange-500/10",
            "from-emerald-500/20 to-lime-500/10",
            "from-rose-500/10 to-cyan-500/10",
            "from-indigo-500/20 to-pink-500/10",
          ];

          return (
            <FlowSection
              key={project._id}
              aria-label={project.title}
              style={{
                backgroundColor: palette.bg,
                color: palette.text,
                // Store colors as local variables to dynamically reference in children
                "--local-bg": palette.bg,
                "--local-fg": palette.text,
              } as React.CSSProperties}
            >
              {/* Premium Background Ambient Blobs */}
              <div
                className={`absolute top-[10%] left-[10%] w-[50vw] h-[50vw] rounded-full bg-linear-to-tr ${blobGradients[index % blobGradients.length]} blur-[100px] pointer-events-none opacity-50`}
                aria-hidden="true"
              />
              <div
                className={`absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-linear-to-br ${blobGradients[(index + 1) % blobGradients.length]} blur-[120px] pointer-events-none opacity-40`}
                aria-hidden="true"
              />

              {/* Header metadata row */}
              <div className="flex justify-between items-center w-full z-10 relative">
                <span className="font-mono text-[9px] uppercase tracking-[0.25em] opacity-50 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                  Project — {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-50">
                  {project.year}
                </span>
              </div>

              {/* Main asymmetric grid split */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 md:gap-10 lg:gap-16 items-center w-full my-auto z-10 relative">

                {/* Left Side: Typography wrapped in a glassmorphism card */}
                <div
                  className={`md:col-span-7 flex flex-col gap-4 sm:gap-6 ${isDark
                      ? "bg-white/2 border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.3)]"
                      : "bg-black/1 border border-black/5 shadow-[0_24px_80px_rgba(0,0,0,0.04)]"
                    } backdrop-blur-xl rounded-3xl p-4 sm:p-6 md:p-8 xl:p-12 transition-all duration-500`}
                >
                  <div className="space-y-2">
                    <h2 className="font-display font-light text-[clamp(2rem,4.5vw,4.5rem)] leading-[0.9] uppercase tracking-tight">
                      {project.slug ? (
                        <TransitionLink
                          href={`/projects/${project.slug}`}
                          className="hover:opacity-75 transition-opacity inline-block"
                        >
                          {project.title}
                        </TransitionLink>
                      ) : (
                        project.title
                      )}
                    </h2>
                    <div className="h-[2px] w-16 bg-current opacity-30 mt-2" />
                  </div>

                  <p className="font-sans text-[clamp(0.9rem,1.1vw,1.2rem)] font-light leading-relaxed opacity-85 max-w-[48ch]">
                    {project.description}
                  </p>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {project.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[9px] font-mono border ${palette.border} px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-current/3 backdrop-blur-sm hover:bg-current/10 hover:scale-105 transition-all duration-300`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Side: Mockup Image with Browser Frame & 3D Tilt Hover */}
                <div className="md:col-span-5 relative w-full max-w-[360px] md:max-w-none mx-auto group perspective-[1000px]">
                  {imageUrl && (
                    <div
                      className={`relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-2xl border ${palette.border} bg-current/3 transition-all duration-700 ease-out transform-3d group-hover:transform-[rotateY(-6deg)_rotateX(4deg)]`}
                    >
                      {/* Browser header bar */}
                      <div className={`h-6 w-full border-b ${palette.border} flex items-center gap-1.5 px-3 bg-current/2 z-20 relative`}>
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                        <div className="mx-auto w-2/5 h-3.5 rounded bg-current/4 flex items-center justify-center">
                          <span className="text-[6.5px] font-mono opacity-30 truncate">
                            https://{project.title.toLowerCase().replace(/\s+/g, "")}.dev
                          </span>
                        </div>
                      </div>

                      {/* Browser content body */}
                      <div className="relative w-full h-[calc(100%-1.5rem)] z-10">
                        <Image
                          src={imageUrl}
                          alt={project.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 40vw"
                          priority={index === 0}
                        />
                      </div>

                      {/* Interactive glass sheen overlay */}
                      <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-white/10 mix-blend-overlay z-20 pointer-events-none" />
                    </div>
                  )}
                </div>

              </div>

              {/* Bottom Row: Actions */}
              <div className="flex flex-wrap items-center justify-between border-t border-current/15 pt-4 mt-auto gap-4 z-10 relative">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] opacity-40">
                  © Hardik Vatukiya — Creative Dev
                </span>
                <div className="flex flex-wrap gap-3">
                  {project.github && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(project.github, "_blank", "noopener,noreferrer")}
                      className="group gap-2 border-current/20! text-current! hover:bg-current! hover:text-(--local-bg)! font-bold uppercase tracking-widest text-[9px] px-4 py-2 rounded-full shadow-sm"
                    >
                      <GitHubIcon className="w-3 h-3 group-hover:rotate-12 transition-transform duration-300" />
                      GitHub
                    </Button>
                  )}
                  {project.url && (
                    <Button
                      variant="primary"
                      onClick={() => window.open(project.url, "_blank", "noopener,noreferrer")}
                      className="group gap-2 font-bold uppercase tracking-widest text-[9px] px-4 py-2 rounded-full shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform duration-300" />
                      View Live
                    </Button>
                  )}
                </div>
              </div>
            </FlowSection>
          );
        })}
      </FlowArt>
    </div>
  );
}
