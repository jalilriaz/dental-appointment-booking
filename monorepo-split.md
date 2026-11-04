# PLAN: Monorepo Split — Frontend & Backend Separation

**Task Slug:** `monorepo-split`
**Created:** 2026-11-04
**Status:** 🟡 PLANNING PHASE — Awaiting implementation

---

## 📋 Overview

**What:** Restructure the existing Next.js monolith into a **Turborepo monorepo** with two independent packages:
- `packages/frontend` → Next.js 16 (pages, components, public assets)
- `packages/backend` → Express.js + Prisma (all API routes as Express handlers)

**Why:** Clean separation of concerns, independent deployability, independent scaling, clearer team boundaries.

**Hard Constraint:** Zero regressions. No functionality change. No design change. Pure structural refactor.

---

## ✅ Success Criteria

| Criterion | How to Verify |
|-----------|--------------|
| `pnpm dev` starts BOTH servers | Frontend :3000 + Backend :4000 both respond |
| All 25+ API routes work on :4000 | Curl each endpoint, check responses match current |
| Frontend pages load on :3000 | Manual smoke test all pages |
| Auth (JWT, cookies) still works | Login → protected page flow works |
| Prisma DB connection works | Backend can query DB |
| Email, Google Calendar, Upstash still work | Env vars accessible in backend |
| `pnpm build` succeeds | Both packages build without errors |
| Zero design changes | Visual diff of key pages shows no diff |

---

## 🏗️ Target Architecture

```
dental-appointment-booking/          ← Turborepo root
├── turbo.json                       ← Turborepo pipeline config
├── package.json                     ← Root workspace config
├── pnpm-workspace.yaml              ← pnpm workspace definition
│
├── packages/
│   ├── frontend/                    ← Next.js 16 (port :3000)
│   │   ├── package.json
│   │   ├── next.config.ts
│   │   ├── tailwind.config.ts
│   │   ├── tsconfig.json
│   │   ├── app/                     ← Pages ONLY (no /api folder)
│   │   │   ├── (public pages)       ← /, /about, /contact, /services
│   │   │   ├── admin/               ← Admin pages
│   │   │   ├── staff/               ← Staff pages
│   │   │   ├── actions/             ← Server Actions (call backend)
│   │   │   └── layout.tsx, providers.tsx, globals.css
│   │   ├── components/              ← All components (ui, admin, shared, staff)
│   │   └── public/                  ← Static assets
│   │
│   └── backend/                     ← Express.js + Prisma (port :4000)
│       ├── package.json
│       ├── tsconfig.json
│       ├── src/
│       │   ├── index.ts             ← Express app entry point
│       │   ├── routes/              ← All migrated API route handlers
│       │   │   ├── auth.routes.ts
│       │   │   ├── appointments.routes.ts
│       │   │   ├── patients.routes.ts
│       │   │   ├── staff.routes.ts
│       │   │   ├── admin.routes.ts
│       │   │   ├── bot.routes.ts
│       │   │   ├── cron.routes.ts
│       │   │   ├── inventory.routes.ts
│       │   │   ├── notifications.routes.ts
│       │   │   ├── treatments.routes.ts
│       │   │   └── upload.routes.ts
│       │   └── lib/                 ← Copied from root /lib
│       │       ├── prisma.ts
│       │       ├── auth.ts
│       │       ├── email.ts
│       │       ├── googleCalendar.ts
│       │       └── ... (all 21 lib files)
│       └── prisma/                  ← Copied schema + migrations
│
└── .agent/                          ← Agent configs (unchanged)
```

---

## 🛠️ Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Monorepo | Turborepo | Industry standard, caches builds, parallel tasks |
| Workspace | pnpm workspaces | Already using pnpm, native support |
| Frontend | Next.js 16 (keep) | Zero change to pages/components |
| Backend | Express.js 5 | Easy migration from Next.js route handlers |
| Backend Runtime | tsx / ts-node | TypeScript without compile step in dev |
| DB ORM | Prisma (keep) | No change to schema |
| Communication | CORS + direct fetch | Frontend fetches `http://localhost:4000/api/*` |

---

## 🔗 API Communication Change

> **Critical:** All `fetch('/api/...')` calls in frontend must become `fetch('http://localhost:4000/api/...')`.

| Environment | Frontend → Backend URL |
|-------------|----------------------|
| Development | `http://localhost:4000` |
| Production | `https://api.yourdomain.com` |

**Strategy:** Use `NEXT_PUBLIC_API_URL` env var in frontend so URLs are configurable.

```
# packages/frontend/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000

# packages/backend/.env
PORT=4000
DATABASE_URL=...
JWT_SECRET=...
(all existing env vars)
```

---

## 📦 Task Breakdown

> **Priority:** P0 = blocker | P1 = core | P2 = integration | P3 = polish

---

### PHASE 1: Foundation Setup

#### TASK-01 — Initialize Turborepo Root
- **Agent:** `backend-specialist`
- **Priority:** P0 (blocker for everything)
- **Dependencies:** None
- **INPUT:** Current project root `package.json`
- **OUTPUT:**
  - Root `package.json` with `workspaces: ["packages/*"]`
  - `pnpm-workspace.yaml`
  - `turbo.json` with `dev`, `build`, `lint` pipeline
- **VERIFY:** `pnpm turbo --version` works, workspace recognized
- **ROLLBACK:** Restore original `package.json`

---

#### TASK-02 — Scaffold `packages/frontend/`
- **Agent:** `frontend-specialist`
- **Priority:** P0
- **Dependencies:** TASK-01
- **INPUT:** Current `app/`, `components/`, `public/`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`
- **OUTPUT:** `packages/frontend/` with all files moved (not copied) except `app/api/`
- **VERIFY:** `packages/frontend/package.json` exists, all page files present
- **ROLLBACK:** Move files back to root

---

#### TASK-03 — Scaffold `packages/backend/`
- **Agent:** `backend-specialist`
- **Priority:** P0
- **Dependencies:** TASK-01
- **INPUT:** Current `app/api/`, `lib/`, `prisma/`
- **OUTPUT:**
  - `packages/backend/package.json` (Express, cors, prisma deps)
  - `packages/backend/src/index.ts` (Express entry)
  - `packages/backend/src/lib/` (all lib files)
  - `packages/backend/prisma/` (schema + migrations)
- **VERIFY:** `packages/backend/package.json` valid, Prisma schema present
- **ROLLBACK:** Delete `packages/backend/`

---

### PHASE 2: Backend Migration

#### TASK-04 — Create Express Entry Point
- **Agent:** `backend-specialist`
- **Priority:** P1
- **Dependencies:** TASK-03
- **INPUT:** None (new file)
- **OUTPUT:** `packages/backend/src/index.ts`
  ```ts
  // Express app with:
  // - cors({ origin: 'http://localhost:3000' })
  // - express.json()
  // - All route files mounted at /api/*
  // - Listen on PORT env var (default 4000)
  ```
- **VERIFY:** `pnpm --filter backend dev` starts, `curl http://localhost:4000/health` returns 200
- **ROLLBACK:** Delete file

---

#### TASK-05 — Migrate Auth Routes
- **Agent:** `backend-specialist`
- **Priority:** P1
- **Dependencies:** TASK-04
- **INPUT:** `app/api/auth/login/route.ts`, `logout`, `register-request`, `forgot-password`, `reset-password`, `setup-password`, `google/route.ts`
- **OUTPUT:** `packages/backend/src/routes/auth.routes.ts`
  - Convert Next.js `export async function POST(req)` → Express `router.post('/login', handler)`
  - Cookie handling: use `res.cookie()` instead of `NextResponse cookies`
- **VERIFY:** `POST /api/auth/login` with valid creds returns JWT cookie
- **ROLLBACK:** Revert to original Next.js route files

---

#### TASK-06 — Migrate Appointment Routes
- **Agent:** `backend-specialist`
- **Priority:** P1
- **Dependencies:** TASK-04
- **INPUT:** `app/api/appointments/**`
- **OUTPUT:** `packages/backend/src/routes/appointments.routes.ts`
- **VERIFY:** `GET /api/appointments/today` returns appointments array
- **ROLLBACK:** Revert

---

#### TASK-07 — Migrate Patient, Staff, Treatment Routes
- **Agent:** `backend-specialist`
- **Priority:** P1
- **Dependencies:** TASK-04
- **INPUT:** `app/api/patients/**`, `app/api/staff/**`, `app/api/treatments/**`, `app/api/patient-treatments/**`
- **OUTPUT:** `patients.routes.ts`, `staff.routes.ts`, `treatments.routes.ts`
- **VERIFY:** CRUD operations on each entity work
- **ROLLBACK:** Revert

---

#### TASK-08 — Migrate Admin, Inventory, Notification Routes
- **Agent:** `backend-specialist`
- **Priority:** P1
- **Dependencies:** TASK-04
- **INPUT:** `app/api/admin/**`, `app/api/inventory/**`, `app/api/notifications/**`, `app/api/upload/**`
- **OUTPUT:** `admin.routes.ts`, `inventory.routes.ts`, `notifications.routes.ts`, `upload.routes.ts`
- **VERIFY:** Admin search, inventory CRUD work
- **ROLLBACK:** Revert

---

#### TASK-09 — Migrate Bot Routes
- **Agent:** `backend-specialist`
- **Priority:** P1
- **Dependencies:** TASK-04
- **INPUT:** `app/api/bot/**` (6 routes)
- **OUTPUT:** `packages/backend/src/routes/bot.routes.ts`
- **VERIFY:** Bot routes mount at `/api/bot/*`
- **ROLLBACK:** Revert

---

#### TASK-10 — Migrate Cron Routes
- **Agent:** `backend-specialist`
- **Priority:** P1
- **Dependencies:** TASK-04
- **INPUT:** `app/api/cron/**`
- **OUTPUT:** `packages/backend/src/routes/cron.routes.ts`
- **VERIFY:** Cron routes mount at `/api/cron/*`
- **ROLLBACK:** Revert

---

### PHASE 3: Frontend URL Updates

#### TASK-11 — Add API URL Environment Variable
- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Dependencies:** TASK-02
- **INPUT:** Current hardcoded `/api/` paths in frontend
- **OUTPUT:**
  - `packages/frontend/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:4000`
  - `packages/frontend/lib/api.ts` → helper: `export const API = process.env.NEXT_PUBLIC_API_URL`
- **VERIFY:** `.env.local` exists, `API` helper exports correct URL
- **ROLLBACK:** Remove .env.local, delete helper

---

#### TASK-12 — Update All fetch('/api/...') Calls
- **Agent:** `frontend-specialist`
- **Priority:** P2 (CRITICAL — zero regressions)
- **Dependencies:** TASK-11
- **INPUT:** All `fetch('/api/...')` calls in `components/`, `app/`, `app/actions/`
- **OUTPUT:** All fetch calls use `${API}/api/...`
- **STRATEGY:** Global find-replace `fetch('/api/` → `fetch(\`${API}/api/` with import added
- **VERIFY:** No hardcoded `/api/` strings remain in frontend source
- **ROLLBACK:** Revert file changes

---

#### TASK-13 — Update Server Actions
- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Dependencies:** TASK-11
- **INPUT:** `app/actions/` Server Actions
- **OUTPUT:** Server Actions call backend at `http://localhost:4000/api/...`
  > ⚠️ Note: Server Actions run server-side, can use non-public env vars
- **VERIFY:** Server Actions complete without fetch errors
- **ROLLBACK:** Revert

---

### PHASE 4: Turborepo Pipeline

#### TASK-14 — Configure turbo.json Pipeline
- **Agent:** `backend-specialist`
- **Priority:** P2
- **Dependencies:** TASK-01, TASK-04
- **INPUT:** `turbo.json` scaffold
- **OUTPUT:**
  ```json
  {
    "pipeline": {
      "dev": { "cache": false, "persistent": true },
      "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] },
      "lint": {}
    }
  }
  ```
- **VERIFY:** `pnpm dev` from root starts both servers

---

#### TASK-15 — Root Package.json Scripts
- **Agent:** `backend-specialist`
- **Priority:** P2
- **Dependencies:** TASK-14
- **INPUT:** Root `package.json`
- **OUTPUT:**
  ```json
  {
    "scripts": {
      "dev": "turbo run dev",
      "build": "turbo run build",
      "lint": "turbo run lint",
      "dev:frontend": "pnpm --filter frontend dev",
      "dev:backend": "pnpm --filter backend dev"
    }
  }
  ```
- **VERIFY:** All scripts work from root
- **ROLLBACK:** Restore original scripts

---

### PHASE 5: Environment & Config

#### TASK-16 — Split .env Files
- **Agent:** `backend-specialist`
- **Priority:** P2
- **Dependencies:** TASK-02, TASK-03
- **INPUT:** Root `.env.local` (current)
- **OUTPUT:**
  - `packages/backend/.env` → DB, JWT, email, Google, Upstash vars
  - `packages/frontend/.env.local` → `NEXT_PUBLIC_API_URL=http://localhost:4000`
- **VERIFY:** Backend loads all env vars, frontend loads API URL
- **ROLLBACK:** Restore root `.env.local`
- **⚠️ CAUTION:** Never commit `.env` files. Update `.gitignore`.

---

### PHASE 6: Verification

#### TASK-17 — End-to-End Smoke Test
- **Agent:** `qa-automation-engineer`
- **Priority:** P3
- **Dependencies:** ALL previous tasks
- **INPUT:** Running `pnpm dev` (both servers)
- **OUTPUT:** Manual + automated test results
- **VERIFY CHECKLIST:**
  - [ ] Home page loads `:3000`
  - [ ] Login works (POST to `:4000/api/auth/login`)
  - [ ] Admin dashboard loads with real data
  - [ ] Appointment booking works end-to-end
  - [ ] Walk-in registration works
  - [ ] Email sending works (check nodemailer logs)
  - [ ] `pnpm build` succeeds for both packages
  - [ ] No CORS errors in browser console
- **ROLLBACK:** Full rollback plan in TASK-18

---

#### TASK-18 — Git Safety Checkpoint
- **Agent:** `devops-engineer`
- **Priority:** P0 (do BEFORE any work)
- **Dependencies:** None (run FIRST)
- **INPUT:** Current codebase
- **OUTPUT:** Git commit `chore: snapshot before monorepo split`
- **VERIFY:** `git log --oneline -1` shows snapshot commit
- **ROLLBACK:** `git reset --hard <snapshot-hash>` restores full original

---

## ⚠️ Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Cookie auth breaks (cross-port) | High | Critical | Set `credentials: 'include'` on fetch, `cors({ credentials: true })` on backend |
| Next.js Server Actions can't reach backend | Medium | High | Use absolute URL with private env var (not `NEXT_PUBLIC_`) |
| Prisma client not generated in backend | Medium | High | Run `prisma generate` inside `packages/backend/` |
| Missing env vars in backend | Medium | High | Checklist all vars from original `.env.local` |
| pnpm hoisting conflicts | Low | Medium | Use `shamefully-hoist=true` in `.npmrc` if needed |
| CORS preflight fails for file upload | Low | Medium | Add `multipart/form-data` to CORS allowed headers |

---

## 🚦 Execution Order (Critical Path)

```
TASK-18 (Git Snapshot)
    ↓
TASK-01 (Turborepo Init)
    ↓          ↓
TASK-02      TASK-03
(Frontend)  (Backend Scaffold)
               ↓
            TASK-04 (Express Entry)
               ↓
    TASK-05 → TASK-06 → TASK-07 → TASK-08 → TASK-09 → TASK-10
    (Auth)   (Appts)   (Patients) (Admin)   (Bot)     (Cron)
               ↓
            TASK-11 → TASK-12 → TASK-13
            (Env Var)  (fetch)  (Actions)
               ↓
            TASK-14 → TASK-15 → TASK-16
            (turbo)   (scripts) (env split)
               ↓
            TASK-17 (E2E Test)
```

---

## 📊 Effort Estimate

| Phase | Tasks | Estimated Time |
|-------|-------|---------------|
| Foundation | 3 tasks | ~30 min |
| Backend Migration | 7 tasks | ~2–3 hours |
| Frontend URL Updates | 3 tasks | ~45 min |
| Pipeline Config | 2 tasks | ~20 min |
| Environment | 1 task | ~15 min |
| Verification | 2 tasks | ~30 min |
| **Total** | **18 tasks** | **~5–6 hours** |

---

## 🔄 Full Rollback Strategy

If anything breaks catastrophically:
```powershell
# Option 1: Soft rollback (per-task)
git checkout -- <specific-file>

# Option 2: Full rollback to snapshot
git reset --hard <snapshot-commit-hash>

# This restores 100% of original state
```

---

## Phase X: Verification Checklist

> 🔴 Mark `[x]` ONLY after actually running each check.

- [ ] `pnpm dev` starts both `:3000` and `:4000`
- [ ] `pnpm build` succeeds for `packages/frontend`
- [ ] `pnpm build` succeeds for `packages/backend`
- [ ] Login flow works (cookie set by `:4000`, read by `:3000`)
- [ ] Admin dashboard loads real DB data
- [ ] No CORS errors in browser DevTools
- [ ] No hardcoded `/api/` paths in frontend source
- [ ] `.env` files NOT committed to Git
- [ ] `python .agent/skills/vulnerability-scanner/scripts/security_scan.py .` → no critical issues
- [ ] `npm run lint` passes in both packages

---

## ✅ PHASE X COMPLETE
*(Fill in after implementation)*
- Lint: ⬜
- Security: ⬜
- Build: ⬜
- E2E: ⬜
- Date: ___

---

> **Next step:** Review this plan, then run `/create` or tell me to start implementation.

