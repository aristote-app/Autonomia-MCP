import ObservatoryExplorer from "@/components/ObservatoryExplorer";
import { observatoryGroups, observatoryTopics } from "@/content/observatory-solutions";

export const metadata = {
  title: "Explorer les besoins IA par métier, secteur et tâche | Autonomia",
  description:
    "Explorez des transformations IA concrètes par métier, secteur d’activité ou tâche transverse : 6 modules par besoin, cas d’usage, avant/après et pages dédiées pour vos campagnes.",
  alternates: { canonical: "/observatoire-ia" }
};

export default function ObservatoryPage() {
  return (
    <main className="obsHub">
      <section className="obsHubHero">
        <p className="eyebrow">AUTONOMIA · EXPLORATEUR DES BESOINS IA</p>
        <h1>Partez du travail réel. Pas de la technologie.</h1>
        <p>
          Choisissez un métier, un secteur ou une tâche qui vous fait perdre du temps.
          Nous vous montrons six transformations possibles, ce qui peut être automatisé
          et ce qui doit rester sous contrôle humain.
        </p>
      </section>

      <section className="obsHubIntro">
        <span>01</span>
        <div>
          <strong>Métiers</strong>
          <p>RH, direction, commercial, marketing, finance, support…</p>
        </div>
        <div>
          <strong>Secteurs</strong>
          <p>Collectivités, industrie, retail, immobilier…</p>
        </div>
        <div>
          <strong>Tâches transverses</strong>
          <p>Administratif, contenus, e-mails, reporting…</p>
        </div>
      </section>

      <ObservatoryExplorer groups={observatoryGroups} topics={observatoryTopics} />

      <section className="obsHubFooter">
        <p className="sectionIndex">POURQUOI CET EXPLORATEUR ?</p>
        <div>
          <h2>Identifier un premier cas d’usage suffisamment concret pour être testé.</h2>
          <p>
            L’objectif n’est pas de dresser une liste infinie d’idées IA. Il est de repérer
            une tâche, un flux ou une décision que l’on peut cadrer, démontrer et mesurer.
          </p>
        </div>
      </section>
    </main>
  );
}
