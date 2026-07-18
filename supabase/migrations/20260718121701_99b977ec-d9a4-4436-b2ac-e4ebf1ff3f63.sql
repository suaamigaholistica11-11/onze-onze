CREATE TABLE public.nadja_readings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  spread_id text NOT NULL,
  spread_title text NOT NULL,
  pergunta text,
  cartas jsonb NOT NULL,
  texto text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
CREATE INDEX nadja_readings_user_created_idx ON public.nadja_readings (user_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.nadja_readings TO authenticated;
GRANT ALL ON public.nadja_readings TO service_role;
ALTER TABLE public.nadja_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY nadja_readings_select_own ON public.nadja_readings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY nadja_readings_insert_own ON public.nadja_readings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY nadja_readings_delete_own ON public.nadja_readings FOR DELETE USING (auth.uid() = user_id);