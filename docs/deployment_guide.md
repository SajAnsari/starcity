# Starcity Society Management System — ₹0 Deployment Guide

This guide walks you through setting up your free **Supabase** backend and deploying the application to **Vercel** with ₹0 hosting fees.

---

## 1. Supabase Setup (Database, Auth, Storage)

1. **Sign Up / Log In to Supabase**:
   - Go to [supabase.com](https://supabase.com/) and create a free account.
2. **Create a New Project**:
   - Project Name: `starcity-society`
   - Database Password: *(Generate and store safely)*
   - Region: Select the region closest to your society (e.g. `Mumbai (ap-south-1)`).
   - Plan: **Free** ($0 / month).
3. **Execute Database Migrations**:
   - In your Supabase Dashboard, click **SQL Editor** in the left menu.
   - Click **New query** and copy-paste the contents of:
     1. `supabase/migrations/01_initial_schema.sql` $\rightarrow$ Click **Run**.
     2. `supabase/migrations/02_rls_functions.sql` $\rightarrow$ Click **Run**.
     3. `supabase/migrations/03_storage_buckets.sql` $\rightarrow$ Click **Run**.
     4. `supabase/seed.sql` *(optional, for initial test data)* $\rightarrow$ Click **Run**.
4. **Copy API Credentials**:
   - Go to **Project Settings** $\rightarrow$ **API**.
   - Copy:
     - `Project URL` $\rightarrow$ used as `NEXT_PUBLIC_SUPABASE_URL`
     - `anon / public key` $\rightarrow$ used as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `service_role secret` $\rightarrow$ used as `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

---

## 2. Local Development Setup

1. Open your terminal in the `Starcity` directory:
   ```bash
   npm install
   ```
2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   CRON_SECRET=starcity-cron-secret-2026
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Free Deployment to Vercel

1. Push your repository to **GitHub** or **GitLab**.
2. Go to [vercel.com](https://vercel.com/) and click **Add New Project**.
3. Import your `Starcity` repository.
4. In the **Environment Variables** section, paste:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL, e.g., `https://starcity-society.vercel.app`)
   - `CRON_SECRET`
5. Click **Deploy**. Vercel will build and launch the site within 60 seconds with free HTTPS SSL.

---

## 4. Keeping Supabase Awake (7-Day Inactivity Keepalive)

The included `vercel.json` automatically schedules a cron ping to `/api/health` every 3 days. 
This lightweight request queries the database and ensures your ₹0 Supabase project never enters the 7-day inactivity pause state.

