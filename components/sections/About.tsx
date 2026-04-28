"use client";

import { useRef } from "react";
import { MaskText, RevealText } from "../TextAnimation";

export default function About() {
  const rootRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={rootRef}
      className="border-t border-border/10 bg-background px-4 py-20 sm:px-6 md:py-32 lg:py-40"
      id="about"
    >
      <div className="mx-auto max-w-5xl text-center">
        <div className="mb-12 md:mb-20">
          <RevealText
            content='THE ARCHITECT <br /> BEHIND THE <span class="text-stroke">WORK.</span>'
            customClass="mb-8 text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase leading-[1.1] tracking-tighter md:mb-12"
          />

          <div className="mt-6 md:mt-8">
            <MaskText
              content={[
                "Building robust web applications with the MERN stack.",
                "Transforming complex requirements into elegant code.",
              ]}
              className="text-base font-medium tracking-tight text-muted-foreground md:text-xl"
            />
          </div>
        </div>

        <div className="flex flex-col items-center gap-10 md:gap-16">
          <a
            href="https://hardikvatukiya.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex min-h-11 items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-label-lime transition-colors md:text-xs"
          >
            EXPLORE LIVE SITE
            <span className="inline-block transition-transform group-hover:translate-x-1">
              -&gt;
            </span>
            <span className="absolute -bottom-2 left-0 h-[1px] w-0 bg-label-lime transition-all duration-300 group-hover:w-full" />
          </a>

          <div
            ref={statsRef}
            className="grid w-full max-w-4xl grid-cols-2 gap-3 border-t border-border/5 pt-12 sm:gap-4 md:grid-cols-4 md:pt-20"
          >
            {[
              { label: "Projects", value: "3+" },
              { label: "Experience", value: "1+ yr" },
              { label: "Skills", value: "10+" },
              { label: "Commitment", value: "100%" },
            ].map((stat) => (
              <div key={stat.label} className="p-4 text-center md:p-6">
                <div className="mb-1 font-display text-2xl font-black md:text-3xl">
                  {stat.value}
                </div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/50 md:text-[10px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
