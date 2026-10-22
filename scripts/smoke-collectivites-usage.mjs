import assert from 'node:assert/strict';
import { parseFilters, validatePatch, csvCell } from '../lib/collectivites/contract.js';
import { filtersToParams, initialFilters, prepareMessage, nextAction } from '../lib/collectivites/usability.js';
const filters = { code_departement:'02', domaine:['Eau potable','Numérique / SIG'], email:'true', q:'Aisne' };
const params = filtersToParams(filters);
assert.deepEqual(initialFilters({ ...Object.fromEntries(params), domaine:params.getAll('domaine') }), filters);
assert.deepEqual(parseFilters(new URLSearchParams('sirens=200051100,200051100,200071785')).selectedSirens, ['200051100','200071785']);
for (const sirens of ['', 'abc', '123456789;drop', Array.from({length:201},(_,i) => String(i).padStart(9,'0')).join(',')]) {
  assert.throws(() => parseFilters(new URLSearchParams({ sirens })));
}
assert.throws(() => validatePatch({ nom:'change' }));
assert.throws(() => validatePatch({ notes:'a'.repeat(20001) }));
const message = prepareMessage({ nom:'Structure test' });
assert.ok(message.includes('Structure test'));
assert.ok(message.includes('bonne personne'));
assert.ok(!message.includes('besoin identifié'));
assert.ok(prepareMessage({nom:'X'},'automatisation').includes('validation par les équipes'));
assert.ok(nextAction('à relancer').includes('dernier échange'));
assert.ok(csvCell('=FORMULA').startsWith('"\''));
console.log('Collectivités: selection bounds, URL filter round trip, message provenance and write allowlist passed');
