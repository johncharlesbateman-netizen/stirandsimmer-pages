UPDATE public.region_challenges
SET challenge = 'This week — make one of the five French mother sauces from scratch. Not sure where to start? Read our [complete guide](/guides/mother-sauces).',
    updated_at = now()
WHERE region_id = 'france';