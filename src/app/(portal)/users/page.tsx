'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle2, 
  UserCheck, 
  UserX, 
  AlertCircle,
  Building2,
  Mail,
  Phone,
  ArrowLeft,
  Key,
  Crown,
  FileCheck
} from 'lucide-react';
import { 
  getUsersList, 
  updateUserRole, 
  updateUserStatus, 
  UserManagementItem,
  normalizeAppRole 
} from '@/lib/user-actions';
import { AppRole, MemberStatus } from '@/types/database.types';
import { formatDate } from '@/lib/utils';

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserManagementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<AppRole>('ADMIN');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | AppRole>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | MemberStatus>('ALL');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load current user role from cookie/session
  useEffect(() => {
    try {
      const match = document.cookie.match(/starcity_demo_user=([^;]+)/);
      if (match) {
        const parsed = JSON.parse(decodeURIComponent(match[1]));
        setCurrentUserRole(normalizeAppRole(parsed.role));
      }
    } catch {
      // Default to ADMIN for dev preview
    }

    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const data = await getUsersList();
    setUsers(data);
    setLoading(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Role modification handler
  const handleRoleChange = async (userId: string, newRole: AppRole, userName: string) => {
    const res = await updateUserRole(userId, newRole);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId || u.id === userId ? { ...u, role: newRole } : u))
      );
      showToast(`Updated role for ${userName} to ${newRole === 'ADMIN' ? 'Admin' : newRole === 'SECRETARY' ? 'Secretary' : 'Member'}`);
    } else {
      showToast(res.message || 'Failed to update role');
    }
  };

  // Status modification handler
  const handleStatusChange = async (userId: string, newStatus: MemberStatus, userName: string) => {
    const res = await updateUserStatus(userId, newStatus);
    if (res.success) {
      setUsers((prev) =>
        prev.map((u) => (u.user_id === userId || u.id === userId ? { ...u, status: newStatus } : u))
      );
      showToast(`Updated status for ${userName} to ${newStatus}`);
    } else {
      showToast(res.message || 'Failed to update status');
    }
  };

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch = 
        u.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.flat_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.phone && u.phone.includes(searchQuery));

      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, searchQuery, roleFilter, statusFilter]);

  // Role Counts
  const counts = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((u) => u.role === 'ADMIN').length,
      secretaries: users.filter((u) => u.role === 'SECRETARY').length,
      members: users.filter((u) => u.role === 'MEMBER').length,
    };
  }, [users]);

  // RESTRICT ACCESS: If non-admin tries to access, render Access Denied
  if (currentUserRole !== 'ADMIN') {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 mb-4 shadow-inner">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Access Restricted to Administrators</h1>
        <p className="mt-2 max-w-md text-xs sm:text-sm text-slate-500">
          The User Management and Role Administration portal is strictly reserved for Society Admins. Your current role is{' '}
          <span className="font-bold text-slate-800 uppercase">{currentUserRole}</span>.
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 text-white px-4 py-3 shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-purple-700">
              Admin Exclusive
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs font-medium text-slate-500">Security & RBAC</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            User Management & Role Permissions
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            View registered society members and assign access roles (Admin, Secretary, Members).
          </p>
        </div>
      </div>

      {/* Role Summary KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Users</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-slate-900">{counts.total}</div>
            <div className="mt-1 text-[11px] text-slate-500">Registered across all wings</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600">Admins</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Crown className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-purple-900">{counts.admins}</div>
            <div className="mt-1 text-[11px] text-slate-500">Full system & settings control</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Secretaries</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <FileCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-blue-900">{counts.secretaries}</div>
            <div className="mt-1 text-[11px] text-slate-500">Operations & complaints management</div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Members</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <UserCheck className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-black text-emerald-900">{counts.members}</div>
            <div className="mt-1 text-[11px] text-slate-500">Default role for all residents</div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {/* Search & Filter Bar */}
        <div className="border-b p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or flat number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-8 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="h-3.5 w-3.5" />
              <span>Role:</span>
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as 'ALL' | AppRole)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none font-medium"
            >
              <option value="ALL">All Roles ({counts.total})</option>
              <option value="ADMIN">Admin ({counts.admins})</option>
              <option value="SECRETARY">Secretary ({counts.secretaries})</option>
              <option value="MEMBER">Members ({counts.members})</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'ALL' | MemberStatus)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:bg-white focus:outline-none font-medium"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-4">User Details</th>
                <th className="py-3.5 px-4">Flat / Unit</th>
                <th className="py-3.5 px-4">Role Assignment</th>
                <th className="py-3.5 px-4">Account Status</th>
                <th className="py-3.5 px-4">Registered Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    Loading users directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition">
                    {/* User Details */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-blue-700 font-bold text-xs uppercase shadow-xs">
                          {user.full_name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{user.full_name}</div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3 text-slate-400" />
                              {user.email}
                            </span>
                            {user.phone && (
                              <span className="flex items-center gap-1 font-mono">
                                <Phone className="h-3 w-3 text-slate-400" />
                                {user.phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Flat / Unit */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{user.flat_number}</div>
                      <div className="text-[11px] text-slate-500">{user.wing}</div>
                      <span className="mt-0.5 inline-block rounded bg-slate-100 px-1.5 py-0.2 text-[9px] font-bold text-slate-600 uppercase">
                        {user.occupancy_type}
                      </span>
                    </td>

                    {/* Role Selector (Inline) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(user.user_id, e.target.value as AppRole, user.full_name)
                          }
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold shadow-xs focus:outline-none transition cursor-pointer ${
                            user.role === 'ADMIN'
                              ? 'border-purple-300 bg-purple-50 text-purple-800'
                              : user.role === 'SECRETARY'
                              ? 'border-blue-300 bg-blue-50 text-blue-800'
                              : 'border-emerald-300 bg-emerald-50 text-emerald-800'
                          }`}
                        >
                          <option value="ADMIN">Admin</option>
                          <option value="SECRETARY">Secretary</option>
                          <option value="MEMBER">Members</option>
                        </select>
                      </div>
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3.5 px-4">
                      <select
                        value={user.status}
                        onChange={(e) =>
                          handleStatusChange(user.user_id, e.target.value as MemberStatus, user.full_name)
                        }
                        className={`rounded-lg border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider focus:outline-none ${
                          user.status === 'ACTIVE'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : user.status === 'INACTIVE'
                            ? 'border-slate-200 bg-slate-100 text-slate-600'
                            : 'border-rose-200 bg-rose-50 text-rose-700'
                        }`}
                      >
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="SUSPENDED">SUSPENDED</option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {formatDate(user.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

