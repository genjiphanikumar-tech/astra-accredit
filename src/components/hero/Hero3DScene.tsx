import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, MeshTransmissionMaterial, Environment } from "@react-three/drei";
import * as THREE from "three";

function FloatingTorus() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.3;
    ref.current.rotation.y = state.clock.elapsedTime * 0.2;
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <mesh ref={ref} position={[-3, 1.5, -2]} scale={1.2}>
        <torusGeometry args={[1, 0.4, 32, 64]} />
        <MeshDistortMaterial
          color="#fb923c"
          emissive="#fb923c"
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.8}
          distort={0.15}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

function FloatingSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={2}>
      <mesh ref={ref} position={[3.5, -0.5, -1]} scale={1.8}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#eab308"
          emissive="#eab308"
          emissiveIntensity={0.15}
          roughness={0.1}
          metalness={0.9}
          distort={0.25}
          speed={1.5}
        />
      </mesh>
    </Float>
  );
}

function FloatingIcosahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.25;
    ref.current.rotation.z = state.clock.elapsedTime * 0.15;
  });

  return (
    <Float speed={1.8} rotationIntensity={0.8} floatIntensity={1}>
      <mesh ref={ref} position={[0, -2, -3]} scale={1.4}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.7}
          distort={0.2}
          speed={3}
          wireframe
        />
      </mesh>
    </Float>
  );
}

function FloatingOctahedron() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.4;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.5;
  });

  return (
    <Float speed={2.5} rotationIntensity={1} floatIntensity={1.2}>
      <mesh ref={ref} position={[-4, -2, -4]} scale={0.9}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#fbbf24"
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.85}
        />
      </mesh>
    </Float>
  );
}

function GlassSphere() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.1;
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.8}>
      <mesh ref={ref} position={[1, 2.5, -2]} scale={1}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.5}
          chromaticAberration={0.2}
          anisotropy={0.3}
          distortion={0.1}
          distortionScale={0.2}
          temporalDistortion={0.1}
          color="#fb923c"
          transmission={0.95}
          roughness={0.05}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const count = 80;
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 15;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.1;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#fb923c"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

export default function Hero3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <color attach="background" args={["#0a0a0a"]} />
        <fog attach="fog" args={["#0a0a0a", 8, 25]} />

        {/* Lighting */}
        <ambientLight intensity={0.15} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} color="#fb923c" />
        <directionalLight position={[-5, 3, 2]} intensity={0.4} color="#eab308" />
        <pointLight position={[0, 0, 4]} intensity={1.5} color="#f97316" distance={12} />
        <pointLight position={[-3, -2, 2]} intensity={0.5} color="#fbbf24" distance={8} />

        {/* 3D Objects */}
        <FloatingTorus />
        <FloatingSphere />
        <FloatingIcosahedron />
        <FloatingOctahedron />
        <GlassSphere />
        <Particles />

        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
