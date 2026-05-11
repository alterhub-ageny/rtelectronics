import { useMemo, useRef, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

function Particles({ count = 800 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 30;
      p[i * 3 + 1] = (Math.random() - 0.5) * 30;
      p[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return p;
  }, [count]);

  const velocities = useMemo(
    () => Array.from({ length: count }, () => ({
      x: (Math.random() - 0.5) * 0.002,
      y: (Math.random() - 0.5) * 0.002,
    })),
    [count]
  );

  useFrame(({ clock }) => {
    if (!mesh.current) return;
    const positionsAttr = mesh.current.geometry.attributes.position;
    const array = positionsAttr.array;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      array[i * 3] += Math.sin(t * 0.3 + i) * 0.001;
      array[i * 3 + 1] += Math.cos(t * 0.2 + i) * 0.001;
      if (Math.abs(array[i * 3]) > 15) array[i * 3] *= -0.9;
      if (Math.abs(array[i * 3 + 1]) > 15) array[i * 3 + 1] *= -0.9;
    }
    positionsAttr.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color="#ff2a2a" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }} dpr={[1, 1.5]} gl={{ antialias: false }}>
        <Particles />
      </Canvas>
    </div>
  );
}
