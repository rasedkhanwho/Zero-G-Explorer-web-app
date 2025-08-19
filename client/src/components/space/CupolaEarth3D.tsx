import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Mesh } from "three";
import * as THREE from "three";

export function CupolaEarth3D() {
  const meshRef = useRef<Mesh>(null);
  
  // Use existing texture for Earth-like appearance
  const earthTexture = useLoader(TextureLoader, '/textures/grass.png');
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.05;
    }
  });

  return (
    <group position={[0, -2, -8]} scale={4}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshLambertMaterial 
          map={earthTexture}
          color="#4a90e2"
        />
      </mesh>
      {/* Atmosphere glow effect */}
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshLambertMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Cloud layer */}
      <mesh scale={1.02}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshLambertMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}