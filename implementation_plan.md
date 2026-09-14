# Implementation Plan: Starcity Society Management Web Application (V1 Refined)

A modern, full-featured, zero-cost Society Management Web Application designed for residential housing societies, apartment complexes, and gated communities.

Built using **Next.js (App Router)** hosted on **Vercel** with a managed **Supabase** backend (**PostgreSQL 16**, **Supabase Storage**, **Supabase Auth**, and **Realtime Engine**), ensuring 100% free hosting with enterprise-grade performance, multi-tenant security, and zero vendor lock-in.

---

## 1. System Overview & Technology Stack (₹0 Budget Target)

| Layer | Technology | Free Tier Allowance | Purpose in Starcity |
| :--- | :--- | :--- | :--- |
| **Framework** | **Next.js 14/15 (TypeScript)** | Free (Hobby) | Unified full-stack framework (React Server Components, Server Actions, Route Handlers) |
| **UI & Styling** | **Tailwind CSS + Lucide Icons + shadcn/ui** | Open Source | Responsive, clean UI optimized for mobile, tablet, and desktop screens |
| **Form Validation** | **React Hook Form + Zod** | Open Source | Type-safe form validation for resident onboarding, complaints, and bill payments |
| **Charts & Metrics** | **Recharts** | Open Source | Income vs Expense, collection rates, open complaints dashboards |
| **Web Hosting** | **Vercel** | Free Hobby Tier | Global Edge CDN, automated Git deployments, instant SSL, zero server maintenance |
| **Database** | **Supabase PostgreSQL 16** | 500 MB Free | Relational data integrity, ACID compliance, past data storage, Row-Level Security (RLS) |
| **File Storage** | **Supabase Storage** | 1 GB Free | Payment receipts, gate pass QR codes, maintenance photos, society bye-law PDFs |
| **Auth & RBAC** | **Supabase Auth** | 50,000 MAU Free | Secure JWT auth, session management, role claims (**Super Admin, Society Admin, Committee, Treasurer, Resident**) |
| **Live Updates** | **Supabase Realtime** | Included in Free | Instant notifications for announcements, gate alerts, and emergency broadcasts |
| **Scheduled Tasks** | **Vercel Cron & Supabase `pg_cron`** | Included in Free | Automated 1st-of-month maintenance dues generation & 7-day keepalive ping |

---

## 2. Roles & Access Control Matrix (RBAC + Row-Level Security)

Access is enforced at both the UI layer (Next.js middleware) and the database layer (Supabase PostgreSQL Row-Level Security):

| Feature / Module | Super Admin | Society Admin | Committee Member | Accountant / Treasurer | Resident |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Application & Multi-Society Setup** | Full Control | No Access | No Access | No Access | No Access |
| **Society Settings & Config** | Full Control | Full Control | View Only | View Only | No Access |
| **Buildings, Flats & Occupancies** | Full Control | Full Control | View / Audit | View Only | View Own Flat |
| **Maintenance Bill Generation** | Full Access | Full Access | View Reports | **Manage / Generate** | View & Pay Own |
| **Payment Reconciliation (Offline/UPI)** | Full Access | Full Access | View Only | **Approve / Reject** | Submit Proof & UTR |
| **Income & Expense Ledgers** | Full Access | Full Access | View Only | **Manage & Ledger** | No Access |
| **Financial Balance Sheet & Reports** | Full Access | Full Access | View Reports | **Full Reports** | View Own Ledger |
| **Helpdesk & Complaints** | Oversee | Oversee | **Assign & Resolve** | View Only | Create & Rate Own |
| **Announcements & Events** | Manage | **Approve & Publish** | **Publish Ops** | View | View Public |
| **Society Documents & Bylaws** | Full Control | Full Control | Manage Docs | Financial Docs | View Permitted |
| **Immutable System Audit Logs** | Full Access | Full Access | View (Read-Only) | No Access | No Access |

---

## 3. Core Modules & V1 Refinements

### 3.1. Flat, Building & Occupancy Management (History Model)
- **Hierarchy**: `societies` $\rightarrow$ `buildings` (Wings/Towers) $\rightarrow$ `flats` (with Flat Number, Floor, Area sq.ft, Ownership Type).
- **Occupancy Model**: Users are connected through an `occupancies` table:
  - `type`: `OWNER` or `TENANT`
  - `start_date` and `end_date` (allowing full historical tracking of who lived when).
  - Multi-flat ownership support (one owner can own multiple flats in the same society and switch contexts).
  - Owner vs. Tenant permissions split: Owner sees financial dues & AGM documents; Tenant can log complaints & view day-to-day notices.
- **Family Members & Staff**: Registered family members and domestic helpers linked to flat.

### 3.2. Maintenance Engine & Payment Reconciliation
- **Flexible Calculation Engine**:
  - `billing_type`: `FLAT_RATE` (e.g. ₹2,500/flat), `PER_SQFT` (e.g. ₹3.50 × 850 sq.ft), or `HYBRID` (base + per sq.ft + parking).
  - `due_date_day` (e.g. 10th of every month) and `late_fee_amount`.
  - **Duplicate Prevention Constraint**: `UNIQUE (society_id, flat_id, billing_month)` prevents accidental double billing.
- **UPI QR Code & 2-Step Reconciliation**:
  - Society UPI ID stored in settings (`upi_id`).
  - Resident screen shows clickable/scannable UPI link with prefilled society VPA and amount.
  - Resident submits payment: Mode (`UPI`, `BANK_TRANSFER`, `CASH`, `CHEQUE`), Reference/UTR number, and payment screenshot uploaded to Supabase Storage.
  - Bill enters `PENDING_APPROVAL` status.
  - Treasurer reviews screenshot and UTR in a dedicated **Reconciliation Queue** $\rightarrow$ Clicks **Approve**.
  - Status updates to `PAID`, receipt number is assigned, and a downloadable PDF receipt is issued.

### 3.3. Unified Financial Accounting & Audit Trail
- **Automatic Income Linking**: Approved maintenance payments automatically reflect in society income reports (no duplicate manual entry required).
- **Expenses & Vouchers**: Track vendor payments, electricity bills, security contractor wages, repairs with invoice attachments.
- **Financial Balance Sheet**:
  $$\text{Closing Balance} = \text{Opening Balance} + \text{Maintenance Collections} + \text{Other Income} - \text{Expenses}$$
- **Immutable Audit Trail**: `audit_logs` records every critical change (who changed what, old value vs new value, timestamp).

### 3.4. Complaints & Helpdesk
- Categories: Plumbing, Electrical, Cleaning, Security, Parking, Lift, Water, Common Area.
- Workflow: `NEW` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`.
- Photo attachments stored in Supabase Storage (`complaint-attachments` bucket).
- Resident rating & closure confirmation.

### 3.5. Announcements, Events & Document Vault
- Notices with priority (`NORMAL`, `IMPORTANT`, `EMERGENCY`).
- Emergency banners highlighted at the top of the resident dashboard.
- Society Document Vault (Registration Certificate, Bye-laws, AGM Minutes, Fire Safety NOC).

---

## 4. Performance & Reliability Refinements

1. **High-Performance RLS Helper Functions**:
   Instead of expensive subqueries on every row, use cached `SECURITY DEFINER` functions:
   ```sql
   CREATE OR REPLACE FUNCTION get_user_society_id() 
   RETURNS UUID STABLE SECURITY DEFINER AS $$
     SELECT society_id FROM society_members 
     WHERE user_id = auth.uid() AND status = 'ACTIVE' LIMIT 1;
   $$ LANGUAGE sql;
   ```
2. **Supabase 7-Day Inactivity Keep-Alive**:
   Automated lightweight health check route `/api/health` triggered every 3 days by Vercel Cron or GitHub Action to ensure the free database never pauses.
3. **Automated Billing via Vercel Cron / `pg_cron`**:
   Runs on the 1st of every month to generate upcoming maintenance dues for all active flats.

---

## 5. Project Directory Structure (Next.js Route Groups)

```
starcity/
├── package.json
├── tsconfig.json
├── next.config.mjs
├── tailwind.config.ts
├── vercel.json                     # Vercel cron configuration for monthly dues & keepalive
├── supabase/
│   ├── migrations/
│   │   ├── 01_initial_schema.sql   # Core tables, foreign keys, unique constraints
│   │   ├── 02_rls_functions.sql    # SECURITY DEFINER helper functions & RLS policies
│   │   └── 03_storage_buckets.sql  # Receipts, documents, complaint photos storage rules
│   └── seed.sql                    # Initial seed data for test societies and demo accounts
├── src/
│   ├── middleware.ts               # Supabase session refresh & role route guards
│   ├── app/
│   │   ├── layout.tsx              # Root layout (Inter font, Providers, Toast alerts)
│   │   ├── page.tsx                # Landing & login redirect
│   │   ├── (auth)/                 # Public auth route group
│   │   │   ├── login/page.tsx
│   │   │   └── forgot-password/page.tsx
│   │   ├── (portal)/               # Protected dashboard route group
│   │   │   ├── layout.tsx          # Dynamic sidebar (filtered by role), top bar, society selector
│   │   │   ├── dashboard/page.tsx  # Dynamic dashboard (Resident vs Admin/Treasurer metrics)
│   │   │   ├── society/            # Admin: Buildings, Flats, Residents, Staff
│   │   │   ├── finance/            # Admin & Treasurer: Maintenance, Reconciliation, Income, Expenses, Reports
│   │   │   ├── complaints/         # Shared: Ticket raising, assignment, resolution
│   │   │   ├── communications/     # Announcements, Events, Documents
│   │   │   ├── my-flat/            # Resident: My flat, family members, payment history
│   │   │   └── settings/           # Society settings, UPI configuration, profile
│   │   └── api/
│   │       ├── cron/generate-bills/
│   │       ├── health/             # Supabase keepalive ping
│   │       └── reports/export-pdf/
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components (Button, Card, Dialog, Table, Badge, Form)
│   │   ├── layout/                 # Sidebar, Header, UserMenu
│   │   ├── finance/                # UpiQrModal, PaymentProofUpload, ReconcileTable
│   │   └── complaints/             # TicketCard, StatusBadge, CommentThread
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts           # Browser client
│       │   ├── server.ts           # Server component / Server Action client
│       │   └── middleware.ts       # Middleware session client
│       ├── types/database.types.ts # TypeScript database types
│       └── utils.ts
```

---

## 6. Phase-by-Phase Implementation Plan

### Phase 1: Project Setup & Database Schema (CURRENT PHASE)
1. **Initialize Project Skeleton**:
   - Next.js 14/15 App Router with TypeScript, Tailwind CSS, Lucide Icons, and shadcn/ui primitives.
   - Configure Supabase SSR client (`@supabase/ssr`, `@supabase/supabase-js`).
2. **Complete PostgreSQL Database Migrations**:
   - Write `supabase/migrations/01_initial_schema.sql` covering all tables:
     - Core: `societies`, `buildings`, `flats`, `users`, `society_members`, `occupancies`, `family_members`.
     - Finance: `maintenance_charges`, `payments`, `income_categories`, `income`, `expense_categories`, `expenses`.
     - Communication & Helpdesk: `announcements`, `events`, `documents`, `complaint_categories`, `complaints`, `complaint_comments`, `complaint_attachments`.
     - Governance & Audits: `audit_logs`, `notifications`.
   - Write `supabase/migrations/02_rls_functions.sql`:
     - Fast `SECURITY DEFINER` functions: `get_user_society_id()`, `get_user_role()`.
     - Multi-tenant RLS policies for every table ensuring ironclad tenant isolation.
   - Write `supabase/migrations/03_storage_buckets.sql`:
     - Buckets: `receipts` (private), `complaints` (authenticated), `documents` (role-checked).
   - Write `supabase/seed.sql`:
     - Test society: "Starcity Heights".
     - Demo buildings (Wings A, B) and sample flats (A-101, A-102, B-201).
     - Test accounts for all 5 roles (`admin`, `president`, `treasurer`, `committee`, `resident`).

### Phase 2: Authentication & Multi-Role Navigation Shell
- Implement Supabase Auth login with session persistence.
- Create role-aware middleware in `src/middleware.ts`.
- Build responsive portal shell (Sidebar with role filtering, Topbar with society details, User profile).

### Phase 3: Society & Resident Management
- CRUD for Buildings, Flats, and Occupancy history.
- Resident profile and family member management.
- Multi-flat switcher for owners.

### Phase 4: Maintenance Engine & UPI Payment Reconciliation
- Maintenance charge generator (Flat rate & Per sq.ft).
- UPI QR modal for instant payment.
- Payment proof upload & Treasurer 1-click reconciliation queue.
- Auto-generated receipt view.

### Phase 5: Income, Expenses & Financial Reports
- Income & Expense voucher recording with invoice uploads.
- Monthly closing balance calculation & Recharts financial summaries.
- PDF / CSV ledger export.

### Phase 6: Helpdesk Ticketing & Operations
- Resident complaint filing with photos.
- Committee assignment, status transitions, and resident rating.

### Phase 7: Announcements, Documents & Audit Log
- Notice board with emergency alerts.
- Document Vault for society bylaws and AGM minutes.
- Immutable audit log viewer for administrators.
- Automated Vercel Cron keepalive & billing generator configuration.

