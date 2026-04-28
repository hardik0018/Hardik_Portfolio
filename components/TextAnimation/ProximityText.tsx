'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cn } from '@/lib/utils';

type Props = {
  text: string;
  className?: string;
  radius?: number;
  strength?: number;
};

export default function ProximityText({
  text,
  className = '',
  radius = 50,
  strength = 0.6,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    const letters = Array.from(container.querySelectorAll<HTMLSpanElement>('span'));

    const setters = letters.map((el) => ({
      x: gsap.quickTo(el, 'x', { duration: 0.4, ease: 'expo.out' }),
      y: gsap.quickTo(el, 'y', { duration: 0.4, ease: 'expo.out' }),
      scaleX: gsap.quickTo(el, 'scaleX', { duration: 0.4, ease: 'expo.out' }),
      scaleY: gsap.quickTo(el, 'scaleY', { duration: 0.4, ease: 'expo.out' }),
      filter: gsap.quickTo(el, 'filter', { duration: 0.4, ease: 'expo.out' }),
    }));

    const handleMove = (e: MouseEvent) => {
      const mouseX = e.clientX;
      const mouseY = e.clientY;

      letters.forEach((el, i) => {
        const rect = el.getBoundingClientRect();

        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;

        const dx = mouseX - cx;
        const dy = mouseY - cy;

        const dist = Math.sqrt(dx * dx + dy * dy);
        const power = Math.max(0, 1 - dist / radius);

        // 🎯 movement
        const moveX = -dx * power * strength;
        const moveY = -dy * power * strength;

        // 🎯 fake "font weight"
        const scaleX = 1 + power * 0.8; // horizontal stretch (thickness feel)
        const scaleY = 1 + power * 0.8; // slight vertical

        // 🎯 visual polish
        const blur = (1 - power) * 2;
        const contrast = 1 + power * 0.5;

        setters[i].x(moveX);
        setters[i].y(moveY);
        setters[i].scaleX(scaleX);
        setters[i].scaleY(scaleY);
        // gsap.set(el, {
        //   filter: `blur(${blur}px) contrast(${contrast})`,
        // });
      });
    };

    const reset = () => {
      setters.forEach((s) => {
        s.x(0);
        s.y(0);
        s.scaleX(1);
        s.scaleY(1);
      });
      // letters.forEach((el) => {
      //   gsap.set(el, { filter: 'blur(0px) contrast(1)' });
      // });
    };

    container.addEventListener('mousemove', handleMove);
    container.addEventListener('mouseleave', reset);

    return () => {
      container.removeEventListener('mousemove', handleMove);
      container.removeEventListener('mouseleave', reset);
    };
  }, [radius, strength]);

  return (
    <div ref={ref} className={cn('proximity-text font-display text-foreground', className)}>
      {text.split('').map((char, i) => (
        <span key={i} className="letter">
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
}
