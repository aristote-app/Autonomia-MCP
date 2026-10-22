# Collectivités — integration o2switch

Source declared by the supplied archive: BANATIC / DGCL, 22 October 2026.
The archive itself was validated; BANATIC provenance and current presidents were not independently verified.

## Delivery state

The AUTONOMIA database (`haazpzbwcryaksgtormn`) has been inspected and the new module
objects installed. Imported and verified: 9,277 structures and 51,040 competences;
the existing 1,217 territories were preserved. RLS, column grants, authenticated
read/filter access and a rolled-back notes update were verified remotely.

The first o2switch deployment exposed the new route but lacked the public Auth key
in the active process. Auth now resolves the public key for this exact project in
`lib/auth/server.js`, independently of the configured startup file. Explicit
configuration takes precedence; no fallback is applied to other projects.

## Database first

From a trusted machine with psql and `AUTONOMIA_DATABASE_URL` set to the AUTONOMIA database:

```
python scripts/import-collectivites.py
python scripts/import-collectivites.py --apply
```

First command is read-only. Any existing module object stops both commands and prints
existing columns and differences. Present the report and a SIREN merge proposal before
changing existing tables. Preserve commercial status and notes in any later approved merge.
No contact_operationnel column is created; its future addition is explicitly deferred.

For an empty target, the second command creates the new tables, RLS, column privileges,
security-invoker view/functions, imports parents before children with COPY, and checks
9,277 / 51,040 rows within one transaction. Failure rolls back the new objects and all data.
The existing territories, territory_signals, and territory_acquisition_v1 objects are untouched.

Setup requires PostgreSQL 15+ (security_invoker views). All authenticated users may read;
only status and notes have UPDATE grants. Neither anon access nor INSERT/DELETE grants
are provided. The application uses the authenticated user's client, not the service role.
API PATCH checks origin, SIREN, allowed columns, status values and note length.

## UI and deployment

Existing /territoires page and detail routes keep their priorities and signal features.
Home navigation becomes “Territoires et Collectivités”. /collectivites adds the full
filterable directory, 50-row pages, details, editable status/notes, global stats and
chart from v_collectivites_par_domaine. Multiple domains mean ANY selected domain.
The source describes intercommunal structures, not all French municipalities.
CSV exports every matching row, not just the current page. It is an organization/contact
export, not a LinkedIn-profile import: individual LinkedIn URLs still require enrichment.
CSV formula-like cells are neutralized; this can prefix phone strings beginning with +.

After DB setup is verified and advisors checked, merge the implementation into main.
The existing validate → deploy-o2switch-self workflow builds an isolated candidate and
restarts Passenger on o2switch. Verify deployedSha in /api/health and the authenticated
/collectivites page. No Vercel configuration is needed or changed.

Required acceptance checks with a real authenticated session:
- counts, department with leading zero, category/type, multi-domain OR, combined contact filters;
- sort, pagination, complete filtered CSV, accented/multiline CSV data;
- status and notes round trip, unknown SIREN 404, forbidden fields rejected;
- anon denied, direct DB identity-column updates/insert/delete denied;
- original /territoires and territory details still render.

## Direct access requested by owner

The owner subsequently requested removal of mandatory cockpit login. The page,
read/export/detail APIs and status/notes API now use direct access through the
server. The database service key remains server-only; database RLS and anonymous
SQL privileges are unchanged. The PATCH origin check and strict two-column
allowlist remain enforced. Anyone able to open the cockpit URL can read the
module (including notes) and edit status/notes. Internal deployment hooks and
credential/workspace administration keep their separate authorization checks.
