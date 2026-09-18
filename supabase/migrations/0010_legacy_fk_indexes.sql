-- Cover remaining foreign keys in retained legacy Autonomia tables.

create index if not exists duplicate_tracking_duplicate_mission_id_idx
  on public.duplicate_tracking(duplicate_mission_id);

create index if not exists notification_log_mission_id_idx
  on public.notification_log(mission_id);

create index if not exists notification_log_tender_id_idx
  on public.notification_log(tender_id);
