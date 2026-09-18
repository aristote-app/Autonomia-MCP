-- Autonomia public-procurement intelligence helpers.
-- end_date is factual when contract_end_date is present.
-- Otherwise it is an estimate derived from start/award date + duration_months.

create or replace view public.public_awards_enriched
with (security_invoker = true)
as
select
  pa.*,
  coalesce(
    pa.contract_end_date,
    case
      when pa.duration_months is not null and coalesce(pa.contract_start_date, pa.award_date) is not null
      then (
        coalesce(pa.contract_start_date, pa.award_date)::timestamp
        + make_interval(months => pa.duration_months)
      )::date
      else null
    end
  ) as effective_end_date,
  case
    when pa.contract_end_date is not null then 'explicit'
    when pa.duration_months is not null and coalesce(pa.contract_start_date, pa.award_date) is not null
      then 'estimated_from_duration'
    else null
  end as end_date_kind
from public.public_awards pa;

grant select on public.public_awards_enriched to authenticated, service_role;
