-- Align persisted source registry with collectors and dashboard registry.

insert into public.sources (id, name, source_group, priority, access_mode, status)
values
  ('profils_acheteurs','Profils acheteurs','public','P1','mixed_public_portals','registry_active'),
  ('marches_securises','Marchés-Sécurisés','public','P1','robots_guarded_public_search','active'),
  ('mon_compte_formation_open_data','Mon Compte Formation - open data registry','training','P1','open_data','active'),
  ('mcf_engaged','Mon Compte Formation - formations engagées','training','P1','open_data','active'),
  ('mcf_flows','Mon Compte Formation - entrées/sorties','training','P1','open_data','active')
on conflict (id) do update set
  name=excluded.name,
  source_group=excluded.source_group,
  priority=excluded.priority,
  access_mode=excluded.access_mode,
  status=excluded.status,
  updated_at=now();
