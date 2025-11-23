# AGENTS.md

## Build & Test Commands

- `bun dev` - Start development server (Next.js with HMR)
- `bun build` - Build for production
- `bun start` - Run production build
- `bun test` - Run all tests with Bun Test + React Testing Library
- `bun lint` - Run ESLint on src/ files
- Single test: `bun test <test-file-path>`

## Architecture

**Daily Task Planner** - Next.js 16 full-stack app for task management with SQLite persistence.

**Key Components:**
- `src/app/` - Next.js App Router (layout.tsx, page.tsx, globals.css)
- `src/components/` - React components (Sidebar, TaskList, TaskItem, Modals, UI components from shadcn/ui)
- `src/lib/` - Database setup (better-sqlite3), context providers, utilities
- `src/types/` - TypeScript type definitions
- `src/hooks/` - Custom React hooks
- `tests/` - Test files

**Database:** Better SQLite3 for local-only data storage (no external servers)

## Code Style & Guidelines

**Language:** TypeScript (ES2017 target, strict: false, JSX: react-jsx)

**Imports & Paths:**
- Use `@/*` alias for `src/*` imports (via tsconfig.json)
- Group imports: React → libraries → local utilities/types
- ESM modules throughout

**Conventions:**
- Components are `.tsx` files exported as default or named
- Prefer functional components with hooks
- Use React Hook Form + Zod for form validation
- Use Tailwind CSS + Framer Motion for styling/animations

**Naming:**
- Components: PascalCase (e.g., `TaskItem.tsx`)
- Utilities/functions: camelCase
- Constants: UPPER_SNAKE_CASE
- Database-related: singular names (Task not Tasks)

**Error Handling:**
- No explicit error boundaries defined yet; use try-catch in API routes
- Type errors caught by TypeScript strict types

**Linting:**
- ESLint enabled on src/ files with TypeScript support
- Rules: react-hooks recommended, warn on `@typescript-eslint/no-explicit-any`, allow unused vars locally
- Config: eslint.config.js (flat config format)

**Package Manager:** Bun (faster than npm/yarn, native SQLite, built-in test runner)

**CLAUDE.md Notes:** Project prefers Bun over Node.js; uses Next.js despite CLAUDE.md suggesting Bun.serve() for frontend.
