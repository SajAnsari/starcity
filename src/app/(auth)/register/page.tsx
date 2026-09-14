'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Building2, User, Mail, Phone, KeyRound, Home, ArrowRight, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { registerNewMemberInMemory } from '@/lib/user-actions';

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [wing, setWing] = useState('Emerald (A Wing)');
  const [flatNumber, setFlatNumber] = useState('');
  const [occupancyType, setOccupancyType] = useState<'OWNER' | 'TENANT'>('OWNER');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();

      // Attempt Supabase Auth Sign Up with default MEMBER role
      try {
        const { data: signUpData } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              flat_number: flatNumber,
              wing: wing,
              occupancy_type: occupancyType,
              role: 'MEMBER', // Strictly MEMBER role by default
            },
          },
        });

        // If user was created in Supabase, insert member record as MEMBER
        if (signUpData?.user) {
          const { data: soc } = await supabase.from('societies').select('id').limit(1).maybeSingle();
          const societyId = (soc as any)?.id || 'a0000000-0000-0000-0000-000000000001';
          await supabase.from('society_members').insert({
            society_id: societyId,
            user_id: signUpData.user.id,
            role: 'MEMBER',
            status: 'ACTIVE',
          } as any);
        }
      } catch {
        // Fallback for demo preview
      }

      // Record in local in-memory store as MEMBER
      registerNewMemberInMemory({
        fullName,
        email,
        phone,
        wing,
        flatNumber,
        occupancyType,
      });

      // Set session cookie strictly as MEMBER
      document.cookie = `starcity_demo_user=${encodeURIComponent(
        JSON.stringify({
          email,
          name: fullName,
          flat: flatNumber,
          role: 'MEMBER',
        })
      )}; path=/; max-age=86400`;

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Building2 className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">Resident Registration</h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Create an account to access Starcity Heights society portal
          </p>
        </div>

        {errorMsg && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {errorMsg}
          </div>
        )}

        {success ? (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center space-y-3">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600 animate-bounce" />
            <h3 className="text-lg font-bold text-emerald-900">Account Created Successfully!</h3>
            <p className="text-xs text-emerald-700">
              Welcome, <span className="font-semibold">{fullName}</span>. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4 text-sm">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Anand Deshmukh"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Wing / Tower
                </label>
                <select
                  value={wing}
                  onChange={(e) => setWing(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2.5 px-3 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Emerald (A Wing)">Emerald (A Wing)</option>
                  <option value="Sapphire (B Wing)">Sapphire (B Wing)</option>
                  <option value="Ruby (C Wing)">Ruby (C Wing)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Flat Number
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-302"
                    value={flatNumber}
                    onChange={(e) => setFlatNumber(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Occupancy Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOccupancyType('OWNER')}
                  className={`rounded-lg p-2.5 text-xs font-bold border text-center transition ${
                    occupancyType === 'OWNER'
                      ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Flat Owner
                </button>
                <button
                  type="button"
                  onClick={() => setOccupancyType('TENANT')}
                  className={`rounded-lg p-2.5 text-xs font-bold border text-center transition ${
                    occupancyType === 'TENANT'
                      ? 'border-purple-600 bg-purple-50 text-purple-700 shadow-sm'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Tenant (Renter)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition disabled:opacity-50 mt-2"
            >
              {loading ? 'Registering Account...' : 'Complete Registration'}
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </button>

            <div className="text-center pt-2 text-xs text-slate-500">
              Already have an account?{' '}
              <Link href="/login" className="font-bold text-blue-600 hover:underline">
                Sign In here
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

