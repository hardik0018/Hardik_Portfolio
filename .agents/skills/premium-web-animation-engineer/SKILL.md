---
name: premium-web-animation-engineer
description: >
  Use this skill whenever you need to design, implement, audit, or fix web
  animations in a Next.js / React project. Triggers: adding GSAP animations,
  Three.js or React Three Fiber scenes, scroll-driven effects, parallax,
  3D cards, magnetic hover, cursor interactions, route transitions, WebGL
  backgrounds, shader gradients, particle fields, postprocessing, or any
  animation that needs to feel premium, performant, and production-ready.
  Also use when diagnosing animation jank, memory leaks, hydration issues,
  or reduced-motion violations. Always consult before writing any animation
  code — the wrong approach chosen upfront is expensive to reverse.
---

# Premium Web Animation Engineer

## Core philosophy

Animation is not decoration. Every moving element must earn its place by doing
exactly one of these jobs:

| Job | Example |
|---|---|
| **Focus** — direct the user's eye | Hero text stagger draws attention to the CTA |
| **Depth** — create spatial hierarchy | Parallax layers separate foreground from background |
| **Causality** — show system response | Button press triggers state change animation |
| **Transition** — bridge between states | Route change carries context across pages |
| **Atmosphere** — reinforce brand feeling | Ambient particle field sets tone without demanding attention |

If an animation does none of these, remove it.

---

## Step 0 — Diagnosis before any code

Answer these before choosing a library or writing a line:

```
1. What is the section's job?         (hero, feature, testimonial, CTA…)
2. What triggers the animation?       (load, scroll, hover, drag, route, tick)
3. What is the performance budget?    (background canvas vs. interactive element)
4. What breaks on mobile?             (hover doesn't exist; reduced viewport; thermal throttle)
5. What does reduced-motion need?     (static state must be complete, not broken)
6. What must be cleaned up?           (RAF, event listeners, ScrollTrigger, renderer)
7. Does this need to be in canvas?    (or can CSS + GSAP achieve the same feeling cheaper)
```

**Decision rule:** if CSS transitions + a single GSAP tween achieves 90% of the
effect at 10% of the cost, choose that. Never reach for Three.js to solve a
layout animation problem.

---

## Technology selection guide

| Use case | Best tool | Avoid |
|---|---|---|
| Text reveals, stagger, clip-path | GSAP + CSS | Three.js |
| Scroll-pinned sections | GSAP ScrollTrigger | IntersectionObserver hacks |
| Magnetic hover, cursor glow | GSAP `quickTo()` | Raw `mousemove` + `setState` |
| Route transitions | GSAP + Next.js layout | Framer Motion if GSAP is already bundled |
| 3D card tilt | CSS `perspective` + GSAP | R3F (overkill) |
| WebGL background, shader gradient | Three.js vanilla or R3F | GSAP (wrong domain) |
| Interactive 3D product | R3F + Drei | Vanilla Three.js (too verbose in React) |
| Scroll-driven 3D camera | GSAP ScrollTrigger + R3F | Lenis alone |
| Particle field | Three.js `BufferGeometry` points | CSS particles (not scalable) |
| Postprocessing | `@react-three/postprocessing` | Manual shader passes unless custom |

---

## GSAP in Next.js App Router

### Required setup

```tsx
// Always "use client" — GSAP touches the DOM
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugins ONCE at module level in client code
gsap.registerPlugin(ScrollTrigger);
```

### `useGSAP` — the only correct hook for Next.js

`useGSAP` replaces `useEffect` for all GSAP work. It handles cleanup
automatically, respects React strict mode's double-invoke, and scopes
selectors to the container ref.

```tsx
export function HeroReveal() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scope: all GSAP selectors are relative to `container.current`
      gsap.from(".hero-line", {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.12,
        ease: "power3.out",
      });
    },
    { scope: container }   // critical — prevents selector leaks
  );

  return (
    <div ref={container}>
      <span className="hero-line">Headline</span>
      <span className="hero-line">Subheading</span>
    </div>
  );
}
```

### ScrollTrigger patterns

```tsx
useGSAP(
  () => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: ".section",
        start: "top 80%",
        end: "bottom 20%",
        // scrub: true — only when tying animation tightly to scroll position
        // markers: DEBUG,
        onEnter: () =>
          gsap.to(".section", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }),
      });
    });
    return () => ctx.revert(); // kills all ScrollTriggers in this context
  },
  { scope: container }
);
```

**ScrollTrigger rules:**
- Call `ScrollTrigger.refresh()` after font load or dynamic content changes — not on every render.
- Never create ScrollTriggers inside `useEffect` without a ref guard.
- `scrub` is for progress-tied motion (parallax depth). Not every scroll animation needs scrub.
- Always pair `kill()` or `ctx.revert()` with creation.

### Cursor / magnetic hover — `quickTo()` is mandatory

```tsx
useGSAP(() => {
  const xTo = gsap.quickTo(".cursor", "x", { duration: 0.4, ease: "power3" });
  const yTo = gsap.quickTo(".cursor", "y", { duration: 0.4, ease: "power3" });

  const onMove = (e: MouseEvent) => {
    xTo(e.clientX);
    yTo(e.clientY);
  };

  window.addEventListener("pointermove", onMove);
  return () => window.removeEventListener("pointermove", onMove);
}, {});
```

**Never do `gsap.to(".cursor", {...})` inside `mousemove`.** Each call
creates a new tween. `quickTo` creates one tween and updates its target
value — this is the difference between 60 fps and a memory spiral.

### Properties to animate

```
✅ x, y, xPercent, yPercent
✅ scale, scaleX, scaleY
✅ rotation, rotationX, rotationY
✅ opacity
✅ clipPath (for reveals)
✅ Custom CSS variables (--progress, --glow-opacity)

❌ width, height      — causes layout reflow
❌ top, left          — causes layout reflow
❌ margin, padding    — causes layout reflow
❌ filter (heavy)     — use sparingly; GPU-accelerated but compositing cost is real
```

### `will-change` discipline

```tsx
// Set on enter, remove on complete — never leave it permanently applied
gsap.to(el, {
  x: 200,
  onStart: () => (el.style.willChange = "transform"),
  onComplete: () => (el.style.willChange = "auto"),
});
```

Permanent `will-change` on many elements increases VRAM usage and can
reduce performance on mobile.

---

## Three.js in Next.js (vanilla)

### Minimal production setup

```tsx
"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export function WebGLBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;

    // --- Scene
    const scene = new THREE.Scene();

    // --- Camera: FOV 40-50 = premium. FOV 75+ = cheap fisheye.
    const camera = new THREE.PerspectiveCamera(
      45,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.z = 5;

    // --- Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,        // transparent background — let CSS handle bg color
    });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // mobile guard
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // --- Geometry + Material + Mesh
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 128, 32);
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0.1,
      roughness: 0.2,
      transmission: 0.9,  // glass effect
      thickness: 1.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // --- Lights (minimum set for quality)
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    const key = new THREE.DirectionalLight(0xffffff, 2);
    key.position.set(5, 5, 5);
    scene.add(ambient, key);

    // --- Animation loop (one per scene — no exceptions)
    let rafId: number;
    const tick = () => {
      rafId = requestAnimationFrame(tick);
      mesh.rotation.x += 0.003;
      mesh.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    tick();

    // --- Resize
    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", onResize);

    // --- Cleanup — non-negotiable
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
```

### Memory leak prevention — the full disposal checklist

Every resource allocated must be disposed. No exceptions.

```ts
function disposeScene(scene: THREE.Scene, renderer: THREE.WebGLRenderer) {
  scene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();

      const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of materials) {
        // Dispose all texture slots
        for (const key of Object.keys(mat)) {
          const val = (mat as Record<string, unknown>)[key];
          if (val instanceof THREE.Texture) val.dispose();
        }
        mat.dispose();
      }
    }
  });
  renderer.dispose();
  renderer.forceContextLoss(); // releases WebGL context on component unmount
}
```

### Camera FOV as a design tool

| FOV | Feeling | Use |
|---|---|---|
| 25–35 | Cinematic, compressed, premium | Product hero, detail shot |
| 40–55 | Natural, balanced | General 3D sections |
| 60–75 | Normal, game-like | Interactive explorers |
| 80+ | Distorted, cheap | Avoid |

### Lighting presets

**Premium glass / product:**
```ts
// Soft key + fill + rim
const key   = new THREE.DirectionalLight(0xffffff, 2.5); key.position.set(3, 4, 3);
const fill  = new THREE.DirectionalLight(0x8898ff, 0.8); fill.position.set(-3, 0, -2);
const rim   = new THREE.DirectionalLight(0xffffff, 1.2); rim.position.set(0, -3, -4);
const ambient = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(key, fill, rim, ambient);
```

**Dark premium / moody:**
```ts
const point = new THREE.PointLight(0x6644ff, 4, 10); point.position.set(2, 3, 2);
const ambient = new THREE.AmbientLight(0x110022, 1);
scene.add(point, ambient);
```

### Smooth mouse interaction — lerp pattern

Never bind raw mouse values directly to 3D object properties.

```ts
const mouse = { x: 0, y: 0 };
const target = { x: 0, y: 0 };
const LERP = 0.05; // lower = more drag/inertia

window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
  mouse.y = -(e.clientY / window.innerHeight - 0.5) * 2;
});

// Inside animation loop:
target.x += (mouse.x - target.x) * LERP;
target.y += (mouse.y - target.y) * LERP;
mesh.rotation.y = target.x * 0.4;
mesh.rotation.x = target.y * 0.2;
```

---

## React Three Fiber (R3F)

### Project setup

```bash
npm install three @react-three/fiber @react-three/drei @react-three/postprocessing
npm install -D @types/three
```

### Canonical scene structure

```tsx
// scene/Scene.tsx — "use client"
"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows, PerformanceMonitor } from "@react-three/drei";
import { useState } from "react";

export function Scene() {
  const [dpr, setDpr] = useState<[number, number]>([1, 2]);

  return (
    <Canvas
      dpr={dpr}                           // adaptive DPR range
      camera={{ fov: 45, position: [0, 0, 5] }}
      gl={{ antialias: true, alpha: true }}
    >
      {/* Adaptive quality — degrades DPR on low-end devices */}
      <PerformanceMonitor
        onDecline={() => setDpr([1, 1])}
        onIncline={() => setDpr([1, 2])}
      />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={2} />
      <Environment preset="city" />
      <ContactShadows opacity={0.4} scale={10} blur={2} far={4} />
      <Mesh />
    </Canvas>
  );
}
```

### `useFrame` — performance rules

```tsx
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

function SpinningMesh() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    // delta = time since last frame — use it, not a fixed increment
    // Fixed increments break at different frame rates
    if (!ref.current) return;
    ref.current.rotation.y += delta * 0.5;
  });

  return <mesh ref={ref}><boxGeometry /><meshStandardMaterial /></mesh>;
}
```

**`useFrame` rules:**
- Never call `setState` inside `useFrame` — this re-renders the whole component tree every frame.
- Always use `ref` for per-frame mutations.
- `delta` is your friend — frame-rate-independent motion requires it.
- Expensive calculations (raycasting, physics) belong in `useEffect` or `useCallback`, not `useFrame`.

### Dynamic import — prevent SSR errors

```tsx
// page.tsx (Server Component)
import dynamic from "next/dynamic";

const Scene = dynamic(() => import("@/scene/Scene").then((m) => m.Scene), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black animate-pulse" />,
});
```

### Model loading with Suspense

```tsx
import { Suspense } from "react";
import { useGLTF } from "@react-three/drei";

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

// Preload to avoid pop-in
useGLTF.preload("/models/product.glb");

// Usage
<Canvas>
  <Suspense fallback={null}>
    <Model url="/models/product.glb" />
  </Suspense>
</Canvas>
```

### Postprocessing — subtlety is the standard

```tsx
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

// These values are the "less is more" baseline. Start here, tune down.
<EffectComposer>
  <Bloom
    intensity={0.4}           // NOT 2.0 — bloom at 0.4 reads as premium glow
    luminanceThreshold={0.8}  // only brightest areas bloom
    luminanceSmoothing={0.9}
  />
  <Vignette
    offset={0.3}
    darkness={0.5}
    blendFunction={BlendFunction.NORMAL}
  />
  <ChromaticAberration
    offset={new THREE.Vector2(0.0005, 0.0005)} // almost invisible — that's correct
    radialModulation={false}
  />
</EffectComposer>
```

---

## Scroll + Three.js integration

### GSAP ScrollTrigger driving R3F state

```tsx
"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";

gsap.registerPlugin(ScrollTrigger);

// Shared scroll progress — stored in a ref to avoid React re-render
const progress = { value: 0 };

function ScrollCamera() {
  useFrame(({ camera }) => {
    camera.position.z = 5 - progress.value * 3; // moves from z=5 to z=2 over scroll
  });
  return null;
}

export function ScrollScene() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
          progress.value = self.progress;
        },
      });
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="h-[300vh] relative">
      <div className="sticky top-0 h-screen">
        <Canvas>
          <ScrollCamera />
          {/* scene objects */}
        </Canvas>
      </div>
    </div>
  );
}
```

---

## Reduced motion — non-negotiable

Every animated component must have a static fallback.

```tsx
import { useReducedMotion } from "framer-motion"; // or write your own hook

// Standalone hook
function usePrefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// In GSAP
useGSAP(() => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduced) {
    // Show final state immediately — no motion
    gsap.set(".hero-line", { opacity: 1, y: 0 });
    return;
  }

  gsap.from(".hero-line", { y: 80, opacity: 0, stagger: 0.12, duration: 0.9 });
}, { scope: container });

// In Tailwind
<div className="motion-safe:animate-fade-in motion-reduce:opacity-100" />
```

```css
/* In CSS */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Mobile performance patterns

| Problem | Solution |
|---|---|
| 3D scene lags on phone | `PerformanceMonitor` + adaptive DPR |
| Hover animations fire on touch | Guard with `matchMedia("(hover: hover)")` |
| Heavy particle count | Halve count on `window.innerWidth < 768` |
| Shadows on mobile | Replace with `ContactShadows` (fake, cheap) |
| Large GLB file | Draco compress; use KTX2 textures for serious projects |
| Canvas blocking scroll | `touch-action: none` only on canvas, not page |

```tsx
// Responsive particle count
const PARTICLE_COUNT = window.innerWidth < 768 ? 500 : 2000;
```

---

## Debug mode pattern

Every animation component should support a `DEBUG` flag:

```tsx
const DEBUG = process.env.NODE_ENV === "development" && false;
// ↑ Set to `true` locally. Never ships `true`.

// GSAP
ScrollTrigger.create({
  markers: DEBUG,
  // ...
});

// Three.js
if (DEBUG) {
  scene.add(new THREE.AxesHelper(3));
  scene.add(new THREE.GridHelper(10, 10));
  // Stats.js
  import("stats.js").then(({ default: Stats }) => {
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    // update stats.begin() / stats.end() in animation loop
  });
}
```

---

## Output format

When asked for animation code, always deliver:

1. **Diagnosis** — what the section does and what animation job it needs
2. **Technology decision** — why this tool vs simpler alternatives
3. **Component code** — production-ready, with cleanup, TypeScript, reduced motion
4. **Key decisions** — easing rationale, timing choices, performance tradeoffs
5. **Performance notes** — mobile behavior, memory, GPU cost
6. **Debug notes** — what to enable to tune it

---

## Pre-ship checklist

**Correctness**
- [ ] `"use client"` on all animation components
- [ ] No browser APIs called during SSR (guarded or in `useEffect`/`useGSAP`)
- [ ] No hydration mismatch (no random values, timestamps, or window reads at render)
- [ ] All GSAP plugins registered in client code only

**Performance**
- [ ] Pixel ratio capped at `Math.min(devicePixelRatio, 2)`
- [ ] `will-change` removed after animation completes
- [ ] No `setState` inside `useFrame` or `mousemove`
- [ ] `quickTo` used for cursor/magnetic effects
- [ ] Particle count reduced on mobile
- [ ] Heavy sections lazy-loaded with `dynamic({ ssr: false })`

**Memory**
- [ ] Three.js geometry, material, texture, renderer disposed on unmount
- [ ] `renderer.forceContextLoss()` called on unmount
- [ ] ScrollTrigger instances killed (`ctx.revert()` or `.kill()`)
- [ ] `requestAnimationFrame` cancelled on unmount
- [ ] Event listeners removed on unmount

**Accessibility**
- [ ] `prefers-reduced-motion` respected — static final state shown, not broken layout
- [ ] Important content exists in HTML, not only in canvas
- [ ] Scroll is not trapped or hijacked without escape

**Quality**
- [ ] `markers: true` removed
- [ ] Debug helpers removed
- [ ] No console errors or warnings
- [ ] Tested on a real mid-range Android device (the real performance bar)
- [ ] No layout shift (CLS = 0 for animated elements)
- [ ] Animation feels purposeful, not decorative
