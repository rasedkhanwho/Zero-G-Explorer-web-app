import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSpaceEducation } from "@/lib/stores/useSpaceEducation";
import { useAudio } from "@/lib/stores/useAudio";
import { ISS3D } from "./ISS3D";
import { Earth3D } from "./Earth3D";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";

export function ISSArrival() {
  const { completeDocking } = useSpaceEducation();
  const { playSuccess } = useAudio();
  const [dockingPhase, setDockingPhase] = useState<'approaching' | 'aligning' | 'docked'>('approaching');
  const [distance, setDistance] = useState(1000);
  const [alignment, setAlignment] = useState(0);

  useEffect(() => {
    if (dockingPhase === 'approaching') {
      const approachInterval = setInterval(() => {
        setDistance(prev => {
          if (prev <= 50) {
            clearInterval(approachInterval);
            setDockingPhase('aligning');
            return 50;
          }
          return prev - 10;
        });
      }, 200);
      return () => clearInterval(approachInterval);
    }
  }, [dockingPhase]);

  const handleDockingControl = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (dockingPhase !== 'aligning') return;

    setAlignment(prev => {
      let newAlignment = prev;
      switch (direction) {
        case 'up': newAlignment = Math.min(100, prev + 10); break;
        case 'down': newAlignment = Math.max(0, prev - 10); break;
        case 'left': newAlignment = Math.max(0, prev - 5); break;
        case 'right': newAlignment = Math.min(100, prev + 5); break;
      }

      if (newAlignment >= 85 && newAlignment <= 100) {
        setTimeout(() => {
          setDockingPhase('docked');
          playSuccess();
        }, 1000);
      }

      return newAlignment;
    });
  };

  return (
    <div className="relative w-full h-full bg-black">
      {/* 3D ISS Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
          <color attach="background" args={["#000011"]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          
          <Suspense fallback={null}>
            <ISS3D dockingPhase={dockingPhase} distance={distance} />
            <Earth3D />
          </Suspense>
          
          <OrbitControls enableZoom={false} />
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-6">
        <div className="mb-4">
          <Progress value={80} className="w-full" />
          <p className="text-white text-center mt-2">Mission Progress: ISS Docking</p>
        </div>

        {dockingPhase === 'approaching' && (
          <Card className="max-w-2xl mx-auto bg-black/80 backdrop-blur-sm border-blue-400">
            <CardContent className="text-center space-y-6 p-8">
              <h2 className="text-4xl text-blue-400 font-bold">
                🛸 Approaching ISS
              </h2>
              <p className="text-xl text-gray-200">
                The International Space Station is coming into view!
              </p>
              <div className="space-y-4">
                <div className="text-2xl text-green-400">
                  Distance: {distance}m
                </div>
                <div className="w-full bg-gray-600 rounded-full h-4">
                  <div 
                    className="bg-blue-400 h-4 rounded-full transition-all"
                    style={{ width: `${((1000 - distance) / 950) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-300">
                  Reducing approach velocity for safe docking procedures...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {dockingPhase === 'aligning' && (
          <div className="space-y-4">
            <Card className="max-w-2xl mx-auto bg-black/80 backdrop-blur-sm border-yellow-400">
              <CardContent className="text-center space-y-4 p-6">
                <h2 className="text-3xl text-yellow-400 font-bold">
                  🎯 Docking Alignment
                </h2>
                <p className="text-lg text-gray-200">
                  Use the controls to align with the docking port
                </p>
                <div className="text-xl text-green-400">
                  Alignment: {alignment}%
                </div>
                <div className="w-full bg-gray-600 rounded-full h-4">
                  <div 
                    className="bg-yellow-400 h-4 rounded-full transition-all"
                    style={{ width: `${alignment}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="max-w-md mx-auto bg-black/80 backdrop-blur-sm border-gray-400">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <Button 
                    onClick={() => handleDockingControl('up')}
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    ↑
                  </Button>
                  <div></div>
                  <Button 
                    onClick={() => handleDockingControl('left')}
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    ←
                  </Button>
                  <div className="bg-gray-800 rounded flex items-center justify-center text-white">
                    RCS
                  </div>
                  <Button 
                    onClick={() => handleDockingControl('right')}
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    →
                  </Button>
                  <div></div>
                  <Button 
                    onClick={() => handleDockingControl('down')}
                    className="bg-gray-700 hover:bg-gray-600"
                  >
                    ↓
                  </Button>
                  <div></div>
                </div>
                <p className="text-xs text-gray-300 text-center mt-2">
                  Reaction Control System (RCS) Thrusters
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {dockingPhase === 'docked' && (
          <Card className="max-w-2xl mx-auto bg-black/80 backdrop-blur-sm border-green-400">
            <CardContent className="text-center space-y-6 p-8">
              <div className="text-6xl">🔗</div>
              <h2 className="text-4xl text-green-400 font-bold">
                Docking Successful!
              </h2>
              <p className="text-xl text-gray-200">
                Welcome aboard the International Space Station!
              </p>
              <p className="text-lg text-gray-300">
                You have successfully completed astronaut training and arrived at humanity's
                outpost in space, 408 kilometers above Earth.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-blue-300">✓ NBL Training Completed</p>
                <p className="text-sm text-blue-300">✓ Launch Successful</p>
                <p className="text-sm text-blue-300">✓ ISS Docking Achieved</p>
              </div>
              <Button 
                onClick={completeDocking}
                className="px-8 py-4 text-xl bg-green-600 hover:bg-green-500"
              >
                Enter the Cupola Observatory
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
