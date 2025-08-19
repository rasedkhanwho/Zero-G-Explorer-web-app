import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSpaceEducation } from "@/lib/stores/useSpaceEducation";
import { Earth3D } from "./Earth3D";
import { Stars, Text, OrbitControls } from "@react-three/drei";

export function LandingPage() {
  const { setUserChoice } = useSpaceEducation();

  useEffect(() => {
    // Add some subtle background music
    const bgMusic = document.querySelector('audio');
    if (bgMusic) {
      bgMusic.play().catch(() => {
        console.log("Background music autoplay prevented");
      });
    }
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* 3D Earth Background */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{ antialias: true }}
        >
          <color attach="background" args={["#000011"]} />
          <Stars radius={300} depth={60} count={5000} factor={7} saturation={0} />
          
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <Suspense fallback={null}>
            <Earth3D />
          </Suspense>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false} 
            autoRotate 
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black/30">
        <div className="text-center space-y-8 max-w-4xl px-4">
          {/* Title */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-bold text-white tracking-wide">
              DO YOU WANT TO BE
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AN ASTRONAUT?
            </h2>
          </div>

          {/* Description */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Experience astronaut training from NASA's Neutral Buoyancy Lab to the 
            International Space Station. Choose your path to explore space education!
          </p>

          {/* Choice Buttons */}
          <Card className="bg-black/50 backdrop-blur-sm border-gray-600">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                <Button 
                  onClick={() => setUserChoice('astronaut')}
                  className="px-12 py-6 text-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  YES - Train Me!
                  <span className="block text-sm mt-1">Complete NBL Training</span>
                </Button>
                
                <div className="text-gray-400">OR</div>
                
                <Button 
                  onClick={() => setUserChoice('observer')}
                  variant="outline"
                  className="px-12 py-6 text-2xl border-gray-500 text-gray-300 hover:bg-gray-800 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  NO - Skip to ISS
                  <span className="block text-sm mt-1">Direct to Space View</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-400">
              Experience authentic NASA training procedures and ISS operations
            </p>
            <p className="text-xs text-gray-500">
              Educational platform designed for space enthusiasts of all ages
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
