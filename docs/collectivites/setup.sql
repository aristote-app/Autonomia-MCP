-- Stop before changing ANY existing module object. Inspect and propose a SIREN merge first.
BEGIN;
DO $$ BEGIN
 IF to_regclass('public.collectivites') IS NOT NULL
 OR to_regclass('public.collectivites_competences') IS NOT NULL
 OR to_regclass('public.v_collectivites_par_domaine') IS NOT NULL THEN
 RAISE EXCEPTION 'Existing collectivités objects: inspect columns and propose merge by siren before proceeding';
 END IF;
END $$;
SET LOCAL search_path = public;
-- AUTONOMIA cockpit : collectivités (syndicats, CC/CA, autres EPCI)
-- Source : BANATIC, export national du 22/10/2026
-- Index déclarés à part (Supabase refuse les INDEX dans CREATE TABLE)

CREATE TABLE collectivites (
  siren               TEXT PRIMARY KEY,
  nom                 TEXT NOT NULL,
  code_type           TEXT NOT NULL,
  type                TEXT,
  categorie           TEXT,
  code_departement    TEXT,
  departement         TEXT,
  domaines            TEXT,
  nb_competences      INTEGER,
  competences         TEXT,
  adresse             TEXT,
  code_postal         TEXT,
  ville               TEXT,
  telephone           TEXT,
  email               TEXT,
  site_web            TEXT,
  president_civilite  TEXT,
  president_prenom    TEXT,
  president_nom       TEXT,
  population          INTEGER,
  nb_membres          INTEGER,
  date_creation       TEXT,
  syndicat_a_la_carte TEXT,
  fiche_banatic       TEXT,
  source              TEXT,
  statut_prospection  TEXT DEFAULT 'à contacter',
  notes               TEXT,
  updated_at          TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE collectivites_competences (
  id          BIGSERIAL PRIMARY KEY,
  siren       TEXT NOT NULL REFERENCES collectivites(siren) ON DELETE CASCADE,
  domaine     TEXT NOT NULL,
  competence  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_collectivites_type ON collectivites(code_type);
CREATE INDEX IF NOT EXISTS idx_collectivites_dep ON collectivites(code_departement);
CREATE INDEX IF NOT EXISTS idx_collectivites_categorie ON collectivites(categorie);
CREATE INDEX IF NOT EXISTS idx_collectivites_nom_fts ON collectivites USING GIN (to_tsvector('french', nom));
CREATE INDEX IF NOT EXISTS idx_competences_siren ON collectivites_competences(siren);
CREATE INDEX IF NOT EXISTS idx_competences_domaine ON collectivites_competences(domaine);

-- Vue pratique pour le dashboard : nombre de structures par domaine et département
CREATE VIEW v_collectivites_par_domaine WITH (security_invoker = true) AS
SELECT c.code_departement, c.departement, c.categorie, cc.domaine, COUNT(DISTINCT c.siren) AS nb
FROM collectivites c
JOIN collectivites_competences cc ON cc.siren = c.siren
GROUP BY 1, 2, 3, 4;

ALTER TABLE public.collectivites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collectivites_competences ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.collectivites, public.collectivites_competences, public.v_collectivites_par_domaine FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.collectivites, public.collectivites_competences, public.v_collectivites_par_domaine TO authenticated;
GRANT UPDATE (statut_prospection, notes) ON public.collectivites TO authenticated;
GRANT ALL ON public.collectivites, public.collectivites_competences TO service_role;
GRANT SELECT ON public.v_collectivites_par_domaine TO service_role;
GRANT USAGE, SELECT ON SEQUENCE public.collectivites_competences_id_seq TO service_role;
CREATE POLICY collectivites_read ON public.collectivites FOR SELECT TO authenticated USING (true);
CREATE POLICY collectivites_update ON public.collectivites FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY competences_read ON public.collectivites_competences FOR SELECT TO authenticated USING (true);
CREATE FUNCTION public.collectivites_updated_at() RETURNS trigger LANGUAGE plpgsql SECURITY INVOKER SET search_path = '' AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;
CREATE TRIGGER collectivites_updated_at BEFORE UPDATE ON public.collectivites
FOR EACH ROW EXECUTE FUNCTION public.collectivites_updated_at();
COMMIT;
