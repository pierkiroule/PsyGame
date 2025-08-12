# Psychographe - Creative Interactive Prototype

## Overview
Psychographe is a revolutionary projective brainstorming tool that transforms the creative process into a fluid psychographic studio. It enables users to enrich and develop initial ideas through a collaborative AI process. The application focuses on a seamless, single-page workflow: (1) Voice or text input of initial thoughts, (2) Enrichment in a psychographic lab with AI-generated prompts and creative parameterization, and (3) Final generation with precise control and saving to a public/private psychothèque. It prioritizes fluidity, real-time visualization of enriched prompts, and granular control over the creative process.

The project's vision is to foster collaborative creativity, offering a unique space for idea development and sharing. It aims to provide an accessible and engaging platform for users to explore their creative potential without competitive pressures.

## User Preferences
Preferred communication style: Simple, everyday language.
UI/UX preferences: Minimaliste mais pertinente, jolie et très fluide, facile à prendre en main avec des explications claires.

## System Architecture

### UI/UX Decisions
The application features a minimalist design with a focus on fluidity and user-friendliness. The color scheme primarily uses blue shades (#3b82f6, #2563eb, #1d4ed8, #1e40af) replacing previous greens, emphasizing consistency. The PSYCHOGRAPHE logo incorporates circular echo waves originating from the "O," with fluid animations and a luminous echo effect. Key design principles include eco-design, modern ergonomics, and a mobile-first approach. UI components from shadcn/ui are used, built on Radix UI primitives and styled with Tailwind CSS for responsiveness. Elements like custom scrollbars, smooth scroll behavior, and consistent button animations enhance the user experience.

### Technical Implementations
The frontend is a **React SPA** built with Vite and TypeScript. State management is centralized via a `SessionContext` to handle application flow, session configuration, and results. Navigation is screen-based, managed by the session context for simplicity. A modular component architecture is used for reusability. A comprehensive voice-to-text system, leveraging the Web Speech Recognition API, is integrated across all text input fields for spontaneous idea capture, featuring real-time transcription and error handling.

The backend uses **Express.js** with TypeScript (ESM format). It's structured with a clean separation between routing and business logic, designed for future API endpoint expansion.

### Feature Specifications
The core creative process is a 3-step workflow:
1.  **Initial Input**: Capture ideas via voice or text, prompted by the universal question "Qu'est-ce qui vous habite maintenant?".
2.  **Psychographic Lab**: AI-generated enriched prompts (up to 6 options, select 4) with creative parameters.
3.  **Generation & Save**: Real-time final prompt preview, AI generation, and saving to the Psychothèque.

The application includes a comprehensive **Psychothèque** (gallery system) with public/private visibility, community voting (1-5 stars), commenting, and social features. Users can download multiple psychographies as a `.zip` file containing professionally formatted `.docx` files with metadata.

The system emphasizes a **cooperative focus**, entirely removing scoring, points, badges, and competitive elements. It promotes collaborative creativity and community sharing, with simple recognition badges ("Psychographe en herbe," "Psychographe de ouf !", "Psychographe de génie!"). The Psychothèque functions as a forum with weekly Top 5, community voting, comments, and advanced sorting. A semantic visualization dashboard in the user profile displays tag network analysis, revealing creative patterns.

The "game" system has been simplified to a single-question approach with universal adaptability, offering three temporal modes (Instant Flash, Contemplation, Vocal Pur) and scaling for Solo, Duo, or Group formats. An integrated inspiration engine provides creative prompts and word associations.

### System Design Choices
An abstract storage interface (`IStorage`) is implemented for the backend, currently using an in-memory solution (`MemStorage`) for development, allowing for easy future database integration. PostgreSQL is configured as the database using **Drizzle ORM** for type-safe SQL, with migration support. Session persistence is improved with 30-day expiration and rolling renewal. Full TypeScript implementation across frontend and backend, with shared type definitions, ensures type safety.

## External Dependencies

### UI Framework and Styling
-   **React 18**: Core frontend library.
-   **Vite**: Development server and build tool.
-   **Tailwind CSS**: Utility-first CSS framework.
-   **shadcn/ui**: React component library built on Radix UI.
-   **Radix UI**: Primitive components for accessibility.
-   **Lucide React**: Icon library.

### Backend Framework
-   **Express.js**: Web application framework for Node.js.
-   **tsx**: TypeScript execution environment for development.

### Database and ORM
-   **Drizzle ORM**: Type-safe SQL ORM for PostgreSQL.
-   **@neondatabase/serverless**: Serverless PostgreSQL client.
-   **drizzle-kit**: Schema migration and introspection tools.

### Development Tools
-   **TypeScript**: Static type checking.
-   **PostCSS**: CSS processing.
-   **@replit/vite-plugin-runtime-error-modal**: Development error overlay.

### Form Handling and Validation
-   **React Hook Form**: Performant form library.
-   **@hookform/resolvers**: Validation library integration for React Hook Form.
-   **Zod**: Schema validation.

### Utility Libraries
-   **clsx**: Conditional CSS class construction.
-   **class-variance-authority**: Component variant management.
-   **date-fns**: Date manipulation utilities.
-   **nanoid**: Unique ID generation.