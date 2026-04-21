"use client";

import * as THREE from "three";

let renderer: THREE.WebGLRenderer | null = null;

export function getSharedRenderer(): THREE.WebGLRenderer {
  if (!renderer) {
    // Create an offscreen canvas and attach it to the DOM (hidden).
    // Three.js requires the canvas to be in the document for WebGL context
    // and internal size tracking to work correctly.
    const offscreen = document.createElement("canvas");
    offscreen.width = 1;
    offscreen.height = 1;
    offscreen.style.cssText =
      "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0;pointer-events:none;z-index:-1;";
    document.body.appendChild(offscreen);

    renderer = new THREE.WebGLRenderer({
      canvas: offscreen,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
      preserveDrawingBuffer: true,
    });
    // Pixel ratio is handled manually per-image (physical px passed to setSize)
    renderer.setPixelRatio(1);
  }
  return renderer;
}
