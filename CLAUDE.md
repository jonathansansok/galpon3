# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Galpón 3 Taller" — Sistema de gestión integral (incident/event management system). Monorepo with a NestJS backend and Next.js frontend, using MySQL via Prisma ORM. Authentication via Auth0.

## Commands

### Development (use VS Code task "Start All" or run individually)

```bash
# Backend (from backend/)
npm run start:dev        # Dev server with watch (port 3900)

# Frontend (from frontend/)
npm run dev              # Dev server (port 3000)

# Prisma Studio (from backend/)
npx prisma studio        # GUI database browser
```

### Build & Production

```bash
# Backend
npm run build && npm run start:prod

# Frontend
npm run build && npm run start
```

### Testing (backend only)

```bash
npm run test             # Unit tests (Jest)
npm run test:watch       # Watch mode
npm run test:cov         # Coverage
npm run test:e2e         # End-to-end tests
```

### Linting & Formatting

```bash
# Backend
npm run lint             # ESLint (auto-fix)
npm run format           # Prettier

# Frontend
npm run lint             # ESLint
```

### Database (from backend/)

```bash
npx prisma migrate dev --name <name>   # Create migration
npx prisma migrate deploy              # Apply migrations
npx prisma generate                    # Regenerate Prisma client
```

## Architecture

### Backend (`backend/`)

- **NestJS 10** with TypeScript, global prefix `/api`, Swagger docs at `/api`
- **Prisma ORM** with MySQL (`backend/prisma/schema.prisma` — 24 models)
- **Module-per-entity pattern**: each domain entity (impactos, agresiones, ingresos, etc.) has its own module with:
  - `controller.ts` — REST endpoints (CRUD + file upload via Multer)
  - `service.ts` — business logic using PrismaService
  - `dto/` — create/update DTOs with class-validator decorators
  - `uploads/` — disk storage for uploaded files (4 MB limit)
- **Security**: Helmet, CSRF (csrf-csrf), Cookie Parser
- **CORS**: allows `localhost:3000` and `192.168.250.220:3000`
- **Static files**: each module serves uploads via `/api/<module>/uploads/`

### Frontend (`frontend/`)

- **Next.js 14** App Router with TypeScript
- **Auth0** authentication (`@auth0/nextjs-auth0`)
- **Zustand** for client state (`useUserStore`, `usePresupuestoStore`)
- **TailwindCSS** + Flowbite-react for UI
- **TanStack Table** for data tables
- **Route structure**: `/portal/eventos/<entity>` with `/new`, `/[id]`, `/[id]/edit` subroutes
- **Frontend proxies uploads**: Next.js rewrites route to backend upload directories
- **PDF/Word/Excel generation**: jsPDF, @react-pdf/renderer, docx, xlsx
- **Maps**: Leaflet + react-leaflet, Google Maps API
- **Charts**: Chart.js via react-chartjs-2

### Key Environment Variables

- `DATABASE_URL` — MySQL connection string
- `NEXT_PUBLIC_BACKEND_URL` — Backend URL (default: `http://192.168.250.220:3900`)
- `BACKEND_PORT` — Backend port (default: 3900)
- `AUTH0_ISSUER_BASE_URL`, `AUTH0_BASE_URL` — Auth0 config

## Conventions

- All domain models share common fields: `id`, `createdAt`, `updatedAt`, `clas_seg` (ALTA/MEDIA/BAJA), location fields (`establecimiento`, `modulo_ur`, `pabellon`, `sector`), `fechaHora`, multiple image/PDF fields
- Backend controllers handle file uploads with `@UseInterceptors(FilesInterceptor)` and Multer diskStorage
- Frontend components use `"use client"` directive for interactive pages
- Type definitions for all models live in `frontend/src/types/`
- Reusable UI components in `frontend/src/components/ui/`
- The project uses Spanish for domain naming (field names, routes, UI text)
