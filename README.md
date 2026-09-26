# WorkZen Frontend

React (JavaScript) SPA for the WorkZen API. Built with [Vite](https://vite.dev/).

## Prerequisites

- Node.js 20+
- `workzen-backend` running (default `http://localhost:4000`)
- Backend `CLIENT_URL` should include `http://localhost:3000` (Vite dev server port)

## Setup

```bash
cd workzen-frontend
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |

## Project structure

```
src/
  api/              # HTTP clients per backend module (maps to /api/*)
  components/
    common/         # Shared UI primitives
    layout/         # App shell, auth shell
  constants/        # Roles, route paths, storage keys
  context/          # AuthProvider (session + memberships)
  hooks/            # useAuth
  pages/            # Route-level screens by persona
    admin/
    auth/
    employee/
    invitations/
    member/
    public/
  routes/           # React Router config, guards
  utils/            # Token storage, membership helpers
```

API integration reference: `../API_FRONTEND_INTEGRATION.md` (repo root).

## Environment

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend base URL (no trailing slash) |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (when implemented) |
