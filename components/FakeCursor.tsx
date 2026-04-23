"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

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
      <svg
        width="14"
        height="18"
        viewBox="0 0 14 18"
        fill="none"
        className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
      >
        <path
          d="M1 1L1 14.5L5 10.5L7.5 16.5L9.5 15.5L7 9.5L12.5 9.5Z"
          fill={isYou ? "white" : "hsl(var(--label-violet))"}
          stroke={isYou ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.3)"}
          strokeWidth="0.8"
          strokeLinejoin="round"
        />
      </svg>

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
