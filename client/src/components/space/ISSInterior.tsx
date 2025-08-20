import React, { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box } from '@react-three/drei';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useSpaceEducation } from '@/lib/stores/useSpaceEducation';
import { useAudio } from '@/lib/stores/useAudio';
import * as THREE from 'three';

interface ISSInteriorProps {
  onComplete: () => void;
}

interface Task {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  type: 'repair' | 'plant' | 'comms';
}

// 3D ISS Module Component
function ISSModule({ task, onTaskClick }: { task: Task; onTaskClick: (taskId: string) => void }) {
  const color = task.completed ? '#10b981' : task.type === 'repair' ? '#ef4444' : '#3b82f6';
  const pulseIntensity = task.completed ? 0 : 0.3;
  
  return (
    <group
      onClick={() => !task.completed && onTaskClick(task.id)}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { document.body.style.cursor = 'auto'; }}
    >
      <Box
        args={[2, 1.5, 1]}
        position={[
          task.type === 'repair' ? -3 : task.type === 'plant' ? 0 : 3,
          0,
          0
        ]}
      >
        <meshLambertMaterial 
          color={color} 
          transparent 
          opacity={0.7 + Math.sin(Date.now() * 0.005) * pulseIntensity} 
        />
      </Box>
      
      {/* Task indicator */}
      <Text
        position={[
          task.type === 'repair' ? -3 : task.type === 'plant' ? 0 : 3,
          1,
          0.6
        ]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {task.type === 'repair' ? '🔧' : task.type === 'plant' ? '🌱' : '📡'}
      </Text>
      
      {task.completed && (
        <Text
          position={[
            task.type === 'repair' ? -3 : task.type === 'plant' ? 0 : 3,
            -1,
            0.6
          ]}
          fontSize={0.2}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          ✓ COMPLETE
        </Text>
      )}
    </group>
  );
}

// ISS Interior Scene
function ISSScene({ tasks, onTaskClick }: { tasks: Task[]; onTaskClick: (taskId: string) => void }) {
  return (
    <>
      <color attach="background" args={["#0f172a"]} />
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, 0, 0]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[5, 0, 0]} intensity={0.5} color="#ef4444" />
      
      {/* ISS Interior Structure */}
      <group>
        {/* Main corridor */}
        <Box args={[12, 3, 3]} position={[0, 0, -2]}>
          <meshLambertMaterial color="#2d3748" transparent opacity={0.3} />
        </Box>
        
        {/* Floor */}
        <Box args={[12, 0.1, 3]} position={[0, -1.5, -2]}>
          <meshLambertMaterial color="#1a202c" />
        </Box>
        
        {/* Ceiling */}
        <Box args={[12, 0.1, 3]} position={[0, 1.5, -2]}>
          <meshLambertMaterial color="#1a202c" />
        </Box>
      </group>
      
      {/* Task modules */}
      {tasks.map((task) => (
        <ISSModule key={task.id} task={task} onTaskClick={onTaskClick} />
      ))}
      
      {/* Welcome text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.4}
        color="#3b82f6"
        anchorX="center"
        anchorY="middle"
      >
        ISS Destiny Laboratory
      </Text>
    </>
  );
}

export default function ISSInterior({ onComplete }: ISSInteriorProps) {
  const { currentPhase } = useSpaceEducation();
  const { playSuccess } = useAudio();
  
  const [currentStep, setCurrentStep] = useState<'entry' | 'tasks' | 'complete'>('entry');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 'repair',
      name: 'Inspection & Repair',
      description: 'Tighten loose panel causing red alert light',
      completed: false,
      type: 'repair'
    },
    {
      id: 'plant',
      name: 'Plant Growth Check',
      description: 'Monitor plant growth in the plant module',
      completed: false,
      type: 'plant'
    },
    {
      id: 'comms',
      name: 'Communications Check',
      description: 'Send status report to Mission Control',
      completed: false,
      type: 'comms'
    }
  ]);

  const completedTasks = tasks.filter(task => task.completed).length;
  const allTasksComplete = completedTasks === tasks.length;

  // Auto-transition from entry to tasks
  useEffect(() => {
    if (currentStep === 'entry') {
      const timer = setTimeout(() => {
        setCurrentStep('tasks');
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  // Check if all tasks are complete
  useEffect(() => {
    if (allTasksComplete && currentStep === 'tasks') {
      playSuccess();
      setCurrentStep('complete');
    }
  }, [allTasksComplete, currentStep, playSuccess]);

  const handleTaskClick = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task && !task.completed) {
      playSuccess();
      setSelectedTask(task);
    }
  };

  const completeTask = () => {
    if (selectedTask) {
      setTasks(prev => prev.map(task => 
        task.id === selectedTask.id ? { ...task, completed: true } : task
      ));
      playSuccess();
      setSelectedTask(null);
    }
  };

  // Entry sequence
  if (currentStep === 'entry') {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-blue-900">
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <Card className="max-w-2xl bg-black/80 backdrop-blur-sm border-blue-400">
            <CardHeader>
              <CardTitle className="text-4xl text-center text-blue-400">
                🚀 ISS Arrival
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-6xl mb-4">🏗️</div>
              
              <div className="bg-blue-900/30 p-6 rounded-lg border border-blue-500">
                <h3 className="text-2xl text-blue-300 mb-4">
                  Welcome aboard the ISS, Crew Member!
                </h3>
                <p className="text-lg text-gray-200">
                  You are now entering the Destiny Laboratory module through the airlock. 
                  Prepare for your onboarding tasks.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse w-full"></div>
                </div>
                <p className="text-sm text-gray-300">Airlock pressurization complete...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Task completion celebration
  if (currentStep === 'complete') {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-green-900 to-blue-900">
        <div className="absolute inset-0 bg-black/40" />
        
        <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
          <Card className="max-w-2xl bg-black/80 backdrop-blur-sm border-green-400">
            <CardHeader>
              <CardTitle className="text-4xl text-center text-green-400">
                🎉 Mission Complete!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 text-center">
              <div className="text-6xl mb-4">✅</div>
              
              <div className="bg-green-900/30 p-6 rounded-lg border border-green-500">
                <h3 className="text-2xl text-green-300 mb-4">
                  Outstanding Work!
                </h3>
                <p className="text-lg text-gray-200 mb-4">
                  You've successfully completed all onboarding tasks. 
                  The Cupola Observatory is now unlocked!
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-green-400">🔧</div>
                    <p>Panel Repaired</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-green-400">🌱</div>
                    <p>Plants Monitored</p>
                  </div>
                  <div className="bg-gray-800 p-3 rounded">
                    <div className="text-green-400">📡</div>
                    <p>Comms Verified</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={onComplete}
                className="px-8 py-4 text-xl bg-blue-600 hover:bg-blue-500"
              >
                Enter Cupola Observatory 🔭
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Main tasks interface
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 to-blue-900">
      {/* 3D ISS Interior */}
      <div className="absolute inset-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <Suspense fallback={null}>
            <ISSScene tasks={tasks} onTaskClick={handleTaskClick} />
            <OrbitControls 
              enablePan={false} 
              enableZoom={false}
              minPolarAngle={Math.PI / 4}
              maxPolarAngle={3 * Math.PI / 4}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 p-6">
        {/* Progress header */}
        <div className="mb-4">
          <Progress value={(completedTasks / tasks.length) * 100} className="w-full" />
          <p className="text-white text-center mt-2">
            Onboarding Progress: {completedTasks}/{tasks.length} tasks complete
          </p>
        </div>

        {/* Task sidebar */}
        <div className="absolute top-6 right-6 w-80">
          <Card className="bg-black/90 backdrop-blur-sm border-blue-400">
            <CardHeader>
              <CardTitle className="text-xl text-blue-400">ISS Onboarding Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tasks.map((task) => (
                <Card 
                  key={task.id}
                  className={`cursor-pointer transition-all ${
                    task.completed 
                      ? 'bg-green-900/30 border-green-500' 
                      : 'bg-gray-800 border-gray-600 hover:border-blue-400'
                  }`}
                  onClick={() => handleTaskClick(task.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className={`font-medium ${
                          task.completed ? 'text-green-300' : 'text-white'
                        }`}>
                          {task.type === 'repair' ? '🔧' : task.type === 'plant' ? '🌱' : '📡'} {task.name}
                        </h4>
                        <p className="text-sm text-gray-400">{task.description}</p>
                      </div>
                      {task.completed && (
                        <div className="text-green-400 text-xl">✓</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Task detail modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <Card className="max-w-md bg-black/90 backdrop-blur-sm border-yellow-400">
              <CardHeader>
                <CardTitle className="text-xl text-yellow-400">
                  {selectedTask.type === 'repair' ? '🔧' : selectedTask.type === 'plant' ? '🌱' : '📡'} {selectedTask.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-200">{selectedTask.description}</p>
                
                {selectedTask.type === 'repair' && (
                  <div className="bg-red-900/30 p-4 rounded-lg text-center">
                    <div className="text-4xl mb-2">⚠️</div>
                    <p className="text-red-300 mb-4">Red alert light detected!</p>
                    <Button onClick={completeTask} className="bg-red-600 hover:bg-red-500">
                      Tighten Panel 🔧
                    </Button>
                  </div>
                )}
                
                {selectedTask.type === 'plant' && (
                  <div className="bg-green-900/30 p-4 rounded-lg text-center">
                    <div className="text-4xl mb-2">🌱</div>
                    <p className="text-green-300 mb-4">Check plant growth progress</p>
                    <Button onClick={completeTask} className="bg-green-600 hover:bg-green-500">
                      Monitor Plants 🌱
                    </Button>
                  </div>
                )}
                
                {selectedTask.type === 'comms' && (
                  <div className="bg-blue-900/30 p-4 rounded-lg text-center">
                    <div className="text-4xl mb-2">📡</div>
                    <p className="text-blue-300 mb-4">Send status report to Houston</p>
                    <Button onClick={completeTask} className="bg-blue-600 hover:bg-blue-500">
                      Send Report 📡
                    </Button>
                  </div>
                )}
                
                <Button 
                  onClick={() => setSelectedTask(null)}
                  variant="outline"
                  className="w-full border-gray-500 text-gray-300"
                >
                  Cancel
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}