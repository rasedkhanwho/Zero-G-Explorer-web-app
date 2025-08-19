import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Mesh } from "three";
import * as THREE from "three";

export function Earth3D() {
  const meshRef = useRef<Mesh>(null);
  
  // Use existing texture or create a simple Earth-like appearance
  const earthTexture = useLoader(TextureLoader, '/textures/grass.png');
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} scale={2}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshLambertMaterial 
        map={earthTexture}
        color="#4a90e2"
      />
      {/* Atmosphere glow effect */}
      <mesh scale={1.1}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshLambertMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.2}
          side={THREE.BackSide}
        />
      </mesh>
    </mesh>
  );
}
