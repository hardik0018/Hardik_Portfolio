"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export default function Nav() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={cn(
                "fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 transition-all duration-300",
                scrolled
                    ? "bg-background/80 backdrop-blur-md border-b border-border/5 py-3"
                    : "bg-transparent"
            )}
            data-nav="true"
        >
            <div className="flex w-full items-center justify-between max-w-[1400px] mx-auto">
                {/* Logo / Name */}
                <div className="font-display text-sm font-bold tracking-tight text-foreground select-none">
                    HARDIK <span className="font-light opacity-50 uppercase">VATUKIYA</span>
                </div>

                {/* Status / Location Meta — Hidden on mobile */}
                <div className="hidden font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground/60 md:block tabular">
                    INDIA, GUJARAT — 00:26:21 PM
                </div>

                {/* Navigation Links */}
                <div className="flex gap-8 font-mono text-[10px] uppercase tracking-[0.2em]">
                    <a
                        href="#work"
                        className="text-foreground/70 hover:text-foreground transition-colors relative group"
                    >
                        WORK
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground/20 transition-all group-hover:w-full" />
                    </a>
                    <a
                        href="#about"
                        className="text-foreground/70 hover:text-foreground transition-colors relative group"
                    >
                        ABOUT
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-foreground/20 transition-all group-hover:w-full" />
                    </a>
                </div>
            </div>
        </nav>
    );
}
