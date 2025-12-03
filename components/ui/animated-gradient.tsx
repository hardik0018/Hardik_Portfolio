"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const AnimatedGradient = ({
  children,
  className,
  containerClassName,
  colors = ["#5EEAD4", "#A855F7", "#3B82F6"],
  duration = 10,
  blur = 100,
  ...props
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
  colors?: string[];
  duration?: number;
  blur?: number;
  [key: string]: any;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [translate, setTranslate] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const animateGradient = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.random() * rect.width - rect.width / 2;
      const y = Math.random() * rect.height - rect.height / 2;
      setTranslate({ x, y });
    };

    animateGradient();
    const intervalId = setInterval(animateGradient, duration * 1000);

    return () => clearInterval(intervalId);
  }, [duration]);

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden", containerClassName)}
      {...props}
    >
      <div
        className="absolute inset-0 z-0 transition-transform duration-[10000ms] ease-in-out"
        style={{
          transform: `translateX(${translate.x}px) translateY(${translate.y}px)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: `radial-gradient(circle at center, ${colors.join(
              ", "
            )})`,
            filter: `blur(${blur}px)`,
          }}
        />
      </div>
      <div className={cn("relative z-10", className)}>{children}</div>
    </div>
  );
};
