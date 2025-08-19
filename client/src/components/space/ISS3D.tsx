import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh } from "three";
import * as THREE from "three";

interface ISS3DProps {
  dockingPhase: 'approaching' | 'aligning' | 'docked';
  distance: number;
}

export function ISS3D({ dockingPhase, distance }: ISS3DProps) {
  const issRef = useRef<Group>(null);
  const solarPanelsRef = useRef<Mesh[]>([]);

  useFrame((state, delta) => {
    if (!issRef.current) return;

    // Rotate ISS slowly
    issRef.current.rotation.y += delta * 0.1;

    // Animate solar panels
    solarPanelsRef.current.forEach((panel, i) => {
      if (panel) {
        panel.rotation.z = Math.sin(state.clock.elapsedTime + i) * 0.1;
      }
    });

    // Position based on docking phase
    switch (dockingPhase) {
      case 'approaching':
        const scale = Math.max(0.5, (1000 - distance) / 1000);
        issRef.current.scale.setScalar(scale);
        issRef.current.position.z = distance * 0.01;
        break;
      case 'aligning':
        issRef.current.scale.setScalar(1);
        issRef.current.position.z = 0.5;
        break;
      case 'docked':
        issRef.current.position.z = 0;
        break;
    }
  });

  return (
    <group ref={issRef} position={[0, 0, 5]}>
      {/* Main module */}
      <mesh>
        <cylinderGeometry args={[1, 1, 8, 16]} />
        <meshLambertMaterial color="#cccccc" />
      </mesh>
      
      {/* Connecting modules */}
      <mesh position={[0, 0, -5]}>
        <cylinderGeometry args={[0.8, 0.8, 2, 12]} />
        <meshLambertMaterial color="#aaaaaa" />
      </mesh>
      
      <mesh position={[0, 0, 5]}>
        <cylinderGeometry args={[0.8, 0.8, 2, 12]} />
        <meshLambertMaterial color="#aaaaaa" />
      </mesh>

      {/* Cupola */}
      <mesh position={[0, 1.5, 2]}>
        <sphereGeometry args={[0.8, 16, 8]} />
        <meshLambertMaterial color="#ffffff" transparent opacity={0.7} />
      </mesh>

      {/* Solar panels */}
      {[0, 1, 2, 3].map(i => {
        const angle = (i * Math.PI) / 2;
        const x = Math.cos(angle) * 6;
        const z = Math.sin(angle) * 6;
        
        return (
          <mesh
            key={i}
            ref={el => {
              if (el) solarPanelsRef.current[i] = el;
            }}
            position={[x, 0, z]}
            rotation={[0, -angle, 0]}
          >
            <boxGeometry args={[0.1, 4, 8]} />
            <meshLambertMaterial color="#001133" />
            
            {/* Solar panel grid pattern */}
            <mesh>
              <boxGeometry args={[0.11, 4.1, 8.1]} />
              <meshLambertMaterial 
                color="#000066" 
                transparent 
                opacity={0.8}
                wireframe
              />
            </mesh>
          </mesh>
        );
      })}

      {/* Docking port */}
      <mesh position={[0, -1.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.5, 8]} />
        <meshLambertMaterial color="#ffaa00" />
      </mesh>

      {/* Communication arrays */}
      <mesh position={[2, 2, 0]}>
        <boxGeometry args={[0.1, 0.1, 2]} />
        <meshLambertMaterial color="#666666" />
      </mesh>
      <mesh position={[-2, 2, 0]}>
        <boxGeometry args={[0.1, 0.1, 2]} />
        <meshLambertMaterial color="#666666" />
      </mesh>

      {/* Radiators */}
      <mesh position={[0, 0, -6]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[3, 0.1, 1]} />
        <meshLambertMaterial color="#silver" />
      </mesh>
    </group>
  );
}
