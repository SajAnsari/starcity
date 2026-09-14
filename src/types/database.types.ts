export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'SUPER_ADMIN' | 'SOCIETY_ADMIN' | 'COMMITTEE' | 'TREASURER' | 'RESIDENT';
export type MemberStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type OccupancyType = 'OWNER' | 'TENANT';
export type BillingType = 'FLAT_RATE' | 'PER_SQFT' | 'HYBRID';
export type MaintenanceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
export type PaymentMode = 'UPI' | 'BANK_TRANSFER' | 'CASH' | 'CHEQUE' | 'OTHER';
export type PaymentStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'EMERGENCY';
export type ComplaintStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type NoticePriority = 'NORMAL' | 'IMPORTANT' | 'EMERGENCY';
export type DocumentCategory = 'BYLAWS' | 'AGM' | 'FINANCIAL' | 'NOTICE' | 'FORM' | 'OTHER';
export type DocumentVisibility = 'PUBLIC' | 'MEMBERS_ONLY' | 'COMMITTEE_ONLY';

export interface Database {
  public: {
    Tables: {
      societies: {
        Row: {
          id: string;
          name: string;
          registration_number: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          pincode: string | null;
          email: string | null;
          phone: string | null;
          logo_url: string | null;
          upi_id: string | null;
          billing_type: BillingType;
          base_maintenance_amount: number;
          rate_per_sqft: number;
          parking_charge_2w: number;
          parking_charge_4w: number;
          due_day_of_month: number;
          late_fee_amount: number;
          currency: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['societies']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['societies']['Insert']>;
      };
      buildings: {
        Row: {
          id: string;
          society_id: string;
          name: string;
          floors: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['buildings']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['buildings']['Insert']>;
      };
      flats: {
        Row: {
          id: string;
          society_id: string;
          building_id: string;
          flat_number: string;
          floor: number;
          area_sqft: number;
          flat_type: string;
          status: 'OCCUPIED' | 'VACANT' | 'LOCKED';
          reserved_parking_slots: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['flats']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['flats']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['users']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      society_members: {
        Row: {
          id: string;
          society_id: string;
          user_id: string;
          role: UserRole;
          status: MemberStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['society_members']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['society_members']['Insert']>;
      };
      occupancies: {
        Row: {
          id: string;
          society_id: string;
          flat_id: string;
          user_id: string;
          occupancy_type: OccupancyType;
          start_date: string;
          end_date: string | null;
          is_current: boolean;
          is_primary: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['occupancies']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['occupancies']['Insert']>;
      };
      maintenance_charges: {
        Row: {
          id: string;
          society_id: string;
          flat_id: string;
          billing_month: string;
          base_amount: number;
          area_amount: number;
          parking_amount: number;
          penalty_amount: number;
          total_amount: number;
          due_date: string;
          status: MaintenanceStatus;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['maintenance_charges']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['maintenance_charges']['Insert']>;
      };
      payments: {
        Row: {
          id: string;
          society_id: string;
          flat_id: string;
          user_id: string;
          maintenance_charge_id: string;
          amount: number;
          payment_date: string;
          payment_mode: PaymentMode;
          reference_number: string | null;
          receipt_url: string | null;
          receipt_number: string | null;
          status: PaymentStatus;
          rejection_reason: string | null;
          notes: string | null;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['payments']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['payments']['Insert']>;
      };
      complaints: {
        Row: {
          id: string;
          ticket_number: number;
          society_id: string;
          flat_id: string | null;
          created_by: string;
          category_id: string;
          title: string;
          description: string;
          location: string | null;
          priority: ComplaintPriority;
          status: ComplaintStatus;
          assigned_to: string | null;
          resolved_at: string | null;
          resident_rating: number | null;
          closure_remarks: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['complaints']['Row'], 'id' | 'ticket_number' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['complaints']['Insert']>;
      };
      announcements: {
        Row: {
          id: string;
          society_id: string;
          title: string;
          description: string;
          priority: NoticePriority;
          attachment_url: string | null;
          published_at: string;
          expires_at: string | null;
          created_by: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['announcements']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['announcements']['Insert']>;
      };
    };
  };
}

