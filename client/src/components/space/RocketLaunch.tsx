import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSpaceEducation } from "@/lib/stores/useSpaceEducation";
import { ParticleEffect } from "./ParticleEffect";
import { Suspense } from "react";

export function RocketLaunch() {
  const { completeLaunch } = useSpaceEducation();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [launchPhase, setLaunchPhase] = useState<'ready' | 'countdown' | 'launching' | 'orbit'>('ready');
  const [rocketPosition, setRocketPosition] = useState(0);

  useEffect(() => {
    if (launchPhase === 'countdown' && countdown !== null) {
      if (countdown > 0) {
        const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setLaunchPhase('launching');
        // Animate rocket launch
        const launchInterval = setInterval(() => {
          setRocketPosition(prev => {
            if (prev >= 100) {
              clearInterval(launchInterval);
              setLaunchPhase('orbit');
              return 100;
            }
            return prev + 2;
          });
        }, 100);
      }
    }
  }, [countdown, launchPhase]);

  const startCountdown = () => {
    setCountdown(10);
    setLaunchPhase('countdown');
  };

  const continueToISS = () => {
    completeLaunch();
  };

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-black to-blue-900">
      {/* 3D Rocket Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 10], fov: 45 }}>
          <color attach="background" args={["#000011"]} />
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 10, 10]} intensity={1} />
          
          <Suspense fallback={null}>
            {/* Rocket */}
            <group position={[0, -5 + (rocketPosition * 0.1), 0]}>
              {/* Rocket body */}
              <mesh>
                <cylinderGeometry args={[0.3, 0.5, 4, 8]} />
                <meshLambertMaterial color="#ffffff" />
              </mesh>
              
              {/* Rocket nose */}
              <mesh position={[0, 2.5, 0]}>
                <coneGeometry args={[0.3, 1, 8]} />
                <meshLambertMaterial color="#ff0000" />
              </mesh>
              
              {/* Rocket fins */}
              {[0, 1, 2, 3].map(i => (
                <mesh key={i} position={[
                  Math.cos(i * Math.PI / 2) * 0.6,
                  -2,
                  Math.sin(i * Math.PI / 2) * 0.6
                ]} rotation={[0, i * Math.PI / 2, 0]}>
                  <boxGeometry args={[0.1, 1, 0.5]} />
                  <meshLambertMaterial color="#cccccc" />
                </mesh>
              ))}
            </group>
            
            {/* Launch effects */}
            {launchPhase === 'launching' && (
              <ParticleEffect 
                position={[0, -6 + (rocketPosition * 0.1), 0]} 
                type="rocket_exhaust"
              />
            )}
            
            {/* Earth in background */}
            {launchPhase === 'orbit' && (
              <mesh position={[0, -15, -20]} scale={3}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshLambertMaterial color="#4a90e2" />
              </mesh>
            )}
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-6">
        <div className="mb-4">
          <Progress value={50} className="w-full" />
          <p className="text-white text-center mt-2">Mission Progress: Launch Sequence</p>
        </div>

        <div className="flex flex-col items-center justify-center h-full">
          {launchPhase === 'ready' && (
            <Card className="max-w-2xl bg-black/80 backdrop-blur-sm border-orange-400">
              <CardContent className="text-center space-y-6 p-8">
                <h2 className="text-4xl text-orange-400 font-bold">
                  🚀 Launch Sequence Ready
                </h2>
                <p className="text-xl text-gray-200">
                  Your NBL training is complete! Time to launch to the International Space Station.
                </p>
                <p className="text-lg text-gray-300">
                  The rocket will take you through Earth's atmosphere to dock with the ISS in orbit.
                </p>
                <Button 
                  onClick={startCountdown}
                  className="px-8 py-4 text-xl bg-orange-600 hover:bg-orange-500"
                >
                  Initiate Launch Sequence
                </Button>
              </CardContent>
            </Card>
          )}

          {launchPhase === 'countdown' && countdown !== null && (
            <Card className="max-w-xl bg-black/90 backdrop-blur-sm border-red-400">
              <CardContent className="text-center p-8">
                <div className="text-8xl font-mono text-red-400 mb-4">
                  {countdown}
                </div>
                <p className="text-2xl text-white">
                  {countdown > 0 ? 'Launch in...' : 'LIFTOFF!'}
                </p>
              </CardContent>
            </Card>
          )}

          {launchPhase === 'launching' && (
            <Card className="max-w-2xl bg-black/80 backdrop-blur-sm border-yellow-400">
              <CardContent className="text-center space-y-4 p-8">
                <h2 className="text-3xl text-yellow-400 font-bold">
                  🔥 LAUNCHING!
                </h2>
                <div className="w-full bg-gray-600 rounded-full h-4">
                  <div 
                    className="bg-yellow-400 h-4 rounded-full transition-all duration-100"
                    style={{ width: `${rocketPosition}%` }}
                  />
                </div>
                <p className="text-lg text-gray-200">
                  Altitude: {Math.round(rocketPosition * 400)} km
                </p>
                <p className="text-sm text-gray-300">
                  Ascending through Earth's atmosphere...
                </p>
              </CardContent>
            </Card>
          )}

          {launchPhase === 'orbit' && (
            <Card className="max-w-2xl bg-black/80 backdrop-blur-sm border-green-400">
              <CardContent className="text-center space-y-6 p-8">
                <h2 className="text-4xl text-green-400 font-bold">
                  🌍 Orbit Achieved!
                </h2>
                <p className="text-xl text-gray-200">
                  Welcome to space! You're now in Earth orbit at 408km altitude.
                </p>
                <p className="text-lg text-gray-300">
                  The International Space Station is visible ahead. Prepare for docking procedures.
                </p>
                <Button 
                  onClick={continueToISS}
                  className="px-8 py-4 text-xl bg-green-600 hover:bg-green-500"
                >
                  Approach ISS for Docking
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
