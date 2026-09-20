import Link from "next/link";
import LiveJobSignals from "@/components/LiveJobSignals";
import { getPillarInsight } from "@/content/pillar-insights";

function signalTags(cluster) {
  const value = cluster.toLowerCase();
  const tags = ["automation", "process_integration"];

  if (value.includes("mail")) tags.push("messaging_collaboration");
  if (value.includes("drive") || value.includes("document") || value.includes("knowledge")) tags.push("files_documents", "knowledge_management", "rag");
  if (value.includes("commercial") || value.includes("vente")) tags.push("sales_automation");
  if (value.includes("support")) tags.push("customer_support", "knowledge_management");
  if (value.includes("data") || value.includes("report")) tags.push("data", "analytics");
  if (value.includes("manager") || value.includes("direction")) tags.push("change_adoption");
  if (value.includes("agent")) tags.push("agents", "workflow_orchestration");
  if (value.includes("copilot")) tags.push("copilot", "power_platform");
  if (value.includes("gouvernance") || value.includes("conform")) tags.push("governance");

  return [...new Set(tags)].slice(0, 7);
}

export default function EditorialPillar({ pillar, family, publishedArticles }) {
  const training = family === "training";
  const insight = getPillarInsight(family, pillar.cluster);
  const publishedBySlug = new Map(publishedArticles.map((article) => [article.slug, article]));
  const basePath = training ? "/formation-ia/cas-usage" : "/cas-usage-ia";

  return (
    <main className={training ? "contentHub trainingHub pillarPage" : "contentHub pillarPage"}>
      <section className="contentHubHero">
        <p className="eyebrow">{training ? "AUTONOMIA ACADEMY — PILIER" : "AUTONOMIA — PILIER D’EXÉCUTION"}</p>
        <h1>{pillar.title}</h1>
        <p>
          {training
            ? `Ce pilier regroupe 10 situations de travail autour de « ${pillar.cluster} ». L’objectif n’est pas d’apprendre un outil pour lui-même, mais de rendre les équipes capables de reproduire des méthodes utiles, vérifiables et adaptées à leur contexte.`
            : `Ce pilier regroupe 10 scénarios autour de « ${pillar.cluster} ». Chaque scénario part d’un travail réel et montre comment combiner règles, automatisation, IA et contrôle humain sans transformer le sujet en démonstration abstraite.`}
        </p>
      </section>

      <section className="contentHubIntro">
        <p className="sectionIndex">RÉPONSE DIRECTE</p>
        <div>
          <h2>{training ? "Que faut-il réellement apprendre dans ce domaine ?" : "Que peut réellement automatiser ou augmenter l’IA ici ?"}</h2>
          <p>{insight.summary}</p>
          <div className="pillarDecisionBox">
            <span>3 DÉCISIONS À PRENDRE</span>
            <ol>
              {insight.decisions.map((decision) => <li key={decision}>{decision}</li>)}
            </ol>
          </div>
        </div>
      </section>

      <section className="pillarScenarioGrid">
        <p className="sectionIndex">10 SCÉNARIOS</p>
        <div>
          <h2>{training ? "Choisir une compétence à transférer." : "Choisir un système à construire ou améliorer."}</h2>
          <div className="pillarTopicList">
            {pillar.topics.map((topic, index) => {
              const published = publishedBySlug.get(topic.slug);
              return published ? (
                <Link key={topic.slug} href={`${basePath}/${topic.slug}`} className="pillarTopic published">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{topic.title}</strong>
                  <b>Guide complet →</b>
                </Link>
              ) : (
                <div key={topic.slug} className="pillarTopic">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{topic.title}</strong>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="pillarMethod">
        <p className="sectionIndex">COMMENT CHOISIR</p>
        <div>
          <h2>{training ? "Partir du changement attendu, pas du catalogue." : "Partir du goulot d’étranglement, pas de l’outil."}</h2>
          <ol>
            <li><span>01</span><div><strong>Nommer la tâche</strong><p>Décrire ce qu’une personne fait aujourd’hui et ce qui prend du temps, crée des erreurs ou bloque une décision.</p></div></li>
            <li><span>02</span><div><strong>Isoler la valeur</strong><p>Préciser ce qui doit devenir plus rapide, plus fiable, plus accessible ou plus facile à répéter.</p></div></li>
            <li><span>03</span><div><strong>Définir les garde-fous</strong><p>Identifier les données, droits, validations humaines, exceptions et responsabilités nécessaires.</p></div></li>
            <li><span>04</span><div><strong>Tester petit</strong><p>Choisir un périmètre mesurable avant d’élargir le workflow ou le parcours de formation.</p></div></li>
          </ol>
        </div>
      </section>

      <LiveJobSignals tags={signalTags(pillar.cluster)} />

      <section className="pillarBridge">
        <p className="sectionIndex">PASSER À L’ACTION</p>
        <div>
          <h2>{training ? "Transformer ce pilier en parcours de montée en compétences." : "Transformer ce pilier en besoin d’exécution concret."}</h2>
          <p>
            {training
              ? "Autonomia Academy peut traduire les scénarios utiles en objectifs pédagogiques, ateliers, niveaux et modalités adaptés aux publics concernés."
              : "Autonomia Experts peut traduire le scénario prioritaire en compétences, architecture, niveau d’autonomie et profil à mobiliser."}
          </p>
          <div className="closingActions">
            <Link className="primaryButton" href={training ? "/formation-ia-entreprise" : "/expert-ia"}>
              {training ? "Construire le parcours" : "Cadrer le besoin"}
            </Link>
            <Link className="secondaryButton" href={training ? "/methodologie/learning-transfer" : "/methodologie/execution-matrix"}>
              Voir la matrice Autonomia
            </Link>
            <Link className="secondaryButton" href={training ? "/formation-ia/cas-usage" : "/cas-usage-ia"}>
              Voir tous les piliers
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
