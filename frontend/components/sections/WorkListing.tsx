"use client";

import { RevealImage, type TransitionType } from "@/components/ui/RevealImage";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SanityProject } from "./Projects";
import { urlFor } from "@/lib/sanity.image";

const variants: TransitionType[] = ["iris", "top-down", "center-h", "diagonal-tr", "bottom-up"];

export default function WorkListing({ initialData }: { initialData?: SanityProject[] }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Force refresh for Next.js route changes
      ScrollTrigger.refresh();
      const timeoutId = setTimeout(() => ScrollTrigger.refresh(), 100);

      const items = gsap.utils.toArray<HTMLElement>(".work-item");

      items.forEach((item) => {
        const q = gsap.utils.selector(item);

        gsap.fromTo(
          q(".reveal-text"),
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.1,
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          q(".reveal-line"),
          { scaleY: 0, transformOrigin: "top" },
          {
            scaleY: 1,
            duration: 1.2,
            ease: "expo.out",
            scrollTrigger: {
              trigger: item,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      return () => clearTimeout(timeoutId);
    },
    { scope: containerRef }
  );

  const projects = initialData || [];

  return (
    <main
      id="top"
      ref={containerRef}
      className="min-h-screen overflow-hidden bg-background px-6 py-12 md:px-10 lg:px-12 pt-20 md:pt-32"
    >
      <div className="mx-auto max-w-[1400px]">
        <SectionHeader title="All Projects" />
        <section className="py-12 md:py-20">
          {projects.map((item, index) => {
            const isEven = index % 2 === 0;
            const number = String(index + 1).padStart(2, "0");
            const variant = variants[index % variants.length];

            const imageUrl = item.src ? urlFor(item.src).width(1200).height(675).fit('crop').auto('format').url() : "";
            const category = item.tags && item.tags.length > 0 ? item.tags.join(" / ") : "Development";

            return (
              <article
                key={item._id || item.title}
                className="work-item grid gap-10 lg:grid-cols-12 lg:gap-16 border-b border-[#d9d9d2] py-12 md:py-20 first:pt-0"
              >
                <div className={`lg:col-span-5 xl:col-span-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}>
                  <div className="grid grid-cols-[50px_1fr] md:grid-cols-[70px_1fr] gap-6 md:gap-8">
                    <p className="reveal-text font-sans text-3xl md:text-4xl font-black leading-none tracking-[-0.08em]">{number}</p>
                    <div className="reveal-line relative border-l border-[#cfcfc8] pl-8 md:pl-14">
                      <span className="absolute left-[-5.5px] top-2 h-2.5 w-2.5 rounded-full border-2 border-[#171716] bg-[#fbfbf8]" />
                      <p className="reveal-text font-sans text-[0.6rem] md:text-[0.66rem] font-bold uppercase tracking-widest text-[#8a8a82]">
                        {category}
                      </p>
                      <h2 className="reveal-text mt-4 font-sans text-2xl md:text-4xl font-black uppercase leading-none tracking-[-0.06em]">
                        {item.title}
                      </h2>
                      <p className="reveal-text mt-4 max-w-[320px] font-sans text-sm md:text-base leading-relaxed text-[#393936]">
                        {item.description}
                      </p>
                      {item.github && <Link
                        href={item.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="reveal-text mt-8 inline-flex items-center gap-3 font-sans text-xs md:text-sm font-bold uppercase transition-all duration-300 hover:text-[#00994a] hover:translate-x-1"
                      >
                        View Project
                        <ArrowRight className="h-4 w-4" />
                      </Link>}
                    </div>
                  </div>
                </div>

                <div className={`group relative h-[300px] lg:h-[300px] overflow-hidden rounded-[12px] bg-[#111] shadow-[0_30px_80px_rgba(0,0,0,0.12)] lg:col-span-7 xl:col-span-8 ${isEven ? "lg:order-2" : "lg:order-1"}`}
                >
                  {imageUrl && <RevealImage
                    src={imageUrl}
                    alt={item.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 1200px"
                    transition={variant}
                    trigger="scroll"
                    className="object-cover grayscale transition duration-1000 group-hover:scale-105 group-hover:grayscale-0"
                    wrapperClassName="w-full h-full"
                  />}
                  <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/5 to-black/30 mix-blend-multiply pointer-events-none transition-opacity duration-700 group-hover:opacity-40" />
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
