# Speech Evaluation App

## Overview

This is a kid-friendly speech evaluation application built with a modern full-stack architecture. The app helps children practice pronunciation through interactive speech recording and evaluation. It features a playful design with mascot characters, achievements, and gamification elements to make learning pronunciation fun and engaging.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with custom kid-friendly design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: React hooks and TanStack Query for server state
- **Routing**: React Router for client-side navigation

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript throughout
- **Development**: Hot module replacement via Vite middleware
- **API Structure**: RESTful API with `/api` prefix routing

### Database & Storage
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema**: Shared schema definitions between client and server
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development

## Key Components

### Speech Processing
- **Audio Recording**: Browser MediaRecorder API integration
- **Real-time Audio Visualization**: Canvas-based audio level monitoring
- **Speech Analysis**: Mock evaluation system with accuracy scoring
- **File Processing**: WAV audio format conversion and handling

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Elements**: Animated mascot characters for engagement
- **Gamification**: Star ratings, achievements, and progress tracking
- **Accessibility**: ARIA labels and keyboard navigation support

### Component Structure
- **Modular Components**: Reusable UI components in `/components/ui`
- **Feature Components**: Speech-specific components like `KidsSpeechEvaluator`
- **Layout Components**: Cards, modals, and navigation elements
- **Utility Components**: Toast notifications, loading states, animations

## Data Flow

1. **User Interaction**: Child clicks record button to start speech capture
2. **Audio Processing**: Browser captures audio stream with real-time visualization
3. **Speech Analysis**: Audio data sent to mock evaluation engine
4. **Results Display**: Scores and feedback presented with animated mascot
5. **Achievement System**: Progress tracked and badges awarded for milestones
6. **Data Persistence**: User progress stored via abstract storage interface

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI component primitives
- **drizzle-orm**: Type-safe database ORM
- **react-hook-form**: Form state management
- **date-fns**: Date manipulation utilities

### Development Tools
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **@hookform/resolvers**: Form validation integration
- **class-variance-authority**: Component variant management
- **clsx**: Conditional CSS class handling

### Audio Processing
- **Browser APIs**: MediaRecorder, AudioContext, AnalyserNode
- **WAV Format**: Custom audio buffer conversion utilities
- **Real-time Visualization**: Canvas-based audio level display

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Full-stack hot module replacement
- **Database**: PostgreSQL with Drizzle migrations
- **Asset Management**: Vite handles static assets and bundling

### Production Build
- **Client Build**: Vite builds optimized React bundle
- **Server Build**: esbuild compiles Express server to ESM
- **Static Assets**: Served from `/dist/public` directory
- **Environment Variables**: Database URL and configuration

### Database Management
- **Migrations**: Drizzle Kit for schema migrations
- **Schema Sync**: `db:push` command for development
- **Type Safety**: Generated types from database schema

The application uses a modern development stack focused on type safety, performance, and maintainability while providing an engaging user experience for children learning pronunciation skills.