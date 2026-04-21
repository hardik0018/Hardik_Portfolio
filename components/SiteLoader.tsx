'use client';

import gsap from 'gsap';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type SiteLoaderProps = {
  children: React.ReactNode;
};

// Loader timing controls (seconds). Adjust these as needed.
const LOADER_START_DELAY = 0.35;
const PROGRESS_DURATION = 1.8;
const AFTER_PROGRESS_HOLD = 0.45;
const LINE_EXPAND_X_DURATION = 0.55;
const LINE_EXPAND_Y_DURATION = 0.65;
const OVERLAY_FADE_OUT_DURATION = 0.25;
const DIGIT_LOOP_VALUES = Array.from({ length: 12 * 10 }, (_, index) => index % 10);
const formatCounter = (value: number) => value.toString().padStart(3, '0');

export default function SiteLoader({ children }: SiteLoaderProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const fillRef = useRef<HTMLDivElement | null>(null);
  const counterRef = useRef<HTMLDivElement | null>(null);
  const counterViewportRef = useRef<HTMLDivElement | null>(null);
  const hundredsTrackRef = useRef<HTMLDivElement | null>(null);
  const tensTrackRef = useRef<HTMLDivElement | null>(null);
  const onesTrackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const overlay = overlayRef.current;
    const progressBar = progressBarRef.current;
    const fill = fillRef.current;
    const counter = counterRef.current;
    const counterViewport = counterViewportRef.current;
    const hundredsTrack = hundredsTrackRef.current;
    const tensTrack = tensTrackRef.current;
    const onesTrack = onesTrackRef.current;

    if (
      !overlay ||
      !progressBar ||
      !fill ||
      !counter ||
      !counterViewport ||
      !hundredsTrack ||
      !tensTrack ||
      !onesTrack
    ) {
      return;
    }

    const progressValue = { value: 0 };
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.dataset.siteLoaderComplete = 'false';
    document.documentElement.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const completeLoader = () => {
        setIsLoaded(true);
        document.documentElement.dataset.siteLoaderComplete = 'true';
        document.documentElement.style.overflow = '';
        window.dispatchEvent(new Event('site-loader:complete'));
      };

      gsap.set(fill, {
        scaleX: 0,
        scaleY: 1,
        transformOrigin: 'left center',
      });

      gsap.set(progressBar, {
        scaleX: 1,
        scaleY: 1,
        transformOrigin: 'center center',
      });
      gsap.set(counter, { autoAlpha: 1 });

      const counterStepHeight = counterViewport.getBoundingClientRect().height || 1;

      const moveDigitTracks = (raw: number) => {
        const clampedRaw = Math.max(0, Math.min(100, raw));
        const hundredsY = -((clampedRaw / 100) * counterStepHeight);
        const tensY = -((clampedRaw / 10) * counterStepHeight);
        const onesY = -(clampedRaw * counterStepHeight);

        // Keep counter perfectly in sync with progress fill.
        gsap.set(hundredsTrack, { y: hundredsY });
        gsap.set(tensTrack, { y: tensY });
        gsap.set(onesTrack, { y: onesY });

        setProgress(Math.round(clampedRaw));
      };

      gsap.set([hundredsTrack, tensTrack, onesTrack], { y: 0 });

      if (prefersReducedMotion) {
        setProgress(100);
        gsap.set(fill, { scaleX: 1 });
        gsap.set(hundredsTrack, { y: -counterStepHeight });
        gsap.set(tensTrack, { y: -(10 * counterStepHeight) });
        gsap.set(onesTrack, { y: -(100 * counterStepHeight) });
        gsap.to(overlay, {
          autoAlpha: 0,
          duration: 0.2,
          onComplete: completeLoader,
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { ease: 'power3.inOut' },
        delay: LOADER_START_DELAY,
      });

      tl.to(progressValue, {
        value: 100,
        duration: PROGRESS_DURATION,
        ease: 'none',
        onUpdate: () => {
          const rawProgress = progressValue.value;
          gsap.set(fill, { scaleX: rawProgress / 100 });
          moveDigitTracks(rawProgress);
        },
      })
        .add(() => {
          setProgress(100);
          gsap.set(fill, { scaleX: 1 });
          gsap.set(hundredsTrack, { y: -counterStepHeight });
          gsap.set(tensTrack, { y: -(10 * counterStepHeight) });
          gsap.set(onesTrack, { y: -(100 * counterStepHeight) });
        })
        .to({}, { duration: AFTER_PROGRESS_HOLD })
        .to(
          progressBar,
          {
            scaleX: 6,
            duration: LINE_EXPAND_X_DURATION,
          },
          '-=0.05'
        )
        .to(
          progressBar,
          {
            scaleY: 900,
            duration: LINE_EXPAND_Y_DURATION,
            ease: 'power4.in',
          },
          '-=0.08'
        )
        .to(
          counter,
          {
            autoAlpha: 0,
            duration: LINE_EXPAND_X_DURATION + LINE_EXPAND_Y_DURATION,
            ease: 'none',
          },
          '<'
        )
        .add(completeLoader)
        .to(overlay, {
          autoAlpha: 0,
          duration: OVERLAY_FADE_OUT_DURATION,
          pointerEvents: 'none',
        });
    }, overlay);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className={isLoaded ? 'opacity-100' : 'opacity-0'}>{children}</div>

      <div
        ref={overlayRef}
        className="pointer-events-auto fixed inset-0 z-9999 bg-[#efefef]"
        data-site-loader-overlay="true"
        aria-hidden={isLoaded}
      >
        <header className="site-header fixed z-20 w-full transition-all duration-700">
          <div className="ca__container relative flex items-center gap-6">
            <div
              className="pointer-events-none relative z-30"
              role="img"
              aria-label="Velocity logo"
            >
              <Image
                src="/images/logo.svg"
                className="relative z-30"
                alt="Velocity"
                width={201}
                height={31}
                priority
              />
            </div>
          </div>
        </header>

        <div
          ref={progressBarRef}
          className="fixed top-1/2 left-1/2 h-0.75 w-screen -translate-x-1/2 -translate-y-1/2 bg-[#ececec]"
        >
          <div ref={fillRef} className="h-full w-full bg-white" />
        </div>

        <div
          ref={counterRef}
          className="font-dm absolute right-6 bottom-6 text-[clamp(1.1rem,2.3vw,2.1rem)] leading-[0.95] font-semibold text-black uppercase tabular-nums md:right-10 md:bottom-10"
        >
          <h1>
            <div className="flex items-center">
              <div ref={counterViewportRef} className="h-[1em] w-[0.6em] overflow-hidden">
                <div ref={hundredsTrackRef}>
                  {[0, 1].map((value, index) => (
                    <div key={`h-${value}-${index}`} className="h-[1em] text-center leading-none">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[1em] w-[0.6em] overflow-hidden">
                <div ref={tensTrackRef}>
                  {DIGIT_LOOP_VALUES.map((value, index) => (
                    <div key={`t-${value}-${index}`} className="h-[1em] text-center leading-none">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
              <div className="h-[1em] w-[0.6em] overflow-hidden">
                <div ref={onesTrackRef}>
                  {DIGIT_LOOP_VALUES.map((value, index) => (
                    <div key={`o-${value}-${index}`} className="h-[1em] text-center leading-none">
                      {value}
                    </div>
                  ))}
                </div>
              </div>
              <span className="ml-[0.08em] leading-none">%</span>
            </div>
            <span className="sr-only">{formatCounter(progress)}</span>
          </h1>
        </div>
      </div>
    </>
  );
}
