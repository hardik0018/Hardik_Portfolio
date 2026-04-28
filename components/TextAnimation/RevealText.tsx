'use client';
import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import parse from 'html-react-parser';
import { cn } from '@/lib/utils';
 
gsap.registerPlugin(SplitText);
 
interface RevealTextProps {
  content: string;
  customClass?: string;
  style?: React.CSSProperties;
}
 
const RevealText = forwardRef<HTMLDivElement, RevealTextProps>(
  ({ content, customClass, style }, ref) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
 
    // Forward the internal ref to the outer ref
    useImperativeHandle(ref, () => internalRef.current!);
 
    useEffect(() => {
      const el = internalRef.current;
      if (!el) return;
 
      let initialized = false;
      let timeoutId: ReturnType<typeof setTimeout>;
      let ctx: gsap.Context;
      let observer: IntersectionObserver | undefined;
      let startRequested = false;
 
      function initAnimation() {
        if (initialized) return;
        initialized = true;
        clearTimeout(timeoutId);
 
        ctx = gsap.context(() => {
          gsap.set(el, { opacity: 1 });
 
          const split = new SplitText(el as HTMLElement, {
            type: 'words,lines',
            linesClass: 'word-line',
            wordsClass: 'word',
          });
          (el as HTMLElement).removeAttribute('aria-label');
 
          gsap.set(split.words, {
            opacity: 0,
            y: 100,
            skewX: '-6',
            force3D: true,
          });
 
          observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                gsap.to(split.words, {
                  opacity: 1,
                  y: 0,
                  skewX: '0',
                  duration: 1.5,
                  stagger: 0.04,
                  ease: 'power3.out',
                  force3D: true,
                });
                observer?.disconnect();
              }
            },
            { threshold: 0, rootMargin: '0px 0px -10% 0px' }
          );
 
          observer.observe(el as HTMLElement);
        });
      }
 
      const startRevealAnimation = () => {
        if (startRequested) return;
        startRequested = true;
        timeoutId = setTimeout(initAnimation, 150);
        document.fonts.ready.then(initAnimation);
      };
 
      const hasLoaderOverlay = !!document.querySelector('[data-site-loader-overlay="true"]');
      const isLoaderComplete = document.documentElement.dataset.siteLoaderComplete === 'true';
      const shouldWaitForLoader = hasLoaderOverlay && !isLoaderComplete;
 
      if (shouldWaitForLoader) {
        window.addEventListener('site-loader:complete', startRevealAnimation, { once: true });
      } else {
        startRevealAnimation();
      }
 
      return () => {
        window.removeEventListener('site-loader:complete', startRevealAnimation);
        if (timeoutId) clearTimeout(timeoutId);
        observer?.disconnect();
        ctx?.revert();
      };
    }, []);
 
    return (
      <div
        ref={internalRef}
        className={cn(
          'split block opacity-0 font-display text-foreground will-change-transform',
          customClass
        )}
        style={style}
      >
        {parse(content)}
      </div>
    );
  }
);
 
RevealText.displayName = 'RevealText';
 
export default RevealText;
