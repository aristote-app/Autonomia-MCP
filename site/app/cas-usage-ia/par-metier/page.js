import UseCaseDiscoveryHub from "@/components/UseCaseDiscoveryHub";
import { professionJourneys } from "@/content/use-case-discovery";

export const metadata = {
  title: "Cas d’usage IA par métier et fonction",
  description:
    "Cas d’usage IA concrets pour direction, commercial, RH, finance, opérations, chefs de projet, IT, juridique, achats, support et chantier.",
  alternates: { canonical: "/cas-usage-ia/par-metier" }
};

export default function UseCasesByProfessionPage() {
  return (
    <UseCaseDiscoveryHub
      eyebrow="CAS D’USAGE IA · PAR MÉTIER"
      title="Ce que l’IA peut changer dans votre métier."
      intro="Explorez les workflows et cas d’usage selon la fonction qui porte le travail : direction, commercial, RH, finance, opérations, projet, IT, juridique, achats, support ou chantier."
      journeys={professionJourneys}
      currentPath="/cas-usage-ia/par-metier"
    />
  );
}
