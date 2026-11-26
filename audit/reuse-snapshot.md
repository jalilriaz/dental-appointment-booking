# Admin & Staff Reusability Snapshot (Phase 0)

## 1. Duplicated Logic, Components, Queries & Zod Schemas
| Category | Duplication Found | Locations |
| --- | --- | --- |
| **Utilities (19 files)** | Identical copies in frontend & backend | `frontend/lib/{auth,phone,validation,utils,appointment-status,booking-utils,time-slots,timezone,precautions,googleCalendar,patientCode,types}.ts` vs `backend/src/lib/*` |
| **Zod Schemas** | Inline schemas instead of shared entities | `actions/billing.ts:28`, `BookingForm.tsx:45`, `routes/{staff,patients,settings,admin,auth,appointments,doctors}.routes.ts` vs `lib/validation.ts` |
| **Dashboard Queries & Fallbacks** | `94` attendance & `\|\| 1` trend math + Prisma metrics duplicated | `frontend/app/staff/page.tsx:39-136` & `backend/src/routes/staff.routes.ts:27-105`; `frontend/app/admin/page.tsx:75-212` |
| **Clinic/Doctor Constants** | Hardcoded `"Dr. Sheriyaar"`, clinic address, phones, PMDC `14820-D` | `ReceiptDialog.tsx`, `Header.tsx`, `AdminExecutiveDashboard.tsx`, `AppointmentsTable.tsx`, `staff/doctors/page.tsx`, `n8n.ts` |
| **Status Badges** | Mixed `<StatusBadge>` vs inline `statusColors`/`statusConfig` | `StatusBadge.tsx`, `TodayAppointments.tsx:338`, `PatientHistoryDialog.tsx:458`, `AppointmentsCalendar.tsx` |
| **Treatment CRUD** | Overlapping service/treatment managers | `components/admin/TreatmentManager.tsx` (808L) & `components/admin/ServiceManager.tsx` (352L) |
| **Book / Walk-In UI** | Duplicate booking & registration flows | `StaffBookAppointmentModal.tsx` (940L), `RegisterPatientDialog.tsx` (293L), `DeskBookingClient.tsx` (219L), `WalkInRegistration.tsx` |

## 2. Top 10 Files Over 150 Lines & Suggested Split
| # | File | Lines | Suggested Split |
| --- | --- | --- | --- |
| 1 | `components/admin/settings/SettingsForm.tsx` | 1498 | `ClinicInfoForm`, `HoursBreaksForm`, `HolidayManager`, `useSettingsMutation` |
| 2 | `components/admin/AdminExecutiveDashboard.tsx` | 1442 | `KpiStrip`, `RevenueChartCard`, `CurrentPatientsTable`, `UpcomingRail`, `StatusDonut` |
| 3 | `components/appointments/AppointmentsTable.tsx` | 1406 | `AppointmentsFilterBar`, `AppointmentRow`, `AppointmentDetailDialog`, `useAppointmentFilters` |
| 4 | `components/admin/patients/PatientProfileView.tsx` | 1288 | `PatientHeaderCard`, `PatientVisitsTab`, `PatientPlansTab`, `PatientLedgerTab` |
| 5 | `backend/src/routes/appointments.routes.ts` | 957 | Split `availability`, `booking`, `status/reschedule`, `clinical-notes` controllers |
| 6 | `components/staff/StaffBookAppointmentModal.tsx` | 940 | `PatientLookupStep`, `SlotPickerStep`, `ConfirmBookingStep`, `useWalkInBooking` |
| 7 | `components/admin/TreatmentManager.tsx` | 808 | `ServicesTable`, `ServiceFormDialog`, `ServiceFilters`, `useServiceCrud` |
| 8 | `components/staff/NuraReceptionDashboard.tsx` | 685 | Reuse shared `DashboardHeader`, `QueueList`, `TrendCard` (props hide finance) |
| 9 | `components/admin/ReceiptDialog.tsx` | 671 | `lib/services/receiptBuilder.ts` + compact `ReceiptPreviewDialog` |
| 10 | `components/admin/Header.tsx` | 627 | Extract `DoctorProfileMenu`, `NotificationBell` (merge `AdminNotifications`), `lib/logout` |

## 3. Screens Built Twice (Admin vs Staff)
| Screen | Admin Route | Staff Route | Gap / Consolidation Target |
| --- | --- | --- | --- |
| **Dashboard** | `app/admin/page.tsx` -> `AdminExecutiveDashboard` | `app/staff/page.tsx` -> `NuraReceptionDashboard` | Separate UIs & data shapes; unify via shared dashboard widgets + `can(role, ...)` |
| **Sidebar** | `components/admin/Sidebar.tsx` (433L) | `components/staff/StaffSidebar.tsx` (~130L) | Separate nav components; unify with role-filtered nav config |
| **Book / Walk-In** | `app/admin/{book,walk-in}/page.tsx` | `app/staff/book/page.tsx` + `StaffBookAppointmentModal` | Merge into shared `DeskBookingClient` / `AppointmentFormDialog` |
| **Doctors** | `app/admin/doctors/page.tsx` | `app/staff/doctors/page.tsx` (368L) | Staff page reimplements view & `DEFAULT_DOCTOR` fallback |
| **Patients** | `app/admin/patients/{page,[id]/page}.tsx` | `app/staff/patients/{page,[id]/page}.tsx` | Near-identical wrappers; consolidate page loader + permission prop |
| **Appointments** | `app/admin/appointments/page.tsx` (123L) | `app/staff/appointments/page.tsx` (135L) | Shares `AppointmentsTable`, duplicates server Prisma loader & role prop |
