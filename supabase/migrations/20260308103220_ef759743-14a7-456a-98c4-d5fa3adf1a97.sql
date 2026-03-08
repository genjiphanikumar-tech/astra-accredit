
-- Add storage policies for accreditation-evidence bucket
CREATE POLICY "Authenticated users can upload evidence files"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'accreditation-evidence');

CREATE POLICY "Authenticated users can view evidence files"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'accreditation-evidence');

CREATE POLICY "Admins can delete evidence files"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'accreditation-evidence' AND public.has_role(auth.uid(), 'admin'::public.app_role));
