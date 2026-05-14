-- Adiciona campos de nascimento, avatar, LGPD e contagem de exclusões em profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS birth_date DATE,
  ADD COLUMN IF NOT EXISTS birth_time TIME,
  ADD COLUMN IF NOT EXISTS birth_city TEXT,
  ADD COLUMN IF NOT EXISTS birth_lat DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS birth_lng DECIMAL(9,6),
  ADD COLUMN IF NOT EXISTS birth_time_unknown BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT,
  ADD COLUMN IF NOT EXISTS lgpd_consent BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS lgpd_consent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deletion_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS deletion_blocked_until TIMESTAMPTZ;

-- Bucket público para avatares
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de storage
CREATE POLICY "avatars_public_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "avatars_user_insert"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_user_update"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "avatars_user_delete"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );