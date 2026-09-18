-- Security hardening for pre-existing Autonomia objects.
-- Keep server-side tables closed by default; fix externally facing view/function lints.

alter view if exists public.missions_qualified
  set (security_invoker = true);

alter view if exists public.tenders_urgent
  set (security_invoker = true);

alter view if exists public.top_skills_by_volume
  set (security_invoker = true);

alter function public.update_updated_date()
  set search_path = pg_catalog, public;
