import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useSpaceEducation } from "@/lib/stores/useSpaceEducation";
import { useAudio } from "@/lib/stores/useAudio";
import { AstronautSuit } from "./AstronautSuit";
import { Suspense } from "react";

export function NBLTraining() {
  const { completeNBL } = useSpaceEducation();
  const { playHit, playSuccess } = useAudio();
  const [currentStep, setCurrentStep] = useState<'intro' | 'challenge' | 'complete'>('intro');
  const [weights, setWeights] = useState({ left: 50, right: 50, chest: 50, back: 50 });
  const [buoyancyStatus, setBuoyancyStatus] = useState<'heavy' | 'light' | 'perfect' | 'neutral'>('neutral');
  const [attempts, setAttempts] = useState(0);

  // Calculate total weight and buoyancy
  useEffect(() => {
    const totalWeight = weights.left + weights.right + weights.chest + weights.back;
    const idealWeight = 200; // Perfect neutral buoyancy
    const tolerance = 10;

    if (totalWeight < idealWeight - tolerance) {
      setBuoyancyStatus('light');
    } else if (totalWeight > idealWeight + tolerance) {
      setBuoyancyStatus('heavy');
    } else {
      setBuoyancyStatus('perfect');
      if (attempts > 0) {
        playSuccess();
        setTimeout(() => setCurrentStep('complete'), 2000);
      }
    }
  }, [weights, attempts, playSuccess]);

  const adjustWeight = (position: keyof typeof weights, delta: number) => {
    setWeights(prev => ({
      ...prev,
      [position]: Math.max(0, Math.min(100, prev[position] + delta))
    }));
    setAttempts(prev => prev + 1);
    playHit();
  };

  const getBuoyancyMessage = () => {
    switch (buoyancyStatus) {
      case 'heavy': return { text: "Too heavy! You're sinking!", color: "text-red-400" };
      case 'light': return { text: "Too light! You're floating up!", color: "text-yellow-400" };
      case 'perfect': return { text: "Perfect! Neutral buoyancy achieved!", color: "text-green-400" };
      default: return { text: "Adjust weights to achieve neutral buoyancy", color: "text-blue-400" };
    }
  };

  const message = getBuoyancyMessage();

  if (currentStep === 'intro') {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-blue-600">
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <Card className="max-w-4xl bg-black/70 backdrop-blur-sm border-blue-400">
            <CardHeader>
              <CardTitle className="text-4xl text-center text-white">
                Welcome to NASA's Neutral Buoyancy Lab
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="w-full h-64 bg-gradient-to-b from-blue-300 to-blue-800 rounded-lg mb-4 relative overflow-hidden">
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-20 bg-gray-300 rounded-t-lg">
                    <div className="w-12 h-12 bg-gray-400 rounded-full mx-auto mt-2"></div>
                  </div>
                  <div className="absolute inset-0 bg-blue-400/30"></div>
                </div>
              </div>
              
              <div className="text-lg text-gray-200 space-y-4 text-center">
                <p>
                  The Neutral Buoyancy Lab is a massive swimming pool where astronauts 
                  train for spacewalks by simulating the weightlessness of space.
                </p>
                <p>
                  Your mission: Adjust the weights on your spacesuit to achieve 
                  <span className="text-blue-300 font-bold"> neutral buoyancy</span> - 
                  floating neither up nor down in the water.
                </p>
                <p className="text-yellow-300">
                  This is exactly how real astronauts prepare for their missions!
                </p>
              </div>
              
              <div className="text-center">
                <Button 
                  onClick={() => setCurrentStep('challenge')}
                  className="px-8 py-4 text-xl bg-blue-600 hover:bg-blue-500"
                >
                  Start NBL Training Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'complete') {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-green-900 to-blue-900">
        <div className="flex flex-col items-center justify-center h-full px-4">
          <Card className="max-w-2xl bg-black/70 backdrop-blur-sm border-green-400">
            <CardContent className="text-center space-y-6 p-8">
              <div className="text-6xl">🚀</div>
              <h2 className="text-4xl text-green-400 font-bold">
                Training Complete!
              </h2>
              <p className="text-xl text-gray-200">
                Congratulations! You've mastered neutral buoyancy. 
                You're now ready for space!
              </p>
              <p className="text-lg text-gray-300">
                Attempts: {attempts} | Status: Astronaut Qualified ✓
              </p>
              <Button 
                onClick={completeNBL}
                className="px-8 py-4 text-xl bg-green-600 hover:bg-green-500"
              >
                Launch to Space! 🚀
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-800 to-blue-500">
      {/* 3D Astronaut Suit */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
          <color attach="background" args={["#1e40af"]} />
          <ambientLight intensity={0.6} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Suspense fallback={null}>
            <AstronautSuit buoyancyStatus={buoyancyStatus} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-6">
        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={25} className="w-full" />
          <p className="text-white text-center mt-2">NBL Training Progress</p>
        </div>

        {/* Control Panel */}
        <Card className="max-w-md mx-auto bg-black/80 backdrop-blur-sm border-blue-400">
          <CardHeader>
            <CardTitle className="text-center text-white">
              Weight Adjustment Panel
            </CardTitle>
            <div className={`text-center text-lg font-bold ${message.color}`}>
              {message.text}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(weights).map(([position, weight]) => (
              <div key={position} className="space-y-2">
                <label className="text-white capitalize font-medium">
                  {position} Weight: {weight}kg
                </label>
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={() => adjustWeight(position as keyof typeof weights, -5)}
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    -5kg
                  </Button>
                  <div className="flex-1 bg-gray-600 rounded-full h-2">
                    <div 
                      className="bg-blue-400 h-2 rounded-full transition-all"
                      style={{ width: `${weight}%` }}
                    />
                  </div>
                  <Button 
                    onClick={() => adjustWeight(position as keyof typeof weights, 5)}
                    variant="outline"
                    size="sm"
                    className="text-white border-white hover:bg-white hover:text-black"
                  >
                    +5kg
                  </Button>
                </div>
              </div>
            ))}
            
            <div className="mt-4 p-3 bg-blue-900/50 rounded-lg">
              <p className="text-sm text-gray-200 text-center">
                Total Weight: {Object.values(weights).reduce((a, b) => a + b, 0)}kg
              </p>
              <p className="text-xs text-gray-300 text-center mt-1">
                Target: ~200kg for neutral buoyancy
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
