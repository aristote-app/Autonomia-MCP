import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import QualiopiProof from "@/components/QualiopiProof";
import AutonomiaScan from "@/components/AutonomiaScan";
import ExpertProfiles from "@/components/ExpertProfiles";

export default function IntentPage({ page }) {
  const isExpert = page.mode === "experts";
  const isAcademy = page.mode === "academy";

  return (
    <main className={`intentPage theme-${page.theme || "dark"}`}>
      <section className="intentHero" id="top">
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
          {page.mode === "diagnostic" ? (
            <div className="diagnosticTeaser">
              <p className="formKicker">AUTONOMIA SCAN</p>
              <strong>3 réponses → une première orientation d’exécution.</strong>
              <p>Vous voyez le résultat avant de décider si vous souhaitez le transmettre.</p>
              <Link href="#diagnostic" className="formNext">Commencer le diagnostic</Link>
            </div>
          ) : (
            <>
              <p className="formKicker">{isExpert ? "Votre besoin" : "Votre plan de formation"}</p>
              <LeadForm
                mode={page.mode}
                formId={`lp-${page.slug}`}
                requestedService={page.slug}
              />
              <Link href="/scan-ia" className="scanSecondaryLink">
                Je ne sais pas encore exactement quoi demander → lancer Autonomia Scan
              </Link>
            </>
          )}
        </div>
      </section>

      {page.mode === "diagnostic" && (
        <section className="intentDiagnostic" id="diagnostic">
          <div className="intentDiagnosticIntro">
            <p className="sectionIndex">00 — DIAGNOSTIC</p>
            <h2>Obtenez d’abord une orientation. Décidez ensuite si vous voulez aller plus loin.</h2>
          </div>
          <AutonomiaScan
            captureLead
            source={`diagnostic_${page.slug}`}
            leadFormId={`diagnostic-${page.slug}`}
            requestedService={page.slug}
          />
        </section>
      )}

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

      {isExpert && <ExpertProfiles pageSlug={page.slug} />}

      {page.translations?.length > 0 && (
        <section className="translationSection">
          <p className="sectionIndex">03 — DU BESOIN À L’ACTIVATION</p>
          <div>
            <h2>{page.translationTitle}</h2>
            <div className="translationGrid">
              {page.translations.map((item, index) => (
                <article key={item.need}>
                  <span>0{index + 1}</span>
                  <div>
                    <small>PROBLÈME</small>
                    <strong>{item.need}</strong>
                  </div>
                  <div>
                    <small>COMPÉTENCES</small>
                    <p>{item.skills}</p>
                  </div>
                  <div>
                    <small>{isExpert ? "PROFIL / MISSION" : "PARCOURS"}</small>
                    <p>{item.activation}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="methodSplit">
        <div>
          <p className="sectionIndex">04 — NOTRE LOGIQUE</p>
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
        <p className="sectionIndex">05 — STANDARD</p>
        <div>
          <h2>Le besoin doit rester lisible et vérifiable.</h2>
          <p>
            Autonomia part du travail à accomplir, explicite les compétences ou apprentissages nécessaires
            et conserve le contexte transmis. Les preuves externes sont ajoutées uniquement lorsqu’elles sont vérifiées.
          </p>
          <div className="proofSlots" aria-label="Standard Autonomia">
            <span>Besoin structuré</span>
            <span>Compétences explicites</span>
            <span>Contexte conservé</span>
            <span>Preuves vérifiées</span>
          </div>
        </div>
      </section>

      {isAcademy && <QualiopiProof compact />}

      <section className="faqSection" id="faq">
        <p className="sectionIndex">06 — QUESTIONS</p>
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
        <Link href={page.mode === "diagnostic" ? "#diagnostic" : "#top"} className="primaryButton">{page.cta}</Link>
      </section>
    </main>
  );
}
