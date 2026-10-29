# WhatsApp & n8n Chatbot Integration Plan

## Objective
Seamlessly connect the Elite Dental Centre Next.js web application with an n8n WhatsApp AI Assistant for appointment booking, rescheduling, and cancellation, and equip the Doctor/Admin with a 1-click hybrid tool to send treatment precautions directly to patients' WhatsApp.

---

## 1. Architecture Overview
- **Single Doctor / Clinic Owner:** Dr. Jalil Riaz (Admin) operates the clinic.
- **n8n WhatsApp Bot:** Acts as the AI assistant handling all inbound patient WhatsApp conversations:
  - Checking availability: `POST /api/bot/check-availability`
  - Booking appointments: `POST /api/bot/book-appointment`
  - Rescheduling appointments: `POST /api/bot/reschedule`
  - Cancelling appointments: `POST /api/bot/cancel`
- **Security:** Endpoints guarded by `Authorization: Bearer <N8N_SECRET_KEY>`.
- **Post-Treatment Precautions:**
  - Endpoint: `POST /api/appointments/[id]/send-precautions`
  - Precaution message formatted automatically based on treatment procedure and doctor notes.
  - Hybrid Delivery:
    1. Automated background dispatch to `N8N_WEBHOOK_URL` (if configured in `.env`).
    2. Instant direct WhatsApp deep link (`https://wa.me/<phone>?text=...`) as an immediate 1-click option for the doctor in both the **Checkout Dialog** and the **Patient Details / History** screen.

---

## 2. Tasks Breakdown

### Task 1: Environment & Bot API Hardening
- [x] Configure `N8N_SECRET_KEY` and `N8N_WEBHOOK_URL` in `.env`.
- [x] Review and test `/api/bot/check-availability`, `/api/bot/book-appointment`, `/api/bot/reschedule`, and `/api/bot/cancel`.
- [x] Ensure `BookingSource: WHATSAPP_BOT` is properly assigned on bot bookings and synced to Google Calendar.

### Task 2: Post-Treatment Precautions Engine & API
- [x] Create `lib/precautions.ts` with clinically curated precautions for dental procedures (Scaling & Polish, Extractions, Root Canal, Implants, Whitening, Fillings, Braces, etc.).
- [x] Create API route `POST /api/appointments/[id]/send-precautions`:
  - Retrieves patient contact, treatment, and clinical instructions.
  - Generates polished WhatsApp precaution copy with clinic branding.
  - Dispatches to n8n webhook (if active) and returns direct `whatsappUrl`.

### Task 3: Doctor UI Integration (Checkout Dialog & Patient Profile)
- [x] Enhance `components/shared/TodayAppointments.tsx`:
  - Added `SendPrecautionsModal` triggered automatically after checkout completion.
  - Added "Precautions" action button on completed visit rows.
- [x] Enhance `app/admin/appointments/AppointmentsTable.tsx`:
  - Added `SendPrecautionsModal` triggered automatically after checkout completion.
  - Added `MessageSquareShare` precautions button in the action column for all completed appointments.
- [x] Enhance `app/admin/patients/[id]/page.tsx` & `app/staff/patients/[id]/page.tsx`:
  - Added "Care Precautions" column and `SendPrecautionsButton` on completed visits in the Treatment History table.

### Task 4: n8n Workflow Blueprint & Documentation
- [x] Documented complete n8n workflow spec, schemas, and AI prompt template in `n8n-whatsapp-setup.md`.

### Task 5: End-to-End Verification
- [x] Tested bot endpoints with Bearer auth via curl (availability check, booking, rescheduling, cancelling).
- [x] Tested precaution generator and API with real treatment procedures.
- [x] Verified phone number sanitation for `wa.me` links (`+` and `-` stripped).
- [x] Verified clean build and TypeScript types.
