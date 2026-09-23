import Link from "next/link";
import { aiRoles } from "@/content/ai-roles";

export const metadata = {
  title: "Experts IA — Sourcing, staffing et pilotage de projets | Autonomia",
  description:
    "Autonomia source, qualifie et pilote des experts IA partout en France : AI Project Manager, GenAI, LLM, RAG, Agents IA, Data Science, MLOps, gouvernance et automatisation.",
  alternates: { canonical: "/experts" },
  openGraph: {
    title: "Autonomia Experts — Experts IA partout en France",
    description:
      "Sourcing multicanal, qualification, staffing et pilotage de projets IA avec des profils spécialisés.",
    url: "/experts"
  }
};

const sourcingSteps = [
  ["01", "Comprendre la mission", "Nous partons du problème, du contexte, du niveau d’autonomie attendu, des contraintes techniques et du résultat à obtenir."],
  ["02", "Sourcer largement", "Nous activons plusieurs canaux spécialisés, notre vivier et nos outils de détection pour identifier des profils réellement proches du besoin."],
  ["03", "Qualifier", "Nous regardons les expériences, les compétences, la capacité d’exécution, les environnements maîtrisés et l’adéquation avec la mission."],
  ["04", "Présenter peu, mais juste", "L’objectif n’est pas d’envoyer une pile de CV. Nous cherchons à proposer les profils les plus cohérents avec le besoin exprimé."],
  ["05", "Piloter avec le consultant", "Autonomia reste impliqué dans le cadrage, les objectifs, les livrables, les points de décision et les éventuels besoins complémentaires."]
];

const strengths = [
  ["Expertise IA", "Nous comprenons les rôles, les architectures et les cas d’usage : GenAI, RAG, agents, data, ML, MLOps, automatisation, gouvernance et produit."],
  ["Sourcing continu", "Le sourcing n’est pas ponctuel. Notre cockpit enrichit en continu le vivier afin d’identifier de nouveaux profils et compétences."],
  ["Pilotage", "Nous pouvons accompagner la mission au-delà de la mise en relation : cadrage, coordination, points de contrôle, arbitrages et continuité."],
  ["Couverture nationale", "Nous sourçons et mobilisons des consultants partout en France, en présentiel, hybride ou remote selon le besoin."],
  ["Complémentarité des rôles", "Un projet IA mobilise rarement un seul métier. Nous pouvons assembler plusieurs compétences lorsque le projet l’exige."],
  ["Transfert", "Lorsque c’est pertinent, Autonomia Academy peut former les équipes internes en parallèle de la mission pour réduire la dépendance externe."]
];

export default function ExpertsPage() {
  return (
    <main className="pillarPage expertsPillar">
      <section className="pillarHero">
        <div className="pillarHeroMeta">
          <span>AUTONOMIA</span>
          <strong>EXPERTS</strong>
          <small>FRANCE · NATIONAL</small>
        </div>
        <div className="pillarHeroCopy">
          <p className="eyebrow">EXPERTS IA · SOURCING · STAFFING · PILOTAGE</p>
          <h1>Les bonnes compétences IA, au bon moment — et un pilotage qui reste avec vous.</h1>
          <p>
            Autonomia ne se contente pas de mettre une entreprise en relation avec un consultant.
            Nous comprenons le besoin, sourçons les profils, qualifions les compétences et pouvons piloter
            le projet avec l’expert sélectionné jusqu’aux livrables attendus.
          </p>
          <div className="heroActions">
            <Link className="primaryButton" href="/#diagnostic-ia">Décrire mon besoin</Link>
            <a className="secondaryButton" href="#metiers">Voir les métiers IA</a>
          </div>
        </div>
      </section>

      <section className="pillarStatement">
        <p className="sectionIndex">01 — CE QUI NOUS DIFFÉRENCIE</p>
        <div>
          <h2>Nous connaissons l’IA suffisamment pour ne pas sourcer sur un simple intitulé de poste.</h2>
          <p>
            Un “GenAI Engineer” peut recouvrir des réalités très différentes. Nous cherchons à comprendre
            l’architecture, la stack, le niveau d’autonomie, la maturité du produit, les dépendances data,
            les contraintes de sécurité et ce que la personne devra réellement produire.
          </p>
        </div>
      </section>

      <section className="pillarStrengthGrid">
        {strengths.map(([title, text], index) => (
          <article key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>

      <section className="pillarProcess">
        <div className="pillarSectionIntro">
          <p className="sectionIndex">02 — COMMENT NOUS SOURÇONS</p>
          <div>
            <h2>Du besoin réel au consultant mobilisable.</h2>
            <p>
              Notre sourcing est multicanal et national. Les plateformes ne sont qu’un moyen parmi d’autres :
              le cœur du travail est de traduire une mission en critères de recherche et de qualification utiles.
            </p>
          </div>
        </div>

        <ol>
          {sourcingSteps.map(([number, title, text]) => (
            <li key={number}>
              <span>{number}</span>
              <div>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="pillarDark">
        <div>
          <p className="sectionIndex">03 — PAS SEULEMENT DU STAFFING</p>
          <h2>Nous pouvons piloter le projet avec l’expert.</h2>
        </div>
        <div className="pillarDarkPoints">
          <p><strong>Cadrage.</strong> Clarifier le résultat attendu, le périmètre, les contraintes et les critères de succès.</p>
          <p><strong>Coordination.</strong> Faire le lien entre direction, métier, IT, data et consultant lorsque le projet le nécessite.</p>
          <p><strong>Livrables.</strong> Définir ce qui doit être produit, validé et transmissible à la fin de la mission.</p>
          <p><strong>Continuité.</strong> Ajouter une compétence complémentaire si le projet évolue vers RAG, MLOps, gouvernance, produit ou automatisation.</p>
          <p><strong>Transfert.</strong> Organiser la montée en compétence interne lorsque l’objectif est de rendre les équipes plus autonomes.</p>
        </div>
      </section>

      <section className="pillarNational">
        <p className="sectionIndex">04 — FRANCE ENTIÈRE</p>
        <div>
          <h2>Une capacité de sourcing et d’intervention nationale.</h2>
          <p>
            Les besoins IA ne se concentrent pas sur une seule ville. Nous pouvons rechercher des consultants
            partout en France et travailler selon le format le plus adapté : présentiel, hybride ou remote.
            La localisation devient un critère de matching, pas une limite du dispositif.
          </p>
        </div>
      </section>

      <section className="pillarDirectory" id="metiers">
        <div className="pillarSectionIntro">
          <p className="sectionIndex">05 — EXPERTS PAR MÉTIER</p>
          <div>
            <h2>Explorer nos métiers IA.</h2>
            <p>
              Chaque fiche détaille missions, responsabilités, livrables, compétences, questions de cadrage,
              métiers voisins et profils consultants remontés par notre vivier.
            </p>
          </div>
        </div>

        <div className="pillarDirectoryGrid">
          {aiRoles.map((role, index) => (
            <Link href={"/metiers-ia/" + role.slug} key={role.slug}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{role.title}</strong>
                <small>{role.frenchTitle || role.dek}</small>
              </div>
              <b>↗</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="pillarFinalCta">
        <div>
          <p className="eyebrow">VOUS AVEZ UN BESOIN IA ?</p>
          <h2>Décrivez le problème. Nous traduirons le besoin en compétences.</h2>
          <p>
            Vous n’avez pas besoin de connaître le bon intitulé de poste avant de nous contacter.
          </p>
        </div>
        <Link className="primaryButton" href="/#diagnostic-ia">Faire le diagnostic IA</Link>
      </section>
    </main>
  );
}
