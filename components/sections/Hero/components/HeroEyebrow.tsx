import { forwardRef } from "react";

const HeroEyebrow = forwardRef<HTMLParagraphElement>((_, ref) => {
  return (
    <p
      ref={ref}
      className="font-mono text-[10px] tracking-[0.3em] text-muted-foreground/40 uppercase"
      style={{ minHeight: "1.2em" }}
    />
  );
});

HeroEyebrow.displayName = "HeroEyebrow";

export default HeroEyebrow;
