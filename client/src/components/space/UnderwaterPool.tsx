import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Points } from "three";
import * as THREE from "three";

interface UnderwaterPoolProps {
  buoyancyLevel: number; // -100 (sink) to +100 (float), 0 is neutral
}

export function UnderwaterPool({ buoyancyLevel }: UnderwaterPoolProps) {
  const bubblesRef = useRef<Points>(null);
  const poolRef = useRef<Mesh>(null);
  const lightRaysRef = useRef<Mesh[]>([]);

  // Create bubble particles
  const bubblePositions = useMemo(() => {
    const positions = new Float32Array(500 * 3);
    for (let i = 0; i < 500; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 20;
      positions[i3 + 1] = Math.random() * 15 - 7;
      positions[i3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, []);

  useFrame((state, delta) => {
    // Animate bubbles
    if (bubblesRef.current) {
      const positions = bubblesRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < 500; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += delta * (0.5 + Math.random() * 0.5);
        
        // Reset bubble if it reaches surface
        if (positions[i3 + 1] > 8) {
          positions[i3] = (Math.random() - 0.5) * 20;
          positions[i3 + 1] = -8;
          positions[i3 + 2] = (Math.random() - 0.5) * 20;
        }
      }
      bubblesRef.current.geometry.attributes.position.needsUpdate = true;
    }

    // Animate light rays
    lightRaysRef.current.forEach((ray, i) => {
      if (ray) {
        ray.rotation.y = Math.sin(state.clock.elapsedTime + i) * 0.1;
        if (ray.material && 'opacity' in ray.material) {
          ray.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime * 2 + i) * 0.05;
        }
      }
    });
  });

  return (
    <group>
      {/* Pool floor */}
      <mesh position={[0, -8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[30, 30]} />
        <meshLambertMaterial color="#1e3a5f" />
      </mesh>

      {/* Pool walls */}
      {[
        { pos: [15, 0, 0], rot: [0, 0, Math.PI / 2] },
        { pos: [-15, 0, 0], rot: [0, 0, -Math.PI / 2] },
        { pos: [0, 0, 15], rot: [Math.PI / 2, 0, 0] },
        { pos: [0, 0, -15], rot: [-Math.PI / 2, 0, 0] },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos as [number, number, number]} rotation={wall.rot as [number, number, number]}>
          <planeGeometry args={[30, 16]} />
          <meshLambertMaterial color="#2a4d6b" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* ISS mockup structures on pool floor */}
      <mesh position={[0, -6, 0]}>
        <boxGeometry args={[4, 1, 8]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      
      <mesh position={[6, -6, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshLambertMaterial color="#888888" />
      </mesh>

      <mesh position={[-6, -6, 0]}>
        <cylinderGeometry args={[1, 1, 3, 8]} />
        <meshLambertMaterial color="#777777" />
      </mesh>

      {/* Underwater light rays */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh
          key={i}
          ref={el => {
            if (el) lightRaysRef.current[i] = el;
          }}
          position={[
            (Math.random() - 0.5) * 20,
            5,
            (Math.random() - 0.5) * 20
          ]}
          rotation={[0, (i * Math.PI) / 4, 0]}
        >
          <planeGeometry args={[0.5, 15]} />
          <meshLambertMaterial 
            color="#87ceeb" 
            transparent 
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Bubble system */}
      <points ref={bubblesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={bubblePositions}
            count={500}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.1}
          color="#87ceeb"
          transparent
          opacity={0.6}
        />
      </points>

      {/* Water distortion effect */}
      <mesh position={[0, 7, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[40, 40]} />
        <meshLambertMaterial 
          color="#4a90e2" 
          transparent 
          opacity={0.1}
        />
      </mesh>
    </group>
  );
}