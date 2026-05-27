CREATE TABLE public.region_challenge_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  region_id TEXT NOT NULL,
  challenge TEXT NOT NULL,
  replaced_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_region_challenge_history_region_replaced
  ON public.region_challenge_history (region_id, replaced_at DESC);

ALTER TABLE public.region_challenge_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Region challenge history is viewable by everyone"
  ON public.region_challenge_history
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can insert region challenge history"
  ON public.region_challenge_history
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');