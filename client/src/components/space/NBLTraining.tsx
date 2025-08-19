import { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { useSpaceEducation } from "@/lib/stores/useSpaceEducation";
import { useAudio } from "@/lib/stores/useAudio";
import { AstronautSuit } from "./AstronautSuit";
import { UnderwaterPool } from "./UnderwaterPool";
import { Suspense } from "react";

export function NBLTraining() {
  const { completeNBL } = useSpaceEducation();
  const { playHit, playSuccess } = useAudio();
  const [currentStep, setCurrentStep] = useState<'intro' | 'simulation' | 'challenge' | 'complete'>('intro');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [weights, setWeights] = useState({ left: 50, right: 50, chest: 50, back: 50 });
  const [buoyancyStatus, setBuoyancyStatus] = useState<'heavy' | 'light' | 'perfect' | 'neutral'>('neutral');
  const [buoyancyLevel, setBuoyancyLevel] = useState(0); // For underwater simulation
  const [attempts, setAttempts] = useState(0);

  const slides = [
    {
      image: '/images/nbl1.jpg',
      title: 'NASA Neutral Buoyancy Lab',
      description: 'The Neutral Buoyancy Lab is a massive 6.2 million gallon pool where astronauts train for spacewalks.'
    },
    {
      image: '/images/nbl2.jpg', 
      title: 'Underwater Training Session',
      description: 'Astronauts spend up to 7 hours underwater for each 1 hour of spacewalk, practicing complex procedures.'
    }
  ];

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
      if (attempts > 0 && currentStep === 'challenge') {
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
    const currentSlideData = slides[currentSlide];
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-blue-600">
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <Card className="max-w-5xl bg-black/70 backdrop-blur-sm border-blue-400">
            <CardHeader>
              <CardTitle className="text-4xl text-center text-white">
                Welcome to NASA's Neutral Buoyancy Lab
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Slideshow */}
              <div className="text-center">
                <div className="w-full h-80 bg-black rounded-lg mb-4 relative overflow-hidden">
                  <img 
                    src={currentSlideData.image} 
                    alt={currentSlideData.title}
                    className="w-full h-full object-cover rounded-lg"
                    onError={(e) => {
                      console.log('Image failed to load:', currentSlideData.image);
                      // Fallback to gradient background
                      e.currentTarget.style.display = 'none';
                      if (e.currentTarget.parentElement) {
                        e.currentTarget.parentElement.style.background = 'linear-gradient(to bottom, #3b82f6, #1e40af)';
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                  
                  {/* Slide navigation */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${
                          index === currentSlide ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  
                  {/* Navigation arrows */}
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                  >
                    →
                  </button>
                </div>
                
                {/* Slide content */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl text-blue-300 font-bold mb-2">
                    {currentSlideData.title}
                  </h3>
                  <p className="text-lg text-gray-200">
                    {currentSlideData.description}
                  </p>
                </div>
              </div>
              
              <div className="text-lg text-gray-200 space-y-4 text-center">
                <p>
                  Your mission: Learn how astronauts achieve 
                  <span className="text-blue-300 font-bold"> neutral buoyancy</span> - 
                  floating neither up nor down in the water.
                </p>
                <p className="text-yellow-300">
                  Experience authentic NASA training procedures!
                </p>
              </div>
              
              <div className="text-center space-x-4">
                <Button 
                  onClick={() => setCurrentStep('simulation')}
                  className="px-8 py-4 text-xl bg-blue-600 hover:bg-blue-500"
                >
                  Start Virtual Pool Training
                </Button>
                <Button 
                  onClick={() => setCurrentStep('challenge')}
                  variant="outline"
                  className="px-8 py-4 text-xl border-blue-400 text-blue-300 hover:bg-blue-800"
                >
                  Skip to Weight Challenge
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'simulation') {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-blue-800 to-blue-500">
        {/* 3D Underwater Pool Simulation */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 2, 12], fov: 45 }}>
            <color attach="background" args={["#1e40af"]} />
            <ambientLight intensity={0.4} />
            <pointLight position={[0, 10, 5]} intensity={1} color="#87ceeb" />
            <pointLight position={[10, -5, 10]} intensity={0.5} color="#4a90e2" />
            
            <Suspense fallback={null}>
              <UnderwaterPool buoyancyLevel={buoyancyLevel} />
              <AstronautSuit buoyancyStatus={
                buoyancyLevel < -20 ? 'heavy' : 
                buoyancyLevel > 20 ? 'light' : 
                Math.abs(buoyancyLevel) < 10 ? 'perfect' : 'neutral'
              } />
            </Suspense>
          </Canvas>
        </div>

        {/* UI Overlay */}
        <div className="relative z-10 p-6">
          <div className="mb-4">
            <Progress value={15} className="w-full" />
            <p className="text-white text-center mt-2">Virtual Pool Simulation</p>
          </div>

          {/* Buoyancy Control Panel */}
          <Card className="max-w-md bg-black/80 backdrop-blur-sm border-blue-400">
            <CardHeader>
              <CardTitle className="text-center text-white">
                Buoyancy Control System
              </CardTitle>
              <div className={`text-center text-lg font-bold ${
                Math.abs(buoyancyLevel) < 10 ? 'text-green-400' : 
                buoyancyLevel < -20 ? 'text-red-400' :
                buoyancyLevel > 20 ? 'text-yellow-400' : 'text-blue-400'
              }`}>
                {Math.abs(buoyancyLevel) < 10 ? '🎯 Perfect Neutral Buoyancy!' :
                 buoyancyLevel < -20 ? '⬇️ Sinking (Too Heavy)' :
                 buoyancyLevel > 20 ? '⬆️ Rising (Too Light)' : 
                 '🎛️ Adjusting Buoyancy...'}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-white text-sm font-medium">
                  Buoyancy Level: {buoyancyLevel}
                </label>
                <Slider
                  value={[buoyancyLevel]}
                  onValueChange={(values) => setBuoyancyLevel(values[0])}
                  min={-100}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-300">
                  <span>Negative (Sink)</span>
                  <span>Neutral</span>
                  <span>Positive (Float)</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <Button 
                  onClick={() => setBuoyancyLevel(Math.max(-100, buoyancyLevel - 10))}
                  variant="outline"
                  size="sm"
                  className="text-white border-red-400 hover:bg-red-800"
                >
                  Sink
                </Button>
                <Button 
                  onClick={() => setBuoyancyLevel(0)}
                  variant="outline"
                  size="sm" 
                  className="text-white border-green-400 hover:bg-green-800"
                >
                  Neutral
                </Button>
                <Button 
                  onClick={() => setBuoyancyLevel(Math.min(100, buoyancyLevel + 10))}
                  variant="outline"
                  size="sm"
                  className="text-white border-yellow-400 hover:bg-yellow-800"
                >
                  Float
                </Button>
              </div>

              <div className="p-3 bg-blue-900/50 rounded-lg">
                <p className="text-sm text-gray-200 text-center">
                  In the real NBL, astronauts adjust lead weights to achieve neutral buoyancy.
                  Try to get the level as close to 0 as possible!
                </p>
              </div>

              <div className="text-center space-x-2">
                <Button 
                  onClick={() => setCurrentStep('challenge')}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500"
                  disabled={Math.abs(buoyancyLevel) > 15}
                >
                  Continue to Weight Challenge
                </Button>
                {Math.abs(buoyancyLevel) > 15 && (
                  <p className="text-xs text-yellow-300 mt-2">
                    Achieve better buoyancy control first!
                  </p>
                )}
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
      {/* Enhanced 3D Underwater Scene */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <color attach="background" args={["#1e40af"]} />
          <ambientLight intensity={0.4} />
          <pointLight position={[0, 10, 5]} intensity={1} color="#87ceeb" />
          <pointLight position={[10, -5, 10]} intensity={0.5} color="#4a90e2" />
          
          <Suspense fallback={null}>
            <UnderwaterPool buoyancyLevel={0} />
            <AstronautSuit buoyancyStatus={buoyancyStatus} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-6">
        {/* Progress Bar */}
        <div className="mb-4">
          <Progress value={35} className="w-full" />
          <p className="text-white text-center mt-2">NBL Weight Adjustment Challenge</p>
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
