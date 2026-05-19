import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden px-6 text-center select-none font-sans">
      {/* Premium Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-(--accent-lime)/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative lines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-size-[24px_24px] pointer-events-none" />

      <h1 className="relative z-10 text-[9rem] sm:text-[12rem] font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-linear-to-b from-white to-[#333] drop-shadow-2xl">
        404
      </h1>

      <p className="relative z-10 text-lg sm:text-2xl text-zinc-400 max-w-md mx-auto mt-4 font-body font-light">
        The destination you are looking for has faded into the background.
      </p>

      <div className="relative z-10 mt-10">
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest bg-(--accent-lime) text-[#0a0a0a] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(193,255,74,0.4)]"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
