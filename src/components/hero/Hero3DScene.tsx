import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

/* ─── Named Building ─── */
function NamedBuilding({ position, width, height, depth, color, windowColor, roofColor, label }: {
  position: [number, number, number]; width: number; height: number; depth: number;
  color: string; windowColor?: string; roofColor?: string; label?: string;
}) {
  const wc = windowColor || "#ffd070";
  const rows = Math.max(2, Math.floor(height / 0.6));
  const cols = Math.max(2, Math.floor(width / 0.5));

  return (
    <group position={position}>
      {/* Foundation */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[width + 0.2, 0.1, depth + 0.2]} />
        <meshStandardMaterial color="#4a3a2a" roughness={0.9} />
      </mesh>
      {/* Body */}
      <mesh position={[0, height / 2 + 0.1, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.82} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, height + 0.25, 0]}>
        <boxGeometry args={[width + 0.2, 0.2, depth + 0.2]} />
        <meshStandardMaterial color={roofColor || "#5a4030"} roughness={0.7} />
      </mesh>
      {/* Pitched roof */}
      <mesh position={[0, height + 0.35 + 0.4, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[width * 0.55, 0.8, 4]} />
        <meshStandardMaterial color={roofColor || "#5a4030"} roughness={0.7} />
      </mesh>
      {/* Front windows */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <FlickerWindow
            key={`f-${r}-${c}`}
            position={[
              -width / 2 + 0.3 + c * ((width - 0.6) / Math.max(cols - 1, 1)),
              0.4 + r * 0.6,
              depth / 2 + 0.01
            ]}
            color={wc}
          />
        ))
      )}
      {/* Side windows */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: Math.max(1, Math.floor(depth / 0.6)) }).map((_, c) => (
          <FlickerWindow
            key={`s-${r}-${c}`}
            position={[
              width / 2 + 0.01,
              0.4 + r * 0.6,
              -depth / 2 + 0.3 + c * ((depth - 0.6) / Math.max(Math.floor(depth / 0.6) - 1, 1))
            ]}
            color={wc}
            rotation={[0, Math.PI / 2, 0]}
          />
        ))
      )}
      {/* Door */}
      <mesh position={[0, 0.35, depth / 2 + 0.02]}>
        <planeGeometry args={[0.3, 0.5]} />
        <meshStandardMaterial color="#3a2a1a" roughness={0.9} />
      </mesh>
    </group>
  );
}

function FlickerWindow({ position, color, rotation }: {
  position: [number, number, number]; color: string; rotation?: [number, number, number];
}) {
  const ref = useRef<THREE.MeshBasicMaterial>(null);
  const seed = useMemo(() => Math.random() * 100, []);
  const lit = useMemo(() => Math.random() > 0.25, []);

  useFrame((state) => {
    if (!ref.current || !lit) return;
    const t = state.clock.elapsedTime;
    ref.current.opacity = 0.5 + 0.35 * Math.sin(t * (0.6 + seed * 0.02) + seed);
  });

  return (
    <mesh position={position} rotation={rotation || [0, 0, 0]}>
      <planeGeometry args={[0.18, 0.25]} />
      <meshBasicMaterial
        ref={ref}
        color={lit ? color : "#1a1510"}
        transparent
        opacity={lit ? 0.7 : 0.15}
      />
    </mesh>
  );
}

/* ─── Clock Tower with Flag ─── */
function ClockTower() {
  const minuteRef = useRef<THREE.Mesh>(null);
  const hourRef = useRef<THREE.Mesh>(null);
  const flagRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (minuteRef.current) minuteRef.current.rotation.z = -t * 0.3;
    if (hourRef.current) hourRef.current.rotation.z = -t * 0.025;
    if (flagRef.current) {
      flagRef.current.rotation.z = Math.sin(t * 2) * 0.15;
      flagRef.current.rotation.y = Math.sin(t * 1.5) * 0.1;
    }
  });

  return (
    <group position={[0, 0, -3]}>
      {/* Base */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.8, 3, 1.8]} />
        <meshStandardMaterial color="#8b7355" roughness={0.85} />
      </mesh>
      {/* Arched door */}
      <mesh position={[0, 0.6, 0.91]}>
        <planeGeometry args={[0.5, 0.9]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.15, 0.91]}>
        <circleGeometry args={[0.25, 16, 0, Math.PI]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>
      {/* Upper section */}
      <mesh position={[0, 3.8, 0]}>
        <boxGeometry args={[1.4, 1.8, 1.4]} />
        <meshStandardMaterial color="#9b8365" roughness={0.8} />
      </mesh>
      {/* Trim bands */}
      <mesh position={[0, 3.0, 0]}>
        <boxGeometry args={[1.5, 0.08, 1.5]} />
        <meshStandardMaterial color="#d4a020" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 4.7, 0]}>
        <boxGeometry args={[1.5, 0.08, 1.5]} />
        <meshStandardMaterial color="#d4a020" metalness={0.7} roughness={0.3} />
      </mesh>
      {/* Clock face */}
      <mesh position={[0, 3.8, 0.71]}>
        <circleGeometry args={[0.5, 32]} />
        <meshStandardMaterial color="#f5e6c8" roughness={0.5} />
      </mesh>
      {/* Clock rim */}
      <mesh position={[0, 3.8, 0.70]}>
        <ringGeometry args={[0.48, 0.55, 32]} />
        <meshStandardMaterial color="#d4a020" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Minute hand */}
      <mesh ref={minuteRef} position={[0, 3.8, 0.73]}>
        <boxGeometry args={[0.03, 0.4, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Hour hand */}
      <mesh ref={hourRef} position={[0, 3.8, 0.74]}>
        <boxGeometry args={[0.04, 0.28, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Spire */}
      <mesh position={[0, 5.5, 0]}>
        <coneGeometry args={[0.85, 2, 4]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.7} metalness={0.15} />
      </mesh>
      {/* Flag pole */}
      <mesh position={[0, 6.9, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 1, 6]} />
        <meshStandardMaterial color="#888" metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Flag */}
      <mesh ref={flagRef} position={[0.2, 7.2, 0]}>
        <planeGeometry args={[0.4, 0.25]} />
        <meshStandardMaterial color="#e85d3a" side={THREE.DoubleSide} roughness={0.6} />
      </mesh>
      {/* Tower glow */}
      <pointLight position={[0, 4.5, 1.2]} color="#ffcc66" intensity={2.5} distance={8} decay={2} />
    </group>
  );
}

/* ─── Trees with layered canopy ─── */
function Tree({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 10, []);
  const scale = useMemo(() => 0.8 + Math.random() * 0.5, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.z = Math.sin(t * 0.7 + seed) * 0.04;
    ref.current.rotation.x = Math.sin(t * 0.5 + seed * 2) * 0.025;
  });

  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.55, 0]}>
        <cylinderGeometry args={[0.06, 0.12, 1.1, 6]} />
        <meshStandardMaterial color="#4a2a10" roughness={0.9} />
      </mesh>
      <group ref={ref}>
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.6, 8, 8]} />
          <meshStandardMaterial color="#1a4a20" roughness={0.9} />
        </mesh>
        <mesh position={[0.25, 1.55, 0.1]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#2a5a2a" roughness={0.9} />
        </mesh>
        <mesh position={[-0.2, 1.45, -0.12]}>
          <sphereGeometry args={[0.45, 8, 8]} />
          <meshStandardMaterial color="#1e5522" roughness={0.9} />
        </mesh>
        <mesh position={[0.05, 1.75, 0.05]}>
          <sphereGeometry args={[0.3, 8, 8]} />
          <meshStandardMaterial color="#256828" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Lamp Posts ─── */
function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.03, 0.06, 1.8, 6]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.9, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ffdd88" transparent opacity={0.9} />
      </mesh>
      {/* Warm ground glow cone */}
      <mesh position={[0, 0.8, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.8, 1.6, 16, 1, true]} />
        <meshBasicMaterial color="#ffcc44" transparent opacity={0.04} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0, 1.8, 0]} color="#ffcc66" intensity={1.5} distance={4} decay={2} />
    </group>
  );
}

/* ─── Graduation Caps (7) ─── */
function GraduationCap({ startPos, delay }: { startPos: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime * 0.35 + delay) % 6) / 6;
    ref.current.position.y = startPos[1] + t * 7;
    ref.current.position.x = startPos[0] + Math.sin(t * Math.PI) * 0.8;
    ref.current.position.z = startPos[2] + Math.cos(t * Math.PI * 0.6) * 0.4;
    ref.current.rotation.y = state.clock.elapsedTime * 1.8 + delay;
    ref.current.rotation.x = Math.sin(t * Math.PI) * 0.5;
    const scale = t > 0.85 ? 1 - (t - 0.85) / 0.15 : Math.min(t * 6, 1);
    ref.current.scale.setScalar(scale * 0.3);
  });

  return (
    <group ref={ref} position={startPos}>
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} />
      </mesh>
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.15, 8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#d4a020" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Fireflies (18) ─── */
function Fireflies() {
  const count = 18;
  const ref = useRef<THREE.Points>(null);
  const data = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const offsets = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = 0.2 + Math.random() * 1.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      offsets[i] = Math.random() * Math.PI * 2;
    }
    return { pos, offsets };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const positions = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      positions[i * 3] = data.pos[i * 3] + Math.sin(t * 0.5 + data.offsets[i]) * 0.3;
      positions[i * 3 + 1] = data.pos[i * 3 + 1] + Math.sin(t * 0.8 + data.offsets[i] * 2) * 0.2;
      positions[i * 3 + 2] = data.pos[i * 3 + 2] + Math.cos(t * 0.4 + data.offsets[i]) * 0.2;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.5 + 0.4 * Math.sin(t * 1.2);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={data.pos.slice()} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#aaff44" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

/* ─── Stars (twinkling) ─── */
function Stars() {
  const count = 250;
  const ref = useRef<THREE.Points>(null);
  const sizes = useMemo(() => {
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) s[i] = Math.random();
    return s;
  }, []);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 50;
      arr[i * 3 + 1] = 7 + Math.random() * 18;
      arr[i * 3 + 2] = -8 - Math.random() * 25;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.3 + 0.3 * Math.sin(state.clock.elapsedTime * 0.4);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#e8d8ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── Moon with craters ─── */
function Moon() {
  return (
    <group position={[10, 14, -20]}>
      <mesh>
        <sphereGeometry args={[1.8, 32, 32]} />
        <meshStandardMaterial color="#e8e0d0" emissive="#ffe8c0" emissiveIntensity={0.3} roughness={0.9} />
      </mesh>
      {/* Craters */}
      {[
        [0.4, 0.6, 1.5, 0.25],
        [-0.5, 0.2, 1.6, 0.2],
        [0.1, -0.5, 1.65, 0.18],
        [-0.3, 0.8, 1.55, 0.15],
        [0.6, -0.2, 1.6, 0.12],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x as number, y as number, z as number]}>
          <sphereGeometry args={[r as number, 12, 12]} />
          <meshStandardMaterial color="#c8c0b0" roughness={0.95} />
        </mesh>
      ))}
      <pointLight position={[0, 0, 3]} color="#ffe8c0" intensity={1} distance={30} decay={2} />
    </group>
  );
}

/* ─── Drifting Clouds ─── */
function Cloud({ position, scale }: { position: [number, number, number]; scale: number }) {
  const ref = useRef<THREE.Group>(null);
  const speed = useMemo(() => 0.1 + Math.random() * 0.15, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.position.x = position[0] + ((state.clock.elapsedTime * speed) % 30) - 15;
  });

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[1, 8, 8]} />
        <meshBasicMaterial color="#2a2040" transparent opacity={0.15} />
      </mesh>
      <mesh position={[0.8, 0.1, 0]}>
        <sphereGeometry args={[0.7, 8, 8]} />
        <meshBasicMaterial color="#2a2040" transparent opacity={0.12} />
      </mesh>
      <mesh position={[-0.6, 0.15, 0.2]}>
        <sphereGeometry args={[0.6, 8, 8]} />
        <meshBasicMaterial color="#2a2040" transparent opacity={0.12} />
      </mesh>
    </group>
  );
}

/* ─── Ground ─── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[40, 40]} />
      <meshStandardMaterial color="#2a4a1a" roughness={0.95} />
    </mesh>
  );
}

/* ─── Pathways ─── */
function Pathways() {
  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1]}>
        <planeGeometry args={[1.2, 12]} />
        <meshStandardMaterial color="#c4a882" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1.5]}>
        <planeGeometry args={[16, 0.8]} />
        <meshStandardMaterial color="#c4a882" roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ─── Dusk Sky Gradient ─── */
function SkyGradient() {
  return (
    <group>
      <mesh position={[0, 8, -18]}>
        <planeGeometry args={[60, 20]} />
        <meshBasicMaterial color="#1a1030" />
      </mesh>
      {/* Horizon glow */}
      <mesh position={[0, 2, -17]}>
        <planeGeometry args={[60, 6]} />
        <meshBasicMaterial color="#2a1a40" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.5, -16]}>
        <planeGeometry args={[60, 3]} />
        <meshBasicMaterial color="#4a2a20" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

/* ─── Main Scene ─── */
export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [7, 5.5, 11], fov: 38, near: 0.1, far: 80 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        <color attach="background" args={["#120a20"]} />
        <fog attach="fog" args={["#120a20", 16, 40]} />

        {/* Lighting */}
        <ambientLight intensity={0.12} color="#ffd8a0" />
        <directionalLight position={[-8, 5, 5]} intensity={1.3} color="#ff9944" />
        <directionalLight position={[5, 8, 3]} intensity={0.35} color="#cc88ff" />
        <hemisphereLight args={["#cc88ff", "#2a4a1a", 0.2]} />

        <Ground />
        <SkyGradient />
        <Pathways />

        {/* Clock Tower (center) */}
        <ClockTower />

        {/* 6 Named Buildings */}
        <NamedBuilding position={[-5, 0, -1.5]} width={2.8} height={2.4} depth={2} color="#8b7355" windowColor="#ffd070" roofColor="#6a4a30" label="Admin Block" />
        <NamedBuilding position={[5, 0, -1.5]} width={3.2} height={2} depth={2.2} color="#7a6a55" windowColor="#ffbb55" roofColor="#5a4a35" label="Academic Block" />
        <NamedBuilding position={[-3.5, 0, -6]} width={2.2} height={2.8} depth={1.6} color="#9a8565" windowColor="#88ccff" roofColor="#7a5a3a" label="Library" />
        <NamedBuilding position={[3.5, 0, -6]} width={3} height={2} depth={2} color="#8a7555" windowColor="#ffaa66" roofColor="#6a5035" label="Auditorium" />
        <NamedBuilding position={[-6.5, 0, -4.5]} width={2} height={2.2} depth={1.5} color="#7b6b50" windowColor="#ffdd88" roofColor="#5a4530" label="Hostel A" />
        <NamedBuilding position={[6.5, 0, -4.5]} width={2} height={2.2} depth={1.5} color="#7b6b50" windowColor="#ffcc77" roofColor="#5a4530" label="Hostel B" />

        {/* 4 Trees */}
        <Tree position={[-2, 0, 0.8]} />
        <Tree position={[2.2, 0, 1]} />
        <Tree position={[-6.5, 0, 0.5]} />
        <Tree position={[6.5, 0, 0.5]} />

        {/* 4 Lamp Posts */}
        <LampPost position={[-1.5, 0, 2]} />
        <LampPost position={[1.5, 0, 2]} />
        <LampPost position={[-3.5, 0, -1]} />
        <LampPost position={[3.5, 0, -1]} />

        {/* 7 Graduation Caps */}
        <GraduationCap startPos={[-0.5, 2, -2]} delay={0} />
        <GraduationCap startPos={[0.5, 2, -2.5]} delay={1} />
        <GraduationCap startPos={[0, 2.5, -1.5]} delay={2} />
        <GraduationCap startPos={[-1.2, 2, -3]} delay={3} />
        <GraduationCap startPos={[1.2, 2, -1.8]} delay={0.7} />
        <GraduationCap startPos={[-0.8, 2.2, -4]} delay={4.2} />
        <GraduationCap startPos={[0.8, 2, -3.5]} delay={5} />

        {/* 18 Fireflies */}
        <Fireflies />

        {/* Stars */}
        <Stars />

        {/* Moon */}
        <Moon />

        {/* Clouds */}
        <Cloud position={[-8, 12, -15]} scale={1.2} />
        <Cloud position={[5, 10, -18]} scale={0.9} />
        <Cloud position={[-3, 11, -20]} scale={1} />
        <Cloud position={[10, 13, -16]} scale={0.7} />
      </Canvas>
    </div>
  );
}
