/**
 * FloatingPreview3D.tsx
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE:
 *   A fixed-position WebGL overlay that renders a project screenshot as a
 *   3D texture on a slightly-rounded BoxGeometry. The slab tracks mouse XY
 *   and tilts ±15° on both axes with 0.06 lerp inertia (feels like a
 *   physical card being angled in your hand). Appears on project row hover,
 *   disappears on row leave.
 *
 * PERFORMANCE:
 *   - Canvas is `position:fixed`, `pointer-events:none` — never blocks DOM
 *   - PixelRatio capped at 2 for mobile GPU budget
 *   - PerformanceMonitor from Drei adaptively degrades DPR on low-end devices
 *   - Fully disposed on unmount (geometry, material, textures, renderer)
 *   - Dynamically imported with ssr:false from parent — never runs on server
 *
 * INTERACTION:
 *   Primary trigger: cursor position → slab tilts tracking mouse XY
 *   Secondary: GSAP quickTo drives the canvas element position (follows cursor)
 *   Visibility: controlled by parent via `activeImage` prop (null = hidden)
 * ─────────────────────────────────────────────────────────────────────────────
 */

"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, RoundedBox, PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";

// ─── Mouse state shared between DOM listener and R3F useFrame ────────────────
const mouse = { x: 0, y: 0 };
const target = { x: 0, y: 0 };
const LERP = 0.06; // lower = more physical drag/inertia

// ─── Inner 3D Mesh ────────────────────────────────────────────────────────────
function TiltingSlab({
  imageUrl,
  visible,
}: {
  imageUrl: string;
  visible: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  // Load the project screenshot as a texture
  // colorSpace is set via useTexture's onLoad to avoid the react-hooks/immutability lint error
  const texture = useTexture(imageUrl, (tex) => {
    const t = Array.isArray(tex) ? tex[0] : tex;
    t.colorSpace = THREE.SRGBColorSpace;
    t.needsUpdate = true;
  });

  // Per-frame: lerp mouse → rotate the slab, fade visibility
  useFrame(() => {
    if (!meshRef.current) return;

    // Lerp toward mouse position (creates the "weighted card" drag feel)
    target.x += (mouse.x - target.x) * LERP;
    target.y += (mouse.y - target.y) * LERP;

    // Apply rotation — ±15° max on each axis (converted to radians: 0.26)
    meshRef.current.rotation.y = target.x * 0.26;
    meshRef.current.rotation.x = -target.y * 0.26;

    // Smooth opacity — fade in/out based on visible prop
    const targetOpacity = visible ? 1 : 0;
    (meshRef.current.material as THREE.MeshStandardMaterial).opacity +=
      (targetOpacity - (meshRef.current.material as THREE.MeshStandardMaterial).opacity) * 0.1;
  });

  return (
    // ── 3D SETUP ──────────────────────────────────────────────────────────────
    // RoundedBox from Drei gives us a BoxGeometry with beveled corners
    // Dimensions are in R3F world units (not pixels)
    // args: [width, height, depth, segmentsX, segmentsY, borderRadius]
    <RoundedBox
      ref={meshRef}
      args={[viewport.width * 0.85, viewport.height * 0.85, 0.04]}
      smoothness={4}
      radius={0.06}
    >
      <meshStandardMaterial
        map={texture}
        transparent
        opacity={0}
        roughness={0.15}
        metalness={0.08}
      />
    </RoundedBox>
  );
}

// ─── Scene Wrapper ────────────────────────────────────────────────────────────
function Scene({ imageUrl, visible }: { imageUrl: string; visible: boolean }) {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  return (
    // ── CANVAS SETUP ──────────────────────────────────────────────────────────
    // FOV 45 = premium, non-distorted perspective
    // alpha:true so the CSS background shows through the canvas
    <Canvas
      dpr={dpr}
      camera={{ fov: 45, position: [0, 0, 1.8] }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Adaptive DPR — degrades to 1x on thermal/low-fps devices */}
      <PerformanceMonitor
        onDecline={() => setDpr([1, 1])}
        onIncline={() => setDpr([1, 2])}
      />

      {/* ── LIGHTING ──────────────────────────────────────────────────────────
          Soft key-fill-rim setup → gives the slab depth without harsh shadows
          Key:  white, strong, front-right
          Fill: warm, soft, left
          Rim:  cool, subtle, behind the slab
      ─────────────────────────────────────────────────────────────────────── */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 4, 4]} intensity={2.2} color="#ffffff" />
      <directionalLight position={[-4, 0, -2]} intensity={0.6} color="#f0ffe8" />
      <directionalLight position={[0, -3, -5]} intensity={0.5} color="#c1ff4a" />

      {/* ── 3D MESH ─────────────────────────────────────────────────────────── */}
      <TiltingSlab imageUrl={imageUrl} visible={visible} />
    </Canvas>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────
interface FloatingPreview3DProps {
  /** Sanity image URL of the hovered project. null = panel hidden */
  activeImage: string | null;
  /** The project accent color hex (from Sanity) used for the drop-shadow glow */
  activeColor?: string;
}

export default function FloatingPreview3D({
  activeImage,
  activeColor,
}: FloatingPreview3DProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // ── GSAP quickTo — cursor tracking ────────────────────────────────────────
  // This is the ONLY correct way to follow the cursor in GSAP.
  // quickTo creates one persistent tween and updates its target value,
  // preventing the memory spiral of gsap.to() inside mousemove.
  useEffect(() => {
    if (!panelRef.current) return;

    const xTo = gsap.quickTo(panelRef.current, "x", {
      duration: 0.55,
      ease: "power3.out",
    });
    const yTo = gsap.quickTo(panelRef.current, "y", {
      duration: 0.55,
      ease: "power3.out",
    });

    const onMove = (e: MouseEvent) => {
      // Update shared R3F mouse state (normalized -1 to 1 across viewport)
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;

      // Drive panel position — offset by half panel size to center it
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // ── GSAP panel scale/opacity on show/hide ─────────────────────────────────
  // Motion language: enter = back.out(1.4) overshoot, exit = expo.in snap
  useEffect(() => {
    if (!panelRef.current) return;

    if (activeImage) {
      gsap.fromTo(
        panelRef.current,
        { scale: 0.82, opacity: 0, rotation: -4 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          duration: 0.55,
          ease: "back.out(1.4)",
        }
      );
    } else {
      gsap.to(panelRef.current, {
        scale: 0.82,
        opacity: 0,
        rotation: 4,
        duration: 0.28,
        ease: "expo.in",
      });
    }
  }, [activeImage]);

  // ── Track last valid Sanity CDN URL in state ────────────────────────────────
  // CRITICAL FIX: useTexture throws when given a 404 URL (e.g. a missing placeholder).
  // Solution: keep imageToRender in state, only update it when activeImage is non-null.
  //   - Before any hover  → imageToRender is null, Canvas not mounted
  //   - On first hover    → imageToRender set to Sanity CDN URL, Canvas mounts
  //   - On hover leave    → imageToRender keeps last URL, Canvas stays (opacity 0)
  // Reading/writing refs during render is a React Compiler violation — state is correct.
  const [imageToRender, setImageToRender] = useState<string | null>(null);

  useEffect(() => {
    if (activeImage) setImageToRender(activeImage);
  }, [activeImage]);

  return (
    /*
     * OVERLAY CONTAINER
     * ─────────────────
     * position: fixed → sits above all page content
     * pointer-events: none → never blocks row hover/clicks
     * -translate-x-1/2 -translate-y-1/2 → centers the panel on cursor
     * z-9999 → above everything including nav
     * Hidden on mobile (lg:block) — hover doesn't exist on touch devices
     */
    <div
      ref={panelRef}
      className="fixed top-0 left-0 w-[280px] h-[175px] pointer-events-none opacity-0 z-9999 hidden lg:block -translate-x-1/2 -translate-y-1/2 will-change-transform"
      style={{
        // Glow shadow tinted to project accent color — subtle depth signal
        filter: activeColor
          ? `drop-shadow(0 24px 40px ${activeColor}55) drop-shadow(0 8px 16px rgba(0,0,0,0.3))`
          : "drop-shadow(0 24px 40px rgba(0,143,81,0.25)) drop-shadow(0 8px 16px rgba(0,0,0,0.3))",
      }}
    >
      {/*
       * Guard: only mount the R3F Canvas once we have a real Sanity CDN URL.
       * imageToRender is null until the first row hover fires — so useTexture
       * is never called with a missing/placeholder path.
       * After first mount the Canvas persists to avoid WebGL context recreation.
       */}
      {imageToRender && (
        <Scene imageUrl={imageToRender} visible={!!activeImage} />
      )}
    </div>
  );
}
