# Psychographe - Creative Interactive Prototype

## Overview

Psychographe est devenu un outil de brainstorming projectif et résonant révolutionnaire. L'application transforme le processus créatif en un studio psychographique fluide où les utilisateurs peuvent enrichir et développer leurs idées initiales à travers un processus d'IA collaborative.

L'approche est entièrement repensée autour de trois étapes fluides sur une seule page : (1) Saisie vocale ou textuelle du texte initial, (2) Enrichissement dans le labo psychographique avec génération de prompts et paramétrage créatif, (3) Génération finale avec contrôle précis des paramètres et sauvegarde dans la psychothèque publique/privée.

L'interface privilégie la fluidité totale avec voice-to-text universel, visualisation en temps réel du prompt enrichi, et contrôle granulaire du processus créatif.

## Recent Changes

**2025-01-11**: Finalisation Architecture Écoresponsable Minimaliste
- **Mode Éco Exclusif**: Application 100% écoresponsable sans mode traditionnel, optimisée pour la performance
- **Studio Psychographique Finalisé**: 3 étapes fluides avec UX enrichie (Saisie → Enrichissement → Création)
- **Navigation Cohérente**: Studio / Ma Psychothèque / Découvrir avec terminologie unifiée
- **Contenu Écoresponsable**: Textes et métaphores naturelles (jardin créatif, cultiver ses réflexions)
- **Préparation Déploiement**: README.md, .gitignore, vercel.json configurés pour GitHub et Vercel
- **Design Minimaliste Finalisé**: Interface épurée, couleurs vertes/bleues, iconographie nature
- **Performance Optimisée**: Architecture allégée, composants simplifiés, requêtes optimisées

**2025-01-11**: Complete Transformation to Psychographic Studio with Gallery System
- **Studio Psychographique**: Revolutionary 3-step workflow replacing game modes entirely
- **Step 1 - Initial Input**: Voice/text capture with universal "Qu'est-ce qui vous habite maintenant ?" question
- **Step 2 - Psychographic Lab**: AI-generated enriched prompts (6 options, select up to 4) with creative parameters
- **Step 3 - Generation & Save**: Real-time final prompt preview, AI generation, and save to Psychothèque
- **Enhanced Psychothèque**: Complete gallery system with voting (1-5 stars), commenting, and social features
- **Download Pack System**: Select multiple psychographies, generate .zip with formatted .docx files including metadata
- **DOCX Generation**: Professional formatting with logos, legal mentions, creation dates, and structured content
- **Advanced Database**: PostgreSQL schema with votes, comments, download packs, and gallery statistics
- **Social Features**: Public/private visibility, community voting, comment system, download tracking
- **Universal Voice Integration**: VoiceTextInput component across all text fields for natural expression

**2025-01-11**: Legacy Interface Preservation
- **Universal Question**: "Qu'est-ce qui vous habite maintenant ?" - one powerful question for all formats
- **SimpleGameSelector**: New interface replacing complex multi-mode system
- **Three Temporal Modes**: Instant Flash (30s), Contemplation (5min), Vocal Pur (2min voice-only)
- **Format Adaptation**: Same question works for Solo/Duo/Group with different psychography generation
- **Inspiration System**: Integrated idea associations and creative prompts to spark responses
- **Voice Integration**: Universal voice-to-text across all response fields
- **Data Structure**: Adapted existing session system to work with simplified single-question approach

**2025-01-10**: Complete Scoring System Removal and Cooperative Focus
- **Scoring Logic Eliminated**: All scoring, points, badges, and competitive elements completely removed from application
- **Cooperative Experience**: Focus shifted to pure collaborative creativity without metrics or competition
- **Game Modes Finalized**: 5 distinct cooperative modes with synthetic instructions and relevant examples
- **Community Sharing**: Simplified sharing system focused on inspiration and mutual support
- **UI Cleanup**: Removed all scoring displays, progress bars, and gamification elements from interface

**2025-01-10**: Voice-to-Text Integration and UI/UX Enhancement
- **Voice-to-Text System**: Complete integration of Web Speech Recognition API for native device voice input
- VoiceInput component with real-time transcription, language detection (French), and seamless text/voice combination
- Interactive voice demo page with guided creative process flow
- Voice navigation added to both Header and MinimalHeader components
- Error handling and browser compatibility checks for speech recognition
- Real-time feedback with visual indicators for voice recording state

**2025-01-10**: Comprehensive UI/UX redesign following ecodesign and modern ergonomic principles
- Enhanced PSYCHOGRAPHE logo with circular echo waves and blue color scheme
- Text "PSYCHOGRAPHE" with ResizeObserver-based alignment system ensuring "O" center matches wave center
- Circular concentric echo waves originating from precise coordinates (64,40) in 128×80 viewBox
- Blue color scheme (#3b82f6, #2563eb, #1d4ed8, #1e40af) replacing emerald green throughout application
- **Page d'accueil**: Hero section redesigned with larger logo (120px), fluid buttons with hover animations, improved typography hierarchy
- **En-tête navigation**: Modernized with smooth animations, rounded buttons, informative tooltips, and enhanced brand visibility
- **Page profil**: Premium card design with backdrop-blur-xl, enhanced shadows, optimized spacing and hover effects
- **Page connexion**: Improved visual hierarchy with better contrast and increased spacing for readability
- **Global improvements**: Custom scrollbar, smooth scroll behavior, consistent button animations, enhanced visual feedback
- "Psychocatcher des Résonances" title now in blue color for visual consistency

## User Preferences

Preferred communication style: Simple, everyday language.
UI/UX preferences: Minimaliste mais pertinente, jolie et très fluide, facile à prendre en main avec des explications claires.

## System Architecture

### Frontend Architecture
The application uses a **React SPA (Single Page Application)** architecture built with Vite and TypeScript. The UI is constructed using **shadcn/ui components** built on top of Radix UI primitives and styled with **Tailwind CSS**.

**State Management**: Centralized through a React Context (`SessionContext`) that manages the entire application flow, session configuration, player inputs, and generated results. This provides a clean separation between UI components and application state.

**Navigation**: Screen-based navigation system with four main screens (Home, New Session, Game, Results) managed through the session context rather than traditional routing, keeping the prototype simple and focused.

**Component Structure**: Modular component architecture with reusable UI components in the `components/ui` directory and screen-specific components for each application state.

**Community System**: Système communautaire basé sur le partage et l'inspiration mutuelle. Badges de reconnaissance simples : "Psychographe en herbe" (🌱), "Psychographe de ouf !" (🎨), "Psychographe de génie" (🌟). Approche accessible et motivante avec langage familier et progression naturelle basée sur la participation active.

**Forum Communautaire**: Psychothèque publique transformée en forum avec système de Top 5 hebdomadaire, vote communautaire, commentaires, et système de tri avancé. Inclut galerie des meilleures créations et encouragement à la participation.

**Visualisation Sémantique**: Dashboard de réseau de tags dans le profil utilisateur permettant de visualiser les co-occurrences et communautés thématiques. Utilise une représentation graphique interactive pour révéler les patterns créatifs et thématiques de l'utilisateur.

**Navigation Avancée**: Menu principal redesigné avec logo à effet d'onde résonante, navigation contextuelle, profil utilisateur intégré, notifications et menu mobile responsive. Le logo présente des ondes naissant organiquement du "o" de Psychographe avec animations fluides et effet d'écho lumineux. Inclut tooltips informatifs et états visuels pour une expérience utilisateur optimale.

**Voice-to-Text Integration**: Système complet de reconnaissance vocale utilisant l'API Web Speech Recognition native pour la capture spontanée d'idées créatives. Interface fluide combinant saisie vocale et textuelle avec transcription temps réel, gestion d'erreurs et compatibilité navigateur.

**Simplified Game System**: Revolutionary single-question approach with universal adaptability:
- **One Universal Question**: "Qu'est-ce qui vous habite maintenant ?" works for all contexts and players
- **Three Temporal Modes**: Instant Flash (30s spontaneous), Contemplation (5min deep), Vocal Pur (2min voice-only)
- **Format Scaling**: Solo (introspection), Duo (crossed resonances), Group (collective constellation)
- **Inspiration Engine**: Integrated creative prompts and word associations to spark authentic responses
- **Voice-First Design**: All text fields include voice-to-text for natural expression
- **Cooperative Focus**: Pure creative collaboration without any competitive scoring elements

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