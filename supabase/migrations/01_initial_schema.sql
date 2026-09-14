-- ==============================================================================
-- 01_initial_schema.sql
-- Starcity Society Management System - Core Database Schema
-- ==============================================================================

-- Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Societies (Multi-tenant Root)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS societies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    registration_number VARCHAR(100),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    email VARCHAR(255),
    phone VARCHAR(50),
    logo_url TEXT,
    upi_id VARCHAR(100), -- Society VPA for UPI QR payments (e.g. starcity@sbi)
    billing_type VARCHAR(30) DEFAULT 'FLAT_RATE' CHECK (billing_type IN ('FLAT_RATE', 'PER_SQFT', 'HYBRID')),
    base_maintenance_amount NUMERIC(12, 2) DEFAULT 0.00,
    rate_per_sqft NUMERIC(8, 2) DEFAULT 0.00,
    parking_charge_2w NUMERIC(8, 2) DEFAULT 0.00,
    parking_charge_4w NUMERIC(8, 2) DEFAULT 0.00,
    due_day_of_month INTEGER DEFAULT 10 CHECK (due_day_of_month BETWEEN 1 AND 28),
    late_fee_amount NUMERIC(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Buildings / Wings
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- e.g. "Wing A", "Tower 1"
    floors INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(society_id, name)
);

-- ------------------------------------------------------------------------------
-- 3. Flats / Units
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS flats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    flat_number VARCHAR(50) NOT NULL, -- e.g. "A-101", "304"
    floor INTEGER NOT NULL,
    area_sqft NUMERIC(10, 2) NOT NULL DEFAULT 800.00,
    flat_type VARCHAR(50) DEFAULT '2BHK', -- '1BHK', '2BHK', '3BHK', 'VILLA', etc.
    status VARCHAR(30) DEFAULT 'OCCUPIED' CHECK (status IN ('OCCUPIED', 'VACANT', 'LOCKED')),
    reserved_parking_slots INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(building_id, flat_number)
);

-- ------------------------------------------------------------------------------
-- 4. Users (Profiles synchronized with Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. Society Members (Multi-Tenant Role Membership)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS society_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE', 'TREASURER', 'RESIDENT')),
    status VARCHAR(30) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'SUSPENDED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(society_id, user_id)
);

-- ------------------------------------------------------------------------------
-- 6. Occupancies (History Model - who lived where and when)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS occupancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    occupancy_type VARCHAR(30) NOT NULL CHECK (occupancy_type IN ('OWNER', 'TENANT')),
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. Family Members & Helpers
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS family_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    relationship VARCHAR(50) NOT NULL, -- e.g. 'Spouse', 'Child', 'Parent', 'Maid', 'Driver'
    phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. Maintenance Charges (Invoices)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS maintenance_charges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    billing_month VARCHAR(7) NOT NULL, -- 'YYYY-MM', e.g. '2026-09'
    base_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    area_amount NUMERIC(10, 2) DEFAULT 0.00,
    parking_amount NUMERIC(10, 2) DEFAULT 0.00,
    penalty_amount NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    due_date DATE NOT NULL,
    status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    -- STRICT IDEMPOTENCY: Prevent duplicate bills for the same flat in the same month
    CONSTRAINT unique_flat_monthly_charge UNIQUE (society_id, flat_id, billing_month)
);

-- ------------------------------------------------------------------------------
-- 9. Payments & Reconciliations
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    maintenance_charge_id UUID NOT NULL REFERENCES maintenance_charges(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_mode VARCHAR(30) NOT NULL CHECK (payment_mode IN ('UPI', 'BANK_TRANSFER', 'CASH', 'CHEQUE', 'OTHER')),
    reference_number VARCHAR(100), -- UTR or Cheque Number
    receipt_url TEXT, -- Screenshot / scanned copy in Supabase Storage
    receipt_number VARCHAR(100), -- Auto-assigned upon approval, e.g. "REC-2026-0012"
    status VARCHAR(30) DEFAULT 'PENDING_APPROVAL' CHECK (status IN ('PENDING_APPROVAL', 'APPROVED', 'REJECTED')),
    rejection_reason TEXT,
    notes TEXT,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 10. Income Categories & Income Ledger
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS income_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(society_id, name)
);

CREATE TABLE IF NOT EXISTS income (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES income_categories(id) ON DELETE RESTRICT,
    payment_id UUID REFERENCES payments(id) ON DELETE SET NULL, -- Linked to maintenance payment if applicable
    amount NUMERIC(12, 2) NOT NULL,
    income_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    reference VARCHAR(100),
    attachment_url TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 11. Expense Categories & Expense Ledger
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS expense_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(society_id, name)
);

CREATE TABLE IF NOT EXISTS expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES expense_categories(id) ON DELETE RESTRICT,
    amount NUMERIC(12, 2) NOT NULL,
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    vendor VARCHAR(255),
    invoice_number VARCHAR(100),
    description TEXT NOT NULL,
    attachment_url TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. Complaint Categories & Helpdesk
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS complaint_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(society_id, name)
);

CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number SERIAL,
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    flat_id UUID REFERENCES flats(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES complaint_categories(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255),
    priority VARCHAR(30) DEFAULT 'MEDIUM' CHECK (priority IN ('LOW', 'MEDIUM', 'HIGH', 'EMERGENCY')),
    status VARCHAR(30) DEFAULT 'NEW' CHECK (status IN ('NEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    resident_rating INTEGER CHECK (resident_rating BETWEEN 1 AND 5),
    closure_remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaint_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    comment TEXT NOT NULL,
    is_internal BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS complaint_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    complaint_id UUID NOT NULL REFERENCES complaints(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 13. Announcements & Events
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(30) DEFAULT 'NORMAL' CHECK (priority IN ('NORMAL', 'IMPORTANT', 'EMERGENCY')),
    attachment_url TEXT,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location VARCHAR(255),
    attachment_url TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 14. Document Vault
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('BYLAWS', 'AGM', 'FINANCIAL', 'NOTICE', 'FORM', 'OTHER')),
    file_url TEXT NOT NULL,
    visibility VARCHAR(30) DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'MEMBERS_ONLY', 'COMMITTEE_ONLY')),
    uploaded_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 15. Immutable Audit Logs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE', 'APPROVE_PAYMENT', etc.
    entity_type VARCHAR(100) NOT NULL, -- 'maintenance_charges', 'expenses', 'flats', etc.
    entity_id VARCHAR(100) NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 16. In-App Notifications
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'INFO', -- 'MAINTENANCE_DUE', 'PAYMENT_APPROVED', 'COMPLAINT_UPDATE', 'EMERGENCY'
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 17. High Performance Database Indexes
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_flats_society_building ON flats(society_id, building_id);
CREATE INDEX IF NOT EXISTS idx_society_members_user ON society_members(user_id, society_id);
CREATE INDEX IF NOT EXISTS idx_occupancies_flat_user ON occupancies(flat_id, user_id, is_current);
CREATE INDEX IF NOT EXISTS idx_maintenance_charges_flat ON maintenance_charges(flat_id, billing_month);
CREATE INDEX IF NOT EXISTS idx_payments_charge_id ON payments(maintenance_charge_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(society_id, status);
CREATE INDEX IF NOT EXISTS idx_income_society_date ON income(society_id, income_date);
CREATE INDEX IF NOT EXISTS idx_expenses_society_date ON expenses(society_id, expense_date);
CREATE INDEX IF NOT EXISTS idx_complaints_society_status ON complaints(society_id, status);
CREATE INDEX IF NOT EXISTS idx_announcements_society ON announcements(society_id, published_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_society_entity ON audit_logs(society_id, entity_type, entity_id);

