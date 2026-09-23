import Link from "next/link";
import { problemClusters, problemSolutions } from "@/content/problem-solutions";

export const metadata = {
  title: "Solutions IA par problème métier",
  description: "Explorez des solutions IA très précises : comptes rendus, RAG documentaire, leads, e-mails, dossiers, reporting, factures, appels d’offres et autres processus.",
  alternates: { canonical: "/solutions-ia" }
};

export default function SolutionsIaPage() {
  return (
    <main className="problemHub">
      <section className="problemHubHero">
        <p className="eyebrow">AUTONOMIA · SOLUTIONS IA</p>
        <h1>Quel travail voulez-vous arrêter de faire à la main ?</h1>
        <p>Une intention, une page, une démonstration. Choisissez le problème concret plutôt qu’une catégorie d’IA.</p>
      </section>
      <section className="problemHubGroups">
        {problemClusters.map((cluster)=>{
          const items=problemSolutions.filter((item)=>item.cluster===cluster);
          if (!items.length) return null;
          return <div className="problemHubGroup" key={cluster}><div><span>{cluster}</span><strong>{items.length} problème{items.length>1?"s":""}</strong></div><div>{items.map((item)=><Link href={"/solutions-ia/"+item.slug} key={item.slug}><small>VAGUE {item.wave}</small><strong>{item.title}</strong><span>{item.intro}</span><b>Tester →</b></Link>)}</div></div>;
        })}
      </section>
    </main>
  );
}
