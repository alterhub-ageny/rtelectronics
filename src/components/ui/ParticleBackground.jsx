import { useMemo, useRef, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";

function NeuralNodes({ count = 60 }) {
  const mesh = useRef();
  const connMesh = useRef();
  const mouse = useRef({ x: 0, y: 0 });

  const { positions, colors, connections } = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const conns = [];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 3 + Math.random() * 12;
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.cos(phi) * (0.6 + Math.random() * 0.4);
      p[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta) - 4;
      const t = Math.random();
      c[i * 3] = t < 0.5 ? 0.2 : 0.8;
      c[i * 3 + 1] = t < 0.33 ? 0.9 : t < 0.66 ? 0.3 : 0.1;
      c[i * 3 + 2] = t < 0.33 ? 1 : t < 0.66 ? 0.3 : 0.1;
    }
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = p[i * 3] - p[j * 3];
        const dy = p[i * 3 + 1] - p[j * 3 + 1];
        const dz = p[i * 3 + 2] - p[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 6) {
          conns.push(p[i * 3], p[i * 3 + 1], p[i * 3 + 2], p[j * 3], p[j * 3 + 1], p[j * 3 + 2]);
        }
      }
    }
    return { positions: p, colors: c, connections: new Float32Array(conns) };
  }, [count]);

  const onPointerMove = useCallback((e) => {
    mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useFrame(({ clock }) => {
    if (typeof window !== "undefined") {
      window.addEventListener("mousemove", onPointerMove, { passive: true });
    }
    if (!mesh.current) return;
    const pos = mesh.current.geometry.attributes.position.array;
    const t = clock.getElapsedTime();
    const mx = mouse.current.x;
    const my = mouse.current.y;
    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const baseX = pos[idx];
      const baseY = pos[idx + 1];
      const baseZ = pos[idx + 2];
      pos[idx] += Math.sin(t * 0.15 + i * 0.07 + baseZ * 0.1) * 0.002 + mx * 0.001;
      pos[idx + 1] += Math.cos(t * 0.12 + i * 0.05 + baseX * 0.1) * 0.002 + my * 0.001;
      pos[idx + 2] += Math.sin(t * 0.1 + i * 0.03) * 0.001;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;

    if (connMesh.current) {
      const cPos = connMesh.current.geometry.attributes.position.array;
      const cCount = cPos.length / 6;
      for (let i = 0; i < cCount; i++) {
        const p1x = pos[cPos[i * 6] != null ? (Math.round(cPos[i * 6] * 10) % count) * 3 : 0];
      }
    }
  });

  return (
    <group>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
          <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.08} vertexColors transparent opacity={0.6} sizeAttenuation depthWrite={false} blending={2} />
      </points>
      <lineSegments ref={connMesh}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={connections.length / 3} array={connections} itemSize={3} />
        </bufferGeometry>
        <lineBasicMaterial color="#00f0ff" transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
}

function CrystalCore() {
  const mesh = useRef();
  const wireMesh = useRef();

  const geometry = useMemo(() => {
    const geo = new Float32Array(108);
    const r = 1.8;
    const faces = [
      [0,0,r], [r,0,0], [0,r,0],
      [0,0,r], [0,r,0], [-r,0,0],
      [0,0,r], [-r,0,0], [0,-r,0],
      [0,0,r], [0,-r,0], [r,0,0],
      [0,0,-r], [0,r,0], [r,0,0],
      [0,0,-r], [-r,0,0], [0,r,0],
      [0,0,-r], [0,-r,0], [-r,0,0],
      [0,0,-r], [r,0,0], [0,-r,0],
    ];
    for (let i = 0; i < faces.length; i++) {
      geo[i * 3] = faces[i][0];
      geo[i * 3 + 1] = faces[i][1];
      geo[i * 3 + 2] = faces[i][2];
    }
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (mesh.current) {
      const t = clock.getElapsedTime();
      mesh.current.rotation.x = t * 0.1;
      mesh.current.rotation.y = t * 0.15;
      mesh.current.position.y = Math.sin(t * 0.3) * 0.3;
    }
    if (wireMesh.current) {
      wireMesh.current.rotation.x = -wireMesh.current.rotation.x + 0.002;
      wireMesh.current.rotation.y += 0.008;
    }
  });

  return (
    <group ref={mesh}>
      <mesh ref={wireMesh}>
        <octahedronGeometry args={[1.5, 0]} />
        <meshBasicMaterial color="#00f0ff" wireframe transparent opacity={0.08} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[1.2, 0]} />
        <meshBasicMaterial color="transparent" transparent opacity={0.05} side={2} />
      </mesh>
      <points>
        <octahedronGeometry args={[2.0, 1]} />
        <pointsMaterial size={0.015} color="#00f0ff" transparent opacity={0.3} />
      </points>
    </group>
  );
}

function DepthRings() {
  const mesh = useRef();
  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.z = clock.getElapsedTime() * 0.02;
      mesh.current.position.y = Math.sin(clock.getElapsedTime() * 0.2) * 0.2;
    }
  });
  return (
    <mesh ref={mesh} rotation={[Math.PI / 3, 0, 0]}>
      <ringGeometry args={[6, 7, 64]} />
      <meshBasicMaterial color="#00f0ff" transparent opacity={0.015} side={2} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <NeuralNodes />
      <CrystalCore />
      <DepthRings />
      <ambientLight intensity={0.3} />
    </>
  );
}

export default function ParticleBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
      <Canvas camera={{ position: [0, 0, 10], fov: 65 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Scene />
      </Canvas>
    </div>
  );
}
