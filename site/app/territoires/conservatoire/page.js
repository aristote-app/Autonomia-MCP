import TerritoryLeadCard from "@/components/TerritoryLeadCard";
import TerritoryDemoLab from "@/components/TerritoryDemoLab";

export const metadata = {
  title: "Optimiser inscriptions et plannings de conservatoire | Autonomia",
  description:
    "Landing Autonomia pour conservatoires intercommunaux : contraintes familles, disponibilités enseignants, sites et liste d’attente dans une démonstration fictive.",
  alternates: { canonical: "/territoires/conservatoire" }
};

export default function ConservatoireCampaignPage() {
  return (
    <main className="territoryCampaignPage">
      <section className="territoryAdsHero">
        <div className="territoryAdsCopy">
          <p className="eyebrow">AUTONOMIA TERRITOIRES · CULTURE / CONSERVATOIRE</p>
          <h1>Lisser la rentrée au lieu de subir deux semaines d’appels et de réajustements.</h1>
          <p>
            Contraintes familles, disponibilités professeurs, sites d’enseignement et liste d’attente peuvent être
            préparés dans un même outil. L’équipe garde la main sur chaque affectation.
          </p>
          <div className="territoryGuarantees">
            <span>Données fictives en démonstration</span>
            <span>Répartition explicable</span>
            <span>Décision finale de l’équipe</span>
          </div>
          <div className="heroActions">
            <a className="primaryButton" href="#demos">Voir la démo conservatoire</a>
            <a className="secondaryButton" href="#diagnostic">Parler de votre rentrée</a>
          </div>
        </div>
        <aside className="territoryTopForm" id="diagnostic">
          <TerritoryLeadCard variant="conservatoire" title="Parler de vos inscriptions" />
        </aside>
      </section>

      <section className="territoryFlagship">
        <div className="territorySectionIntro">
          <p className="sectionIndex">01 — CE QUE L’OUTIL PEUT CHANGER</p>
          <div>
            <h2>Faire apparaître les contraintes avant qu’elles ne deviennent des appels.</h2>
          </div>
        </div>
        <div className="territoryFlagshipGrid">
          <article><span>01</span><h3>Collecter les contraintes</h3><p><b>Aujourd’hui</b>Disponibilités et préférences arrivent par appels et messages.</p><p><b>Avec l’outil</b>Les familles renseignent leurs contraintes dans un espace unique.</p></article>
          <article><span>02</span><h3>Proposer les créneaux</h3><p><b>Aujourd’hui</b>Le premier créneau libre est proposé au fil de l’eau.</p><p><b>Avec l’outil</b>Les créneaux sont classés selon les contraintes disponibles.</p></article>
          <article><span>03</span><h3>Gérer les exceptions</h3><p><b>Aujourd’hui</b>Chaque changement entraîne de nouveaux appels.</p><p><b>Avec l’outil</b>Les cas impossibles restent visibles pour arbitrage humain.</p></article>
        </div>
      </section>

      <TerritoryDemoLab initialTab="conservatoire" />

      <section className="territoryAdsFooter">
        <div>
          <p className="eyebrow">VOTRE CONSERVATOIRE A D’AUTRES CONTRAINTES ?</p>
          <h2>Décrivez-les. Nous les intégrerons au cadrage de la démo.</h2>
          <p>Fratries, sites, disciplines, temps enseignants, priorités locales : le moteur doit refléter vos règles, pas les remplacer.</p>
        </div>
        <TerritoryLeadCard variant="conservatoire-footer" title="Demander un diagnostic inscriptions" />
      </section>
    </main>
  );
}
