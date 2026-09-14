-- ==============================================================================
-- 03_storage_buckets.sql
-- Supabase Storage Buckets & Access Security Policies
-- ==============================================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('receipts', 'receipts', false),
  ('complaints', 'complaints', false),
  ('documents', 'documents', false),
  ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies: Avatars (Public Read, Owner Update)
CREATE POLICY "Public avatar access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- 3. Storage Policies: Receipts (Private)
-- Residents can upload receipts
CREATE POLICY "Authenticated residents upload payment receipts"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'receipts' AND auth.role() = 'authenticated');

-- Users can view receipts they uploaded or Treasurers can view all
CREATE POLICY "View payment receipts"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'receipts' 
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM public.society_members 
        WHERE user_id = auth.uid() 
          AND role IN ('SUPER_ADMIN', 'SOCIETY_ADMIN', 'TREASURER')
      )
    )
  );

-- 4. Storage Policies: Complaints
CREATE POLICY "Upload complaint attachments"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'complaints' AND auth.role() = 'authenticated');

CREATE POLICY "View complaint attachments"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'complaints' AND auth.role() = 'authenticated');

-- 5. Storage Policies: Documents Vault
CREATE POLICY "Committee members upload society documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'documents' 
    AND EXISTS (
      SELECT 1 FROM public.society_members 
      WHERE user_id = auth.uid() 
        AND role IN ('SUPER_ADMIN', 'SOCIETY_ADMIN', 'COMMITTEE', 'TREASURER')
    )
  );

CREATE POLICY "Members view society documents"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

