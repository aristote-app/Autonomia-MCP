import Link from "next/link";
import { getCurrentWorkspaceMembership, canManageWorkspace } from "../../lib/auth/access.js";
import { runtimeIntegrationStatus } from "../../lib/runtime/integrationSettings.js";
import { saveIntegrationSettings } from "../actions/integration-settings.js";

export const dynamic = "force-dynamic";

function State({ ready, label }) {
  return (
    <span className={ready ? "integrationReady" : "integrationMissing"}>
      {ready ? "PRÊT" : "À BRANCHER"} · {label}
    </span>
  );
}

export default async function IntegrationsPage() {
  const context = await getCurrentWorkspaceMembership().catch(() => ({
    configured: false,
    claims: null,
    membership: null
  }));
  const canManage = Boolean(
    context?.claims?.sub &&
    context?.membership &&
    canManageWorkspace(context.membership.role)
  );
  const runtimeState = canManage
    ? await runtimeIntegrationStatus().catch(() => null)
    : null;
  const states = {
    brave: Boolean(process.env.BRAVE_SEARCH_API_KEY),
    franceTravail: Boolean(
      process.env.FRANCE_TRAVAIL_CLIENT_ID &&
      process.env.FRANCE_TRAVAIL_CLIENT_SECRET
    ),
    kaspr: Boolean(process.env.KASPR_API_KEY),
    kasprEnrichment: Boolean(
      process.env.KASPR_API_KEY &&
      String(process.env.KASPR_DATA_TO_GET || "").trim()
    ),
    waalaxy: Boolean(process.env.WAALAXY_API_KEY),
    waalaxyReply: Boolean(process.env.AUTONOMIA_WAALAXY_WEBHOOK_TOKEN),
    decisionDiscovery:
      process.env.AUTONOMIA_DECISION_DISCOVERY_ENABLED === "true" &&
      Boolean(process.env.BRAVE_SEARCH_API_KEY),
    accountResearch:
      process.env.AUTONOMIA_ACCOUNT_RESEARCH_ENABLED === "true" &&
      Boolean(process.env.BRAVE_SEARCH_API_KEY),
    selfDeploy: true
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

      {canManage && (
        <section className="integrationSettingsPanel">
          <div className="sectionTitle">
            <div>
              <p className="eyebrow">CONNEXIONS SERVEUR</p>
              <h2>Brancher sans terminal.</h2>
            </div>
            <p>
              Les champs secrets ne sont jamais préremplis. Laisser un champ vide conserve la valeur
              actuelle ; cocher « effacer » la supprime du stockage serveur.
            </p>
          </div>

          <form action={saveIntegrationSettings} className="integrationSettingsForm">
            <fieldset>
              <legend>Kaspr</legend>
              <label>
                <span>API key</span>
                <input
                  type="password"
                  name="KASPR_API_KEY"
                  autoComplete="new-password"
                  placeholder={runtimeState?.configured?.KASPR_API_KEY ? "Configurée · laisser vide pour conserver" : "À renseigner"}
                />
              </label>
              <label>
                <span>Champs Kaspr autorisés</span>
                <input
                  name="KASPR_DATA_TO_GET"
                  placeholder={runtimeState?.configured?.KASPR_DATA_TO_GET ? "Configurés · laisser vide pour conserver" : "IDs/champs autorisés selon ton compte Kaspr"}
                />
              </label>
              <label className="integrationClear">
                <input type="checkbox" name="clear_KASPR_API_KEY" />
                <span>Effacer la clé Kaspr enregistrée</span>
              </label>
            </fieldset>

            <fieldset>
              <legend>Waalaxy</legend>
              <label>
                <span>API key</span>
                <input
                  type="password"
                  name="WAALAXY_API_KEY"
                  autoComplete="new-password"
                  placeholder={runtimeState?.configured?.WAALAXY_API_KEY ? "Configurée · laisser vide pour conserver" : "À renseigner"}
                />
              </label>
              <label>
                <span>Token webhook réponses</span>
                <input
                  type="password"
                  name="AUTONOMIA_WAALAXY_WEBHOOK_TOKEN"
                  autoComplete="new-password"
                  placeholder={runtimeState?.configured?.AUTONOMIA_WAALAXY_WEBHOOK_TOKEN ? "Configuré · laisser vide pour conserver" : "Secret fort choisi pour le webhook"}
                />
              </label>
              <label className="integrationClear">
                <input type="checkbox" name="clear_WAALAXY_API_KEY" />
                <span>Effacer la clé Waalaxy enregistrée</span>
              </label>
            </fieldset>

            <fieldset>
              <legend>Acquisition & recherche</legend>
              <label>
                <span>Token leads entrants</span>
                <input
                  type="password"
                  name="AUTONOMIA_INBOUND_TOKEN"
                  autoComplete="new-password"
                  placeholder={runtimeState?.configured?.AUTONOMIA_INBOUND_TOKEN ? "Configuré · laisser vide pour conserver" : "Secret pour l'API inbound"}
                />
              </label>
              <label className="integrationToggle">
                <input
                  type="checkbox"
                  name="account_research_enabled"
                  defaultChecked={Boolean(runtimeState?.flags?.account_research)}
                />
                <span>Activer Account Researcher</span>
              </label>
              <label className="integrationToggle">
                <input
                  type="checkbox"
                  name="decision_discovery_enabled"
                  defaultChecked={Boolean(runtimeState?.flags?.decision_discovery)}
                />
                <span>Activer Decision Maker Finder</span>
              </label>
            </fieldset>

            <div className="integrationSettingsFooter">
              <button type="submit">Enregistrer côté serveur</button>
              <small>
                Fichier .runtime ignoré par Git · permissions 600 · jamais renvoyé par l'API health.
              </small>
            </div>
          </form>
        </section>
      )}

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
          <State ready={states.kasprEnrichment} label="Kaspr" />
          <h2>Enrichissement sélectif</h2>
          <p>
            La clé seule ne suffit pas : Autonomia exige aussi une liste explicite des champs payants autorisés.
            L'enrichissement reste manuel, réservé aux contacts vérifiés et ne se lance jamais en masse.
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
          <State ready={states.waalaxyReply} label="Waalaxy Reply Sync" />
          <h2>Réponses → CRM Autonomia</h2>
          <p>
            Endpoint webhook prêt pour recevoir directement la synchronisation « CRM Sync on reply »,
            reconnaître le contact par identifiant exact et passer automatiquement le pipeline à Réponse.
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

        <article>
          <State ready={states.selfDeploy} label="Auto-déploiement o2switch" />
          <h2>GitHub → cockpit</h2>
          <p>
            Endpoint de self-update protégé par token et workflow GitHub prêts. Après le bootstrap
            unique sur o2switch, chaque validation réussie pourra déployer automatiquement.
          </p>
        </article>
      </section>
    </main>
  );
}
