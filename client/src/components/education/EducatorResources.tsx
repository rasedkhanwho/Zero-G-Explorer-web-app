import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useSpaceEducation } from '@/lib/stores/useSpaceEducation';

interface EducatorResourcesProps {
  onClose: () => void;
}

export default function EducatorResources({ onClose }: EducatorResourcesProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-950 to-slate-900 overflow-y-auto">
      <div className="absolute inset-0 bg-black/20" />
      
      {/* Header */}
      <div className="relative z-10 p-6 border-b border-blue-400/30 bg-blue-950/50">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">NASA</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mission Control: Classroom</h1>
              <p className="text-blue-200">Educational Resources for Educators</p>
            </div>
          </div>
          <Button 
            onClick={onClose}
            variant="outline"
            className="border-blue-400 text-blue-300 hover:bg-blue-800"
          >
            ← Back to Mission
          </Button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-slate-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-blue-600">Overview</TabsTrigger>
            <TabsTrigger value="nbl" className="data-[state=active]:bg-blue-600">NBL Training</TabsTrigger>
            <TabsTrigger value="math" className="data-[state=active]:bg-blue-600">Math Worksheet</TabsTrigger>
            <TabsTrigger value="iss" className="data-[state=active]:bg-blue-600">ISS Tracking</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-slate-800/90 backdrop-blur-sm border-blue-400">
              <CardHeader>
                <CardTitle className="text-2xl text-blue-400">Mission to the Classroom</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500">
                  <h3 className="text-xl text-blue-300 mb-2">Transform Digital Learning into Hands-On Experience</h3>
                  <p className="text-gray-200">
                    These NASA-branded educational resources extend your students' digital space experience 
                    into engaging classroom activities. All materials are ready-to-print and aligned with 
                    STEM education standards.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="bg-slate-700 border-orange-400">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">🏊‍♂️</div>
                      <h4 className="font-bold text-orange-300">NBL Simulator</h4>
                      <p className="text-sm text-gray-300">Build a neutral buoyancy demonstrator using simple materials</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-green-400">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">📊</div>
                      <h4 className="font-bold text-green-300">Math Problems</h4>
                      <p className="text-sm text-gray-300">Real NASA calculations using Archimedes' Principle</p>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-purple-400">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl mb-2">🛰️</div>
                      <h4 className="font-bold text-purple-300">ISS Tracking</h4>
                      <p className="text-sm text-gray-300">Find when the ISS will pass over your school</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-red-900/20 p-4 rounded-lg border border-red-400">
                  <h4 className="text-red-300 font-bold mb-2">🚀 NASA Educational Standards</h4>
                  <p className="text-gray-200 text-sm">
                    These activities align with Next Generation Science Standards (NGSS) and support 
                    learning objectives in Physics, Engineering Design, and Earth-Space Science.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NBL Training Tab */}
          <TabsContent value="nbl" className="space-y-6">
            <Card className="bg-slate-800/90 backdrop-blur-sm border-orange-400">
              <CardHeader>
                <CardTitle className="text-2xl text-orange-400">How NBL Training Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Infographic Section */}
                <div className="bg-orange-900/20 p-6 rounded-lg border border-orange-500">
                  <h3 className="text-xl text-orange-300 mb-4">📋 Printable Infographic</h3>
                  
                  <div className="bg-white p-6 rounded-lg text-black mb-4">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                        <span className="text-white font-bold">NASA</span>
                      </div>
                      <h2 className="text-2xl font-bold text-blue-900">Neutral Buoyancy Laboratory (NBL)</h2>
                      <p className="text-gray-600">How Astronauts Train Underwater for Spacewalks</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-6xl mb-2">🧑‍🚀</div>
                          <div className="text-4xl mb-2">💧</div>
                          <p className="font-semibold text-blue-800">Astronaut in NBL Pool</p>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="bg-blue-100 p-2 rounded border-l-4 border-blue-500">
                            <strong>1. Neutral Buoyancy:</strong><br/>
                            Weight = Water Displaced
                          </div>
                          <div className="bg-green-100 p-2 rounded border-l-4 border-green-500">
                            <strong>2. Weighted Suit:</strong><br/>
                            Adjusted for perfect hover
                          </div>
                          <div className="bg-purple-100 p-2 rounded border-l-4 border-purple-500">
                            <strong>3. Zero-G Simulation:</strong><br/>
                            Mimics weightlessness in space
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-800">NBL Facts:</h3>
                        <ul className="text-sm space-y-1 text-gray-700">
                          <li>• Pool depth: 40 feet (12 meters)</li>
                          <li>• Water volume: 6.2 million gallons</li>
                          <li>• Training ratio: 7 hours underwater = 1 hour EVA</li>
                          <li>• Full-scale ISS and Hubble mockups underwater</li>
                          <li>• Used by astronauts from around the world</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-orange-600 hover:bg-orange-500">
                    🖨️ Download Printable Infographic (PDF)
                  </Button>
                </div>

                {/* Activity Section */}
                <div className="bg-slate-700 p-6 rounded-lg border border-slate-500">
                  <h3 className="text-xl text-white mb-4">🧪 Classroom Activity: Build Your Own Neutral Buoyancy Simulator</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-bold text-orange-300 mb-2">Objective:</h4>
                        <p className="text-gray-200 text-sm">
                          Use a balloon and weights to demonstrate neutral buoyancy principles
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-green-300 mb-2">Materials Needed:</h4>
                        <ul className="text-gray-200 text-sm space-y-1">
                          <li>• Balloon</li>
                          <li>• Small weights (paperclips work great)</li>
                          <li>• String</li>
                          <li>• Large bucket or container of water</li>
                          <li>• Tape</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-bold text-blue-300 mb-2">Step-by-Step Instructions:</h4>
                      <ol className="text-gray-200 text-sm space-y-2">
                        <li><strong>1.</strong> Fill the balloon with air and tie it securely</li>
                        <li><strong>2.</strong> Attach weights with string until the balloon just sinks</li>
                        <li><strong>3.</strong> Add one more small weight - Does it sink? (Too heavy!)</li>
                        <li><strong>4.</strong> Remove one small weight - Does it float? (Too light!)</li>
                        <li><strong>5.</strong> Find the exact balance where it hovers in the middle</li>
                      </ol>
                      
                      <div className="bg-blue-900/30 p-3 rounded border border-blue-500">
                        <h5 className="font-bold text-blue-300 mb-1">Discussion Questions:</h5>
                        <ul className="text-xs text-gray-300 space-y-1">
                          <li>• How is this like an astronaut's suit in the NBL?</li>
                          <li>• Why is this a good way to train for space?</li>
                          <li>• What happens if the weight is wrong?</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Math Worksheet Tab */}
          <TabsContent value="math" className="space-y-6">
            <Card className="bg-slate-800/90 backdrop-blur-sm border-green-400">
              <CardHeader>
                <CardTitle className="text-2xl text-green-400">The Math of Buoyancy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-white p-6 rounded-lg text-black">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-600 rounded-full mx-auto mb-2 flex items-center justify-center">
                      <span className="text-white font-bold">NASA</span>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-900">Student Worksheet: Buoyancy Calculations</h2>
                    <p className="text-gray-600">Using Real NASA Data</p>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <h3 className="font-bold text-blue-800 mb-2">📚 Background: Archimedes' Principle</h3>
                      <p className="text-sm text-gray-700">
                        <strong>Archimedes' Principle:</strong> An object submerged in a fluid experiences an upward 
                        buoyant force equal to the weight of the fluid displaced by the object.
                      </p>
                      <div className="mt-2 p-2 bg-yellow-100 rounded">
                        <strong>Formula:</strong> Buoyant Force = Weight of Displaced Water
                      </div>
                    </div>

                    <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                      <h3 className="font-bold text-red-800 mb-2">🚀 Real NASA Data</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Astronaut + EMU Suit Mass:</strong> 150 kg</p>
                          <p><strong>Weight on Earth:</strong> 1,500 N (Newtons)</p>
                          <p><strong>NBL Pool Depth:</strong> 12 meters</p>
                        </div>
                        <div>
                          <p><strong>Water Density:</strong> 1,000 kg/m³</p>
                          <p><strong>Gravity:</strong> 9.8 m/s²</p>
                          <p><strong>Training Duration:</strong> 6+ hours</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-bold text-gray-800">Math Problems:</h3>
                      
                      <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="font-bold text-green-800 mb-2">Problem 1: Basic Neutral Buoyancy</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          In the NBL, engineers add weights to the astronaut's suit until the upward buoyant 
                          force equals the downward gravitational force.
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Question:</strong> What must the total buoyant force be for a 150 kg astronaut 
                          (in suit) to hover neutrally in the water?
                        </p>
                        <div className="bg-white p-2 rounded border">
                          <p className="text-xs text-gray-600">Show your work:</p>
                          <div className="h-12 border-b border-gray-300 mb-2"></div>
                          <p className="text-xs"><strong>Answer:</strong> _______ N</p>
                        </div>
                      </div>

                      <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="font-bold text-purple-800 mb-2">Problem 2: Water Displacement</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          To achieve neutral buoyancy, the astronaut must displace exactly 150 kg of water.
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Question:</strong> What volume of water must the astronaut + suit displace?<br/>
                          <em>Hint: Water density = 1,000 kg/m³</em>
                        </p>
                        <div className="bg-white p-2 rounded border">
                          <p className="text-xs text-gray-600">Show your work:</p>
                          <div className="h-12 border-b border-gray-300 mb-2"></div>
                          <p className="text-xs"><strong>Answer:</strong> _______ m³</p>
                        </div>
                      </div>

                      <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h4 className="font-bold text-orange-800 mb-2">Problem 3: Training Efficiency</h4>
                        <p className="text-sm text-gray-700 mb-2">
                          NASA uses a 7:1 training ratio - 7 hours of NBL training for every 1 hour of spacewalk.
                        </p>
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Question:</strong> How many hours of NBL training are needed to prepare for 
                          a 6.5-hour spacewalk?
                        </p>
                        <div className="bg-white p-2 rounded border">
                          <p className="text-xs text-gray-600">Show your work:</p>
                          <div className="h-12 border-b border-gray-300 mb-2"></div>
                          <p className="text-xs"><strong>Answer:</strong> _______ hours</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 p-4 rounded-lg border border-gray-300">
                      <h4 className="font-bold text-gray-800 mb-2">Answer Key (For Teachers)</h4>
                      <div className="text-xs text-gray-600 space-y-1">
                        <p><strong>Problem 1:</strong> 1,500 N (Weight = mg = 150 kg × 10 m/s² = 1,500 N)</p>
                        <p><strong>Problem 2:</strong> 0.15 m³ (Volume = mass/density = 150 kg ÷ 1,000 kg/m³)</p>
                        <p><strong>Problem 3:</strong> 45.5 hours (6.5 hours × 7 = 45.5 hours)</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-500">
                  🖨️ Download Math Worksheet (PDF)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ISS Tracking Tab */}
          <TabsContent value="iss" className="space-y-6">
            <Card className="bg-slate-800/90 backdrop-blur-sm border-purple-400">
              <CardHeader>
                <CardTitle className="text-2xl text-purple-400">ISS Sighting Predictor for Your School</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-purple-900/20 p-6 rounded-lg border border-purple-500">
                  <h3 className="text-xl text-purple-300 mb-4">🛰️ When Will the ISS Pass Over Your School?</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white p-4 rounded-lg text-black">
                        <h4 className="font-bold text-gray-800 mb-2">📍 Step-by-Step Instructions:</h4>
                        <ol className="text-sm space-y-2">
                          <li><strong>1.</strong> Visit NASA's official ISS tracking website</li>
                          <li><strong>2.</strong> Enter your school's city or zip code</li>
                          <li><strong>3.</strong> Get exact times for visible passes</li>
                          <li><strong>4.</strong> Plan your class viewing session!</li>
                        </ol>
                      </div>
                      
                      <Button 
                        onClick={() => window.open('https://spotthestation.nasa.gov', '_blank')}
                        className="w-full bg-purple-600 hover:bg-purple-500"
                      >
                        🌐 Visit spotthestation.nasa.gov
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-blue-900/30 p-4 rounded-lg border border-blue-500">
                        <h4 className="font-bold text-blue-300 mb-2">👀 What Students Will See:</h4>
                        <ul className="text-gray-200 text-sm space-y-1">
                          <li>• Bright moving "star" crossing the sky</li>
                          <li>• Takes 5-6 minutes to cross horizon to horizon</li>
                          <li>• Best viewed during dawn/dusk passes</li>
                          <li>• No blinking lights (it's not a plane!)</li>
                          <li>• Magnitude: Often brighter than Venus</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-900/30 p-4 rounded-lg border border-green-500">
                        <h4 className="font-bold text-green-300 mb-2">📚 Teaching Moments:</h4>
                        <ul className="text-gray-200 text-sm space-y-1">
                          <li>• Orbital mechanics and velocity</li>
                          <li>• International cooperation</li>
                          <li>• Life in microgravity</li>
                          <li>• Scientific research in space</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-slate-700 border-blue-400">
                    <CardHeader>
                      <CardTitle className="text-blue-400">🌍 Helpful Educational Links</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        onClick={() => window.open('https://eol.jsc.nasa.gov', '_blank')}
                        variant="outline"
                        className="w-full justify-start border-blue-400 text-blue-300"
                      >
                        📸 Earth photos from ISS
                      </Button>
                      
                      <Button 
                        onClick={() => window.open('https://www.nasa.gov/johnson/neutral-buoyancy-laboratory/', '_blank')}
                        variant="outline"
                        className="w-full justify-start border-orange-400 text-orange-300"
                      >
                        🏊‍♂️ NBL Official Info
                      </Button>
                      
                      <Button 
                        onClick={() => window.open('https://isstracker.pl/en', '_blank')}
                        variant="outline"
                        className="w-full justify-start border-green-400 text-green-300"
                      >
                        🛰️ Real-time ISS Tracker
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-yellow-400">
                    <CardHeader>
                      <CardTitle className="text-yellow-400">📋 Classroom Activity Ideas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="text-sm text-gray-200 space-y-2">
                        <div className="bg-yellow-900/30 p-2 rounded">
                          <strong>Before the Pass:</strong> Calculate the ISS speed and altitude
                        </div>
                        <div className="bg-yellow-900/30 p-2 rounded">
                          <strong>During the Pass:</strong> Time the crossing with stopwatches
                        </div>
                        <div className="bg-yellow-900/30 p-2 rounded">
                          <strong>After the Pass:</strong> Research what experiments are happening onboard
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-red-900/20 p-4 rounded-lg border border-red-400">
                  <h4 className="text-red-300 font-bold mb-2">🎯 Quick ISS Facts for Students</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-200">
                    <ul className="space-y-1">
                      <li>• <strong>Speed:</strong> 27,600 km/h (17,150 mph)</li>
                      <li>• <strong>Altitude:</strong> ~420 km above Earth</li>
                      <li>• <strong>Orbit time:</strong> 90 minutes</li>
                      <li>• <strong>Daily orbits:</strong> 15.5 times per day</li>
                    </ul>
                    <ul className="space-y-1">
                      <li>• <strong>Size:</strong> Football field sized</li>
                      <li>• <strong>Mass:</strong> 450,000 kg</li>
                      <li>• <strong>Crew:</strong> Usually 6-7 people</li>
                      <li>• <strong>Countries:</strong> 15 nations involved</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Footer */}
      <div className="relative z-10 bg-slate-900/80 border-t border-blue-400/30 p-4 text-center text-sm text-gray-400">
        <p>NASA Educational Resources | Mission Control: Classroom | All materials aligned with NGSS Standards</p>
      </div>
    </div>
  );
}