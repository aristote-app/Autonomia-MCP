-- Academy / OPCO intelligence core
-- Mirrors production schema created on 2026-09-28.

create table if not exists public.academy_opcos (
  code text primary key,
  name text not null,
  short_name text not null,
  website_url text not null,
  financing_url text,
  active boolean not null default true,
  source_url text,
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_siro (
  siret text primary key check (siret ~ '^[0-9]{14}$'),
  siren text generated always as (left(siret, 9)) stored,
  opco_code text,
  opco_name text,
  idcc text,
  management_json jsonb not null default '{}'::jsonb,
  source_resource_id text,
  source_file_name text,
  source_updated_at timestamptz,
  sync_token text,
  imported_at timestamptz not null default now()
);

create index if not exists academy_siro_siren_idx on public.academy_siro(siren);
create index if not exists academy_siro_opco_code_idx on public.academy_siro(opco_code);
create index if not exists academy_siro_idcc_idx on public.academy_siro(idcc);
create index if not exists academy_siro_sync_token_idx on public.academy_siro(sync_token);

create table if not exists public.academy_funding_sources (
  id bigint generated always as identity primary key,
  opco_code text not null references public.academy_opcos(code) on update cascade,
  year integer not null,
  title text not null,
  source_url text not null,
  source_type text not null default 'official_web',
  scope text,
  branch_label text,
  branch_code text,
  published_at date,
  checked_at timestamptz not null default now(),
  active boolean not null default true,
  unique(opco_code, year, source_url)
);

create table if not exists public.academy_funding_rules (
  id bigint generated always as identity primary key,
  opco_code text not null references public.academy_opcos(code) on update cascade,
  year integer not null default 2026,
  idcc text,
  branch_label text,
  branch_code text,
  company_size_min integer,
  company_size_max integer,
  scheme text not null default 'PDC',
  training_category text,
  delivery_mode text,
  annual_ceiling numeric(12,2),
  hourly_ceiling numeric(12,2),
  day_ceiling numeric(12,2),
  per_employee_ceiling numeric(12,2),
  coverage_percent numeric(6,2),
  duration_min_hours numeric(10,2),
  duration_max_hours numeric(10,2),
  notes text,
  source_url text not null,
  source_title text,
  valid_from date,
  valid_to date,
  verified_at timestamptz not null default now(),
  evidence_status text not null default 'verified' check (evidence_status in ('verified','partial','to_verify')),
  created_at timestamptz not null default now()
);

create index if not exists academy_funding_rules_lookup_idx
  on public.academy_funding_rules(opco_code, idcc, year);
create index if not exists academy_funding_rules_branch_idx
  on public.academy_funding_rules(opco_code, branch_code, year);

create table if not exists public.academy_courses (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  family text,
  duration_hours numeric(10,2),
  duration_days numeric(10,2),
  price_intra_day numeric(12,2),
  price_inter_day numeric(12,2),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.academy_sync_runs (
  id bigint generated always as identity primary key,
  source text not null,
  status text not null,
  resource_id text,
  file_name text,
  source_updated_at timestamptz,
  rows_seen bigint not null default 0,
  rows_upserted bigint not null default 0,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  error_message text,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.academy_opcos enable row level security;
alter table public.academy_siro enable row level security;
alter table public.academy_funding_sources enable row level security;
alter table public.academy_funding_rules enable row level security;
alter table public.academy_courses enable row level security;
alter table public.academy_sync_runs enable row level security;

revoke all on public.academy_opcos from anon, authenticated;
revoke all on public.academy_siro from anon, authenticated;
revoke all on public.academy_funding_sources from anon, authenticated;
revoke all on public.academy_funding_rules from anon, authenticated;
revoke all on public.academy_courses from anon, authenticated;
revoke all on public.academy_sync_runs from anon, authenticated;

grant select, insert, update, delete on public.academy_opcos to service_role;
grant select, insert, update, delete on public.academy_siro to service_role;
grant select, insert, update, delete on public.academy_funding_sources to service_role;
grant select, insert, update, delete on public.academy_funding_rules to service_role;
grant select, insert, update, delete on public.academy_courses to service_role;
grant select, insert, update, delete on public.academy_sync_runs to service_role;
grant usage, select on all sequences in schema public to service_role;

insert into public.academy_opcos
(code, name, short_name, website_url, financing_url, source_url, verified_at)
values
('AFDAS','AFDAS','AFDAS','https://www.afdas.com',null,'https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('AKTO','AKTO','AKTO','https://www.akto.fr','https://www.akto.fr/entreprise/financer-une-formation/regles-de-prise-en-charge/','https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('ATLAS','OPCO Atlas','Atlas','https://www.opco-atlas.fr',null,'https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('CONSTRUCTYS','Constructys','Constructys','https://www.constructys.fr',null,'https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('OPCOMMERCE','L’Opcommerce','L’Opcommerce','https://www.lopcommerce.com',null,'https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('OCAPIAT','OCAPIAT','OCAPIAT','https://www.ocapiat.fr',null,'https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('OPCO2I','OPCO 2i','OPCO 2i','https://www.opco2i.fr','https://www.opco2i.fr/services-solutions/2i-actions-cles-en-main/','https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('OPCOEP','OPCO Entreprises de Proximité','Opco EP','https://www.opcoep.fr','https://www.opcoep.fr/criteres-de-financement','https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('OPCOMOBILITES','OPCO Mobilités','OPCO Mobilités','https://www.opcomobilites.fr',null,'https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('OPCOSANTE','OPCO Santé','OPCO Santé','https://www.opco-sante.fr','https://www.opco-sante.fr/employeur/les-dispositifs-de-formation/plan-de-developpement-des-competences-pdc/','https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now()),
('UNIFORMATION','Uniformation','Uniformation','https://www.uniformation.fr','https://www.uniformation.fr/entreprise/formation/dispositifs-de-formation/plan-de-developpement-des-competences/financement','https://www.francecompetences.fr/faq-ext/index.php?q=FAQ---France-comptences%2F06---Rpartition-des-fonds-de-la-formation-et-de-lapprentissage%2F40913018465fd6229082ce4.75608612',now())
on conflict (code) do update set
  name=excluded.name,
  short_name=excluded.short_name,
  website_url=excluded.website_url,
  financing_url=coalesce(excluded.financing_url, public.academy_opcos.financing_url),
  source_url=excluded.source_url,
  verified_at=excluded.verified_at,
  updated_at=now();

insert into public.academy_funding_sources
(opco_code, year, title, source_url, source_type, scope, checked_at, active)
values
('AFDAS',2026,'Critères de prise en charge 2026 – structures de moins de 50 salariés','https://www.afdas.com/entreprise/financer-vos-actions-de-formation/choisir-le-bon-financement/financement-de-la-formation-pour-les-structures-de-moins-de-50-salaries.html','official_web','PDC <50',now(),true),
('AKTO',2026,'Règles de prise en charge 2026','https://www.akto.fr/entreprise/financer-une-formation/regles-de-prise-en-charge/','official_web','branch-specific',now(),true),
('ATLAS',2026,'Critères de financement 2026','https://www.opco-atlas.fr/actualites/decouvrez-les-nouveaux-criteres-de-financement-2026.html','official_web','branch-specific',now(),true),
('CONSTRUCTYS',2026,'Conditions de prise en charge 2026','https://www.constructys.fr/conditions-de-prise-en-charge-2/','official_web','PDC / branch-specific',now(),true),
('OPCOMMERCE',2026,'Critères de prise en charge par branche professionnelle','https://www.lopcommerce.com/entreprise/criteres-de-prise-en-charge-par-branche-professionnelle/','official_web','branch-specific',now(),true),
('OCAPIAT',2026,'Règles de prise en charge OCAPIAT 2026','https://www.ocapiat.fr/informations-legales-et-reglementaires/','official_web','PDC / dispositifs',now(),true),
('OPCO2I',2026,'2i Solutions financières – plan de développement des compétences','https://www.opco2i.fr/services-solutions/2i-actions-cles-en-main/','official_web','PDC <50',now(),true),
('OPCOEP',2026,'Critères de financement et prise en charge 2026','https://www.opcoep.fr/criteres-de-financement','official_web','branch-specific',now(),true),
('OPCOMOBILITES',2026,'Guide pratique 2026 – exemple branche Transports routiers de marchandises','https://www.opcomobilites.fr/fileadmin/user_upload/documentation/entreprises/guides_pratiques/Guides_pratiques_2026/Metropole_2026/Transports_routiers_de_marchandises_02012026.pdf','official_pdf','branch-specific',now(),true),
('OPCOSANTE',2026,'Plan de développement des compétences – modalités de prise en charge','https://www.opco-sante.fr/employeur/les-dispositifs-de-formation/plan-de-developpement-des-competences-pdc/','official_web','branch-specific',now(),true),
('UNIFORMATION',2026,'Financer votre plan de développement des compétences','https://www.uniformation.fr/entreprise/formation/dispositifs-de-formation/plan-de-developpement-des-competences/financement','official_web','PDC / branch-specific',now(),true)
on conflict (opco_code, year, source_url) do update set
  title=excluded.title,
  source_type=excluded.source_type,
  scope=excluded.scope,
  checked_at=excluded.checked_at,
  active=true;
