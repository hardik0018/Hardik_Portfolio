"use client";

import { forwardRef } from "react";
import CursorSVG from "../../CursorSVG";
import { cn } from "@/lib/utils";

interface StatementStageProps {
  number: string;
  label: string;
  plainText: string;
  numberRef: (el: HTMLDivElement | null) => void;
  tagRef: (el: HTMLDivElement | null) => void;
  selectionRef: (el: HTMLDivElement | null) => void;
  headingRef: (el: HTMLHeadingElement | null) => void;
  innerRef: (el: HTMLSpanElement | null) => void;
  commentRef: (el: HTMLDivElement | null) => void;
  hardikRef: (el: HTMLDivElement | null) => void;
}

const StatementStage = forwardRef<HTMLDivElement, StatementStageProps>(
  (
    {
      number,
      label,
      plainText,
      numberRef,
      tagRef,
      selectionRef,
      headingRef,
      innerRef,
      commentRef,
      hardikRef,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className="relative flex min-h-[70svh] flex-col items-center justify-center px-4 py-12 sm:px-6 md:absolute md:inset-0 md:min-h-0 md:px-6 md:py-0"
      >
        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center">
          <div
            ref={numberRef}
            className={cn(
              "mb-6 rounded-[4px] border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-primary md:mb-10 md:px-4 md:text-sm"
            )}
          >
            {number}
          </div>

          <div className="relative">
            <div
              ref={selectionRef}
              className="absolute -inset-x-4 -inset-y-4 rounded-lg border border-primary/30 bg-primary/[0.025] md:-inset-x-10 md:-inset-y-8 md:rounded-xl"
            >
              <div className="absolute -left-[4px] -top-[4px] h-[7px] w-[7px] rounded-[1px] border-[1.5px] border-primary bg-background md:h-[9px] md:w-[9px]" />
              <div className="absolute -right-[4px] -top-[4px] h-[7px] w-[7px] rounded-[1px] border-[1.5px] border-primary bg-background md:h-[9px] md:w-[9px]" />
              <div className="absolute -bottom-[4px] -left-[4px] h-[7px] w-[7px] rounded-[1px] border-[1.5px] border-primary bg-background md:h-[9px] md:w-[9px]" />
              <div className="absolute -bottom-[4px] -right-[4px] h-[7px] w-[7px] rounded-[1px] border-[1.5px] border-primary bg-background md:h-[9px] md:w-[9px]" />
              <div className="absolute -left-[4px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 border-[1.5px] border-primary/50 bg-background md:h-[7px] md:w-[7px]" />
              <div className="absolute -right-[4px] top-1/2 h-[5px] w-[5px] -translate-y-1/2 border-[1.5px] border-primary/50 bg-background md:h-[7px] md:w-[7px]" />
            </div>

            <div
              ref={tagRef}
              className="absolute left-0 flex min-w-[10px] -translate-y-full items-center gap-2 whitespace-nowrap rounded-sm bg-label-violet px-2 py-1 font-mono text-[9px] text-white shadow-lg md:-top-14 md:px-3 md:py-1.5 md:text-[11px]"
              style={{ top: "-0.75rem" }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
              {label}
            </div>

            <h2
              ref={headingRef}
              className="relative max-w-[16ch] text-center text-3xl font-medium leading-[1.1] tracking-tight sm:max-w-[18ch] sm:text-5xl md:max-w-[22ch] md:text-7xl"
            >
              <span className="sr-only">{plainText}</span>
              <span aria-hidden ref={innerRef} className="relative" />
            </h2>

            <div
              ref={commentRef}
              className="absolute bottom-0 right-0 flex translate-y-full items-center gap-2 rounded-sm bg-label-violet px-2 py-1 font-mono text-[9px] text-white shadow-lg md:-bottom-14 md:px-3 md:py-1.5 md:text-[11px]"
              style={{ marginTop: "0.75rem" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
              content editing...
            </div>
          </div>

          <div
            ref={hardikRef}
            className="pointer-events-none absolute right-0 top-[78%] z-20 hidden items-start gap-1.5 md:right-[-18%] md:top-[72%] md:flex"
          >
            <CursorSVG variant="hardik" size={22} />
            <span className="mt-3.5 rounded-sm bg-label-violet px-2 py-0.5 font-mono text-[10px] text-white shadow-xl md:px-2.5 md:text-[11px]">
              Hardik Vatukiya
            </span>
          </div>
        </div>
      </div>
    );
  }
);

StatementStage.displayName = "StatementStage";

export default StatementStage;
