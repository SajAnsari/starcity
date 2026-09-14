import Link from 'next/link';
import { 
  Building2, 
  ShieldCheck, 
  Receipt, 
  Wrench, 
  Bell, 
  FileText, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100">
      {/* Top Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Starcity</span>
              <span className="ml-1.5 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700 border border-blue-200">V1</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              Sign In to Portal
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-16 text-center lg:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-medium text-blue-700 mb-6">
            <CheckCircle2 className="h-4 w-4 text-blue-600" />
            Zero Hosting Cost Architecture • Powered by Next.js & Supabase
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Smarter, Transparent <br className="hidden sm:inline" />
            <span className="text-blue-600">Housing Society Management</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            A unified web portal for residents, managing committees, and treasurers. Streamline maintenance dues, track offline & UPI receipts, resolve complaints, and access society bylaws securely.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 transition"
            >
              Access Society Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 text-left">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 mb-4">
                <Receipt className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Maintenance & UPI</h3>
              <p className="mt-2 text-sm text-slate-600">
                Automated monthly bills, instant UPI QR payment, proof upload, and 1-click treasurer reconciliation.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 mb-4">
                <Wrench className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Helpdesk Ticketing</h3>
              <p className="mt-2 text-sm text-slate-600">
                Residents raise issues with photos; committee assigns staff, tracks SLAs, and confirms resolutions.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-4">
                <Bell className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">Notice Board & Events</h3>
              <p className="mt-2 text-sm text-slate-600">
                Broadcast emergency announcements, schedule AGMs, and keep all residents informed instantly.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600 mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-slate-900">PostgreSQL RLS Security</h3>
              <p className="mt-2 text-sm text-slate-600">
                Strict database-level multi-tenancy. Every flat&apos;s financial records are locked and visible only to authorized users.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-7xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Starcity Society Management. Open Source & Zero-Cost Architecture.</p>
          <div className="flex items-center gap-6">
            <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full border">
              V1 Architecture Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

