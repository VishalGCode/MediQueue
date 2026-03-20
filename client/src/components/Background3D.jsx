import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, MeshWobbleMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function FloatingSphere({ position, color, speed, distort, size }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.1;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          transparent
          opacity={0.15}
          distort={distort}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

function WobbleTorus({ position, color }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <torusGeometry args={[1.5, 0.3, 32, 100]} />
      <MeshWobbleMaterial
        color={color}
        transparent
        opacity={0.1}
        factor={0.5}
        speed={1}
        roughness={0.3}
        metalness={0.9}
      />
    </mesh>
  );
}

function ParticleField() {
  const pointsRef = useRef();
  const count = 200;

  const positions = React.useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.01;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#06b6d4"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
}

function DNAHelix() {
  const groupRef = useRef();
  const count = 40;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef} position={[4, 0, -5]}>
      {Array.from({ length: count }).map((_, i) => {
        const t = (i / count) * Math.PI * 4;
        const y = (i / count) * 8 - 4;
        return (
          <React.Fragment key={i}>
            <mesh position={[Math.cos(t) * 1.2, y, Math.sin(t) * 1.2]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
            </mesh>
            <mesh position={[-Math.cos(t) * 1.2, y, -Math.sin(t) * 1.2]}>
              <sphereGeometry args={[0.06, 16, 16]} />
              <meshStandardMaterial color="#22d3ee" emissive="#22d3ee" emissiveIntensity={0.5} />
            </mesh>
          </React.Fragment>
        );
      })}
    </group>
  );
}

export default function Background3D() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color="#06b6d4" />
        <pointLight position={[-5, 5, 5]} intensity={0.3} color="#22d3ee" />

        <FloatingSphere position={[-3, 2, -3]} color="#06b6d4" speed={1.5} distort={0.4} size={1.5} />
        <FloatingSphere position={[3, -1, -4]} color="#0891b2" speed={1} distort={0.3} size={2} />
        <FloatingSphere position={[-1, -2, -2]} color="#22d3ee" speed={2} distort={0.5} size={1} />
        <FloatingSphere position={[5, 3, -6]} color="#67e8f9" speed={0.8} distort={0.2} size={1.8} />

        <WobbleTorus position={[-4, -1, -5]} color="#0e7490" />

        <ParticleField />
        <DNAHelix />
      </Canvas>
    </div>
  );
}
