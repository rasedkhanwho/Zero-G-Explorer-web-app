import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

export type SpacePhase = 
  | "landing" 
  | "nbl_training" 
  | "rocket_launch" 
  | "iss_arrival" 
  | "iss_interior"
  | "cupola_experience";

interface SpaceEducationState {
  currentPhase: SpacePhase;
  progress: number;
  userChoice: 'astronaut' | 'observer' | null;
  nblCompleted: boolean;
  launchCompleted: boolean;
  dockingCompleted: boolean;
  interiorCompleted: boolean;
  
  // Actions
  setPhase: (phase: SpacePhase) => void;
  setUserChoice: (choice: 'astronaut' | 'observer') => void;
  completeNBL: () => void;
  completeLaunch: () => void;
  completeDocking: () => void;
  completeInterior: () => void;
  reset: () => void;
}

export const useSpaceEducation = create<SpaceEducationState>()(
  subscribeWithSelector((set, get) => ({
    currentPhase: "landing",
    progress: 0,
    userChoice: null,
    nblCompleted: false,
    launchCompleted: false,
    dockingCompleted: false,
    interiorCompleted: false,
    
    setPhase: (phase) => {
      set({ currentPhase: phase });
    },
    
    setUserChoice: (choice) => {
      set({ userChoice: choice });
      if (choice === 'astronaut') {
        set({ currentPhase: 'nbl_training', progress: 20 });
      } else {
        set({ currentPhase: 'cupola_experience', progress: 100 });
      }
    },
    
    completeNBL: () => {
      set({ nblCompleted: true, currentPhase: 'rocket_launch', progress: 40 });
    },
    
    completeLaunch: () => {
      set({ launchCompleted: true, currentPhase: 'iss_arrival', progress: 70 });
    },
    
    completeDocking: () => {
      set({ dockingCompleted: true, currentPhase: 'iss_interior', progress: 80 });
    },
    
    completeInterior: () => {
      set({ interiorCompleted: true, currentPhase: 'cupola_experience', progress: 100 });
    },
    
    reset: () => {
      set({
        currentPhase: "landing",
        progress: 0,
        userChoice: null,
        nblCompleted: false,
        launchCompleted: false,
        dockingCompleted: false,
        interiorCompleted: false
      });
    }
  }))
);
