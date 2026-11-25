# Staff Book Appointment Modal & n8n WhatsApp Confirmation Plan

## Goal
1. Replace page redirects to `/staff/book` on all Staff panel booking buttons (`Book for Patient`, `+ Book Patient`, `Book New Walk-In`, `Book Walk-In`) with an in-place **Book Appointment** popup modal.
2. Support both **Existing Patient** (with live search + automatic detection & handling of ongoing `IN_PROGRESS` treatment plans) and **New Patient** walk-in registration & booking inside the modal.
3. Dispatch WhatsApp booking confirmations via **n8n sending mode**, add a dedicated `elite-dental-booking` webhook → WhatsApp Send flow to `n8n-workflow-updated.json` (after backing up the original workflow to `n8n-workflow-updated.backup.json`), and surface delivery status in the UI.

## Task Breakdown

### Phase 1: n8n Workflow Backup & Webhook Flow
- **Backup:** `n8n-workflow-updated.backup.json` (created from `n8n-workflow-updated.json` prior to edits).
- **Update `n8n-workflow-updated.json`:**
  - Add `Booking Confirmation Webhook` (`n8n-nodes-base.webhook`, `POST`, path `elite-dental-booking`).
  - Add `Send Booking WhatsApp` (`n8n-nodes-base.whatsApp`, using existing `whatsAppApi` credentials `KhC9yUkVeiZuMPVV` and `phoneNumberId`).
  - Add `Sticky Note (Booking)` and wire `Booking Confirmation Webhook` → `Send Booking WhatsApp`.

### Phase 2: Backend Booking & n8n Confirmation (`backend-specialist`)
- **`backend/src/lib/n8n.ts`:**
  - Extend `BookingWebhookPayload` with `bookedBy`, `sessionLabel`, and `isMultiSession`.
  - Distinguish event (`NEW_WALKIN_BOOKING` vs `NEW_WEBSITE_BOOKING`) and include session details in the formatted WhatsApp confirmation when continuing an ongoing treatment plan.
- **`backend/src/lib/bookingService.ts` & `backend/src/routes/admin.routes.ts`:**
  - Support optional `skipActivePlan` flag in `walkInSchema` and `CreateAppointmentInput` so staff can explicitly book a separate procedure even when a patient has an `IN_PROGRESS` plan for the same treatment.
  - Await `dispatchN8nBookingWebhook` (bounded by its 6s timeout) and include `whatsappConfirmation: { sent, error? }` in `BookingResponse` and `POST /api/admin/walk-in`.

### Phase 3: Frontend Staff Modal & Button Wiring (`frontend-specialist`)
- **`frontend/components/staff/StaffBookAppointmentModal.tsx`:**
  - Reusable modal (`Dialog`) with `Existing Patient` and `New Patient` tabs.
  - Existing Patient flow: live patient search (`/api/admin/walk-in/search`), patient dossier load (`/api/patients/:id/history`), automatic ongoing treatment plan (`IN_PROGRESS`) card with `"Continue Ongoing Treatment"` vs `"Book New / Separate Treatment"` toggle, date/time slot picker, and submission to `POST /api/admin/walk-in`.
  - New Patient flow: full walk-in intake (name, phone, age, optional CNIC, procedure, date, slot, notes) submitting to `POST /api/admin/walk-in`.
  - Confirmation state showing appointment details, session link (if any), and n8n WhatsApp confirmation status.
- **Trigger Updates:**
  - `frontend/components/staff/StaffBookAppointmentButton.tsx` for Server Component pages.
  - `frontend/app/staff/appointments/page.tsx` (`Book for Patient`).
  - `frontend/components/staff/NuraReceptionDashboard.tsx` (`+ Book Patient`, `Book New Walk-In`).
  - `frontend/app/staff/doctors/page.tsx` (`Book Walk-In`, `Book Walk-In for Dr. Shehryar`).
  - Fix `data.pagination?.total` → `data.total` in `frontend/components/walk-in/RegisteredPatientWorkspace.tsx`.

### Phase 4: Verification
- Validate JSON syntax of `n8n-workflow-updated.json`.
- Run `npx tsc --noEmit` in both `backend/` and `frontend/`.
- Run `.agent/skills/frontend-design/scripts/accessibility_checker.py` on `frontend/components/staff`.
