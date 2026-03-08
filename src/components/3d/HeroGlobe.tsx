import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function CampusBuilding({ position, scale, color }: { position: [number, number, number]; scale: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.05;
  });
  return (
    <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.4}>
      <group>
        <mesh ref={meshRef} position={position} castShadow>
          <boxGeometry args={scale} />
          <meshStandardMaterial color={color} transparent opacity={0.7} roughness={0.3} metalness={0.6} />
        </mesh>
        {/* Pillars */}
        {[-0.2, 0, 0.2].map((x, i) => (
          <mesh key={i} position={[position[0] + x, position[1] - scale[1] * 0.3, position[2] + scale[2] * 0.55]}>
            <cylinderGeometry args={[0.03, 0.03, scale[1] * 0.6, 8]} />
            <meshStandardMaterial color={color} transparent opacity={0.5} metalness={0.8} />
          </mesh>
        ))}
        {/* Roof */}
        <mesh position={[position[0], position[1] + scale[1] / 2 + 0.2, position[2]]}>
          <coneGeometry args={[scale[0] * 0.8, 0.5, 4]} />
          <meshStandardMaterial color={color} transparent opacity={0.5} roughness={0.2} metalness={0.8} />
        </mesh>
      </group>
    </Float>
  );
}

function BookStack({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group position={position}>
        {[0, 0.12, 0.24, 0.36, 0.48].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0, i * 0.2, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.35]} />
            <meshStandardMaterial
              color={["#00FFD1", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444"][i]}
              transparent opacity={0.65} roughness={0.4} metalness={0.3}
            />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function GraduationCap({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.3;
  });
  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1}>
      <group ref={groupRef} position={position}>
        <mesh rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.9, 0.04, 0.9]} />
          <meshStandardMaterial color="#00FFD1" transparent opacity={0.8} metalness={0.7} roughness={0.2} />
        </mesh>
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.25, 0.3, 0.25, 8]} />
          <meshStandardMaterial color="#0ea5e9" transparent opacity={0.6} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0.4, -0.1, 0]}>
          <sphereGeometry args={[0.06, 8, 8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function Pencil({ position, rotation }: { position: [number, number, number]; rotation?: [number, number, number] }) {
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.7}>
      <group position={position} rotation={rotation || [0, 0, 0.5]}>
        <mesh>
          <cylinderGeometry args={[0.04, 0.04, 1, 6]} />
          <meshStandardMaterial color="#f59e0b" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, 0.55, 0]}>
          <coneGeometry args={[0.04, 0.15, 6]} />
          <meshStandardMaterial color="#fde68a" transparent opacity={0.8} />
        </mesh>
        <mesh position={[0, -0.52, 0]}>
          <cylinderGeometry args={[0.045, 0.04, 0.06, 6]} />
          <meshStandardMaterial color="#ec4899" transparent opacity={0.7} />
        </mesh>
      </group>
    </Float>
  );
}

function Chalkboard({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={1} rotationIntensity={0.15} floatIntensity={0.3}>
      <group position={position}>
        {/* Frame */}
        <mesh>
          <boxGeometry args={[1.4, 1, 0.06]} />
          <meshStandardMaterial color="#854d0e" transparent opacity={0.7} roughness={0.6} />
        </mesh>
        {/* Board surface */}
        <mesh position={[0, 0, 0.035]}>
          <boxGeometry args={[1.2, 0.8, 0.01]} />
          <meshStandardMaterial color="#064e3b" transparent opacity={0.8} roughness={0.9} />
        </mesh>
        {/* Chalk marks */}
        {[[-0.3, 0.2], [0, 0], [0.3, -0.15]].map(([x, y], i) => (
          <mesh key={i} position={[x, y, 0.05]}>
            <boxGeometry args={[0.3, 0.02, 0.005]} />
            <meshStandardMaterial color="#ffffff" transparent opacity={0.4} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function Atom({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.z += delta * 0.5;
  });
  return (
    <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.6}>
      <group ref={groupRef} position={position}>
        <mesh>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#00FFD1" emissive="#00FFD1" emissiveIntensity={0.8} />
        </mesh>
        {[0, Math.PI / 3, -Math.PI / 3].map((rot, i) => (
          <mesh key={i} rotation={[rot, 0, 0]}>
            <torusGeometry args={[0.35, 0.012, 8, 48]} />
            <meshStandardMaterial color={["#0ea5e9", "#8b5cf6", "#00FFD1"][i]} transparent opacity={0.6} metalness={0.5} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const pos = new Float32Array(600 * 3);
    for (let i = 0; i < 600; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 5;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    return pos;
  }, []);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial transparent color="#00FFD1" size={0.02} sizeAttenuation depthWrite={false} opacity={0.4} />
    </points>
  );
}

export default function HeroGlobe() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={0.6} color="#00FFD1" />
        <pointLight position={[-3, 2, 4]} intensity={0.4} color="#0ea5e9" />

        <GraduationCap position={[0, 2, 0.5]} />
        <BookStack position={[-2, -1.2, 0.5]} />
        <BookStack position={[2.5, 0.8, -0.5]} />
        <CampusBuilding position={[-2.8, 0.8, -0.5]} scale={[0.7, 1, 0.5]} color="#0ea5e9" />
        <CampusBuilding position={[2.8, -0.8, 0]} scale={[0.6, 0.8, 0.5]} color="#8b5cf6" />
        <Chalkboard position={[0, -0.5, 0]} />
        <Pencil position={[1.5, 1.5, 0.3]} rotation={[0, 0, 0.8]} />
        <Pencil position={[-1.8, 1.2, -0.3]} rotation={[0.3, 0, -0.6]} />
        <Atom position={[1, -1.8, 0.5]} />
        <Atom position={[-1.2, 1.8, -0.3]} />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
