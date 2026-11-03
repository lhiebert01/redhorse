-- Least-privilege API grants for red-horse-oracle (founder ruling, Nov 2, 2026). Revokes TRUNCATE, REFERENCES,
-- TRIGGER and every table privilege the app does not use from anon and authenticated, then grants back
-- exactly what the app's own calls need (supabase/api-grants.json). Row-level security and policies are
-- unchanged unless stated below. No rows are read, changed or deleted. service_role is unchanged.
-- Exposure NOT fixed here (needs an app change, reported): prophecies is readable by anyone (policy using true).

do $r$ declare t record; begin
  for t in select c.relname, c.relkind from pg_class c join pg_namespace n on n.oid = c.relnamespace
           where n.nspname = 'public' and c.relkind in ('r','v','m','p','S') loop
    if t.relkind = 'S' then execute format('revoke all on sequence public.%I from anon, authenticated', t.relname);
    else execute format('revoke all on table public.%I from anon, authenticated', t.relname); end if;
  end loop; end $r$;

grant delete, select on table public.party_answers to anon;
grant select, update on table public.party_games to anon;
grant select on table public.party_passes to anon;
grant select, update on table public.party_players to anon;
grant insert, select on table public.party_scores to anon;
grant select on table public.prophecies to anon;
grant select, update on table public.chemistry_profiles to authenticated;
grant insert, select, update on table public.chemistry_usage to authenticated;
grant delete, select on table public.party_answers to authenticated;
grant select, update on table public.party_games to authenticated;
grant select on table public.party_passes to authenticated;
grant select, update on table public.party_players to authenticated;
grant insert, select on table public.party_scores to authenticated;
grant select on table public.prophecies to authenticated;

alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;
