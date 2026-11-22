-- 2026-11-22: close public reads of customer data (applied to production the same night).
-- The 2 Nov grants audit found prophecies (email, birth_date, Stripe IDs, full reading; 86 rows)
-- readable by anyone with the public key through the policy "Allow public read" (USING true), and
-- party_passes (host_email, Stripe IDs) readable whenever a pass was active. The site
-- (www.redhorseoracle.com) is paused, and the project cannot be paused because Joy of Chemistry
-- shares it, so the tables were closed instead. Server routes use the service role, which is
-- unaffected. Logs retained 15-22 Nov 2026 show no outside reads; earlier access cannot be
-- determined.
BEGIN;
DROP POLICY IF EXISTS "Allow public read" ON public.prophecies;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.prophecies FROM anon, authenticated;
DROP POLICY IF EXISTS "Allow read active passes" ON public.party_passes;
REVOKE SELECT, INSERT, UPDATE, DELETE ON public.party_passes FROM anon, authenticated;
COMMIT;
