ALTER TABLE public.pyramid_progress
  ADD COLUMN IF NOT EXISTS next_step text,
  ADD COLUMN IF NOT EXISTS comment text;