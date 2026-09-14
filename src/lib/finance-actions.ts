import { createClient } from '@/lib/supabase/client';
import { MaintenanceStatus, PaymentMode, PaymentStatus } from '@/types/database.types';

export interface MaintenanceChargeItem {
  id: string;
  society_id: string;
  flat_id: string;
  flat_number: string;
  wing_name: string;
  resident_name: string;
  resident_phone?: string;
  resident_type: 'OWNER' | 'TENANT';
  billing_month: string; // 'YYYY-MM'
  area_sqft: number;
  base_amount: number;
  area_amount: number;
  parking_amount: number;
  penalty_amount: number;
  total_amount: number;
  due_date: string;
  status: MaintenanceStatus;
  payment_id?: string;
  receipt_number?: string;
  created_at: string;
}

export interface PaymentItem {
  id: string;
  society_id: string;
  flat_id: string;
  flat_number: string;
  wing_name: string;
  user_name: string;
  user_phone?: string;
  maintenance_charge_id: string;
  billing_month: string;
  amount: number;
  payment_date: string;
  payment_mode: PaymentMode;
  reference_number: string; // UTR Number
  receipt_url?: string;
  receipt_number?: string;
  status: PaymentStatus;
  notes?: string;
  rejection_reason?: string;
  verified_by?: string;
  verified_at?: string;
  created_at: string;
}

export interface BillingConfig {
  billing_type: 'FLAT_RATE' | 'PER_SQFT' | 'HYBRID';
  base_maintenance_amount: number;
  rate_per_sqft: number;
  parking_charge_2w: number;
  parking_charge_4w: number;
  due_day_of_month: number;
  late_fee_amount: number;
  upi_id: string;
}

// Initial Demo Billing Config
export const DEMO_BILLING_CONFIG: BillingConfig = {
  billing_type: 'HYBRID',
  base_maintenance_amount: 1500,
  rate_per_sqft: 1.5,
  parking_charge_2w: 200,
  parking_charge_4w: 500,
  due_day_of_month: 10,
  late_fee_amount: 150,
  upi_id: 'starcity@sbi',
};

// Demo Maintenance Charges
export const INITIAL_DEMO_CHARGES: MaintenanceChargeItem[] = [
  {
    id: 'ch-01',
    society_id: 'soc-01',
    flat_id: 'f-101',
    flat_number: 'A-101',
    wing_name: 'Emerald (Wing A)',
    resident_name: 'Rajesh Sharma',
    resident_phone: '+91 98200 11223',
    resident_type: 'OWNER',
    billing_month: '2026-09',
    area_sqft: 850,
    base_amount: 1500,
    area_amount: 1275,
    parking_amount: 200,
    penalty_amount: 0,
    total_amount: 2975,
    due_date: '2026-09-10',
    status: 'PAID',
    payment_id: 'pay-01',
    receipt_number: 'REC-2026-0819',
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'ch-02',
    society_id: 'soc-01',
    flat_id: 'f-102',
    flat_number: 'A-102',
    wing_name: 'Emerald (Wing A)',
    resident_name: 'Amit Patel',
    resident_phone: '+91 98200 44556',
    resident_type: 'TENANT',
    billing_month: '2026-09',
    area_sqft: 850,
    base_amount: 1500,
    area_amount: 1275,
    parking_amount: 200,
    penalty_amount: 0,
    total_amount: 2975,
    due_date: '2026-09-10',
    status: 'PENDING',
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'ch-03',
    society_id: 'soc-01',
    flat_id: 'f-201',
    flat_number: 'A-201',
    wing_name: 'Emerald (Wing A)',
    resident_name: 'Dr. Sunita Kulkarni',
    resident_phone: '+91 98200 77889',
    resident_type: 'OWNER',
    billing_month: '2026-09',
    area_sqft: 1200,
    base_amount: 1500,
    area_amount: 1800,
    parking_amount: 500,
    penalty_amount: 150,
    total_amount: 3950,
    due_date: '2026-09-10',
    status: 'OVERDUE',
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'ch-04',
    society_id: 'soc-01',
    flat_id: 'f-b101',
    flat_number: 'B-101',
    wing_name: 'Sapphire (Wing B)',
    resident_name: 'Vikram Joshi',
    resident_phone: '+91 98111 22334',
    resident_type: 'TENANT',
    billing_month: '2026-09',
    area_sqft: 600,
    base_amount: 1500,
    area_amount: 900,
    parking_amount: 200,
    penalty_amount: 0,
    total_amount: 2600,
    due_date: '2026-09-10',
    status: 'PAID',
    payment_id: 'pay-02',
    receipt_number: 'REC-2026-0820',
    created_at: '2026-09-01T00:00:00Z',
  },
  {
    id: 'ch-05',
    society_id: 'soc-01',
    flat_id: 'f-b102',
    flat_number: 'B-102',
    wing_name: 'Sapphire (Wing B)',
    resident_name: 'Society Builder / Vacant',
    resident_type: 'OWNER',
    billing_month: '2026-09',
    area_sqft: 850,
    base_amount: 1500,
    area_amount: 1275,
    parking_amount: 0,
    penalty_amount: 0,
    total_amount: 2775,
    due_date: '2026-09-10',
    status: 'PENDING',
    created_at: '2026-09-01T00:00:00Z',
  },
];

// Demo Reconciliation Queue
export const INITIAL_DEMO_PAYMENTS: PaymentItem[] = [
  {
    id: 'pay-pending-01',
    society_id: 'soc-01',
    flat_id: 'f-102',
    flat_number: 'A-102',
    wing_name: 'Emerald (Wing A)',
    user_name: 'Amit Patel',
    user_phone: '+91 98200 44556',
    maintenance_charge_id: 'ch-02',
    billing_month: '2026-09',
    amount: 2975,
    payment_date: '2026-09-11',
    payment_mode: 'UPI',
    reference_number: 'UPI/425519827391',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    status: 'PENDING_APPROVAL',
    notes: 'Paid via Google Pay to starcity@sbi',
    created_at: '2026-09-11T09:30:00Z',
  },
  {
    id: 'pay-01',
    society_id: 'soc-01',
    flat_id: 'f-101',
    flat_number: 'A-101',
    wing_name: 'Emerald (Wing A)',
    user_name: 'Rajesh Sharma',
    user_phone: '+91 98200 11223',
    maintenance_charge_id: 'ch-01',
    billing_month: '2026-09',
    amount: 2975,
    payment_date: '2026-09-04',
    payment_mode: 'UPI',
    reference_number: 'UPI/424912903421',
    receipt_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&q=80',
    receipt_number: 'REC-2026-0819',
    status: 'APPROVED',
    verified_by: 'Treasurer - Satish Deshmukh',
    verified_at: '2026-09-05T11:20:00Z',
    created_at: '2026-09-04T15:45:00Z',
  },
  {
    id: 'pay-02',
    society_id: 'soc-01',
    flat_id: 'f-b101',
    flat_number: 'B-101',
    wing_name: 'Sapphire (Wing B)',
    user_name: 'Vikram Joshi',
    user_phone: '+91 98111 22334',
    maintenance_charge_id: 'ch-04',
    billing_month: '2026-09',
    amount: 2600,
    payment_date: '2026-09-07',
    payment_mode: 'BANK_TRANSFER',
    reference_number: 'NEFT/HDFC98214300',
    receipt_number: 'REC-2026-0820',
    status: 'APPROVED',
    verified_by: 'Treasurer - Satish Deshmukh',
    verified_at: '2026-09-07T14:10:00Z',
    created_at: '2026-09-07T10:00:00Z',
  },
];

export async function getMaintenanceCharges(billingMonth: string = '2026-09'): Promise<MaintenanceChargeItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('maintenance_charges')
      .select('*, flats(flat_number, area_sqft, buildings(name))')
      .eq('billing_month', billingMonth);

    if (error || !data || data.length === 0) {
      return INITIAL_DEMO_CHARGES.filter((c) => c.billing_month === billingMonth) || INITIAL_DEMO_CHARGES;
    }

    return data.map((d: any) => ({
      ...d,
      flat_number: d.flats?.flat_number || 'Unit',
      wing_name: d.flats?.buildings?.name || 'Wing A',
      area_sqft: d.flats?.area_sqft || 850,
      resident_name: 'Occupant',
      resident_type: 'OWNER',
    }));
  } catch {
    return INITIAL_DEMO_CHARGES;
  }
}

export async function getPayments(): Promise<PaymentItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
    if (error || !data || data.length === 0) {
      return INITIAL_DEMO_PAYMENTS;
    }
    return data as any;
  } catch {
    return INITIAL_DEMO_PAYMENTS;
  }
}

