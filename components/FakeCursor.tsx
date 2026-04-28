"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import CursorSVG from "./CursorSVG";

type Props = {
  label: string;
  variant?: "you" | "other";
};

const FakeCursor = forwardRef<HTMLDivElement, Props>(function FakeCursor(
  { label, variant = "you" },
  ref
) {
  const isYou = variant === "you";

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-40"
      style={{ opacity: 0 }}
    >
      {/* SVG cursor arrow */}
      <CursorSVG variant={variant == "you" ? "you" : "violet"} size={20} />

      {/* Label pill */}
      <span
        className={cn(
          "absolute left-3 top-3 whitespace-nowrap rounded-[4px] px-2 py-[3px] text-[10px] font-mono font-bold leading-none shadow-lg",
          isYou ? "bg-white text-black" : "bg-label-violet text-white"
        )}
      >
        {label}
      </span>
    </div>
  );
});

export default FakeCursor;
