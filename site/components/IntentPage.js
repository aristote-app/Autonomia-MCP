import Link from "next/link";
import LeadForm from "@/components/LeadForm";

export default function IntentPage({ page }) {
  const isExpert = page.mode === "experts";
  const isAcademy = page.mode === "academy";
  const isDiagnostic = page.mode === "diagnostic";

  return (
    <main className={`intentPage theme-${page.theme || "dark"}`}>
      <section className="intentHero" id="top">
        <div className="intentHeroCopy">
          <p className="eyebrow">{page.universe}</p>
          <h1>{page.title}</h1>
          <p className="heroText">{page.subtitle}</p>

          <div className="heroSignals" aria-label="Résultat attendu">
            {(page.outcomes || []).map((item, index) => (
              <div key={item}>
                <span>0{index + 1}</span>
                <strong>{item}</strong>
              </div>
            ))}
          </div>

          {!isDiagnostic && (
            <Link className="intentScanLink" href="/scan-ia">
              <span>Vous ne savez pas encore quoi demander ?</span>
              <strong>Lancer Autonomia Scan →</strong>
            </Link>
          )}
        </div>

        <div className="heroFormCard">
          <p className="formKicker">{isExpert ? "Votre besoin" : isAcademy ? "Votre plan de formation" : "Votre diagnostic"}</p>
          <LeadForm
            mode={page.mode}
            formId={`lp-${page.slug}`}
            requestedService={page.slug}
          />
          <p className="heroFormNote">
            {isExpert
              ? "Quelques informations suffisent pour commencer à qualifier la mission."
              : isAcademy
                ? "Le premier échange sert à préciser les publics, usages et objectifs."
                : "Première orientation basée sur les informations que vous fournissez."}
          </p>
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

      {page.useCases?.length > 0 && (
        <section className="intentDecisionSection">
          <p className="sectionIndex">03 — CAS TYPIQUES</p>
          <div>
            <h2>{page.useCasesTitle || "À quels moments ce besoin apparaît-il ?"}</h2>
            <div className="intentDecisionGrid">
              {page.useCases.map((item, index) => (
                <article key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.routes?.length > 0 && (
        <section className="intentRoutes">
          <p className="sectionIndex">04 — ORIENTATION</p>
          <div>
            <h2>{page.routesTitle || "Le besoin détermine la réponse."}</h2>
            <div className="intentRouteGrid">
              {page.routes.map((route) => (
                <article key={route.title}>
                  <small>{route.kicker}</small>
                  <h3>{route.title}</h3>
                  <p>{route.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="methodSplit">
        <div>
          <p className="sectionIndex">05 — NOTRE LOGIQUE</p>
          <h2>{page.proofTitle}</h2>
          <p>{page.proofText}</p>
        </div>

        <ol className="methodSteps">
          {isExpert ? (
            <>
              <li><span>01</span><div><strong>Comprendre</strong><p>Objectif, contexte, contraintes, environnement et niveau d’autonomie attendu.</p></div></li>
              <li><span>02</span><div><strong>Traduire</strong><p>Transformer le besoin en compétences, rôle, séniorité et critères de sélection.</p></div></li>
              <li><span>03</span><div><strong>Staffer</strong><p>Concentrer la sélection sur les profils cohérents avec la mission définie.</p></div></li>
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
        <p className="sectionIndex">06 — À ÉVALUER</p>
        <div>
          <h2>Jugez Autonomia sur la précision de la réponse.</h2>
          <p>
            Le site n’utilise pas de logos, résultats, volumes ou certifications non vérifiés comme argument.
            La première preuve est la capacité à traduire votre situation en compétences, options et prochaine action compréhensible.
          </p>
          <div className="proofSlots" aria-label="Éléments à évaluer">
            <span>Compréhension du besoin</span>
            <span>Précision des compétences proposées</span>
            <span>Clarté du chemin d’exécution</span>
            <span>Transparence sur ce qui reste à qualifier</span>
          </div>
        </div>
      </section>

      <section className="faqSection" id="faq">
        <p className="sectionIndex">07 — QUESTIONS</p>
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
        <div className="closingActions">
          <Link href="#top" className="primaryButton">{page.cta}</Link>
          {!isDiagnostic && <Link href="/scan-ia" className="secondaryButton">Lancer le Scan</Link>}
        </div>
      </section>
    </main>
  );
}
