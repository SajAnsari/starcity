'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Building2, 
  LayoutDashboard, 
  Receipt, 
  Wallet, 
  Wrench, 
  Bell, 
  Home, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ShieldAlert,
  FileSpreadsheet
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, role: 'ALL' },
  { label: 'My Flat', href: '/my-flat', icon: Home, role: 'RESIDENT' },
  { label: 'Buildings & Flats', href: '/society', icon: Building2, role: 'ADMIN' },
  { label: 'Maintenance & UPI', href: '/finance/maintenance', icon: Receipt, role: 'ALL' },
  { label: 'Income & Expenses', href: '/finance/ledger', icon: Wallet, role: 'TREASURER' },
  { label: 'Helpdesk & Tickets', href: '/complaints', icon: Wrench, role: 'ALL' },
  { label: 'Notice Board', href: '/communications', icon: Bell, role: 'ALL' },
  { label: 'Financial Reports', href: '/finance/reports', icon: FileSpreadsheet, role: 'TREASURER' },
  { label: 'Society Settings', href: '/settings', icon: Settings, role: 'ADMIN' },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      document.cookie = 'starcity_demo_user=; path=/; max-age=0';
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push('/login');
      router.refresh();
    } catch {
      document.cookie = 'starcity_demo_user=; path=/; max-age=0';
      router.push('/login');
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white">
        <div className="flex h-16 items-center gap-3 border-b px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold tracking-tight text-slate-900 text-sm">Starcity Heights</h1>
            <p className="text-xs text-slate-500">Navi Mumbai • Society V1</p>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="border-t p-4">
          <button
            onClick={handleSignOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col">
        {/* Mobile Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:hidden">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            <span className="font-bold text-slate-900">Starcity Heights</span>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </header>

        {/* Mobile Dropdown Navigation */}
        {mobileOpen && (
          <div className="border-b bg-white p-4 lg:hidden">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                      active ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </nav>
          </div>
        )}

        {/* Page Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

