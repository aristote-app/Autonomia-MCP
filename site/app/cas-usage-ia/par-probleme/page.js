import UseCaseDiscoveryHub from "@/components/UseCaseDiscoveryHub";
import { problemJourneys } from "@/content/use-case-discovery";

export const metadata = {
  title: "Cas d’usage IA par problème métier",
  description:
    "Explorez les cas d’usage IA Autonomia à partir d’un problème concret : travail manuel, reporting, documents, relation client, projets ou recherche interne.",
  alternates: { canonical: "/cas-usage-ia/par-probleme" }
};

export default function UseCasesByProblemPage() {
  return (
    <UseCaseDiscoveryHub
      eyebrow="CAS D’USAGE IA · PAR PROBLÈME"
      title="Quel travail voulez-vous arrêter de faire à la main ?"
      intro="Partez d’une friction réelle : trop de classement, trop de relances, trop de reporting, trop de temps perdu à chercher une information ou à reprendre les mêmes dossiers."
      journeys={problemJourneys}
      currentPath="/cas-usage-ia/par-probleme"
    />
  );
}
