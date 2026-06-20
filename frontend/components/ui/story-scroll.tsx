'use client';
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
gsap.registerPlugin(ScrollTrigger);
function cx(...parts: Array<string | undefined | false | null>): string {
    return parts.filter(Boolean).join(' ');
}
export interface FlowSectionProps {
    className?: string;
    style?: React.CSSProperties;
    children: React.ReactNode;
    'aria-label'?: string;
}
export const FlowSection: React.FC<FlowSectionProps> = ({
    className,
    style = {},
    children,
    'aria-label': ariaLabel,
}) => (
    <section
        data-flow-section
        aria-label={ariaLabel}
        className={cx('relative min-h-screen w-full overflow-hidden', className)}
    >
        <div
            data-flow-inner
            className={cx(
                'flow-art-container relative flex min-h-screen w-full flex-col justify-between gap-6 px-[4vw] pt-[clamp(2rem,8vw,2vw)] pb-[2vw]',
                'will-change-transform',
            )}
            style={style}
        >
            {children}
        </div>
    </section>
);
export interface FlowArtProps {
    children: React.ReactNode;
    className?: string;
    'aria-label'?: string;
}
const childCount = (children: React.ReactNode) => React.Children.count(children);

// Each entry defines a unique exit animation for cards at that index (cycled via modulo).
// transformOrigin: the pivot point used during the exit
// gsapVars: the GSAP tween target values
const EXIT_CONFIGS: Array<{
    transformOrigin: string;
    gsapVars: gsap.TweenVars;
}> = [
    {
        // Card 0 — Peel right: glides off to the right with a gentle clockwise tilt, fades out
        transformOrigin: 'right center',
        gsapVars: { x: '108vw', rotation: 10, scale: 0.95, opacity: 0, ease: 'power2.inOut' },
    },
    {
        // Card 1 — Float up: rises cleanly out of frame with a whisper of counter-tilt, fades out
        transformOrigin: 'center center',
        gsapVars: { y: '-108vh', rotation: -5, scale: 0.93, opacity: 0, ease: 'power2.inOut' },
    },
    {
        // Card 2 — Slide bottom-left: drifts diagonally down-left, fades out to prevent bleed
        transformOrigin: 'left bottom',
        gsapVars: { x: '-75vw', y: '55vh', rotation: 10, scale: 0.88, opacity: 0, ease: 'power2.inOut' },
    },
    {
        // Card 3 — Shrink-fade: collapses gently to centre with a soft spin and fade
        transformOrigin: 'center center',
        gsapVars: { scale: 0.15, rotation: 45, opacity: 0, ease: 'power2.inOut' },
    },
    {
        // Card 4 — Slam left: pushes off the left edge with a counter-clockwise tilt, fades out
        transformOrigin: 'left center',
        gsapVars: { x: '-108vw', rotation: -10, scale: 0.95, opacity: 0, ease: 'power2.inOut' },
    },
];


const FlowArt: React.FC<FlowArtProps> = ({
    children,
    className,
    'aria-label': ariaLabel = 'Story scroll',
}) => {
    const containerRef = useRef<HTMLElement>(null);
    const [reducedMotion, setReducedMotion] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const update = () => setReducedMotion(mq.matches);
        update();
        mq.addEventListener('change', update);
        return () => mq.removeEventListener('change', update);
    }, []);
    useGSAP(
        () => {
            if (!containerRef.current || reducedMotion) return;
            const sections = Array.from(
                containerRef.current.querySelectorAll<HTMLElement>('[data-flow-section]'),
            );
            if (sections.length === 0) return;

            // Prepare container styles dynamically
            gsap.set(containerRef.current, {
                position: 'relative',
                height: '100vh',
                overflow: 'hidden',
            });

            // Set up absolute stacking layout
            sections.forEach((section, i) => {
                gsap.set(section, {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: sections.length - i,
                });
            });

            // Create a single ScrollTrigger timeline to scrub through each card
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: `+=${(sections.length - 1) * 150}%`,  // 150% per card = slower, more deliberate pace
                    pin: true,
                    anticipatePin: 1,      // eliminates the jerk when pinning starts
                    scrub: 1.8,            // higher lag = silkier, slower trailing animation
                    snap: {
                        snapTo: 1 / (sections.length - 1),
                        duration: { min: 0.6, max: 1.1 },  // generous glide into each card
                        delay: 0.2,
                        ease: 'expo.out',  // decelerates gracefully into the snap point
                    },
                },
            });

            sections.forEach((section, i) => {
                if (i === sections.length - 1) return; // Last card stays visible

                const inner = section.querySelector<HTMLElement>('.flow-art-container');
                if (!inner) return;

                // Pick a unique exit config for this card (cycles if more cards than configs)
                const config = EXIT_CONFIGS[i % EXIT_CONFIGS.length];

                // Apply the per-card transform origin before animating
                gsap.set(inner, { transformOrigin: config.transformOrigin });

                // Animate inner with unique exit style (opacity:0 ensures no bleed-through)
                tl.to(inner, config.gsapVars, i);

                // Once the inner has fully exited, push the whole section behind everything
                // so its invisible body can never intercept clicks or show through the last card
                tl.set(section, { zIndex: -1 }, `${i}+=0.99`);
            });

            return () => {
                // ScrollTrigger timeline and animations will be automatically killed by useGSAP
            };
        },
        { scope: containerRef, dependencies: [childCount(children), reducedMotion] },
    );
    return (
        <main
            ref={containerRef}
            aria-label={ariaLabel}
            className={cx('w-full overflow-hidden', className)}
        >
            {children}
        </main>
    );
};
export default FlowArt;