import ProblemLink from "@/components/ProblemLink";
import ProblemLeadForm from "@/components/ProblemLeadForm";
import ProblemLab from "@/components/ProblemLab";
import { getProblemFaq } from "@/content/problem-solutions";
import { getProblemSalesCopy } from "@/content/problem-sales-copy";

export default function ProblemLanding({ problem }) {
  const faq=getProblemFaq(problem);
  const sales=getProblemSalesCopy(problem.slug);
  return (
    <main className="problemLanding">
      <section className="problemHero">
        <div className="problemHeroCopy">
          <p className="eyebrow">{problem.cluster.toUpperCase()} · SOLUTION IA</p>
          <h1>{problem.headline}</h1>
          <p>{problem.intro}</p>
          <div className="problemHeroProof"><span>Prototype manipulable</span><span>Intégration à vos outils</span><span>Validation humaine configurable</span></div>
          <ProblemLink className="primaryButton" href="#demo" problemSlug={problem.slug} problemCluster={problem.cluster} surface="problem_lp_hero" eventName="problem_demo_cta_click">Tester la démo</ProblemLink>
        </div>
        <aside className="problemLeadAside" id="diagnostic"><ProblemLeadForm problem={problem}/></aside>
      </section>

      <ProblemLab problem={problem}/>

      {sales && (
        <section className="problemFlowFit">
          <div className="problemSectionIntro">
            <p className="sectionIndex">02 — BRANCHEZ LE VRAI FLUX</p>
            <h2>Ce qui entre. Ce qui sort. Ce qui reste sous contrôle.</h2>
            <p>{sales.trigger}</p>
          </div>

          <div className="problemFlowFitGrid">
            <article>
              <span>ENTRÉES</span>
              <strong>Ce que l’outil reçoit</strong>
              <ul>{sales.inputs.map((item)=><li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span>SORTIES</span>
              <strong>Ce que l’équipe récupère</strong>
              <ul>{sales.outputs.map((item)=><li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span>OUTILS</span>
              <strong>À intégrer selon votre SI</strong>
              <ul>{sales.systems.map((item)=><li key={item}>{item}</li>)}</ul>
            </article>
          </div>

          <div className="problemHumanGate">
            <span>POINT DE CONTRÔLE HUMAIN</span>
            <strong>{sales.human}</strong>
            <ProblemLink href="#diagnostic" problemSlug={problem.slug} problemCluster={problem.cluster} surface="problem_lp_flow" eventName="problem_cta_click">Voir le prototype sur mon flux →</ProblemLink>
          </div>
        </section>
      )}

      <section className="problemBuild">
        <div className="problemSectionIntro">
          <p className="sectionIndex">03 — CE QUI DEVIENT UN VRAI PROJET</p>
          <h2>La démo montre l’expérience. Le projet relie vos données, vos règles et vos outils.</h2>
        </div>
        <div className="problemDeliverables">{problem.deliverables.map((item,index)=><article key={item}><span>{String(index+1).padStart(2,"0")}</span><strong>{item}</strong></article>)}</div>
        <div className="problemGuardrails">
          <div><p className="eyebrow">MÉTHODE</p><h3>Automatiser ce qui est mécanique. Exposer ce qui est incertain.</h3></div>
          <p>Autonomia peut construire un workflow, un assistant métier, une mini-application ou un agent selon le processus. Les règles d’autorisation, les sources, les exceptions et les points de validation sont définis pendant le cadrage.</p>
        </div>
      </section>

      <section className="problemFaq">
        <p className="sectionIndex">04 — QUESTIONS DE CADRAGE</p>
        <div>{faq.map((item)=><details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
      </section>

      <section className="problemFinalCta">
        <p className="eyebrow">PARTIR DU FLUX RÉEL</p>
        <h2>Montrez-nous où le temps se perd. Nous vous montrons ce qui peut devenir un outil.</h2>
        <ProblemLink className="primaryButton" href="#diagnostic" problemSlug={problem.slug} problemCluster={problem.cluster} surface="problem_lp_footer_cta" eventName="problem_cta_click">{problem.cta}</ProblemLink>
        <ProblemLink href="/solutions-ia" surface="problem_lp_footer">Voir les autres problèmes traités</ProblemLink>
      </section>
    </main>
  );
}
