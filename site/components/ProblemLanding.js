import ProblemLink from "@/components/ProblemLink";
import ProblemLeadForm from "@/components/ProblemLeadForm";
import ProblemLab from "@/components/ProblemLab";
import { getProblemFaq } from "@/content/problem-solutions";

export default function ProblemLanding({ problem }) {
  const faq=getProblemFaq(problem);
  return (
    <main className="problemLanding">
      <section className="problemHero">
        <div className="problemHeroCopy">
          <p className="eyebrow">{problem.cluster.toUpperCase()} · SOLUTION IA</p>
          <h1>{problem.headline}</h1>
          <p>{problem.intro}</p>
          <div className="problemHeroProof"><span>Prototype manipulable</span><span>Intégration à vos outils</span><span>Validation humaine configurable</span></div>
          <a className="primaryButton" href="#demo">Tester la démo</a>
        </div>
        <aside className="problemLeadAside" id="diagnostic"><ProblemLeadForm problem={problem}/></aside>
      </section>

      <ProblemLab problem={problem}/>

      <section className="problemBuild">
        <div className="problemSectionIntro">
          <p className="sectionIndex">02 — CE QUI DEVIENT UN VRAI PROJET</p>
          <h2>La démo montre l’expérience. Le projet relie vos données, vos règles et vos outils.</h2>
        </div>
        <div className="problemDeliverables">{problem.deliverables.map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></article>)}</div>
        <div className="problemGuardrails">
          <div><p className="eyebrow">MÉTHODE</p><h3>Automatiser ce qui est mécanique. Exposer ce qui est incertain.</h3></div>
          <p>Autonomia peut construire un workflow, un assistant métier, une mini-application ou un agent selon le processus. Les règles d’autorisation, les sources, les exceptions et les points de validation sont définis pendant le cadrage.</p>
        </div>
      </section>

      <section className="problemFaq">
        <p className="sectionIndex">03 — QUESTIONS DE CADRAGE</p>
        <div>{faq.map((item)=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="problemFinalCta">
        <p className="eyebrow">PARTIR DU FLUX RÉEL</p>
        <h2>Montrez-nous où le temps se perd. Nous vous montrons ce qui peut devenir un outil.</h2>
        <a className="primaryButton" href="#diagnostic">{problem.cta}</a>
        <ProblemLink href="/solutions-ia" surface="problem_lp_footer">Voir les autres problèmes traités</ProblemLink>
      </section>
    </main>
  );
}
