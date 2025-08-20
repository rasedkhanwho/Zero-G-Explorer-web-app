import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSpaceEducation } from "@/lib/stores/useSpaceEducation";
import { Earth3D } from "./Earth3D";
import { Suspense } from "react";
import { OrbitControls, Stars, Text } from "@react-three/drei";

export function CupolaExperience() {
  const { reset, userChoice } = useSpaceEducation();
  const [viewMode, setViewMode] = useState<'earth' | 'stars' | 'sunrise'>('earth');
  const [showInfo, setShowInfo] = useState(true);
  const [currentLocation, setCurrentLocation] = useState({
    region: "Pacific Ocean",
    country: "International Waters",
    nextLocation: "New Zealand"
  });

  // Simulate ISS orbital positions
  useEffect(() => {
    const locations = [
      { region: "Pacific Ocean", country: "International Waters", nextLocation: "New Zealand" },
      { region: "New Zealand", country: "New Zealand", nextLocation: "Australia" },
      { region: "Australia", country: "Australia", nextLocation: "Indonesia" },
      { region: "Southeast Asia", country: "Indonesia", nextLocation: "India" },
      { region: "Indian Ocean", country: "International Waters", nextLocation: "India" },
      { region: "India", country: "India", nextLocation: "Middle East" },
      { region: "Arabian Peninsula", country: "Saudi Arabia", nextLocation: "Europe" },
      { region: "Mediterranean Sea", country: "International Waters", nextLocation: "Europe" },
      { region: "Europe", country: "France", nextLocation: "Atlantic Ocean" },
      { region: "Atlantic Ocean", country: "International Waters", nextLocation: "North America" },
      { region: "North America", country: "United States", nextLocation: "Pacific Ocean" },
      { region: "Pacific Ocean", country: "International Waters", nextLocation: "Asia" }
    ];

    const interval = setInterval(() => {
      setCurrentLocation(prevLocation => {
        const currentIndex = locations.findIndex(loc => 
          loc.region === prevLocation.region && loc.country === prevLocation.country
        );
        const nextIndex = (currentIndex + 1) % locations.length;
        return locations[nextIndex];
      });
    }, 8000); // Change location every 8 seconds (simulating ISS orbit)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-full bg-black">
      {/* 3D Earth View from Cupola */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <color attach="background" args={["#000011"]} />
          
          {viewMode === 'stars' && (
            <Stars radius={300} depth={60} count={20000} factor={4} saturation={0} />
          )}
          
          <ambientLight intensity={viewMode === 'sunrise' ? 0.8 : 0.3} />
          <pointLight 
            position={viewMode === 'sunrise' ? [10, 0, 5] : [5, 5, 5]} 
            intensity={viewMode === 'sunrise' ? 2 : 1}
            color={viewMode === 'sunrise' ? "#ffaa44" : "#ffffff"}
          />
          
          <Suspense fallback={null}>
            <Earth3D />
            
            {viewMode === 'sunrise' && (
              <Text
                position={[0, 3, 0]}
                fontSize={0.5}
                color="#ffaa44"
                anchorX="center"
                anchorY="middle"
              >
                Orbital Sunrise
              </Text>
            )}
          </Suspense>
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false} 
            minDistance={3}
            maxDistance={15}
            autoRotate={viewMode === 'earth'} 
            autoRotateSpeed={0.5}
          />
        </Canvas>
      </div>

      {/* Cupola Frame Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <radialGradient id="cupolaGrad" cx="50%" cy="50%">
              <stop offset="70%" stopColor="transparent" />
              <stop offset="85%" stopColor="rgba(100,100,100,0.3)" />
              <stop offset="100%" stopColor="rgba(50,50,50,0.8)" />
            </radialGradient>
          </defs>
          <rect width="100" height="100" fill="url(#cupolaGrad)" />
          
          {/* Window frames */}
          <rect x="20" y="20" width="60" height="60" fill="none" stroke="rgba(200,200,200,0.5)" strokeWidth="0.2" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="rgba(200,200,200,0.3)" strokeWidth="0.1" />
          <line x1="20" y1="50" x2="80" y2="50" stroke="rgba(200,200,200,0.3)" strokeWidth="0.1" />
        </svg>
      </div>

      {/* UI Controls */}
      <div className="absolute top-4 left-4 right-4 z-20">
        <Progress value={100} className="w-full mb-4" />
        <p className="text-white text-center">Mission Complete: ISS Cupola Observatory</p>
      </div>

      {/* Control Panel */}
      <div className="absolute bottom-4 left-4 z-20">
        <Card className="bg-black/80 backdrop-blur-sm border-gray-400">
          <CardHeader>
            <CardTitle className="text-white text-lg">View Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => setViewMode('earth')}
              variant={viewMode === 'earth' ? 'default' : 'outline'}
              className="w-full"
            >
              🌍 Earth View
            </Button>
            <Button 
              onClick={() => setViewMode('sunrise')}
              variant={viewMode === 'sunrise' ? 'default' : 'outline'}
              className="w-full"
            >
              🌅 Orbital Sunrise
            </Button>
            <Button 
              onClick={() => setViewMode('stars')}
              variant={viewMode === 'stars' ? 'default' : 'outline'}
              className="w-full"
            >
              ⭐ Deep Space
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Information Panel */}
      {showInfo && (
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
          <Card className="max-w-sm bg-black/90 backdrop-blur-sm border-blue-400">
            <CardHeader>
              <CardTitle className="text-blue-400 flex justify-between items-center">
                ISS Cupola Observatory
                <Button 
                  onClick={() => setShowInfo(false)}
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="space-y-2 text-gray-200">
                <div className="p-3 bg-blue-900/30 rounded border border-blue-500 mb-3">
                  <p className="text-blue-300 font-semibold mb-2">Current Position:</p>
                  <p className="text-sm">
                    <strong>Passing over:</strong> {currentLocation.region}
                  </p>
                  <p className="text-sm">
                    <strong>Country:</strong> {currentLocation.country}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Next: {currentLocation.nextLocation}
                  </p>
                </div>
                
                <p>
                  <strong>Altitude:</strong> 420 km above Earth
                </p>
                <p>
                  <strong>Velocity:</strong> 27,600 km/h
                </p>
                <p>
                  <strong>Orbital Period:</strong> 92 minutes
                </p>
                <p>
                  <strong>Crew:</strong> 3-7 international astronauts
                </p>
              </div>
              
              {userChoice === 'astronaut' && (
                <div className="p-3 bg-green-900/30 rounded border border-green-500">
                  <p className="text-green-400 font-bold">🎉 Congratulations!</p>
                  <p className="text-sm text-gray-200 mt-1">
                    You completed full astronaut training:
                  </p>
                  <ul className="text-xs text-gray-300 mt-1 space-y-1">
                    <li>✓ NBL Neutral Buoyancy Training</li>
                    <li>✓ Rocket Launch Simulation</li>
                    <li>✓ ISS Docking Procedures</li>
                    <li>✓ Cupola Observatory Experience</li>
                  </ul>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-blue-300 font-semibold">Educational Facts:</p>
                <ul className="text-xs text-gray-300 space-y-1">
                  <li>• ISS orbits Earth every 92 minutes</li>
                  <li>• Astronauts see 16 sunrises per day</li>
                  <li>• Cupola has 7 windows for Earth observation</li>
                  <li>• Station travels 5 miles per second</li>
                </ul>
              </div>

              <div className="space-y-2">
                <Button 
                  onClick={() => window.open('https://isstracker.pl/en', '_blank')}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                >
                  🛰️ Track ISS Live Position
                </Button>
                <Button 
                  onClick={reset}
                  variant="outline"
                  className="w-full text-white border-gray-500 hover:bg-gray-800"
                >
                  🔄 Start New Mission
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Show Info Button */}
      {!showInfo && (
        <Button 
          onClick={() => setShowInfo(true)}
          className="absolute top-20 right-4 z-20 bg-blue-600 hover:bg-blue-500"
        >
          ℹ️ Info
        </Button>
      )}
    </div>
  );
}
