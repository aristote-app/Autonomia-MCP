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
    <main className="startPageV11">
      <section className="startHeroV11">
        <div className="startHeroV11Copy">
          <p className="eyebrow">AUTONOMIA START</p>
          <h1>Parlez-nous du problème.<br /><span>On structure la suite.</span></h1>
          <p>
            Experts IA, automatisation, RAG, agents IA ou Formation IA :
            commencez simplement par ce qui vous ralentit aujourd’hui.
          </p>

          <div className="startHeroV11Signals" aria-label="Parcours Autonomia">
            <span>Besoin réel</span>
            <span>Réponse structurée</span>
            <span>Experts + Academy</span>
          </div>

          {initialEmail && (
            <div className="startHeroV11Email">
              <small>E-mail déjà repris</small>
              <strong>{initialEmail}</strong>
            </div>
          )}

          <Link href="/" className="startBackLink">← Retour à la Home</Link>
        </div>

        <div className="startHeroFormV11">
          <div className="startHeroFormHead">
            <div>
              <small>COMMENÇONS</small>
              <strong>Un écran = une question.</strong>
            </div>
            <span>6 ÉTAPES</span>
          </div>
          <NeedBriefQuestionnaire initialEmail={initialEmail} />
        </div>
      </section>

      <section className="startReassuranceV11">
        <span><b>01</b> Vous décrivez le problème.</span>
        <span><b>02</b> Nous structurons le besoin.</span>
        <span><b>03</b> Nous orientons vers l’expertise, la formation ou les deux.</span>
      </section>
    </main>
  );
}
