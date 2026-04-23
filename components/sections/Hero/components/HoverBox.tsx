import { forwardRef } from "react";

interface HoverBoxProps {
  label?: string;
}

const HoverBox = forwardRef<HTMLDivElement, HoverBoxProps>(({ label = "Drag To Move" }, ref) => {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute z-20 opacity-0"
    >
      <div
        className="absolute inset-0 border border-dashed border-white/30 rounded-[2px]"
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 -top-[13px] rounded-[3px] px-2 py-[3.5px] text-[8px] font-mono font-bold uppercase leading-none tracking-[0.15em] text-black whitespace-nowrap bg-white"
      >
        {label}
      </div>
    </div>
  );
});

HoverBox.displayName = "HoverBox";

export default HoverBox;
