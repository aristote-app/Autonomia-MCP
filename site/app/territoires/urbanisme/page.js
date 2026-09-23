import TerritoryLeadCard from "@/components/TerritoryLeadCard";
import TerritoryDemoLab from "@/components/TerritoryDemoLab";

export const metadata = {
  title: "Pré-instruction ADS et IA pour services urbanisme | Autonomia",
  description:
    "Landing Autonomia pour services ADS : pré-contrôle des pièces, classement par urgence, synthèse instructeur et préparation des demandes de pièces.",
  alternates: { canonical: "/territoires/urbanisme" }
};

export default function UrbanismeCampaignPage() {
  return (
    <main className="territoryCampaignPage">
      <section className="territoryAdsHero">
        <div className="territoryAdsCopy">
          <p className="eyebrow">AUTONOMIA TERRITOIRES · URBANISME / ADS</p>
          <h1>Pré-contrôler les dossiers avant que le délai ne devienne le problème.</h1>
          <p>
            Classement par urgence, pièces manquantes, points de vigilance et projet de courrier préparés.
            L’outil ne prend pas la décision : il aide l’instructeur à voir plus vite ce qui mérite son attention.
          </p>
          <div className="territoryGuarantees">
            <span>Dossiers fictifs en démonstration</span>
            <span>Validation instructeur obligatoire</span>
            <span>Déploiement national</span>
          </div>
          <div className="heroActions">
            <a className="primaryButton" href="#demos">Voir la démo ADS</a>
            <a className="secondaryButton" href="#diagnostic">Parler de votre service</a>
          </div>
        </div>
        <aside className="territoryTopForm" id="diagnostic">
          <TerritoryLeadCard variant="urbanisme-ads" title="Parler de votre file ADS" />
        </aside>
      </section>

      <section className="territoryFlagship">
        <div className="territorySectionIntro">
          <p className="sectionIndex">01 — CE QUE L’OUTIL PRÉPARE</p>
          <div>
            <h2>Trois étapes où l’instructeur peut récupérer du temps.</h2>
          </div>
        </div>
        <div className="territoryFlagshipGrid">
          <article><span>01</span><h3>Prioriser</h3><p><b>Aujourd’hui</b>Repérer les dossiers urgents et les délais dossier par dossier.</p><p><b>Avec l’outil</b>Classer la file par échéance et risque.</p></article>
          <article><span>02</span><h3>Pré-contrôler</h3><p><b>Aujourd’hui</b>Vérifier pièces, servitudes et règles une par une.</p><p><b>Avec l’outil</b>Signaler les éléments à confirmer avant instruction détaillée.</p></article>
          <article><span>03</span><h3>Préparer le courrier</h3><p><b>Aujourd’hui</b>Rédiger les demandes de pièces depuis zéro.</p><p><b>Avec l’outil</b>Préparer un brouillon modifiable avant validation et signature.</p></article>
        </div>
      </section>

      <TerritoryDemoLab initialTab="ads" />

      <section className="territoryAdsFooter">
        <div>
          <p className="eyebrow">VOTRE PROCESSUS ADS EST DIFFÉRENT ?</p>
          <h2>Montrez-nous le flux actuel. Nous cadrerons la première démo utile.</h2>
          <p>Logiciels métiers, pièces, délais et validations sont intégrés au cadrage avant toute promesse d’automatisation.</p>
        </div>
        <TerritoryLeadCard variant="urbanisme-ads-footer" title="Demander un diagnostic ADS" />
      </section>
    </main>
  );
}
