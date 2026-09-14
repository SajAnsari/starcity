'use client';

import React, { useState, useEffect } from 'react';
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
  Users,
  ShieldCheck,
  ShieldAlert,
  Crown,
  UserCheck,
  FileSpreadsheet,
  ChevronRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { normalizeAppRole } from '@/lib/user-actions';
import { AppRole } from '@/types/database.types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: AppRole[];
  badge?: string;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, allowedRoles: ['ADMIN', 'SECRETARY', 'MEMBER'] },
  { label: 'User Management', href: '/users', icon: Users, allowedRoles: ['ADMIN'], badge: 'Admin' },
  { label: 'My Flat', href: '/my-flat', icon: Home, allowedRoles: ['MEMBER', 'SECRETARY', 'ADMIN'] },
  { label: 'Buildings & Flats', href: '/society', icon: Building2, allowedRoles: ['ADMIN', 'SECRETARY'] },
  { label: 'Maintenance & UPI', href: '/finance/maintenance', icon: Receipt, allowedRoles: ['ADMIN', 'SECRETARY', 'MEMBER'] },
  { label: 'Income & Expenses', href: '/finance/ledger', icon: Wallet, allowedRoles: ['ADMIN', 'SECRETARY'] },
  { label: 'Helpdesk & Tickets', href: '/complaints', icon: Wrench, allowedRoles: ['ADMIN', 'SECRETARY', 'MEMBER'] },
  { label: 'Notice Board', href: '/communications', icon: Bell, allowedRoles: ['ADMIN', 'SECRETARY', 'MEMBER'] },
  { label: 'Financial Reports', href: '/finance/reports', icon: FileSpreadsheet, allowedRoles: ['ADMIN', 'SECRETARY'] },
  { label: 'Society Settings', href: '/settings', icon: Settings, allowedRoles: ['ADMIN'] },
];

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userRole, setUserRole] = useState<AppRole>('ADMIN');
  const [userName, setUserName] = useState<string>('Nitin Gadkari');
  const [userEmail, setUserEmail] = useState<string>('admin@starcity.com');

  useEffect(() => {
    // 1. Read demo/active session cookie
    try {
      const match = document.cookie.match(/starcity_demo_user=([^;]+)/);
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        if (parsed.role) setUserRole(normalizeAppRole(parsed.role));
        if (parsed.name) setUserName(parsed.name);
        if (parsed.email) setUserEmail(parsed.email);
      }
    } catch {
      // Keep defaults
    }

    // 2. Check Supabase auth session
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          if (data.user.email) setUserEmail(data.user.email);
          if (data.user.user_metadata?.full_name) setUserName(data.user.user_metadata.full_name);
          if (data.user.user_metadata?.role) {
            setUserRole(normalizeAppRole(data.user.user_metadata.role));
          }
        }
      });
    } catch {
      // Supabase offline/local fallback
    }
  }, []);

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

  // Filter navigation items strictly based on role
  const visibleNavItems = navItems.filter((item) => item.allowedRoles.includes(userRole));

  // Role Badge Helper
  const renderRoleBadge = () => {
    switch (userRole) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-800 border border-purple-200">
            <Crown className="h-3 w-3 text-purple-600" /> Admin
          </span>
        );
      case 'SECRETARY':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-bold text-amber-800 border border-amber-200">
            <ShieldCheck className="h-3 w-3 text-amber-600" /> Secretary
          </span>
        );
      case 'MEMBER':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200">
            <UserCheck className="h-3 w-3 text-emerald-600" /> Member
          </span>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white">
        <div className="flex h-16 items-center gap-3 border-b px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm shrink-0">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-bold tracking-tight text-slate-900 text-sm truncate">Starcity Heights</h1>
            <p className="text-[11px] text-slate-500 truncate">Navi Mumbai • Society V1</p>
          </div>
        </div>

        {/* Active User Header Info */}
        <div className="border-b bg-slate-50/60 px-5 py-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Current Role</span>
            {renderRoleBadge()}
          </div>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700 shrink-0">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User profile & Logout */}
        <div className="border-t p-4 space-y-3 bg-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs shrink-0">
              {userName ? userName.slice(0, 2).toUpperCase() : 'SC'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-slate-900 truncate">{userName}</p>
              <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
            </div>
          </div>

          <button
            onClick={handleSignOut}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50/50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
          >
            <LogOut className="h-3.5 w-3.5" />
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
            <span className="font-bold text-slate-900 text-sm">Starcity Heights</span>
          </div>
          <div className="flex items-center gap-2">
            {renderRoleBadge()}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </header>

        {/* Mobile Dropdown Navigation */}
        {mobileOpen && (
          <div className="border-b bg-white p-4 lg:hidden shadow-lg">
            <div className="mb-3 border-b pb-3 flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-900">{userName}</p>
                <p className="text-[11px] text-slate-500">{userEmail}</p>
              </div>
              {renderRoleBadge()}
            </div>
            <nav className="space-y-1">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium ${
                      active ? 'bg-blue-50 text-blue-700' : 'text-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </div>
                    {item.badge && (
                      <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-700">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 mt-2 pt-2 border-t"
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


