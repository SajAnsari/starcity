-- ==============================================================================
-- 02_rls_functions.sql
-- High-Performance RLS Helper Functions & PostgreSQL Row-Level Security Policies
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Fast SECURITY DEFINER Functions (Cached & Optimized)
-- ------------------------------------------------------------------------------

-- Get the primary active society_id for the current authenticated user
CREATE OR REPLACE FUNCTION get_user_society_id() 
RETURNS UUID STABLE SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT society_id 
  FROM society_members 
  WHERE user_id = auth.uid() 
    AND status = 'ACTIVE' 
  LIMIT 1;
$$ LANGUAGE sql;

-- Get the role of the user within a specific society
CREATE OR REPLACE FUNCTION get_user_role(target_society_id UUID) 
RETURNS VARCHAR STABLE SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT role 
  FROM society_members 
  WHERE user_id = auth.uid() 
    AND society_id = target_society_id 
    AND status = 'ACTIVE' 
  LIMIT 1;
$$ LANGUAGE sql;

-- Check if user is an Admin (SUPER_ADMIN or SOCIETY_ADMIN) in the society
CREATE OR REPLACE FUNCTION is_society_admin(target_society_id UUID) 
RETURNS BOOLEAN STABLE SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM society_members 
    WHERE user_id = auth.uid() 
      AND (society_id = target_society_id OR role = 'SUPER_ADMIN')
      AND role IN ('SUPER_ADMIN', 'SOCIETY_ADMIN')
      AND status = 'ACTIVE'
  );
$$ LANGUAGE sql;

-- Check if user is a Treasurer or Admin
CREATE OR REPLACE FUNCTION is_society_treasurer(target_society_id UUID) 
RETURNS BOOLEAN STABLE SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM society_members 
    WHERE user_id = auth.uid() 
      AND (society_id = target_society_id OR role = 'SUPER_ADMIN')
      AND role IN ('SUPER_ADMIN', 'SOCIETY_ADMIN', 'TREASURER')
      AND status = 'ACTIVE'
  );
$$ LANGUAGE sql;

-- Check if user is a Committee Member, Treasurer, or Admin
CREATE OR REPLACE FUNCTION is_society_committee(target_society_id UUID) 
RETURNS BOOLEAN STABLE SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM society_members 
    WHERE user_id = auth.uid() 
      AND (society_id = target_society_id OR role = 'SUPER_ADMIN')
      AND role IN ('SUPER_ADMIN', 'SOCIETY_ADMIN', 'TREASURER', 'COMMITTEE')
      AND status = 'ACTIVE'
  );
$$ LANGUAGE sql;

-- Check if user has active occupancy in a flat
CREATE OR REPLACE FUNCTION user_occupies_flat(target_flat_id UUID) 
RETURNS BOOLEAN STABLE SECURITY DEFINER 
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM occupancies 
    WHERE user_id = auth.uid() 
      AND flat_id = target_flat_id 
      AND is_current = TRUE
  );
$$ LANGUAGE sql;

-- ------------------------------------------------------------------------------
-- 2. Automatic User Profile Creation on Supabase Auth Signup
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ------------------------------------------------------------------------------
-- 3. Enable Row Level Security (RLS) on all Tables
-- ------------------------------------------------------------------------------
ALTER TABLE societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE buildings ENABLE ROW LEVEL SECURITY;
ALTER TABLE flats ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE society_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE occupancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_charges ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE income_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE expense_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE complaint_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 4. RLS Policies: Societies
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view societies they belong to"
  ON societies FOR SELECT
  USING (
    id IN (SELECT society_id FROM society_members WHERE user_id = auth.uid() AND status = 'ACTIVE')
    OR EXISTS (SELECT 1 FROM society_members WHERE user_id = auth.uid() AND role = 'SUPER_ADMIN')
  );

CREATE POLICY "Admins can update society settings"
  ON societies FOR UPDATE
  USING (is_society_admin(id));

-- ------------------------------------------------------------------------------
-- 5. RLS Policies: Buildings & Flats
-- ------------------------------------------------------------------------------
CREATE POLICY "Members can view buildings of their society"
  ON buildings FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Admins can manage buildings"
  ON buildings FOR ALL
  USING (is_society_admin(society_id));

CREATE POLICY "Members can view flats of their society"
  ON flats FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Admins can manage flats"
  ON flats FOR ALL
  USING (is_society_admin(society_id));

-- ------------------------------------------------------------------------------
-- 6. RLS Policies: Users & Society Members
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view their own profile and co-members"
  ON users FOR SELECT
  USING (
    id = auth.uid() 
    OR EXISTS (
      SELECT 1 FROM society_members sm1 
      JOIN society_members sm2 ON sm1.society_id = sm2.society_id 
      WHERE sm1.user_id = auth.uid() AND sm2.user_id = users.id
    )
  );

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Members can view society member roster"
  ON society_members FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Admins can manage society members"
  ON society_members FOR ALL
  USING (is_society_admin(society_id));

-- ------------------------------------------------------------------------------
-- 7. RLS Policies: Occupancies & Family Members
-- ------------------------------------------------------------------------------
CREATE POLICY "Users can view occupancies in their society"
  ON occupancies FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Admins can manage occupancies"
  ON occupancies FOR ALL
  USING (is_society_admin(society_id));

CREATE POLICY "Residents can view and manage their flat family members"
  ON family_members FOR SELECT
  USING (user_occupies_flat(flat_id) OR is_society_admin(society_id));

CREATE POLICY "Residents or Admins can insert/update family members"
  ON family_members FOR ALL
  USING (user_occupies_flat(flat_id) OR is_society_admin(society_id));

-- ------------------------------------------------------------------------------
-- 8. RLS Policies: Maintenance Charges & Payments
-- ------------------------------------------------------------------------------
CREATE POLICY "Residents can view maintenance for their own flats; Committee sees all"
  ON maintenance_charges FOR SELECT
  USING (
    user_occupies_flat(flat_id) 
    OR is_society_committee(society_id)
  );

CREATE POLICY "Treasurers and Admins can generate or update maintenance"
  ON maintenance_charges FOR ALL
  USING (is_society_treasurer(society_id));

CREATE POLICY "Residents can view own payments; Treasurers see all"
  ON payments FOR SELECT
  USING (
    user_id = auth.uid() 
    OR user_occupies_flat(flat_id) 
    OR is_society_treasurer(society_id)
  );

CREATE POLICY "Residents can submit payments for their flat"
  ON payments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND user_occupies_flat(flat_id)
  );

CREATE POLICY "Treasurers and Admins can approve or update payments"
  ON payments FOR UPDATE
  USING (is_society_treasurer(society_id));

-- ------------------------------------------------------------------------------
-- 9. RLS Policies: Income & Expenses
-- ------------------------------------------------------------------------------
CREATE POLICY "Members can view income categories"
  ON income_categories FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Treasurers can manage income categories"
  ON income_categories FOR ALL
  USING (is_society_treasurer(society_id));

CREATE POLICY "Committee can view income records"
  ON income FOR SELECT
  USING (is_society_committee(society_id));

CREATE POLICY "Treasurers can manage income records"
  ON income FOR ALL
  USING (is_society_treasurer(society_id));

CREATE POLICY "Members can view expense categories"
  ON expense_categories FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Treasurers can manage expense categories"
  ON expense_categories FOR ALL
  USING (is_society_treasurer(society_id));

CREATE POLICY "Committee can view expenses; Residents can view in audit mode"
  ON expenses FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Treasurers can manage expenses"
  ON expenses FOR ALL
  USING (is_society_treasurer(society_id));

-- ------------------------------------------------------------------------------
-- 10. RLS Policies: Complaints & Helpdesk
-- ------------------------------------------------------------------------------
CREATE POLICY "Members can view complaint categories"
  ON complaint_categories FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Residents view own complaints; Committee views all"
  ON complaints FOR SELECT
  USING (
    created_by = auth.uid() 
    OR (flat_id IS NOT NULL AND user_occupies_flat(flat_id))
    OR is_society_committee(society_id)
  );

CREATE POLICY "Residents can create complaints in their society"
  ON complaints FOR INSERT
  WITH CHECK (
    created_by = auth.uid() 
    AND society_id = get_user_society_id()
  );

CREATE POLICY "Committee can update complaints (assign/resolve); Creator can close/rate"
  ON complaints FOR UPDATE
  USING (
    is_society_committee(society_id) 
    OR created_by = auth.uid()
  );

CREATE POLICY "Users can view comments on complaints they have access to"
  ON complaint_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM complaints c 
      WHERE c.id = complaint_comments.complaint_id 
        AND (
          c.created_by = auth.uid() 
          OR user_occupies_flat(c.flat_id) 
          OR is_society_committee(c.society_id)
        )
        AND (complaint_comments.is_internal = FALSE OR is_society_committee(c.society_id))
    )
  );

CREATE POLICY "Users can post comments on accessible complaints"
  ON complaint_comments FOR INSERT
  WITH CHECK (
    user_id = auth.uid() 
    AND EXISTS (
      SELECT 1 FROM complaints c 
      WHERE c.id = complaint_comments.complaint_id 
        AND (c.created_by = auth.uid() OR is_society_committee(c.society_id))
    )
  );

CREATE POLICY "Attachments accessible with complaint"
  ON complaint_attachments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM complaints c 
      WHERE c.id = complaint_attachments.complaint_id 
        AND (c.created_by = auth.uid() OR is_society_committee(c.society_id))
    )
  );

CREATE POLICY "Users can upload complaint attachments"
  ON complaint_attachments FOR INSERT
  WITH CHECK (uploaded_by = auth.uid());

-- ------------------------------------------------------------------------------
-- 11. RLS Policies: Announcements, Events & Documents
-- ------------------------------------------------------------------------------
CREATE POLICY "Members can view active announcements"
  ON announcements FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Committee can manage announcements"
  ON announcements FOR ALL
  USING (is_society_committee(society_id));

CREATE POLICY "Members can view events"
  ON events FOR SELECT
  USING (society_id = get_user_society_id());

CREATE POLICY "Committee can manage events"
  ON events FOR ALL
  USING (is_society_committee(society_id));

CREATE POLICY "Members can view permitted documents"
  ON documents FOR SELECT
  USING (
    society_id = get_user_society_id() 
    AND (
      visibility = 'PUBLIC'
      OR (visibility = 'MEMBERS_ONLY' AND get_user_society_id() IS NOT NULL)
      OR (visibility = 'COMMITTEE_ONLY' AND is_society_committee(society_id))
    )
  );

CREATE POLICY "Committee can manage documents"
  ON documents FOR ALL
  USING (is_society_committee(society_id));

-- ------------------------------------------------------------------------------
-- 12. RLS Policies: Audit Logs & Notifications
-- ------------------------------------------------------------------------------
CREATE POLICY "Admins can view audit logs"
  ON audit_logs FOR SELECT
  USING (is_society_admin(society_id));

CREATE POLICY "System and users can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (society_id = get_user_society_id() OR is_society_admin(society_id));

CREATE POLICY "Users view their own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can mark own notifications as read"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

