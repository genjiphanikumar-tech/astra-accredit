import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function CampusBuilding({ position, scale, color }: { position: [number, number, number]; scale: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh ref={meshRef} position={position} castShadow>
        <boxGeometry args={scale} />
        <meshStandardMaterial color={color} transparent opacity={0.7} roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Roof / dome */}
      <mesh position={[position[0], position[1] + scale[1] / 2 + 0.15, position[2]]}>
        <coneGeometry args={[scale[0] * 0.7, 0.4, 4]} />
        <meshStandardMaterial color={color} transparent opacity={0.5} roughness={0.2} metalness={0.8} />
      </mesh>
    </Float>
  );
}

function BookStack({ position }: { position: [number, number, number] }) {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
      <group position={position}>
        {[0, 0.12, 0.24, 0.36].map((y, i) => (
          <mesh key={i} position={[0, y, 0]} rotation={[0, i * 0.15, 0]}>
            <boxGeometry args={[0.5, 0.1, 0.35]} />
            <meshStandardMaterial
              color={["#00FFD1", "#0ea5e9", "#8b5cf6", "#f59e0b"][i]}
              transparent
              opacity={0.65}
              roughness={0.4}
              metalness={0.3}
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
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <Float speed={1.8} rotationIntensity={0.4} floatIntensity={1}>
      <group ref={groupRef} position={position}>
        {/* Cap board */}
        <mesh position={[0, 0, 0]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.8, 0.04, 0.8]} />
          <meshStandardMaterial color="#00FFD1" transparent opacity={0.8} metalness={0.7} roughness={0.2} />
        </mesh>
        {/* Cap base */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.25, 0.3, 0.25, 8]} />
          <meshStandardMaterial color="#0ea5e9" transparent opacity={0.6} metalness={0.5} roughness={0.3} />
        </mesh>
        {/* Tassel */}
        <mesh position={[0.35, -0.1, 0]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function AcademicOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.2, 64, 64]} />
      <MeshDistortMaterial
        color="#00FFD1"
        transparent
        opacity={0.08}
        wireframe
        distort={0.2}
        speed={2}
        roughness={0}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(800 * 3);
    for (let i = 0; i < 800; i++) {
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
    if (ref.current) {
      ref.current.rotation.y += delta * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial transparent color="#00FFD1" size={0.025} sizeAttenuation depthWrite={false} opacity={0.5} />
    </points>
  );
}

function ConnectionLines() {
  const groupRef = useRef<THREE.Group>(null);

  const lines = useMemo(() => {
    const points: { start: THREE.Vector3; end: THREE.Vector3 }[] = [
      { start: new THREE.Vector3(-2.5, 0.5, 0), end: new THREE.Vector3(0, 1.5, 0.5) },
      { start: new THREE.Vector3(2.5, -0.5, 0), end: new THREE.Vector3(0, 1.5, 0.5) },
      { start: new THREE.Vector3(-1.5, -1.5, 0.5), end: new THREE.Vector3(1.5, -1.5, -0.5) },
      { start: new THREE.Vector3(0, 1.5, 0.5), end: new THREE.Vector3(1.5, -1.5, -0.5) },
    ];
    return points;
  }, []);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <group ref={groupRef}>
      {lines.map((line, i) => {
        const curve = new THREE.LineCurve3(line.start, line.end);
        const pts = curve.getPoints(20);
        const geometry = new THREE.BufferGeometry().setFromPoints(pts);
        return (
          <primitive key={i} object={new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: "#00FFD1", transparent: true, opacity: 0.15 }))} />
        );
      })}
    </group>
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

        <AcademicOrb />
        <GraduationCap position={[0, 1.5, 0.5]} />
        <BookStack position={[-1.5, -1.5, 0.5]} />
        <CampusBuilding position={[-2.5, 0.5, 0]} scale={[0.6, 0.8, 0.5]} color="#0ea5e9" />
        <CampusBuilding position={[2.5, -0.5, 0]} scale={[0.5, 1, 0.4]} color="#8b5cf6" />
        <CampusBuilding position={[1.5, -1.5, -0.5]} scale={[0.7, 0.6, 0.5]} color="#00FFD1" />
        <ConnectionLines />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
