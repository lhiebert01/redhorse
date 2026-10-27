-- WO-SUPABASE-GRANTS-001: explicit Data API grants backfill for Supabase project red-horse-oracle (ykptxslgxlsbvpbeujfu).
--
-- From October 30, 2026, Supabase no longer grants API access (anon, authenticated, service_role)
-- to new tables, views, sequences and functions in public. Replaying this project's SQL onto a
-- fresh project, a branch or a local reset would then create objects the API cannot reach.
-- Applied after every other schema file, this file restores exactly the grants production held
-- on 2026-10-27: generated from production (helper Q4 for tables, views and sequences; Q5 for
-- function EXECUTE grants), never typed by hand, so it broadens nothing. Each statement runs only
-- if its object exists, so the file is idempotent and a no-op on production.
--
-- Tables with RLS still need their policies, which live in the files that create them.
-- Objects in production that no SQL file in the repo creates (made in the dashboard): qs_answers, qs_credits, qs_games, qs_players, qs_questions, qs_sessions.
-- They are covered here if they exist; recreating them needs their own definitions.

-- Tables, views and sequences (Q4): 63 grants
do $g$ begin if to_regclass('public.chemistry_profiles') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.chemistry_profiles to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.chemistry_profiles') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.chemistry_profiles to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.chemistry_profiles') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.chemistry_profiles to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.chemistry_usage') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.chemistry_usage to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.chemistry_usage') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.chemistry_usage to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.chemistry_usage') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.chemistry_usage to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.influencer_applications') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.influencer_applications to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.influencer_applications') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.influencer_applications to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.influencer_applications') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.influencer_applications to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.oracle_analytics') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.oracle_analytics to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.oracle_analytics') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.oracle_analytics to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.oracle_analytics') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.oracle_analytics to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.party_answers') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_answers to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.party_answers') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_answers to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.party_answers') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_answers to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.party_games') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_games to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.party_games') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_games to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.party_games') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_games to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.party_passes') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_passes to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.party_passes') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_passes to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.party_passes') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_passes to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.party_players') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_players to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.party_players') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_players to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.party_players') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_players to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.party_questions') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_questions to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.party_questions') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_questions to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.party_questions') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_questions to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.party_scores') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_scores to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.party_scores') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_scores to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.party_scores') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.party_scores to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.prophecies') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.prophecies to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.prophecies') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.prophecies to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.prophecies') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.prophecies to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_answers') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_answers to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_answers') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_answers to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_answers') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_answers to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_credits') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_credits to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_credits') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_credits to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_credits') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_credits to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_games') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_games to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_games') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_games to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_games') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_games to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_players') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_players to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_players') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_players to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_players') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_players to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_questions') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_questions to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_questions') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_questions to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_questions') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_questions to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_sessions') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_sessions to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_sessions') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_sessions to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.qs_sessions') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.qs_sessions to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.quiz_answers') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.quiz_answers to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.quiz_answers') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.quiz_answers to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.quiz_answers') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.quiz_answers to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.quiz_games') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.quiz_games to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.quiz_games') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.quiz_games to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.quiz_games') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.quiz_games to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.quiz_players') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.quiz_players to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.quiz_players') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.quiz_players to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.quiz_players') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.quiz_players to service_role'; end if; end $g$;
do $g$ begin if to_regclass('public.vip_passes') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.vip_passes to anon'; end if; end $g$;
do $g$ begin if to_regclass('public.vip_passes') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.vip_passes to authenticated'; end if; end $g$;
do $g$ begin if to_regclass('public.vip_passes') is not null then execute 'grant DELETE, INSERT, MAINTAIN, REFERENCES, SELECT, TRIGGER, TRUNCATE, UPDATE on table public.vip_passes to service_role'; end if; end $g$;

-- Function EXECUTE grants (Q5): 12 grants
do $g$ begin if to_regprocedure('public.generate_party_code()') is not null then execute 'grant execute on function public.generate_party_code() to anon'; end if; end $g$;
do $g$ begin if to_regprocedure('public.generate_party_code()') is not null then execute 'grant execute on function public.generate_party_code() to authenticated'; end if; end $g$;
do $g$ begin if to_regprocedure('public.generate_party_code()') is not null then execute 'grant execute on function public.generate_party_code() to service_role'; end if; end $g$;
do $g$ begin if to_regprocedure('public.get_pass_duration_hours(text)') is not null then execute 'grant execute on function public.get_pass_duration_hours(text) to anon'; end if; end $g$;
do $g$ begin if to_regprocedure('public.get_pass_duration_hours(text)') is not null then execute 'grant execute on function public.get_pass_duration_hours(text) to authenticated'; end if; end $g$;
do $g$ begin if to_regprocedure('public.get_pass_duration_hours(text)') is not null then execute 'grant execute on function public.get_pass_duration_hours(text) to service_role'; end if; end $g$;
do $g$ begin if to_regprocedure('public.get_pass_max_games(text)') is not null then execute 'grant execute on function public.get_pass_max_games(text) to anon'; end if; end $g$;
do $g$ begin if to_regprocedure('public.get_pass_max_games(text)') is not null then execute 'grant execute on function public.get_pass_max_games(text) to authenticated'; end if; end $g$;
do $g$ begin if to_regprocedure('public.get_pass_max_games(text)') is not null then execute 'grant execute on function public.get_pass_max_games(text) to service_role'; end if; end $g$;
do $g$ begin if to_regprocedure('public.handle_new_chemistry_user()') is not null then execute 'grant execute on function public.handle_new_chemistry_user() to anon'; end if; end $g$;
do $g$ begin if to_regprocedure('public.handle_new_chemistry_user()') is not null then execute 'grant execute on function public.handle_new_chemistry_user() to authenticated'; end if; end $g$;
do $g$ begin if to_regprocedure('public.handle_new_chemistry_user()') is not null then execute 'grant execute on function public.handle_new_chemistry_user() to service_role'; end if; end $g$;
