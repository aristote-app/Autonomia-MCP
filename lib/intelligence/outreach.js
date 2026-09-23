function first(values = []) {
  return values.find(Boolean) || null;
}

function clean(value) {
  return String(value || "").trim();
}

function evidenceFromAccount(account = {}) {
  const seen = new Set();
  const evidence = [];

  for (const event of account.timeline || []) {
    const title = clean(event?.title);
    if (!title) continue;
    const key = (clean(event?.source_url) || title).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    evidence.push({
      title,
      source_id: event?.source_id || null,
      source_url: event?.source_url || null,
      date: event?.date || null,
      kind: event?.kind || null
    });
    if (evidence.length >= 3) break;
  }

  return evidence;
}

function offerFromAccount(account) {
  return account?.recommended_offer || first(account?.offers) || "accompagnement IA";
}

function targetRole(account) {
  return account?.primary_decision_role?.label ||
    account?.playbook?.target_role ||
    "décideur du sujet";
}

function commercialAngle(account = {}) {
  const offer = clean(offerFromAccount(account)).toLowerCase();

  if (/formation|adoption/.test(offer)) {
    return {
      problem: "transformer le déploiement IA en usages réellement adoptés par les équipes",
      cta: "comparer votre dispositif actuel avec un parcours ciblé sur les usages réels"
    };
  }

  if (/staffing|freelance/.test(offer)) {
    return {
      problem: "sécuriser rapidement les compétences nécessaires sans élargir inutilement le sourcing",
      cta: "valider les compétences réellement bloquantes avant de proposer un profil"
    };
  }

  if (/marché public|appel|ao/.test(offer)) {
    return {
      problem: "qualifier précisément le besoin et les exigences avant d'engager une réponse",
      cta: "vérifier les critères déterminants et la capacité de réponse"
    };
  }

  return {
    problem: "transformer le besoin IA observé en un périmètre opérationnel mesurable",
    cta: "cadrer rapidement le processus, les données et le résultat attendu"
  };
}

function signalSentence(company, evidence) {
  if (!evidence.length) {
    return "J'ai repéré un signal IA récent concernant " + company + ".";
  }

  if (evidence.length === 1) {
    return "J'ai repéré ce signal récent chez " + company + " : « " + evidence[0].title + " ».";
  }

  return (
    "J'ai repéré plusieurs signaux récents chez " +
    company +
    ", notamment « " +
    evidence[0].title +
    " » et « " +
    evidence[1].title +
    " »."
  );
}

export function buildAccountOutreachPlan(account = {}) {
  const company = account.name || "votre organisation";
  const evidence = evidenceFromAccount(account);
  const trigger = evidence[0]?.title || "un signal IA récent";
  const offer = offerFromAccount(account);
  const role = targetRole(account);
  const angle = commercialAngle(account);
  const stacked = evidence.length >= 2 || Number(account.source_count || 0) >= 2;

  const linkedinInvite =
    "Bonjour, je vous contacte à partir d'un signal récent autour de l'IA chez " + company + ". " +
    "Je travaille sur " + offer.toLowerCase() + ". Ravi d'échanger si le sujet est bien d'actualité.";

  const linkedinMessage =
    "Bonjour, " +
    signalSentence(company, evidence).replace(/^J/, "j") +
    " Le sujet m'intéresse surtout sous l'angle suivant : " +
    angle.problem +
    ". Est-ce bien une priorité actuelle de votre côté ?";

  const emailSubject =
    stacked
      ? company + " — plusieurs signaux IA convergents"
      : company + " — " + offer;

  const emailBody =
    "Bonjour,\n\n" +
    signalSentence(company, evidence) +
    "\n\n" +
    "Autonomia intervient sur " +
    offer.toLowerCase() +
    ". Ce qui me semble pertinent ici n'est pas de vous envoyer une présentation générique, mais de " +
    angle.cta +
    ".\n\n" +
    "Si le sujet est réellement prioritaire, je peux vous envoyer une approche synthétique à partir du contexte observé.\n\n" +
    "Bien à vous";

  return {
    target_role: role,
    offer,
    trigger,
    stacked_signals: stacked,
    evidence,
    why_this_message:
      stacked
        ? "L'approche s'appuie sur plusieurs signaux récents du compte, sans les transformer en faits non vérifiés."
        : "L'approche s'appuie sur le signal source le plus récent et cherche d'abord à confirmer la priorité.",
    guardrails: [
      "Vérifier l'identité et la fonction du contact avant envoi.",
      "Ne citer que des signaux reliés à une source vérifiable.",
      "Présenter les besoins comme hypothèses à confirmer, jamais comme certitudes.",
      "Arrêter la séquence dès qu'une réponse est détectée.",
      "Éviter l'enrichissement Kaspr tant que le compte et le contact ne sont pas qualifiés."
    ],
    sequence: [
      {
        day: 0,
        channel: "LinkedIn",
        action: "Invitation",
        content: linkedinInvite
      },
      {
        day: 2,
        channel: "LinkedIn",
        action: "Message après connexion",
        content: linkedinMessage
      },
      {
        day: 5,
        channel: "Email",
        action: "Email contextuel si adresse professionnelle disponible",
        subject: emailSubject,
        content: emailBody
      },
      {
        day: 10,
        channel: "LinkedIn / Email",
        action: "Relance courte puis arrêt",
        content:
          "Je me permets une dernière relance concernant " +
          offer.toLowerCase() +
          " chez " +
          company +
          ". Si ce n'est pas une priorité actuelle, aucun souci — je clôture de mon côté."
      }
    ]
  };
}
