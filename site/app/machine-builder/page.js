import MachineBuilder from "@/components/MachineBuilder";

export const metadata = {
  title: "AUTONOMIA Machine Builder — Construisez une machine IA concrète",
  description:
    "Configurez votre environnement, générez votre architecture, votre brief Claude ou ChatGPT et votre kit de mise en place.",
  alternates: { canonical: "/machine-builder" }
};

export default function MachineBuilderPage() {
  return (
    <main>
      <MachineBuilder />
    </main>
  );
}
