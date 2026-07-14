# Mizan FE

A React-based frontend application built with Vite and TypeScript.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **UI Components**: MUI, Radix UI, shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack React Query
- **Routing**: React Router v7
- **Form Handling**: React Hook Form

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Project Structure

```
src/
├── components/    # Reusable UI components
├── pages/         # Page components
├── hooks/         # Custom React hooks
├── stores/        # Zustand state stores
├── services/      # API services and queries
└── utils/         # Utility functions
```

## Configuration

### Path Aliases

The `@` alias is configured to point to the `src` directory:

```typescript
import { Component } from '@/components/Component'
```

### Assets

SVG and CSV files can be imported directly as assets.

## Key Dependencies

| Package | Purpose |
|---------|---------|
| @mui/material | Material UI components |
| @radix-ui/* | Headless UI primitives |
| zustand | State management |
| @tanstack/react-query | Server state management |
| react-router | Client-side routing |
| react-hook-form | Form handling |
| recharts | Chart components |
| motion | Animations |
| sonner | Toast notifications |
| lucide-react | Icons |

## ESLint

The project uses ESLint with the following plugins:

- `typescript-eslint` for TypeScript rules
- `eslint-plugin-react-hooks` for React hooks rules
- `eslint-plugin-react-refresh` for React Refresh rules

Run linting:

```bash
npm run lint .
```
