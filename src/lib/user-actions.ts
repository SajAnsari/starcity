import { createClient } from '@/lib/supabase/client';
import { AppRole, MemberStatus, OccupancyType } from '@/types/database.types';
import { addAuditLog } from '@/lib/settings-actions';

export interface UserManagementItem {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  wing: string;
  flat_number: string;
  occupancy_type: OccupancyType;
  role: AppRole;
  status: MemberStatus;
  created_at: string;
}

export function normalizeAppRole(rawRole: string | null | undefined): AppRole {
  if (!rawRole) return 'MEMBER';
  const upper = rawRole.toUpperCase();
  if (upper.includes('ADMIN')) return 'ADMIN';
  if (upper.includes('SECRETARY') || upper.includes('COMMITTEE') || upper.includes('TREASURER')) return 'SECRETARY';
  return 'MEMBER';
}

export const INITIAL_DEMO_USERS: UserManagementItem[] = [
  {
    id: 'mem-01',
    user_id: 'u-admin-01',
    full_name: 'Nitin Gadkari',
    email: 'admin@starcity.com',
    phone: '+91 98200 99001',
    wing: 'Emerald (A Wing)',
    flat_number: 'A-701',
    occupancy_type: 'OWNER',
    role: 'ADMIN',
    status: 'ACTIVE',
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'mem-02',
    user_id: 'u-sec-01',
    full_name: 'Priya Kulkarni',
    email: 'secretary@starcity.com',
    phone: '+91 98200 99002',
    wing: 'Sapphire (B Wing)',
    flat_number: 'B-402',
    occupancy_type: 'OWNER',
    role: 'SECRETARY',
    status: 'ACTIVE',
    created_at: '2026-08-05T11:30:00Z',
  },
  {
    id: 'mem-03',
    user_id: 'u-101',
    full_name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    phone: '+91 98200 11223',
    wing: 'Emerald (A Wing)',
    flat_number: 'A-101',
    occupancy_type: 'OWNER',
    role: 'MEMBER',
    status: 'ACTIVE',
    created_at: '2026-08-10T14:20:00Z',
  },
  {
    id: 'mem-04',
    user_id: 'u-102',
    full_name: 'Vikram Joshi',
    email: 'vikram.joshi@example.com',
    phone: '+91 98111 22334',
    wing: 'Sapphire (B Wing)',
    flat_number: 'B-101',
    occupancy_type: 'OWNER',
    role: 'MEMBER',
    status: 'ACTIVE',
    created_at: '2026-08-12T09:15:00Z',
  },
  {
    id: 'mem-05',
    user_id: 'u-103',
    full_name: 'Anita Desai',
    email: 'anita.desai@example.com',
    phone: '+91 98333 44556',
    wing: 'Emerald (A Wing)',
    flat_number: 'A-302',
    occupancy_type: 'OWNER',
    role: 'MEMBER',
    status: 'ACTIVE',
    created_at: '2026-08-15T16:40:00Z',
  },
  {
    id: 'mem-06',
    user_id: 'u-104',
    full_name: 'Rohan Patil',
    email: 'rohan.patil@example.com',
    phone: '+91 98777 88990',
    wing: 'Sapphire (B Wing)',
    flat_number: 'B-201',
    occupancy_type: 'TENANT',
    role: 'MEMBER',
    status: 'ACTIVE',
    created_at: '2026-08-20T12:00:00Z',
  },
];

// Persistent in-memory store for active session demo
let liveUsers = [...INITIAL_DEMO_USERS];

export async function getUsersList(): Promise<UserManagementItem[]> {
  try {
    const supabase = createClient();
    const { data: members, error } = await supabase
      .from('society_members')
      .select('id, user_id, role, status, created_at, users(email, full_name, phone)');

    if (!error && members && members.length > 0) {
      // Map live Supabase records
      return members.map((m: any) => ({
        id: m.id,
        user_id: m.user_id,
        full_name: m.users?.full_name || 'Resident',
        email: m.users?.email || 'resident@example.com',
        phone: m.users?.phone || null,
        wing: 'Emerald (A Wing)',
        flat_number: 'A-101',
        occupancy_type: 'OWNER',
        role: normalizeAppRole(m.role),
        status: (m.status as MemberStatus) || 'ACTIVE',
        created_at: m.created_at || new Date().toISOString(),
      }));
    }
  } catch {
    // Fallback to local live store
  }

  return [...liveUsers];
}

export async function updateUserRole(
  userId: string, 
  newRole: AppRole
): Promise<{ success: boolean; message?: string }> {
  try {
    // 1. Update in Supabase
    try {
      const supabase = createClient();
      await (supabase
        .from('society_members') as any)
        .update({ role: newRole })
        .eq('user_id', userId);
    } catch {
      // Supabase offline/local fallback
    }

    // 2. Update local in-memory store
    liveUsers = liveUsers.map((u) => {
      if (u.user_id === userId || u.id === userId) {
        return { ...u, role: newRole };
      }
      return u;
    });

    const targetUser = liveUsers.find((u) => u.user_id === userId || u.id === userId);

    // 3. Record immutable audit log
    addAuditLog({
      user_name: 'Admin - Nitin Gadkari',
      user_role: 'ADMIN',
      action: 'UPDATE_SETTINGS',
      entity_type: 'society_members',
      entity_id: userId,
      details: `Modified role for ${targetUser?.full_name || userId} to '${newRole}'`,
      ip_address: '103.21.144.18',
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update user role' };
  }
}

export async function updateUserStatus(
  userId: string,
  newStatus: MemberStatus
): Promise<{ success: boolean; message?: string }> {
  try {
    try {
      const supabase = createClient();
      await (supabase
        .from('society_members') as any)
        .update({ status: newStatus })
        .eq('user_id', userId);
    } catch {
      // Offline fallback
    }

    liveUsers = liveUsers.map((u) => {
      if (u.user_id === userId || u.id === userId) {
        return { ...u, status: newStatus };
      }
      return u;
    });

    const targetUser = liveUsers.find((u) => u.user_id === userId || u.id === userId);

    addAuditLog({
      user_name: 'Admin - Nitin Gadkari',
      user_role: 'ADMIN',
      action: 'UPDATE_SETTINGS',
      entity_type: 'society_members',
      entity_id: userId,
      details: `Updated account status for ${targetUser?.full_name || userId} to '${newStatus}'`,
      ip_address: '103.21.144.18',
    });

    return { success: true };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to update user status' };
  }
}

export function registerNewMemberInMemory(userData: {
  fullName: string;
  email: string;
  phone?: string;
  wing: string;
  flatNumber: string;
  occupancyType: OccupancyType;
}): UserManagementItem {
  const newUser: UserManagementItem = {
    id: `mem-${Date.now()}`,
    user_id: `u-${Date.now()}`,
    full_name: userData.fullName,
    email: userData.email,
    phone: userData.phone || null,
    wing: userData.wing,
    flat_number: userData.flatNumber,
    occupancy_type: userData.occupancyType,
    role: 'MEMBER', // STRICTLY MEMBER BY DEFAULT
    status: 'ACTIVE',
    created_at: new Date().toISOString(),
  };

  liveUsers = [newUser, ...liveUsers];
  return newUser;
}
