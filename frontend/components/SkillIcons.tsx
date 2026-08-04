import React from 'react';

const Wrap = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full h-full flex items-center justify-center">
        {children}
    </div>
);

export const FigmaIcon = () => (
    <Wrap>
        <svg viewBox="0 0 38 56" width="55%" height="55%" data-testid="icon-figma">
            <path d="M19 28a9.5 9.5 0 1 1 0 19 9.5 9.5 0 0 1 0-19z" fill="#0acf83" />
            <path d="M0 37.5A9.5 9.5 0 0 1 9.5 28H19v9.5a9.5 9.5 0 1 1-19 0z" fill="#a259ff" />
            <path d="M19 0v19h9.5a9.5 9.5 0 1 0 0-19H19z" fill="#ff7262" />
            <path d="M0 9.5A9.5 9.5 0 0 0 9.5 19H19V0H9.5A9.5 9.5 0 0 0 0 9.5z" fill="#f24e1e" />
            <path d="M0 28.5A9.5 9.5 0 0 1 9.5 19H19v19H9.5A9.5 9.5 0 0 1 0 28.5z" fill="#1abcfe" />
        </svg>
    </Wrap>
);

export const FramerIcon = () => (
    <Wrap>
        <svg viewBox="0 0 30 45" width="50%" height="55%" data-testid="icon-framer">
            <path d="M0 0h30v15H15zM0 15h15l15 15H0zM0 30h15v15z" fill="#3b82f6" />
        </svg>
    </Wrap>
);

export const PhotoshopIcon = () => (
    <div className="font-sans font-black text-[1.1rem] text-[#38bdf8] tracking-tighter" data-testid="icon-photoshop">Ps</div>
);

export const ReactIcon = () => (
    <Wrap>
        <svg viewBox="-12 -12 24 24" width="75%" height="75%" data-testid="icon-react">
            <circle r="2" fill="#22d3ee" />
            <g fill="none" stroke="#22d3ee" strokeWidth="1">
                <ellipse rx="10" ry="4.5" />
                <ellipse rx="10" ry="4.5" transform="rotate(60)" />
                <ellipse rx="10" ry="4.5" transform="rotate(120)" />
            </g>
        </svg>
    </Wrap>
);

export const NextIcon = () => (
    <Wrap>
        <svg viewBox="0 0 40 40" width="60%" height="60%" data-testid="icon-nextjs">
            <circle cx="20" cy="20" r="19" fill="none" stroke="#e5e7eb" strokeWidth="1.2" />
            <path d="M14 12v16M14 12l13 16M27 12v9" stroke="#e5e7eb" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </svg>
    </Wrap>
);

export const GSAPIcon = () => (
    <Wrap>
        <svg viewBox="0 0 50 50" width="65%" height="65%" data-testid="icon-gsap">
            <path d="M25 6c-7 6-9 12-9 17 0 7 6 12 12 12 5 0 9-2 11-6-4 4-12 3-12-4 0-4 3-7 7-9 4-2 7-3 9-6-6 0-12 0-18-4z" fill="#c1ff4a" />
        </svg>
    </Wrap>
);

export const ThreeIcon = () => (
    <Wrap>
        <svg viewBox="0 0 40 40" width="60%" height="60%" data-testid="icon-three">
            <circle cx="20" cy="20" r="18" fill="none" stroke="#e5e7eb" strokeWidth="1" />
            <path d="M20 6 L34 30 L6 30 Z" fill="none" stroke="#e5e7eb" strokeWidth="1.2" />
            <path d="M20 6 L20 30 M6 30 L34 30" stroke="#e5e7eb" strokeWidth="0.6" />
        </svg>
    </Wrap>
);

export const TailwindIcon = () => (
    <Wrap>
        <svg viewBox="0 0 50 30" width="75%" height="50%" data-testid="icon-tailwind">
            <path d="M14 6c4-4 8-4 14 0 3 2 5 3 8 3-4 4-8 4-14 0-3-2-5-3-8-3zM6 16c4-4 8-4 14 0 3 2 5 3 8 3-4 4-8 4-14 0-3-2-5-3-8-3z" fill="#22d3ee" />
        </svg>
    </Wrap>
);

export const UIIcon = () => (
    <Wrap>
        <svg viewBox="0 0 50 50" width="65%" height="65%" data-testid="icon-ui">
            <circle cx="13" cy="12" r="4" fill="none" stroke="#facc15" strokeWidth="1.5" />
            <circle cx="37" cy="12" r="4" fill="none" stroke="#facc15" strokeWidth="1.5" />
            <path d="M13 16 L25 30 L37 16" fill="none" stroke="#facc15" strokeWidth="1.5" />
            <path d="M25 30 L25 42" stroke="#facc15" strokeWidth="1.5" />
            <circle cx="25" cy="42" r="3" fill="#facc15" />
        </svg>
    </Wrap>
);

export const IllustratorIcon = () => (
    <div className="font-sans font-black text-[1.1rem] text-[#fb923c] tracking-tighter" data-testid="icon-ai">Ai</div>
);

export const JSIcon = () => (
    <div className="font-sans font-black text-[1.1rem] text-[#facc15] tracking-tighter" data-testid="icon-js">JS</div>
);

export const MotionIcon = () => (
    <Wrap>
        <svg viewBox="0 0 40 40" width="55%" height="55%" data-testid="icon-motion">
            <circle cx="20" cy="20" r="14" fill="none" stroke="#f472b6" strokeWidth="2" />
            <circle cx="20" cy="20" r="3" fill="#f472b6" />
        </svg>
    </Wrap>
);

export const TSIcon = () => (
    <div className="font-sans font-black text-[1.1rem] text-[#3178c6] tracking-tighter" data-testid="icon-ts">TS</div>
);

export const SanityIcon = () => (
    <div className="font-sans font-black text-[1.1rem] text-[#F03E2F] tracking-tighter" data-testid="icon-sanity">S</div>
);

export const N8NIcon = () => (
    <Wrap>
        <svg viewBox="0 0 24 24" width="60%" height="60%" data-testid="icon-n8n">
            <path d="M21.4737 5.6842c-1.1772 0-2.1663.8051-2.4468 1.8947h-2.8955c-1.235 0-2.289.893-2.492 2.111l-.1038.623a1.263 1.263 0 0 1-1.246 1.0555H11.289c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947s-2.1663.8051-2.4467 1.8947H4.973c-.2805-1.0896-1.2696-1.8947-2.4468-1.8947C1.1311 9.4737 0 10.6047 0 12s1.131 2.5263 2.5263 2.5263c1.1772 0 2.1663-.8051 2.4468-1.8947h1.4223c.2804 1.0896 1.2696 1.8947 2.4467 1.8947 1.1772 0 2.1663-.8051 2.4468-1.8947h1.0008a1.263 1.263 0 0 1 1.2459 1.0555l.1038.623c.203 1.218 1.257 2.111 2.492 2.111h.3692c.2804 1.0895 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263c-1.1772 0-2.1664.805-2.4468 1.8947h-.3692a1.263 1.263 0 0 1-1.246-1.0555l-.1037-.623A2.52 2.52 0 0 0 13.9607 12a2.52 2.52 0 0 0 .821-1.4794l.1038-.623a1.263 1.263 0 0 1 1.2459-1.0555h2.8955c.2805 1.0896 1.2696 1.8947 2.4468 1.8947 1.3952 0 2.5263-1.131 2.5263-2.5263s-1.131-2.5263-2.5263-2.5263m0 1.2632a1.263 1.263 0 0 1 1.2631 1.2631 1.263 1.263 0 0 1-1.2631 1.2632 1.263 1.263 0 0 1-1.2632-1.2632 1.263 1.263 0 0 1 1.2632-1.2631M2.5263 10.7368A1.263 1.263 0 0 1 3.7895 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 1.2632 12a1.263 1.263 0 0 1 1.2631-1.2632m6.3158 0A1.263 1.263 0 0 1 10.1053 12a1.263 1.263 0 0 1-1.2632 1.2632A1.263 1.263 0 0 1 7.579 12a1.263 1.263 0 0 1 1.2632-1.2632m10.1053 3.7895a1.263 1.263 0 0 1 1.2631 1.2632 1.263 1.263 0 0 1-1.2631 1.2631 1.263 1.263 0 0 1-1.2632-1.2631 1.263 1.263 0 0 1 1.2632-1.2632" fill="#FF6E6E" />
        </svg>
    </Wrap>
);

export const ICON_MAP: Record<string, React.FC> = {
    figma: FigmaIcon,
    framer: FramerIcon,
    photoshop: PhotoshopIcon,
    react: ReactIcon,
    nextjs: NextIcon,
    gsap: GSAPIcon,
    three: ThreeIcon,
    tailwind: TailwindIcon,
    ui: UIIcon,
    illustrator: IllustratorIcon,
    js: JSIcon,
    motion: MotionIcon,
    ts: TSIcon,
    sanity: SanityIcon,
    n8n: N8NIcon,
};

export const SkillIcon = ({
    name,
    size = 'default',
    color,
}: {
    color?: string;
    name: string;
    size?: 'default' | 'big';
}) => {
    const Comp = ICON_MAP[name] || FigmaIcon;

    const sizeClasses =
        size === 'big'
            ? 'w-[64px] h-[64px] rounded-[18px]'
            : 'w-[52px] h-[52px] rounded-[16px]';

    return (
        <div
            className={`relative p-px shrink-0 overflow-hidden flex items-center justify-center ${sizeClasses}`}
            style={{
                background: `linear-gradient(135deg, ${color ?? 'rgba(255,255,255,0.2)'} 40%, transparent 100%)`,
                boxShadow: `0 8px 24px color-mix(in srgb, ${color ?? 'rgba(255,255,255,0.2)'} 15%, transparent)`,
            }}
        >
            <div
                className="w-full h-full flex items-center justify-center overflow-hidden"
                style={{
                    borderRadius: size === 'big' ? '17px' : '15px',
                    background: `color-mix(in srgb, ${color ?? '#000000'} 8%, #0d0d0d 100%)`,
                }}
            >
                <Comp />
            </div>
        </div>
    );
};
