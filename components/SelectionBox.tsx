"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = { handle?: string };

const SelectionBox = forwardRef<HTMLDivElement, Props>(function SelectionBox(
  { handle = "h1 / Text" },
  ref
) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-mode="drag"
      className="pointer-events-none absolute z-30"
      style={{ opacity: 0 }}
    >
      {/* ── DRAG MODE: dashed border ── */}
      <div
        data-drag-border
        className="absolute inset-0 border border-dashed border-foreground/50"
      />

      {/* ── SNAP MODE: violet solid border ── */}
      <div
        data-snap-border
        className={cn(
          "absolute inset-0 opacity-0 rounded-[2px] transition-opacity duration-200",
          "border-[1.5px] border-label-violet"
        )}
      />

      {/* Corner handles (snap mode only) */}
      {[
        "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
        "top-0 right-0 translate-x-1/2 -translate-y-1/2",
        "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
        "bottom-0 right-0 translate-x-1/2 translate-y-1/2",
      ].map((pos, i) => (
        <div
          key={i}
          data-corner
          className={cn(
            "absolute h-[7px] w-[7px] rounded-[1px] opacity-0 bg-background border-[1.5px] border-label-violet",
            pos
          )}
        />
      ))}

      {/* "Aligning to Grid..." label — top-left, snap mode only */}
      <div
        data-aligning
        className="absolute -top-6 left-0 rounded-[3px] px-2 py-[3px] text-[9px] font-mono font-bold leading-none text-white opacity-0 whitespace-nowrap bg-label-violet"
      >
        Aligning to Grid...
      </div>

      {/* Connection line: origin → current position during drag */}
      <div
        data-drag-line
        className="absolute opacity-0 z-50 top-1/2 left-1/2 h-[1px] w-0 bg-transparent border-t border-dashed border-destructive origin-left -translate-y-1/2"
      />

      {/* dx / dy pink badge — appears near element center during drag */}
      <div
        data-coords
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full text-[9px] font-mono font-bold text-white opacity-0 whitespace-nowrap px-3 py-1 shadow-xl bg-label-pink z-50"
      >
        dx: 0, dy: 0
      </div>
    </div>
  );
});

export default SelectionBox;
