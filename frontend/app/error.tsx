"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console or error service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] bg-[#0a0a0a] text-white relative overflow-hidden px-6 text-center select-none font-sans">
      {/* Red error glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <h1 className="relative z-10 text-[6rem] sm:text-[9rem] font-bold tracking-tighter leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-600 drop-shadow-2xl">
        Oops
      </h1>

      <p className="relative z-10 text-lg sm:text-xl text-zinc-400 max-w-md mx-auto mt-4 font-body font-light">
        Something unexpected occurred. Our systems are working on resolving this.
      </p>

      {error.digest && (
        <p className="relative z-10 text-xs text-zinc-600 font-mono mt-2">
          Digest: {error.digest}
        </p>
      )}

      <div className="relative z-10 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button
          onClick={reset}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest bg-[var(--accent-lime)] text-[#0a0a0a] transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(193,255,74,0.4)] cursor-pointer"
        >
          Try Again
        </button>

        <Link
          href="/"
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-widest bg-zinc-900 border border-zinc-800 text-white transition-all duration-300 hover:bg-zinc-800 hover:border-zinc-700 hover:scale-105"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
