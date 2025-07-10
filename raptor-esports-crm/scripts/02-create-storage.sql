-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('avatars', 'avatars', true),
  ('ocr_uploads', 'ocr_uploads', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for ocr_uploads bucket
CREATE POLICY "OCR uploads are accessible by authenticated users" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'ocr_uploads' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can upload OCR files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'ocr_uploads' 
    AND auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update their own OCR uploads" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'ocr_uploads' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own OCR uploads" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'ocr_uploads' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );