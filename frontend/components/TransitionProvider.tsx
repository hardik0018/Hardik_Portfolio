"use client";

import { createContext, useContext, useRef, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { buildCloth, animateClothWhisk, animateClothDrop, ClothState } from "@/lib/clothPhysics";

interface TransitionContextValue {
  triggerTransition: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export const useTransition = () => {
  const context = useContext(TransitionContext);
  if (!context) throw new Error("useTransition must be used within a TransitionProvider");
  return context;
};

export default function TransitionProvider({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const clothStateRef = useRef<ClothState | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // We only draw when transitioning
  const triggerTransition = (href: string) => {
    // If we're already animating or it's the same page, do nothing
    if (isAnimating || pathname === href) {
      if (pathname === href) router.push(href);
      return;
    }

    setIsAnimating(true);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
    
    // We recreate the cloth fresh for the drop
    clothStateRef.current = buildCloth(W, H);

    // 1. Drop the cloth
    animateClothDrop(canvas, clothStateRef.current, () => {
      // 2. Change the route behind the cloth
      router.push(href);
      
      // We give it a tiny delay to ensure the DOM paints the new route before we whisk it away
      setTimeout(() => {
        // 3. Whisk the cloth away (majestically)
        if (canvas && clothStateRef.current) {
          animateClothWhisk(canvas, clothStateRef.current, null, () => {
            setIsAnimating(false);
          });
        }
      }, 100);
    });
  };

  useEffect(() => {
    // Handle resize if mid-transition
    const onResize = () => {
      if (!isAnimating) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const nW = window.innerWidth, nH = window.innerHeight;
      canvas.width = nW;
      canvas.height = nH;
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, [isAnimating]);

  return (
    <TransitionContext.Provider value={{ triggerTransition }}>
      {children}
      {/* 
        This canvas overlay sits above EVERYTHING during a transition.
        pointer-events-none ensures we can't interact with it unless we explicitly want to.
      */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-99999 pointer-events-none"
      />
    </TransitionContext.Provider>
  );
}
