import Link from "next/link";
import TerritoryLeadCard from "@/components/TerritoryLeadCard";
import TerritoryDemoLab from "@/components/TerritoryDemoLab";

export const metadata = {
  title: "IA pour communautés de communes et agglomérations | Autonomia Territoires",
  description:
    "Autonomia aide les intercommunalités à réduire les tâches répétitives des agents, tester des applicatifs métiers et accompagner les entreprises du territoire.",
  alternates: { canonical: "/territoires" }
};

const flagship = [
  {
    index: "01",
    title: "PV de conseil communautaire",
    today: "Transcription, notes, décisions et projet de PV repris manuellement après chaque séance.",
    transform: "Transcription structurée, décisions, actions et projet de PV préparés pour relecture.",
    result: "L’agent relit et valide ; le travail après séance est fortement réduit."
  },
  {
    index: "02",
    title: "Pré-instruction ADS",
    today: "Pièces, délais, règles PLUi et servitudes contrôlés dossier par dossier.",
    transform: "File classée par urgence, pré-contrôle des pièces et points de vigilance signalés.",
    result: "L’instructeur garde la décision et la signature, avec une préparation plus rapide."
  },
  {
    index: "03",
    title: "Inscriptions & plannings",
    today: "Appels, contraintes familles, disponibilités professeurs et sites ajustés au fil de l’eau.",
    transform: "Répartition sous contraintes, créneaux recommandés et réservation famille.",
    result: "Moins de pics de charge et un planning plus explicable."
  }
];

const otherUses = [
  ["Courrier & accueil", "Lire, classer, accuser réception et router vers le bon service."],
  ["Déchets", "Qualifier réclamations, badges, incidents et préparer la bonne action."],
  ["Petite enfance", "Préparer les dossiers et contrôles avant commission, sans automatiser la décision."],
  ["Finances & RH", "Pré-rapprochements, contrôles documentaires, plannings et synthèses."],
  ["Subventions", "Veille ciblée, préparation de dossiers et suivi des échéances."],
  ["Tourisme", "Taxe de séjour, relances, contrôles et rapprochements de déclarations."]
];

const offers = [
  ["OFFERT", "Diagnostic flash", "Une demi-journée de cadrage + un atelier court pour identifier les irritants prioritaires.", "0 €"],
  ["01", "Diagnostic approfondi", "Entretiens services, cartographie des tâches chronophages, 3 cas d’usage chiffrés et feuille de route.", "5 000 à 7 000 € HT"],
  ["02", "Premier cas d’usage", "Cadrage, paramétrage, tests avec les agents, formation, documentation et accompagnement au démarrage.", "15 000 à 25 000 € HT"],
  ["03", "Programme 2 à 3 usages", "Plusieurs cas d’usage, formation des référents et dispositif de fonctionnement/documentation.", "40 000 à 55 000 € HT"]
];

const references = [];

export default function TerritoriesPage() {
  return (
    <main className="territoryAdsPage">
      <section className="territoryAdsHero">
        <div className="territoryAdsCopy">
          <p className="eyebrow">AUTONOMIA TERRITOIRES · INTERCOMMUNALITÉS</p>
          <h1>Moins de tâches répétitives. Plus de temps pour le service public.</h1>
          <p>
            Nous partons des irritants réels des agents pour construire des outils simples, explicables et contrôlables :
            l’outil prépare, l’agent décide.
          </p>

          <div className="territoryGuarantees">
            <span>Communautés de communes & agglomérations</span>
            <span>Intervention partout en France</span>
            <span>Données de démonstration fictives</span>
          </div>

          <div className="heroActions">
            <a className="primaryButton" href="#demos">Voir les démos</a>
            <a className="secondaryButton" href="#offre">Voir l’offre</a>
          </div>
        </div>

        <aside className="territoryTopForm">
          <TerritoryLeadCard />
        </aside>
      </section>

      <section className="territoryFlagship">
        <div className="territorySectionIntro">
          <p className="sectionIndex">01 — TROIS PROBLÈMES QUI SE VOIENT TOUT DE SUITE</p>
          <div>
            <h2>Montrer ce que l’IA change avant de parler technologie.</h2>
            <p>
              Nous privilégions des cas d’usage qui parlent immédiatement aux services et dont le résultat peut être montré
              sur des données fictives avant tout déploiement.
            </p>
          </div>
        </div>

        <div className="territoryFlagshipGrid">
          {flagship.map((item) => (
            <article key={item.index}>
              <span>{item.index}</span>
              <h3>{item.title}</h3>
              <p><b>Aujourd’hui</b>{item.today}</p>
              <p><b>Avec l’outil</b>{item.transform}</p>
              <small>{item.result}</small>
            </article>
          ))}
        </div>
      </section>

      <TerritoryDemoLab />

      <section className="territoryOtherUses">
        <div className="territorySectionIntro">
          <p className="sectionIndex">03 — AUTRES SERVICES</p>
          <div>
            <h2>La même logique s’applique à beaucoup de métiers intercommunaux.</h2>
            <p>On ne remplace pas le logiciel métier. On retire les ressaisies, recherches, contrôles et relances qui l’entourent.</p>
          </div>
        </div>

        <div className="territoryOtherGrid">
          {otherUses.map(([title, text], index) => (
            <article key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="territoryOfferLadder" id="offre">
        <div className="territorySectionIntro">
          <p className="sectionIndex">04 — UNE OFFRE PROGRESSIVE</p>
          <div>
            <h2>Commencer par une preuve, puis élargir seulement si elle est utile.</h2>
            <p>
              Les montants ci-dessous sont des repères indicatifs à confirmer après cadrage. L’objectif est de conserver
              des périmètres lisibles et compatibles avec les contraintes de la commande publique.
            </p>
          </div>
        </div>

        <div className="territoryOfferGrid">
          {offers.map(([index, title, text, price]) => (
            <article key={title}>
              <span>{index}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <strong>{price}</strong>
            </article>
          ))}
        </div>

        <p className="territoryLegalNote">
          Depuis le 1er avril 2026, le seuil de dispense de publicité et de mise en concurrence préalables est de
          60 000 € HT pour certains marchés publics de fournitures ou services. La valeur totale du besoin et les autres
          règles de la commande publique restent à apprécier par l’acheteur.
        </p>
      </section>

      <section className="territoryAcademyBlock">
        <div>
          <p className="sectionIndex">05 — PORTE D’ENTRÉE FORMATION</p>
          <h2>Charte IA + formation : une première étape simple avant les applicatifs.</h2>
          <p>
            Pour les collectivités qui veulent commencer par les usages et les règles, nous pouvons construire une charte
            adaptée, former les agents sur des cas métiers et préparer un kit de prompts ou méthodes validées.
          </p>
        </div>
        <div className="territoryAcademyPrice">
          <span>À PARTIR DE</span>
          <strong>4 500 € HT</strong>
          <p>Charte + une journée de formation sur site. Configuration exacte sur devis.</p>
        </div>
      </section>

      <section className="territoryReferences">
        <div className="territorySectionIntro">
          <p className="sectionIndex">06 — RÉFÉRENCES DE L’ÉQUIPE</p>
          <div>
            <h2>Un espace prévu pour les références administratives.</h2>
            <p>
              Les références de Sylvain et de l’équipe seront publiées ici uniquement après validation de la formulation
              et autorisation d’usage des logos. Aucun logo ou résultat ne sera inventé.
            </p>
          </div>
        </div>

        {references.length === 0 ? (
          <div className="territoryReferencePlaceholder">
            <span>RÉFÉRENCES EN COURS DE VALIDATION</span>
            <p>Logos, mission menée et résultat concret seront ajoutés à réception des éléments autorisés.</p>
          </div>
        ) : null}
      </section>

      <section className="territoryAdsFooter">
        <div>
          <p className="eyebrow">VOTRE SERVICE A UN AUTRE IRRITANT ?</p>
          <h2>Décrivez-le avec vos mots. Nous chercherons la première démo utile.</h2>
          <p>Pas besoin de parler d’IA, de modèle ou d’architecture. Parlez-nous du travail qui use l’équipe.</p>
        </div>
        <TerritoryLeadCard variant="footer" title="Recevoir un diagnostic et une première piste de démo" />
      </section>

      <section className="territoryResourceLinks">
        <Link href="/territoires/ia-agents-collectivite">IA pour les agents →</Link>
        <Link href="/territoires/academy-ia-collectivites">Academy collectivités →</Link>
        <Link href="/territoires/accelerateur-ia-tpe-pme">Accélérateur TPE/PME →</Link>
        <Link href="/observatoire-ia/collectivites-intercommunalites">6 transformations Territoires →</Link>
      </section>
    </main>
  );
}
