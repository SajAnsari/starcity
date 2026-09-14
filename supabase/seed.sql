-- ==============================================================================
-- seed.sql
-- Demo Seed Data for Starcity Society Management System
-- ==============================================================================

-- 1. Insert Sample Society
INSERT INTO societies (
    id, 
    name, 
    registration_number, 
    address, 
    city, 
    state, 
    pincode, 
    email, 
    phone, 
    upi_id, 
    billing_type, 
    base_maintenance_amount, 
    rate_per_sqft, 
    parking_charge_2w, 
    parking_charge_4w, 
    due_day_of_month, 
    late_fee_amount
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Starcity Heights Co-operative Housing Society',
    'BOM/GEN/12345/2020',
    'Plot 42, Palm Beach Road, Sector 18',
    'Navi Mumbai',
    'Maharashtra',
    '400705',
    'contact@starcityheights.org',
    '+91 98765 43210',
    'starcity@sbi',
    'HYBRID',
    1500.00,
    1.50,
    200.00,
    500.00,
    10,
    100.00
) ON CONFLICT (id) DO NOTHING;

-- 2. Insert Buildings / Wings
INSERT INTO buildings (id, society_id, name, floors) VALUES
    ('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'A Wing (Emerald)', 7),
    ('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'B Wing (Sapphire)', 7)
ON CONFLICT (society_id, name) DO NOTHING;

-- 3. Insert Flats
INSERT INTO flats (id, society_id, building_id, flat_number, floor, area_sqft, flat_type, status, reserved_parking_slots) VALUES
    ('f0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'A-101', 1, 850.00, '2BHK', 'OCCUPIED', 1),
    ('f0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'A-102', 1, 850.00, '2BHK', 'OCCUPIED', 1),
    ('f0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000001', 'A-201', 2, 1200.00, '3BHK', 'OCCUPIED', 2),
    ('f0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'B-101', 1, 600.00, '1BHK', 'OCCUPIED', 1),
    ('f0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'B-102', 1, 850.00, '2BHK', 'VACANT', 0)
ON CONFLICT (building_id, flat_number) DO NOTHING;

-- 4. Default Income Categories
INSERT INTO income_categories (society_id, name, is_system) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Maintenance Collection', true),
    ('a0000000-0000-0000-0000-000000000001', 'Clubhouse / Hall Booking', false),
    ('a0000000-0000-0000-0000-000000000001', 'Extra Parking Charges', false),
    ('a0000000-0000-0000-0000-000000000001', 'Bank Interest', false),
    ('a0000000-0000-0000-0000-000000000001', 'Late Payment Penalties', false),
    ('a0000000-0000-0000-0000-000000000001', 'Miscellaneous Income', false)
ON CONFLICT (society_id, name) DO NOTHING;

-- 5. Default Expense Categories
INSERT INTO expense_categories (society_id, name) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Security Agency Wages'),
    ('a0000000-0000-0000-0000-000000000001', 'Common Electricity & Backup DG'),
    ('a0000000-0000-0000-0000-000000000001', 'Housekeeping & Garbage Disposal'),
    ('a0000000-0000-0000-0000-000000000001', 'Lift AMC & Servicing'),
    ('a0000000-0000-0000-0000-000000000001', 'Water Tank Cleaning & Pump Repair'),
    ('a0000000-0000-0000-0000-000000000001', 'Gardening & Pest Control'),
    ('a0000000-0000-0000-0000-000000000001', 'Auditing & Accounting Fees'),
    ('a0000000-0000-0000-0000-000000000001', 'Miscellaneous Maintenance')
ON CONFLICT (society_id, name) DO NOTHING;

-- 6. Default Complaint Categories
INSERT INTO complaint_categories (society_id, name) VALUES
    ('a0000000-0000-0000-0000-000000000001', 'Plumbing & Water Seepage'),
    ('a0000000-0000-0000-0000-000000000001', 'Electrical & Corridor Lights'),
    ('a0000000-0000-0000-0000-000000000001', 'Lift Breakdown'),
    ('a0000000-0000-0000-0000-000000000001', 'Security & Gate Vigilance'),
    ('a0000000-0000-0000-0000-000000000001', 'Housekeeping & Cleanliness'),
    ('a0000000-0000-0000-0000-000000000001', 'Parking Obstruction'),
    ('a0000000-0000-0000-0000-000000000001', 'Noise & Nuisance'),
    ('a0000000-0000-0000-0000-000000000001', 'Other')
ON CONFLICT (society_id, name) DO NOTHING;

-- 7. Sample Announcement
INSERT INTO announcements (
    society_id, 
    title, 
    description, 
    priority, 
    published_at
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Upcoming Annual General Meeting (AGM) 2026',
    'The Annual General Body Meeting for Starcity Heights is scheduled for Sunday, September 27th, at 10:30 AM in the Clubhouse. All flat owners are requested to attend.',
    'IMPORTANT',
    NOW()
);

-- 8. Sample Event
INSERT INTO events (
    society_id, 
    title, 
    description, 
    event_date, 
    start_time, 
    end_time, 
    location
) VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Society Pest Control Drive',
    'Society-wide pest control in all common stairways, duct areas, and parking levels.',
    CURRENT_DATE + INTERVAL '5 days',
    '10:00:00',
    '16:00:00',
    'Wings A & B Common Areas'
);

