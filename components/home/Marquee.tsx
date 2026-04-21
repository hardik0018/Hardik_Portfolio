"use client";

export default function Marquee() {
  const words = [
    "MERN Stack", "Next.js", "Three.js", "TypeScript",
    "Node.js", "MongoDB", "GSAP", "UI Engineering",
    "WebGL", "React", "Motion Design", "Tailwind"
  ];

  return (
    <div
      className="relative overflow-hidden select-none py-5"
      style={{
        background: "var(--accent)",
        borderTop: "1px solid rgba(0,0,0,0.08)",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
      }}
    >
      {/* Left gradient fade */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(90deg, var(--accent), transparent)" }} />
      {/* Right gradient fade */}
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
        style={{ background: "linear-gradient(-90deg, var(--accent), transparent)" }} />

      <div className="flex whitespace-nowrap gap-0">
        {[...Array(2)].map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-0 flex-shrink-0"
            style={{ animation: "marquee-track 28s linear infinite" }}
          >
            {words.map((word, j) => (
              <span
                key={j}
                className="inline-flex items-center gap-8 text-[11px] font-black uppercase tracking-[0.35em]"
                style={{ color: "var(--bg)", fontFamily: "var(--font-cabinet)", paddingRight: "48px" }}
              >
                {word}
                <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                  <circle cx="3" cy="3" r="3" fill="var(--bg)" fillOpacity="0.4" />
                </svg>
              </span>
            ))}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee-track {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}