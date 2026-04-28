"use client";

import { useFooterAnimation } from "@/hooks/useFooterAnimation";
import { Shuffle } from "../../TextAnimation";
import { FOOTER_HEADING_SEGMENTS, FOOTER_LINKS } from "./footer.data";
import FooterLinks from "./FooterLinks";

export default function Footer() {
  const { footerRef, rightColumnRef } = useFooterAnimation();
  const currentYear = new Date().getFullYear();

  return (
    <footer
      ref={footerRef}
      className="border-t border-white/5 bg-black px-4 pb-12 pt-16 sm:px-6 md:px-12"
      role="contentinfo"
      aria-label="Site Footer"
    >
      <div className="mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-12 lg:flex-row lg:items-end">
        <div className="w-full lg:flex-1">
          <Shuffle
            tag="h2"
            className="font-display text-[15vw] leading-[0.75] uppercase tracking-tighter sm:text-[10vw] lg:text-[12rem]"
            segments={FOOTER_HEADING_SEGMENTS}
          />
        </div>

        <div
          ref={rightColumnRef}
          className="flex w-full flex-col items-start gap-8 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 md:flex-row md:items-center lg:w-auto lg:gap-12"
        >
          <FooterLinks links={FOOTER_LINKS} />

          <div className="whitespace-nowrap font-bold text-[10px] text-foreground opacity-80 md:ml-auto md:text-[12px]">
            (C) {currentYear} HARDIK VATUKIYA
          </div>
        </div>
      </div>
    </footer>
  );
}
