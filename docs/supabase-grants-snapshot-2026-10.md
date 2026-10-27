# Supabase Data API grants snapshot, red-horse-oracle (ykptxslgxlsbvpbeujfu)

WO-SUPABASE-GRANTS-001, taken from production on 2026-10-27 after the grants backfill (identical to before it). No secrets.

## Default privileges for new objects in public (owner postgres)

- Behaviour: **still auto-grants (changes on October 30, 2026)**
- Tables (r): anon=arwdDxtm, authenticated=arwdDxtm, service_role=arwdDxtm
- Sequences (S): anon=rwU, authenticated=rwU, service_role=rwU
- Functions (f): anon=X, authenticated=X, service_role=X

(ACL letters: a insert, r select, w update, d delete, D truncate, x references, t trigger, m maintain, U usage, X execute.)

## Objects in public and their API-role grants

| Object | Kind | RLS | anon | authenticated | service_role |
|---|---|---|---|---|---|
| chemistry_profiles | table | on | all | all | all |
| chemistry_usage | table | on | all | all | all |
| influencer_applications | table | on | all | all | all |
| oracle_analytics | table | on | all | all | all |
| party_answers | table | on | all | all | all |
| party_games | table | on | all | all | all |
| party_passes | table | on | all | all | all |
| party_players | table | on | all | all | all |
| party_questions | table | on | all | all | all |
| party_scores | table | on | all | all | all |
| prophecies | table | on | all | all | all |
| qs_answers | table | on | all | all | all |
| qs_credits | table | on | all | all | all |
| qs_games | table | on | all | all | all |
| qs_players | table | on | all | all | all |
| qs_questions | table | on | all | all | all |
| qs_sessions | table | on | all | all | all |
| quiz_answers | table | on | all | all | all |
| quiz_games | table | on | all | all | all |
| quiz_players | table | on | all | all | all |
| vip_passes | table | on | all | all | all |

## Checks

- Q3, tables anon or authenticated can read with RLS off: none.
- Q6, objects with no API-role grant at all: none.
- Schema drift, production tables no SQL file in the repo creates: qs_answers, qs_credits, qs_games, qs_players, qs_questions, qs_sessions.
- Function EXECUTE grants held by API roles: 12.

The backfill that reproduces these grants on replay: `supabase/migrations/20261027000000_explicit_api_grants_backfill.sql`.
