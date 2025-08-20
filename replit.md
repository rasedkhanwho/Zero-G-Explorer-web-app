# Overview

This is a comprehensive space education platform that provides an immersive 3D learning experience about astronaut training and space missions. The application combines interactive 3D graphics with educational content to guide users through the complete astronaut journey, from NASA's Neutral Buoyancy Lab (NBL) training through ISS arrival and interior operations.

## Key Features

### Complete Astronaut Training Sequence
- **NBL Training Module**: Full protocol sequence with authentic NASA procedures
  - Step 1: Introduction with NASA NBL footage slides and real training images
  - Step 2: EMU suit assembly mini-game with drag-and-drop components
  - Step 3: Pre-breathe protocol with nitrogen elimination animation and timer
  - Step 4: NBL pool simulation with ISS maintenance tasks and virtual safety divers
  - Mission debrief with performance metrics and completion scores

### ISS Interior Experience
- **First-person airlock entry** into Destiny Laboratory with welcome message
- **Three onboarding mini-games** that must be completed to unlock Cupola access:
  - Inspection & Repair: Fix loose panel causing red alert light
  - Plant Growth: Monitor plant growth in the plant module
  - Communications Check: Send status report to Mission Control
- **3D interactive ISS interior** with clickable task modules and progress tracking

### Enhanced Cupola Observatory
- **Dynamic Earth location tracking**: Real-time simulation of ISS orbital positions
- **Live ISS tracking integration**: Button linking to https://isstracker.pl/en for authentic position data
- **Multiple viewing modes**: Earth view, orbital sunrise, and deep space perspectives
- **Educational information panels** with authentic ISS facts and orbital data

The platform allows users to choose between being an astronaut (going through full training sequence) or an observer (directly experiencing space), with gamified progression ensuring educational engagement.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built with React and Three.js, creating an immersive 3D experience:

- **React with TypeScript**: Core UI framework with strong typing
- **Three.js via @react-three/fiber**: 3D graphics rendering and animation
- **@react-three/drei**: Additional 3D utilities and helpers
- **Zustand**: State management for game phases, audio, and education progress
- **Tailwind CSS with shadcn/ui**: Modern styling system with pre-built components
- **Vite**: Fast development build tool with hot module replacement

The application uses a phase-based architecture where users progress through different educational stages, each with its own 3D scene and interactive elements.

## Backend Architecture

The backend follows a minimal Express.js structure:

- **Express.js**: HTTP server with JSON middleware
- **TypeScript**: Type-safe server-side code
- **Modular routing**: Centralized route registration system
- **Development/Production modes**: Vite integration for development, static serving for production
- **Memory storage**: In-memory data storage with interface for future database integration

## Data Storage Solutions

Currently uses an in-memory storage system with a clean interface:

- **MemStorage class**: In-memory implementation of storage interface
- **Database-ready interface**: Prepared for future PostgreSQL integration via Drizzle ORM
- **User management**: Basic user schema with username/password structure
- **Extensible design**: Easy to swap memory storage for database storage

## Authentication and Authorization

Basic authentication structure is set up but not fully implemented:

- **User schema**: Username/password based user model
- **Zod validation**: Input validation for user creation
- **Storage interface**: Methods for user retrieval and creation
- **Session ready**: Infrastructure prepared for session management

## External Dependencies

### Database and ORM
- **Drizzle ORM**: Type-safe database toolkit configured for PostgreSQL
- **@neondatabase/serverless**: Serverless PostgreSQL connection adapter
- **PostgreSQL**: Target database system (configured but not actively used yet)

### 3D Graphics and Audio
- **Three.js ecosystem**: Complete 3D rendering pipeline
- **GLSL shader support**: Custom shader capabilities via vite-plugin-glsl
- **Audio system**: HTML5 audio integration for background music and sound effects
- **3D model support**: GLTF/GLB model loading capabilities

### UI and Styling
- **Radix UI**: Accessible, unstyled UI components
- **Tailwind CSS**: Utility-first CSS framework
- **Class variance authority**: Component variant management
- **Fontsource**: Web font integration

### Development Tools
- **Vite**: Fast build tool with React plugin
- **TypeScript**: Static type checking
- **ESLint configuration**: Code quality and consistency
- **Hot module replacement**: Development experience optimization