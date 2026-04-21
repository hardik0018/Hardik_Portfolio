"use client";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshTransmissionMaterial, ContactShadows, Environment, Lightformer } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

// A stunning glass shape that refracts light
function GlassShape() {
  const mesh = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.2;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float floatIntensity={2} rotationIntensity={2} speed={2}>
      <mesh ref={mesh} position={[0, 0, 0]} scale={2.5}>
        <torusKnotGeometry args={[1, 0.4, 256, 64]} />
        <MeshTransmissionMaterial 
          backside
          samples={4}
          thickness={1.5}
          chromaticAberration={0.4}
          anisotropy={0.3}
          distortion={0.5}
          distortionScale={0.5}
          temporalDistortion={0.1}
          iridescence={1}
          iridescenceIOR={1}
          iridescenceThicknessRange={[0, 1400]}
          clearcoat={1}
          roughness={0.1}
          transmission={1}
          ior={1.5}
          color="#ffffff"
        />
      </mesh>
    </Float>
  );
}

// Dynamic lighting setup to enhance glass reflections
function LightingSetup() {
  const { clock } = useThree();
  const lightRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (lightRef.current) {
      lightRef.current.rotation.z = clock.elapsedTime * 0.2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      
      {/* Dynamic environment map for reflection */}
      <Environment resolution={256}>
        <group ref={lightRef}>
          <Lightformer form="circle" intensity={5} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} color="#FF3300" />
          <Lightformer form="circle" intensity={4} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[20, 1, 1]} color="#F5F4F0" />
          <Lightformer form="circle" intensity={3} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 1, 1]} color="#FF3300" />
          <Lightformer form="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} color="#121212" />
        </group>
      </Environment>
    </>
  );
}

// Background floating glass geometric particles
function GlassParticles() {
  const count = 30;
  const mesh = useRef<THREE.InstancedMesh>(null!);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -10 + Math.random() * 20;
      const yFactor = -10 + Math.random() * 20;
      const zFactor = -10 + Math.random() * 20;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.max(1.5, Math.cos(t) * 5);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s * 0.1, s * 0.1, s * 0.1);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <MeshTransmissionMaterial 
        samples={2}
        thickness={0.5}
        roughness={0.2}
        transmission={1}
        ior={1.2}
      />
    </instancedMesh>
  );
}


export default function HeroScene() {
  return (
    <Canvas
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      camera={{ position: [0, 0, 15], fov: 45 }}
      gl={{ alpha: true, antialias: true }}
      dpr={[1, 2]}
    >
      <LightingSetup />
      <group position={[0, -1, 0]}>
        <GlassShape />
        <GlassParticles />
        <ContactShadows position={[0, -4, 0]} opacity={0.3} scale={40} blur={2.5} far={10} color="#191918" />
      </group>
    </Canvas>
  );
}
