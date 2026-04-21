'use client';

import { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ============================================================
// DATA
// ============================================================
export interface LocationData {
  name: string;
  region: string;
  lat: number;
  lng: number;
  type: 'hub' | 'office';
  isCountry?: boolean;
}

export const LOCATIONS: LocationData[] = [
  { name: 'Los Angeles', region: 'USA', lat: 34.0522, lng: -118.2437, type: 'hub' },
  { name: 'San Diego', region: 'USA', lat: 32.7157, lng: -117.1611, type: 'hub' },
  { name: 'Cincinnati', region: 'USA', lat: 39.1031, lng: -84.512, type: 'hub' },
  { name: 'Dallas', region: 'USA', lat: 32.7767, lng: -96.797, type: 'hub' },
  { name: 'Austin', region: 'USA', lat: 30.2672, lng: -97.7431, type: 'office' },
  { name: 'Minneapolis', region: 'USA', lat: 44.9778, lng: -93.265, type: 'office' },
  { name: 'Bentonville', region: 'USA', lat: 36.3729, lng: -94.2088, type: 'office' },
  { name: 'Chicago', region: 'USA', lat: 41.8781, lng: -87.6298, type: 'office' },
  { name: 'Orlando', region: 'USA', lat: 28.5383, lng: -81.3792, type: 'office' },
  { name: 'New York', region: 'USA', lat: 40.7128, lng: -74.006, type: 'office' },
  { name: 'Seattle', region: 'USA', lat: 47.6062, lng: -122.3321, type: 'office' },
  { name: 'Mexico', region: 'LATAM', lat: 19.4326, lng: -99.1332, type: 'hub' },
  { name: 'Buenos Aires', region: 'LATAM', lat: -34.6037, lng: -58.3816, type: 'hub' },
  { name: 'Ukraine', region: 'EUROPE', lat: 50.4501, lng: 30.5234, type: 'hub', isCountry: true },
  { name: 'Poland', region: 'EUROPE', lat: 52.2297, lng: 21.0122, type: 'hub', isCountry: true },
];

// ============================================================
// UTILS
// ============================================================
const GLOBE_RADIUS = 1;

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

function getRotationForLatLng(lat: number, lng: number) {
  const pos = latLngToVec3(lat, lng, 1);
  const ry = Math.atan2(-pos.x, pos.z);
  const rxz = Math.sqrt(pos.x * pos.x + pos.z * pos.z);
  const rx = Math.atan2(pos.y, rxz);
  return { x: rx, y: ry };
}

// ============================================================
// TOPOJSON DECODER
// ============================================================
interface Topology {
  arcs: number[][][];
  transform: { scale: [number, number]; translate: [number, number] };
  objects: Record<string, { geometries: TopojsonGeometry[] }>;
}
interface TopojsonGeometry {
  type: string;
  arcs: number[][] | number[][][];
}

function decodeArc(topology: Topology, arcIndexes: number[]) {
  const coordinates: [number, number][] = [];
  arcIndexes.forEach((index) => {
    const arc = topology.arcs[index < 0 ? ~index : index];
    const decoded: [number, number][] = [];
    let x = 0,
      y = 0;
    arc.forEach((point) => {
      x += point[0];
      y += point[1];
      decoded.push([
        x * topology.transform.scale[0] + topology.transform.translate[0],
        y * topology.transform.scale[1] + topology.transform.translate[1],
      ]);
    });
    if (index < 0) decoded.reverse();
    decoded.forEach((coord, i) => {
      if (i > 0 || coordinates.length === 0) coordinates.push(coord);
    });
  });
  return coordinates;
}

function topojsonGeometry(topology: Topology, geom: TopojsonGeometry) {
  if (geom.type === 'Polygon') {
    return {
      type: 'Polygon' as const,
      coordinates: (geom.arcs as number[][]).map((arc) => decodeArc(topology, arc)),
    };
  } else if (geom.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon' as const,
      coordinates: (geom.arcs as number[][][]).map((polygon) =>
        polygon.map((arc) => decodeArc(topology, arc))
      ),
    };
  }
  return { type: geom.type, coordinates: [] as [number, number][][] };
}

function topojsonFeature(topology: Topology, object: { geometries: TopojsonGeometry[] }) {
  return object.geometries.map((geom) => ({
    type: 'Feature' as const,
    geometry: topojsonGeometry(topology, geom),
  }));
}

// ============================================================
// GRATICULE
// ============================================================
function Graticule() {
  const groupRef = useRef<THREE.Group>(null);
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    const mat = new THREE.LineBasicMaterial({ color: 0xdddddd, transparent: true, opacity: 0.25 });
    for (let lat = -80; lat <= 80; lat += 20) {
      const pts: THREE.Vector3[] = [];
      for (let lng = -180; lng <= 180; lng += 2)
        pts.push(latLngToVec3(lat, lng, GLOBE_RADIUS + 0.001));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    for (let lng = -180; lng < 180; lng += 20) {
      const pts: THREE.Vector3[] = [];
      for (let lat = -90; lat <= 90; lat += 2)
        pts.push(latLngToVec3(lat, lng, GLOBE_RADIUS + 0.001));
      group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
    }
    return () => {
      while (group.children.length) group.remove(group.children[0]);
      mat.dispose();
    };
  }, []);
  return <group ref={groupRef} />;
}

// ============================================================
// COUNTRY + STATE BORDERS
// ============================================================
type GeoFeature = {
  geometry: { type: string; coordinates: [number, number][][] | [number, number][][][] };
};

function CountryBorders() {
  const groupRef = useRef<THREE.Group>(null);
  useEffect(() => {
    const group = groupRef.current;
    if (!group) return;
    let cancelled = false;
    const countryMat = new THREE.LineBasicMaterial({
      color: 0xbcbcbc,
      transparent: true,
      opacity: 0.8,
    });
    const stateMat = new THREE.LineBasicMaterial({
      color: 0xcecece,
      transparent: true,
      opacity: 0.6,
    });

    function drawPolygons(features: GeoFeature[], mat: THREE.LineBasicMaterial) {
      features.forEach(({ geometry: geom }) => {
        const coords =
          geom.type === 'Polygon'
            ? [geom.coordinates as [number, number][][]]
            : geom.type === 'MultiPolygon'
              ? (geom.coordinates as [number, number][][][])
              : [];
        coords.forEach((poly) =>
          (poly as [number, number][][]).forEach((ring) => {
            const pts = ring.map((c) => latLngToVec3(c[1], c[0], GLOBE_RADIUS + 0.002));
            if (pts.length > 1)
              group?.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat));
          })
        );
      });
    }

    async function load() {
      try {
        const topo: Topology = await fetch(
          'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
        ).then((r) => r.json());
        if (cancelled) return;
        drawPolygons(topojsonFeature(topo, topo.objects.countries) as GeoFeature[], countryMat);
      } catch (e) {
        console.error('Country borders failed:', e);
      }

      try {
        const data = await fetch(
          'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_1_states_provinces_shp.geojson'
        ).then((r) => r.json());
        if (cancelled) return;
        drawPolygons(data.features as GeoFeature[], stateMat);
      } catch (e) {
        console.warn('State borders failed:', e);
      }
    }

    load();
    return () => {
      cancelled = true;
      while (group.children.length) group.remove(group.children[0]);
      countryMat.dispose();
      stateMat.dispose();
    };
  }, []);
  return <group ref={groupRef} />;
}

// Helper: orient XY-plane mesh so +Z faces outward
const Z_AXIS = new THREE.Vector3(0, 0, 1);
function orientOutward(mesh: THREE.Mesh, dir: THREE.Vector3) {
  mesh.quaternion.setFromUnitVectors(Z_AXIS, dir.clone().normalize());
}

// ============================================================
// CITY MARKERS
// ============================================================
interface CityMarkersProps {
  hoveredCity: string | null;
  activeCity: string | null;
  onCityHover: (name: string, region: string, x: number, y: number) => void;
  onCityLeave: () => void;
  onCityClick: (loc: LocationData) => void;
  /** Called once per activeCity change with the marker's projected screen coords */
  onActiveCityPos: (name: string, region: string, x: number, y: number) => void;
}

function CityMarkers({
  hoveredCity,
  activeCity,
  onCityHover,
  onCityLeave,
  onCityClick,
  onActiveCityPos,
}: CityMarkersProps) {
  const markersRef = useRef<THREE.Group>(null);
  const highlightRef = useRef<THREE.Mesh>(null);
  const pulse1Ref = useRef<THREE.Mesh>(null);
  const pulse2Ref = useRef<THREE.Mesh>(null);
  const { camera, gl } = useThree();
  const canvasRef = useRef(gl.domElement);

  const hitMeshes = useRef<THREE.Mesh[]>([]);

  const markers = useMemo(
    () =>
      LOCATIONS.map((loc) => ({
        ...loc,
        position: latLngToVec3(loc.lat, loc.lng, GLOBE_RADIUS + 0.012),
      })),
    []
  );

  const targetCity = hoveredCity || activeCity;
  const targetLoc = targetCity ? LOCATIONS.find((l) => l.name === targetCity) : null;
  const highlightPos = targetLoc
    ? latLngToVec3(targetLoc.lat, targetLoc.lng, GLOBE_RADIUS + 0.022)
    : null;

  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouseNDC = useRef(new THREE.Vector2(-9999, -9999));
  const isDragging = useRef(false);
  const lastHoveredName = useRef<string | null>(null);
  const lastActiveName = useRef<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const onMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mouseNDC.current.set(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      );
    };
    const onMouseDown = () => {
      isDragging.current = true;
    };
    const onMouseUp = () => {
      setTimeout(() => {
        isDragging.current = false;
      }, 10);
    };
    const onMouseLeave = () => {
      mouseNDC.current.set(-9999, -9999);
      if (lastHoveredName.current !== null) {
        lastHoveredName.current = null;
        onCityLeave();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (isDragging.current) return;
      const r = canvas.getBoundingClientRect();
      const mp = new THREE.Vector2(
        ((e.clientX - r.left) / r.width) * 2 - 1,
        -((e.clientY - r.top) / r.height) * 2 + 1
      );
      raycaster.setFromCamera(mp, camera);
      const hits = raycaster.intersectObjects(hitMeshes.current, false);
      if (hits.length > 0) {
        const idx = hits[0].object.userData.locationIndex as number;
        if (idx !== undefined) onCityClick(LOCATIONS[idx]);
      }
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mouseleave', onMouseLeave);
    canvas.addEventListener('click', onClick);
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      canvas.removeEventListener('click', onClick);
    };
  }, [camera, raycaster, onCityLeave, onCityClick]);

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const canvas = canvasRef.current;

    // --- Hover raycasting ---
    raycaster.setFromCamera(mouseNDC.current, camera);
    const hits = raycaster.intersectObjects(hitMeshes.current, false);

    if (hits.length > 0) {
      const idx = hits[0].object.userData.locationIndex as number;
      const loc = LOCATIONS[idx];
      if (loc) {
        if (lastHoveredName.current !== loc.name) {
          lastHoveredName.current = loc.name;
          const wp = new THREE.Vector3();
          hits[0].object.getWorldPosition(wp);
          const pt = wp.clone().project(camera);
          const r = canvas.getBoundingClientRect();
          const sx = ((pt.x + 1) / 2) * r.width + r.left;
          const sy = ((-pt.y + 1) / 2) * r.height + r.top;
          onCityHover(loc.name, loc.region, sx, sy - 50);
        } else {
          const wp = new THREE.Vector3();
          hits[0].object.getWorldPosition(wp);
          const pt = wp.clone().project(camera);
          const r = canvas.getBoundingClientRect();
          const sx = ((pt.x + 1) / 2) * r.width + r.left;
          const sy = ((-pt.y + 1) / 2) * r.height + r.top;
          const tooltipEl = document.getElementById('globe-tooltip');
          if (tooltipEl) {
            tooltipEl.style.left = `${sx}px`;
            tooltipEl.style.top = `${sy - 50}px`;
          }
        }
      }
      canvas.style.cursor = 'pointer';
    } else {
      if (lastHoveredName.current !== null) {
        lastHoveredName.current = null;
        onCityLeave();
        canvas.style.cursor = 'grab';
      }

      // Project active city marker position for sidebar-click tooltip
      if (activeCity) {
        const activeLoc = LOCATIONS.find((l) => l.name === activeCity);
        if (activeLoc) {
          const activeMesh = hitMeshes.current.find(
            (m) => LOCATIONS[m.userData.locationIndex as number]?.name === activeCity
          );
          if (activeMesh) {
            const wp = new THREE.Vector3();
            activeMesh.getWorldPosition(wp);
            const pt = wp.clone().project(camera);
            const r = canvas.getBoundingClientRect();
            const sx = ((pt.x + 1) / 2) * r.width + r.left;
            const sy = ((-pt.y + 1) / 2) * r.height + r.top;

            if (lastActiveName.current !== activeCity) {
              lastActiveName.current = activeCity;
              onActiveCityPos(activeLoc.name, activeLoc.region, sx, sy - 50);
            } else {
              const tooltipEl = document.getElementById('globe-tooltip');
              if (tooltipEl) {
                tooltipEl.style.left = `${sx}px`;
                tooltipEl.style.top = `${sy - 50}px`;
              }
            }
          }
        }
      } else if (!activeCity) {
        lastActiveName.current = null;
      }
    }

    // --- Animate highlight ring ---
    if (highlightRef.current && highlightPos) {
      orientOutward(highlightRef.current, highlightPos);
      const s = 1 + Math.sin(time * 4) * 0.12;
      highlightRef.current.scale.set(s, s, 1);
    }
    if (pulse1Ref.current && highlightPos) {
      orientOutward(pulse1Ref.current, highlightPos);
      const s = 1 + Math.sin(time * 2) * 0.45;
      pulse1Ref.current.scale.set(s, s, 1);
      (pulse1Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - (s - 1) / 0.45);
    }
    if (pulse2Ref.current && highlightPos) {
      orientOutward(pulse2Ref.current, highlightPos);
      const s = 1 + Math.sin(time * 2 + Math.PI) * 0.45;
      pulse2Ref.current.scale.set(s, s, 1);
      (pulse2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.5 * (1 - (s - 1) / 0.45);
    }

    // --- Hide back-face markers ---
    if (markersRef.current) {
      markersRef.current.children.forEach((grp) => {
        const dot = grp.children[0];
        if (!dot) return;
        const wp = new THREE.Vector3();
        dot.getWorldPosition(wp);
        const facing = camera.position.clone().sub(wp).normalize().dot(wp.clone().normalize());
        grp.visible = facing > -0.1;
      });
    }
  });

  return (
    <>
      <group ref={markersRef}>
        {markers.map((m, idx) => {
          const isHub = m.type === 'hub';
          const outward = m.position.clone().normalize();
          const lineLen = 0.032;
          const gapR = 0.025;
          const up = new THREE.Vector3(0, 1, 0);
          const tangent = new THREE.Vector3().crossVectors(up, outward).normalize();
          const bitangent = new THREE.Vector3().crossVectors(outward, tangent).normalize();
          const crossMat = new THREE.LineBasicMaterial({
            color: 0xe81211,
            transparent: true,
            opacity: 0.7,
          });
          const mkLine = (a: THREE.Vector3, b: THREE.Vector3) =>
            new THREE.Line(new THREE.BufferGeometry().setFromPoints([a, b]), crossMat);
          const p = m.position;
          const hubLines = isHub
            ? [
                mkLine(
                  p.clone().add(tangent.clone().multiplyScalar(-lineLen)),
                  p.clone().add(tangent.clone().multiplyScalar(-gapR))
                ),
                mkLine(
                  p.clone().add(tangent.clone().multiplyScalar(gapR)),
                  p.clone().add(tangent.clone().multiplyScalar(lineLen))
                ),
                mkLine(
                  p.clone().add(bitangent.clone().multiplyScalar(-lineLen)),
                  p.clone().add(bitangent.clone().multiplyScalar(-gapR))
                ),
                mkLine(
                  p.clone().add(bitangent.clone().multiplyScalar(gapR)),
                  p.clone().add(bitangent.clone().multiplyScalar(lineLen))
                ),
              ]
            : [];

          return (
            <group key={m.name}>
              {/* Visible flat dot */}
              <mesh
                position={m.position}
                onUpdate={(self) => orientOutward(self as THREE.Mesh, outward)}
              >
                <circleGeometry args={[isHub ? 0.013 : 0.009, 32]} />
                <meshBasicMaterial color={0xe81211} side={THREE.DoubleSide} />
              </mesh>

              {/* Invisible enlarged hit area */}
              <mesh
                position={m.position}
                ref={(mesh) => {
                  if (!mesh) return;
                  orientOutward(mesh, outward);
                  mesh.userData = { locationIndex: idx };
                  if (!hitMeshes.current.includes(mesh)) hitMeshes.current.push(mesh);
                }}
              >
                <circleGeometry args={[isHub ? 0.03 : 0.024, 32]} />
                <meshBasicMaterial
                  transparent
                  opacity={0}
                  side={THREE.DoubleSide}
                  depthWrite={false}
                />
              </mesh>

              {/* Hub ring */}
              {isHub && (
                <mesh
                  position={m.position}
                  onUpdate={(self) => orientOutward(self as THREE.Mesh, outward)}
                >
                  <ringGeometry args={[0.016, 0.022, 64]} />
                  <meshBasicMaterial
                    color={0xe81211}
                    side={THREE.DoubleSide}
                    transparent
                    opacity={0.85}
                  />
                </mesh>
              )}
              {hubLines.map((l, i) => (
                <primitive key={i} object={l} />
              ))}
            </group>
          );
        })}
      </group>

      {highlightPos && (
        <mesh ref={highlightRef} position={highlightPos}>
          <ringGeometry args={[0.026, 0.034, 64]} />
          <meshBasicMaterial color={0xe81211} side={THREE.DoubleSide} transparent opacity={0.7} />
        </mesh>
      )}
      {activeCity && highlightPos && (
        <mesh ref={pulse1Ref} position={highlightPos}>
          <ringGeometry args={[0.026, 0.033, 64]} />
          <meshBasicMaterial color={0xe81211} side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>
      )}
      {activeCity && highlightPos && (
        <mesh ref={pulse2Ref} position={highlightPos}>
          <ringGeometry args={[0.026, 0.033, 64]} />
          <meshBasicMaterial color={0xe81211} side={THREE.DoubleSide} transparent opacity={0.5} />
        </mesh>
      )}
    </>
  );
}

// ============================================================
// GLOBE SCENE
// ============================================================
const INITIAL_CAMERA_Z = 2;
const CITY_ZOOM = 2;

interface GlobeSceneProps {
  navigateTarget: LocationData | null;
  hoveredCity: string | null;
  activeCity: string | null;
  onCityHover: (name: string, region: string, x: number, y: number) => void;
  onCityLeave: () => void;
  onCityClick: (loc: LocationData) => void;
  onActiveCityPos: (name: string, region: string, x: number, y: number) => void;
}

function GlobeScene({
  navigateTarget,
  hoveredCity,
  activeCity,
  onCityHover,
  onCityLeave,
  onCityClick,
  onActiveCityPos,
}: GlobeSceneProps) {
  const globeRef = useRef<THREE.Group>(null);
  const targetRotation = useRef({ x: 0, y: 0 });
  const currentRotation = useRef({ x: 0, y: 0 });
  const isAutoRotating = useRef(true);
  const isNavigating = useRef(false);
  const navTarget = useRef<{ x: number; y: number; zoom: number } | null>(null);
  const isDragging = useRef(false);
  const previousMouse = useRef({ x: 0, y: 0 });
  const inertia = useRef({ x: 0, y: 0 });
  const targetCameraZ = useRef(INITIAL_CAMERA_Z);
  const currentCameraZ = useRef(INITIAL_CAMERA_Z);

  const { gl } = useThree();
  const canvasRef = useRef(gl.domElement);

  useEffect(() => {
    const rot = getRotationForLatLng(39, -98);
    targetRotation.current = { ...rot };
    currentRotation.current = { ...rot };
  }, []);

  useEffect(() => {
    if (!navigateTarget) return;
    isNavigating.current = true;
    isAutoRotating.current = false;
    const rot = getRotationForLatLng(navigateTarget.lat, navigateTarget.lng);
    let dy = rot.y - targetRotation.current.y;
    while (dy > Math.PI) dy -= 2 * Math.PI;
    while (dy < -Math.PI) dy += 2 * Math.PI;
    navTarget.current = { x: rot.x, y: targetRotation.current.y + dy, zoom: CITY_ZOOM };
  }, [navigateTarget]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      isAutoRotating.current = false;
      isNavigating.current = false;
      // Snap currentRotation to targetRotation so drag starts from the visual position
      currentRotation.current = { ...targetRotation.current };
      previousMouse.current = { x: e.clientX, y: e.clientY };
      inertia.current = { x: 0, y: 0 };
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - previousMouse.current.x;
      const dy = e.clientY - previousMouse.current.y;
      targetRotation.current.y += dx * 0.005;
      targetRotation.current.x += dy * 0.005;
      inertia.current = { x: dy * 0.005, y: dx * 0.005 };
      previousMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseUp = () => {
      isDragging.current = false;
      setTimeout(() => {
        if (!isDragging.current && !isNavigating.current) isAutoRotating.current = true;
      }, 3000);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        isAutoRotating.current = false;
        isNavigating.current = false;
        currentRotation.current = { ...targetRotation.current };
        previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
        inertia.current = { x: 0, y: 0 };
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (isDragging.current && e.touches.length === 1) {
        const dx = e.touches[0].clientX - previousMouse.current.x;
        const dy = e.touches[0].clientY - previousMouse.current.y;
        targetRotation.current.y += dx * 0.005;
        targetRotation.current.x += dy * 0.005;
        previousMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };
    const onTouchEnd = () => {
      isDragging.current = false;
      setTimeout(() => {
        if (!isDragging.current && !isNavigating.current) isAutoRotating.current = true;
      }, 3000);
    };
    const onDblClick = () => {
      targetCameraZ.current = INITIAL_CAMERA_Z;
      const rot = getRotationForLatLng(39, -98);
      targetRotation.current = { ...rot };
      isAutoRotating.current = true;
      isNavigating.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);
    canvas.addEventListener('dblclick', onDblClick);
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('dblclick', onDblClick);
    };
  }, []);

  useFrame(({ camera }) => {
    if (!globeRef.current) return;
    if (isNavigating.current && navTarget.current) {
      const ls = 0.04;
      targetRotation.current.x += (navTarget.current.x - targetRotation.current.x) * ls;
      targetRotation.current.y += (navTarget.current.y - targetRotation.current.y) * ls;
      targetCameraZ.current += (navTarget.current.zoom - targetCameraZ.current) * ls;
      if (
        Math.abs(navTarget.current.x - targetRotation.current.x) < 0.001 &&
        Math.abs(navTarget.current.y - targetRotation.current.y) < 0.001
      ) {
        targetRotation.current = { x: navTarget.current.x, y: navTarget.current.y };
        isNavigating.current = false;
      }
    }
    if (isAutoRotating.current && !isDragging.current && !isNavigating.current)
      targetRotation.current.y += 0.0008;
    if (!isDragging.current && !isNavigating.current) {
      inertia.current.x *= 0.95;
      inertia.current.y *= 0.95;
      if (Math.abs(inertia.current.x) > 0.0001) targetRotation.current.x += inertia.current.x * 0.3;
      if (Math.abs(inertia.current.y) > 0.0001) targetRotation.current.y += inertia.current.y * 0.3;
    }
    // Use a higher lerp factor while dragging so rotation tracks the mouse directly
    const lerpFactor = isDragging.current ? 0.5 : 0.08;
    currentRotation.current.x +=
      (targetRotation.current.x - currentRotation.current.x) * lerpFactor;
    currentRotation.current.y +=
      (targetRotation.current.y - currentRotation.current.y) * lerpFactor;
    globeRef.current.rotation.x = currentRotation.current.x;
    globeRef.current.rotation.y = currentRotation.current.y;
    currentCameraZ.current += (targetCameraZ.current - currentCameraZ.current) * 0.08;
    camera.position.z = currentCameraZ.current;
  });

  const globeMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: true,
        depthTest: true,
        transparent: false,
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `void main() { gl_FragColor = vec4(0.973, 0.973, 0.973, 1.0); }`,
      }),
    []
  );

  return (
    <group ref={globeRef}>
      <mesh renderOrder={0} material={globeMaterial}>
        <sphereGeometry args={[GLOBE_RADIUS, 128, 128]} />
      </mesh>
      <Graticule />
      <CountryBorders />
      <CityMarkers
        hoveredCity={hoveredCity}
        activeCity={activeCity}
        onCityHover={onCityHover}
        onCityLeave={onCityLeave}
        onCityClick={onCityClick}
        onActiveCityPos={onActiveCityPos}
      />
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 3, 5]} intensity={0.5} />
      <directionalLight position={[-3, -2, -3]} intensity={0.2} />
    </group>
  );
}

// ============================================================
// MAIN GLOBE COMPONENT (exported)
// ============================================================
export interface GlobeProps {
  navigateTarget: LocationData | null;
  hoveredCity: string | null;
  activeCity: string | null;
  onCityHover: (name: string, region: string, x: number, y: number) => void;
  onCityLeave: () => void;
  onCityClick: (loc: LocationData) => void;
  onActiveCityPos: (name: string, region: string, x: number, y: number) => void;
}

export default function Globe({
  navigateTarget,
  hoveredCity,
  activeCity,
  onCityHover,
  onCityLeave,
  onCityClick,
  onActiveCityPos,
}: GlobeProps) {
  return (
    <div className="globe-canvas-wrapper">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 60, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: true }}
        resize={{ scroll: false, debounce: { scroll: 0, resize: 0 } }}
        style={{ background: 'transparent' }}
      >
        <GlobeScene
          navigateTarget={navigateTarget}
          hoveredCity={hoveredCity}
          activeCity={activeCity}
          onCityHover={onCityHover}
          onCityLeave={onCityLeave}
          onCityClick={onCityClick}
          onActiveCityPos={onActiveCityPos}
        />
      </Canvas>
    </div>
  );
}
