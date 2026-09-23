import Link from "next/link";

export const dynamic = "force-dynamic";

function State({ ready, label }) {
  return (
    <span className={ready ? "integrationReady" : "integrationMissing"}>
      {ready ? "PRÊT" : "À BRANCHER"} · {label}
    </span>
  );
}

export default function IntegrationsPage() {
  const states = {
    brave: Boolean(process.env.BRAVE_SEARCH_API_KEY),
    franceTravail: Boolean(
      process.env.FRANCE_TRAVAIL_CLIENT_ID &&
      process.env.FRANCE_TRAVAIL_CLIENT_SECRET
    ),
    kaspr: Boolean(process.env.KASPR_API_KEY),
    waalaxy: Boolean(process.env.WAALAXY_API_KEY),
    decisionDiscovery:
      process.env.AUTONOMIA_DECISION_DISCOVERY_ENABLED === "true" &&
      Boolean(process.env.BRAVE_SEARCH_API_KEY),
    accountResearch:
      process.env.AUTONOMIA_ACCOUNT_RESEARCH_ENABLED === "true" &&
      Boolean(process.env.BRAVE_SEARCH_API_KEY)
  };

  return (
    <main>
      <div className="detailBack">
        <Link href="/">← Retour au cockpit</Link>
      </div>

      <header className="integrationHero">
        <div>
          <p className="eyebrow">AUTONOMIA · SALES STACK</p>
          <h1>Intégrations</h1>
          <p className="lede">
            État des briques utilisées par le radar, l'enrichissement et l'exécution commerciale.
            Aucun secret n'est affiché ici.
          </p>
        </div>
      </header>

      <section className="integrationGrid">
        <article>
          <State ready={states.franceTravail} label="France Travail" />
          <h2>Demandes & missions</h2>
          <p>
            API officielle utilisée pour remonter les offres IA, freelance et besoins formateurs.
          </p>
        </article>

        <article>
          <State ready={states.brave} label="Brave Search" />
          <h2>Discovery web</h2>
          <p>
            LinkedIn/Indeed et signaux publics indexés. Les appels automatiques sont volontairement
            ralentis pour maîtriser le quota.
          </p>
        </article>

        <article>
          <State ready={states.kaspr} label="Kaspr" />
          <h2>Enrichissement sélectif</h2>
          <p>
            Réservé aux meilleurs décideurs après qualification. Pas d'enrichissement de masse par défaut.
          </p>
        </article>

        <article>
          <State ready={states.waalaxy} label="Waalaxy" />
          <h2>Exécution commerciale</h2>
          <p>
            Le connecteur API Autonomia est prêt pour importer un profil LinkedIn dans une liste
            Waalaxy et, si choisi, l'inscrire à une campagne.
          </p>
        </article>

        <article>
          <State ready={states.accountResearch} label="Account Researcher" />
          <h2>Recherche compte</h2>
          <p>
            Contexte public IA, transformation, recrutement et partenariats. Deux recherches Brave
            maximum par déclenchement, uniquement à la demande.
          </p>
        </article>

        <article>
          <State ready={states.decisionDiscovery} label="Decision Maker Finder" />
          <h2>Recherche décideurs</h2>
          <p>
            Désactivée par défaut tant que le cockpit n'est pas sécurisé, afin qu'un visiteur
            ne puisse pas consommer le quota Brave.
          </p>
        </article>

        <article>
          <State ready={true} label="Account Intelligence" />
          <h2>Signal stacking</h2>
          <p>
            Regroupement des signaux par compte, déduplication, détection du risque intermédiaire,
            offres possibles, rôles cibles et plan d'approche.
          </p>
        </article>

        <article>
          <State ready={true} label="Commercial Memory" />
          <h2>Contacts & apprentissage</h2>
          <p>
            Mémoire contacts et journal d'événements actifs côté serveur. Les données personnelles
            restent invisibles sans session de workspace.
          </p>
        </article>

        <article>
          <State ready={true} label="MCP Revenue Agent" />
          <h2>Agent sans plateforme supplémentaire</h2>
          <p>
            Le MCP expose les comptes 360°, les prochaines actions, la recherche compte et la
            découverte de décideurs à un client IA autorisé, derrière le token interne Autonomia.
          </p>
        </article>

        <article>
          <State ready={true} label="Follow-up Engine" />
          <h2>Relances proactives</h2>
          <p>
            Les contacts peuvent porter une prochaine action datée. Les relances dues remontent
            dans le pipeline et dans le moteur Next Best Action.
          </p>
        </article>
      </section>
    </main>
  );
}
