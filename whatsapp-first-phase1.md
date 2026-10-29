# Phase 1: De-Scope & Schema Cleanup (WhatsApp-First Architecture)

## Overview
Transition the application from Web-First booking to WhatsApp-First. PostgreSQL remains the single source of truth. Public booking portals and patient self-registration are de-scoped, schemas are unified, and public CTAs route to WhatsApp deep links.

---

## Tasks

### Task 1: Prisma Schema & Walk-In Model Cleanup
- [x] Remove `WalkInPatient` and `WalkInAppointment` models from `prisma/schema.prisma`.
- [x] Ensure `User` (Role `PATIENT`) and `Appointment` (`BookingSource: WALK_IN` or `WHATSAPP_BOT`) serve all patients.
- [x] Run `npx prisma db push` and `npx prisma generate`.
- [x] Refactor `app/api/admin/walk-in/route.ts` to operate entirely on `tx.user` and `tx.appointment` without referencing dropped models.
- **Verification:** Prisma schema pushed cleanly to database and Prisma client generated.

### Task 2: Remove Public Portals
- [x] Remove `app/book` directory.
- [x] Remove `app/portal` directory.
- [x] Remove `app/register` directory.
- **Verification:** Directory deletion confirmed; `/book`, `/portal`, `/register` return 404.

### Task 3: Update Public CTAs & Navigation Links
- [x] In `components/Navbar.tsx`:
  - Removed "Patient Portal" and "Book Online" web routes.
  - Added direct WhatsApp button: `https://wa.me/923145475528?text=Hi,%20I%20would%20like%20to%20book%20an%20appointment`.
  - Updated Sign In CTA to "Staff Login".
- [x] In `app/page.tsx`:
  - Replaced `/book` link with WhatsApp booking button.
- [x] In `app/services/[id]/page.tsx`:
  - Replaced `/book?treatment=...` with `https://wa.me/923145475528?text=Hi,%20I%20would%20like%20to%20book%20an%20appointment%20for%20[Treatment_Name]`.
- **Verification:** Zero dead `/book` or `/portal` links remain across public pages.

### Task 4: Restrict Authentication & Enforce Staff/Admin Only
- [x] In `app/api/auth/login/route.ts`:
  - Blocks `PATIENT` logins with HTTP 403 and message: *"Patient web portal has moved to WhatsApp. Please message us on WhatsApp at +92 314 5475528 to manage your appointments."*
- [x] In `app/login/page.tsx`:
  - Branded as "Staff & Admin Portal".
  - Added patient WhatsApp notice with a one-click chat button.
  - Removed patient test credentials, keeping only Admin & Staff.
- [x] In `middleware.ts`:
  - Removed `/portal` from `protectedUIRoutes`.
  - Redirects patients visiting `/login` to `/`.
- **Verification:** Verified via live curl tests: Patient login returns 403, Admin & Staff logins succeed with 200.

### Task 5: Build & Typecheck Verification
- [ ] Run `npx tsc --noEmit` and verify zero TypeScript errors.
- [ ] Verify dev server health.
- **Verification:** TypeScript compiles with 0 errors.
