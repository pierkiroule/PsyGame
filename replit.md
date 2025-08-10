# Psychographe - Creative Interactive Prototype

## Overview

Psychographe is an interactive React application that serves as a creative and projective tool. The application generates unique "psychographies" (creative outputs consisting of poetic text, images, and animation guides) based on user inputs and selected game configurations. This is a prototype designed to test user flows and interface designs across 24 different combinations (4 formats × 3 styles × score on/off) with simulated AI results.

The application guides users through a structured creative process: selecting game format and style, inputting creative contributions, and receiving generated artistic content with optional scoring and badges. All AI generation is currently simulated on the frontend for prototyping purposes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application uses a **React SPA (Single Page Application)** architecture built with Vite and TypeScript. The UI is constructed using **shadcn/ui components** built on top of Radix UI primitives and styled with **Tailwind CSS**.

**State Management**: Centralized through a React Context (`SessionContext`) that manages the entire application flow, session configuration, player inputs, and generated results. This provides a clean separation between UI components and application state.

**Navigation**: Screen-based navigation system with four main screens (Home, New Session, Game, Results) managed through the session context rather than traditional routing, keeping the prototype simple and focused.

**Component Structure**: Modular component architecture with reusable UI components in the `components/ui` directory and screen-specific components for each application state.

**Gamification System**: Comprehensive badge and reward system with 6 creative dimensions (technique, poetique, psychologique, narratif, communautaire, suggestion) across 3 progressive levels. Features animated SVG badges, community voting, and AI-powered evaluation.

**Forum Communautaire**: Psychothèque publique transformée en forum avec système de Top 5 hebdomadaire, vote communautaire, commentaires, et système de tri avancé. Inclut galerie des meilleures créations et encouragement à la participation.

### Backend Architecture
The backend uses **Express.js** with TypeScript in ESM format. Currently minimal, it's structured to support future API endpoints with a clean separation between routing (`routes.ts`) and business logic.

**Storage Layer**: Implements an abstract storage interface (`IStorage`) with an in-memory implementation (`MemStorage`) for development. This abstraction allows easy swapping to database-backed storage later.

**Development Setup**: Integrated with Vite for hot module replacement during development, with production builds creating static assets and a bundled Node.js server.

### Data Storage Solutions
**Database Configuration**: Configured for PostgreSQL using **Drizzle ORM** with migration support. Currently includes a basic users table schema as a foundation.

**Session Data**: Improved session persistence with 30-day expiration and rolling renewal to avoid frequent reconnections. User sessions maintained through express-session with secure cookie configuration.

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