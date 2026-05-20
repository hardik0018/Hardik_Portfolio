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
      setHasIntersected(true);
      return;
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
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
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
