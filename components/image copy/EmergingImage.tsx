"use client";

import EmergeMaterial from "./EmergeMaterial";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import * as THREE from "three";
import { getSharedRenderer } from "./sharedRenderer";

const PIXELS = [
  1, 1.5, 2, 2.5, 3, 1, 1.5, 2, 2.5, 3, 3.5, 4, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5,
  6, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 20, 100,
].map((v) => v / 100);

interface EmergingImageProps {
  url: string;
  type?: number;
  fillColor?: string;
  className?: string;
  style?: React.CSSProperties;
  borderRadius?: number;
}

export default function EmergingImage({
  url,
  type = 0,
  fillColor = "#403fb7",
  className,
  style,
  borderRadius = 8,
}: EmergingImageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const renderer = getSharedRenderer();

    // Scene + camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 1000);
    camera.position.set(0, 0, 1);

    // Material — initialise ALL uniforms upfront so Three.js never tries
    // to upload a null value (causes "can't access property x, v is null")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const material = new EmergeMaterial() as any;
    material.uFillColor = new THREE.Color(fillColor);
    material.uType = type;
    material.uProgress = 0;
    material.uPixels = PIXELS;
    material.uTextureSize = new THREE.Vector2(1, 1);
    material.uElementSize = new THREE.Vector2(1, 1);
    material.uBorderRadius = borderRadius;
    material.transparent = true;

    // Mesh
    const geometry = new THREE.PlaneGeometry(1, 1);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Load texture
    new THREE.TextureLoader().loadAsync(url).then((texture) => {
      material.uTexture = texture;
      material.uTextureSize = new THREE.Vector2(
        texture.source.data.width,
        texture.source.data.height
      );
    });

    // 2D context for copying rendered output to visible canvas
    const ctx = canvas.getContext("2d");

    let gsapTween: gsap.core.Tween | null = null;
    let isAnimating = false;
    let width = 0;   // CSS pixels
    let height = 0;  // CSS pixels
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      width = container!.clientWidth;
      height = container!.clientHeight;
      if (width === 0 || height === 0) return;
      // Set canvas backing store to physical pixels
      canvas!.width = Math.round(width * dpr);
      canvas!.height = Math.round(height * dpr);
      material.uElementSize = new THREE.Vector2(width, height);
      material.uBorderRadius = borderRadius;
      renderFrame();
    }

    function renderFrame() {
      if (!width || !height) return;
      const pw = Math.round(width * dpr);
      const ph = Math.round(height * dpr);
      // Render at physical pixel resolution
      renderer.setSize(pw, ph, false);
      renderer.render(scene, camera);
      if (ctx) {
        ctx.clearRect(0, 0, pw, ph);
        ctx.drawImage(renderer.domElement, 0, 0, pw, ph);
      }
    }

    function startAnimation() {
      if (isAnimating) return;
      isAnimating = true;
      gsapTween = gsap.to(material, {
        uProgress: 1,
        duration: 1.5,
        ease: "none",
        onUpdate: renderFrame,
      });
    }

    // ResizeObserver
    const ro = new ResizeObserver(() => resize());
    ro.observe(container);

    // IntersectionObserver — start animation when visible
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        io.disconnect();
        resize();
        startAnimation();
      }
    });
    io.observe(container);

    // Initial size
    resize();

    return () => {
      ro.disconnect();
      io.disconnect();
      if (gsapTween) gsapTween.kill();
      geometry.dispose();
      material.dispose();
      scene.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, type, fillColor, borderRadius]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...style, position: "absolute", inset: 0 }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    </div>
  );
}
