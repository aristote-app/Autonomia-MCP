import TerritoryLeadCard from "@/components/TerritoryLeadCard";
import TerritoryDemoLab from "@/components/TerritoryDemoLab";

export const metadata = {
  title: "IA pour communautés de communes et agglomérations | Autonomia Territoires",
  description:
    "Testez des mini-applicatifs IA pour intercommunalités : ADS, conservatoire, courrier, déchets et autres processus agents. Diagnostic flash offert.",
  alternates: { canonical: "/territoires" }
};

const otherUses = [
  ["Courrier & accueil", "Classer, accuser réception et router."],
  ["Déchets", "Qualifier les demandes et préparer l’action."],
  ["Petite enfance", "Préparer les dossiers avant commission."],
  ["Finances & RH", "Contrôler, rapprocher et synthétiser."],
  ["Subventions", "Veiller, préparer et suivre les échéances."],
  ["Tourisme", "Contrôler déclarations et relances."]
];

const entryOffers = [
  {
    eyebrow: "OFFERT",
    title: "Diagnostic flash",
    text: "Une demi-journée de cadrage pour isoler les tâches qui consomment le plus de temps et choisir la première démo utile.",
    price: "0 €"
  },
  {
    eyebrow: "ADOPTION",
    title: "Charte IA + formation",
    text: "Une porte d’entrée simple pour poser les règles, former les agents et faire émerger les premiers usages maîtrisés.",
    price: "À partir de 4 500 € HT"
  },
  {
    eyebrow: "EXÉCUTION",
    title: "Premier applicatif métier",
    text: "Cadrage, prototype, tests agents, documentation et mise en service progressive sur un besoin précis.",
    price: "15 000 à 25 000 € HT"
  }
];

export default function TerritoriesPage() {
  return (
    <main className="territoryAdsPage territoryAdsPageV2">
      <section className="territoryAdsHero">
        <div className="territoryAdsCopy">
          <p className="eyebrow">AUTONOMIA TERRITOIRES · INTERCOMMUNALITÉS</p>
          <h1>Montrez-nous la tâche qui use vos agents. Nous vous montrons ce qu’on peut en faire.</h1>
          <p>
            Pré-instruction ADS, inscriptions, courrier, dossiers, plannings, contrôles :
            testez des mini-applicatifs sur données fictives avant de parler déploiement.
          </p>

          <div className="territoryGuarantees">
            <span>L’outil prépare, l’agent décide</span>
            <span>Données fictives dans les démos</span>
            <span>Intervention partout en France</span>
          </div>

          <div className="heroActions">
            <a className="primaryButton" href="#demos">Tester les démos</a>
            <a className="secondaryButton" href="#demarrer">Voir comment démarrer</a>
          </div>
        </div>

        <aside className="territoryTopForm" id="territory-lead">
          <TerritoryLeadCard title="Recevoir un diagnostic flash" />
        </aside>
      </section>

      <TerritoryDemoLab />

      <section className="territoryUseStrip">
        <div>
          <p className="sectionIndex">AUTRES PROCESSUS À TESTER</p>
          <h2>Le même principe s’adapte aux autres services.</h2>
        </div>
        <div className="territoryUseChips">
          {otherUses.map(([title, text]) => (
            <article key={title}>
              <strong>{title}</strong>
              <span>{text}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="territoryStart" id="demarrer">
        <div className="territorySectionIntro">
          <p className="sectionIndex">02 — COMMENT COMMENCER</p>
          <div>
            <h2>Commencer petit. Montrer. Mesurer. Puis décider si l’on élargit.</h2>
            <p>
              Trois portes d’entrée selon votre maturité. Les montants sont des repères indicatifs,
              à confirmer après cadrage du besoin.
            </p>
          </div>
        </div>

        <div className="territoryStartGrid">
          {entryOffers.map((offer) => (
            <article key={offer.title}>
              <span>{offer.eyebrow}</span>
              <h3>{offer.title}</h3>
              <p>{offer.text}</p>
              <strong>{offer.price}</strong>
            </article>
          ))}
        </div>

        <p className="territoryLegalNote">
          Pour les achats publics, le mode de passation dépend de la valeur totale du besoin et des règles applicables
          à l’acheteur. Le cadrage commercial ne remplace pas l’analyse de la procédure de commande publique.
        </p>
      </section>

      <section className="territoryFinalConversion">
        <div>
          <p className="eyebrow">UNE TÂCHE VOUS VIENT DÉJÀ EN TÊTE ?</p>
          <h2>Ne rédigez pas de cahier des charges.</h2>
          <p>Décrivez simplement ce qui prend du temps aujourd’hui. Nous partirons de là.</p>
        </div>
        <a className="primaryButton" href="#territory-lead">Recevoir mon diagnostic flash</a>
      </section>
    </main>
  );
}
