import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState } from "react";
import { useSpaceEducation } from "./lib/stores/useSpaceEducation";
import { useAudio } from "./lib/stores/useAudio";
import { LandingPage } from "./components/space/LandingPage";
import { NBLTraining } from "./components/space/NBLTraining";
import { RocketLaunch } from "./components/space/RocketLaunch";
import { ISSArrival } from "./components/space/ISSArrival";
import ISSInterior from "./components/space/ISSInterior";
import { CupolaExperience } from "./components/space/CupolaExperience";
import "@fontsource/inter";

function App() {
  const { currentPhase, completeInterior } = useSpaceEducation();
  const [showCanvas, setShowCanvas] = useState(false);

  // Show the canvas once everything is loaded
  useEffect(() => {
    setShowCanvas(true);
  }, []);

  // Initialize audio
  useEffect(() => {
    const backgroundMusic = new Audio('/sounds/background.mp3');
    const hitSound = new Audio('/sounds/hit.mp3');
    const successSound = new Audio('/sounds/success.mp3');
    
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    
    useAudio.getState().setBackgroundMusic(backgroundMusic);
    useAudio.getState().setHitSound(hitSound);
    useAudio.getState().setSuccessSound(successSound);
  }, []);

  if (!showCanvas) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        background: 'linear-gradient(to bottom, #000011, #000033)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '24px'
      }}>
        Loading Space Education Platform...
      </div>
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {currentPhase === 'landing' && <LandingPage />}
      {currentPhase === 'nbl_training' && <NBLTraining />}
      {currentPhase === 'rocket_launch' && <RocketLaunch />}
      {currentPhase === 'iss_arrival' && <ISSArrival />}
      {currentPhase === 'iss_interior' && <ISSInterior onComplete={completeInterior} />}
      {currentPhase === 'cupola_experience' && <CupolaExperience />}
    </div>
  );
}

export default App;
