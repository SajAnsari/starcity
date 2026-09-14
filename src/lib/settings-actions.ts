export interface SocietyProfile {
  name: string;
  registration_number: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  phone: string;
  established_year: number;
  total_flats: number;
  total_wings: number;
}

export interface BillingRules {
  billing_type: 'FLAT_RATE' | 'PER_SQFT' | 'HYBRID';
  base_maintenance_amount: number;
  rate_per_sqft: number;
  parking_charge_2w: number;
  parking_charge_4w: number;
  due_day_of_month: number;
  late_fee_amount: number;
  sinking_fund_percentage: number;
}

export interface BankUpiConfig {
  upi_id: string;
  payee_name: string;
  bank_name: string;
  account_number: string;
  ifsc_code: string;
  branch: string;
  account_type: 'CURRENT' | 'SAVINGS';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user_name: string;
  user_role: 'SUPER_ADMIN' | 'ADMIN' | 'TREASURER' | 'COMMITTEE' | 'RESIDENT';
  action: 
    | 'APPROVE_PAYMENT' 
    | 'REJECT_PAYMENT' 
    | 'CREATE_EXPENSE_VOUCHER' 
    | 'RECORD_SUNDRY_INCOME' 
    | 'UPDATE_OCCUPANCY' 
    | 'UPDATE_TICKET_STATUS' 
    | 'PUBLISH_NOTICE' 
    | 'CREATE_EVENT' 
    | 'UPLOAD_DOCUMENT' 
    | 'UPDATE_SETTINGS' 
    | 'USER_LOGIN';
  entity_type: string;
  entity_id: string;
  details: string;
  ip_address: string;
}

export interface KeepaliveStatus {
  status: 'ACTIVE' | 'DEGRADED' | 'PAUSED';
  last_ping: string;
  next_ping: string;
  target_url: string;
  interval: string;
  provider: string;
  response_time_ms: number;
}

export const INITIAL_SOCIETY_PROFILE: SocietyProfile = {
  name: 'Starcity Heights Co-operative Housing Society Ltd.',
  registration_number: 'BOM/HSG/TC/19829/2020',
  address: 'Plot 12-14, Sector 19, Palm Beach Road, Seawoods',
  city: 'Navi Mumbai',
  state: 'Maharashtra',
  pincode: '400706',
  email: 'committee@starcityheights.org',
  phone: '+91 22 2772 9001',
  established_year: 2020,
  total_flats: 48,
  total_wings: 2,
};

export const INITIAL_BILLING_RULES: BillingRules = {
  billing_type: 'HYBRID',
  base_maintenance_amount: 1500,
  rate_per_sqft: 1.5,
  parking_charge_2w: 200,
  parking_charge_4w: 500,
  due_day_of_month: 10,
  late_fee_amount: 150,
  sinking_fund_percentage: 0.25,
};

export const INITIAL_BANK_UPI_CONFIG: BankUpiConfig = {
  upi_id: 'starcity@sbi',
  payee_name: 'STARCITY HEIGHTS CHS LTD',
  bank_name: 'State Bank of India',
  account_number: '39821049281',
  ifsc_code: 'SBIN0004921',
  branch: 'Seawoods West Branch, Navi Mumbai',
  account_type: 'CURRENT',
};

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-01',
    timestamp: '2026-09-11T11:45:10Z',
    user_name: 'Satish Deshmukh',
    user_role: 'TREASURER',
    action: 'CREATE_EXPENSE_VOUCHER',
    entity_type: 'expenses',
    entity_id: 'VCH-2026-0108',
    details: 'Posted ₹6,000 for Auditing & Accounting Fees to K.R. Mehta & Associates CA',
    ip_address: '103.21.144.12',
  },
  {
    id: 'log-02',
    timestamp: '2026-09-11T10:15:34Z',
    user_name: 'Nitin Gadkari',
    user_role: 'ADMIN',
    action: 'PUBLISH_NOTICE',
    entity_type: 'announcements',
    entity_id: 'not-01',
    details: 'Broadcasted EMERGENCY notice: Scheduled Overhead Water Tank Cleaning on Sept 14th',
    ip_address: '103.21.144.18',
  },
  {
    id: 'log-03',
    timestamp: '2026-09-10T16:30:20Z',
    user_name: 'Satish Deshmukh',
    user_role: 'TREASURER',
    action: 'APPROVE_PAYMENT',
    entity_type: 'payments',
    entity_id: 'REC-2026-0820',
    details: 'Verified and approved ₹2,600 maintenance payment for Flat B-101 (Vikram Joshi)',
    ip_address: '103.21.144.12',
  },
  {
    id: 'log-04',
    timestamp: '2026-09-10T14:22:05Z',
    user_name: 'Priya Kulkarni',
    user_role: 'COMMITTEE',
    action: 'UPDATE_TICKET_STATUS',
    entity_type: 'complaints',
    entity_id: 'TKT-104',
    details: 'Changed status from NEW to ASSIGNED and assigned Society Plumber (Ramesh)',
    ip_address: '14.139.122.9',
  },
  {
    id: 'log-05',
    timestamp: '2026-09-09T13:10:45Z',
    user_name: 'Satish Deshmukh',
    user_role: 'TREASURER',
    action: 'RECORD_SUNDRY_INCOME',
    entity_type: 'income',
    entity_id: 'INC-2026-0045',
    details: 'Recorded ₹25,000 Flat Transfer Fee / NOC for Buyer Flat B-201 (Amit Shah)',
    ip_address: '103.21.144.12',
  },
  {
    id: 'log-06',
    timestamp: '2026-09-08T18:05:12Z',
    user_name: 'Nitin Gadkari',
    user_role: 'ADMIN',
    action: 'UPLOAD_DOCUMENT',
    entity_type: 'documents',
    entity_id: 'doc-01',
    details: 'Uploaded Model Bye-Laws 2026 (Maharashtra Co-operative Societies Act)',
    ip_address: '103.21.144.18',
  },
  {
    id: 'log-07',
    timestamp: '2026-09-07T09:40:18Z',
    user_name: 'Satish Deshmukh',
    user_role: 'TREASURER',
    action: 'APPROVE_PAYMENT',
    entity_type: 'payments',
    entity_id: 'REC-2026-0819',
    details: 'Verified and minted receipt REC-2026-0819 for ₹2,975 (Flat A-101 - Rajesh Sharma)',
    ip_address: '103.21.144.12',
  },
  {
    id: 'log-08',
    timestamp: '2026-09-06T11:00:00Z',
    user_name: 'Nitin Gadkari',
    user_role: 'ADMIN',
    action: 'CREATE_EVENT',
    entity_type: 'events',
    entity_id: 'evt-01',
    details: 'Scheduled Annual General Body Meeting (AGM 2026) for Sunday Sept 27th',
    ip_address: '103.21.144.18',
  },
  {
    id: 'log-09',
    timestamp: '2026-09-05T15:12:33Z',
    user_name: 'Rajesh Sharma',
    user_role: 'RESIDENT',
    action: 'USER_LOGIN',
    entity_type: 'users',
    entity_id: 'u-101',
    details: 'Resident logged into Flat A-101 portal session',
    ip_address: '49.36.182.44',
  },
  {
    id: 'log-10',
    timestamp: '2026-09-04T12:00:19Z',
    user_name: 'Nitin Gadkari',
    user_role: 'ADMIN',
    action: 'UPDATE_SETTINGS',
    entity_type: 'societies',
    entity_id: 'soc-01',
    details: 'Updated UPI VPA ID to starcity@sbi and set late fee amount to ₹150',
    ip_address: '103.21.144.18',
  }
];

export const INITIAL_KEEPALIVE_STATUS: KeepaliveStatus = {
  status: 'ACTIVE',
  last_ping: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
  next_ping: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
  target_url: 'https://starcity-society.vercel.app/api/health',
  interval: 'Every 3 Days (0 0 */3 * *) via Vercel Cron',
  provider: 'Vercel Edge Cron & Supabase pg_cron',
  response_time_ms: 142,
};

let liveProfile = { ...INITIAL_SOCIETY_PROFILE };
let liveRules = { ...INITIAL_BILLING_RULES };
let liveBankUpi = { ...INITIAL_BANK_UPI_CONFIG };
let liveLogs = [...INITIAL_AUDIT_LOGS];

export function getSocietyProfile(): SocietyProfile {
  return { ...liveProfile };
}

export function updateSocietyProfile(profile: Partial<SocietyProfile>): SocietyProfile {
  liveProfile = { ...liveProfile, ...profile };
  addAuditLog({
    user_name: 'Nitin Gadkari',
    user_role: 'ADMIN',
    action: 'UPDATE_SETTINGS',
    entity_type: 'societies',
    entity_id: 'soc-01',
    details: `Updated society profile details (${Object.keys(profile).join(', ')})`,
    ip_address: '103.21.144.18',
  });
  return { ...liveProfile };
}

export function getBillingRules(): BillingRules {
  return { ...liveRules };
}

export function updateBillingRules(rules: Partial<BillingRules>): BillingRules {
  liveRules = { ...liveRules, ...rules };
  addAuditLog({
    user_name: 'Satish Deshmukh',
    user_role: 'TREASURER',
    action: 'UPDATE_SETTINGS',
    entity_type: 'societies',
    entity_id: 'billing_config',
    details: `Modified maintenance billing rules formula to ${liveRules.billing_type}`,
    ip_address: '103.21.144.12',
  });
  return { ...liveRules };
}

export function getBankUpiConfig(): BankUpiConfig {
  return { ...liveBankUpi };
}

export function updateBankUpiConfig(config: Partial<BankUpiConfig>): BankUpiConfig {
  liveBankUpi = { ...liveBankUpi, ...config };
  addAuditLog({
    user_name: 'Satish Deshmukh',
    user_role: 'TREASURER',
    action: 'UPDATE_SETTINGS',
    entity_type: 'societies',
    entity_id: 'bank_upi',
    details: `Updated UPI VPA ID to ${liveBankUpi.upi_id} and Bank A/c ${liveBankUpi.account_number}`,
    ip_address: '103.21.144.12',
  });
  return { ...liveBankUpi };
}

export function getAuditLogs(): AuditLogEntry[] {
  return [...liveLogs];
}

export function addAuditLog(log: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const newEntry: AuditLogEntry = {
    ...log,
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  liveLogs = [newEntry, ...liveLogs];
  return newEntry;
}

export function getKeepaliveStatus(): KeepaliveStatus {
  return { ...INITIAL_KEEPALIVE_STATUS };
}

