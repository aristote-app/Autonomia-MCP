import assert from 'node:assert/strict';
import {normalizeTrainingDraft,workflowMatch,trainingWaalaxyCsv,gmailComposeLink} from '../lib/training/prospectWorkflow.js';
assert.throws(()=>normalizeTrainingDraft({stage:'other'}));
assert.throws(()=>normalizeTrainingDraft({nextFollowup:'2026-02-31'}));
assert.throws(()=>normalizeTrainingDraft({linkedin:'https://www.linkedin.com/search/results/people/'}));
assert.throws(()=>normalizeTrainingDraft({email:'wrong'}));
assert.equal(normalizeTrainingDraft({stage:'reponse',nextFollowup:'2026-10-29'}).nextFollowup,'');
assert.equal(normalizeTrainingDraft({doNotContact:true,nextFollowup:'2026-10-29'}).nextFollowup,'');
assert.equal(workflowMatch({nextFollowup:'2026-10-28'},'due','2026-10-28'),true);
assert.equal(workflowMatch({nextFollowup:'2026-10-28',doNotContact:true},'due','2026-10-28'),false);
const a={id:'one',contact:'Camille Martin',buyer:'=formula',contactProfile:'https://fr.linkedin.com/in/camille'};
const b={...a,id:'two'};
assert.equal(trainingWaalaxyCsv([a,b]).count,1);
assert.equal(trainingWaalaxyCsv([a],{one:{doNotContact:true}}).count,0);
assert.ok(trainingWaalaxyCsv([a]).text.includes("'=formula"));
assert.equal(gmailComposeLink('bad','hello'),null);
assert.ok(gmailComposeLink('test@example.com','Objet : Test\n\nBonjour').includes('su=Test'));
console.log('Training CRM: validation, opt-out, due views, CSV dedupe and Gmail compose OK');

const {safeInternalPath}=await import('../lib/auth/redirect.js');
assert.equal(safeInternalPath('//evil.example'),'/missions-formateurs');
assert.equal(safeInternalPath('/\\evil.example'),'/missions-formateurs');
assert.equal(safeInternalPath('/missions-formateurs'),'/missions-formateurs');

const {parseEmailProof}=await import('../lib/auth/emailProof.js');
assert.deepEqual(parseEmailProof('123456','test@example.com'),{email:'test@example.com',token:'123456',type:'email'});
assert.deepEqual(parseEmailProof('https://haazpzbwcryaksgtormn.supabase.co/auth/v1/verify?token=fake-test-token&type=magiclink','test@example.com'),{token_hash:'fake-test-token',type:'magiclink'});
for(const url of ['https://evil.example/?token=fake&type=email','http://cockpit.build-autonomia.com/?token=fake&type=email','https://user@cockpit.build-autonomia.com/?token=fake&type=email','https://cockpit.build-autonomia.com/?token=fake&type=recovery','https://cockpit.build-autonomia.com/?type=email'])assert.throws(()=>parseEmailProof(url,'test@example.com'));
