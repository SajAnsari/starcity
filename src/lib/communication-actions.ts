import { createClient } from '@/lib/supabase/client';
import { NoticePriority, DocumentCategory, DocumentVisibility } from '@/types/database.types';

export interface AnnouncementItem {
  id: string;
  society_id: string;
  title: string;
  description: string;
  priority: NoticePriority;
  attachment_url?: string;
  attachment_name?: string;
  published_at: string;
  expires_at?: string;
  created_by: string;
}

export interface EventItem {
  id: string;
  society_id: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time?: string;
  location: string;
  category: 'AGM' | 'FESTIVAL' | 'MEETING' | 'MAINTENANCE' | 'SPORTS';
  attendees_count: number;
  created_by: string;
  created_at: string;
}

export interface DocumentItem {
  id: string;
  society_id: string;
  title: string;
  category: DocumentCategory;
  file_url: string;
  file_size: string;
  file_type: 'PDF' | 'DOCX' | 'XLSX';
  visibility: DocumentVisibility;
  uploaded_by: string;
  uploaded_at: string;
}

export const INITIAL_DEMO_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'not-01',
    society_id: 'soc-01',
    title: 'Urgent: Water Tank Cleaning Scheduled',
    description: 'Underground and overhead water tanks of Wings A & B will be cleaned on Saturday, September 19th from 9:00 AM to 4:00 PM. Water supply will remain suspended during this window. Residents are requested to store adequate water in advance.',
    priority: 'EMERGENCY',
    attachment_name: 'Water_Tank_Cleaning_Circular_Sep2026.pdf',
    attachment_url: '#',
    published_at: '2026-09-11T09:00:00Z',
    expires_at: '2026-09-20T00:00:00Z',
    created_by: 'Secretary - Hon. Committee',
  },
  {
    id: 'not-02',
    society_id: 'soc-01',
    title: 'Notice for 12th Annual General Body Meeting (AGM) 2026',
    description: 'Notice is hereby given that the 12th AGM of Starcity Heights CHS Ltd will be held on Sunday, September 27th, 2026 at 10:30 AM in the Society Clubhouse. Formal agenda and audited financial accounts copy are attached in the Document Vault.',
    priority: 'IMPORTANT',
    attachment_name: 'AGM_2026_Official_Notice_and_Agenda.pdf',
    attachment_url: '#',
    published_at: '2026-09-08T10:30:00Z',
    created_by: 'Chairman - Dr. S. Kulkarni',
  },
  {
    id: 'not-03',
    society_id: 'soc-01',
    title: 'Navratri Garba & Cultural Evening Preparations',
    description: 'The society cultural committee is planning the Navratri Dandiya celebration for October. Flat owners wishing to volunteer or sponsor event stalls are requested to contact the society office by September 22nd.',
    priority: 'NORMAL',
    published_at: '2026-09-05T12:00:00Z',
    created_by: 'Cultural Committee',
  },
];

export const INITIAL_DEMO_EVENTS: EventItem[] = [
  {
    id: 'ev-01',
    society_id: 'soc-01',
    title: 'Pest Control & Fogging Drive',
    description: 'Comprehensive mosquito fogging and common corridor gel application for pest control.',
    event_date: '2026-09-16',
    start_time: '10:00 AM',
    end_time: '04:00 PM',
    location: 'Wings A & B Common Staircases & Basement',
    category: 'MAINTENANCE',
    attendees_count: 42,
    created_by: 'Society Supervisor',
    created_at: '2026-09-09T00:00:00Z',
  },
  {
    id: 'ev-02',
    society_id: 'soc-01',
    title: 'Annual General Body Meeting (AGM) 2026',
    description: 'Statutory AGM for passing audited accounts, approving budget for FY 2026-27, and committee elections.',
    event_date: '2026-09-27',
    start_time: '10:30 AM',
    end_time: '01:30 PM',
    location: 'Society Clubhouse Main Hall',
    category: 'AGM',
    attendees_count: 38,
    created_by: 'Hon. Secretary',
    created_at: '2026-09-07T00:00:00Z',
  },
  {
    id: 'ev-03',
    society_id: 'soc-01',
    title: 'Navratri Sangeet & Dandiya Night',
    description: 'Community Dandiya night with traditional music, food stalls, and prizes for best dressed kids and adults.',
    event_date: '2026-10-10',
    start_time: '07:30 PM',
    end_time: '11:00 PM',
    location: 'Podium Garden & Amphitheatre',
    category: 'FESTIVAL',
    attendees_count: 65,
    created_by: 'Cultural Committee',
    created_at: '2026-09-04T00:00:00Z',
  },
];

export const INITIAL_DEMO_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-01',
    society_id: 'soc-01',
    title: 'Society Model Bye-laws & Rules Handbook',
    category: 'BYLAWS',
    file_url: '#',
    file_size: '2.4 MB',
    file_type: 'PDF',
    visibility: 'PUBLIC',
    uploaded_by: 'Society Admin',
    uploaded_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'doc-02',
    society_id: 'soc-01',
    title: 'Audited Financial Statements FY 2025-26',
    category: 'FINANCIAL',
    file_url: '#',
    file_size: '4.8 MB',
    file_type: 'PDF',
    visibility: 'MEMBERS_ONLY',
    uploaded_by: 'Hon. Treasurer',
    uploaded_at: '2026-08-20T00:00:00Z',
  },
  {
    id: 'doc-03',
    society_id: 'soc-01',
    title: 'Fire Safety Certificate & Lift Inspection NOC',
    category: 'NOTICE',
    file_url: '#',
    file_size: '1.1 MB',
    file_type: 'PDF',
    visibility: 'MEMBERS_ONLY',
    uploaded_by: 'Society Supervisor',
    uploaded_at: '2026-05-10T00:00:00Z',
  },
  {
    id: 'doc-04',
    society_id: 'soc-01',
    title: 'Approved Minutes of 11th AGM (2025)',
    category: 'AGM',
    file_url: '#',
    file_size: '850 KB',
    file_type: 'PDF',
    visibility: 'MEMBERS_ONLY',
    uploaded_by: 'Hon. Secretary',
    uploaded_at: '2025-10-02T00:00:00Z',
  },
  {
    id: 'doc-05',
    society_id: 'soc-01',
    title: 'Tenant Police Verification & Move-in NOC Form',
    category: 'FORM',
    file_url: '#',
    file_size: '420 KB',
    file_type: 'PDF',
    visibility: 'PUBLIC',
    uploaded_by: 'Society Admin',
    uploaded_at: '2026-02-11T00:00:00Z',
  },
  {
    id: 'doc-06',
    society_id: 'soc-01',
    title: 'Managing Committee Internal Resolution (Lift AMC Renewal)',
    category: 'AGM',
    file_url: '#',
    file_size: '620 KB',
    file_type: 'PDF',
    visibility: 'COMMITTEE_ONLY',
    uploaded_by: 'Hon. Secretary',
    uploaded_at: '2026-07-14T00:00:00Z',
  },
];

export async function getAnnouncements(): Promise<AnnouncementItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('announcements').select('*').order('published_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return INITIAL_DEMO_ANNOUNCEMENTS;
    }
    return data as any;
  } catch {
    return INITIAL_DEMO_ANNOUNCEMENTS;
  }
}

export async function getEvents(): Promise<EventItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('events').select('*').order('event_date', { ascending: true });
    if (error || !data || data.length === 0) {
      return INITIAL_DEMO_EVENTS;
    }
    return data as any;
  } catch {
    return INITIAL_DEMO_EVENTS;
  }
}

export async function getDocuments(): Promise<DocumentItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('documents').select('*').order('uploaded_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return INITIAL_DEMO_DOCUMENTS;
    }
    return data as any;
  } catch {
    return INITIAL_DEMO_DOCUMENTS;
  }
}

