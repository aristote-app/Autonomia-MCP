insert into public.sources (id, name, group_name, mode, priority, status)
values
  ('boamp','BOAMP','public','official_api','P0','active'),
  ('ted','TED / JOUE','public','official_api','P0','active'),
  ('decp','DECP','public','open_data','P0','planned'),
  ('place','PLACE','public','public_portal','P0','planned'),
  ('profils_acheteurs','Profils acheteurs','public','public_portals','P1','planned'),
  ('freelancemention','FreelanceMention','freelance','official_api','P0','ready_for_credentials'),
  ('linkedin','LinkedIn / Data Sales','freelance','authorized_access_only','P0','planned'),
  ('indeed','Indeed.fr','freelance','public_or_authorized_access','P1','planned'),
  ('malt','Malt','freelance','public_or_authorized_access','P1','planned'),
  ('upwork','Upwork','freelance','official_api_or_authorized_access','P1','planned'),
  ('freework','Free-Work','freelance','public_pages','P1','planned'),
  ('lehibou','LeHibou','freelance','public_pages','P1','planned'),
  ('opco','11 OPCO','training','public_portals','P0','planned'),
  ('mcf_offer','Mon Compte Formation - offre','training','open_data','P1','planned'),
  ('mcf_usage','Mon Compte Formation - usages','training','open_data','P1','planned')
on conflict (id) do update set
  name = excluded.name,
  group_name = excluded.group_name,
  mode = excluded.mode,
  priority = excluded.priority,
  status = excluded.status,
  updated_at = now();
