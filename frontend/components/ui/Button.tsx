"use client";

import React, { useRef, useCallback } from "react";
import gsap from "gsap";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
}

// ── Shape types for the explosion pieces ──────────────────────────────────────

type ShapeKind = "circle" | "rect" | "triangle" | "diamond";

const SHAPES: ShapeKind[] = ["circle", "rect", "triangle", "diamond"];

const COLORS = [
    "var(--accent-primary)",
    "var(--accent-secondary)",
    "#ffffff",
    "var(--accent-primary)",
    "var(--accent-secondary)",
];

function createPiece(
    x: number,
    y: number,
    kind: ShapeKind,
    color: string,
    size: number
): SVGSVGElement {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("xmlns", ns);
    svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));

    Object.assign(svg.style, {
        position: "fixed",
        top: "0px",
        left: "0px",
        transform: `translate3d(${x}px, ${y}px, 0)`,
        pointerEvents: "none",
        zIndex: "9999",
        overflow: "visible",
        willChange: "transform, opacity",
    });

    let shape: SVGElement;

    if (kind === "circle") {
        shape = document.createElementNS(ns, "circle");
        shape.setAttribute("cx", String(size / 2));
        shape.setAttribute("cy", String(size / 2));
        shape.setAttribute("r", String(size / 2));
    } else if (kind === "rect") {
        shape = document.createElementNS(ns, "rect");
        shape.setAttribute("width", String(size));
        shape.setAttribute("height", String(size * 0.6));
        shape.setAttribute("rx", "2");
    } else if (kind === "triangle") {
        shape = document.createElementNS(ns, "polygon");
        const h = size * 0.866;
        shape.setAttribute("points", `${size / 2},0 ${size},${h} 0,${h}`);
    } else {
        // diamond
        shape = document.createElementNS(ns, "polygon");
        const h = size / 2;
        shape.setAttribute("points", `${h},0 ${size},${h} ${h},${size} 0,${h}`);
    }

    shape.setAttribute("fill", color);
    svg.appendChild(shape);
    document.body.appendChild(svg);
    return svg;
}

function explode(originX: number, originY: number) {
    const COUNT = 30;
    const GRAVITY = 420; // px/s²
    const pieces: Array<{
        el: SVGSVGElement;
        vx: number;
        vy: number;
        elapsed: number;
        lifetime: number;
        initialX: number;
        initialY: number;
    }> = [];

    for (let i = 0; i < COUNT; i++) {
        const angle = gsap.utils.random(235, 305); // upward arc spread (degrees, 270=straight up)
        const speed = gsap.utils.random(280, 580);  // px/s
        const rad = (angle * Math.PI) / 180;

        const kind = SHAPES[Math.floor(Math.random() * SHAPES.length)];
        const color = COLORS[Math.floor(Math.random() * COLORS.length)];
        const size = Math.round(gsap.utils.random(5, 14));

        const el = createPiece(originX - size / 2, originY - size / 2, kind, color, size);

        // Initial GSAP scale + rotate entrance burst
        gsap.set(el, { scale: 0, rotate: gsap.utils.random(-60, 60) });
        gsap.to(el, { scale: 1, duration: 0.12, ease: "back.out(2)" });

        pieces.push({
            el,
            vx: Math.cos(rad) * speed,
            vy: Math.sin(rad) * speed, // negative = up on screen
            elapsed: 0,
            lifetime: gsap.utils.random(0.8, 1.5),
            initialX: originX - size / 2,
            initialY: originY - size / 2,
        });
    }

    let lastTime = 0;
    let remaining = pieces.length;

    const tickId = gsap.ticker.add((time) => {
        if (lastTime === 0) { lastTime = time; return; }
        const dt = time - lastTime;
        lastTime = time;

        for (const p of pieces) {
            if (!p.el.parentNode) continue;

            p.elapsed += dt;
            const t = p.elapsed;

            if (t >= p.lifetime) {
                p.el.remove();
                remaining--;
                if (remaining <= 0) gsap.ticker.remove(tickId);
                continue;
            }

            // Projectile motion: x = x0 + vx·t, y = y0 + vy·t + ½·g·t²
            const px = p.initialX + p.vx * t;
            const py = p.initialY + p.vy * t + 0.5 * GRAVITY * t * t;
            const progress = t / p.lifetime;

            gsap.set(p.el, {
                x: px,
                y: py,
                opacity: progress < 0.6 ? 1 : 1 - (progress - 0.6) / 0.4,
                rotate: `+=${dt * gsap.utils.random(180, 480)}`,
                overwrite: false,
            });
        }
    });
}

// ── Component ─────────────────────────────────────────────────────────────────

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className = "",
            variant = "primary",
            size = "md",
            isLoading,
            disabled,
            onClick,
            children,
            ...props
        },
        ref
    ) => {
        const btnRef = useRef<HTMLButtonElement | null>(null);

        const variants = {
            primary:
                "bg-accent-primary text-background hover:opacity-90 active:scale-95",
            secondary:
                "bg-accent-secondary text-foreground hover:opacity-90 active:scale-95",
            outline:
                "border border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-background active:scale-95",
            ghost: "text-foreground hover:bg-bg-secondary active:scale-95",
            danger: "bg-red-600 text-foreground hover:brightness-110 active:scale-95",
        };

        const sizes = {
            sm: "px-2 py-1 text-xs",
            md: "px-4 py-2 text-sm",
            lg: "px-6 py-3 text-lg",
        };

        const handleClick = useCallback(
            (e: React.MouseEvent<HTMLButtonElement>) => {
                if (variant === "primary" && !disabled && !isLoading) {
                    // Determine explosion origin from click coords
                    const rect = (btnRef.current ?? e.currentTarget).getBoundingClientRect();
                    const ox = e.clientX > 0 ? e.clientX : rect.left + rect.width / 2;
                    const oy = e.clientY > 0 ? e.clientY : rect.top + rect.height / 2;
                    explode(ox, oy);
                }
                onClick?.(e);
            },
            [variant, disabled, isLoading, onClick]
        );

        const setRefs = useCallback(
            (el: HTMLButtonElement | null) => {
                btnRef.current = el;
                if (typeof ref === "function") ref(el);
                else if (ref) (ref as React.MutableRefObject<HTMLButtonElement | null>).current = el;
            },
            [ref]
        );

        return (
            <button
                ref={setRefs}
                disabled={disabled || isLoading}
                onClick={handleClick}
                className={`inline-flex items-center cursor-pointer  justify-center font-bold uppercase tracking-tighter transition-all duration-instant focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${isLoading ? "animate-pulse cursor-wait" : ""} ${className}`}
                {...props}
            >
                {isLoading ? "Loading..." : children}
            </button>
        );
    }
);

Button.displayName = "Button";

export { Button };
