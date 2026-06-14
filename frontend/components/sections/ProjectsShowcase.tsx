"use client";

import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SectionHeader } from "@/components/ui/SectionHeader";
import ProjectCard3D from "./ProjectCard3D";
import { SanityProject } from "./Projects";
import { Settings, X, RotateCcw } from "lucide-react";

// Dynamic check for prefers-reduced-motion
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    mediaQuery.addEventListener("change", listener);
    return () => mediaQuery.removeEventListener("change", listener);
  }, []);

  return reduced;
}

// Scene helpers (3D grid and axes)
function SceneHelpers() {
  return (
    <>
      <gridHelper args={[30, 30, "#008f51", "#222222"]} position={[0, -2, 0]} />
      <axesHelper args={[5]} />
    </>
  );
}

// Helper component to smoothly rotate scroll progress in 3D cylinder
function ScrollGroup({
  children,
  scrollProgress,
  projectsCount,
}: {
  children: React.ReactNode;
  scrollProgress: React.MutableRefObject<number>;
  projectsCount: number;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current || projectsCount <= 1) return;

    // Exact scroll alignment:
    // Scroll progress 0 maps to rotation 0 (Project 0 is at front)
    // Scroll progress 1 maps to bringing the last project to the front.
    // Last project is at angle = (projectsCount - 1) * (2 * Math.PI / projectsCount).
    // To bring a card at angle theta to the front, group rotation must be -theta.
    const totalAngle = ((projectsCount - 1) * 2 * Math.PI) / projectsCount;
    const targetRotationY = -scrollProgress.current * totalAngle;

    // Smooth lerp for rotation
    groupRef.current.rotation.y += (targetRotationY - groupRef.current.rotation.y) * 0.085;
  });

  return <group ref={groupRef}>{children}</group>;
}

export default function ProjectsShowcase({ initialData }: { initialData?: SanityProject[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Hydration safety: only activate WebGL Canvas client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  // Screen size tracking for responsive 3D layout spacing
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 1024;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const radius = isMobile ? 3.5 : 4.8;
  const cameraZ = radius + (isMobile ? 5.5 : 6.2);
  const cameraY = isMobile ? 0.25 : 0.05;

  // Debug Panel States
  const [debugOpen, setDebugOpen] = useState(true);
  const [wireframe, setWireframe] = useState(false);
  const [showHelpers, setShowHelpers] = useState(false);
  const [frequencyX, setFrequencyX] = useState(2.2);
  const [frequencyY, setFrequencyY] = useState(1.6);
  const [amplitude, setAmplitude] = useState(0.14);
  const [windSpeed, setWindSpeed] = useState(2.4);

  const resetDebugSettings = () => {
    setWireframe(false);
    setShowHelpers(false);
    setFrequencyX(2.2);
    setFrequencyY(1.6);
    setAmplitude(0.14);
    setWindSpeed(2.4);
  };

  const projects = initialData || [];

  // Shared scroll progress ref (prevents React render loops on frame updates)
  const scrollProgress = useRef(0);

  // GSAP Pinning and Horizontal Scroll Animation
  useGSAP(
    () => {
      if (!mounted || prefersReducedMotion || projects.length === 0) return;

      // Register ScrollTrigger to update our scroll progress ref
      const trigger = ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        markers: true,
        scrub: 1.0,
        onUpdate: (self) => {
          scrollProgress.current = self.progress;
        },
      });

      // Force recalculation of page metrics on mount
      ScrollTrigger.refresh();

      return () => {
        trigger.kill();
      };
    },
    { scope: containerRef, dependencies: [mounted, projects, prefersReducedMotion] }
  );

  return (
    <main
      ref={containerRef}
      id="projects"
      className="relative z-30 bg-background w-full h-[350vh] overflow-visible"
    >
      {/* Hidden for search crawlers / SEO compliance */}
      <h1 className="sr-only">Projects Portfolio Showcase by Hardik Vatukiya — Waving Flags WebGL Animation</h1>

      {/* Sticky view holds title, canvas, and layout overlays */}
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden bg-background"
      >
        {/* Section Header */}
        <div className="w-full bg-background border-b border-border z-30 pt-6 md:pt-8 pb-3 px-6 md:px-12">
          <SectionHeader title="Projects" />
        </div>

        {/* 3D WebGL Canvas container */}
        <div className="relative w-full h-[60vh] md:h-[65vh] flex-1 overflow-hidden select-none">
          <Canvas
            shadows
            camera={{ fov: 45, position: [0, cameraY, cameraZ] }}
            gl={{ antialias: true, alpha: true }}
          >
            <ambientLight intensity={0.65} />
            <directionalLight
              position={[5, 10, 5]}
              intensity={2.0}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
            />

            {/* Conditionally show axes and grid helpers */}
            {showHelpers && <SceneHelpers />}

            {/* Cylinder Scroll group driven by R3F useFrame & scroll ref */}
            <ScrollGroup scrollProgress={scrollProgress} projectsCount={projects.length}>
              {projects.map((project, index) => {
                const angle = index * ((2 * Math.PI) / projects.length);
                const x = radius * Math.sin(angle);
                const z = radius * Math.cos(angle);
                return (
                  <ProjectCard3D
                    key={project._id}
                    project={project}
                    index={index}
                    position={[x, 0.2, z]}
                    rotation={[0, angle, 0]}
                    radius={radius}
                    wireframe={wireframe}
                    frequencyX={frequencyX}
                    frequencyY={frequencyY}
                    amplitude={amplitude}
                    windSpeed={windSpeed}
                  />
                );
              })}
            </ScrollGroup>
          </Canvas>
        </div>

        {/* Scroll indicator bar at bottom */}
        <div className="w-full border-t border-border bg-background py-4 px-6 md:px-12 flex justify-between items-center text-[10px] font-mono text-text-muted uppercase tracking-widest z-30">
          <span>Scroll to slide projects</span>
          <div className="flex items-center gap-4">
            <span>01 — 0{projects.length}</span>
            <button
              onClick={() => setDebugOpen(!debugOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-border hover:border-accent-primary hover:text-foreground rounded-lg transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              Playground
            </button>
          </div>
        </div>
      </div>

      {/* Interactive WebGL Playground Control Panel (Debug Mode) */}
      <div
        className={`fixed bottom-20 right-6 z-100 max-w-[300px] w-full bg-card-bg/95 border border-border/80 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] backdrop-blur-md transition-all duration-300 font-sans ${debugOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
          }`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-4">
          <div>
            <h4 className="font-display font-bold text-sm text-foreground uppercase tracking-tight flex items-center gap-1.5">
              Shader Playground
            </h4>
            <p className="text-[9px] font-mono text-text-muted uppercase tracking-widest">
              Interactive WebGL Controls
            </p>
          </div>
          <button
            onClick={() => setDebugOpen(false)}
            className="p-1 rounded-lg hover:bg-bg-secondary text-text-muted hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Wireframe toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-foreground font-semibold">Wireframe Mode</span>
            <input
              type="checkbox"
              checked={wireframe}
              onChange={(e) => setWireframe(e.target.checked)}
              className="accent-accent-primary w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Helpers toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-foreground font-semibold">Scene Helpers</span>
            <input
              type="checkbox"
              checked={showHelpers}
              onChange={(e) => setShowHelpers(e.target.checked)}
              className="accent-accent-primary w-4 h-4 cursor-pointer"
            />
          </div>

          {/* Wave Amplitude */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1">
              <span>Wave Height</span>
              <span>{amplitude.toFixed(2)}m</span>
            </div>
            <input
              type="range"
              min="0.02"
              max="0.35"
              step="0.01"
              value={amplitude}
              onChange={(e) => setAmplitude(parseFloat(e.target.value))}
              className="w-full accent-accent-primary h-1 bg-bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Wind Speed */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1">
              <span>Wind Speed</span>
              <span>{windSpeed.toFixed(1)}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="5.0"
              step="0.1"
              value={windSpeed}
              onChange={(e) => setWindSpeed(parseFloat(e.target.value))}
              className="w-full accent-accent-primary h-1 bg-bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Frequency X */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1">
              <span>Horizontal Waves</span>
              <span>{frequencyX.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={frequencyX}
              onChange={(e) => setFrequencyX(parseFloat(e.target.value))}
              className="w-full accent-accent-primary h-1 bg-bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Frequency Y */}
          <div>
            <div className="flex justify-between text-[10px] font-mono text-text-muted mb-1">
              <span>Vertical Ripples</span>
              <span>{frequencyY.toFixed(1)}</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="4.0"
              step="0.1"
              value={frequencyY}
              onChange={(e) => setFrequencyY(parseFloat(e.target.value))}
              className="w-full accent-accent-primary h-1 bg-bg-secondary rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Buttons */}
          <button
            onClick={resetDebugSettings}
            className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 border border-border hover:border-accent-primary hover:text-foreground text-xs font-mono text-text-muted rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset Shader Physics
          </button>
        </div>
      </div>
    </main>
  );
}
