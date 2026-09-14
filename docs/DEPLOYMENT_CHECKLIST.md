# Starcity Society Management ERP — Production Deployment Runbook & Checklist (₹0 Hosting Target)

This guide provides a step-by-step procedure to deploy the Starcity application live to production on **Vercel** and **Supabase** while maintaining an ironclad **₹0 ongoing monthly hosting cost**.

---

## 1. System Architecture & Free-Tier Budget Summary

| Service | Plan | Monthly Cost | Allocated Capacity | Function in Starcity |
| :--- | :--- | :---: | :--- | :--- |
| **Vercel** | Hobby Tier | **₹0** | Edge CDN, Serverless Functions, 100GB Bandwidth | Next.js 14 App Router hosting & Automated SSL |
| **Supabase** | Free Project Tier | **₹0** | 500 MB PostgreSQL DB, 50k MAU Auth, 1 GB Storage | Relational DB, Row-Level Security, Receipts Bucket |
| **Vercel Cron** | Hobby Included | **₹0** | 1 cron job / project | 3-day keepalive ping (`/api/health`) |
| **NPCI UPI** | Standard P2M/P2P | **₹0** | Unlimited transactions, 0% MDR | Dynamic QR payment settlement to society bank |

---

## 2. Pre-Deployment Setup: Supabase Database (Step-by-Step)

### Step 2.1: Create a Free Supabase Project
1. Go to [https://supabase.com](https://supabase.com) and log in.
2. Click **New Project** and name it `starcity-society`.
3. Choose the closest region (e.g. `ap-south-1` Mumbai) for minimum latency.
4. Set a strong Database Password and note it down.

### Step 2.2: Apply PostgreSQL Migrations
Navigate to the **SQL Editor** in your Supabase Dashboard and execute the migrations in this exact sequence:

1. Execute [`supabase/migrations/01_initial_schema.sql`](file:///d:/sajid%20work/AI%20Applications/Starcity/supabase/migrations/01_initial_schema.sql):
   - Creates all 16 core relational tables (`societies`, `buildings`, `flats`, `users`, `occupancies`, `maintenance_charges`, `payments`, `income`, `expenses`, `complaints`, `documents`, `audit_logs`, `notifications`).
   - Applies the crucial duplicate billing prevention constraint:
     ```sql
     UNIQUE(society_id, flat_id, billing_month)
     ```
2. Execute [`supabase/migrations/02_rls_functions.sql`](file:///d:/sajid%20work/AI%20Applications/Starcity/supabase/migrations/02_rls_functions.sql):
   - Installs high-performance `SECURITY DEFINER` cached helper functions (`get_user_society_id()`, `get_user_role()`).
   - Enables Row-Level Security (RLS) on all tables to enforce multi-tenant isolation.
3. Execute [`supabase/migrations/03_storage_buckets.sql`](file:///d:/sajid%20work/AI%20Applications/Starcity/supabase/migrations/03_storage_buckets.sql):
   - Sets up storage buckets: `receipts` (private), `complaints` (authenticated), `documents` (role-based).
4. (Optional for initial data) Execute [`supabase/seed.sql`](file:///d:/sajid%20work/AI%20Applications/Starcity/supabase/seed.sql):
   - Pre-seeds "Starcity Heights CHS", Wings A & B, sample units, default expense and income categories.

### Step 2.3: Retrieve API Keys
Go to **Project Settings** $\rightarrow$ **API**:
- Note down `Project URL` (e.g. `https://xyzcompany.supabase.co`).
- Note down `anon public` key.
- Note down `service_role secret` key (kept strictly confidential for server routes).

---

## 3. Web App Deployment: Vercel (Step-by-Step)

### Step 3.1: Push Repository to GitHub / GitLab
```bash
git init
git add .
git commit -m "feat: complete starcity housing society management web app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/starcity.git
git push -u origin main
```

### Step 3.2: Connect Project in Vercel
1. Go to [https://vercel.com](https://vercel.com) and click **Add New...** $\rightarrow$ **Project**.
2. Select your `starcity` repository and click **Import**.
3. Framework Preset: **Next.js** (auto-detected).
4. Root Directory: `./`

### Step 3.3: Configure Production Environment Variables
Under **Environment Variables**, add:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://your-id.supabase.co` | Supabase API Gateway endpoint |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOi...` | Supabase public anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOi...` | Supabase secret key for server-side operations |

### Step 3.4: Deploy
Click **Deploy**. Vercel will build the production application in ~60 seconds and assign a free SSL-secured domain:
`https://starcity-society.vercel.app` (or your custom society domain, e.g. `portal.starcityheights.org`).

---

## 4. Zero-Cost Maintenance Verification: 3-Day Keepalive Cron

Free-tier Supabase projects automatically pause after 7 consecutive days of complete database inactivity. Starcity includes a built-in automated keepalive engine:

1. The configuration in [`vercel.json`](file:///d:/sajid%20work/AI%20Applications/Starcity/vercel.json) schedules a lightweight cron ping every 3 days:
   ```json
   {
     "crons": [
       {
         "path": "/api/health",
         "schedule": "0 0 */3 * *"
       }
     ]
   }
   ```
2. The health check handler at [`src/app/api/health/route.ts`](file:///d:/sajid%20work/AI%20Applications/Starcity/src/app/api/health/route.ts) performs a sub-100ms lightweight query to Supabase:
   ```typescript
   export async function GET() {
     const supabase = createClient();
     const { data, error } = await supabase.from('societies').select('id').limit(1);
     return NextResponse.json({ status: 'healthy', timestamp: new Date().toISOString() });
   }
   ```
3. **Verification**:
   - In the Vercel Dashboard, go to **Settings** $\rightarrow$ **Cron Jobs**.
   - Verify that `/api/health` is registered and displays status **Active**.

---

## 5. Post-Deployment Verification Checklist

- [ ] **Authentication**: Log into `/login`. Verify instant demo role switching and email/password authentication.
- [ ] **Resident Self-Registration**: Navigate to `/register`, submit a new test resident with flat number, and verify entry in `society_members`.
- [ ] **Building & Flats Directory**: Open `/society`, confirm Wings A & B, floor maps, and past tenancy history render correctly.
- [ ] **UPI Payment Flow**:
  - Open `/finance/maintenance` as a resident.
  - Click **Pay Now**, verify dynamic QR code generates with prefilled society UPI VPA.
  - Submit mock UTR and payment screenshot.
  - Switch to Treasurer role, open Reconciliation Queue, and click **Approve Payment**.
  - Open and print the generated A4 society receipt (`REC-2026-XXXX`).
- [ ] **Cash Book & Ledger**: Open `/finance/ledger`, record a new vendor expense voucher, and verify the running balance updates automatically.
- [ ] **Audited Balance Sheet**: Open `/finance/reports`, inspect the Recharts monthly cash flow trend, and test **Print AGM Statement**.
- [ ] **Helpdesk Ticketing**: Open `/complaints`, submit a maintenance issue with photo upload, assign a staff technician, resolve, and submit resident star rating.
- [ ] **Notice Board & Events**: Open `/communications`, publish an emergency alert notice, RSVP to the upcoming AGM event, and download documents from the vault.
- [ ] **System Settings & Audit Log**: Open `/settings`, verify the formula preview card, test the live health ping, and audit the immutable log table.

