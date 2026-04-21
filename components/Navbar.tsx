"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${scrolled
        ? "py-4 backdrop-blur-2xl bg-bg/85 border-b border-text-primary/10"
        : "py-8 bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between font-cabinet">
        <div className="text-2xl font-bold italic tracking-tighter font-fraunces text-text-primary">
          HV
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6 text-[10px] uppercase tracking-[0.45em] font-extrabold hidden md:flex text-text-primary">
            <a href="#work" className="relative group overflow-hidden" data-cursor="link">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Work</span>
              <span className="absolute top-0 left-0 block transition-transform duration-300 translate-y-0 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 text-accent">Work</span>
            </a>
            <a href="#services" className="relative group overflow-hidden" data-cursor="link">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Expertise</span>
              <span className="absolute top-0 left-0 block transition-transform duration-300 translate-y-0 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 text-accent">Expertise</span>
            </a>
            <a href="#contact" className="relative group overflow-hidden" data-cursor="link">
              <span className="block transition-transform duration-300 group-hover:-translate-y-full">Contact</span>
              <span className="absolute top-0 left-0 block transition-transform duration-300 translate-y-0 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 text-accent">Contact</span>
            </a>
          </div>
          
          <div className="px-4 py-2 border border-accent/20 rounded-full flex items-center gap-2 bg-accent/5">
             <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
             <span className="text-[9px] font-black uppercase text-accent tracking-widest">Available</span>
          </div>
        </div>
      </div>
    </nav>
  );
}
