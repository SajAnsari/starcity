# Starcity — Housing Society Management Web Application

A full-stack, enterprise-grade Housing Society Management ERP architected for **₹0 initial and ongoing hosting cost**. Built for residential cooperative housing societies, gated apartment complexes, and resident welfare associations (RWAs).

---

## 🌟 Key Features

### 1. Multi-Role RBAC & Multi-Tenant Architecture
- **Roles Supported**: Super Admin, Society Admin, Committee Member, Treasurer, and Resident.
- **Tenant Isolation**: Row-Level Security (RLS) enforced at the PostgreSQL engine level via high-performance `SECURITY DEFINER` cached helper functions.
- **Flats & Occupancy History**: Tracks owners, past/current tenants, family members, domestic staff, and vehicle parking slots.

### 2. Maintenance Billing & Dynamic UPI Payments
- **Formula Engine**: Supports Flat-Rate, Per-Sq.Ft, or Hybrid calculation (base + area rate + 2W/4W parking surcharges).
- **Zero-MDR UPI Gateway**: Scannable dynamic UPI QR code generator (`upi://pay?pa=...`) for instant resident payments directly to society bank accounts.
- **Treasurer Reconciliation Queue**: 1-click verification of resident UTR numbers and payment proof screenshots.
- **Automated Receipt Minting**: Generates official A4 society receipts (`REC-2026-XXXX`) with `window.print()` support.

### 3. Financial Accounting & Balance Sheet
- **Society Cash Book & General Ledger**: Double-entry bookkeeping with chronological running balance calculations.
- **Vendor Expense Vouchers**: Track contractor bills (Security, Electricity, Housekeeping, Lift AMC, Water pumps) with invoice attachments.
- **Audited Financial Reports**: Interactive **Recharts** visualizations (Monthly Inflow vs Outflow, Category Expense breakdown) and formal Cooperative Societies Act Balance Sheet (Parts A, B, C, D).

### 4. Helpdesk & Complaint Ticketing
- Categorized ticketing (Plumbing, Electrical, Lift, Security, Housekeeping) with priority badges (`LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`).
- Workflow state machine: `NEW` $\rightarrow$ `ASSIGNED` $\rightarrow$ `IN_PROGRESS` $\rightarrow$ `RESOLVED` $\rightarrow$ `CLOSED`.
- Staff assignment, multi-user comments thread, and resident 5-star feedback rating.

### 5. Digital Notice Board, AGM Calendar & Document Vault
- High-priority Emergency alert banners at the top of the portal.
- AGM and festival event scheduling with interactive 1-click RSVP tracking.
- Categorized document vault (Bye-laws, AGM minutes, Fire NOC, Insurance, Audit reports) with granular access control.

### 6. Zero-Cost Infrastructure & Automated Keepalive
- **₹0 Hosting Guarantee**: Next.js 14 App Router on **Vercel Hobby Tier** + managed PostgreSQL on **Supabase Free Tier**.
- **Automated Keepalive Cron**: 3-day cron schedule in `vercel.json` pinging `/api/health` to permanently eliminate the 7-day inactivity pause on Supabase free-tier databases.

---

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Backend**: Next.js Route Handlers, Server Actions
- **Database & Auth**: Supabase (PostgreSQL 16, Supabase Auth, Row Level Security, Supabase Storage)
- **Deployment**: Vercel (Edge CDN, Serverless API, Automated SSL)

---

## 🛠️ Getting Started (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/SajAnsari/starcity.git
cd starcity
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Update with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-or-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-or-secret-key
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📦 Deployment Runbook

See [`docs/DEPLOYMENT_CHECKLIST.md`](docs/DEPLOYMENT_CHECKLIST.md) for step-by-step instructions on setting up Supabase migrations and deploying to Vercel.
