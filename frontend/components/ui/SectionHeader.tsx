import { cn } from "@/lib/utils";

export const SectionHeader = ({
    title,
    subtitle,
    variant = "primary"
}: {
    title: string;
    subtitle?: string;
    variant?: "primary" | "secondary";
}) => {
    return (
        <div className="relative z-10 mx-auto mb-14 max-w-4xl text-center">
            <div className="relative mx-auto w-fit">
                <svg aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 h-[96px] w-[640px] max-w-[96vw] -translate-x-1/2 -translate-y-1/2 overflow-visible" viewBox="0 0 640 96" fill="none">
                    <path d="M7 66C85 19 255 24 365 30C507 38 645 9 622 37C594 70 361 69 198 56C72 45 2 88 7 66Z" stroke={variant === "primary" ? "#555" : "#bce944"} strokeOpacity="0.45" strokeWidth="1.2" />
                    <defs>
                        <filter id="skillSpark" x="70" y="22" width="482" height="54" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>
                </svg>
                <h2 className={cn("relative font-display text-[4rem] leading-[0.9] tracking-normal text-white drop-shadow-[0_6px_20px_rgba(255,255,255,0.08)] sm:text-[5.3rem] lg:text-[6rem]", variant === "primary" ? "text-foreground" : "text-background")}>
                    {title}
                </h2>
            </div>
            {subtitle && <p className={cn("mx-auto mt-7 max-w-[420px] font-sans text-[1.05rem] leading-snug text-white/62", variant === "primary" ? "text-foreground" : "text-background")}>
                {subtitle}
            </p>}
        </div>

    );
};