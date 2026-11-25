# Implementation Plan: Dental Admin Dashboard Executive Redesign (Updated)

**Target Workspace:** `/media/loadex/DATA1/root/Jalil/dental-appointment-booking/frontend`  
**Date:** November 24, 2026  
**Status:** Approved Specifications — In Progress  
**Assigned Specialist:** `frontend-specialist`

---

## 1. Executive Summary & Design System Rules

This plan implements an all-in-one, high-density, single-screen command center for the Admin Dashboard (`app/admin/page.tsx`).

### Strict Constraints & Decisions
- **KEEP UNCHANGED**:
  - The existing left sidebar (groups, teal active state, profile card, Sign Out). No restyling. Add a desktop collapse toggle (`w-64` ↔ `w-20`).
  - Existing teal medical brand palette (`#0D9488`, `#0F766E`, `#0B1528`). Purple/violet is banned.
- **CHAIR COLUMN DECISION**:
  - The Prisma schema stores `operatory` on `Doctor`, but does **not** store an operatory/chair per `Appointment`.
  - As instructed, we use **Duration** (`treatment.durationMin`, e.g., "45 mins") and **Phone** instead of a chair column.
- **DOCTOR NAME CONSISTENCY**:
  - In PostgreSQL, the doctor and admin are named **`Dr. Sheriyaar`** (`id: "doc-sheriyaar"`).
  - All greetings, fallbacks, and profiles will consistently use **`Dr. Sheriyaar`**.
- **REMOVED AS REQUESTED**:
  - Removed circular telemetry gauges, Operatory Chair Load timeline, and Attending Surgeon on Duty badge.
  - Removed standalone "Visits completed vs Not Visiteds" KPI card (integrated directly into the status donut legend).
- **DATA SECURITY**:
  - Financial numbers (Revenue, Outstanding Balance) are strictly guarded on the server (`session.role === "ADMIN"`).
  - All numbers are derived from live Prisma database records.

---

## 2. Layout & Information Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: Global Search Box ("Search patients, appointments...") · Notification Bell · Profile Menu (Dr. Sheriyaar)     │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ SLIM WELCOME HEADER:                                                                                                   │
│ "Good afternoon, Dr. Sheriyaar" · Tuesday, Nov 24, 2026 · Shift active (12 PM – 8 PM)    [+ New walk-in] [+ New appt] │
├────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│ ROW OF 4 COMPACT KPI CARDS:                                                                                            │
│ 1. Revenue this month (+12% vs last mo)   3. Total patients (+3 new this month)                                        │
│ 2. Today's appointments (Done / Total)    4. Outstanding balance (Pending reconciliation)                              │
├───────────────────────────────────────────────────────────────────┬────────────────────────────────────────────────────┤
│ LEFT COLUMN (68% Width)                                           │ RIGHT COLUMN (32% Width)                           │
│                                                                   │                                                    │
│ 1. APPOINTMENTS & REVENUE AREA CHART                              │ 1. UPCOMING APPOINTMENTS PANEL                     │
│    - Toggle 1: Revenue vs Appointments                            │    - Mon–Sun interactive week strip date picker    │
│    - Toggle 2: Weekly vs Monthly vs Yearly                        │    - Chronological patient cards grouped by:       │
│    - Single-color teal area chart with hover tooltip              │      • Today                                       │
│                                                                   │      • Tomorrow                                    │
│ 2. CURRENT PATIENTS QUEUE TABLE                                   │      • Later this week                             │
│    - Search input + "+ Add patient" button                        │    - Time pill, patient avatar, procedure tag,    │
│    - Columns: Patient (name, phone, tag), Treatment, Date,        │      and "New patient" badge where applicable      │
│      Time, Duration (mins), Status badge, Quick Actions           │                                                    │
│    - Actions: Mark arrived / In-chair, Complete, Not Visited         │                                                    │
│    - Pagination controls (< 1 2 3 >)                              │                                                    │
├───────────────────────────────────────────────────────────────────┴────────────────────────────────────────────────────┤
│ BOTTOM ROW (50% / 50% split):                                                                                          │
│ 1. APPOINTMENT STATUS DONUT CHART                                 2. POPULAR TREATMENTS BAR CHART                      │
│    - Donut showing: Completed, Upcoming, Cancelled, Not Visited       - Top 5 dental treatments by booking volume          │
│    - Legend with counts & percentages (Done vs Missed visits)     - Clean teal horizontal bars with count & revenue    │
└────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Phased Execution Tasks

### Phase 1: Server Data Queries & Financial Security Pipeline (`app/admin/page.tsx`)
- [ ] **Task 1.1: Server Session & Role Guard**
  - Verify `session.role === "ADMIN"` server-side. Non-admins cannot read revenue or financial aggregations.
- [ ] **Task 1.2: Real Financial Aggregations & Month-over-Month Comparison**
  - Current month realized revenue (`status: "COMPLETED"`, `startTime >= currentMonthStart`).
  - Previous month realized revenue for trend calculation (`+X% vs last month`).
  - Outstanding balance calculation (`SUM(price - discount - amountPaid)` where `price > amountPaid + discount` and `status != "CANCELLED"`).
- [ ] **Task 1.3: Appointments & Patient Counts**
  - Today's appointment total, completed count, and Not Visited count.
  - Total registered patients (`role: "PATIENT"`) and new patients registered this month vs previous month.
- [ ] **Task 1.4: Chart Datasets**
  - Weekly (last 7 days / 8 weeks), Monthly (12 months of current year), and Yearly breakdown with Revenue (PKR) and Appointment counts.
- [ ] **Task 1.5: Current Patients Queue & Upcoming Schedule Datasets**
  - Fetch today's and recent active appointments with patient contact, medical alerts, isFirstVisit, treatment name, durationMin, and status.
  - Fetch upcoming appointments from today onwards for the week strip date picker.
- [ ] **Task 1.6: Status Distribution & Popular Treatments**
  - Exact counts for `COMPLETED`, `SCHEDULED` (upcoming), `CANCELLED`, and `Not_Visited`.
  - Top 5 treatments by bookings with total count and revenue.

---

### Phase 2: UI Implementation (`Header`, `Sidebar`, and `AdminExecutiveDashboard`)
- [ ] **Task 2.1: Header & Sidebar Enhancements**
  - In `components/admin/Sidebar.tsx`: Add desktop collapse toggle (`w-64` ↔ `w-20`). Fix doctor name to `Dr. Sheriyaar`.
  - In `components/admin/Header.tsx`: Add global search box, notification bell, and profile menu dropdown.
- [ ] **Task 2.2: Slim Welcome Header & 4 KPI Cards**
  - Build `AdminExecutiveDashboard.tsx` client component.
  - Greeting: "Good [morning/afternoon/evening], Dr. Sheriyaar" + formatted date + shift chip (`Shift active: 12 PM – 8 PM`).
  - Action buttons: "+ New walk-in patient" (to `/admin/walk-in`) and "+ New appointment" (to `/admin/book`).
  - 4 compact KPI cards with trend indicators:
    1. Revenue this month (`formatPKR` + vs last month %).
    2. Today's appointments (`{done} / {total} done` with progress bar).
    3. Total patients (`{total}` + new this month).
    4. Outstanding balance (`formatPKR` + pending collection).
- [ ] **Task 2.3: Chart Card (Revenue vs Appointments / Weekly vs Monthly vs Yearly)**
  - Recharts single-color teal area chart with hover tooltips and metric/range toggles.
- [ ] **Task 2.4: Current Patients Queue Table**
  - Search box + "+ Add patient" + pagination.
  - Columns: Patient info, Treatment, Date, Time, Duration (mins), Status badge, Quick Actions (`Mark arrived`, `Complete`, `Not Visited`).
- [ ] **Task 2.5: Right Column: Upcoming Appointments with Week Strip**
  - Mon–Sun interactive date strip picker.
  - Grouped cards: Today, Tomorrow, Later this week with procedure tags and "New patient" tags.
- [ ] **Task 2.6: Bottom Row: Status Donut & Popular Treatments**
  - Donut chart with status legend (completed, upcoming, cancelled, Not Visited).
  - Popular treatments bar chart.

---

### Phase 3: Verification & Quality Gate
- [ ] **Task 3.1: TypeScript Validation**
  - Run `npx tsc --noEmit` in `frontend` (0 errors).
- [ ] **Task 3.2: Viewport Sanity Check**
  - Check `http://localhost:3000/admin` on desktop and mobile viewports.
