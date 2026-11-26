# Phase 3 Checklist (Design System & Dashboard Redesign)

- [x] Sidebar permanently open on desktop (`w-64`); mobile slide-over drawer kept.
- [ ] Shared primitives & helpers (`lib/format.ts`, `lib/constants/status.ts`, `lib/data/{clinic,dashboard}.ts`, `lib/services/appointmentStatus.ts`, `components/admin/shared/*`).
- [ ] Security: `getDashboardData(role)` enforces `can(role, "revenue:read")` on server; `STAFF` never runs financial queries; `getRevenueData` rejects `STAFF`.
- [ ] Status transitions (`ARRIVED`, `IN_PROGRESS`, `COMPLETED`, `Not_Visited`, `CANCELLED`) unified in one server action/service with `requireActionRole`, transition validation, and `AuditLog`.
- [ ] Asia/Karachi (`UTC+5`) date helpers in `lib/format.ts` (`today`, week strip, month boundaries).
- [ ] "Needs attention" queue (unpaid balances, tomorrow unconfirmed `SCHEDULED`/`RESCHEDULED` without `NotificationLog` `SENT`, recent `Not_Visited`).
- [ ] Hardcoded sweep: 0 hits for `"Sheriyaar"`, `"Shehryar"`, `"14820"`, `"94"`, `"|| 1"`, `"Chair 1"`, `"fallbackFeedback"` across admin, staff, shared, `ReceiptDialog`, `AppointmentsTable`, `Header`, `n8n`.
- [ ] `showOnWeb: true` + `deletedAt: null` enforced on public pages, `/api/treatments`, availability, and bot routes; past appts/receipts/history retain archived treatments.
- [ ] Unified `ClinicDashboard` (< 150 lines/file) with 100% parity (`Checkout`, `Reschedule`, `Cancel`, `No-show`, `Arrived`, `Start`, live polling, walk-in modal) for `/admin` & `/staff`; `"Today's patients"` default + date/status filters + `Phone`.
- [ ] Refactored `/admin/services` (`ServicesTable` default + grid toggle, category, `showOnWeb`, multi-session, soft delete).
- [ ] Verified: `tsc --noEmit`, grep 0 hits, STAFF isolation test, and desktop (`1366px`) + mobile (`390px`) screenshots.
