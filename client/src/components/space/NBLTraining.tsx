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
  const [currentStep, setCurrentStep] = useState<'intro' | 'suitup' | 'prebreathe' | 'simulation' | 'challenge' | 'debrief' | 'complete'>('intro');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [weights, setWeights] = useState({ left: 50, right: 50, chest: 50, back: 50 });
  const [buoyancyStatus, setBuoyancyStatus] = useState<'heavy' | 'light' | 'perfect' | 'neutral'>('neutral');
  const [buoyancyLevel, setBuoyancyLevel] = useState(0); // For underwater simulation
  const [attempts, setAttempts] = useState(0);
  const [suitParts, setSuitParts] = useState({
    helmet: false,
    torso: false,
    gloves: false,
    boots: false
  });
  const [preBreathTimer, setPreBreathTimer] = useState(120); // 2 minutes
  const [nitrogenBubbles, setNitrogenBubbles] = useState(100);
  const [simulationTimer, setSimulationTimer] = useState(0);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [missionScore, setMissionScore] = useState({ time: 0, accuracy: 100 });

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

  // Timer effects for pre-breathe protocol
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 'prebreathe' && preBreathTimer > 0) {
      interval = setInterval(() => {
        setPreBreathTimer(prev => prev - 1);
        setNitrogenBubbles(prev => Math.max(0, prev - 1));
      }, 1000);
    } else if (currentStep === 'prebreathe' && preBreathTimer === 0) {
      setTimeout(() => setCurrentStep('simulation'), 2000);
    }
    return () => clearInterval(interval);
  }, [currentStep, preBreathTimer]);

  // Timer for simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentStep === 'simulation' && !taskCompleted) {
      interval = setInterval(() => {
        setSimulationTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentStep, taskCompleted]);

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
        setTimeout(() => setCurrentStep('debrief'), 2000);
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
                  onClick={() => setCurrentStep('suitup')}
                  className="px-8 py-4 text-xl bg-blue-600 hover:bg-blue-500"
                >
                  Begin NBL Training Protocol
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

  if (currentStep === 'suitup') {
    const allPartsEquipped = Object.values(suitParts).every(part => part);
    
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-gray-800 to-blue-900">
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <Card className="max-w-4xl bg-black/80 backdrop-blur-sm border-orange-400">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-orange-400">
                Step 2: Suiting Up in the EMU
              </CardTitle>
              <p className="text-center text-gray-200 text-lg">
                Astronauts wear the Extravehicular Mobility Unit (EMU) for spacewalks
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">🧑‍🚀</div>
                <p className="text-lg text-gray-200">
                  Drag and drop each part of the spacesuit to complete the assembly
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(suitParts).map(([part, equipped]) => (
                  <Card 
                    key={part}
                    className={`cursor-pointer transition-all transform hover:scale-105 ${
                      equipped ? 'bg-green-800 border-green-400' : 'bg-gray-800 border-gray-600'
                    }`}
                    onClick={() => setSuitParts(prev => ({ ...prev, [part]: !prev[part as keyof typeof prev] }))}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="text-3xl mb-2">
                        {part === 'helmet' && '⛑️'}
                        {part === 'torso' && '🦺'}
                        {part === 'gloves' && '🧤'}
                        {part === 'boots' && '🥾'}
                      </div>
                      <p className={`font-medium capitalize ${
                        equipped ? 'text-green-300' : 'text-gray-300'
                      }`}>
                        {part}
                        {equipped && ' ✓'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="space-y-4">
                <Progress value={(Object.values(suitParts).filter(Boolean).length / 4) * 100} className="w-full" />
                <p className="text-center text-gray-300">
                  Equipment Progress: {Object.values(suitParts).filter(Boolean).length}/4 parts equipped
                </p>
              </div>

              <div className="bg-blue-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-200 text-center">
                  <strong>EMU Facts:</strong> The complete suit weighs 280 pounds on Earth but is weightless in space. 
                  It provides life support, communication, and protection from the harsh space environment.
                </p>
              </div>

              <div className="text-center">
                <Button 
                  onClick={() => setCurrentStep('prebreathe')}
                  className="px-8 py-4 text-xl bg-orange-600 hover:bg-orange-500"
                  disabled={!allPartsEquipped}
                >
                  {allPartsEquipped ? 'Begin Pre-Breathe Protocol' : 'Complete Suit Assembly First'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'prebreathe') {
    const minutes = Math.floor(preBreathTimer / 60);
    const seconds = preBreathTimer % 60;
    
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-purple-900 to-blue-900">
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <Card className="max-w-4xl bg-black/80 backdrop-blur-sm border-purple-400">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-purple-400">
                Step 3: Pre-Breathe Protocol
              </CardTitle>
              <p className="text-center text-gray-200 text-lg">
                Removing nitrogen from the bloodstream to prevent decompression sickness
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center mb-6">
                <div className="text-8xl font-mono text-purple-400 mb-4">
                  {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
                </div>
                <p className="text-xl text-gray-200">
                  Breathing pure oxygen to flush nitrogen from your system
                </p>
              </div>
              
              {/* Bubble Animation */}
              <div className="relative h-32 bg-gradient-to-t from-blue-800 to-blue-600 rounded-lg overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <p className="text-sm">Nitrogen Elimination: {Math.round((120 - preBreathTimer) / 120 * 100)}%</p>
                    <div className="mt-2 flex justify-center space-x-2">
                      {/* Nitrogen bubbles (red) */}
                      {Array.from({ length: Math.max(0, Math.floor(nitrogenBubbles / 10)) }).map((_, i) => (
                        <div key={`n-${i}`} className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
                      ))}
                      {/* Oxygen bubbles (blue) */}
                      {Array.from({ length: Math.max(0, 10 - Math.floor(nitrogenBubbles / 10)) }).map((_, i) => (
                        <div key={`o-${i}`} className="w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-purple-900/30 p-4 rounded-lg">
                <p className="text-sm text-gray-200 text-center">
                  <strong>Why Pre-Breathe?</strong> Astronauts breathe pure oxygen for 2+ hours before spacewalks. 
                  This prevents nitrogen bubbles from forming in the bloodstream when transitioning from the 
                  pressurized station to the lower-pressure spacesuit.
                </p>
              </div>

              <div className="text-center">
                <Progress value={((120 - preBreathTimer) / 120) * 100} className="w-full mb-4" />
                <p className="text-gray-300">
                  {preBreathTimer > 0 ? 'Pre-breathe in progress...' : 'Pre-breathe complete! Ready for simulation.'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentStep === 'simulation') {
    const formatTime = (seconds: number) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const completeTask = () => {
      setTaskCompleted(true);
      setMissionScore({ 
        time: simulationTimer, 
        accuracy: Math.max(80, 100 - Math.floor(simulationTimer / 10)) 
      });
      playSuccess();
      setTimeout(() => setCurrentStep('debrief'), 3000);
    };
    
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
              <UnderwaterPool buoyancyLevel={0} />
              <AstronautSuit buoyancyStatus="perfect" />
              
              {/* Virtual Safety Divers */}
              {Array.from({ length: 3 }).map((_, i) => (
                <group key={i} position={[
                  (i - 1) * 8, 
                  -3 + Math.sin(Date.now() * 0.001 + i) * 0.5, 
                  -5
                ]}>
                  <mesh>
                    <capsuleGeometry args={[0.3, 1]} />
                    <meshLambertMaterial color="#ff6600" />
                  </mesh>
                  <mesh position={[0, 0.8, 0]}>
                    <sphereGeometry args={[0.3]} />
                    <meshLambertMaterial color="#333333" transparent opacity={0.8} />
                  </mesh>
                </group>
              ))}
            </Suspense>
          </Canvas>
        </div>

        {/* UI Overlay */}
        <div className="relative z-10 p-6">
          <div className="mb-4">
            <Progress value={60} className="w-full" />
            <p className="text-white text-center mt-2">Step 4: NBL Simulation - "The Dive"</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Timer and Status */}
            <Card className="bg-black/80 backdrop-blur-sm border-green-400">
              <CardHeader>
                <CardTitle className="text-center text-green-400 flex items-center justify-center space-x-2">
                  <span>⏱️</span>
                  <span>Mission Timer</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-4xl font-mono text-green-300 mb-4">
                  {formatTime(simulationTimer)}
                </div>
                <p className="text-gray-200">
                  {taskCompleted ? 'Task Complete!' : 'Training in Progress...'}
                </p>
                <div className="mt-4 flex justify-center space-x-2">
                  <div className="flex items-center text-orange-400">
                    <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                    <span className="text-sm">Safety Divers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* ISS Task Simulation */}
            <Card className="bg-black/80 backdrop-blur-sm border-yellow-400">
              <CardHeader>
                <CardTitle className="text-center text-yellow-400">
                  🔧 ISS Maintenance Task
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-gray-200 mb-4">
                    Connect Cable A to Port B on the ISS module
                  </p>
                  
                  <div className="bg-gray-800 p-4 rounded-lg mb-4">
                    <div className="flex justify-between items-center">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-red-500 rounded-lg mb-2 mx-auto"></div>
                        <p className="text-xs text-red-300">Cable A</p>
                      </div>
                      <div className="flex-1 mx-4 border-t-2 border-dashed border-gray-500"></div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg mb-2 mx-auto"></div>
                        <p className="text-xs text-blue-300">Port B</p>
                      </div>
                    </div>
                  </div>
                  
                  {!taskCompleted ? (
                    <Button 
                      onClick={completeTask}
                      className="px-6 py-3 bg-yellow-600 hover:bg-yellow-500"
                    >
                      Complete Connection
                    </Button>
                  ) : (
                    <div className="text-green-400 text-lg">✅ Connection Successful!</div>
                  )}
                </div>

                <div className="bg-yellow-900/30 p-3 rounded-lg">
                  <p className="text-xs text-gray-200 text-center">
                    <strong>Real NBL Training:</strong> Astronauts practice the exact same procedures 
                    they'll perform in space, using full-scale mockups of ISS modules underwater.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'debrief') {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-green-900 to-blue-900">
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <Card className="max-w-4xl bg-black/80 backdrop-blur-sm border-green-400">
            <CardHeader>
              <CardTitle className="text-3xl text-center text-green-400">
                🎯 Mission Debrief
              </CardTitle>
              <p className="text-center text-gray-200 text-lg">
                Training simulation completed successfully!
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <Card className="bg-green-900/30 border-green-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-green-300">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">Completion Time:</span>
                      <span className="text-green-300 font-mono text-lg">
                        {Math.floor(missionScore.time / 60)}:{(missionScore.time % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">Task Accuracy:</span>
                      <span className="text-green-300 font-mono text-lg">{missionScore.accuracy}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-200">Overall Grade:</span>
                      <span className={`font-bold text-lg ${
                        missionScore.accuracy >= 90 ? 'text-green-300' :
                        missionScore.accuracy >= 80 ? 'text-yellow-300' : 'text-orange-300'
                      }`}>
                        {missionScore.accuracy >= 90 ? 'A' :
                         missionScore.accuracy >= 80 ? 'B' : 'C'}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                {/* Training Summary */}
                <Card className="bg-blue-900/30 border-blue-500">
                  <CardHeader>
                    <CardTitle className="text-xl text-blue-300">Training Completed</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-green-400">
                      <span className="mr-2">✅</span>
                      <span className="text-sm">EMU Suit Assembly</span>
                    </div>
                    <div className="flex items-center text-green-400">
                      <span className="mr-2">✅</span>
                      <span className="text-sm">Pre-Breathe Protocol</span>
                    </div>
                    <div className="flex items-center text-green-400">
                      <span className="mr-2">✅</span>
                      <span className="text-sm">NBL Pool Simulation</span>
                    </div>
                    <div className="flex items-center text-green-400">
                      <span className="mr-2">✅</span>
                      <span className="text-sm">ISS Maintenance Task</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="bg-green-900/20 p-4 rounded-lg border border-green-500">
                <h3 className="text-xl text-green-300 mb-2 text-center">🎉 Congratulations!</h3>
                <p className="text-gray-200 text-center">
                  You've successfully completed NASA's Neutral Buoyancy Lab training simulation. 
                  You're now qualified to proceed with the rocket launch sequence.
                </p>
              </div>

              <div className="text-center space-y-4">
                <p className="text-lg text-green-300 font-semibold">
                  "Perfect! Now you're ready for space!"
                </p>
                <Button 
                  onClick={() => setCurrentStep('challenge')}
                  className="px-8 py-4 text-xl bg-green-600 hover:bg-green-500 mr-4"
                >
                  Final Weight Challenge
                </Button>
                <Button 
                  onClick={completeNBL}
                  variant="outline"
                  className="px-8 py-4 text-xl border-green-400 text-green-300 hover:bg-green-800"
                >
                  Skip to Launch 🚀
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
