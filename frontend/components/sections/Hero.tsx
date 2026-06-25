"use client";

import { useRef } from "react";
import { Card } from "@/components/ui/Card";
import { RevealImage } from "@/components/ui/RevealImage";
import { urlFor } from "@/lib/sanity.image";
import { gsap, useGSAP } from "@/lib/gsap";

export interface HeroData {
  name: string;
  portraitImage: Parameters<typeof urlFor>[0];
  backgroundImage: Parameters<typeof urlFor>[0];
  copyrightText: string;
}

const MarqueeItem = ({ text, isPrimary }: { text: string; isPrimary?: boolean }) => (
  <div className="flex shrink-0 items-center font-bold">
    {isPrimary ? (
      <h1 className="text-foreground px-8 text-[200px] md:text-[350px] font-hero leading-[0.8] tracking-[0.08em]">
        {/* Visually hidden full title for SEO & screen readers */}
        <span className="sr-only">{text} — Full-Stack Developer</span>
        {/* Visible decorative display of name only */}
        <span aria-hidden="true">{text}</span>
      </h1>
    ) : (
      <div aria-hidden="true" className="text-foreground px-8 text-[200px] md:text-[350px] font-hero leading-[0.8] tracking-[0.08em]">
        {text}
      </div>
    )}
  </div>
);

const HeroSection = ({ initialData }: { initialData?: HeroData }) => {
  const name = initialData?.name || "Hardik Vatukiya";
  const portraitUrl = initialData?.portraitImage ? urlFor(initialData.portraitImage).url() : "/hero-portrait.webp";
  const backgroundUrl = initialData?.backgroundImage ? urlFor(initialData.backgroundImage).url() : "./hero_bg.svg";
  const copyright = initialData?.copyrightText || "©2026";

  const sectionRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const scrollDownRef = useRef<HTMLDivElement>(null);
  const copyrightRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      gsap.set([marqueeRef.current, portraitRef.current, scrollDownRef.current, copyrightRef.current], {
        opacity: 1,
        y: 0,
        scale: 1,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        visibility: "visible"
      });
      return;
    }

    // Set initial states to prevent FOUC / layout shift
    gsap.set(marqueeRef.current, { opacity: 0, y: 50 });
    gsap.set(portraitRef.current, { 
      opacity: 0, 
      scale: 1.04, 
      clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)" 
    });
    gsap.set(scrollDownRef.current, { opacity: 0, y: 15 });
    gsap.set(copyrightRef.current, { opacity: 0, y: 15 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out", duration: 1.2 }
    });

    tl.to(marqueeRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.4,
      ease: "power4.out"
    })
    .to(portraitRef.current, {
      opacity: 1,
      scale: 1,
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.5,
      ease: "power3.inOut"
    }, "-=1.0")
    .to([scrollDownRef.current, copyrightRef.current], {
      opacity: 1,
      y: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: "power2.out"
    }, "-=0.6");

  }, { scope: sectionRef });

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background"
      style={{ backgroundImage: `url(${backgroundUrl})`, backgroundRepeat: "no-repeat", backgroundSize: "cover", backgroundPosition: "center" }}>
      <div 
        ref={marqueeRef}
        className="absolute inset-0 flex items-center pointer-events-none select-none overflow-hidden"
        style={{ contain: 'layout paint' }}
      >
        <div className="flex whitespace-nowrap will-change-transform animate-marquee">
          <MarqueeItem text={name} isPrimary />
          <MarqueeItem text={name} />
        </div>
      </div>

      <div className="relative z-10 w-full h-[80vh] md:h-auto md:aspect-video flex justify-center items-end">
        <RevealImage
          ref={portraitRef}
          src={portraitUrl}
          alt={`${name} — Full Stack Developer`}
          fill
          sizes="(max-width: 768px) 100vw, 58vw"
          transition="bottom-up"
          trigger="manual"
          delay={0}
          duration={0.8}
          wrapperClassName="relative w-full md:w-[58%] h-full"
          className="object-contain object-bottom select-none"
          priority
          quality={100}
        />
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-background/40 to-transparent pointer-events-none"></div>

      <div
        ref={scrollDownRef}
        className="absolute bottom-4 left-4 flex items-center gap-2 z-40 sm:bottom-space-4 sm:left-space-4"
        aria-label="Scroll to About section"
      >
        <div className="w-8 h-8 border border-foreground flex items-center justify-center rounded-xs">
          <div className="w-1 h-1 bg-foreground rounded-full animate-bounce"></div>
        </div>
        <span className="text-xs font-bold uppercase tracking-tighter text-text-muted">Scroll Down</span>
      </div>

      <div 
        ref={copyrightRef}
        className="absolute bottom-4 right-4 z-40 sm:bottom-space-4 sm:right-space-4"
      >
        <Card variant="outline" className="px-2 py-1">
          <span className="text-xs font-bold">{copyright}</span>
        </Card>
      </div>
    </section>
  );
};

export default HeroSection;
