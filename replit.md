# Psychographe - Creative Interactive Prototype

## Overview

Psychographe est une application React interactive qui sert d'outil créatif et projectif minimaliste. L'application génère des "psychographies" uniques (créations poétiques et introspectives) basées sur les contributions des utilisateurs et des configurations de jeu sélectionnées. 

L'application guide les utilisateurs à travers un processus créatif structuré mais simplifié : exploration guidée, contributions créatives, et réception de contenu artistique généré avec notation optionnelle et badges. L'interface privilégie la simplicité, la fluidité et l'accessibilité avec des explications claires et un onboarding intégré. L'accent est mis sur l'expérience utilisateur minimaliste mais pertinente.

## Recent Changes

**2025-01-10**: Created new animated SVG logo based on user's design specifications
- Rebuilt PsychographeLogo as pure SVG with concentric animated circles
- Text "PSYCHOGRAPH" arranged in arc around outer circle with smooth rotation animation
- Three-layer circle design: outer (light gray), middle (blue), inner (purple) with pulsing effects
- Added decorative animated points and subtle wave ripples for visual interest
- Included "A.I.magination" subtitle with fade animation
- Implemented professional color scheme with gradients and glow effects
- All animations coordinated for smooth, sophisticated visual experience

## User Preferences

Preferred communication style: Simple, everyday language.
UI/UX preferences: Minimaliste mais pertinente, jolie et très fluide, facile à prendre en main avec des explications claires.

## System Architecture

### Frontend Architecture
The application uses a **React SPA (Single Page Application)** architecture built with Vite and TypeScript. The UI is constructed using **shadcn/ui components** built on top of Radix UI primitives and styled with **Tailwind CSS**.

**State Management**: Centralized through a React Context (`SessionContext`) that manages the entire application flow, session configuration, player inputs, and generated results. This provides a clean separation between UI components and application state.

**Navigation**: Screen-based navigation system with four main screens (Home, New Session, Game, Results) managed through the session context rather than traditional routing, keeping the prototype simple and focused.

**Component Structure**: Modular component architecture with reusable UI components in the `components/ui` directory and screen-specific components for each application state.

**Gamification System**: Système ultra-simplifié de badges en 3 niveaux directs et sympas : "Psychographe en herbe" (🌱), "Psychographe de ouf !" (🎨), "Psychographe de génie" (🌟). Approche accessible et motivante avec langage familier et progression claire basée sur les points d'activité.

**Forum Communautaire**: Psychothèque publique transformée en forum avec système de Top 5 hebdomadaire, vote communautaire, commentaires, et système de tri avancé. Inclut galerie des meilleures créations et encouragement à la participation.

**Visualisation Sémantique**: Dashboard de réseau de tags dans le profil utilisateur permettant de visualiser les co-occurrences et communautés thématiques. Utilise une représentation graphique interactive pour révéler les patterns créatifs et thématiques de l'utilisateur.

**Navigation Avancée**: Menu principal redesigné avec logo à effet d'onde résonante, navigation contextuelle, profil utilisateur intégré, notifications et menu mobile responsive. Le logo présente des ondes naissant organiquement du "o" de Psychographe avec animations fluides et effet d'écho lumineux. Inclut tooltips informatifs et états visuels pour une expérience utilisateur optimale.

### Backend Architecture
The backend uses **Express.js** with TypeScript in ESM format. Currently minimal, it's structured to support future API endpoints with a clean separation between routing (`routes.ts`) and business logic.

**Storage Layer**: Implements an abstract storage interface (`IStorage`) with an in-memory implementation (`MemStorage`) for development. This abstraction allows easy swapping to database-backed storage later.

**Development Setup**: Integrated with Vite for hot module replacement during development, with production builds creating static assets and a bundled Node.js server.

### Data Storage Solutions
**Database Configuration**: Configured for PostgreSQL using **Drizzle ORM** with migration support. Currently includes a basic users table schema as a foundation.

**Session Data**: Improved session persistence with 30-day expiration and rolling renewal to avoid frequent reconnections. User sessions maintained through express-session with secure cookie configuration. Authentication disabled during development for easier access.

### Styling and Design System
**Design System**: Uses shadcn/ui with a custom theme configuration featuring neutral base colors and CSS custom properties for consistent theming. The design emphasizes gradients and modern spacing for a creative, engaging interface.

**Responsive Design**: Mobile-first approach using Tailwind CSS breakpoints to ensure usability across devices.

### Development and Build Process
**Build Pipeline**: Vite handles frontend bundling with React support, while esbuild bundles the Node.js server for production. The configuration supports both development (with HMR) and production deployments.

**Type Safety**: Full TypeScript implementation across frontend and backend with shared type definitions in the `shared` directory for consistent data structures.

## External Dependencies

### UI Framework and Styling
- **React 18**: Core frontend framework with modern hooks and concurrent features
- **Vite**: Fast development server and build tool with React plugin
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **shadcn/ui**: High-quality React component library built on Radix UI
- **Radix UI**: Primitive components providing accessibility and behavior
- **Lucide React**: Icon library for consistent iconography

### Backend Framework
- **Express.js**: Web application framework for Node.js
- **tsx**: TypeScript execution environment for development

### Database and ORM
- **Drizzle ORM**: Type-safe SQL ORM with PostgreSQL support
- **@neondatabase/serverless**: Serverless PostgreSQL client
- **drizzle-kit**: Schema migration and introspection tools

### Development Tools
- **TypeScript**: Static type checking across the entire application
- **PostCSS**: CSS processing with Autoprefixer for browser compatibility
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay for better debugging experience

### Form Handling and Validation
- **React Hook Form**: Performant form library with minimal re-renders
- **@hookform/resolvers**: Integration layer for validation libraries
- **Zod**: Schema validation for type-safe data handling

### Utility Libraries
- **clsx**: Conditional CSS class construction
- **class-variance-authority**: Component variant management
- **date-fns**: Date manipulation utilities
- **nanoid**: Unique ID generation

The application is configured for easy deployment on platforms like Replit, with development banners and cartographer integration for enhanced development experience.