import { useRef } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, Mesh } from "three";
import * as THREE from "three";

export function Earth3D() {
  const meshRef = useRef<Mesh>(null);
  const cloudsRef = useRef<Mesh>(null);
  
  // Use existing texture or create a simple Earth-like appearance
  const earthTexture = useLoader(TextureLoader, '/textures/grass.png');
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Simulate ISS orbital rotation speed (faster and more dynamic)
      meshRef.current.rotation.y += delta * 0.3;
      // Add slight tilt for more realistic orbital view
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
    if (cloudsRef.current) {
      // Clouds rotate slightly faster for dynamic effect
      cloudsRef.current.rotation.y += delta * 0.35;
    }
  });

  return (
    <group>
      {/* Main Earth sphere */}
      <mesh ref={meshRef} scale={2}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshLambertMaterial 
          map={earthTexture}
          color="#2563eb" // More realistic blue for Earth
        />
      </mesh>
      
      {/* Dynamic cloud layer */}
      <mesh ref={cloudsRef} scale={2.02}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshLambertMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.4}
        />
      </mesh>
      
      {/* Atmosphere glow effect */}
      <mesh scale={2.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshLambertMaterial 
          color="#87ceeb" 
          transparent 
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}
