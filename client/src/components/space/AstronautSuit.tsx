import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import * as THREE from "three";

interface AstronautSuitProps {
  buoyancyStatus: 'heavy' | 'light' | 'perfect' | 'neutral';
}

export function AstronautSuit({ buoyancyStatus }: AstronautSuitProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bobSpeed = useRef(0);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Animate based on buoyancy status
    switch (buoyancyStatus) {
      case 'heavy':
        groupRef.current.position.y = Math.max(-2, groupRef.current.position.y - delta * 2);
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
        break;
      case 'light':
        groupRef.current.position.y = Math.min(2, groupRef.current.position.y + delta * 2);
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 3) * 0.15;
        break;
      case 'perfect':
        // Gentle floating animation
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
        groupRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
        break;
      default:
        // Neutral position
        groupRef.current.position.y = 0;
        groupRef.current.rotation.z = 0;
    }
  });

  const getSuitColor = () => {
    switch (buoyancyStatus) {
      case 'heavy': return '#ff4444';
      case 'light': return '#ffaa44';
      case 'perfect': return '#44ff44';
      default: return '#cccccc';
    }
  };

  return (
    <group ref={groupRef} position={[0, 0, 3]} scale={1.2}>
      {/* Main body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1.5, 0.5]} />
        <meshLambertMaterial color={getSuitColor()} />
      </mesh>
      
      {/* Helmet */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshLambertMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
      
      {/* Arms */}
      <mesh position={[-0.8, 0.3, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshLambertMaterial color={getSuitColor()} />
      </mesh>
      <mesh position={[0.8, 0.3, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshLambertMaterial color={getSuitColor()} />
      </mesh>
      
      {/* Legs */}
      <mesh position={[-0.3, -1.2, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshLambertMaterial color={getSuitColor()} />
      </mesh>
      <mesh position={[0.3, -1.2, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshLambertMaterial color={getSuitColor()} />
      </mesh>

      {/* Weight indicators */}
      <mesh position={[-0.6, 0, 0.3]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      <mesh position={[0.6, 0, 0.3]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      <mesh position={[0, 0.5, 0.3]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      <mesh position={[0, -0.5, -0.3]}>
        <boxGeometry args={[0.1, 0.1, 0.1]} />
        <meshLambertMaterial color="#666666" />
      </mesh>

      {/* Bubbles effect for underwater environment */}
      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={i} position={[
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 4,
          (Math.random() - 0.5) * 2
        ]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshLambertMaterial color="#87ceeb" transparent opacity={0.6} />
        </mesh>
      ))}
    </group>
  );
}
