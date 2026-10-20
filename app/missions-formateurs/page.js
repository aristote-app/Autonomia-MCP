import {searchJobSignals} from "../../lib/db/jobSignals.js";
import {hasAutonomiaDatabase} from "../../lib/db/supabase.js";
export const dynamic="force-dynamic";
export default async function Page(){const r=hasAutonomiaDatabase()?await searchJobSignals({sources:["linkedin","indeed"],signalKey:"trainer_mission_demand",franceOnly:false,limit:250}).catch(()=>null):null;return <main><h1>Missions de formateurs en France et à l’international</h1><p>{r?.items?.length||0} demandes détectées, à qualifier.</p>{(r?.items||[]).map(x=><p key={x.id}><a href={x.source_url}>{x.title}</a> — {x.raw_payload?.target_country||"Pays à vérifier"}</p>)}</main>}
