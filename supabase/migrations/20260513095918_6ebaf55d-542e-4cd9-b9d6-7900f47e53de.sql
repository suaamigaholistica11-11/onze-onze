CREATE TABLE public.natal_chart_deletions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  deleted_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_ncd_user_time ON public.natal_chart_deletions(user_id, deleted_at DESC);

ALTER TABLE public.natal_chart_deletions ENABLE ROW LEVEL SECURITY;

CREATE POLICY ncd_select_own ON public.natal_chart_deletions
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY ncd_insert_own ON public.natal_chart_deletions
FOR INSERT WITH CHECK (auth.uid() = user_id);