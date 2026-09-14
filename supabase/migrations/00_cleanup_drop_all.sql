-- ==============================================================================
-- 00_cleanup_drop_all.sql
-- Clean Reset: Drops all Starcity tables, triggers, and helper functions
-- ==============================================================================

-- 1. Drop trigger on Supabase auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop helper and security functions
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS get_user_society_id() CASCADE;
DROP FUNCTION IF EXISTS get_user_role() CASCADE;
DROP FUNCTION IF EXISTS is_society_admin() CASCADE;
DROP FUNCTION IF EXISTS is_society_treasurer() CASCADE;
DROP FUNCTION IF EXISTS is_society_member() CASCADE;

-- 3. Drop all application tables in cascade order
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS documents CASCADE;
DROP TABLE IF EXISTS events CASCADE;
DROP TABLE IF EXISTS announcements CASCADE;
DROP TABLE IF EXISTS complaint_attachments CASCADE;
DROP TABLE IF EXISTS complaint_comments CASCADE;
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS complaint_categories CASCADE;
DROP TABLE IF EXISTS expenses CASCADE;
DROP TABLE IF EXISTS expense_categories CASCADE;
DROP TABLE IF EXISTS income CASCADE;
DROP TABLE IF EXISTS income_categories CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS maintenance_charges CASCADE;
DROP TABLE IF EXISTS family_members CASCADE;
DROP TABLE IF EXISTS occupancies CASCADE;
DROP TABLE IF EXISTS society_members CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS flats CASCADE;
DROP TABLE IF EXISTS buildings CASCADE;
DROP TABLE IF EXISTS societies CASCADE;

-- 4. (Optional) Wipe test user logins from Supabase Auth
-- Uncomment the line below if you also want to remove all created auth users:
-- DELETE FROM auth.users;

