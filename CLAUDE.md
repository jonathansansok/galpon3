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

## Deployment (Producción)

### URLs de producción

| Servicio | URL | Plataforma |
|----------|-----|-----------|
| Frontend | `https://galpon3.vercel.app` | Vercel |
| Backend | `https://galpon3.onrender.com` | Render |
| Base de datos | `galpon3-mysql-galpon3.b.aivencloud.com:26483` | Aiven |
| Archivos | `https://pub-0bd8e4d879a54a60b29c7ffc695f395a.r2.dev` | Cloudflare R2 |

### 1. Cloudflare R2 — dash.cloudflare.com
- **Account ID:** `0f50c4ecf0ce79bb91967d8b2aaa6ec1`
- **Bucket:** `galpon3-uploads` (región: ENAM)
- **URL pública:** `https://pub-0bd8e4d879a54a60b29c7ffc695f395a.r2.dev`
- **S3 API endpoint:** `https://0f50c4ecf0ce79bb91967d8b2aaa6ec1.r2.cloudflarestorage.com`
- **Acceso público:** habilitado (R2.dev subdomain)
- **CORS:** GET permitido desde `http://localhost:3000` y `https://*.vercel.app`
- **API Token:** creado con permisos "Object Read & Write" solo para `galpon3-uploads`
- Para rotar credenciales: R2 → Manage R2 API Tokens → Create account API token

### 2. Aiven MySQL — console.aiven.io
- **Proyecto:** `galpon3` / **Servicio:** `galpon3-mysql`
- **Plan:** Free (1 CPU, 1GB RAM, 1GB storage) — se apaga por inactividad
- **Host:** `galpon3-mysql-galpon3.b.aivencloud.com`
- **Puerto:** `26483` / **DB:** `defaultdb` / **User:** `avnadmin`
- **SSL:** requerido — agregar `?ssl-accept=strict&sslmode=require` al DATABASE_URL
- Para ver credenciales: console.aiven.io → galpon3 → galpon3-mysql → Overview → Connection information

### 3. Render — render.com
- **Servicio:** `galpon3` (Web Service)
- **Tipo:** Docker / **Instance:** Free (duerme tras 15 min inactividad, cold start ~30s)
- **Root Directory:** `backend` / **Branch:** `main`
- **Service ID:** `srv-d70br4qa214c73e76l9g`
- Variables de entorno configuradas en Render Dashboard → galpon3 → Environment:
```
DATABASE_URL=mysql://avnadmin:<pass>@galpon3-mysql-galpon3.b.aivencloud.com:26483/defaultdb?ssl-accept=strict&sslmode=require
BACKEND_PORT=3900
NODE_ENV=production
JWT_SECRET=galpon3-jwt-secret-change-this-in-production-2024
FRONTEND_URL=https://galpon3.vercel.app
R2_ACCOUNT_ID=0f50c4ecf0ce79bb91967d8b2aaa6ec1
R2_ACCESS_KEY_ID=854cf29f1044265498859374f7d0d9a2
R2_SECRET_ACCESS_KEY=<secret>
R2_BUCKET_NAME=galpon3-uploads
```
- El Dockerfile usa `prisma db push --skip-generate --accept-data-loss` (historial de migraciones roto)

### 4. Vercel — vercel.com
- **Proyecto:** `galpon3` / **Root Directory:** `frontend` / **Branch:** `main`
- Variables de entorno configuradas en Vercel Dashboard → galpon3 → Settings → Environment Variables:
```
NEXT_PUBLIC_BACKEND_URL=https://galpon3.onrender.com
NEXT_PUBLIC_R2_URL=https://pub-0bd8e4d879a54a60b29c7ffc695f395a.r2.dev
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyAczsxXofuI3k5cXJ5DQDO9YJNOLmnN_jE
```
- Deploy automático en cada push a `main`

### Migración de archivos a R2
- Módulos migrados a Cloudflare R2 (multer-s3): `temas`, `ingresos`, `presupuestos`
- Módulos sin archivos (CRUD puro): `marcas`, `modelos`, `partes`, `piezas`, `turnos`
- Config del cliente R2: `backend/src/config/r2.config.ts`
- Helper de URLs en frontend: `frontend/src/app/utils/multimediaUrl.ts`
- multer-s3 se importa con `require()` (no `import default`) — incompatibilidad CJS/ESM
- En `update()` de services: usar `(file as any).key.split('/').pop()` (no `file.filename`, que es `undefined` con multer-s3)

### Patrón CSRF — regla obligatoria
Todos los archivos `*.api.ts` del frontend deben usar `getCsrfToken()` de `../Eventos.api` (async, cachea en sessionStorage). **Nunca usar `document.cookie`** — no funciona cross-origin (Vercel → Render).

Archivos migrados: `ingresos.api.ts`, `Temas.api.ts`, `Presupuestos.api.ts`, `Turnos.api.ts`, `Marcas.api.ts`, `admin.api.ts`

Backend CSRF: valida solo presencia del header `csrf-token` (sin comparar con cookie). Ver `backend/src/csrf/csrf.service.ts`.

Privilegios de usuario: `A1` (admin), `B1` (operador), `C1` (solo turnos). El sidebar filtra por estos valores exactos.

### Patrón anti-hidratación Zustand + SSR — regla obligatoria

Cualquier componente que lea un Zustand store (`useUserStore`, `useRepairStore`, etc.) en el render raíz **debe** usar el patrón `mounted` para evitar el error `Text content does not match server-rendered HTML`:

```tsx
const [mounted, setMounted] = useState(false);
useEffect(() => { setMounted(true); }, []);
if (!mounted) return null;
```

**Por qué:** Next.js pre-renderiza en el servidor con el store vacío (e.g. `privilege: null`, `user: null`). Si el cliente tiene valores distintos al montar, React lanza un hydration mismatch. El `return null` en servidor hace que ambos lados coincidan (nada).

**Cuándo aplicar:** En cualquier `page.tsx` o componente que:
- Condiciona el render según `privilege`, `user`, o cualquier valor de Zustand
- Muestra contenido diferente según autenticación

**Archivos con este patrón aplicado:** `frontend/src/app/page.tsx`, `frontend/src/app/portal/eventos/plazas-config/page.tsx`

## Conventions

- All domain models share common fields: `id`, `createdAt`, `updatedAt`, `clas_seg` (ALTA/MEDIA/BAJA), location fields (`establecimiento`, `modulo_ur`, `pabellon`, `sector`), `fechaHora`, multiple image/PDF fields
- Backend controllers handle file uploads with `@UseInterceptors(FilesInterceptor)` and Multer diskStorage
- Frontend components use `"use client"` directive for interactive pages
- Type definitions for all models live in `frontend/src/types/`
- Reusable UI components in `frontend/src/components/ui/`
- The project uses Spanish for domain naming (field names, routes, UI text)
