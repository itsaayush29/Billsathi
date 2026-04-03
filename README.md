# BillSathi

BillSathi is a production-oriented monorepo with a Next.js frontend and an Express + Prisma backend for invoice, customer, subscription, and admin management.

## Apps

- `frontend`: Next.js App Router application
- `backend`: Express API, Prisma schema, and tests

## Quick Start

1. Copy `backend/.env.example` to `backend/.env`.
2. Copy `frontend/.env.example` to `frontend/.env.local`.
3. Install dependencies in the repo root with `npm install`.
4. Generate Prisma client with `npm run prisma:generate --workspace backend`.
5. Push the schema to your local database with `npm run prisma:push --workspace backend`.
6. Seed the initial admin with `npm run prisma:seed --workspace backend`.
7. Start backend and frontend in separate terminals.

## Local Commands

### Install dependencies

```powershell
cd c:\Users\Aayush Gupta\Desktop\BillSathi
npm install
```

### Backend setup

```powershell
cd c:\Users\Aayush Gupta\Desktop\BillSathi
npm run prisma:generate --workspace backend
npm run prisma:push --workspace backend
npm run prisma:seed --workspace backend
```

### Run backend

```powershell
cd c:\Users\Aayush Gupta\Desktop\BillSathi\backend
npm run dev
```

### Run frontend

```powershell
cd c:\Users\Aayush Gupta\Desktop\BillSathi\frontend
npm run dev
```

### Open Prisma Studio

```powershell
cd c:\Users\Aayush Gupta\Desktop\BillSathi\backend
npx prisma studio
```

Prisma Studio usually opens at:

```text
http://localhost:5555
```

## How To Check Database Data

### Option 1: Prisma Studio

```powershell
cd c:\Users\Aayush Gupta\Desktop\BillSathi\backend
npx prisma studio
```

### Option 2: SQL Shell (`psql`)

```sql
\l
\c billsathi
\dt
SELECT * FROM "User";
SELECT * FROM "Customer";
SELECT * FROM "Invoice";
SELECT * FROM "Payment";
```

### Option 3: pgAdmin

1. Open `pgAdmin 4`
2. Open `Servers`
3. Open your PostgreSQL server
4. Open `Databases`
5. Open `billsathi`
6. Open `Schemas`
7. Open `public`
8. Open `Tables`
9. Right click a table like `User`
10. Click `View/Edit Data` -> `All Rows`

## Production Notes

- Frontend is designed for Vercel.
- Backend and PostgreSQL are designed for Railway or a similar managed platform.
- Authentication uses HTTP-only cookies.
- In production, set `BACKEND_API_URL` on Vercel to your Railway API URL, for example `https://your-backend.up.railway.app/api`.
- In production, set `FRONTEND_URL` on Railway to your Vercel origin, for example `https://your-app.vercel.app`. Multiple origins can be provided as a comma-separated list.
- Leave `COOKIE_DOMAIN` empty unless you control the shared parent domain.
- Replace the default `JWT_SECRET` before deploying to production.
- Third-party providers use stub implementations by default.
- In local development, the frontend proxies browser API calls through `/backend-api` to avoid cross-port fetch issues.
