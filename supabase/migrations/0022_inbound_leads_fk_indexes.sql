-- Cover the organization foreign key on inbound leads.

create index if not exists inbound_leads_organization_idx
  on public.inbound_leads(organization_id)
  where organization_id is not null;
