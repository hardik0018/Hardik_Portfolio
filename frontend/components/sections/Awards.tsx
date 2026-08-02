"use client";

import React, { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { cn } from "@/lib/utils";
import { SectionHeader } from "../ui/SectionHeader";
import { Trophy, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/lib/sanity.image";
import Magnetic from "../ui/Magnetic";

export interface AwardItem {
  _key?: string;
  awardName?: string;
  awardCategory?: string;
  projectName?: string;
  awardUrl?: string;
  awardImage?: any;
}

export interface AwardsData {
  title?: string;
  awardsList?: AwardItem[];
}

const AwardCard = ({ award }: { award: AwardItem }) => {
  const cardRef = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      href={award.awardUrl || "#"}
      target="_blank"
      rel="noopener noreferrer"
      ref={cardRef}
      className="js-award-card block opacity-0 translate-y-12 scale-95 transform-gpu w-full outline-none group"
    >
      <div className="relative flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-2 px-4 lg:py-4 lg:px-8 rounded-[2rem] bg-white border border-black/5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-700 overflow-hidden">
        
        {/* Shine effect on hover */}
        <div className="absolute inset-0 -translate-x-[150%] skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/60 to-transparent group-hover:animate-[shine_1.5s_ease-in-out_forwards] pointer-events-none z-20" />

        {/* Image Side */}
        <div className="relative z-10 w-full lg:w-[480px] shrink-0 rounded-2xl overflow-hidden bg-[#f5f5f5]">
          {award.awardImage ? (
            <div className="relative w-full aspect-[1.414]">
              <Image
                src={urlFor(award.awardImage).width(1000).url()}
                alt={award.awardName || "Certificate"}
                fill
                className="object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                sizes="(max-width: 1024px) 85vw, 480px"
              />
              <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none rounded-2xl" />
            </div>
          ) : (
            <div className="relative w-full aspect-[1.414] flex flex-col items-center justify-center bg-gradient-to-br from-[#ffffff] to-[#f0f0f0]">
              <div className="flex bg-[#222222] rounded-lg overflow-hidden scale-110 shadow-lg">
                <div className="bg-[#9c9c9c] text-white font-bold text-xl px-4 py-2">&lt;</div>
                <div className="bg-[#c1ff4a] text-black font-bold text-xl px-4 py-2">AA</div>
                <div className="bg-[#333333] text-white font-bold text-xl px-4 py-2">/&gt;</div>
              </div>
              <p className="text-black/40 font-mono text-xs uppercase tracking-widest mt-4">Certificate Pending</p>
            </div>
          )}
        </div>

        {/* Text Side */}
        <div className="relative z-10 flex flex-col items-center lg:items-start text-center lg:text-left w-full max-w-xl py-4">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/5 mb-6 border border-black/5">
            <Trophy className="w-3.5 h-3.5 text-black/60" />
            <span className="text-black/70 uppercase tracking-[0.15em] text-[0.7rem] font-bold">{award.awardCategory || "Recognition"}</span>
          </div>
          
          <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl text-black tracking-tight leading-[1.1] mb-6">
            {award.awardName}
          </h3>
          
          <p className="text-black/60 font-sans text-base sm:text-lg leading-relaxed mb-10 max-w-md">
            Awarded to the <strong className="text-black font-semibold">{award.projectName}</strong> for outstanding design, creativity, and technical execution.
          </p>

          <Magnetic range={30} strength={0.4}>
            <div className="inline-flex items-center gap-4 text-black uppercase tracking-widest text-xs font-mono font-bold group-hover:text-accent-primary transition-colors duration-300">
              <span>View Certificate</span>
              <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white group-hover:bg-accent-primary group-hover:scale-110 transition-all duration-300 shadow-md">
                <ArrowRight className="w-5 h-5 transform -rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
              </div>
            </div>
          </Magnetic>
        </div>
      </div>
    </Link>
  );
};

export default function Awards({ initialData }: { initialData?: AwardsData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const data = initialData || {
    title: "Awards & Recognition",
    awardsList: [
      {
        _key: "1",
        awardName: "Astonishing Awards 2026",
        awardCategory: "Project Of The Day",
        projectName: "Personal Portfolio",
        awardUrl: "https://www.astonishingawards.com/nominee/personal-portfolio",
      }
    ]
  };

  useGSAP(() => {
    // Initial Reveal
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      onToggle: (self) => {
        if (self.isActive) {
          gsap.to(".js-award-card", {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 1,
            ease: "power3.out",
            stagger: 0.2,
          });
        }
      },
    });

    // GSAP Horizontal Scroll
    const mm = gsap.matchMedia();
    
    mm.add("(min-width: 768px)", () => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const isScrollable = data.awardsList && data.awardsList.length > 1;
      
      if (isScrollable) {
        // Calculate scroll distance exactly so the last item aligns correctly with the right padding
        const getScrollAmount = () => -(container.scrollWidth - window.innerWidth);
        
        if (container.scrollWidth > window.innerWidth) {
          const tween = gsap.to(container, {
            x: getScrollAmount,
            ease: "none"
          });

          ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: () => `+=${container.scrollWidth - window.innerWidth}`,
            pin: true,
            animation: tween,
            scrub: 1,
            invalidateOnRefresh: true,
          });
        }
      } else {
        // Only 1 item, no horizontal scroll needed.
        // We removed the empty pin because it feels like a scroll freeze/lag to the user since nothing is animating.
      }
    });

    return () => mm.revert();
  }, { scope: sectionRef });

  return (
    <section
      id="awards"
      ref={sectionRef}
      className="relative bg-white pt-20 pb-24 sm:pt-14 sm:pb-10 overflow-hidden min-h-screen flex flex-col"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[80vw] h-[80vw] md:w-[50vw] md:h-[50vw] rounded-full bg-[radial-gradient(circle,var(--accent-lime)/0.08)_0%,transparent_70%)] blur-[100px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] md:w-[40vw] md:h-[40vw] rounded-full bg-[radial-gradient(circle,var(--accent-lime)/0.05)_0%,transparent_70%)] blur-[80px] -translate-x-1/3 translate-y-1/3" />
      </div>

      <div className="w-full relative z-10 flex-1 flex flex-col justify-center">
        <div className="px-6 md:px-12 lg:px-20 mx-auto max-w-7xl w-full">
          <SectionHeader title={data.title || "Awards"} variant="primary" />
        </div>

        {/* Horizontal Scroll Container */}
        <div className="w-full overflow-hidden">
          <div 
            ref={scrollContainerRef}
            className={cn(
              "flex flex-nowrap gap-8 lg:gap-16 px-6 md:px-12 lg:px-20 pb-12 w-full",
              data.awardsList && data.awardsList.length > 1 ? "w-max" : "justify-center"
            )}
          >
            {data.awardsList?.map((award, idx) => (
              <div 
                key={award._key || idx} 
                className={cn(
                  "shrink-0",
                  data.awardsList && data.awardsList.length > 1 
                    ? "w-[90vw] md:w-[85vw] lg:w-[950px]" 
                    : "w-full max-w-5xl mx-auto"
                )}
              >
                <AwardCard award={award} />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        @keyframes shine {
          0% {
            transform: translateX(-150%) skewX(-20deg);
          }
          100% {
            transform: translateX(200%) skewX(-20deg);
          }
        }
      `}} />
    </section>
  );
}

