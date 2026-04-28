'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';

interface MaskTextProps {
  content: string[];
  delay?: number;
  className?: string;
}

gsap.registerPlugin(ScrollTrigger);

export default function MaskText({ content, delay = 0, className }: MaskTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.mask-line', {
        y: '0%',
        duration: 1,
        ease: 'power1.out',
        stagger: 0.01,
        delay,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%',
          once: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <span ref={containerRef} className={cn('font-display text-foreground', className)}>
      {content.map((phrase, index) => (
        <span key={index} className="block overflow-hidden">
          <span className="mask-line relative -top-0.5 inline-block translate-y-full">
            {phrase}
          </span>
        </span>
      ))}
    </span>
  );
}
