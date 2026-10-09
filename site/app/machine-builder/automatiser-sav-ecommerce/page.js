import MachineBuilder from "@/components/MachineBuilder";

export const metadata = {
  title: "Automatiser le SAV e-commerce avec l’IA — AUTONOMIA Machine Builder",
  description:
    "Configurez une machine IA pour traiter les demandes SAV par e-mail, retrouver les commandes, préparer les réponses et garder les validations humaines utiles.",
  alternates: { canonical: "/machine-builder/automatiser-sav-ecommerce" }
};

export default function SavEcommerceMachineBuilderPage() {
  return (
    <main>
      <MachineBuilder />
    </main>
  );
}
