BEGIN;
CREATE FUNCTION public.search_collectivites_v1(
 p_categorie text DEFAULT NULL, p_type text DEFAULT NULL, p_departement text DEFAULT NULL,
 p_domaines text[] DEFAULT '{}', p_q text DEFAULT NULL, p_telephone boolean DEFAULT false,
 p_email boolean DEFAULT false, p_statut text DEFAULT NULL
) RETURNS SETOF public.collectivites LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
 SELECT c.* FROM public.collectivites c
 WHERE (p_categorie IS NULL OR c.categorie = p_categorie)
 AND (p_type IS NULL OR c.code_type = p_type)
 AND (p_departement IS NULL OR c.code_departement = p_departement)
 AND (coalesce(cardinality(p_domaines),0) = 0 OR EXISTS (
   SELECT 1 FROM public.collectivites_competences cc WHERE cc.siren=c.siren AND cc.domaine=ANY(p_domaines)))
 AND (p_q IS NULL OR position(lower(p_q) IN lower(c.nom)) > 0 OR c.siren=p_q)
 AND (NOT p_telephone OR nullif(btrim(c.telephone),'') IS NOT NULL)
 AND (NOT p_email OR nullif(btrim(c.email),'') IS NOT NULL)
 AND (p_statut IS NULL OR c.statut_prospection = p_statut);
$$;
CREATE FUNCTION public.collectivites_summary_v1() RETURNS jsonb LANGUAGE sql STABLE SECURITY INVOKER SET search_path = '' AS $$
 SELECT jsonb_build_object(
 'total', (SELECT count(*) FROM public.collectivites),
 'categories', (SELECT coalesce(jsonb_agg(x),'[]') FROM (SELECT categorie, count(*) AS nb FROM public.collectivites GROUP BY categorie ORDER BY categorie) x),
 'telephone', (SELECT count(*) FROM public.collectivites WHERE nullif(btrim(telephone),'') IS NOT NULL),
 'email', (SELECT count(*) FROM public.collectivites WHERE nullif(btrim(email),'') IS NOT NULL),
 'types', (SELECT coalesce(jsonb_agg(x),'[]') FROM (SELECT DISTINCT code_type, type FROM public.collectivites ORDER BY code_type) x),
 'departements', (SELECT coalesce(jsonb_agg(x),'[]') FROM (SELECT DISTINCT code_departement, departement FROM public.collectivites ORDER BY code_departement) x),
 'domaines', (SELECT coalesce(jsonb_agg(x),'[]') FROM (SELECT domaine, sum(nb)::integer AS nb FROM public.v_collectivites_par_domaine GROUP BY domaine ORDER BY sum(nb) DESC, domaine) x),
 'statuts', (SELECT coalesce(jsonb_agg(statut_prospection ORDER BY statut_prospection),'[]') FROM (SELECT DISTINCT statut_prospection FROM public.collectivites WHERE statut_prospection IS NOT NULL) x)
 );
$$;
REVOKE ALL ON FUNCTION public.search_collectivites_v1(text,text,text,text[],text,boolean,boolean,text), public.collectivites_summary_v1() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.search_collectivites_v1(text,text,text,text[],text,boolean,boolean,text), public.collectivites_summary_v1() TO authenticated, service_role;
COMMIT;
