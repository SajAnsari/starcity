import Link from 'next/link';
import { 
  Building, 
  Receipt, 
  Clock, 
  AlertCircle, 
  PlusCircle, 
  ArrowUpRight, 
  QrCode, 
  ShieldAlert,
  Calendar
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Emergency Notice Banner */}
      <div className="flex items-start gap-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm">
        <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm uppercase tracking-wider text-amber-700">Notice</span>
            <span className="text-xs text-amber-600">• Sep 27, 2026</span>
          </div>
          <h4 className="font-semibold text-amber-900 mt-0.5">Upcoming Annual General Meeting (AGM) 2026</h4>
          <p className="text-sm text-amber-800 mt-1">
            The AGM is scheduled for Sunday, September 27th at 10:30 AM in the Clubhouse. All flat owners are requested to attend.
          </p>
        </div>
      </div>

      {/* Greeting & Top Stats */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Society Dashboard</h2>
          <p className="text-sm text-slate-500">Welcome to Starcity Heights Management Portal</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/finance/maintenance"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <QrCode className="h-4 w-4" />
            Pay Maintenance
          </Link>
          <Link
            href="/complaints"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <PlusCircle className="h-4 w-4 text-slate-500" />
            Raise Ticket
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Flats */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Units</span>
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <Building className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">42</span>
            <span className="ml-2 text-xs font-medium text-emerald-600">95% Occupied</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Wings A & B across 7 floors</p>
        </div>

        {/* Monthly Collection */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sep Collections</span>
            <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
              <Receipt className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">{formatCurrency(102500)}</span>
            <span className="ml-2 text-xs font-medium text-emerald-600">82% Paid</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">₹22,500 pending collection</p>
        </div>

        {/* Pending Approval / Reconcile */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">UPI Approvals</span>
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">3</span>
            <span className="ml-2 text-xs font-medium text-amber-600">Pending Review</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Treasurer verification queue</p>
        </div>

        {/* Active Complaints */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Open Tickets</span>
            <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-3xl font-bold text-slate-900">2</span>
            <span className="ml-2 text-xs font-medium text-indigo-600">1 In Progress</span>
          </div>
          <p className="mt-1 text-xs text-slate-500">Avg resolution: 24 hours</p>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: My Maintenance & Quick Actions */}
        <div className="space-y-6 lg:col-span-2">
          {/* Current Flat Status Card */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b pb-4">
              <div>
                <h3 className="font-bold text-slate-900">Flat A-101 Summary</h3>
                <p className="text-xs text-slate-500">Primary Resident • 2BHK (850 sq.ft)</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                All Dues Cleared
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-4">
              <div>
                <span className="text-xs text-slate-500">Monthly Maintenance</span>
                <p className="text-lg font-bold text-slate-900">{formatCurrency(2975)}</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Due Date</span>
                <p className="text-lg font-bold text-slate-900">10th Sep 2026</p>
              </div>
              <div>
                <span className="text-xs text-slate-500">Last Receipt</span>
                <p className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer">
                  #REC-2026-0819 (PDF)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link
                href="/finance/maintenance"
                className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                View Complete Billing History
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link
              href="/complaints"
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center hover:bg-slate-50 transition"
            >
              <AlertCircle className="h-6 w-6 text-indigo-600 mb-2" />
              <span className="text-xs font-semibold text-slate-800">Complaints</span>
            </Link>
            <Link
              href="/communications"
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center hover:bg-slate-50 transition"
            >
              <Calendar className="h-6 w-6 text-emerald-600 mb-2" />
              <span className="text-xs font-semibold text-slate-800">Events & AGM</span>
            </Link>
            <Link
              href="/finance/ledger"
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center hover:bg-slate-50 transition"
            >
              <Receipt className="h-6 w-6 text-amber-600 mb-2" />
              <span className="text-xs font-semibold text-slate-800">Ledger View</span>
            </Link>
            <Link
              href="/society"
              className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-4 text-center hover:bg-slate-50 transition"
            >
              <Building className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-xs font-semibold text-slate-800">Directory</span>
            </Link>
          </div>
        </div>

        {/* Right 1 Col: Society Events & Announcements */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 border-b pb-3">Upcoming Events</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <span className="text-xs font-bold leading-none">SEP</span>
                <span className="text-sm font-extrabold leading-none mt-0.5">16</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Pest Control Drive</h4>
                <p className="text-xs text-slate-500">10:00 AM • Wings A & B Common Areas</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <span className="text-xs font-bold leading-none">SEP</span>
                <span className="text-sm font-extrabold leading-none mt-0.5">27</span>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Annual General Meeting (AGM)</h4>
                <p className="text-xs text-slate-500">10:30 AM • Clubhouse Main Hall</p>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <Link
              href="/communications"
              className="block text-center text-xs font-semibold text-blue-600 hover:underline"
            >
              View All Notices & Minutes →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

