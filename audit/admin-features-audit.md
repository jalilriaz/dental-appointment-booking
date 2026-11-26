# Admin & Receptionist Panel Feature Audit (Single-Doctor Clinic)

## 1. Summary

| Status | Count |
| --- | --- |
| DONE | 15 |
| PARTIAL | 34 |
| MISSING | 13 |
| N/A | 0 |
| **Total** | **62** |

**Overall Readiness Score: 6.2 / 10** — Core single-doctor clinic workflows (transactional anti-double-booking, WhatsApp n8n confirmations/reminders, multi-session treatment plans, partial/installment billing, printable PKR receipts, odontogram charting, and holiday blocks) are implemented end-to-end. However, production readiness is pulled down by critical server-side RBAC gaps (unprotected Next.js Server Actions and missing role checks on a few API/RSC handlers), a silent no-op audit log (`AuditLog` model missing), hardcoded fallback data in feedback/metrics, and missing clinic finance controls (expenses, refunds, day-closing, lab tracking, and consent forms).

---

## 2. Feature Checklist (Sections A–K)

### A. Dashboard
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| Real KPIs from DB | DONE | `frontend/app/admin/page.tsx`, `AdminExecutiveDashboard.tsx`, `frontend/app/staff/page.tsx` | Queries month/prev-month revenue, today's slots, patients, outstanding balance |
| Revenue trend, status breakdown, popular treatments | DONE | `frontend/app/admin/page.tsx`, `AdminExecutiveDashboard.tsx` | Weekly/monthly/yearly charts, status pie, treatment bar rankings |
| Today's schedule & upcoming appointments | DONE | `AdminExecutiveDashboard.tsx`, `TodayAppointments.tsx`, `NuraReceptionDashboard.tsx` | Live polling + Checkout, Reschedule, Cancel, `Not_Visited` actions |
| "Needs attention" items | PARTIAL | `AdminExecutiveDashboard.tsx`, `frontend/app/admin/page.tsx` | Shows `outstandingBalance` KPI and `Not_Visited` count; no actionable queue widget for unpaid/unconfirmed items |

### B. Appointments
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| List with search & filters | DONE | `AppointmentsTable.tsx`, `appointments.routes.ts`, `appointment-search.ts` | Server + client search (name, phone, MRN, treatment, ID), status, date, procedure |
| Create manually, edit, reschedule, cancel | PARTIAL | `StaffBookAppointmentModal.tsx`, `appointments.routes.ts` | Create (`POST /api/admin/walk-in`), reschedule (`PATCH /:id/reschedule`), cancel (`PATCH /:id/status`); no general edit endpoint |
| Status flow | PARTIAL | `schema.prisma` (`ApptStatus`), `appointments.routes.ts:536` | Has `SCHEDULED`, `RESCHEDULED`, `COMPLETED`, `CANCELLED`, `Not_Visited`; no `CONFIRMED`, `ARRIVED`/`CHECKED_IN`, or `IN_PROGRESS` |
| Double-booking prevention | PARTIAL | `backend/src/lib/bookingService.ts:109-163` | Uses `pg_advisory_xact_lock` + overlap query; lacks PostgreSQL `EXCLUDE` constraint |
| Calendar view (day, week, month) | DONE | `AppointmentsCalendar.tsx:137-144` | FullCalendar with `dayGridMonth`, `timeGridWeek`, `timeGridDay` |
| Walk-in handling & queue | DONE | `admin.routes.ts:284`, `StaffBookAppointmentModal.tsx`, `TodayAppointments.tsx` | Modal walk-in intake + Today's schedule queue |
| Working hours, breaks, holidays respected | PARTIAL | `appointments.routes.ts:97-164`, `bot.routes.ts:109-185`, `ClinicHoliday` | Checks `workDayStart`/`End`, `weeklyWorkingDays`, `ClinicHoliday`; no mid-day breaks |
| Buffer time, durations, multi-session | PARTIAL | `Treatment.durationMin`, `Treatment.isMultiSession`, `PatientTreatment` | Duration & multi-session linking implemented; no buffer time field/logic |
| Waitlist & cancellation backfill | MISSING | — | No waitlist model or automated slot backfill |
| Recurring or follow-up appointments | PARTIAL | `CheckoutDialog.tsx`, `frontend/app/actions/billing.ts:255-284` | Single next follow-up can be booked during checkout; no recurring series |

### C. Patients
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| Create, edit, search, soft-delete/archive | PARTIAL | `actions/patients.ts`, `admin.routes.ts:183`, `patients.routes.ts:42` | Create & search done; `PATCH /api/patients/:id` only updates `medicalAlerts`; no full edit or soft-delete |
| Appointment & treatment history | DONE | `patients.routes.ts:69`, `PatientProfileView.tsx`, `PatientHistoryDialog.tsx` | Full visits, plans, and payments history |
| Medical history, allergies, medications, notes | PARTIAL | `User.medicalAlerts`, `ClinicalNote`, `ClinicalNoteDialog.tsx` | `ClinicalNote` stores `diagnosis`, `remarks`, `prescription`; `medicalAlerts` UI removed; no structured meds list |
| Dental chart / tooth-wise records | DONE | `OdontogramChart.tsx`, `ClinicalNote.odontogramData` | 32-tooth JSON chart stored per clinical note |
| Multi-visit treatment plans & cost estimates | DONE | `PatientTreatment`, `PlanChangeLog`, `CreateTreatmentPlan.tsx`, `patient-treatments.routes.ts` | Total cost, session count, progress, change audit log |
| Prescriptions | PARTIAL | `ClinicalNote.prescription`, `ClinicalNoteDialog.tsx:66` | Free-text field on clinical notes; no structured Rx or printable Rx slip |
| Consent forms | MISSING | — | No consent form model, signature, or UI |
| File uploads (X-rays, photos, reports) | PARTIAL | `upload.routes.ts:40` | Public disk upload (`/uploads/treatments`) for images only; no patient X-ray/report model or auth-gated storage |
| Duplicate patient detection | DONE | `User.phone @unique`, `actions/patients.ts:40-49`, `bookingService.ts:185` | Normalized phone uniqueness enforced |
| Recall & follow-up reminders | MISSING | `bot.routes.ts:445` | Only daily reminders for booked appointments; no 6-month checkup recall system |

### D. Treatments / Services
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| Create, edit, delete (soft delete if used) | PARTIAL | `treatments.routes.ts:48-120`, `TreatmentManager.tsx` | Delete returns `409` if booked; `isActive` toggle exists, no `deletedAt` soft-delete |
| Price, discounted price, duration, category | PARTIAL | `Treatment` model, `treatments.routes.ts:50-94` | `category` in schema, but `POST/PUT` & `TreatmentManager.tsx` omit category editing |
| Separate public visibility toggle | MISSING | `Treatment.isActive` | Only one `isActive` flag; no `showOnWeb` field separate from internal active state |
| Multi-session flag & session count | PARTIAL | `Treatment.isMultiSession`, `Treatment.defaultSessions` | Defined in `schema.prisma`, not editable in `TreatmentManager.tsx` or `treatments.routes.ts` |
| Add-ons or packages | MISSING | — | No add-on or bundled multi-treatment package model |

### E. Billing & Payments
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| Payment methods (Cash/Card/Bank/JazzCash/Easypaisa) | PARTIAL | `schema.prisma` (`PaymentMethod`), `CheckoutDialog.tsx` | Enum has `CASH`, `CARD`, `ONLINE` only; no `BANK_TRANSFER`, `JAZZCASH`, `EASYPAISA` |
| Partial payments, installments, balances | DONE | `PatientTreatment`, `Payment`, `RecordPayment.tsx`, `CheckoutDialog.tsx` | Tracks `totalCost`, installments, `remainingBalance`, `FinancialStatus` |
| Invoices & printable receipts | DONE | `ReceiptDialog.tsx`, `frontend/lib/receipt.ts` | Print window + itemized payment history |
| Discounts & refunds | PARTIAL | `Appointment.discount`, `CheckoutDialog.tsx`, `billing.ts` | Discounts supported; no refund model, negative payment, or refund UI |
| Daily cash summary / day closing | MISSING | — | No cash drawer opening/closing or daily reconciliation table |
| Expenses tracking & profit view | MISSING | — | No `Expense` model, endpoint, or profit calculation |
| Lab work tracking | MISSING | — | No lab order / status / lab fee model or UI |

### F. Communication
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| WhatsApp confirmation, reminders, precautions | DONE | `n8n.ts`, `precautions.ts`, `bot.routes.ts:445`, `n8n-workflow-updated.json` | Automated booking, daily reminder, and checkout precaution webhooks |
| Message templates & SMS/email fallback | PARTIAL | `backend/src/lib/email.ts`, `n8n.ts`, `precautions.ts` | Email fallback for booking/reschedule; templates hardcoded in TS, no SMS, no UI template editor |
| Notification center for staff | DONE | `notifications.routes.ts`, `Header.tsx` | Live 30s polling feed of today's bookings/checkouts/cancellations |
| Delivery or failure tracking | PARTIAL | `bookingService.ts:375-405`, `SendPrecautionsModal.tsx` | Synchronous webhook response returned at action time; no persistent `NotificationLog` table |

### G. Reports
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| Appointment, patient, revenue, treatment reports | PARTIAL | `RevenueClient.tsx`, `actions/revenue.ts` | Revenue & treatment breakdown exist; no dedicated appointment/patient retention report |
| Date range filters, CSV/PDF export | PARTIAL | `RevenueClient.tsx:123-137` | Custom date ranges + unescaped CSV export; no PDF report export |
| Revenue vs expenses (profit), aging balances | MISSING | — | No expense tracking or aging receivable report |
| Admin-only enforcement on financial reports | PARTIAL | `middleware.ts:169`, `actions/revenue.ts:6` | `/admin/revenue` URL gated by middleware; `getRevenueData` Server Action lacks auth/role check |

### H. Settings
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| Clinic info, contact, location | DONE | `SystemSettings`, `settings.routes.ts`, `SettingsForm.tsx` | Name, address, phones, email, PMDC, receipt footer |
| Working hours, breaks, holidays | PARTIAL | `SystemSettings`, `ClinicHoliday`, `SettingsForm.tsx` | Hours, working days, and holiday CRUD exist; no break windows |
| Booking rules (advance, max days, cancel, slot) | PARTIAL | `SystemSettings.slotDurationMin` | Only slot duration configurable; no advance-notice, max-days-ahead, or cancel cutoff rules |
| Public website content management | PARTIAL | `ClinicHoliday.showOnWeb`, `Treatment`, `Doctor` | Holidays/services/doctor reflected on site; no banner/copy CMS |
| WhatsApp / notification settings | PARTIAL | `SystemSettings.whatsappNumber`, `.env` | Support WhatsApp number in DB; webhook URLs/secrets in `.env` only |
| Backup & data export | MISSING | — | No database/patient JSON or full export utility |

### I. Roles, Security, Governance
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| Server-side ADMIN vs RECEPTIONIST checks | PARTIAL | `auth.middleware.ts`, `frontend/app/actions/*.ts`, `frontend/app/admin/**` | Express uses `requireRole`, but Server Actions (`billing.ts`, `revenue.ts`, `patients.ts`), `GET /api/settings`, `GET /api/appointments/:id`, `GET /api/staff/dashboard`, and 5 admin RSC pages omit role checks |
| Receptionist blocked from finance/settings/staff at API level | PARTIAL | `admin.routes.ts:38`, `staff.routes.ts:168`, `settings.routes.ts:114` | Express blocks those, but `getRevenueData` Server Action & `GET /api/settings` have no role check |
| Staff management (create, deactivate, reset pwd) | PARTIAL | `StaffManager.tsx`, `staff.routes.ts:168-283` | Create, edit, password reset, hard delete; no `isActive` soft deactivation |
| Audit log (who, what, when) | MISSING | `backend/src/lib/audit.ts:10-19` | `if ("auditLog" in prisma)` is always false (`AuditLog` model missing from `schema.prisma`) |
| Session security, pwd policy, rate limit, 2FA | PARTIAL | `backend/src/lib/auth.ts:5-8`, `rateLimit.ts`, `middleware.ts:87` | `httpOnly` JWT, bcrypt, in-memory IP rate limit; hardcoded fallback JWT secret, no 2FA, no lockout |
| Patient data privacy (logs & URLs) | PARTIAL | `logger.ts`, `patients.routes.ts:60`, `Header.tsx` | Logger redacts password/token/cookie; `patients.routes.ts:60` logs `medicalAlerts`; `?search=` exposes names/phones in URL |

### J. Receptionist Panel
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| Daily ops (today, walk-in, book, reschedule, cancel, checkout, notes) | PARTIAL | `frontend/app/staff/**`, `StaffBookAppointmentModal.tsx` | Core desk workflow works; no intermediate `ARRIVED`/`CHECKED_IN` status |
| Does NOT expose admin-only data | PARTIAL | `middleware.ts`, `Header.tsx`, `actions/revenue.ts` | UI & middleware hide admin pages; Server Action `getRevenueData` & `GET /api/appointments/:id` lack role guards |

### K. Single-Doctor Extras
| Feature | Status | Evidence (file/model) | Notes |
| --- | --- | --- | --- |
| Doctor availability toggle + auto-block & notify | PARTIAL | `Doctor.isActive`, `doctors.routes.ts:116` | Toggle updates DB, but `/api/appointments/availability` does not check `Doctor.isActive` or notify booked patients |
| Emergency / urgent appointment flag | MISSING | — | No `isEmergency` or priority field on `Appointment` |
| Post-visit patient feedback/review collection | PARTIAL | `backend/src/routes/feedback.routes.ts:21-130` | Uses in-memory `fallbackFeedback` array; no DB model or post-visit trigger |
| Before/after photo storage with consent flag | MISSING | — | No patient clinical photo model or consent flag |

---

## 3. Dummy or Hardcoded Data Found
| File | Line(s) | Description |
| --- | --- | --- |
| `frontend/app/staff/page.tsx` | 112 | Attendance rate defaults to hardcoded `94` when no completed/missed history exists |
| `frontend/app/staff/page.tsx` | 136 | `weeklyTrendMap[day].count || 1` forces minimum `1` booking on empty days |
| `backend/src/routes/staff.routes.ts` | 82, 103 | Same hardcoded `94` attendance fallback and `|| 1` weekly trend baseline |
| `frontend/app/admin/page.tsx` | 145-146 | Hardcoded fallback appointment duration (`30`) and default `94` if uncomputed (check `NuraReceptionDashboard` fallback) |
| `frontend/app/staff/doctors/page.tsx` | 40-54 | Hardcoded `DEFAULT_DOCTOR` profile fallback if API fetch fails |
| `frontend/components/appointments/AppointmentsTable.tsx` | 171 | Hardcoded `"Dr. Sheriyaar"` / `"Chair 1 · Surgical Suite A"` fallback if `apt.doctor` is null |
| `frontend/components/admin/ReceiptDialog.tsx` | 73-77, 81-84 | Hardcoded fallback clinic name, address, phones, PMDC `14820-D`, and `"Dr. Shehryar Akhtar"` |
| `frontend/components/admin/AdminExecutiveDashboard.tsx` | 143 | Default prop `doctorName = "Dr. Sheriyaar"` |
| `frontend/components/admin/Header.tsx` | 306-315, 355 | Hardcoded `"Dr. Sheriyaar"` / `"Admin · Chief Surgeon"` / `"/dr_sheriyaar.webp"` in Admin mode |
| `backend/src/routes/feedback.routes.ts` | 21-85 | Hardcoded `fallbackFeedback` array + fake stats (`averageRating: 4.9`, `totalReviews: 847`) |
| `backend/src/lib/n8n.ts` | 22-24, 54 | Hardcoded fallback clinic address, phones, and `"Dr. Sheriyaar"` |

---

## 4. Security Gaps (Missing Server-Side Role / Auth Checks)
| File & Route / Action | Issue |
| --- | --- |
| `frontend/app/actions/revenue.ts` (`getRevenueData`) | `"use server"` action has **zero** session or `ADMIN` role check; callable directly to read all clinic revenue |
| `frontend/app/actions/billing.ts` (`checkoutAppointment`) | `"use server"` action has **zero** session or `ADMIN`/`STAFF` role check |
| `frontend/app/actions/patients.ts` (`registerNewPatient`) | `"use server"` action has **zero** session or `ADMIN`/`STAFF` role check |
| `backend/src/routes/appointments.routes.ts:511` (`GET /:id`) | Uses `requireAuth` only; any authenticated `PATIENT` can read any other patient's appointment & `clinicalNotes` |
| `backend/src/routes/staff.routes.ts:27` (`GET /api/staff/dashboard`) | Uses `requireAuth` without `requireRole('ADMIN', 'STAFF')` |
| `backend/src/routes/settings.routes.ts:76` (`GET /api/settings`) | Unauthenticated; exposes all `ClinicHoliday` (including private `reason` / `showOnWeb: false`) & `receiptFooter` |
| `backend/src/routes/appointments.routes.ts:437` (`POST /api/appointments`) | Uses `optionalAuth`; unauthenticated callers should not be allowed to pass `patientId` or `newPatient` |
| `frontend/app/admin/{services,staff,patients,patients/[id],settings,revenue}/page.tsx` | Server Components rely only on `middleware.ts` without in-page `session.role === "ADMIN"` verification |
| `backend/src/lib/auth.ts:5-8` & `frontend/lib/auth.ts:5-8` | Hardcoded fallback JWT signing key `"development-fallback-secret-key-at-least-32-chars"` if env var missing |
| `backend/src/lib/audit.ts:10-19` | Audit logging silently does nothing because `AuditLog` model is missing from `schema.prisma` |
| `backend/src/routes/feedback.routes.ts:89` (`POST /api/feedback`) | Unauthenticated + mutates in-memory array only |

---

## 5. Schema Gaps (`backend/prisma/schema.prisma`)
- **`AuditLog` model missing:** Needed by `backend/src/lib/audit.ts` (`userId`, `action`, `targetId`, `details`, `ipAddress`, `createdAt`).
- **`User.isActive` & `User.deletedAt` missing:** Needed to deactivate staff accounts and archive/soft-delete patients without breaking FK relations.
- **`Treatment.showOnWeb` & `Treatment.deletedAt` missing:** Needed to separate public website visibility from internal active status and support soft-deletion.
- **`PaymentMethod` enum incomplete:** Missing `BANK_TRANSFER`, `JAZZCASH`, `EASYPAISA` (currently only `CASH`, `CARD`, `ONLINE`).
- **`Refund` / `Payment.type` & `Expense` & `LabOrder` models missing:** Needed for refunds, clinic expense tracking (profit), daily cash closing (`DailyClosing`), and dental lab work tracking.
- **`ConsentForm` & `PatientFile` / `BeforeAfterPhoto` models missing:** Needed for signed consents, auth-gated X-rays/reports, and consented before/after photos.
- **`WaitlistEntry` & `RecallReminder` & `NotificationLog` models missing:** Needed for cancellation backfill, 6-month checkup recalls, and WhatsApp/email delivery tracking.
- **`SystemSettings` booking rule fields missing:** Missing `breakStart`, `breakEnd`, `advanceNoticeMin`, `maxBookingDaysAhead`, `cancellationCutoffHours`, `bufferMin`.
- **`Appointment.isEmergency` & `Appointment.updatedAt` missing:** Needed for urgent flagging and accurate modification timestamps; also `Appointment` lacks DB-level `EXCLUDE` constraint for overlap prevention.
- **`Feedback` model missing:** Currently `feedback.routes.ts` stores reviews in memory.

---

## 6. Prioritized Roadmap

| Tier | Item | Effort | Files / Models Touched |
| --- | --- | --- | --- |
| **P0** | Add server-side auth & `ADMIN`/`STAFF` role checks to all Server Actions & RSC pages | S | `frontend/app/actions/{revenue,billing,patients}.ts`, `frontend/app/admin/*/page.tsx` |
| **P0** | Fix Express RBAC gaps (`GET /api/appointments/:id`, `GET /api/staff/dashboard`, `GET /api/settings`, `POST /api/appointments`) | S | `backend/src/routes/{appointments,staff,settings}.routes.ts` |
| **P0** | Fail closed if `JWT_SECRET_KEY` is missing in production; remove fallback secret | S | `backend/src/lib/auth.ts`, `frontend/lib/auth.ts` |
| **P0** | Add `AuditLog` model so `logAudit` persists security, payment, and staff changes | S | `schema.prisma` (`AuditLog`), `backend/src/lib/audit.ts`, `admin.routes.ts`, `billing.ts` |
| **P0** | Restore `medicalAlerts` visibility on doctor clinical view & appointment safety warning | S | `PatientProfileView.tsx`, `ClinicalNoteDialog.tsx`, `TodayAppointments.tsx` |
| **P1** | Add `PaymentMethod` options (`JAZZCASH`, `EASYPAISA`, `BANK_TRANSFER`) + `Refund` & `DailyClosing` | M | `schema.prisma`, `CheckoutDialog.tsx`, `billing.ts`, `ReceiptDialog.tsx` |
| **P1** | Add `Expense` model & Revenue vs. Expense profit report + escaped CSV / printable PDF | M | `schema.prisma` (`Expense`), `actions/revenue.ts`, `RevenueClient.tsx` |
| **P1** | Secure patient file/X-ray uploads & before/after photos behind auth + `ConsentForm` | L | `schema.prisma` (`PatientFile`, `ConsentForm`), `upload.routes.ts`, `PatientProfileView.tsx` |
| **P1** | Add `User.isActive` (staff deactivation/patient archive) & wire `Doctor.isActive` into availability + patient alerts | M | `schema.prisma`, `staff.routes.ts`, `doctors.routes.ts`, `appointments.routes.ts` |
| **P1** | Add `NotificationLog` delivery tracking & 6-month recall reminders via n8n | M | `schema.prisma` (`NotificationLog`, `RecallReminder`), `n8n.ts`, `bot.routes.ts` |
| **P2** | Add `LabOrder` tracking, `WaitlistEntry` cancellation backfill, and `Appointment.isEmergency` | L | `schema.prisma`, `appointments.routes.ts`, `AppointmentsTable.tsx` |
| **P2** | Expose `Treatment.category`, `showOnWeb`, `isMultiSession`, `defaultSessions` & booking rules in UI | M | `schema.prisma`, `treatments.routes.ts`, `TreatmentManager.tsx`, `SettingsForm.tsx` |
| **P2** | Persist `Feedback` in PostgreSQL & remove hardcoded `94` / `|| 1` dashboard fallbacks | S | `schema.prisma` (`Feedback`), `feedback.routes.ts`, `staff/page.tsx`, `staff.routes.ts` |

---

## 7. Items Unsure About & Why
1. **Production deployment env vars (`JWT_SECRET_KEY`, `N8N_SECRET_KEY`):** Cannot inspect production server secrets; unclear if fallback secrets in `auth.ts` and `cron.routes.ts` are overridden in production.
2. **Database migrations vs `db push` history:** `backend/prisma/migrations/` contains renamed `Not_Visited` edits directly inside historical migration SQL files; unclear whether production DB uses `prisma migrate deploy` or `prisma db push`.
3. **Admin Reception/Doctor role intent on `ClinicalNoteDialog`:** `POST /api/appointments/:id/notes` restricts clinical notes to `ADMIN` (`requireRole('ADMIN')`), while `/staff/appointments` renders `AppointmentsTable` for `STAFF` too—unclear if receptionist should have read-only note access only (current) or also write permissions.
