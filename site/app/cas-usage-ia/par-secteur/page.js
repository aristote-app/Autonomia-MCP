import UseCaseDiscoveryHub from "@/components/UseCaseDiscoveryHub";
import { sectorJourneys } from "@/content/use-case-discovery";

export const metadata = {
  title: "Cas d’usage IA par secteur d’activité",
  description:
    "Explorez les cas d’usage IA Autonomia pour le BTP, l’immobilier, le retail, la logistique, les services, la finance, le SaaS, la formation et les collectivités.",
  alternates: { canonical: "/cas-usage-ia/par-secteur" }
};

export default function UseCasesBySectorPage() {
  return (
    <UseCaseDiscoveryHub
      eyebrow="CAS D’USAGE IA · PAR SECTEUR"
      title="Les mêmes technologies. Des réalités de travail différentes."
      intro="Un bon cas d’usage ne se transpose pas mot pour mot d’un secteur à l’autre. Retrouvez les scénarios Autonomia selon les documents, contraintes, équipes et flux propres à votre activité."
      journeys={sectorJourneys}
      currentPath="/cas-usage-ia/par-secteur"
    />
  );
}
