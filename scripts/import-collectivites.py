#!/usr/bin/env python3
"""Read-only preflight by default. --apply creates NEW objects and imports atomically.
Never changes an existing module table, even when columns match.
Requires psql and AUTONOMIA_DATABASE_URL (direct PostgreSQL URI, never printed).
"""
import argparse, csv, io, json, os, pathlib, subprocess, sys
ROOT = pathlib.Path(__file__).resolve().parents[1]
DATA = ROOT / 'docs' / 'collectivites'
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--apply', action='store_true')
args = parser.parse_args()
url = os.environ.get('AUTONOMIA_DATABASE_URL', '')
if not url:
    sys.exit('Missing AUTONOMIA_DATABASE_URL. No database changes made.')
# psql receives the URI only through the environment, not argv or logs.
env = {**os.environ, 'PGDATABASE': url}
def run(sql):
    result = subprocess.run(['psql','-X','-q','-A','-t','-v','ON_ERROR_STOP=1'], input=sql, text=True, capture_output=True, env=env)
    if result.returncode:
        # Database errors can include source records; redact URI/password if present.
        message = result.stderr.replace(url, '[database URI]')
        raise RuntimeError(message)
    return result.stdout.strip()
rows = list(csv.DictReader((DATA/'collectivites.csv').open(encoding='utf-8-sig', newline='')))
competences = list(csv.DictReader((DATA/'collectivites_competences.csv').open(encoding='utf-8-sig', newline='')))
assert len(rows) == 9277 and len(competences) == 51040, 'Unexpected source counts'
assert len({r['siren'] for r in rows}) == 9277, 'Duplicate SIREN'
sirens = {x['siren'] for x in rows}
assert all(r['siren'] in sirens for r in competences), 'Orphan competence'
existing = json.loads(run("""SELECT coalesce(json_agg(x),'[]') FROM (
 SELECT table_name,column_name,data_type,column_default FROM information_schema.columns
 WHERE table_schema='public' AND table_name IN ('collectivites','collectivites_competences','v_collectivites_par_domaine') ORDER BY table_name,ordinal_position) x;"""))
if existing:
    proposed = {'collectivites': list(rows[0]) + ['statut_prospection','notes','updated_at'], 'collectivites_competences':['id','siren','domaine','competence']}
    print(json.dumps({'existing_columns': existing, 'column_differences': {table: {'missing': sorted(set(cols)-{c['column_name'] for c in existing if c['table_name']==table}), 'additional': sorted({c['column_name'] for c in existing if c['table_name']==table}-set(cols))} for table, cols in proposed.items()}}, ensure_ascii=False, indent=2))
    sys.exit('STOP: existing objects. Proposed merge: match on siren; preserve notes/status; report source field conflicts for review. No changes made.')
print('Preflight: no existing module objects; validated 9277 structures and 51040 competences.')
if not args.apply:
    sys.exit(0)
# One transaction, including setup, child import and exact counts. Setup rechecks for races.
setup = (DATA/'setup.sql').read_text().replace('COMMIT;', '')
queries = (DATA/'queries.sql').read_text().replace('BEGIN;', '').replace('COMMIT;', '')
sql = io.StringIO(); sql.write(setup+'\n'+queries+'\n')
for table, records in [('collectivites', rows), ('collectivites_competences', competences)]:
    columns = list(records[0])
    sql.write('COPY public.'+table+' ('+','.join(columns)+") FROM STDIN WITH (FORMAT csv, HEADER true, NULL '');\n")
    writer = csv.DictWriter(sql, fieldnames=columns, lineterminator='\n'); writer.writeheader(); writer.writerows(records)
    sql.write('\\.\n')
sql.write("""DO $$ BEGIN
 IF (SELECT count(*) FROM public.collectivites) <> 9277 OR
 (SELECT count(*) FROM public.collectivites_competences) <> 51040 THEN
 RAISE EXCEPTION 'Unexpected imported counts'; END IF;
END $$;
COMMIT;
SELECT json_build_object('collectivites', (SELECT count(*) FROM public.collectivites), 'competences', (SELECT count(*) FROM public.collectivites_competences));
""")
print(run(sql.getvalue()))
