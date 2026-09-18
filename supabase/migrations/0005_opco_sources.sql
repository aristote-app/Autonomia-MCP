-- Register the eleven French OPCOs as first-class training-market sources.

insert into public.sources (id, name, source_group, priority, access_mode, base_url, status)
values
  ('opco_atlas','Opco Atlas','training','P0','official_page_plus_public_procurement','https://www.opco-atlas.fr/appels-d-offres/','active'),
  ('opco_akto','AKTO','training','P0','official_page_plus_public_procurement','https://www.akto.fr/appels-d-offres/','active'),
  ('opco_2i','OPCO 2i','training','P0','official_page_plus_public_procurement','https://www.opco2i.fr/marches-publics/','active'),
  ('opco_opcommerce','L''Opcommerce','training','P0','official_page_plus_public_procurement','https://www.lopcommerce.com/prestataire-de-formation/marches-publics/consulter-nos-appels-doffres/','active'),
  ('opco_ocapiat','OCAPIAT','training','P0','official_page_plus_public_procurement','https://www.ocapiat.fr/procedures-de-marches-publics-ami/','active'),
  ('opco_afdas','Afdas','training','P0','official_page_plus_public_procurement','https://www.afdas.com/lafdas/nos-appels-doffres.html','active'),
  ('opco_sante','OPCO Santé','training','P0','official_page_plus_public_procurement','https://www.opco-sante.fr/prestataire/demarche-d-habilitation/','active'),
  ('opco_constructys','Constructys','training','P0','public_procurement_search',null,'active'),
  ('opco_uniformation','Uniformation','training','P0','public_procurement_search',null,'active'),
  ('opco_ep','OPCO EP','training','P0','public_procurement_search',null,'active'),
  ('opco_mobilites','OPCO Mobilités','training','P0','public_procurement_search',null,'active')
on conflict (id) do update set
  name = excluded.name,
  source_group = excluded.source_group,
  priority = excluded.priority,
  access_mode = excluded.access_mode,
  base_url = excluded.base_url,
  status = excluded.status,
  updated_at = now();
