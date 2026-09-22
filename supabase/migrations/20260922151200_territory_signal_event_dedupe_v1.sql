create or replace view public.territory_priority_v1
with (security_invoker = true)
as
with explicit_events as (
  select
    ts.territory_id,
    ts.signal_type,
    ts.signal_source,
    ts.title,
    ts.evidence_url,
    ts.detected_at,
    ts.importance
  from public.territory_signals ts
),
opportunity_events as (
  select
    t.id as territory_id,
    coalesce(o.opportunity_type,'public_market') as signal_type,
    coalesce(src.source_id,'public_market') as signal_source,
    o.title,
    src.source_url as evidence_url,
    coalesce(o.published_at,o.first_seen_at,o.created_at) as detected_at,
    4::integer as importance
  from public.territories t
  join public.organizations org on org.siren=t.siren
  join public.opportunities o on o.buyer_org_id=org.id
  left join lateral (
    select
      ri.source_id,
      ri.source_record_id,
      ri.source_url
    from public.opportunity_sources os
    join public.raw_items ri on ri.id=os.raw_item_id
    where os.opportunity_id=o.id
    order by ri.published_at desc nulls last,ri.fetched_at desc nulls last
    limit 1
  ) src on true
  where not exists (
    select 1
    from public.territory_signals ts
    where ts.territory_id=t.id
      and (
        (src.source_url is not null and ts.evidence_url=src.source_url)
        or (
          src.source_record_id is not null
          and ts.payload->>'source_record_id'=src.source_record_id
        )
      )
  )
),
all_events as (
  select * from explicit_events
  union all
  select * from opportunity_events
),
signal_agg as (
  select
    territory_id,
    count(*)::integer as signal_count,
    max(detected_at) as last_signal_at,
    max(importance)::integer as max_signal_importance
  from all_events
  group by territory_id
),
latest as (
  select distinct on (territory_id)
    territory_id,
    signal_type,
    signal_source,
    title,
    evidence_url,
    detected_at,
    importance
  from all_events
  order by territory_id,detected_at desc nulls last,importance desc,title
),
base as (
  select
    t.*,
    coalesce(sa.signal_count,0)::integer as signal_count,
    sa.last_signal_at,
    coalesce(sa.max_signal_importance,0)::integer as max_signal_importance,
    l.signal_type as latest_signal_type,
    l.signal_source as latest_signal_source,
    l.title as latest_signal_title,
    l.evidence_url as latest_signal_url,
    case
      when coalesce(sa.signal_count,0)=0 then 0
      else least(20,coalesce(sa.signal_count,0)*4)
        + least(20,coalesce(sa.max_signal_importance,0)*4)
        + case
            when sa.last_signal_at >= now()-interval '14 days' then 20
            when sa.last_signal_at >= now()-interval '30 days' then 16
            when sa.last_signal_at >= now()-interval '90 days' then 10
            when sa.last_signal_at >= now()-interval '180 days' then 5
            else 2
          end
    end::integer as signal_score,
    (
      case when t.territory_type='CA' then 5 else 0 end
      + case
          when coalesce(t.population_total,0)>=200000 then 20
          when coalesce(t.population_total,0)>=100000 then 16
          when coalesce(t.population_total,0)>=50000 then 12
          when coalesce(t.population_total,0)>=20000 then 8
          when coalesce(t.population_total,0)>0 then 4
          else 0
        end
    )::integer as reach_score,
    (
      case when nullif(btrim(coalesce(t.email,'')),'') is not null then 7 else 0 end
      + case when nullif(btrim(coalesce(t.website,'')),'') is not null then 5 else 0 end
      + case when nullif(btrim(coalesce(t.phone,'')),'') is not null then 3 else 0 end
    )::integer as contact_score
  from public.territories t
  left join signal_agg sa on sa.territory_id=t.id
  left join latest l on l.territory_id=t.id
),
scored as (
  select
    b.*,
    (b.signal_score+b.reach_score+b.contact_score)::integer as commercial_score,
    lower(
      coalesce(b.latest_signal_type,'')||' '||
      coalesce(b.latest_signal_title,'')
    ) as signal_text
  from base b
),
recommended as (
  select
    s.*,
    case
      when s.commercial_score>=70 then 'P1'
      when s.commercial_score>=50 then 'P2'
      when s.commercial_score>=30 then 'P3'
      else 'P4'
    end as priority_band,
    case
      when s.signal_text ~ '(formation|training|compétenc|competenc|copilot|chatgpt|adoption|sensibilisation)'
        then 'Academy collectivités'
      when s.signal_text ~ '(tpe|pme|sme|entrepris|développement économique|developpement economique|commerce|artisan)'
        then 'Accélérateur IA entreprises du territoire'
      when s.signal_text ~ '(automatis|démat|demat|numérique|numerique|système d.information|systeme d.information|processus|intelligence artificielle|territory_ai_project|territory_automation|territory_digital_transformation|(^|[^a-z])ia([^a-z]|$))'
        then 'IA pour les agents'
      else 'Diagnostic IA Territoire'
    end as suggested_offer
  from scored s
)
select
  r.*,
  case r.suggested_offer
    when 'Academy collectivités'
      then array['DGS','DRH / formation','Direction transformation / innovation']
    when 'Accélérateur IA entreprises du territoire'
      then array['Direction développement économique','DGS','Direction innovation']
    when 'IA pour les agents'
      then array['DSI / numérique','Direction transformation / innovation','DGS']
    else array['DGS','Direction développement économique','DSI / numérique']
  end::text[] as recommended_roles,
  case
    when r.signal_count>0 and nullif(r.latest_signal_url,'') is not null
      then 'Ouvrir la source du signal, qualifier le besoin, puis préparer un contact contextualisé.'
    when r.signal_count>0
      then 'Qualifier le signal, rechercher sa source publique, puis préparer un contact contextualisé.'
    when nullif(btrim(coalesce(r.email,'')),'') is not null or nullif(btrim(coalesce(r.website,'')),'') is not null
      then 'Rechercher un signal public récent, puis préparer un contact contextualisé.'
    else 'Enrichir les contacts avant prospection et rechercher un signal public récent.'
  end as next_action
from recommended r;

revoke all on public.territory_priority_v1 from public, anon, authenticated;
grant select on public.territory_priority_v1 to service_role;

create or replace function public.territory_signal_feed_v1(p_siren text)
returns table(
  signal_type text,
  signal_source text,
  title text,
  evidence_url text,
  detected_at timestamptz,
  importance integer
)
language sql
stable
security invoker
set search_path=public
as $$
  with territory as (
    select id,siren
    from public.territories
    where active=true
      and siren=regexp_replace(coalesce(p_siren,''),'\D','','g')
    limit 1
  ),
  explicit_events as (
    select
      ts.signal_type,
      ts.signal_source,
      ts.title,
      ts.evidence_url,
      ts.detected_at,
      ts.importance
    from public.territory_signals ts
    join territory t on t.id=ts.territory_id
  ),
  opportunity_events as (
    select
      coalesce(o.opportunity_type,'public_market') as signal_type,
      coalesce(src.source_id,'public_market') as signal_source,
      o.title,
      src.source_url as evidence_url,
      coalesce(o.published_at,o.first_seen_at,o.created_at) as detected_at,
      4::integer as importance
    from territory t
    join public.organizations org on org.siren=t.siren
    join public.opportunities o on o.buyer_org_id=org.id
    left join lateral (
      select
        ri.source_id,
        ri.source_record_id,
        ri.source_url
      from public.opportunity_sources os
      join public.raw_items ri on ri.id=os.raw_item_id
      where os.opportunity_id=o.id
      order by ri.published_at desc nulls last,ri.fetched_at desc nulls last
      limit 1
    ) src on true
    where not exists (
      select 1
      from public.territory_signals ts
      where ts.territory_id=t.id
        and (
          (src.source_url is not null and ts.evidence_url=src.source_url)
          or (
            src.source_record_id is not null
            and ts.payload->>'source_record_id'=src.source_record_id
          )
        )
    )
  ),
  events as (
    select * from explicit_events
    union all
    select * from opportunity_events
  )
  select *
  from events
  order by detected_at desc nulls last,importance desc,title;
$$;

revoke all on function public.territory_signal_feed_v1(text) from public, anon, authenticated;
grant execute on function public.territory_signal_feed_v1(text) to service_role;
