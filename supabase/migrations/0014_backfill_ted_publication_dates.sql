-- TED may return publication dates as YYYY-MM-DD+HH:MM without a time component.
-- Preserve the published calendar date when backfilling persisted records.
update public.raw_items
set published_at = ((payload->>'publication-date')::text)::date::timestamptz
where source_id='ted'
  and published_at is null
  and payload ? 'publication-date'
  and (payload->>'publication-date') ~ '^\d{4}-\d{2}-\d{2}';

update public.opportunities o
set published_at = ((ri.payload->>'publication-date')::text)::date::timestamptz,
    updated_at = now()
from public.opportunity_sources os
join public.raw_items ri on ri.id=os.raw_item_id
where os.opportunity_id=o.id
  and ri.source_id='ted'
  and o.published_at is null
  and ri.payload ? 'publication-date'
  and (ri.payload->>'publication-date') ~ '^\d{4}-\d{2}-\d{2}';

update public.opportunity_versions ov
set facts = jsonb_set(
      ov.facts,
      '{published_at}',
      to_jsonb((((ri.payload->>'publication-date')::text)::date::timestamptz)::text),
      true
    ),
    facts_hash = encode(
      digest(
        jsonb_set(
          ov.facts,
          '{published_at}',
          to_jsonb((((ri.payload->>'publication-date')::text)::date::timestamptz)::text),
          true
        )::text,
        'sha256'
      ),
      'hex'
    )
from public.raw_items ri
where ov.raw_item_id=ri.id
  and ri.source_id='ted'
  and ri.payload ? 'publication-date'
  and (ri.payload->>'publication-date') ~ '^\d{4}-\d{2}-\d{2}';
