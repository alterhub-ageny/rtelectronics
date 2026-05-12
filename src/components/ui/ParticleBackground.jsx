import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function AmbientParticles({ count = 80 }) {
  const mesh = useRef();

  const { positions, sizes } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const s = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 20;
      p[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5;
      s[i] = 0.02 + Math.random() * 0.04;
    }
    return { positions: p, sizes: s };
  }, [count]);

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(t * 0.1 + i * 0.1) * 0.0005;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffffff" transparent opacity={0.15} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Scene() {
  return (
    <>
      <AmbientParticles />
      <ambientLight intensity={0.3} />
    </>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
      <Canvas camera={{ position: [0, 0, 8], fov: 70 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
