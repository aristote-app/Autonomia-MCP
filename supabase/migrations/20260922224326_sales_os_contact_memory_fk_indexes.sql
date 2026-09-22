create index if not exists sales_contacts_organization_idx
  on public.sales_contacts (organization_id);

create index if not exists sales_contacts_created_by_idx
  on public.sales_contacts (created_by);

create index if not exists sales_contacts_updated_by_idx
  on public.sales_contacts (updated_by);

create index if not exists sales_contact_events_created_by_idx
  on public.sales_contact_events (created_by);
