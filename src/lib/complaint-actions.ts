import { createClient } from '@/lib/supabase/client';
import { ComplaintPriority, ComplaintStatus } from '@/types/database.types';

export interface ComplaintComment {
  id: string;
  complaint_id: string;
  user_name: string;
  user_role: string;
  comment: string;
  is_internal: boolean;
  created_at: string;
}

export interface ComplaintItem {
  id: string;
  ticket_number: number;
  society_id: string;
  flat_number: string;
  wing_name: string;
  created_by_name: string;
  created_by_phone?: string;
  category: string;
  title: string;
  description: string;
  location?: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  assigned_to?: string; // e.g. "Ramesh (Society Electrician)"
  attachment_url?: string;
  resolved_at?: string;
  resident_rating?: number;
  closure_remarks?: string;
  comments: ComplaintComment[];
  created_at: string;
}

export const INITIAL_DEMO_COMPLAINTS: ComplaintItem[] = [
  {
    id: 'tck-01',
    ticket_number: 1041,
    society_id: 'soc-01',
    flat_number: 'A-102',
    wing_name: 'Emerald (Wing A)',
    created_by_name: 'Amit Patel',
    created_by_phone: '+91 98200 44556',
    category: 'Plumbing & Water Seepage',
    title: 'Water leakage in master bathroom ceiling',
    description: 'Continuous dampness and dripping water from the ceiling above. Likely coming from flat 202 plumbing pipe.',
    location: 'Master Bathroom, Flat A-102',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    assigned_to: 'Suresh Kumar (Society Plumber)',
    attachment_url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&q=80',
    comments: [
      {
        id: 'c-01',
        complaint_id: 'tck-01',
        user_name: 'Amit Patel',
        user_role: 'Resident',
        comment: 'Please check urgently as paint is peeling off.',
        is_internal: false,
        created_at: '2026-09-10T14:30:00Z',
      },
      {
        id: 'c-02',
        complaint_id: 'tck-01',
        user_name: 'Satish Deshmukh (Committee)',
        user_role: 'Supervisor',
        comment: 'Assigned plumber Suresh. Inspection scheduled for today at 4 PM.',
        is_internal: false,
        created_at: '2026-09-10T15:10:00Z',
      },
    ],
    created_at: '2026-09-10T14:20:00Z',
  },
  {
    id: 'tck-02',
    ticket_number: 1042,
    society_id: 'soc-01',
    flat_number: 'Common Area',
    wing_name: 'Emerald (Wing A)',
    created_by_name: 'Rajesh Sharma',
    created_by_phone: '+91 98200 11223',
    category: 'Lift Breakdown',
    title: 'Lift #2 making heavy vibrating noise',
    description: 'Lift #2 in Wing A vibrates when passing between floors 3 and 5. Need AMC technician inspection.',
    location: 'Wing A Passenger Lift #2',
    priority: 'EMERGENCY',
    status: 'NEW',
    comments: [],
    created_at: '2026-09-11T08:15:00Z',
  },
  {
    id: 'tck-03',
    ticket_number: 1039,
    society_id: 'soc-01',
    flat_number: 'B-101',
    wing_name: 'Sapphire (Wing B)',
    created_by_name: 'Vikram Joshi',
    created_by_phone: '+91 98111 22334',
    category: 'Electrical & Corridor Lights',
    title: 'Corridor lights flickering outside flat B-101',
    description: 'The tube light fixture in the 1st floor lobby is buzzing and flickering constantly.',
    location: '1st Floor Lobby, Wing B',
    priority: 'MEDIUM',
    status: 'RESOLVED',
    assigned_to: 'Ramesh Patil (Electrician)',
    resolved_at: '2026-09-08T16:00:00Z',
    resident_rating: 5,
    closure_remarks: 'Replaced faulty choke and starter. Issue resolved completely.',
    comments: [
      {
        id: 'c-03',
        complaint_id: 'tck-03',
        user_name: 'Ramesh Patil (Electrician)',
        user_role: 'Staff',
        comment: 'Replaced fixture bulb and tested voltage. Working fine.',
        is_internal: false,
        created_at: '2026-09-08T15:45:00Z',
      },
    ],
    created_at: '2026-09-07T11:00:00Z',
  },
];

export async function getComplaints(): Promise<ComplaintItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('complaints').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return INITIAL_DEMO_COMPLAINTS;
    }
    return data as any;
  } catch {
    return INITIAL_DEMO_COMPLAINTS;
  }
}

