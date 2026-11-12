# Centralized Booking Engine & Dynamic Slot Scheduling Plan

## 1. Executive Summary & Root Cause Analysis

### The Goal
Create a single, authoritative, race-condition-free booking engine across **all three channels**:
1. **WhatsApp Chatbot** (via n8n AI Agent)
2. **Website Booking Form** (public patient booking)
3. **Walk-In / Reception Desk** (Admin & Staff portal)

Ensure that **treatment duration** (30 min, 45 min, 60 min, 75 min, etc.) dynamically blocks the entire prospective time window across all channels and calculates next available slots accordingly.

---

## 2. Audit of Existing n8n Workflow Nodes

### Issue 1: Port Mismatch (Port 3000 vs Port 4000)
- **Current State in n8n JSON:**
  - Nodes `Check Avaiability`, `Book Appointment`, `Reschedule Appointment`, `Cancel Appointment1`, and `HTTP Request` target:
    `http://host.docker.internal:3000/api/bot/...`
- **Impact:** Port 3000 is Next.js frontend. If Next.js restarts or compiles, WhatsApp requests drop or fail with 502/504.
- **Fix:** Update all n8n node URLs directly to the backend container port:
  `http://host.docker.internal:4000/api/bot/...` (or container network `http://dental-backend:4000/api/bot/...`).

### Issue 2: Missing Treatment/Duration in `Check Avaiability`
- **Current State:**
  - `Check Avaiability` node sends `{ date, time }`.
  - Backend `bot.routes.ts` `/check-availability` hardcodes:
    `endTimeStamp.setMinutes(endTimeStamp.getMinutes() + 30);`
- **Impact:** If a patient asks to book a 60-min treatment (e.g. Whitening or RCT) at 10:30 when another appointment exists at 11:00:
  - `check-availability` only checks 10:30-11:00 and says: *"Time slot is available!"*
  - The AI Agent proceeds to book a 60-min appointment (10:30-11:30), creating a severe collision or sudden error!
- **Fix:**
  - Update n8n `Check Avaiability` parameters to pass:
    `serviceType: $fromAI('serviceType', 'Desired dental treatment name', 'string')`
  - Update `bot.routes.ts` to resolve treatment and calculate true prospective window `[startTime, startTime + durationMin]`.

### Issue 3: Reminders Node Logic Bug (`Schedule Trigger` -> `HTTP Request` -> `Send message3`)
- **Current State:**
  - Node `Send message3` uses `recipientPhoneNumber: ={{ $('WhatsApp Trigger').item.json.messages[0].from }}` and `textBody: ={{ $json.output }}`.
- **Impact:** Scheduled daily reminders fail because `WhatsApp Trigger` does not exist during a scheduled execution, and `/daily-reminders` returns an array of reminders (`$json.reminders`), not `$json.output`.
- **Fix:** Add an Item Split node or loop over `$json.reminders`, setting `recipientPhoneNumber = {{$json.phone}}` and `textBody = {{$json.message}}`.

### Issue 4: Phone Trailing Newline in `Send message2`
- **Current State:**
  - `Send message2` (post-treatment precautions) has `recipientPhoneNumber: "={{ $json.body.phone }}\n"`.
- **Impact:** Trailing newline can trigger invalid recipient errors in Meta WhatsApp Cloud API.
- **Fix:** Remove `\n` to use clean expression: `={{ $json.body.phone.trim() }}`.

---

## 3. Architecture of the Centralized Booking Engine

```
       [ WhatsApp Bot (n8n) ]      [ Website Form ]      [ Walk-in (Admin/Staff) ]
                 │                        │                         │
                 ▼                        ▼                         ▼
         /api/bot/book-appointment   /api/appointments    /api/admin/walk-in
                 │                        │                         │
                 └────────────────────────┼─────────────────────────┘
                                          ▼
                       ┌─────────────────────────────────────┐
                       │    bookingService.createAppointment │
                       │    (Inside prisma.$transaction)     │
                       └─────────────────────────────────────┘
                                          │
            ┌─────────────────────────────┼─────────────────────────────┐
            ▼                             ▼                             ▼
   1. Dynamic Duration           2. Strict Collision Check     3. Atomic Insert
   endTime = startTime +         startTime < newEndTime AND    & Google Calendar
   treatment.durationMin         endTime > newStartTime        Sync (Background)
                                 AND status != 'CANCELLED'
```

### Mathematical Conflict Guarantee
Two appointments $A$ and $B$ collide if and only if:
$$\text{Start}(A) < \text{End}(B) \quad \text{AND} \quad \text{End}(A) > \text{Start}(B)$$
By executing this inside `prisma.$transaction(async (tx) => ...)`, concurrent bookings across Web, Walk-in, and WhatsApp Bot are serialized at the database level.

---

## 4. Implementation Tasks Breakdown

### Phase 1: Database & Seed Verification
- Inspect treatments in DB to confirm realistic clinical durations (e.g. Implants = 60-75 min, RCT = 45-60 min, Scaling = 30-45 min, Consultation = 30 min).

### Phase 2: Refactor `bookingService.ts` as Single Source of Truth
- Wrap all booking operations in `prisma.$transaction`.
- Handle guest and registered patient creation/lookup with canonical phone normalization.
- Apply uniform status filter: `status: { notIn: ['CANCELLED'] }`.
- Support multi-session package linking.
- Return standardized `BookingResponse`.

### Phase 3: Route Integration & Deduplication
- **`backend/src/routes/appointments.routes.ts`**: Replace custom booking block with call to `bookingService.createAppointment()`.
- **`backend/src/routes/admin.routes.ts`**: Replace custom walk-in block with call to `bookingService.createAppointment()`.
- **`backend/src/routes/bot.routes.ts`**:
  - Update `/check-availability` to accept `serviceType` and compute dynamic end time.
  - Keep `/book-appointment` cleanly delegating to `bookingService.createAppointment()`.
  - Add `/my-appointments` endpoint for patient status lookup.

### Phase 4: Dynamic Slot Generation (`/api/appointments/availability`)
- Change slot increment loop to step by `slotDurationMin` (e.g. 30 min), evaluating prospective window `[slotStart, slotStart + treatmentDuration]`.
- Return detailed `endLabel` so the UI and patient see exact start and end times.

### Phase 5: Container Build & End-to-End Verification
- Rebuild backend Docker container: `docker compose up -d --build backend`.
- Test collision scenarios:
  1. Book 60-minute appointment at 11:00 (blocks 11:00 to 12:00).
  2. Attempt to book 11:30 via WhatsApp -> MUST BE REJECTED.
  3. Attempt to book 11:30 via Web -> MUST BE REJECTED.
  4. Attempt to book 11:30 via Walk-in -> MUST BE REJECTED.
  5. Attempt to book 12:00 -> MUST SUCCEED.

