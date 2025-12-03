"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ExternalLink, Github } from "lucide-react";

export const TextRevealCard = ({
  text,
  revealText,
  children,
  className,
  revealClassName,
}: {
  text: string;
  revealText: string;
  children?: React.ReactNode;
  className?: string;
  revealClassName?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPosition({ x, y });
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden bg-background border rounded-lg p-8",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      <div className="relative z-10">
        <div className="transition-opacity duration-300 ease-in-out">
          {children}
        </div>
      </div>
    </div>
  );
};
