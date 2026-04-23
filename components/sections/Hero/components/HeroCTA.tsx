import { forwardRef } from "react";
import { HERO_COPY } from "../constants";

const HeroCTA = forwardRef<HTMLAnchorElement>((_, ref) => {
  return (
    <a
      ref={ref}
      href="#work"
      className="fixed bottom-12 right-12 z-30 flex items-center gap-4 rounded-full border border-border/10 bg-muted/5 px-8 py-4 text-[9px] font-bold tracking-[0.25em] text-muted-foreground/40 backdrop-blur-3xl transition-all hover:border-border/40 hover:text-foreground group"
      aria-label="View projects"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse group-hover:scale-125 transition-transform" />
      {HERO_COPY.ctaText.toUpperCase()}
      <span className="opacity-10 group-hover:opacity-40 transition-opacity" aria-hidden="true">→</span>
    </a>
  );
});

HeroCTA.displayName = "HeroCTA";

export default HeroCTA;
