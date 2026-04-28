import { forwardRef } from "react";

interface HeroEyebrowProps {
  children?: React.ReactNode;
}

const HeroEyebrow = forwardRef<HTMLParagraphElement, HeroEyebrowProps>(
  ({ children }, ref) => {
    return (
      <p
        ref={ref}
        className="font-mono text-[9px] tracking-[0.4em] text-muted-foreground uppercase"
        style={{ minHeight: "1.2em" }}
      >
        {children}
      </p>
    );
  }
);

HeroEyebrow.displayName = "HeroEyebrow";

export default HeroEyebrow;
