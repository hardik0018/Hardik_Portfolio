"use client";

import "./EmergeMaterial";
import { Canvas } from "@react-three/fiber";
import { View, OrthographicCamera, Preload } from "@react-three/drei";

export default function WebGLScene() {
  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 300], zoom: 1 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 20,
      }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
      frameloop="always"
      gl={{
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
        failIfMajorPerformanceCaveat: false,
      }}
    >
      <View.Port />
      <OrthographicCamera makeDefault position={[0, 0, 300]} zoom={1} />
      <Preload all />
    </Canvas>
  );
}
