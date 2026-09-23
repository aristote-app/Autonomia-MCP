import Link from "next/link";
import { notFound } from "next/navigation";
import {
  academyTrainings,
  academyPricing,
  getAcademyTraining,
  getAcademyTrainingStaticParams,
  trainingPrice
} from "@/content/academy-trainings";

export function generateStaticParams() {
  return getAcademyTrainingStaticParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const training = getAcademyTraining(slug);
  if (!training) return {};

  return {
    title: training.title,
    description: training.subtitle,
    alternates: { canonical: `/formation-ia/${training.slug}` },
    openGraph: {
      title: training.title + " | Autonomia Academy",
      description: training.subtitle,
      url: `/formation-ia/${training.slug}`,
      type: "article"
    }
  };
}

function euro(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: academyPricing.currency,
    maximumFractionDigits: 0
  }).format(value);
}

function LevelCard({ name, days, training, recommended = false }) {
  const hours = days * 7;
  const intra = trainingPrice(days, "intra");
  const inter = trainingPrice(days, "inter");

  const descriptions = {
    "Initiation": "Comprendre les fondamentaux, tester les premiers usages et repartir avec une méthode de travail immédiatement applicable.",
    "Opérationnel": "Approfondir la pratique, travailler sur des cas d’entreprise et construire des méthodes ou livrables directement réutilisables.",
    "Expert": "Aller plus loin sur architecture, automatisation, gouvernance ou industrialisation selon le sujet, avec davantage de pratique et de cas complexes."
  };

  return (
    <article className={recommended ? "trainingLevel featured" : "trainingLevel"}>
      <div className="trainingLevelHead">
        <span>{recommended ? "PARCOURS RECOMMANDÉ" : "PARCOURS"}</span>
        <h3>{name}</h3>
        <strong>{days} jour{days > 1 ? "s" : ""} · {hours} h</strong>
      </div>
      <p>{descriptions[name]}</p>
      <dl>
        <div><dt>Intra-entreprise</dt><dd>{euro(intra)} HT / groupe</dd></div>
        <div><dt>Inter-entreprises</dt><dd>{euro(inter)} HT / participant</dd></div>
      </dl>
    </article>
  );
}

export default async function TrainingPage({ params }) {
  const { slug } = await params;
  const training = getAcademyTraining(slug);
  if (!training) notFound();

  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://build-autonomia.com";
  const url = `${base}/formation-ia/${training.slug}`;
  const pdfUrl = `/api/programme-formation/${training.slug}`;
  const standardPrice = trainingPrice(training.standardDays, "intra");

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": `${url}#course`,
        name: training.title,
        description: training.subtitle,
        provider: { "@id": `${base}#organization` },
        inLanguage: "fr-FR",
        educationalLevel: "Professionnel",
        teaches: training.skills,
        offers: [
          {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: standardPrice,
            description: "Parcours opérationnel intra-entreprise - tarif groupe"
          },
          {
            "@type": "Offer",
            priceCurrency: "EUR",
            price: trainingPrice(training.standardDays, "inter"),
            description: "Parcours opérationnel inter-entreprises - tarif par participant"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: training.faq.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer }
        }))
      }
    ]
  };

  return (
    <main className="trainingPage">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="trainingHero">
        <div className="trainingHeroMeta">
          <span>AUTONOMIA ACADEMY</span>
          <strong>FORMATION IA</strong>
        </div>
        <div className="trainingHeroCopy">
          <p className="eyebrow">PROGRAMME PROFESSIONNEL</p>
          <h1>{training.title}</h1>
          <p className="trainingDek">{training.subtitle}</p>

          <div className="trainingHeroFacts">
            <span><b>{training.standardDays} jours</b> · {training.standardDays * 7} heures recommandées</span>
            <span><b>Présentiel ou distanciel</b></span>
            <span><b>Intra ou inter</b></span>
          </div>

          <div className="trainingHeroActions">
            <Link className="primaryButton" href="/#fiche-besoin">Demander un devis</Link>
            <a className="secondaryButton" href={pdfUrl}>Télécharger le programme PDF</a>
          </div>
        </div>
      </section>

      <nav className="trainingToc" aria-label="Sommaire de la formation">
        <a href="#essentiel">L’essentiel</a>
        <a href="#objectifs">Objectifs</a>
        <a href="#programme">Programme</a>
        <a href="#niveaux">Niveaux</a>
        <a href="#modalites">Modalités</a>
        <a href="#tarifs">Tarifs</a>
        <a href="#financement">OPCO</a>
        <a href="#faq">FAQ</a>
      </nav>

      <section className="trainingEssentials" id="essentiel">
        <p className="sectionIndex">01 — L’ESSENTIEL</p>
        <div className="trainingEssentialGrid">
          <article>
            <span>PUBLIC</span>
            <ul>{training.audience.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <span>PRÉREQUIS</span>
            <ul>{training.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
          <article>
            <span>FORMAT RECOMMANDÉ</span>
            <strong>{training.standardDays} jours · {training.standardDays * 7} h</strong>
            <p>Parcours opérationnel. Des formats initiation et expert sont proposés plus bas.</p>
          </article>
          <article>
            <span>TAILLE DE GROUPE</span>
            <strong>4 à 12 participants recommandés</strong>
            <p>Le format intra peut être adapté au contexte, aux outils et aux cas d’usage de l’entreprise.</p>
          </article>
        </div>
      </section>

      <section className="trainingGoals" id="objectifs">
        <div className="trainingSectionIntro">
          <p className="sectionIndex">02 — OBJECTIFS PÉDAGOGIQUES</p>
          <div>
            <h2>Ce que les participants doivent savoir faire à l’issue de la formation.</h2>
            <p>
              Le programme privilégie des compétences observables et des livrables réutilisables. Les objectifs
              peuvent être ajustés en intra après analyse du niveau, des outils et des cas d’usage du groupe.
            </p>
          </div>
        </div>

        <ol className="trainingGoalsList">
          {training.goals.map((goal, index) => (
            <li key={goal}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{goal}</strong>
            </li>
          ))}
        </ol>

        <div className="trainingSkills">
          <p className="trainingMicro">COMPÉTENCES TRAVAILLÉES</p>
          <div>{training.skills.map((item) => <span key={item}>{item}</span>)}</div>
        </div>
      </section>

      <section className="trainingProgram" id="programme">
        <div className="trainingSectionIntro">
          <p className="sectionIndex">03 — PROGRAMME DÉTAILLÉ</p>
          <div>
            <h2>Un déroulé pensé pour aller de la compréhension à l’application.</h2>
            <p>
              Chaque journée alterne apports, démonstrations, exercices, échanges et atelier fil rouge. Le niveau
              de profondeur est adapté au parcours retenu ; le détail ci-dessous correspond au parcours
              opérationnel recommandé.
            </p>
          </div>
        </div>

        <div className="trainingDays">
          {training.days.map((day, index) => (
            <article key={day.title}>
              <div className="trainingDayNumber">{String(index + 1).padStart(2, "0")}</div>
              <div className="trainingDayBody">
                <h3>{day.title}</h3>
                <ul>
                  {day.modules.map((module) => <li key={module}>{module}</li>)}
                </ul>
                <div className="trainingWorkshop">
                  <div><span>ATELIER</span><p>{day.workshop}</p></div>
                  <div><span>LIVRABLE</span><p>{day.deliverable}</p></div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="trainingCases">
          <p className="trainingMicro">EXEMPLES DE CAS APPLICATIFS</p>
          <div>
            {training.cases.map((item, index) => (
              <span key={item}><b>{String(index + 1).padStart(2, "0")}</b>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="trainingLevels" id="niveaux">
        <div className="trainingSectionIntro">
          <p className="sectionIndex">04 — DU NIVEAU INITIATION À EXPERT</p>
          <div>
            <h2>Choisir la profondeur adaptée au public et au résultat attendu.</h2>
            <p>
              Le format standard est calibré pour une mise en pratique professionnelle. L’initiation convient à
              une sensibilisation active ; le parcours expert réserve davantage de temps aux architectures,
              automatisations, évaluations ou cas complexes selon la thématique.
            </p>
          </div>
        </div>

        <div className="trainingLevelGrid">
          <LevelCard name="Initiation" days={training.introDays} training={training} />
          <LevelCard name="Opérationnel" days={training.standardDays} training={training} recommended />
          <LevelCard name="Expert" days={training.expertDays} training={training} />
        </div>
      </section>

      <section className="trainingMethods" id="modalites">
        <div className="trainingSectionIntro">
          <p className="sectionIndex">05 — MODALITÉS PÉDAGOGIQUES</p>
          <div>
            <h2>Une formation professionnelle doit produire autre chose qu’une démonstration.</h2>
            <p>
              Les participants travaillent sur des tâches, documents, processus ou scénarios proches de leur
              réalité. En intra, un cadrage en amont permet de sélectionner les cas les plus pertinents sans
              exposer de données qui ne devraient pas être utilisées dans les outils de formation.
            </p>
          </div>
        </div>

        <div className="trainingMethodGrid">
          <article>
            <span>APPROCHE</span>
            <h3>Pratique guidée</h3>
            <p>Démonstrations courtes, exercices progressifs, ateliers individuels ou en sous-groupes et cas fil rouge.</p>
          </article>
          <article>
            <span>SUPPORTS</span>
            <h3>Ressources réutilisables</h3>
            <p>Support pédagogique, checklists, canevas, prompts, matrices ou modèles adaptés au programme suivi.</p>
          </article>
          <article>
            <span>ÉVALUATION</span>
            <h3>Avant, pendant, après</h3>
            <p>Positionnement initial, exercices d’application, observation des productions et évaluation finale des acquis.</p>
          </article>
          <article>
            <span>VALIDATION</span>
            <h3>Attestation de fin de formation</h3>
            <p>Une attestation peut être remise à l’issue du parcours, avec les objectifs et la durée effectivement suivis.</p>
          </article>
          <article>
            <span>ACCESSIBILITÉ</span>
            <h3>Aménagement à étudier en amont</h3>
            <p>Les besoins spécifiques peuvent être signalés avant la session afin d’étudier les adaptations pédagogiques ou matérielles possibles.</p>
          </article>
          <article>
            <span>OUTILS</span>
            <h3>{training.tools.slice(0,3).join(" · ")}</h3>
            <p>Les outils peuvent être adaptés à l’environnement autorisé par l’entreprise et aux licences disponibles.</p>
          </article>
        </div>
      </section>

      <section className="trainingPricing" id="tarifs">
        <div className="trainingSectionIntro">
          <p className="sectionIndex">06 — TARIFS</p>
          <div>
            <h2>Un tarif simple par journée de formation.</h2>
            <p>
              Les montants ci-dessous sont exprimés hors taxes. Les frais de déplacement ou contraintes
              particulières éventuelles sont précisés au devis lorsqu’ils s’appliquent.
            </p>
          </div>
        </div>

        <div className="trainingPriceGrid">
          <article className="trainingPriceMain">
            <span>INTRA-ENTREPRISE</span>
            <strong>1 800 € HT</strong>
            <b>par jour / groupe</b>
            <p>Dans votre entreprise ou à distance. Programme adaptable à vos outils, cas d’usage et niveau.</p>
            <Link href="/#fiche-besoin">Demander un devis intra →</Link>
          </article>
          <article>
            <span>INTER-ENTREPRISES</span>
            <strong>990 € HT</strong>
            <b>par jour / participant</b>
            <p>Session ouverte sous réserve de programmation et d’un nombre suffisant de participants.</p>
            <Link href="/#contact">Nous appeler / demander la prochaine session →</Link>
          </article>
        </div>

        <div className="trainingPriceExamples">
          <span>Parcours opérationnel {training.standardDays} jours</span>
          <strong>Intra : {euro(trainingPrice(training.standardDays, "intra"))} HT / groupe</strong>
          <strong>Inter : {euro(trainingPrice(training.standardDays, "inter"))} HT / participant</strong>
        </div>
      </section>

      <section className="trainingFunding" id="financement">
        <p className="sectionIndex">07 — FINANCEMENT OPCO</p>
        <div>
          <h2>Une demande de prise en charge peut être étudiée jusqu’à 100 %.</h2>
          <p>
            Selon votre branche professionnelle, votre OPCO, les budgets disponibles, les critères d’éligibilité
            et l’accord préalable du financeur, une demande peut couvrir jusqu’à 100 % des coûts pédagogiques.
            Autonomia peut fournir le programme détaillé et le devis nécessaires à l’étude du dossier.
          </p>
          <p className="trainingFundingWarning">
            La prise en charge n’est jamais automatique ni garantie : seule la décision écrite de l’OPCO fait foi.
            Il est recommandé de déposer la demande avant le démarrage de la formation et de vérifier directement
            les règles applicables à votre entreprise.
          </p>
        </div>
      </section>

      <section className="trainingFaq" id="faq">
        <p className="sectionIndex">08 — QUESTIONS FRÉQUENTES</p>
        <div>
          <h2>Questions sur {training.title.toLowerCase()}.</h2>
          <div className="faqList">
            {training.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
            <details>
              <summary>Peut-on adapter le programme en intra-entreprise ?</summary>
              <p>Oui. Le cadrage peut adapter outils, cas pratiques, niveau, exemples et livrables sans dénaturer les objectifs pédagogiques retenus.</p>
            </details>
            <details>
              <summary>Présentiel ou distanciel ?</summary>
              <p>Les deux modalités sont possibles. Le format retenu est précisé dans le devis et la convention.</p>
            </details>
          </div>
        </div>
      </section>

      <section className="trainingFinalCta">
        <div>
          <p className="eyebrow">AUTONOMIA ACADEMY</p>
          <h2>Vous voulez adapter cette formation à vos équipes ?</h2>
          <p>
            Décrivez le public, les outils, le niveau et les cas d’usage. Nous pourrons cadrer le bon parcours
            entre initiation, opérationnel et expert.
          </p>
        </div>
        <div>
          <Link className="primaryButton" href="/#fiche-besoin">Préciser mon besoin</Link>
          <a className="secondaryButton" href={pdfUrl}>Télécharger le programme PDF</a>
        </div>
      </section>

      <section className="trainingExplore">
        <div>
          <p className="sectionIndex">09 — AUTRES FORMATIONS IA</p>
          <h2>Explorer le catalogue Autonomia Academy.</h2>
        </div>
        <div className="trainingExploreGrid">
          {academyTrainings.filter((item) => item.slug !== training.slug).slice(0, 8).map((item) => (
            <Link key={item.slug} href={`/formation-ia/${item.slug}`}>
              <span>{item.homeTitle}</span><b>↗</b>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

export const dynamicParams = false;
