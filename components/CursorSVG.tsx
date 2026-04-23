// ─── Variant map — using semantic CSS variables ──────────────────────────────
const variants = {
    white: { fill: "#ffffff", stroke: "rgba(0,0,0,0.2)" },
    black: { fill: "#000000", stroke: "rgba(255,255,255,0.2)" },
    violet: { fill: "hsl(var(--label-violet))", stroke: "rgba(0,0,0,0.15)" },
    accent: { fill: "hsl(var(--highlight))", stroke: "rgba(0,0,0,0.15)" },
    you: { fill: "hsl(var(--cursor-you))", stroke: "rgba(0,0,0,0.1)" },
    hardik: { fill: "hsl(var(--cursor-hardik))", stroke: "rgba(0,0,0,0.15)" },
} as const;

export type CursorVariant = keyof typeof variants;

interface CursorSVGProps {
    /** Tailwind class or arbitrary color override on the wrapper */
    className?: string;
    /** Predefined theme color. Defaults to "white". */
    variant?: CursorVariant;
    /** Direct color override — takes precedence over variant */
    color?: string;
    size?: number;
}

export default function CursorSVG({
    className,
    variant = "white",
    color,
    size = 24,
}: CursorSVGProps) {
    const resolved = variants[variant];
    const fill = color ?? resolved.fill;
    const stroke = resolved.stroke;

    return (
        <svg
            className={className}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
            style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.25))" }}
        >
            <path
                d="M5.5 3.21V20.89C5.5 22.41 7.31 23.15 8.35 22.04L13.59 16.49C13.84 16.22 14.19 16.07 14.56 16.07H21.57C23.03 16.07 23.75 14.3 22.71 13.27L8.47 2.37C7.62 1.72 6.37 2.32 6.37 3.4L5.5 3.21Z"
                fill={fill}
                stroke={stroke}
                strokeWidth="0.8"
                strokeLinejoin="round"
            />
        </svg>
    );
}