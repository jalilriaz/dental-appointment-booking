# Multi-Session Treatments Implementation Plan
## Elite Dental Centre — Comprehensive Technical Specification

> **Status:** Pending User Approval  
> **Target Stack:** Next.js 16 (App Router), Prisma ORM, PostgreSQL, n8n WhatsApp Bot  
> **Key Constraint:** Multi-session treatments (e.g., German Implant Kit: Rs 80,000 package paid in installments) must maintain an ongoing clinical plan across visits. Appointments are strictly single sessions; treatments are the multi-session parents.

---

## 1. Executive Architecture Summary

### Core Principles
1. **Separation of Visit vs Plan**:
   - `Appointment` represents a discrete chairside slot/session (`status = COMPLETED`).
   - `PatientTreatment` represents the overarching clinical treatment plan (`clinicalStatus = IN_PROGRESS | COMPLETED | DISCONTINUED`).
2. **Payment via `Payment` Table Only**:
   - Financial ledger entries live in the `Payment` table (`Payment.date`).
   - Total paid and remaining balance are derived dynamically (`totalCost - sum(payments.amount)`), never stored as redundant denormalized counters.
3. **No `price = 0` Signals**:
   - Linked sessions are identified **strictly** by the foreign key `Appointment.patientTreatmentId`, never by checking if `price === 0`.
   - `plannedFee` is an optional session estimate; it is not a billed charge and not an earned revenue figure.
4. **Testing Identity Decoupling (`BOT_IDENTIFY_MODE`)**:
   - Testing mode (`"typed"`): Matches patient by Patient Code (preferred) or typed phone. Never auto-picks; asks for disambiguation if collisions exist. Never renames patients on incoming chat.
   - Production mode (`"sender"`): Identifies patient strictly by WhatsApp message metadata sender phone.
5. **Reversibility & Data Integrity**:
   - Additive schema migrations only.
   - Legacy `status` column on `PatientTreatment` is retained until Phase 3 verification is complete.
   - Zero deletion or unconfirmed merging of patient records.

---

## 2. Phase 0 — Security, Safety & Foundation Fixes

### Objectives
Fix critical security backdoors, timezone inconsistencies, phone format collisions, and credential generation before touching multi-session logic.

### Files to Modify / Create
| Action | File Path | Scope |
| :--- | :--- | :--- |
| **CREATE** | `lib/auth-bot.ts` | Constant-time bearer token authorization. Throws 500 if `process.env.N8N_SECRET_KEY` is missing/empty. |
| **CREATE** | `lib/phone.ts` | `normalizePhone(raw: string): string` standardizing Pakistani numbers to `+923xxxxxxxxx`. |
| **CREATE** | `lib/timezone.ts` | Asia/Karachi timezone helpers (`getKarachiDate()`, `isSundayInKarachi()`, `getKarachiDayBoundaries()`). |
| **CREATE** | `scripts/check-duplicate-phones.ts` | Read-only scan reporting duplicate `User` accounts grouped by `normalizePhone()`. No modifications. |
| **MODIFY** | `app/api/bot/check-availability/route.ts` | Enforce `auth-bot.ts`; use Karachi timezone for Sunday & time checks. |
| **MODIFY** | `app/api/bot/book-appointment/route.ts` | Enforce `auth-bot.ts`; use `normalizePhone()`; empty upsert update (never overwrite patient name); unguessable password hash; Karachi timezone. |
| **MODIFY** | `app/api/bot/reschedule/route.ts` | Enforce `auth-bot.ts`; use `normalizePhone()`; Karachi timezone. |
| **MODIFY** | `app/api/bot/cancel/route.ts` | Enforce `auth-bot.ts`; use `normalizePhone()`. |
| **MODIFY** | `app/api/bot/daily-reminders/route.ts` | Remove `?secret=` query fallback; enforce `auth-bot.ts` header check; use `normalizePhone()`. |
| **MODIFY** | `app/api/appointments/route.ts` | Use `normalizePhone()`; random unguessable password for auto-created users; Karachi timezone. |
| **MODIFY** | `app/api/admin/walk-in/route.ts` | Use `normalizePhone()`; random unguessable password for auto-created users; Karachi timezone. |

### Step-by-Step Implementation
1. **Timing-Safe Auth (`lib/auth-bot.ts`)**:
   - Read `process.env.N8N_SECRET_KEY`. If undefined, empty, or whitespace, return HTTP 500 (`"N8N_SECRET_KEY not configured on server"`).
   - Use `crypto.timingSafeEqual(Buffer.from(token), Buffer.from(configuredKey))` after matching length to prevent timing attacks.
   - Deprecate and remove all fallback keys (e.g., `"elite-dental-n8n-bot-secret-key-2026"`).
2. **Canonical Phone (`lib/phone.ts`)**:
   - Strip all non-digit characters except leading `+`.
   - Strip leading `0092` -> `92`, `0` -> `92`, `+92` -> `92`.
   - Validate format matches `/^923\d{9}$/`.
   - Return canonical format: `+923xxxxxxxxx`.
3. **Asia/Karachi Timezone (`lib/timezone.ts`)**:
   - Use `Intl.DateTimeFormat` with `timeZone: "Asia/Karachi"` to determine local day of week (Sunday = 0), current date, and slot boundaries.
4. **Read-Only Duplicate Scanner (`scripts/check-duplicate-phones.ts`)**:
   - Query all users with `phone IS NOT NULL`.
   - Group by `normalizePhone(phone)`.
   - Print collision table: `Canonical Phone | User IDs | Names | Created Dates`.
5. **Auto-Created Patient Security**:
   - Replace hardcoded bcrypt hash of `"Patient123!"` with a random 32-byte hex crypto string hashed with bcrypt, making auto-created patient accounts unguessable until password reset.

---

## 3. Phase 1 — Database Schema & Reversible Migration

### Objectives
Define database models and enums for multi-session treatment plans, session tracking, and audit change logs without breaking existing views.

### Schema Modifications (`prisma/schema.prisma`)
```prisma
enum ClinicalStatus {
  IN_PROGRESS
  COMPLETED
  DISCONTINUED
}

enum FinancialStatus {
  UNPAID
  PARTIALLY_PAID
  FULLY_PAID
}

model Treatment {
  // Existing fields retained: id, name, durationMin, price, discountedPrice, description, instructions, isActive, imageUrl, category
  isMultiSession   Boolean @default(false)
  defaultSessions  Int     @default(1)

  appointments      Appointment[]
  patientTreatments PatientTreatment[]
}

model PatientTreatment {
  id               String          @id @default(uuid())
  patientId        String
  patient          User            @relation(fields: [patientId], references: [id])
  treatmentId      String
  treatment        Treatment       @relation(fields: [treatmentId], references: [id])
  
  totalCost        Int
  totalSessions    Int             @default(1)
  
  // New lifecycle enums
  clinicalStatus   ClinicalStatus  @default(IN_PROGRESS)
  financialStatus  FinancialStatus @default(UNPAID)
  
  // Legacy status column retained during transition
  status           TreatmentStatus @default(ONGOING)
  
  startDate        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
  
  appointments     Appointment[]
  payments         Payment[]
  changeLogs       PlanChangeLog[]

  @@index([patientId])
  @@index([clinicalStatus])
}

model Appointment {
  // Existing fields retained
  patientTreatmentId String?
  patientTreatment   PatientTreatment? @relation(fields: [patientTreatmentId], references: [id])
  
  // New multi-session tracking fields
  sessionNumber      Int?
  sessionLabel       String?
  plannedFee         Int?             // Expected installment for this session (NOT a billing charge)

  payments           Payment[]

  @@index([patientTreatmentId])
  @@index([startTime])
}

model PlanChangeLog {
  id                 String           @id @default(uuid())
  patientTreatmentId String
  patientTreatment   PatientTreatment @relation(fields: [patientTreatmentId], references: [id], onDelete: Cascade)
  changedByUserId    String?
  changedByUser      User?            @relation(fields: [changedByUserId], references: [id])
  field              String           // "totalCost" | "totalSessions" | "clinicalStatus" | "plannedFee"
  oldValue           String
  newValue           String
  createdAt          DateTime         @default(now())

  @@index([patientTreatmentId])
}
```

### Migration & Backfill Strategy
1. **Generate Migration**: Run `npx prisma migrate dev --create-only --name add_multi_session_treatment_plans`.
2. **Backfill SQL in Migration File**:
   - `clinicalStatus`: Default all existing `PatientTreatment` rows to `IN_PROGRESS`. If legacy `status = 'COMPLETED'`, set `clinicalStatus = 'COMPLETED'`.
   - `financialStatus`:
     - Compare `totalCost` with sum of existing linked `Payment` records:
       - `sum == 0` -> `UNPAID`
       - `sum >= totalCost` -> `FULLY_PAID`
       - `sum > 0 AND sum < totalCost` -> `PARTIALLY_PAID`
   - Existing `Appointment`: Update existing linked appointments to set `sessionNumber = 1` where `patientTreatmentId IS NOT NULL`.
3. **Seed Update (`prisma/seed.ts`)**:
   - Set `isMultiSession = true` on: German Implant Kit, American Implant Kit, Korean Implant Kit, Metal Braces, Ceramic Braces, Invisible Aligners, Single Canal RCT, Multi Canal RCT, Porcelain Veneer, Lumineers.
   - Retain default duration 30 min. (Emit report list of treatments needing duration review).

---

## 4. Phase 2 — Shared Centralized Booking Service

### Objectives
Consolidate all appointment creation across web, walk-in, and WhatsApp into a single transaction-safe service (`lib/bookingService.ts`).

### Files to Create / Modify
| Action | File Path | Scope |
| :--- | :--- | :--- |
| **CREATE** | `lib/bookingService.ts` | Centralized booking engine and plan querying helpers. |
| **MODIFY** | `app/api/appointments/route.ts` | Refactor `POST` to delegate to `createAppointment()`. |
| **MODIFY** | `app/api/admin/walk-in/route.ts` | Refactor `POST` to delegate to `createAppointment()`. |
| **MODIFY** | `app/api/bot/book-appointment/route.ts` | Refactor `POST` to delegate to `createAppointment()`; preserve exact output JSON. |

### API Signature & Invariants (`lib/bookingService.ts`)
```ts
export interface CreateAppointmentInput {
  // Patient identifier (one required)
  patientId?: string;
  newPatient?: {
    name: string;
    phone: string;
    email?: string;
    dateOfBirth?: string;
  };
  
  treatmentId: string;
  startTime: Date;
  durationMin?: number;
  bookedBy: "WEBSITE" | "WALK_IN" | "WHATSAPP_BOT";
  notes?: string;
  
  // Multi-session plan linking (optional)
  patientTreatmentId?: string;
  sessionLabel?: string;
  plannedFee?: number;
}

export interface BookingResult {
  appointment: Appointment & { treatment: Treatment; patient: User };
  patientCode: number | null;
  patientName: string;
  runPostCommit: () => Promise<void>;
}
```

### Invariant Rules
1. **Standalone Booking (`patientTreatmentId` undefined)**:
   - Sets `price = treatment.price`. (Fixes bot bug where price was defaulted to 0).
   - Generates `patientCode` for new patients.
2. **Linked Booking (`patientTreatmentId` present)**:
   - Verifies `patientTreatment` exists, belongs to the patient, and `clinicalStatus === 'IN_PROGRESS'`.
   - Counts existing linked sessions: `activeCount = count(status != CANCELLED AND status != NO_SHOW)`.
   - Validates `activeCount < totalSessions`.
   - Auto-assigns `sessionNumber = activeCount + 1`.
   - Never creates a new treatment plan and never bills a catalog price.
   - Treatment ID on appointment may differ from the plan's treatment (e.g., "Implant Crown Fitting" linked to "German Implant Kit").
3. **Transaction & Post-Commit**:
   - Runs in provided `tx` or creates `prisma.$transaction`.
   - Zero network side-effects inside the transaction.
   - `runPostCommit()` executes:
     - Google Calendar event creation (try/catch unawaited).
     - Email confirmation (if patient has email).
     - Webhook notification to n8n for WhatsApp confirmation.
4. **Helper Functions**:
   - `getActivePlansForPatient(patientId)`: Returns `IN_PROGRESS` plans.
   - `getPlanSummary(patientTreatmentId)`: Returns `{ totalCost, totalPaid, remainingBalance, totalSessions, completedSessions, bookedSessions, remainingSessions, sessions: [...] }`.

---

## 5. Phase 3 — Multi-Session Checkout Engine

### Objectives
Refactor checkout in `CheckoutDialog.tsx` and `app/actions/billing.ts` to complete individual appointment visits without prematurely marking multi-session plans as finished.

### Files to Modify
| Action | File Path | Scope |
| :--- | :--- | :--- |
| **MODIFY** | `app/actions/billing.ts` | `checkoutAppointment(...)`: Atomic plan creation/updating, financial status computation, inline next session booking. |
| **MODIFY** | `components/shared/CheckoutDialog.tsx` | UI overhaul: linked plan awareness, payment method selector, remaining balance enforcement, inline next-session booking. |

### Checkout Workflow Specification
1. **Single-Visit Treatment (e.g., Scaling or Whitening)**:
   - Behavior remains fast and seamless.
   - If `totalSessions === 1`, marks appointment `COMPLETED` and plan `clinicalStatus = COMPLETED`.
2. **Session 1 of Multi-Session Treatment**:
   - In `CheckoutDialog.tsx`: Displays field for `totalSessions` (pre-filled with `treatment.defaultSessions`) and optional `plannedFee`.
   - In `billing.ts`: Creates `PatientTreatment` with `totalSessions`, `clinicalStatus = 'IN_PROGRESS'`.
   - Records payment (if collected > 0).
   - Shows inline "Schedule Session 2" section.
3. **Session 2+ (Linked Sessions)**:
   - `CheckoutDialog.tsx` detects `patientTreatmentId`.
   - Hides "Billed Price" and "Discount" inputs.
   - Displays Plan Banner: `Package Total: Rs 80,000 | Paid: Rs 25,000 | Remaining: Rs 55,000 | Session 2 of 4`.
   - "Paid Today" defaults to empty; capped strictly at `remainingBalance`.
   - Select payment method: `CASH`, `CARD`, `ONLINE`.
4. **Atomic Next Session Booking**:
   - Doctor/receptionist can enter Date, Time Slot, and Session Label (e.g. "Abutment Placement") right inside checkout.
   - Calls `bookingService.createAppointment` within the **same** transaction.
   - If booking fails, the entire checkout and payment rolls back.
5. **Plan Completion Rule**:
   - Paying in full (`remainingBalance === 0`) sets `financialStatus = FULLY_PAID`, but **leaves `clinicalStatus = IN_PROGRESS`** if sessions remain.
   - Plan clinical status becomes `COMPLETED` only if `totalSessions === 1` OR doctor/staff clicks explicit "Mark Treatment Complete" button (which requires `remainingBalance === 0`).
   - "Discontinue Plan" sets `clinicalStatus = DISCONTINUED`.

---

## 6. Phase 4 — Receptionist & Admin Plan Management Desks

### Objectives
Equip front-desk receptionists and admin doctors with full CRUD capabilities over treatment plans, audit logs, catalog fee structures, and unbooked plan reminders.

### Files to Create / Modify
| Action | File Path | Scope |
| :--- | :--- | :--- |
| **CREATE** | `app/api/patient-treatments/[id]/route.ts` | `PATCH`: Edit `totalCost`, `totalSessions`, or `clinicalStatus`. Rejects `totalCost < totalPaid`. Writes to `PlanChangeLog`. |
| **CREATE** | `app/api/patient-treatments/[id]/sessions/route.ts` | `POST`: Add unbooked session to active plan. |
| **CREATE** | `app/admin/services/fee-structure/page.tsx` | Fee structure table: price, multi-session flag, default sessions. Admin-only edit mode. |
| **CREATE** | `app/staff/services/page.tsx` | Read-only fee structure catalog for receptionists. |
| **MODIFY** | `app/admin/patients/[id]/page.tsx` & `app/staff/patients/[id]/page.tsx` | Render Plan Ledger, Session Breakdown Table (Session #, Label, Date, Status, Planned Fee, Paid, Method, Recorder), and Audit Log modal. |
| **MODIFY** | `components/admin/WalkInRegistration.tsx` | Show "Continue Active Plan" prompt when existing patient with `IN_PROGRESS` plan is selected. |
| **MODIFY** | `app/api/appointments/availability/route.ts` | Accept `durationMin` parameter for custom-length follow-ups. |
| **CREATE** | `components/admin/UnscheduledPlansCard.tsx` | Reception dashboard card listing patients with active plans having no upcoming session booked. |

### Security & Invariants
- Server-side role enforcement on every API route (`ADMIN` or `STAFF`).
- Writing clinical notes remains strictly restricted to `ADMIN`.
- Lowering `totalCost` below the sum of recorded payments is blocked with HTTP 400.
- Every change to `totalCost`, `totalSessions`, or `clinicalStatus` records `changedByUserId`, old value, and new value in `PlanChangeLog`.
- Rescheduling an appointment retains `patientTreatmentId`, `sessionNumber`, and `sessionLabel`.
- Cancelled or No-Show appointments do not count toward completed sessions; the plan stays `IN_PROGRESS`.

---

## 7. Phase 5 — Clinical Visibility & Queue Badges

### Objectives
Ensure doctors and receptionists immediately recognize ongoing plans, session numbers, and remaining balances directly from daily operational views.

### Files to Modify
| Action | File Path | Scope |
| :--- | :--- | :--- |
| **MODIFY** | `components/shared/TodayAppointments.tsx` | Add badge: `German Implant Kit · Session 2/4 · Bal: Rs 55,000`. Sum daily revenue from `Payment` table by `Payment.date`. |
| **MODIFY** | `app/admin/appointments/AppointmentsTable.tsx` | Add multi-session badge and filter by Treatment Plan. |
| **MODIFY** | `components/shared/PatientHistoryDialog.tsx` | Render active plans, per-session progress, payment ledger, and clinical diagnosis/Rx. |
| **MODIFY** | `app/api/patients/[id]/history/route.ts` | Expand payload to include patient treatments, payments, balances, and full notes. |

---

## 8. Phase 6 — Financial Ledger & Revenue Realignment

### Objectives
Migrate all revenue accounting and projection logic to discrete `Payment` records and active plan balances.

### Files to Modify
| Action | File Path | Scope |
| :--- | :--- | :--- |
| **MODIFY** | `app/actions/revenue.ts` | Calculate realized revenue strictly from `Payment` table (`Payment.date`). Project revenue using `remainingBalance` of active plans. Add Outstanding Receivables KPI. |
| **MODIFY** | `app/admin/revenue/page.tsx` | Display "Outstanding Treatment Balances" metric and accounts receivable ledger. |

### Accounting Rules
1. **Realized Revenue**:
   - `sum(Payment.amount)` where `Payment.date` falls within the selected date range.
   - Eliminates the bug where revenue was backdated to `Appointment.startTime`.
   - Eliminates double-counting between appointment checkouts and standalone installments.
2. **Projected Revenue**:
   - Scheduled standalone appointments: Count `treatment.price`.
   - Scheduled plan sessions: Count **`0`** (to prevent inflating projections by package price on every session).
   - Plus: Sum of `remainingBalance` across all `IN_PROGRESS` patient treatment plans.
   - `plannedFee` is an advisory installment target; it is never tallied as earned revenue.

---

## 9. Phase 7 — WhatsApp Bot Integration with `BOT_IDENTIFY_MODE`

### Objectives
Enable WhatsApp booking, rescheduling, and plan inquiry while accommodating the developer single-number testing environment.

### Testing Mode vs Production Mode (`BOT_IDENTIFY_MODE`)
- **`BOT_IDENTIFY_MODE="typed"` (Default / Testing)**:
  - Bot asks for Patient Code (e.g. `1001`) or typed phone number in the chat conversation.
  - If a typed phone matches multiple patient accounts or plans, the bot returns the list and asks the user to specify:
    `"Multiple records found for this number: 1) Ali Khan (Code 1001), 2) Sara Khan (Code 1002). Please reply with your Patient Code."`
  - Never auto-picks; never overwrites an existing user's name.
- **`BOT_IDENTIFY_MODE="sender"` (Production)**:
  - Reads `senderPhone` directly from WhatsApp webhook payload metadata.
  - Transparent to the patient.

### Endpoints to Create / Enhance
1. **`POST /api/bot/my-plans` (NEW)**:
   - Identifies patient per `BOT_IDENTIFY_MODE`.
   - Returns active plans: `{ plans: [{ id, treatmentName, sessionProgress: "Session 2 of 4", unbookedSessions: 2 }] }`.
   - **Zero financial details or currency amounts returned over WhatsApp.**
2. **`POST /api/bot/book-appointment` (ENHANCE)**:
   - Accepts optional `patientTreatmentId`.
   - Delegates to `bookingService.createAppointment`.
   - Rejects booking into `COMPLETED` or `DISCONTINUED` plans.
3. **`PATCH /api/bot/reschedule` & `PATCH /api/bot/cancel` (ENHANCE)**:
   - If patient has multiple upcoming scheduled visits, returns appointment list for patient disambiguation.
4. **`GET /api/bot/plan-followups` (NEW)**:
   - Returns `IN_PROGRESS` plans with unbooked sessions where the last completed visit was > 7 days ago, enabling automated n8n WhatsApp check-in reminders.

---

## 10. Execution Discipline & Rules of Engagement

1. **Wait for Approval**: No code changes will occur until you reply with approval of this plan.
2. **Phase Isolation**: At the end of every phase, I will report:
   - Files changed / created
   - Functional & behavioral differences
   - Manual test steps and exact verification output
   - **STOP** and wait for your explicit `"continue"` command before starting the next phase.
3. **Zero Data Loss**: All Prisma migrations will be verified reversible; existing seed and test patients will remain completely accessible.
4. **API Backward Compatibility**: All existing keys in `/api/bot/*` responses will remain intact for n8n.
