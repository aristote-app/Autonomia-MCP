import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export default function IntentPage({ page }) {
  const isExpert = page.mode === "experts";
  const isAcademy = page.mode === "academy";

  return (
    <main className={`intentPage theme-${page.theme || "dark"}`}>
      <section className="intentHero">
        <div className="intentHeroCopy">
          <p className="eyebrow">{page.universe}</p>
          <h1>{page.title}</h1>
          <p className="heroText">{page.subtitle}</p>

          <div className="heroSignals" aria-label="Méthode Autonomia">
            {(page.outcomes || []).map((item, index) => (
              <div key={item}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="heroFormCard">
          <p className="formKicker">{isExpert ? "Votre besoin" : isAcademy ? "Votre plan de formation" : "Votre diagnostic"}</p>
          <LeadForm
            mode={page.mode}
            formId={`lp-${page.slug}`}
            requestedService={page.slug}
          />
        </div>
      </section>

      <section className="intentContext">
        <p className="sectionIndex">01 — LE PROBLÈME</p>
        <div>
          <h2>{page.contextTitle}</h2>
          <p>{page.contextText}</p>
        </div>
      </section>

      <section className="capabilityBand">
        <p className="sectionIndex">02 — COMPÉTENCES</p>
        <div className="capabilityList">
          {(page.capabilities || []).map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section className="methodSplit">
        <div>
          <p className="sectionIndex">03 — NOTRE LOGIQUE</p>
          <h2>{page.proofTitle}</h2>
          <p>{page.proofText}</p>
        </div>

        <ol className="methodSteps">
          {isExpert ? (
            <>
              <li><span>01</span><div><strong>Comprendre</strong><p>Objectif, contexte, contraintes, environnement et niveau d’autonomie attendu.</p></div></li>
              <li><span>02</span><div><strong>Traduire</strong><p>Transformer le besoin en compétences, rôle, séniorité et critères de sélection.</p></div></li>
              <li><span>03</span><div><strong>Staffer</strong><p>Présenter les profils qui répondent au besoin défini, pas une liste générique.</p></div></li>
            </>
          ) : isAcademy ? (
            <>
              <li><span>01</span><div><strong>Segmenter</strong><p>Publics, niveaux, fonctions et usages réellement concernés.</p></div></li>
              <li><span>02</span><div><strong>Construire</strong><p>Objectifs, séquences, cas métier et modalités adaptés à l’organisation.</p></div></li>
              <li><span>03</span><div><strong>Transférer</strong><p>Faire acquérir des pratiques réutilisables, avec un cadre d’usage clair.</p></div></li>
            </>
          ) : (
            <>
              <li><span>01</span><div><strong>Qualifier</strong><p>Identifier le point de friction principal sans imposer la solution.</p></div></li>
              <li><span>02</span><div><strong>Orienter</strong><p>Distinguer expertise externe, formation, cadrage ou action interne.</p></div></li>
              <li><span>03</span><div><strong>Agir</strong><p>Transformer le diagnostic en prochaine action commerciale ou opérationnelle.</p></div></li>
            </>
          )}
        </ol>
      </section>

      <section className="proofArchitecture">
        <p className="sectionIndex">04 — PREUVES</p>
        <div>
          <h2>La crédibilité doit être vérifiable.</h2>
          <p>
            Autonomia n’affiche pas de références, chiffres, logos, résultats, certifications ou témoignages
            sans source et autorisation. Cette zone est conçue pour accueillir uniquement des preuves réelles.
          </p>
          <div className="proofSlots" aria-label="Preuves prévues">
            <span>Entité Qualiopi vérifiée</span>
            <span>Références autorisées</span>
            <span>Cas clients sourcés</span>
            <span>Expertises vérifiées</span>
          </div>
        </div>
      </section>

      <section className="faqSection" id="faq">
        <p className="sectionIndex">05 — QUESTIONS</p>
        <div>
          <h2>Questions fréquentes</h2>
          <div className="faqList">
            {(page.faq || []).map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="closingCta">
        <p className="eyebrow">AUTONOMIA</p>
        <h2>{isExpert ? "Votre projet a besoin d’une compétence précise." : isAcademy ? "Vos équipes ont besoin d’une trajectoire claire." : "Votre prochain choix IA peut être clarifié."}</h2>
        <Link href="#top" className="primaryButton">{page.cta}</Link>
      </section>
    </main>
  );
}
