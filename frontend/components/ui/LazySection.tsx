"use client";

import React, { useState, useEffect, useRef, ReactNode } from "react";
import { ScrollTrigger } from "@/lib/gsap";

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
  minHeight?: string;
}

export function LazySection({
  children,
  fallback,
  rootMargin = "200px",
  className = "",
  minHeight = "400px",
}: LazySectionProps) {
  const [hasIntersected, setHasIntersected] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If the browser doesn't support IntersectionObserver (rare), load immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      const timer = setTimeout(() => {
        setHasIntersected(true);
      }, 0);
      return () => clearTimeout(timer);
    }

    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasIntersected(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  useEffect(() => {
    if (hasIntersected) {
      // refresh(true) recalculates trigger positions WITHOUT adjusting the
      // current scroll position — prevents snap-to-top when lazy sections load
      const timer = setTimeout(() => {
        ScrollTrigger.refresh(true);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [hasIntersected]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={!hasIntersected ? { minHeight } : undefined}
    >
      {hasIntersected ? children : fallback}
    </div>
  );
}
