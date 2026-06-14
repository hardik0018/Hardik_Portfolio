"use client";

import { useRef, useState, useMemo, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Html } from "@react-three/drei";
import * as THREE from "three";
import { ExternalLink } from "lucide-react";
import { urlFor } from "@/lib/sanity.image";

// Simple custom GitHub Icon since lucide-react doesn't have a solid one in standard exports
const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-4 h-4"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

interface Project {
  _id: string;
  title: string;
  slug?: string;
  description: string;
  year: string;
  tags: string[];
  src: Parameters<typeof urlFor>[0] & { alt?: string };
  github: string;
  url: string;
  color?: { hex: string };
}

interface ProjectCard3DProps {
  project: Project;
  index: number;
  position: [number, number, number];
  rotation: [number, number, number];
  radius: number;
  wireframe: boolean;
  frequencyX: number;
  frequencyY: number;
  amplitude: number;
  windSpeed: number;
}

function CardMesh({
  imageUrl,
  wireframe,
  frequencyX,
  frequencyY,
  amplitude,
  windSpeed,
  radius,
}: {
  imageUrl: string;
  wireframe: boolean;
  frequencyX: number;
  frequencyY: number;
  amplitude: number;
  windSpeed: number;
  radius: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [hovered, setHovered] = useState(false);

  // Load texture with CORS settings
  const texture = useTexture(imageUrl);

  // Shader Uniforms
  const uniforms = useMemo(() => {
    return {
      uTexture: { value: texture },
      uTime: { value: 0 },
      uFrequency: { value: new THREE.Vector2(frequencyX, frequencyY) },
      uAmplitude: { value: amplitude },
      uWindSpeed: { value: windSpeed },
      uOpacity: { value: 1.0 },
      uRadius: { value: radius },
    };
  }, [texture, frequencyX, frequencyY, amplitude, windSpeed, radius]);

  const worldPosition = useRef(new THREE.Vector3());

  // Update uniforms in animation loop
  useFrame((state) => {
    if (!meshRef.current || !materialRef.current) return;

    // Increment shader time
    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();

    // Lerp shader uniforms based on debug config
    materialRef.current.uniforms.uFrequency.value.set(frequencyX, frequencyY);
    materialRef.current.uniforms.uWindSpeed.value = windSpeed;
    materialRef.current.uniforms.uRadius.value = radius;

    // React to hover: increase wave amplitude slightly and mesh scale
    const targetAmplitude = hovered ? amplitude * 1.5 : amplitude;
    materialRef.current.uniforms.uAmplitude.value += (targetAmplitude - materialRef.current.uniforms.uAmplitude.value) * 0.1;

    const targetScale = hovered ? 1.06 : 1.0;
    meshRef.current.scale.x += (targetScale - meshRef.current.scale.x) * 0.1;
    meshRef.current.scale.y += (targetScale - meshRef.current.scale.y) * 0.1;
    meshRef.current.scale.z += (targetScale - meshRef.current.scale.z) * 0.1;

    // Calculate world position to determine depth/opacity
    meshRef.current.getWorldPosition(worldPosition.current);

    // depthT goes from 0 (at the back: z = -radius) to 1 (at the front: z = radius)
    // Avoid division by zero if radius is 0
    const depthT = radius > 0 ? (worldPosition.current.z + radius) / (2 * radius) : 1;

    // Smooth depth fade. Cards at the back are 15% opacity, front is 100%
    const cardOpacity = 0.15 + 0.85 * Math.pow(depthT, 2);
    materialRef.current.uniforms.uOpacity.value = cardOpacity;
  });

  // Shader sources
  const vertexShader = `
    uniform float uTime;
    uniform vec2 uFrequency;
    uniform float uAmplitude;
    uniform float uWindSpeed;
    uniform float uRadius;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vUv = uv;
      
      // Cylindrical bending: Bend the local coordinates of the flat plane geometry
      // around a cylinder of radius uRadius.
      float angle = position.x / uRadius;
      vec3 curvedPosition = position;
      curvedPosition.x = uRadius * sin(angle);
      curvedPosition.z = uRadius * (cos(angle) - 1.0);
      
      vec4 modelPosition = modelMatrix * vec4(curvedPosition, 1.0);
      
      // Calculate dual sine/cosine waves for realistic flag ripple
      float xWave = sin(modelPosition.x * uFrequency.x - uTime * uWindSpeed);
      float yWave = cos(modelPosition.y * uFrequency.y - uTime * uWindSpeed * 0.73);
      
      // Pin the left side (simulate a flagpole anchor)
      // Waving intensity scales up quadratically from left to right
      float flagAnchor = pow(uv.x, 1.3);
      float elevation = xWave * yWave * uAmplitude * flagAnchor;
      
      modelPosition.z += elevation;
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      vElevation = elevation;
    }
  `;

  const fragmentShader = `
    uniform sampler2D uTexture;
    uniform float uOpacity;
    varying vec2 vUv;
    varying float vElevation;

    void main() {
      vec4 color = texture2D(uTexture, vUv);
      
      // Shading: simulate folds by darkening troughs and brightening peaks
      float shadow = mix(0.72, 1.28, (vElevation + 0.12) * 2.2);
      
      gl_FragColor = vec4(color.rgb * shadow, color.a * uOpacity);
    }
  `;

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
    >
      <planeGeometry args={[6.5, 3.3, 36, 36]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={wireframe}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

export default function ProjectCard3D({
  project,
  index,
  position,
  rotation,
  radius,
  wireframe,
  frequencyX,
  frequencyY,
  amplitude,
  windSpeed,
}: ProjectCard3DProps) {
  // Crop image to 16:9 aspect ratio from Sanity CDN
  const imageUrl = useMemo(() => {
    return project.src
      ? urlFor(project.src).width(1200).height(675).fit("crop").auto("format").url()
      : "/placeholder-project.jpg";
  }, [project.src]);

  const groupRef = useRef<THREE.Group>(null);
  const htmlContainerRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (!groupRef.current || !htmlContainerRef.current) return;

    const worldPosition = new THREE.Vector3();
    groupRef.current.getWorldPosition(worldPosition);

    // Calculate angle relative to front (using worldPosition.x and worldPosition.z)
    // Angle ranges from -PI to PI
    const angleFromFront = Math.atan2(worldPosition.x, worldPosition.z);

    // Only show HTML details when the card is close to the front
    const maxAngle = 0.7; // about 40 degrees
    const absAngle = Math.abs(angleFromFront);

    let htmlOpacity = 0;
    if (absAngle < maxAngle) {
      // Smooth fade
      htmlOpacity = 1 - (absAngle / maxAngle);
      // Use ease-in-out curve for smoother transition
      htmlOpacity = Math.sin(htmlOpacity * Math.PI * 0.5);
    }

    htmlContainerRef.current.style.opacity = htmlOpacity.toFixed(3);

    // Slide up slightly as it fades in
    const translateY = (1 - htmlOpacity) * 25; // max 25px translation
    const scale = 0.85 + 0.15 * htmlOpacity;
    htmlContainerRef.current.style.transform = `scale(${scale}) translateY(${translateY}px)`;

    // Enable clicks only when fully/mostly visible
    if (htmlOpacity > 0.6) {
      htmlContainerRef.current.style.pointerEvents = "auto";
      htmlContainerRef.current.style.visibility = "visible";
    } else {
      htmlContainerRef.current.style.pointerEvents = "none";
      if (htmlOpacity < 0.05) {
        htmlContainerRef.current.style.visibility = "hidden";
      } else {
        htmlContainerRef.current.style.visibility = "visible";
      }
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation}>
      {/* 3D mesh rendering the waving flag */}
      <Suspense fallback={
        <mesh>
          <planeGeometry args={[3.2, 1.8, 2, 2]} />
          <meshBasicMaterial color="#1a1a1a" wireframe={wireframe} />
        </mesh>
      }>
        <CardMesh
          imageUrl={imageUrl}
          wireframe={wireframe}
          frequencyX={frequencyX}
          frequencyY={frequencyY}
          amplitude={amplitude}
          windSpeed={windSpeed}
          radius={radius}
        />
      </Suspense>

      {/* HTML details overlay positioned below the 3D card */}
      <Html
        position={[0, -1.35, 0.05]}
        center
        distanceFactor={4.8}
        // Avoid capturing events on the outer block, keep it selective
        className="select-none pointer-events-none"
      >
        <div
          ref={htmlContainerRef}
          style={{ opacity: 0, transform: "scale(0.85) translateY(25px)", visibility: "hidden" }}
          className="w-[320px] rounded-2xl bg-card-bg/85 border border-border/40 p-5 shadow-2xl backdrop-blur-xl pointer-events-auto"
        >
          {/* Index & Title */}
          <div className="flex items-center justify-between gap-4 mb-2">
            <span className="font-mono text-xs font-bold text-accent-primary">
              0{index + 1}
            </span>
            <span className="font-mono text-[10px] text-text-muted">
              {project.year}
            </span>
          </div>

          <h3 className="font-display text-lg font-bold text-foreground uppercase tracking-tight line-clamp-1">
            {project.title}
          </h3>

          <p className="font-sans text-xs text-text-muted mt-1 leading-relaxed line-clamp-2 min-h-[32px]">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3.5">
            {project.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[8.5px] font-mono border border-border/50 px-2 py-0.5 rounded bg-bg-secondary/50 text-text-muted uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Clicks */}
          <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-border/40">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-widest text-text-muted hover:text-foreground transition-colors py-1"
              >
                <GitHubIcon />
                Code
              </a>
            )}

            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-mono font-bold uppercase tracking-widest bg-accent-primary text-background hover:scale-102 active:scale-98 transition-all shadow-md"
              >
                <ExternalLink className="w-3 h-3" />
                Live
              </a>
            )}
          </div>
        </div>
      </Html>
    </group>
  );
}
