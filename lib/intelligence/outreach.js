
function first(values = []) {
  return values.find(Boolean) || null;
}

function triggerFromAccount(account) {
  return first(account?.timeline?.map((event) => event.title)) || "un signal IA récent";
}

function offerFromAccount(account) {
  return first(account?.offers) || "accompagnement IA";
}

export function buildAccountOutreachPlan(account = {}) {
  const company = account.name || "votre organisation";
  const trigger = triggerFromAccount(account);
  const offer = offerFromAccount(account);

  const linkedinInvite =
    "Bonjour, je vous contacte suite à un signal récent autour de l'IA chez " + company + ". " +
    "Je travaille sur des sujets " + offer.toLowerCase() + ". Ravi d'échanger si le sujet est d'actualité.";

  const linkedinMessage =
    "Bonjour, j'ai repéré le signal suivant chez " + company + " : « " + trigger + " ». " +
    "Nous intervenons sur " + offer.toLowerCase() + " et je voulais vérifier si ce chantier fait partie de vos priorités actuelles. " +
    "Si oui, je peux vous partager une approche très concrète.";

  const emailSubject = company + " — " + offer;
  const emailBody =
    "Bonjour,\n\n" +
    "Je vous contacte à partir d'un signal public récent concernant " + company + " : « " + trigger + " ».\n\n" +
    "Autonomia intervient sur " + offer.toLowerCase() + ". Plutôt que de vous envoyer une présentation générique, " +
    "je préfère vérifier si ce sujet correspond réellement à une priorité en cours.\n\n" +
    "Si c'est le cas, je peux vous envoyer une proposition d'approche synthétique adaptée au contexte observé.\n\n" +
    "Bien à vous";

  return {
    guardrails: [
      "Vérifier l'identité et la fonction du contact avant envoi.",
      "Ne citer que des signaux reliés à une source vérifiable.",
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
        action: "Relance courte",
        content:
          "Je me permets une dernière relance concernant " + offer.toLowerCase() + " chez " + company + ". " +
          "Si ce n'est pas un sujet actuel, aucun souci — je clôture de mon côté."
      }
    ]
  };
}
