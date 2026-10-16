import Link from "next/link";
import { getCurrentWorkspaceMembership } from "../../lib/auth/access.js";
import { hasAutonomiaDatabase } from "../../lib/db/supabase.js";
import { loadAccountIntelligence } from "../../lib/db/accountIntelligence.js";
import { listWorkspaceSalesContacts } from "../../lib/db/salesContacts.js";
import { listInboundLeads } from "../../lib/db/inboundLeads.js";
import { buildGrowthPlays, growthStats, weeklyCapacity } from "../../lib/intelligence/growthEngine.js";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "Growth Engine · AUTONOMIA",
  robots: { index: false, follow: false }
};

const TRACKS = [
  ["all", "Tous les plans"],
  ["BUILD", "BUILD — Réalisation"],
  ["EXPERTS", "EXPERTS — Compétences"],
  ["ACADEMY", "ACADEMY — Formation"]
];
const STATUS = [
  ["all", "Toutes les actions"],
  ["respond", "Réponses"],
  ["prepare_meeting", "Rendez-vous"],
  ["prepare", "Prêts à préparer"],
  ["verify", "À vérifier"],
  ["find_decider", "Décideur à trouver"]
];

function dataDate(value) {
  if (!value) return "Date non vérifiée";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "Date non vérifiée";
  return d.toLocaleDateString("fr-FR", {day:"2-digit",month:"short",year:"numeric",timeZone:"Europe/Paris"});
}

export default async function GrowthPage({ searchParams }) {
  const params = await searchParams;
  const selectedOffer = TRACKS.some(([k])=>k===params?.offer)?params.offer:"all";
  const selectedAction = STATUS.some(([k])=>k===params?.action)?params.action:"all";
  const context = await getCurrentWorkspaceMembership().catch(()=>null);
  const allowed = Boolean(context?.claims?.sub && context?.membership?.workspace_id);
  const ready = hasAutonomiaDatabase();
  if (!allowed || !ready) {
    return <main className={styles.shell}>
      <Link href="/" className={styles.back}>← Retour au cockpit</Link>
      <div className={styles.hero}>
        <p className={styles.eyebrow}>AUTONOMIA · GROWTH ENGINE</p>
        <h1>Centre de conquête commerciale</h1>
        <p>Les comptes, contacts et informations commerciales restent accessibles uniquement aux utilisateurs authentifiés du workspace AUTONOMIA.</p>
        <Link className={styles.primaryLink} href="/login">Accéder au cockpit →</Link>
      </div>
    </main>;
  }
  const workspaceId = context.membership.workspace_id;
  const [accountsResult,contacts,inbound]=await Promise.all([
    loadAccountIntelligence({limit:500}).catch(()=>null),
    listWorkspaceSalesContacts({workspaceId,limit:500}).catch(()=>[]),
    listInboundLeads({workspaceId,limit:500}).catch(()=>[])
  ]);
  const accounts=accountsResult?.accounts||[];
  const waalaxyReady=Boolean(process.env.WAALAXY_API_KEY);
  const plays=buildGrowthPlays({accounts,contacts,waalaxyReady,limit:400});
  const overview=growthStats({accounts,contacts,inbound});
  const funnel=weeklyCapacity({target:40,invites:200,accept:.35,replied:.18,booked:.35});
  const shown=plays
    .filter(p=>selectedOffer==="all"||p.offer===selectedOffer)
    .filter(p=>selectedAction==="all"||p.action.id===selectedAction)
    .slice(0,50);
  const actionUrl=(offer,action)=>"/growth?offer="+encodeURIComponent(offer)+"&action="+encodeURIComponent(action);
  return <main className={styles.shell}>
    <Link href="/" className={styles.back}>← Cockpit AUTONOMIA</Link>
    <header className={styles.hero}>
      <div>
        <p className={styles.eyebrow}>AUTONOMIA · GROWTH INTELLIGENCE</p>
        <h1>La machine à rendez-vous</h1>
        <p>Entreprises clientes finales, décideurs pertinents, propositions contextualisées, suivi commercial. Les recommandations ci-dessous proviennent des données du cockpit.</p>
      </div>
      <div className={styles.target}><span>OBJECTIF HEBDOMADAIRE</span><strong>40</strong><small>rendez-vous qualifiés · cible non atteinte par défaut</small></div>
    </header>
    <section className={styles.metrics} aria-label="État actuel du pipeline">
      <article><strong>{overview.accounts-overview.excluded}</strong><span>comptes candidats hors intermédiaires connus</span></article>
      <article><strong>{overview.verified}</strong><span>contacts au statut vérifié</span></article>
      <article><strong>{overview.interested}</strong><span>réponses et leads qualifiés en pipeline</span></article>
      <article><strong>{overview.pipelineMeetings}</strong><span>fiches actuellement au stade RDV (toutes périodes)</span></article>
    </section>
    <div className={styles.cols}>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>LIMITE DE CAPACITÉ</p>
        <h2>40 RDV/semaine demandent plusieurs canaux</h2>
        <p className={styles.copy}>Scénario de travail, et non prévision : 200 invitations LinkedIn/semaine × 35 % d'acceptation × 18 % de réponse × 35 % de transformation des réponses en rendez-vous.</p>
        <div className={styles.estimates}>
          <div><strong>{funnel.linkedinTheoretical.toLocaleString("fr-FR")}</strong><small>RDV LinkedIn théoriques / semaine</small></div>
          <div><strong>{funnel.otherChannelsRequired}</strong><small>RDV à obtenir par d'autres canaux</small></div>
          <div><strong>{funnel.meetingsPerWorkingDay}</strong><small>RDV à tenir / jour sur 5 jours</small></div>
        </div>
        <p className={styles.warning}>Le plafond Waalaxy Advanced n'est pas un objectif d'envoi. Respecter les règles LinkedIn et augmenter les volumes seulement après contrôle qualité.</p>
      </section>
      <section className={styles.panel}>
        <p className={styles.eyebrow}>ÉTAT DES OUTILS</p>
        <h2>Orchestration, pas empilement d'abonnements</h2>
        <div className={styles.integrationRow}><span>Waalaxy API REST</span><b>{waalaxyReady?"Clé configurée":"À connecter après Advanced"}</b></div>
        <div className={styles.integrationRow}><span>Kaspr</span><b>{process.env.KASPR_API_KEY?"Clé configurée":"Accès API à vérifier"}</b></div>
        <div className={styles.integrationRow}><span>Comptes 360°</span><b>{accountsResult?"Données chargées":"Chargement indisponible"}</b></div>
        <div className={styles.integrationRow}><span>Automatisation des envois</span><b>Validation humaine requise</b></div>
        <p className={styles.copy}>Les clés sont stockées côté serveur. Cet écran n'effectue aucun import ni aucun envoi de message.</p>
      </section>
    </div>
    <section className={styles.panel}>
      <div className={styles.sectionHead}>
        <div><p className={styles.eyebrow}>AGENTS À ORCHESTRER</p><h2>Six fonctions complémentaires</h2></div>
        <span className={styles.muted}>Cibles de développement, pas agents déjà actifs</span>
      </div>
      <div className={styles.agentGrid}>
        {[
          ["01","Prospection proactive","Trouver DSI, CTO, chefs de projet, responsables formation dans les comptes cibles."],
          ["02","Détection des besoins","Surveiller offres d'emploi IA, annonces et déploiements numériques de clients finaux."],
          ["03","Cartographie des décideurs","Rapprocher les contacts existants, contrôler fonctions et éviter les doublons."],
          ["04","Proposition contextualisée","Préparer un angle BUILD, EXPERTS ou ACADEMY sans inventer de signal."],
          ["05","Orchestrateur Waalaxy","Vérifier le contact et proposer l'inscription API à une campagne existante."],
          ["06","Conversion et apprentissage","Mesurer réponses, RDV tenus, devis, CA signé et performances par segment."]
        ].map(([n,t,d])=><article className={styles.agent} key={n}><span>{n}</span><h3>{t}</h3><p>{d}</p></article>)}
      </div>
    </section>
    <section className={styles.worklist}>
      <div className={styles.sectionHead}>
        <div><p className={styles.eyebrow}>NEXT BEST ACTION</p><h2>Priorités commerciales issues du cockpit</h2></div>
        <span className={styles.muted}>{shown.length} propositions affichées sur {plays.length} au total</span>
      </div>
      <nav className={styles.filters} aria-label="Offre visée">
        {TRACKS.map(([k,label])=><Link key={k} href={actionUrl(k,selectedAction)} className={selectedOffer===k?styles.chosen:styles.filter}>{label}</Link>)}
      </nav>
      <nav className={styles.filters} aria-label="Type d'action">
        {STATUS.map(([k,label])=><Link key={k} href={actionUrl(selectedOffer,k)} className={selectedAction===k?styles.chosen:styles.filter}>{label}</Link>)}
      </nav>
      {shown.length?<div className={styles.playGrid}>
        {shown.map(play=><article className={styles.play} key={play.id}>
          <div className={styles.playTop}><span className={styles.track}>{play.offer}</span><span className={styles.score}>Priorité {play.score}/100</span></div>
          <h3>{play.company}</h3>
          <p className={styles.role}>{play.contactName||"Décideur à identifier"}{play.contactRole?" · "+play.contactRole:""}</p>
          <p><strong>{play.action.label}.</strong> {play.action.reason}</p>
          {play.evidence?<div className={styles.evidence}><span>Signal sourcé · {dataDate(play.evidence.date)}</span><a href={play.evidence.url} target="_blank" rel="noopener noreferrer">{play.evidence.title} ↗</a></div>:
            <div className={styles.evidence}><span>Prospection proactive</span><p>Besoin non démontré — message de découverte uniquement.</p></div>}
          <div className={styles.cardLinks}>
            <Link href={play.route}>Ouvrir le compte →</Link>
            {play.linkedIn?<a href={play.linkedIn} target="_blank" rel="noopener noreferrer">Profil LinkedIn ↗</a>:null}
          </div>
        </article>)}
      </div>:<div className={styles.empty}>Aucune opportunité correspondant à ces filtres. Le moteur n'invente pas de prospects ; il utilise uniquement les comptes et contacts déjà enregistrés.</div>}
    </section>
    <div className={styles.bottom}>
      <p><strong>À mesurer dès le lancement :</strong> rendez-vous pris et tenus par semaine, taux de réponse positive, devis, CA signé, temps moyen entre signal et premier échange. Ne pas confondre une étape « RDV » du pipeline avec un rendez-vous réellement tenu cette semaine.</p>
      <div><Link href="/accounts">Comptes 360° →</Link><Link href="/contacts">Pipeline contacts →</Link><Link href="/integrations">Intégrations →</Link></div>
    </div>
  </main>;
}
