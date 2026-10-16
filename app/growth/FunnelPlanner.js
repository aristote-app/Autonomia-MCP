"use client";

import { useState } from "react";
import { weeklyCapacity } from "../../lib/intelligence/growthEngine.js";
import styles from "./page.module.css";

function Range({label,value,onChange,max,min=0,step=1,unit="%"}) {
  return <label className={styles.range}>
    <span>{label}<strong>{value}{unit}</strong></span>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={event=>onChange(Number(event.target.value))} />
  </label>;
}

/** All values are local scenario assumptions; no hidden account telemetry. */
export default function FunnelPlanner() {
  const [invites,setInvites]=useState(200);
  const [acceptance,setAcceptance]=useState(35);
  const [reply,setReply]=useState(18);
  const [booking,setBooking]=useState(35);
  const forecast=weeklyCapacity({
    target:40,invites,accept:acceptance/100,replied:reply/100,booked:booking/100
  });
  return <div className={styles.planner}>
    <p className={styles.copy}>Ajuste les hypothèses : ce calcul n'utilise pas encore les statistiques de tes campagnes.</p>
    <Range label="Invitations LinkedIn / semaine" value={invites} min={0} max={200} step={10} unit="" onChange={setInvites}/>
    <Range label="Taux d'acceptation supposé" value={acceptance} max={100} step={5} onChange={setAcceptance}/>
    <Range label="Réponses parmi les contacts acceptés" value={reply} max={100} step={2} onChange={setReply}/>
    <Range label="Réponses transformées en RDV" value={booking} max={100} step={5} onChange={setBooking}/>
    <div className={styles.estimates} aria-live="polite">
      <div><strong>{forecast.linkedinTheoretical.toLocaleString("fr-FR")}</strong><small>RDV LinkedIn théoriques / semaine</small></div>
      <div><strong>{forecast.otherChannelsRequired}</strong><small>RDV à obtenir par les autres canaux</small></div>
      <div><strong>{forecast.meetingsPerWorkingDay}</strong><small>RDV/jour sur 5 jours</small></div>
    </div>
    <p className={styles.warning}>Il s'agit d'un simulateur d'hypothèses, pas d'une prédiction ni d'une incitation à atteindre les plafonds LinkedIn.</p>
  </div>;
}
