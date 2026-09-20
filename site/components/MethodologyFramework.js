import Link from "next/link";

const EXECUTION_LAYERS = [
  {
    index: "01",
    title: "PROCESSUS",
    question: "Quel travail existe aujourd’hui ?",
    text: "Décrire le déclencheur, les données, les décisions, les exceptions et le résultat attendu avant de choisir une technologie."
  },
  {
    index: "02",
    title: "INTERPRÉTATION",
    question: "Où l’IA apporte-t-elle réellement quelque chose ?",
    text: "Utiliser un modèle lorsqu’il faut comprendre du texte, classer, résumer, extraire ou générer ; garder des règles classiques quand elles suffisent."
  },
  {
    index: "03",
    title: "ACTION",
    question: "Qu’est-ce que le système peut faire ?",
    text: "Lister les actions autorisées, leur réversibilité, les permissions nécessaires et les outils que le workflow ou l’agent peut appeler."
  },
  {
    index: "04",
    title: "CONTRÔLE",
    question: "Où l’humain doit-il reprendre la main ?",
    text: "Définir validation, seuils, branche d’exception, journalisation, reprise d’erreur et propriétaire opérationnel du système."
  }
];

const LEARNING_LAYERS = [
  {
    index: "01",
    title: "TÂCHE",
    question: "Que doit mieux faire le participant ?",
    text: "Partir d’une situation de travail précise et observable plutôt que d’un chapitre générique sur un outil."
  },
  {
    index: "02",
    title: "MÉTHODE",
    question: "Quelle pratique doit-il savoir répéter ?",
    text: "Transformer les fonctionnalités en méthode : cadrer, fournir le contexte, produire, vérifier, corriger et documenter."
  },
  {
    index: "03",
    title: "GARDE-FOUS",
    question: "Quelles limites doit-il savoir appliquer ?",
    text: "Intégrer confidentialité, vérification, permissions, supervision humaine et règles internes directement dans les exercices."
  },
  {
    index: "04",
    title: "TRANSFERT",
    question: "Peut-il refaire la méthode ailleurs ?",
    text: "Évaluer la capacité à adapter la pratique à un nouveau cas plutôt que la mémorisation du scénario vu en formation."
  }
];

export default function MethodologyFramework({ mode = "execution", compact = false }) {
  const execution = mode === "execution";
  const layers = execution ? EXECUTION_LAYERS : LEARNING_LAYERS;

  return (
    <section className={compact ? "methodologyFramework compact" : "methodologyFramework"}>
      <div className="methodologyIntro">
        <p className="sectionIndex">{execution ? "MATRICE AUTONOMIA — EXÉCUTION" : "MATRICE AUTONOMIA — TRANSFERT"}</p>
        <h2>{execution ? "Quatre couches pour éviter de confondre IA et magie." : "Quatre couches pour transformer une démonstration en compétence durable."}</h2>
      </div>

      <div className="methodologyGrid">
        {layers.map((layer) => (
          <article key={layer.index}>
            <span>{layer.index}</span>
            <small>{layer.title}</small>
            <h3>{layer.question}</h3>
            <p>{layer.text}</p>
          </article>
        ))}
      </div>

      {!compact && (
        <div className="methodologyActions">
          <Link className="primaryButton" href={execution ? "/scan-ia" : "/formation-ia-entreprise"}>
            {execution ? "Appliquer la matrice à mon besoin" : "Construire un parcours"}
          </Link>
        </div>
      )}
    </section>
  );
}
