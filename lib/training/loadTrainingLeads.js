import {searchJobSignals} from '../db/jobSignals.js';
import {hasAutonomiaDatabase} from '../db/supabase.js';
import {TRAINER_BUYERS} from './trainerBuyerIntelligence.js';
import {fromSignal} from './trainingSignals.js';
import {classifyTrainingFamily,classifyTrainingBuyer,rankTrainingLead} from './trainingLeadFilters.js';
import {trainingSourceKey} from './sourceKey.js';
export {trainingSourceKey} from './sourceKey.js';
export async function loadTrainingLeads(){
 let discoveryError=false;
 const result=hasAutonomiaDatabase()?await searchJobSignals({sources:['linkedin','indeed','codeur_training','france_travail_jobs'],signalKey:'training_need',franceOnly:false,limit:500}).catch(()=>{discoveryError=true;return null;}):null;
 const incoming=(result?.items||[]).map(fromSignal).filter(Boolean);
 const reviewed=TRAINER_BUYERS.filter(l=>/\/(?:posts|projects|jobs\/view)\//.test(l.source||'')).map(l=>({...l,theme:classifyTrainingFamily(l.need||'',l.theme),buyerType:l.buyerType||classifyTrainingBuyer({buyer:l.buyer,description:l.evidence||''})}));
 const bySource=new Map();for(const lead of [...incoming,...reviewed])bySource.set(trainingSourceKey(lead.source),lead);
 return {leads:[...bySource.values()].sort((a,b)=>rankTrainingLead(b)-rankTrainingLead(a)),incomingCount:incoming.length,reviewedCount:reviewed.length,discoveryError};
}
