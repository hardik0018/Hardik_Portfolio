"use client"

import React, { useRef, useMemo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Float, MeshDistortMaterial, Sphere, MeshWobbleMaterial } from "@react-three/drei"
import * as THREE from "three"

const FloatingShape = ({ position, color, speed, distort }: any) => {
  const mesh = useRef<THREE.Mesh>(null!)
  
  useFrame(() => {
    const t = performance.now() * 0.001;
    mesh.current.position.y = position[1] + Math.sin(t * speed) * 0.2
    mesh.current.rotation.x = Math.cos(t * speed * 0.5) * 0.2
    mesh.current.rotation.y = Math.sin(t * speed * 0.5) * 0.2
  })

  return (
    <Float speed={speed * 2} rotationIntensity={1.5} floatIntensity={2}>
      <Sphere ref={mesh} args={[1, 64, 64]} position={position}>
        <MeshDistortMaterial
          color={color}
          speed={speed}
          distort={distort}
          radius={1}
        />
      </Sphere>
    </Float>
  )
}

const Particles = ({ count = 50 }) => {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10
      p[i * 3 + 1] = (Math.random() - 0.5) * 10
      p[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    return p
  }, [count])

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#8B5CF6" transparent opacity={0.4} />
    </points>
  )
}

export default function ThreeInteractiveScene() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} intensity={1} color="#8B5CF6" />
        
        <FloatingShape position={[2, 1, 0]} color="#8B5CF6" speed={2} distort={0.4} />
        <FloatingShape position={[-2, -1, -2]} color="#D8B4FE" speed={1.5} distort={0.5} />
        
        <Particles count={100} />
      </Canvas>
    </div>
  )
}
