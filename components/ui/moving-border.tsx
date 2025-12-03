"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const MovingBorder = ({
  children,
  duration = 2000,
  className,
  containerClassName,
  borderRadius = "1.75rem",
  colors = ["#171717"],
  as: Component = "div",
  ...otherProps
}: {
  children: React.ReactNode;
  duration?: number;
  className?: string;
  containerClassName?: string;
  borderRadius?: string;
  colors?: string[];
  as?: any;
  [key: string]: any;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setOpacity(1);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
  };

  return (
    <Component
      className={cn("relative p-[2px] overflow-hidden", containerClassName)}
      style={{
        borderRadius: borderRadius,
      }}
      onMouseMove={handleMouseMove}
      {...otherProps}
    >
      <div
        className="absolute inset-0 z-10"
        style={{
          background: `radial-gradient(circle at ${position.x}px ${position.y}px, hsl(var(--primary)) 0%, transparent 50%)`,
          opacity: opacity,
          transition: "opacity 0.3s",
        }}
      />
      <div
        className={cn("relative z-20 bg-background", className)}
        style={{
          borderRadius: `calc(${borderRadius} - 2px)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
};
