import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointsMaterial } from "three";
import * as THREE from "three";

interface ParticleEffectProps {
  position: [number, number, number];
  type: 'rocket_exhaust' | 'stars' | 'debris';
  count?: number;
}

export function ParticleEffect({ position, type, count = 1000 }: ParticleEffectProps) {
  const pointsRef = useRef<Points>(null);
  
  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      switch (type) {
        case 'rocket_exhaust':
          // Create exhaust pattern
          positions[i3] = (Math.random() - 0.5) * 2;
          positions[i3 + 1] = -Math.random() * 3;
          positions[i3 + 2] = (Math.random() - 0.5) * 2;
          
          // Orange/yellow exhaust colors
          colors[i3] = 1; // red
          colors[i3 + 1] = Math.random() * 0.5 + 0.5; // green
          colors[i3 + 2] = Math.random() * 0.3; // blue
          break;
          
        case 'stars':
          // Distributed stars
          positions[i3] = (Math.random() - 0.5) * 100;
          positions[i3 + 1] = (Math.random() - 0.5) * 100;
          positions[i3 + 2] = (Math.random() - 0.5) * 100;
          
          // White stars
          colors[i3] = 1;
          colors[i3 + 1] = 1;
          colors[i3 + 2] = 1;
          break;
          
        case 'debris':
          // Small debris field
          positions[i3] = (Math.random() - 0.5) * 10;
          positions[i3 + 1] = (Math.random() - 0.5) * 10;
          positions[i3 + 2] = (Math.random() - 0.5) * 10;
          
          // Gray debris
          const gray = Math.random() * 0.5 + 0.5;
          colors[i3] = gray;
          colors[i3 + 1] = gray;
          colors[i3 + 2] = gray;
          break;
      }
    }
    
    return [positions, colors];
  }, [count, type]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      if (type === 'rocket_exhaust') {
        // Move particles downward and outward
        positions[i3 + 1] -= delta * 5; // downward
        positions[i3] += (Math.random() - 0.5) * delta; // slight horizontal drift
        positions[i3 + 2] += (Math.random() - 0.5) * delta;
        
        // Reset particles that have moved too far
        if (positions[i3 + 1] < -5) {
          positions[i3] = (Math.random() - 0.5) * 2;
          positions[i3 + 1] = 0;
          positions[i3 + 2] = (Math.random() - 0.5) * 2;
        }
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          array={colors}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={type === 'rocket_exhaust' ? 0.1 : 0.02}
        vertexColors
        transparent
        opacity={0.8}
      />
    </points>
  );
}
