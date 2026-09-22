create or replace function public.territory_summary_v1()
returns table (
  total bigint,
  communities_of_communes bigint,
  communities_of_agglomeration bigint,
  with_signal bigint,
  without_signal bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*)::bigint,
    count(*) filter (where territory_type = 'CC')::bigint,
    count(*) filter (where territory_type = 'CA')::bigint,
    count(*) filter (where has_signal)::bigint,
    count(*) filter (where not has_signal)::bigint
  from public.territory_acquisition_v1
  where active = true;
$$;

create or replace function public.territory_search_v1(
  p_type text default null,
  p_signal text default null,
  p_query text default null,
  p_limit integer default 100,
  p_offset integer default 0
)
returns table (
  id uuid,
  siren text,
  name text,
  territory_type text,
  department_code text,
  seat_commune text,
  population_total bigint,
  member_count integer,
  president_title text,
  president_last_name text,
  president_first_name text,
  city text,
  email text,
  phone text,
  website text,
  banatic_url text,
  signal_count integer,
  last_signal_at timestamptz,
  has_signal boolean,
  active boolean,
  total_count bigint
)
language sql
stable
security definer
set search_path = public
as $$
  select
    t.id,
    t.siren,
    t.name,
    t.territory_type,
    t.department_code,
    t.seat_commune,
    t.population_total,
    t.member_count,
    t.president_title,
    t.president_last_name,
    t.president_first_name,
    t.city,
    t.email,
    t.phone,
    t.website,
    t.banatic_url,
    t.signal_count,
    t.last_signal_at,
    t.has_signal,
    t.active,
    count(*) over()::bigint as total_count
  from public.territory_acquisition_v1 t
  where t.active = true
    and (p_type is null or t.territory_type = p_type)
    and (
      p_signal is null
      or (p_signal = 'with' and t.has_signal = true)
      or (p_signal = 'without' and t.has_signal = false)
    )
    and (
      p_query is null
      or btrim(p_query) = ''
      or t.name ilike '%' || btrim(p_query) || '%'
      or t.siren ilike '%' || regexp_replace(btrim(p_query), '\D', '', 'g') || '%'
      or t.department_code ilike btrim(p_query) || '%'
    )
  order by t.has_signal desc, t.population_total desc nulls last, t.name asc
  limit greatest(1, least(coalesce(p_limit,100),250))
  offset greatest(coalesce(p_offset,0),0);
$$;

grant execute on function public.territory_summary_v1() to service_role;
grant execute on function public.territory_search_v1(text,text,text,integer,integer) to service_role;
