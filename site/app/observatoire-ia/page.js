import ObservatoryExplorer from "@/components/ObservatoryExplorer";
import { observatoryGroups, observatoryTopics } from "@/content/observatory-solutions";

export const metadata = {
  title: "Explorer les besoins IA par métier, secteur et tâche | Autonomia",
  description:
    "Choisissez un métier, un secteur ou une tâche transverse et découvrez des mini-modules IA concrets à tester directement.",
  alternates: { canonical: "/observatoire-ia" }
};

export default function ObservatoryPage() {
  return (
    <main className="obsHub obsHubV2">
      <section className="obsHubHeroV2">
        <div>
          <p className="eyebrow">AUTONOMIA · EXPLORATEUR DES BESOINS IA</p>
          <h1>Où l’IA peut-elle réellement vous faire gagner du temps ?</h1>
          <p>
            Partez de votre métier, de votre secteur ou d’une tâche transverse.
            Choisissez une situation qui vous ressemble, puis testez directement les mini-modules associés.
          </p>
        </div>

        <aside className="obsHeroIndex">
          <span>3 PORTES D’ENTRÉE</span>
          <strong>01 · Métiers</strong>
          <strong>02 · Secteurs d’activité</strong>
          <strong>03 · Tâches transverses</strong>
          <small>Aucune connaissance technique nécessaire.</small>
        </aside>
      </section>

      <ObservatoryExplorer groups={observatoryGroups} topics={observatoryTopics} />
    </main>
  );
}
