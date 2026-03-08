import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Environment } from "@react-three/drei";
import * as THREE from "three";

/* ─── Clock Tower ─── */
function ClockTower() {
  const minuteRef = useRef<THREE.Mesh>(null);
  const hourRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (minuteRef.current) minuteRef.current.rotation.z = -t * 0.3;
    if (hourRef.current) hourRef.current.rotation.z = -t * 0.025;
  });

  return (
    <group position={[0, 0, -3]}>
      {/* Base */}
      <mesh position={[0, 1.5, 0]}>
        <boxGeometry args={[1.6, 3, 1.6]} />
        <meshStandardMaterial color="#8b7355" roughness={0.85} />
      </mesh>
      {/* Upper section */}
      <mesh position={[0, 3.8, 0]}>
        <boxGeometry args={[1.3, 1.6, 1.3]} />
        <meshStandardMaterial color="#9b8365" roughness={0.8} />
      </mesh>
      {/* Clock face */}
      <mesh position={[0, 3.8, 0.66]}>
        <circleGeometry args={[0.45, 32]} />
        <meshStandardMaterial color="#f5e6c8" roughness={0.5} />
      </mesh>
      {/* Minute hand */}
      <mesh ref={minuteRef} position={[0, 3.8, 0.68]}>
        <boxGeometry args={[0.03, 0.35, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Hour hand */}
      <mesh ref={hourRef} position={[0, 3.8, 0.69]}>
        <boxGeometry args={[0.04, 0.25, 0.02]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Spire roof */}
      <mesh position={[0, 5.2, 0]}>
        <coneGeometry args={[0.8, 1.8, 4]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.7} metalness={0.2} />
      </mesh>
      {/* Top finial */}
      <mesh position={[0, 6.2, 0]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#d4a020" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Tower light */}
      <pointLight position={[0, 4.5, 1]} color="#ffcc66" intensity={2} distance={8} decay={2} />
    </group>
  );
}

/* ─── Building ─── */
function Building({ position, width, height, depth, color, windowColor, roofColor }: {
  position: [number, number, number]; width: number; height: number; depth: number;
  color: string; windowColor?: string; roofColor?: string;
}) {
  const wc = windowColor || "#ffd070";
  const rows = Math.floor(height / 0.7);
  const cols = Math.floor(width / 0.6);

  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      {/* Roof */}
      <mesh position={[0, height + 0.15, 0]}>
        <boxGeometry args={[width + 0.15, 0.3, depth + 0.15]} />
        <meshStandardMaterial color={roofColor || "#5a4030"} roughness={0.7} />
      </mesh>
      {/* Windows */}
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => {
          const lit = Math.random() > 0.3;
          return (
            <GlowWindow
              key={`${r}-${c}`}
              position={[
                -width / 2 + 0.4 + c * (width - 0.5) / Math.max(cols - 1, 1),
                0.5 + r * 0.7,
                depth / 2 + 0.01
              ]}
              color={wc}
              lit={lit}
            />
          );
        })
      )}
    </group>
  );
}

function GlowWindow({ position, color, lit }: { position: [number, number, number]; color: string; lit: boolean }) {
  const ref = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    if (!ref.current || !lit) return;
    ref.current.opacity = 0.5 + 0.3 * Math.sin(state.clock.elapsedTime * 0.8 + position[0] * 3 + position[1] * 2);
  });

  return (
    <mesh position={position}>
      <planeGeometry args={[0.2, 0.3]} />
      <meshBasicMaterial
        ref={ref}
        color={lit ? color : "#2a2520"}
        transparent
        opacity={lit ? 0.7 : 0.3}
      />
    </mesh>
  );
}

/* ─── Trees ─── */
function Tree({ position }: { position: [number, number, number] }) {
  const ref = useRef<THREE.Group>(null);
  const seed = useMemo(() => Math.random() * 10, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8 + seed) * 0.03;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.6 + seed * 2) * 0.02;
  });

  const scale = 0.8 + Math.random() * 0.4;

  return (
    <group position={position} scale={scale}>
      {/* Trunk */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.06, 0.1, 1, 6]} />
        <meshStandardMaterial color="#5a3a1a" roughness={0.9} />
      </mesh>
      {/* Canopy */}
      <group ref={ref}>
        <mesh position={[0, 1.3, 0]}>
          <sphereGeometry args={[0.55, 8, 8]} />
          <meshStandardMaterial color="#1a4a20" roughness={0.9} />
        </mesh>
        <mesh position={[0.2, 1.6, 0.1]}>
          <sphereGeometry args={[0.35, 8, 8]} />
          <meshStandardMaterial color="#2a5a2a" roughness={0.9} />
        </mesh>
        <mesh position={[-0.15, 1.5, -0.1]}>
          <sphereGeometry args={[0.4, 8, 8]} />
          <meshStandardMaterial color="#1e5522" roughness={0.9} />
        </mesh>
      </group>
    </group>
  );
}

/* ─── Lamp Post ─── */
function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.03, 0.05, 1.6, 6]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.4} />
      </mesh>
      {/* Lamp head */}
      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial color="#ffdd88" transparent opacity={0.9} />
      </mesh>
      <pointLight position={[position[0], position[1] + 1.8, position[2]]} color="#ffcc66" intensity={1.2} distance={4} decay={2} />
    </group>
  );
}

/* ─── Pathways ─── */
function Pathways() {
  return (
    <group>
      {/* Main path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 1]}>
        <planeGeometry args={[1.2, 10]} />
        <meshStandardMaterial color="#c4a882" roughness={0.95} />
      </mesh>
      {/* Cross path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -1]}>
        <planeGeometry args={[12, 0.8]} />
        <meshStandardMaterial color="#c4a882" roughness={0.95} />
      </mesh>
    </group>
  );
}

/* ─── Graduation Caps ─── */
function GraduationCap({ startPos, delay }: { startPos: [number, number, number]; delay: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = ((state.clock.elapsedTime * 0.4 + delay) % 5) / 5;
    // Arc upward
    ref.current.position.y = startPos[1] + t * 6;
    ref.current.position.x = startPos[0] + Math.sin(t * Math.PI) * 0.5;
    ref.current.position.z = startPos[2] + Math.sin(t * Math.PI * 0.7) * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * 2 + delay;
    ref.current.rotation.x = Math.sin(t * Math.PI) * 0.4;
    // Fade out at top
    const scale = t > 0.8 ? 1 - (t - 0.8) / 0.2 : Math.min(t * 5, 1);
    ref.current.scale.setScalar(scale * 0.3);
  });

  return (
    <group ref={ref} position={startPos}>
      {/* Cap board */}
      <mesh position={[0, 0.05, 0]}>
        <boxGeometry args={[0.8, 0.06, 0.8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} />
      </mesh>
      {/* Cap dome */}
      <mesh position={[0, -0.05, 0]}>
        <cylinderGeometry args={[0.3, 0.35, 0.15, 8]} />
        <meshStandardMaterial color="#1a1a2e" roughness={0.6} />
      </mesh>
      {/* Tassel button */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.04, 6, 6]} />
        <meshStandardMaterial color="#d4a020" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ─── Stars ─── */
function Stars() {
  const count = 200;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = 6 + Math.random() * 15;
      arr[i * 3 + 2] = -5 - Math.random() * 20;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.4 + 0.3 * Math.sin(state.clock.elapsedTime * 0.5);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#e8d8ff" transparent opacity={0.5} sizeAttenuation />
    </points>
  );
}

/* ─── Ground ─── */
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color="#2a4a1a" roughness={0.95} />
    </mesh>
  );
}

/* ─── Sky Gradient (upper purple) ─── */
function SkyDome() {
  return (
    <mesh position={[0, 0, -15]}>
      <planeGeometry args={[60, 30]} />
      <meshBasicMaterial color="#1a1030" />
    </mesh>
  );
}

/* ─── Main Scene ─── */
export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [6, 5, 10], fov: 40, near: 0.1, far: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: false }}
      >
        {/* Purple-gold dusk sky */}
        <color attach="background" args={["#1a1030"]} />
        <fog attach="fog" args={["#1a1030", 15, 35]} />

        {/* Golden hour lighting */}
        <ambientLight intensity={0.15} color="#ffd8a0" />
        <directionalLight position={[-8, 4, 5]} intensity={1.2} color="#ff9944" />
        <directionalLight position={[5, 8, 3]} intensity={0.3} color="#cc88ff" />
        <hemisphereLight args={["#cc88ff", "#2a4a1a", 0.2]} />

        {/* Ground & Sky */}
        <Ground />
        <SkyDome />
        <Pathways />

        {/* Clock Tower (center) */}
        <ClockTower />

        {/* Buildings */}
        <Building position={[-4.5, 0, -2]} width={2.5} height={2.2} depth={1.8} color="#8b7355" roofColor="#6a4a30" />
        <Building position={[4.5, 0, -2]} width={3} height={1.8} depth={2} color="#7a6a55" windowColor="#ffbb55" roofColor="#5a4a35" />
        <Building position={[-3, 0, -5.5]} width={2} height={2.8} depth={1.5} color="#9a8565" roofColor="#7a5a3a" />
        <Building position={[3.5, 0, -5.5]} width={2.5} height={2.5} depth={1.5} color="#8a7555" roofColor="#6a5035" />

        {/* Trees */}
        <Tree position={[-2, 0, 0.5]} />
        <Tree position={[2.2, 0, 0.8]} />
        <Tree position={[-6, 0, -1]} />
        <Tree position={[6, 0, -0.5]} />
        <Tree position={[-1, 0, -6]} />
        <Tree position={[5.5, 0, -5]} />
        <Tree position={[-5.5, 0, -5]} />
        <Tree position={[1.5, 0, -4]} />

        {/* Lamp Posts */}
        <LampPost position={[-1.5, 0, 1.5]} />
        <LampPost position={[1.5, 0, 1.5]} />
        <LampPost position={[-3, 0, -1]} />
        <LampPost position={[3, 0, -1]} />

        {/* Graduation Caps arcing upward */}
        <GraduationCap startPos={[-0.5, 2, -2]} delay={0} />
        <GraduationCap startPos={[0.5, 2, -2.5]} delay={1.2} />
        <GraduationCap startPos={[0, 2.5, -1.5]} delay={2.5} />
        <GraduationCap startPos={[-1, 2, -3]} delay={3.8} />
        <GraduationCap startPos={[1.2, 2, -1.8]} delay={0.8} />

        {/* Stars */}
        <Stars />

        <Environment preset="sunset" environmentIntensity={0.15} />
      </Canvas>
    </div>
  );
}
