
CREATE TABLE public.region_challenges (
  region_id text PRIMARY KEY,
  challenge text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.region_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Region challenges are viewable by everyone"
  ON public.region_challenges FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert region challenges"
  ON public.region_challenges FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update region challenges"
  ON public.region_challenges FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete region challenges"
  ON public.region_challenges FOR DELETE
  TO authenticated
  USING (is_admin());

CREATE TRIGGER region_challenges_set_updated_at
  BEFORE UPDATE ON public.region_challenges
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.region_challenges (region_id, challenge) VALUES
  ('uk', 'This week — cook a classic British fish dish. Try our Fish Finger Butty or Cider Battered Prawns.'),
  ('italy', 'This week — cook a pasta dish entirely from scratch. Find our Italian recipes and challenge yourself.'),
  ('france', 'This week — make a classic French sauce from scratch. Browse our French recipe collection to find your starting point.'),
  ('asia', 'This week — cook a curry entirely from scratch using whole spices, no jars. Find your recipe in our Asian collection.');
