import AutonomiaScan from "@/components/AutonomiaScan";
import HomeLeadSwitch from "@/components/HomeLeadSwitch";

export const metadata = {
  title: "Autonomia Scan — votre plan d’exécution IA",
  description:
    "Trois questions pour identifier le prochain levier d’exécution IA de votre entreprise : expertise externe, montée en compétences ou combinaison des deux.",
  alternates: {
    canonical: "/scan-ia"
  },
  openGraph: {
    title: "Autonomia Scan — votre plan d’exécution IA",
    description:
      "Transformez un objectif IA en prochaine action structurée en trois questions.",
    url: "/scan-ia"
  }
};

export default function ScanPage() {
  return (
    <main className="scanStandalone">
      <section className="scanStandaloneHero">
        <p className="eyebrow">AUTONOMIA SCAN</p>
        <h1>
          Votre entreprise a-t-elle besoin
          <span>d’un expert, d’une Academy — ou des deux ?</span>
        </h1>
        <p>
          Partez du problème réel. En trois réponses, Autonomia construit un premier
          plan d’exécution orienté vers la capacité à ajouter ou à développer.
        </p>
      </section>

      <section className="scanStandaloneTool">
        <AutonomiaScan />
      </section>

      <section className="scanStandaloneWhy">
        <p className="sectionIndex">POURQUOI CE SCAN</p>
        <div>
          <h2>Le bon point de départ n’est pas un intitulé de poste.</h2>
          <p>
            Un même objectif peut nécessiter une expertise ponctuelle, une équipe de delivery,
            une montée en compétences interne ou un dispositif hybride. Le Scan sert à orienter
            la prochaine conversation avant de pousser une solution.
          </p>
        </div>
      </section>

      <section className="contactSection" id="contact">
        <div className="contactCopy">
          <p className="eyebrow">VOTRE EXECUTION PLAN</p>
          <h2>Transformons l’orientation en plan concret.</h2>
          <p>
            Si vous venez du Scan, vos réponses sont déjà reprises automatiquement ci-dessous.
          </p>
        </div>
        <HomeLeadSwitch />
      </section>
    </main>
  );
}
