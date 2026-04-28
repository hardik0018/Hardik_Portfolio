"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, MeshDistortMaterial, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";

function Shape() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group>
      {/* The "Gold" inner core */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[1, 0.35, 256, 32]} />
        <meshPhysicalMaterial
          color="#C5A367"
          metalness={1}
          roughness={0.1}
          emissive="#C5A367"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* The "Black Glass" outer shell */}
      <mesh rotation={[Math.PI / 4, 0, 0]}>
        <torusKnotGeometry args={[1.1, 0.2, 256, 32]} />
        <MeshTransmissionMaterial
          backside
          samples={16}
          thickness={0.2}
          chromaticAberration={0.02}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.1}
          clearcoat={1}
          attenuationDistance={0.5}
          attenuationColor="#ffffff"
          color="#0D0D0D"
        />
      </mesh>
    </group>
  );
}

export default function Sculpture() {
  return (
    <div className="absolute inset-0 z-0 opacity-80">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Shape />
        </Float>

        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
