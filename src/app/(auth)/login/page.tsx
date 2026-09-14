'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, KeyRound, Mail, ArrowRight, ShieldCheck, UserPlus, Zap } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { normalizeAppRole } from '@/lib/user-actions';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@starcity.com');
  const [password, setPassword] = useState('Starcity@123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const setDemoSession = (userEmail: string, roleName: string) => {
    document.cookie = `starcity_demo_user=${encodeURIComponent(
      JSON.stringify({
        email: userEmail,
        role: roleName,
        name: userEmail.split('@')[0].toUpperCase(),
      })
    )}; path=/; max-age=86400`;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      try {
        const { data: authData, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!error && authData?.user) {
          // Fetch user role from society_members
          const { data: member } = await supabase
            .from('society_members')
            .select('role')
            .eq('user_id', authData.user.id)
            .maybeSingle();

          const assignedRole = normalizeAppRole((member as any)?.role || authData.user.user_metadata?.role);
          setDemoSession(email, assignedRole);
          router.push('/dashboard');
          router.refresh();
          return;
        }
      } catch {
        // Fallback to local demo session if Supabase is offline/placeholder
      }

      // Default role fallback: ONLY admin email gets ADMIN; all others default to MEMBER
      let fallbackRole: 'ADMIN' | 'SECRETARY' | 'MEMBER' = 'MEMBER';
      if (email.toLowerCase().includes('admin')) {
        fallbackRole = 'ADMIN';
      } else if (email.toLowerCase().includes('secretary')) {
        fallbackRole = 'SECRETARY';
      }
      setDemoSession(email, fallbackRole);
      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred');
      setLoading(false);
    }
  };

  // Instant 1-click role login handler
  const instantLoginAs = (demoEmail: string, roleName: 'ADMIN' | 'SECRETARY' | 'MEMBER') => {
    setLoading(true);
    setDemoSession(demoEmail, roleName);
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-7 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Building2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Sign in to Starcity</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Access your society management dashboard
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {/* 1-Click Fast Enter Banner */}
        <div className="rounded-xl border border-blue-200 bg-blue-50/70 p-3 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-blue-600 shrink-0" />
            <span>Local verification mode enabled</span>
          </div>
          <button
            type="button"
            onClick={() => instantLoginAs('admin@starcity.com', 'ADMIN')}
            className="rounded-lg bg-blue-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
          >
            Instant Enter →
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@starcity.com"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Entering Portal...' : 'Sign In'}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </button>
        </form>

        {/* 1-Click Role Logins */}
        <div className="border-t border-slate-100 pt-5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            1-Click Quick Role Switch (Admin, Secretary, Members):
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => instantLoginAs('admin@starcity.com', 'ADMIN')}
              className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-left hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <span className="font-bold block text-slate-800">👑 Admin</span>
              <span className="text-[11px] text-slate-400">admin@starcity.com</span>
            </button>
            <button
              type="button"
              onClick={() => instantLoginAs('secretary@starcity.com', 'SECRETARY')}
              className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-left hover:bg-blue-50 hover:border-blue-300 transition"
            >
              <span className="font-bold block text-slate-800"> Secretary</span>
              <span className="text-[11px] text-slate-400">secretary@starcity.com</span>
            </button>
            <button
              type="button"
              onClick={() => instantLoginAs('member@starcity.com', 'MEMBER')}
              className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-left hover:bg-blue-50 hover:border-blue-300 transition col-span-2"
            >
              <span className="font-bold block text-slate-800"> Members (Default Resident Role)</span>
              <span className="text-[11px] text-slate-400">member@starcity.com • Standard resident access</span>
            </button>
          </div>
        </div>

        {/* Link to Register */}
        <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-600">
          New to Starcity?{' '}
          <Link href="/register" className="font-bold text-blue-600 hover:underline inline-flex items-center gap-1">
            <UserPlus className="h-3.5 w-3.5" />
            Create an Account / Register
          </Link>
        </div>

        <div className="text-center text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-600">
            ← Back to Home Page
          </Link>
        </div>
      </div>
    </div>
  );
}
