'use client';

import { createContext, useContext, useRef, useCallback, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import gsap from 'gsap';

type TransitionContextType = {
  triggerTransition: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  triggerTransition: () => {},
});

export const usePageTransition = () => useContext(TransitionContext);

const FADE_IN_DURATION = 0.65; // overlay fades IN over current page
const FADE_OUT_DURATION = 0.75; // overlay fades OUT revealing new page

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isTransitioning = useRef(false);

  const triggerTransition = useCallback(
    (href: string) => {
      if (isTransitioning.current) return;
      if (href === pathname) return;

      if (
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        href === '#'
      ) {
        return;
      }

      isTransitioning.current = true;

      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        return;
      }

      // Enable overlay to block interaction
      gsap.set(overlay, { pointerEvents: 'all' });

      // Fade overlay IN (covers current page = "fade out" effect)
      gsap.fromTo(
        overlay,
        { opacity: 0 },
        {
          opacity: 1,
          duration: FADE_IN_DURATION,
          ease: 'power2.inOut',
          onComplete: () => {
            router.push(href);
          },
        }
      );
    },
    [router, pathname]
  );

  // When pathname changes, new page is loaded — fade overlay OUT
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    // Small delay to ensure new page content has painted
    gsap.to(overlay, {
      opacity: 0,
      duration: FADE_OUT_DURATION,
      ease: 'power2.inOut',
      delay: 0.1,
      onComplete: () => {
        gsap.set(overlay, { pointerEvents: 'none' });
        isTransitioning.current = false;
      },
    });
  }, [pathname]);

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}
      {/* Full-screen transition overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          background: '#ffffff',
          opacity: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />
    </TransitionContext.Provider>
  );
}
