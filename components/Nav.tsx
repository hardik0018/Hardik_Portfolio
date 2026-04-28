"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import Menu from "./Menu";
import { Shuffle } from "./TextAnimation";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState("");

  const segments = useMemo(
    () => [
      { text: "HARDIK " },
      {
        text: "VATUKIYA",
        className: "font-light uppercase opacity-50",
      },
    ],
    []
  );

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const updateTime = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-US", {
          hour12: true,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };

    handleScroll();
    updateTime();

    window.addEventListener("scroll", handleScroll, { passive: true });
    const interval = window.setInterval(updateTime, 1000);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.clearInterval(interval);
    };
  }, []);

  return (
    <>
      <nav
        className={cn(
          "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-4 transition-all duration-300 sm:px-6 md:px-8",
          scrolled
            ? "border-b border-border/5 bg-background/80 py-3 backdrop-blur-md"
            : "bg-transparent"
        )}
        data-nav="true"
      >
        <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4">
          <div className="shrink-0 select-none font-display text-xs font-bold tracking-tight text-foreground sm:text-sm">
            <Shuffle
              text="HARDIK VATUKIYA"
              segments={segments}
              animationMode="sequential"
              shuffleDirection="up"
              duration={0.7}
              triggerOnHover
              className="text-foreground"
            />
          </div>

          <div className="hidden tabular font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 lg:block">
            INDIA · GUJARAT · {time}
          </div>

          <div className="mr-12 hidden gap-6 font-mono text-[10px] uppercase tracking-[0.2em] md:flex lg:gap-8">
            <a
              href="#work"
              className="group relative text-foreground/70 transition-colors hover:text-foreground"
            >
              <Shuffle text="WORK" triggerOnHover />
            </a>
            <a
              href="#about"
              className="group relative text-foreground/70 transition-colors hover:text-foreground"
            >
              <Shuffle text="ABOUT" triggerOnHover />
            </a>
          </div>
        </div>
      </nav>
      <Menu />
    </>
  );
}
