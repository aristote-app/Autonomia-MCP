import Link from "next/link";
import NeedBriefQuestionnaire from "@/components/NeedBriefQuestionnaire";

export const metadata = {
  title: "Start | Décrire votre besoin IA | Autonomia",
  description:
    "Décrivez progressivement votre besoin : experts IA, formation IA, automatisation, RAG, agents IA ou besoin mixte.",
  alternates: { canonical: "/start" }
};

export default async function StartPage({ searchParams }) {
  const params = await searchParams;
  const initialEmail = typeof params?.email === "string" ? params.email : "";

  return (
    <main className="startPageV10">
      <section className="startHeroV10">
        <div>
          <p className="eyebrow">AUTONOMIA START</p>
          <h1>Décrivez votre besoin sans remplir un gros formulaire d’un coup.</h1>
          <p>
            Quelques étapes courtes pour comprendre où se situe le problème, ce qui vous ralentit
            et le résultat recherché. La demande arrive ensuite chez Autonomia déjà structurée.
          </p>
          {initialEmail && <span className="startEmailPill">{initialEmail}</span>}
          <Link href="/" className="startBackLink">← Retour à la Home</Link>
        </div>

        <aside className="startHeroCard">
          <small>LE PRINCIPE</small>
          <strong>Problème → contexte → résultat → contact.</strong>
          <ol>
            <li><span>01</span>Où se situe le besoin ?</li>
            <li><span>02</span>Qu’est-ce qui vous ralentit ?</li>
            <li><span>03</span>Quel résultat voulez-vous obtenir ?</li>
          </ol>
        </aside>
      </section>

      <NeedBriefQuestionnaire initialEmail={initialEmail} />
    </main>
  );
}
