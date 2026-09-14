-- ==============================================================================
-- 04_user_roles.sql
-- Role Standardization & Default Member Role on User Registration
-- Roles: 'ADMIN', 'SECRETARY', 'MEMBER'
-- ==============================================================================

-- 1. Update society_members table role check constraint
ALTER TABLE society_members DROP CONSTRAINT IF EXISTS society_members_role_check;
ALTER TABLE society_members ADD CONSTRAINT society_members_role_check 
  CHECK (role IN ('ADMIN', 'SECRETARY', 'MEMBER', 'SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE', 'TREASURER', 'RESIDENT'));

-- Set default role to 'MEMBER'
ALTER TABLE society_members ALTER COLUMN role SET DEFAULT 'MEMBER';

-- 2. Update automatic signup trigger to assign 'MEMBER' role by default
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  default_society_id UUID;
  assigned_role VARCHAR(50);
BEGIN
  -- Determine role: default to 'MEMBER' unless explicitly specified
  assigned_role := COALESCE(NEW.raw_user_meta_data->>'role', 'MEMBER');
  IF assigned_role NOT IN ('ADMIN', 'SECRETARY', 'MEMBER') THEN
    assigned_role := 'MEMBER';
  END IF;

  -- 1. Insert or update public.users profile
  INSERT INTO public.users (id, email, full_name, phone, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'phone',
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE 
  SET 
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    avatar_url = EXCLUDED.avatar_url,
    updated_at = NOW();

  -- 2. Find primary society
  SELECT id INTO default_society_id FROM public.societies LIMIT 1;

  -- 3. Automatically add to society_members as 'MEMBER' by default
  IF default_society_id IS NOT NULL THEN
    INSERT INTO public.society_members (society_id, user_id, role, status)
    VALUES (
      default_society_id,
      NEW.id,
      assigned_role,
      'ACTIVE'
    )
    ON CONFLICT (society_id, user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Re-attach trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 3. Policy: Only ADMIN can view and modify all society members
DROP POLICY IF EXISTS "Admins can update society members" ON society_members;
CREATE POLICY "Admins can update society members"
  ON society_members FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM society_members sm 
      WHERE sm.user_id = auth.uid() 
        AND sm.society_id = society_members.society_id
        AND sm.role IN ('ADMIN', 'SUPER_ADMIN', 'SOCIETY_ADMIN')
        AND sm.status = 'ACTIVE'
    )
  );

DROP POLICY IF EXISTS "Admins can insert society members" ON society_members;
CREATE POLICY "Admins can insert society members"
  ON society_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM society_members sm 
      WHERE sm.user_id = auth.uid() 
        AND sm.society_id = society_members.society_id
        AND sm.role IN ('ADMIN', 'SUPER_ADMIN', 'SOCIETY_ADMIN')
        AND sm.status = 'ACTIVE'
    )
  );

