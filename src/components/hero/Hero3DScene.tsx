import { useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ─── Bookshelf ─── */
function Bookshelf({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  const shelfColor = "#3b2314";
  const shelfW = 3.2;
  const shelfH = 5;
  const shelfD = 0.7;
  const shelves = 5;

  const bookColors = useMemo(() => {
    const palette = ["#8b1a1a", "#1a3c5e", "#2e4a1e", "#5c3317", "#4a1942", "#1a4a4a", "#6b3a00", "#2b1055", "#5e1a1a", "#1a5e3a"];
    return Array.from({ length: 40 }, () => palette[Math.floor(Math.random() * palette.length)]);
  }, []);

  return (
    <group position={position} rotation={rotation}>
      {/* Back panel */}
      <mesh position={[0, shelfH / 2, -shelfD / 2]}>
        <boxGeometry args={[shelfW, shelfH, 0.08]} />
        <meshStandardMaterial color="#2a1a0a" roughness={0.9} />
      </mesh>
      {/* Side panels */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (shelfW / 2 - 0.05), shelfH / 2, -shelfD / 4]}>
          <boxGeometry args={[0.1, shelfH, shelfD]} />
          <meshStandardMaterial color={shelfColor} roughness={0.7} metalness={0.1} />
        </mesh>
      ))}
      {/* Shelf boards + books */}
      {Array.from({ length: shelves }).map((_, i) => {
        const y = (i / (shelves - 1)) * (shelfH - 0.3) + 0.15;
        return (
          <group key={i}>
            <mesh position={[0, y, -shelfD / 4]}>
              <boxGeometry args={[shelfW - 0.1, 0.08, shelfD]} />
              <meshStandardMaterial color={shelfColor} roughness={0.7} metalness={0.1} />
            </mesh>
            {/* Books on shelf */}
            {i < shelves - 1 && (
              <BooksRow y={y + 0.04} width={shelfW - 0.3} depth={shelfD} colors={bookColors} rowIndex={i} />
            )}
          </group>
        );
      })}
      {/* Top crown */}
      <mesh position={[0, shelfH + 0.08, -shelfD / 4]}>
        <boxGeometry args={[shelfW + 0.1, 0.16, shelfD + 0.1]} />
        <meshStandardMaterial color="#4a2a12" roughness={0.6} metalness={0.15} />
      </mesh>
    </group>
  );
}

function BooksRow({ y, width, depth, colors, rowIndex }: { y: number; width: number; depth: number; colors: string[]; rowIndex: number }) {
  const books = useMemo(() => {
    const arr: { x: number; w: number; h: number; color: string; tilt: number }[] = [];
    let x = -width / 2 + 0.05;
    let idx = rowIndex * 8;
    while (x < width / 2 - 0.1) {
      const w = 0.08 + Math.random() * 0.12;
      const h = 0.5 + Math.random() * 0.4;
      const tilt = Math.random() > 0.85 ? (Math.random() - 0.5) * 0.15 : 0;
      arr.push({ x: x + w / 2, w, h, color: colors[idx % colors.length], tilt });
      x += w + 0.01;
      idx++;
    }
    return arr;
  }, [width, colors, rowIndex]);

  return (
    <group>
      {books.map((b, i) => (
        <mesh key={i} position={[b.x, y + b.h / 2, -depth / 4]} rotation={[0, 0, b.tilt]}>
          <boxGeometry args={[b.w, b.h, 0.45]} />
          <meshStandardMaterial color={b.color} roughness={0.85} metalness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Chandelier ─── */
function Chandelier() {
  return (
    <group position={[0, 5.5, -1]}>
      {/* Chain */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 2.4, 8]} />
        <meshStandardMaterial color="#8b7a3a" metalness={0.9} roughness={0.3} />
      </mesh>
      {/* Ring */}
      <mesh>
        <torusGeometry args={[1.2, 0.05, 8, 32]} />
        <meshStandardMaterial color="#b8960c" metalness={0.85} roughness={0.25} />
      </mesh>
      {/* Arms & candles */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2;
        const x = Math.cos(angle) * 1.2;
        const z = Math.sin(angle) * 1.2;
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Candle holder */}
            <mesh position={[0, 0.1, 0]}>
              <cylinderGeometry args={[0.06, 0.04, 0.2, 8]} />
              <meshStandardMaterial color="#b8960c" metalness={0.85} roughness={0.3} />
            </mesh>
            {/* Candle */}
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.035, 0.04, 0.3, 8]} />
              <meshStandardMaterial color="#f5e6c8" roughness={0.9} />
            </mesh>
            <CandleFlame position={[x, 5.5 + 0.55, z - 1]} index={i} />
          </group>
        );
      })}
    </group>
  );
}

function CandleFlame({ position, index }: { position: [number, number, number]; index: number }) {
  const ref = useRef<THREE.PointLight>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const flicker = 0.7 + 0.3 * Math.sin(t * 8 + index * 2.1) * Math.sin(t * 13 + index * 1.3);
    if (ref.current) {
      ref.current.intensity = flicker * 1.5;
    }
    if (meshRef.current) {
      meshRef.current.scale.y = 0.8 + 0.2 * flicker;
      meshRef.current.scale.x = 0.9 + 0.1 * Math.sin(t * 10 + index);
    }
  });

  return (
    <group position={position}>
      <pointLight ref={ref} color="#ffaa44" intensity={1.5} distance={6} decay={2} />
      <mesh ref={meshRef} position={[0, 0.04, 0]}>
        <sphereGeometry args={[0.04, 8, 8]} />
        <meshBasicMaterial color="#ffcc55" transparent opacity={0.9} />
      </mesh>
    </group>
  );
}

/* ─── Floating Books (Paper → Digital SAR) ─── */
function FloatingBook({ position, delay }: { position: [number, number, number]; delay: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const glowRef = useRef<THREE.MeshBasicMaterial>(null);
  const [phase, setPhase] = useState(0);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cycle = ((t * 0.3 + delay) % 6) / 6; // 0-1 cycle

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.5 + delay) * 0.3;
      groupRef.current.rotation.x = Math.sin(t * 0.3 + delay * 2) * 0.1 - 0.2;
    }

    // Transition: 0-0.4 = old paper, 0.4-0.6 = transforming, 0.6-1.0 = digital SAR
    const newPhase = cycle < 0.4 ? 0 : cycle < 0.6 ? 1 : 2;
    if (newPhase !== phase) setPhase(newPhase);

    if (matRef.current) {
      if (cycle < 0.4) {
        matRef.current.color.setHex(0xd4b896);
        matRef.current.emissive.setHex(0x000000);
        matRef.current.emissiveIntensity = 0;
      } else if (cycle < 0.6) {
        const blend = (cycle - 0.4) / 0.2;
        matRef.current.color.lerpColors(new THREE.Color(0xd4b896), new THREE.Color(0x1a3a5e), blend);
        matRef.current.emissive.setHex(0xfb923c);
        matRef.current.emissiveIntensity = blend * 0.5;
      } else {
        matRef.current.color.setHex(0x0f2a44);
        matRef.current.emissive.setHex(0xfb923c);
        matRef.current.emissiveIntensity = 0.3 + 0.15 * Math.sin(t * 3 + delay);
      }
    }

    if (glowRef.current) {
      glowRef.current.opacity = cycle > 0.5 ? Math.min((cycle - 0.5) * 4, 0.6) : 0;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={1.5} floatingRange={[-0.3, 0.3]}>
      <group ref={groupRef} position={position}>
        {/* Book cover */}
        <mesh>
          <boxGeometry args={[0.8, 0.05, 1.1]} />
          <meshStandardMaterial ref={matRef} color="#d4b896" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Pages (left) */}
        <mesh position={[-0.15, 0.15, 0]} rotation={[0, 0, 0.25]}>
          <boxGeometry args={[0.35, 0.005, 0.95]} />
          <meshStandardMaterial color="#f5e6c8" roughness={0.95} />
        </mesh>
        {/* Pages (right) */}
        <mesh position={[0.15, 0.15, 0]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.35, 0.005, 0.95]} />
          <meshStandardMaterial color="#f5e6c8" roughness={0.95} />
        </mesh>
        {/* Digital glow overlay */}
        <mesh position={[0, 0.08, 0]}>
          <boxGeometry args={[0.82, 0.01, 1.12]} />
          <meshBasicMaterial ref={glowRef} color="#fb923c" transparent opacity={0} />
        </mesh>
        {/* SAR hologram lines when digital */}
        <SARHologramLines position={[0, 0.2, 0]} delay={delay} />
      </group>
    </Float>
  );
}

function SARHologramLines({ position, delay }: { position: [number, number, number]; delay: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const cycle = ((t * 0.3 + delay) % 6) / 6;
    if (groupRef.current) {
      groupRef.current.visible = cycle > 0.55;
      groupRef.current.children.forEach((child, i) => {
        const lineDelay = cycle - 0.55 - i * 0.03;
        (child as THREE.Mesh).scale.x = lineDelay > 0 ? Math.min(lineDelay * 10, 1) : 0;
      });
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={i} position={[0, i * 0.04, (i - 2.5) * 0.12]}>
          <boxGeometry args={[0.55, 0.008, 0.005]} />
          <meshBasicMaterial color={i % 2 === 0 ? "#fb923c" : "#fbbf24"} transparent opacity={0.7} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Dust Motes ─── */
function DustMotes() {
  const count = 120;
  const ref = useRef<THREE.Points>(null);

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 1] = Math.random() * 8;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
      vel[i * 3] = (Math.random() - 0.5) * 0.003;
      vel[i * 3 + 1] = 0.001 + Math.random() * 0.003;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      posArr[i * 3] += velocities[i * 3];
      posArr[i * 3 + 1] += velocities[i * 3 + 1];
      posArr[i * 3 + 2] += velocities[i * 3 + 2];
      // Reset when too high
      if (posArr[i * 3 + 1] > 8) {
        posArr[i * 3 + 1] = 0;
        posArr[i * 3] = (Math.random() - 0.5) * 14;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ffd080" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── Light Beams ─── */
function LightBeams() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.children.forEach((child, i) => {
      const mesh = child as THREE.Mesh;
      const mat = mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.04 + 0.025 * Math.sin(state.clock.elapsedTime * 0.5 + i * 1.5);
    });
  });

  return (
    <group ref={ref}>
      {[[-2, 0.3], [1.5, -0.2], [4, 0.1]].map(([x, rz], i) => (
        <mesh key={i} position={[x, 4, -2]} rotation={[0.1, 0, rz]}>
          <cylinderGeometry args={[0.3, 1.5, 8, 8, 1, true]} />
          <meshBasicMaterial color="#ffcc66" transparent opacity={0.05} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ─── Floor ─── */
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, -2]}>
      <planeGeometry args={[20, 15]} />
      <meshStandardMaterial color="#1a0f08" roughness={0.9} metalness={0.05} />
    </mesh>
  );
}

/* ─── Main Scene ─── */
export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50, near: 0.1, far: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
        shadows={false}
      >
        <color attach="background" args={["#0d0805"]} />
        <fog attach="fog" args={["#0d0805", 8, 22]} />

        {/* Ambient warm light */}
        <ambientLight intensity={0.08} color="#ffddaa" />

        {/* Key directional light from upper right (window) */}
        <directionalLight position={[6, 8, 3]} intensity={0.6} color="#ffd080" />
        <directionalLight position={[-4, 6, 2]} intensity={0.2} color="#ffaa55" />

        {/* Bookshelves */}
        <Bookshelf position={[-4.5, -0.5, -4]} rotation={[0, 0.15, 0]} />
        <Bookshelf position={[4.5, -0.5, -4]} rotation={[0, -0.15, 0]} />

        {/* Chandelier */}
        <Chandelier />

        {/* Floating Books transforming to SAR */}
        <FloatingBook position={[-1.5, 3, 0]} delay={0} />
        <FloatingBook position={[1.8, 2.5, -0.5]} delay={2} />
        <FloatingBook position={[0, 3.8, -1.5]} delay={4} />

        {/* Dust Motes */}
        <DustMotes />

        {/* Golden Light Beams */}
        <LightBeams />

        {/* Floor */}
        <Floor />

        <Environment preset="apartment" environmentIntensity={0.1} />
      </Canvas>
    </div>
  );
}
