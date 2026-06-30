"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function useDevicePerformance() {
  const [tier, setTier] = useState<"high" | "medium" | "low">("high");

  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    const isLowEnd =
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4;

    if (isMobile && isLowEnd) setTier("low");
    else if (isMobile) setTier("medium");
    else setTier("high");
  }, []);

  return tier;
}

function Particles({ count }: { count: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3] = (Math.random() - 0.5) * 20;
      pos[i3 + 1] = (Math.random() - 0.5) * 20;
      pos[i3 + 2] = (Math.random() - 0.5) * 10;

      vel[i3] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 1] = (Math.random() - 0.5) * 0.002;
      vel[i3 + 2] = (Math.random() - 0.5) * 0.001;
    }

    return [pos, vel];
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current) return;

    const posAttr = meshRef.current.geometry.attributes
      .position as THREE.BufferAttribute;
    const posArray = posAttr.array as Float32Array;

    // Smooth mouse tracking
    const mx = (state.pointer.x * viewport.width) / 2;
    const my = (state.pointer.y * viewport.height) / 2;
    mouseRef.current.x += (mx - mouseRef.current.x) * 0.02;
    mouseRef.current.y += (my - mouseRef.current.y) * 0.02;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Base movement
      posArray[i3] += velocities[i3];
      posArray[i3 + 1] += velocities[i3 + 1];
      posArray[i3 + 2] += velocities[i3 + 2];

      // Mouse repulsion
      const dx = posArray[i3] - mouseRef.current.x;
      const dy = posArray[i3 + 1] - mouseRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 3) {
        const force = (3 - dist) * 0.001;
        posArray[i3] += dx * force;
        posArray[i3 + 1] += dy * force;
      }

      // Boundary wrap
      if (posArray[i3] > 10) posArray[i3] = -10;
      if (posArray[i3] < -10) posArray[i3] = 10;
      if (posArray[i3 + 1] > 10) posArray[i3 + 1] = -10;
      if (posArray[i3 + 1] < -10) posArray[i3 + 1] = 10;
    }

    posAttr.needsUpdate = true;
    meshRef.current.rotation.z += 0.0001;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#d4af37"
        size={0.03}
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.3) * 2;
    meshRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.2) * 1.5;
    meshRef.current.scale.setScalar(
      1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1
    );
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <sphereGeometry args={[2, 32, 32]} />
      <meshBasicMaterial
        color="#d4af37"
        transparent
        opacity={0.03}
        wireframe
      />
    </mesh>
  );
}

export default function ParticleBackground() {
  const tier = useDevicePerformance();
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Don't render WebGL at all for reduced motion users
  if (reducedMotion) {
    return (
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.04)_0%,_transparent_60%)]" />
    );
  }

  // Particle count based on device tier
  const particleCount = tier === "high" ? 1500 : tier === "medium" ? 800 : 400;
  const dpr: [number, number] =
    tier === "high" ? [1, 1.5] : tier === "medium" ? [1, 1] : [0.75, 1];

  return (
    <>
      {/* Fallback gradient while WebGL loads */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(212,175,55,0.03)_0%,_transparent_60%)] transition-opacity duration-1000 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />

      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={dpr}
        style={{ position: "absolute", inset: 0, background: "transparent" }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: false,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0); // Fully transparent — lets CSS background show through
          setReady(true);
        }}
      >
        <Particles count={particleCount} />
        {tier !== "low" && <FloatingOrb />}
      </Canvas>
    </>
  );
}
