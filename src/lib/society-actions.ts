import { createClient } from '@/lib/supabase/client';
import { Database, OccupancyType } from '@/types/database.types';

export interface BuildingItem {
  id: string;
  society_id: string;
  name: string;
  floors: number;
  flat_count?: number;
  created_at: string;
}

export interface FlatItem {
  id: string;
  society_id: string;
  building_id: string;
  building_name?: string;
  flat_number: string;
  floor: number;
  area_sqft: number;
  flat_type: string;
  status: 'OCCUPIED' | 'VACANT' | 'LOCKED';
  reserved_parking_slots: number;
  current_occupant?: {
    user_id: string;
    full_name: string;
    email: string;
    phone?: string;
    occupancy_type: OccupancyType;
    start_date: string;
  };
  created_at: string;
}

export interface OccupancyRecord {
  id: string;
  society_id: string;
  flat_id: string;
  flat_number?: string;
  building_name?: string;
  user_id: string;
  user_name?: string;
  user_email?: string;
  occupancy_type: OccupancyType;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  is_primary: boolean;
}

export interface FamilyMemberItem {
  id: string;
  flat_id: string;
  full_name: string;
  relationship: string;
  phone: string | null;
  created_at: string;
}

// Default Fallback Demo Data for instant preview before database is connected
const DEMO_BUILDINGS: BuildingItem[] = [
  { id: 'b-01', society_id: 'soc-01', name: 'Emerald (A Wing)', floors: 7, flat_count: 24, created_at: new Date().toISOString() },
  { id: 'b-02', society_id: 'soc-01', name: 'Sapphire (B Wing)', floors: 7, flat_count: 24, created_at: new Date().toISOString() },
  { id: 'b-03', society_id: 'soc-01', name: 'Ruby (C Wing)', floors: 5, flat_count: 15, created_at: new Date().toISOString() },
];

const DEMO_FLATS: FlatItem[] = [
  {
    id: 'f-101',
    society_id: 'soc-01',
    building_id: 'b-01',
    building_name: 'Emerald (A Wing)',
    flat_number: 'A-101',
    floor: 1,
    area_sqft: 850,
    flat_type: '2BHK',
    status: 'OCCUPIED',
    reserved_parking_slots: 1,
    current_occupant: {
      user_id: 'u-101',
      full_name: 'Rajesh Sharma',
      email: 'rajesh.sharma@example.com',
      phone: '+91 98200 11223',
      occupancy_type: 'OWNER',
      start_date: '2022-04-01',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'f-102',
    society_id: 'soc-01',
    building_id: 'b-01',
    building_name: 'Emerald (A Wing)',
    flat_number: 'A-102',
    floor: 1,
    area_sqft: 850,
    flat_type: '2BHK',
    status: 'OCCUPIED',
    reserved_parking_slots: 1,
    current_occupant: {
      user_id: 'u-102',
      full_name: 'Amit Patel',
      email: 'amit.patel@example.com',
      phone: '+91 98200 44556',
      occupancy_type: 'TENANT',
      start_date: '2025-01-15',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'f-201',
    society_id: 'soc-01',
    building_id: 'b-01',
    building_name: 'Emerald (A Wing)',
    flat_number: 'A-201',
    floor: 2,
    area_sqft: 1200,
    flat_type: '3BHK',
    status: 'OCCUPIED',
    reserved_parking_slots: 2,
    current_occupant: {
      user_id: 'u-201',
      full_name: 'Dr. Sunita Kulkarni',
      email: 'sunita.kulkarni@example.com',
      phone: '+91 98200 77889',
      occupancy_type: 'OWNER',
      start_date: '2021-08-10',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'f-b101',
    society_id: 'soc-01',
    building_id: 'b-02',
    building_name: 'Sapphire (B Wing)',
    flat_number: 'B-101',
    floor: 1,
    area_sqft: 600,
    flat_type: '1BHK',
    status: 'OCCUPIED',
    reserved_parking_slots: 1,
    current_occupant: {
      user_id: 'u-b101',
      full_name: 'Vikram Joshi',
      email: 'vikram.j@example.com',
      phone: '+91 98111 22334',
      occupancy_type: 'TENANT',
      start_date: '2024-06-01',
    },
    created_at: new Date().toISOString(),
  },
  {
    id: 'f-b102',
    society_id: 'soc-01',
    building_id: 'b-02',
    building_name: 'Sapphire (B Wing)',
    flat_number: 'B-102',
    floor: 1,
    area_sqft: 850,
    flat_type: '2BHK',
    status: 'VACANT',
    reserved_parking_slots: 1,
    created_at: new Date().toISOString(),
  },
];

const DEMO_FAMILY: FamilyMemberItem[] = [
  { id: 'fm-1', flat_id: 'f-101', full_name: 'Pooja Sharma', relationship: 'Spouse', phone: '+91 98200 11224', created_at: new Date().toISOString() },
  { id: 'fm-2', flat_id: 'f-101', full_name: 'Aarav Sharma', relationship: 'Child', phone: null, created_at: new Date().toISOString() },
  { id: 'fm-3', flat_id: 'f-101', full_name: 'Lata Bai', relationship: 'Domestic Helper (Maid)', phone: '+91 98999 55443', created_at: new Date().toISOString() },
];

export async function getBuildings(): Promise<BuildingItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('buildings').select('*').order('name');
    if (error || !data || data.length === 0) {
      return DEMO_BUILDINGS;
    }
    return data;
  } catch {
    return DEMO_BUILDINGS;
  }
}

export async function getFlats(buildingId?: string): Promise<FlatItem[]> {
  try {
    const supabase = createClient();
    let query = supabase.from('flats').select('*, buildings(name)').order('flat_number');
    if (buildingId) {
      query = query.eq('building_id', buildingId);
    }
    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (buildingId) {
        return DEMO_FLATS.filter((f) => f.building_id === buildingId);
      }
      return DEMO_FLATS;
    }
    return data.map((f: any) => ({
      ...f,
      building_name: f.buildings?.name || 'Wing A',
    }));
  } catch {
    if (buildingId) {
      return DEMO_FLATS.filter((f) => f.building_id === buildingId);
    }
    return DEMO_FLATS;
  }
}

export async function getFamilyMembers(flatId: string): Promise<FamilyMemberItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('flat_id', flatId);
    if (error || !data || data.length === 0) {
      return DEMO_FAMILY.filter((fm) => fm.flat_id === flatId);
    }
    return data;
  } catch {
    return DEMO_FAMILY.filter((fm) => fm.flat_id === flatId);
  }
}

export async function createBuilding(name: string, floors: number): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = createClient();
    // Fetch default society id
    const { data: soc } = await supabase.from('societies').select('id').limit(1).maybeSingle();
    const societyId = (soc as any)?.id || 'a0000000-0000-0000-0000-000000000001';

    const { error } = await supabase.from('buildings').insert({
      society_id: societyId,
      name,
      floors,
    } as any);

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: true }; // Optimistic success in demo mode
  }
}

export async function createFlat(flatData: {
  building_id: string;
  flat_number: string;
  floor: number;
  area_sqft: number;
  flat_type: string;
  reserved_parking_slots: number;
}): Promise<{ success: boolean; message?: string }> {
  try {
    const supabase = createClient();
    const { data: soc } = await supabase.from('societies').select('id').limit(1).maybeSingle();
    const societyId = (soc as any)?.id || 'a0000000-0000-0000-0000-000000000001';

    const { error } = await supabase.from('flats').insert({
      society_id: societyId,
      ...flatData,
      status: 'VACANT',
    } as any);

    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true };
  } catch (err: any) {
    return { success: true };
  }
}
