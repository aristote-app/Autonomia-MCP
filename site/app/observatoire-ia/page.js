import Link from "next/link";
import MarketObservatory from "@/components/MarketObservatory";

export const metadata = {
  title: "Observatoire de la demande IA en entreprise",
  description:
    "Rôles, outils, compétences et cas d’usage IA observés dans un échantillon d’offres d’emploi collectées par Autonomia, avec méthodologie et limites explicites.",
  alternates: { canonical: "/observatoire-ia" }
};

export default function ObservatoryPage() {
  return (
    <main className="methodologyPage observatoryPage">
      <section className="contentHubHero">
        <p className="eyebrow">AUTONOMIA / OBSERVATOIRE</p>
        <h1>Ce que les entreprises demandent réellement autour de l’IA.</h1>
        <p>
          L’Observatoire Autonomia suit un échantillon d’offres d’emploi pour repérer les rôles,
          outils, compétences et cas d’usage qui apparaissent dans les besoins exprimés par les entreprises.
          Il ne transforme jamais ces signaux en faux volume de recherche.
        </p>
      </section>

      <section className="contentHubIntro">
        <p className="sectionIndex">DEUX QUESTIONS DIFFÉRENTES</p>
        <div>
          <h2>Recherche Google et demande emploi ne mesurent pas la même chose.</h2>
          <p>
            Search Console et les SERP répondent à « que cherchent les utilisateurs ? ».
            Les offres d’emploi répondent à « quelles capacités les entreprises essaient-elles de recruter ? ».
            Autonomia conserve ces signaux séparément, puis les croise pour choisir les sujets à rechercher,
            publier ou renforcer.
          </p>
        </div>
      </section>

      <MarketObservatory />

      <section className="pillarMethod">
        <p className="sectionIndex">MÉTHODOLOGIE</p>
        <div>
          <h2>Une observation, pas une statistique exhaustive du marché.</h2>
          <ol>
            <li><span>01</span><div><strong>Collecter</strong><p>Récupérer des offres depuis les sources autorisées du pipeline Autonomia et dédupliquer les annonces par identifiant source.</p></div></li>
            <li><span>02</span><div><strong>Extraire</strong><p>Détecter de façon déterministe les rôles, outils, compétences et familles de cas d’usage définis dans la taxonomie Autonomia.</p></div></li>
            <li><span>03</span><div><strong>Agréger</strong><p>Publier uniquement des comptes agrégés et quelques titres récents, jamais l’intégralité des descriptions privées ou collectées.</p></div></li>
            <li><span>04</span><div><strong>Séparer les signaux</strong><p>Ne jamais convertir une fréquence dans les offres d’emploi en volume SEO ou en mesure de la taille du marché.</p></div></li>
            <li><span>05</span><div><strong>Rechercher ensuite</strong><p>Un concept émergent devient seulement un candidat éditorial ; la demande Search doit être vérifiée séparément.</p></div></li>
          </ol>
        </div>
      </section>

      <section className="pillarBridge">
        <p className="sectionIndex">UTILISER LES SIGNAUX</p>
        <div>
          <h2>Transformer la demande observée en décisions de contenu et d’exécution.</h2>
          <p>
            Les signaux peuvent faire remonter un nouveau guide, déclencher la mise à jour d’un article,
            suggérer un parcours de formation ou indiquer une compétence à rechercher — mais jamais publier
            automatiquement une page faible.
          </p>
          <div className="closingActions">
            <Link className="primaryButton" href="/cas-usage-ia">Explorer les cas d’usage</Link>
            <Link className="secondaryButton" href="/formation-ia/cas-usage">Explorer les formations</Link>
            <Link className="secondaryButton" href="/methodologie/politique-editoriale">Voir la méthode éditoriale</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
