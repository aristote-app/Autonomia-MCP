-- Cover foreign keys added by 0019 for already-migrated environments.

create index if not exists workspace_members_invited_by_idx
  on public.workspace_members(invited_by) where invited_by is not null;
create index if not exists workspaces_created_by_idx
  on public.workspaces(created_by) where created_by is not null;
create index if not exists work_items_updated_by_idx
  on public.work_items(updated_by) where updated_by is not null;
create index if not exists activity_log_actor_idx
  on public.activity_log(actor_user_id) where actor_user_id is not null;
create index if not exists work_item_comments_author_idx
  on public.work_item_comments(author_user_id) where author_user_id is not null;
