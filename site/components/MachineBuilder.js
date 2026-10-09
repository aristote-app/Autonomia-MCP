"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./MachineBuilder.module.css";
import { getClientAttribution } from "@/lib/clientAttribution";
import { trackEvent, trackLeadConversion } from "@/lib/clientTracking";
import { MACHINE_BUILDERS, getMachineBuilder, machineBuilderHref } from "@/lib/machineBuilders";

const LABELS = {
  mailProvider: { gmail: "Gmail / Google Workspace", outlook: "Outlook / Microsoft 365", other: "Autre messagerie" },
  mailAccess: { standard: "J’ai accès à la boîte", shared: "Boîte partagée", admin: "J’ai aussi les droits administrateur", unknown: "Je dois vérifier" },
  commerce: { shopify: "Shopify", woocommerce: "WooCommerce", prestashop: "PrestaShop", none: "Aucun outil e-commerce", other: "Autre" },
  crm: { odoo: "Odoo", hubspot: "HubSpot", salesforce: "Salesforce", sheets: "Google Sheets / Excel", none: "Aucun CRM", other: "Autre" },
  ai: { chatgpt: "ChatGPT / OpenAI", claude: "Claude / Anthropic", auto: "Je veux une recommandation" },
  apiAccess: { yes: "Oui", no: "Non", unknown: "Je ne sais pas" },
  volume: { low: "Moins de 20 e-mails / jour", medium: "20 à 100 e-mails / jour", high: "Plus de 100 e-mails / jour" }
};

const ACTIONS = [
  ["classify", "Comprendre et classer la demande"],
  ["order", "Retrouver la commande"],
  ["status", "Vérifier le statut / suivi"],
  ["draft", "Préparer la réponse"],
  ["crm", "Mettre à jour le CRM / suivi"],
  ["alert", "Alerter une personne si nécessaire"]
];

const HUMAN_RULES = [
  ["refund", "Remboursement ou geste commercial"],
  ["missing", "Commande introuvable / information manquante"],
  ["angry", "Client très mécontent ou message sensible"],
  ["high_value", "Commande à montant élevé"],
  ["always_send", "Toute réponse avant envoi"]
];

const MACHINE_SLUG = "automatiser-sav-ecommerce";
const CURRENT_MACHINE = getMachineBuilder(MACHINE_SLUG);
const MACHINE_ID = "sav-ecommerce-01";
const MACHINE_NAME = CURRENT_MACHINE?.title || "Automatiser le SAV e-commerce avec l’IA";
const LINKEDIN_FOLLOW_URL =
  process.env.NEXT_PUBLIC_LINKEDIN_NEWSLETTER_URL ||
  "https://www.linkedin.com/in/deborahdiangoldcher/";

function toggle(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function label(group, value) {
  return LABELS[group]?.[value] || value;
}

function architecture(config) {
  const steps = [label("mailProvider", config.mailProvider), "lecture du message", "extraction structurée"];
  if (config.commerce !== "none") steps.push(label("commerce", config.commerce));
  steps.push(label("ai", config.ai), "règles métier", "brouillon / décision", "validation humaine");
  if (config.crm !== "none") steps.push(label("crm", config.crm));
  steps.push("journal de suivi");
  return steps.join(" → ");
}

function starterScript(config) {
  if (config.mailProvider === "gmail") {
    return [
      "// SCRIPT DE DÉPART — Google Apps Script",
      "// Lecture d'un label de test uniquement. Aucun envoi automatique.",
      "",
      "function runAutonomiaMachine() {",
      "  const query = 'label:AUTONOMIA_TEST is:unread';",
      "  const threads = GmailApp.search(query, 0, 10);",
      "  threads.forEach(function(thread) {",
      "    const messages = thread.getMessages();",
      "    const message = messages[messages.length - 1];",
      "    const input = {",
      "      from: message.getFrom(),",
      "      subject: message.getSubject(),",
      "      body: message.getPlainBody(),",
      "      threadId: thread.getId()",
      "    };",
      "    Logger.log(JSON.stringify(input));",
      "    // Étape suivante : faire générer par Claude ou ChatGPT la fonction callAI(input),",
      "    // puis la lecture de la commande et la création d'un BROUILLON.",
      "  });",
      "}"
    ].join("\n");
  }

  if (config.mailProvider === "outlook") {
    return [
      "// SCRIPT DE DÉPART — Node.js + Microsoft Graph",
      "// Pré-requis : application Microsoft Entra / Azure avec les droits adaptés.",
      "// Lecture uniquement pendant la phase de test.",
      "",
      "const GRAPH = 'https://graph.microsoft.com/v1.0';",
      "",
      "async function readTestMessages(accessToken) {",
      "  const response = await fetch(GRAPH + '/me/mailFolders/inbox/messages?$top=10&$select=id,subject,from,bodyPreview', {",
      "    headers: { Authorization: 'Bearer ' + accessToken }",
      "  });",
      "  if (!response.ok) throw new Error('Microsoft Graph: ' + response.status);",
      "  return response.json();",
      "}",
      "",
      "// Étape suivante : demander à Claude ou ChatGPT d'ajouter l'authentification,",
      "// l'appel IA, la lecture de la commande et la création d'un brouillon."
    ].join("\n");
  }

  return [
    "# SCRIPT DE DÉPART — Python / messagerie générique",
    "# À adapter selon le fournisseur : IMAP ou API propriétaire.",
    "# Commencer en lecture seule sur un dossier de test.",
    "",
    "def read_test_messages():",
    "    raise NotImplementedError('Demandez à Claude ou ChatGPT de brancher ici l API de votre messagerie.')",
    "",
    "def build_draft(message):",
    "    # 1. extraire les informations utiles",
    "    # 2. appeler l IA",
    "    # 3. récupérer les données métier",
    "    # 4. produire un brouillon à valider",
    "    return None"
  ].join("\n");
}

function buildPrompt(config) {
  const actions = ACTIONS.filter(([id]) => config.actions.includes(id)).map(([, text]) => "- " + text);
  const human = HUMAN_RULES.filter(([id]) => config.humanRules.includes(id)).map(([, text]) => "- " + text);

  return [
    "Tu es mon copilote technique. Nous allons construire une machine IA de traitement des e-mails, étape par étape.",
    "",
    "MON ENVIRONNEMENT",
    "- Messagerie : " + label("mailProvider", config.mailProvider),
    "- Accès : " + label("mailAccess", config.mailAccess),
    "- Outil e-commerce / métier : " + label("commerce", config.commerce),
    "- CRM / suivi : " + label("crm", config.crm),
    "- IA souhaitée : " + label("ai", config.ai),
    "- Accès API IA : " + label("apiAccess", config.apiAccess),
    "- Volume : " + label("volume", config.volume),
    "",
    "CE QUE JE VEUX AUTOMATISER",
    ...(actions.length ? actions : ["- À préciser avec moi"]),
    "",
    "VALIDATION HUMAINE OBLIGATOIRE POUR",
    ...(human.length ? human : ["- Toute action externe tant que les tests ne sont pas validés"]),
    "",
    "ARCHITECTURE CIBLE",
    architecture(config),
    "",
    "MODE INSTALLATEUR",
    "Je veux être accompagné jusqu’à ce que cette machine fonctionne réellement dans mon environnement.",
    "Procède par phases, une seule action à la fois. Pour chaque action : explique, donne le chemin exact / code complet, donne le test, indique le résultat attendu, puis attends mon OK.",
    "Si je rencontre une erreur, reste sur cette étape jusqu’à résolution. Demande-moi la capture ou l’erreur exacte si nécessaire.",
    "Ne suppose aucun accès, token ou permission. Aide-moi à obtenir proprement chaque prérequis manquant.",
    "Utilise les API officielles actuelles correspondant à mes outils.",
    "Commence en lecture seule sur un périmètre TEST et crée uniquement des brouillons.",
    "Ajoute logs, gestion des erreurs, anti-doublons, règles déterministes et validations humaines.",
    "À la fin, réalise un test de bout en bout, un tableau PASS / FAIL et une checklist GO LIVE.",
    "",
    "Si ce prompt est utilisé seul, commence par la PHASE 1. Si le fichier AUTONOMIA complet a été uploadé, attends que j’écrive START."
  ].join("\n");
}

function buildKit(config) {
  const selectedActions = ACTIONS.filter(([id]) => config.actions.includes(id)).map(([, text]) => "- " + text);
  const selectedRules = HUMAN_RULES.filter(([id]) => config.humanRules.includes(id)).map(([, text]) => "- " + text);

  return [
    "# AUTONOMIA — KIT MACHINE IA",
    "Machine #01 · " + MACHINE_NAME,
    "",
    "## 0. DÉMARRAGE — le plus simple",
    "Vous pouvez utiliser ce kit sans être développeur.",
    "1. Ouvrez Claude ou ChatGPT.",
    "2. Uploadez CE FICHIER COMPLET dans la conversation.",
    "3. Écrivez simplement : START",
    "4. L’IA doit ensuite vous prendre par la main, une seule étape à la fois, jusqu’au test final.",
    "5. À chaque étape, répondez OK si tout fonctionne. Si quelque chose bloque, envoyez la capture d’écran ou copiez l’erreur exacte.",
    "",
    "IMPORTANT : pendant la construction, utilisez un dossier / label TEST et créez uniquement des brouillons. Les actions réelles seront activées seulement après validation.",
    "",
    "## 0B. INSTRUCTIONS POUR CLAUDE / CHATGPT — MODE INSTALLATEUR",
    "Si vous êtes l’assistant IA qui lit ce fichier, considérez toute la configuration ci-dessous comme le cahier des charges de l’utilisateur.",
    "Votre objectif est de l’accompagner jusqu’à ce que la machine fonctionne réellement dans SON environnement.",
    "",
    "RÈGLES DE CONDUITE :",
    "- Commencez uniquement lorsque l’utilisateur écrit START.",
    "- Travaillez par phases et ne donnez qu’UNE action concrète à la fois.",
    "- Avant chaque action, dites en une phrase ce que nous allons faire et pourquoi.",
    "- Donnez les chemins de menus exacts, les commandes exactes et le code complet quand du code est nécessaire.",
    "- Après chaque action, donnez UN test précis et indiquez le résultat attendu.",
    "- Terminez chaque étape par : « Répondez OK si vous obtenez ce résultat, sinon envoyez-moi la capture ou l’erreur exacte. »",
    "- Ne passez jamais à l’étape suivante avant validation de l’utilisateur.",
    "- Si une erreur survient, restez sur l’étape en cours : diagnostiquez, proposez un correctif, refaites le test.",
    "- N’inventez jamais une clé API, un identifiant, un token, une URL privée ou une permission.",
    "- Les secrets restent dans des variables d’environnement ou un gestionnaire de secrets, jamais dans le code partagé.",
    "- Utilisez les API officielles actuelles de Gmail / Google Workspace, Microsoft Graph, Shopify, WooCommerce, PrestaShop, CRM et fournisseur IA selon la configuration.",
    "- Si un accès manque, expliquez exactement où l’obtenir et ce qu’il autorise avant de continuer.",
    "- Pendant les tests : lecture seule quand possible, brouillons uniquement, aucune suppression, aucun remboursement, aucun envoi réel automatique.",
    "- Respectez les règles de validation humaine indiquées dans ce kit.",
    "",
    "PHASES À SUIVRE :",
    "PHASE 1 — Vérifier les accès et prérequis.",
    "PHASE 2 — Créer l’environnement de test et 5 à 10 cas représentatifs.",
    "PHASE 3 — Connecter la messagerie en lecture sur le périmètre TEST.",
    "PHASE 4 — Transformer un message en données structurées et vérifier le JSON.",
    "PHASE 5 — Connecter l’outil métier / e-commerce et récupérer les données utiles.",
    "PHASE 6 — Connecter Claude / ChatGPT via l’API adaptée et appliquer les règles métier.",
    "PHASE 7 — Créer un brouillon de réponse, sans envoi automatique.",
    "PHASE 8 — Ajouter CRM / journalisation, doublons, erreurs et reprise.",
    "PHASE 9 — Tester tous les cas limites du kit.",
    "PHASE 10 — Faire une revue sécurité / données / permissions et préparer le passage en production.",
    "",
    "À LA FIN :",
    "- exécutez un test de bout en bout ;",
    "- affichez un tableau PASS / FAIL pour chaque étape ;",
    "- listez ce qui reste manuel ;",
    "- donnez la checklist GO LIVE ;",
    "- demandez explicitement l’accord de l’utilisateur avant toute activation d’action réelle.",
    "",
    "## 0C. MANIFESTE MACHINE — à lire en priorité par l’IA",
    JSON.stringify({
      protocol: "AUTONOMIA_INSTALLER_V1",
      machine_id: MACHINE_ID,
      machine_name: MACHINE_NAME,
      machine_slug: MACHINE_SLUG,
      mail_provider: config.mailProvider,
      mail_access: config.mailAccess,
      business_tool: config.commerce,
      crm: config.crm,
      ai: config.ai,
      ai_api_access: config.apiAccess,
      volume: config.volume,
      actions: config.actions,
      human_review_rules: config.humanRules
    }, null, 2),
    "",
    "## 1. Votre configuration",
    "- Messagerie : " + label("mailProvider", config.mailProvider),
    "- Type d'accès : " + label("mailAccess", config.mailAccess),
    "- Outil e-commerce / métier : " + label("commerce", config.commerce),
    "- CRM / suivi : " + label("crm", config.crm),
    "- IA : " + label("ai", config.ai),
    "- Accès API IA : " + label("apiAccess", config.apiAccess),
    "- Volume : " + label("volume", config.volume),
    "",
    "## 2. Architecture",
    architecture(config),
    "",
    "## 3. Actions prévues",
    ...(selectedActions.length ? selectedActions : ["- À préciser"]),
    "",
    "## 4. Règles de validation humaine",
    ...(selectedRules.length ? selectedRules : ["- Toute action externe pendant les tests"]),
    "",
    "## 5. Plan de mise en place",
    "1. Créer un dossier ou label de TEST dans la messagerie.",
    "2. Y placer 5 à 10 e-mails représentatifs, avec le minimum de données nécessaires.",
    "3. Vérifier les droits de lecture de la boîte et les accès à " + label("commerce", config.commerce) + ".",
    "4. Configurer l'accès à " + label("ai", config.ai) + " sans exposer les secrets dans le code.",
    "5. Lire un e-mail et le transformer en JSON structuré.",
    "6. Chercher les informations métier nécessaires.",
    "7. Appliquer les règles déterministes avant l'IA et après l'IA.",
    "8. Générer uniquement un BROUILLON de réponse.",
    "9. Journaliser le résultat, l'erreur éventuelle et la validation humaine.",
    "10. Tester les cas limites avant toute automatisation supplémentaire.",
    "",
    "## 6. Format de sortie conseillé",
    "{",
    '  "request_type": "string",',
    '  "order_number": "string|null",',
    '  "urgency": "low|medium|high",',
    '  "missing_information": [],',
    '  "recommended_action": "string",',
    '  "draft_reply": "string",',
    '  "human_review_required": true,',
    '  "reason_for_review": "string|null"',
    "}",
    "",
    "## 7. Script de départ",
    "~~~",
    starterScript(config),
    "~~~",
    "",
    "## 8. Prompt à copier dans Claude ou ChatGPT",
    "~~~text",
    buildPrompt(config),
    "~~~",
    "",
    "## 9. Tests minimum avant production",
    "- E-mail sans numéro de commande",
    "- Commande inexistante",
    "- Client très mécontent",
    "- Demande de remboursement",
    "- E-mail en double",
    "- Message très long ou ambigu",
    "- API métier indisponible",
    "- Réponse IA vide ou non structurée",
    "",
    "## 10. Mesures à suivre",
    "- Temps moyen avant / après",
    "- % de brouillons acceptés sans correction",
    "- % de cas escaladés",
    "- Erreurs d'identification de commande",
    "- Coût par traitement",
    "",
    "AUTONOMIA — TROUVER · CONSTRUIRE · FORMER",
    "https://build-autonomia.com",
    "https://calendly.com/deborah-build-autonomia/30min"
  ].join("\n");
}

export default function MachineBuilder() {
  const [config, setConfig] = useState({
    mailProvider: "gmail",
    mailAccess: "standard",
    commerce: "shopify",
    crm: "odoo",
    ai: "chatgpt",
    apiAccess: "unknown",
    volume: "medium",
    actions: [],
    humanRules: []
  });

  const [gateOpen, setGateOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [projectConsent, setProjectConsent] = useState(false);
  const [newsletterConsent, setNewsletterConsent] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const [emailDelivery, setEmailDelivery] = useState("idle");

  const kit = useMemo(() => buildKit(config), [config]);
  const prompt = useMemo(() => buildPrompt(config), [config]);

  function choose(key, value) {
    setConfig((current) => ({ ...current, [key]: value }));
  }

  async function unlockKit(event) {
    event.preventDefault();
    setError("");

    if (!email || !projectConsent) {
      setError("Renseignez votre e-mail et confirmez l’autorisation de recontact liée à ce kit.");
      return;
    }

    setStatus("sending");
    const now = new Date().toISOString();
    const domain = email.split("@")[1]?.split(".")[0] || "a-qualifier";

    const payload = {
      external_lead_id: crypto.randomUUID(),
      source_channel: "website",
      source_platform: "autonomia_public_site",
      received_at: now,
      first_name: firstName.trim() || "Lecteur kit",
      last_name: null,
      email,
      phone: null,
      company_name: domain,
      requested_service: "machine-builder",
      message: "Kit Machine #01 · " + MACHINE_NAME + " · " + architecture(config),
      desired_timeline: null,
      company_size: null,
      ...getClientAttribution(),
      form_id: "machine-builder-kit-gate",
      landing_page_topic: "AUTONOMIA Machine Builder — " + MACHINE_NAME,
      marketing_consent: Boolean(newsletterConsent),
      consent_timestamp: now,
      privacy_notice_version: "2026-10-09-machine-v1",
      consent_source: "machine-builder-kit-gate",
      project_contact_consent: true,
      newsletter_optin: Boolean(newsletterConsent),
      machine_context: { machine_id: MACHINE_ID, machine_name: MACHINE_NAME, machine_slug: MACHINE_SLUG, ...config, architecture: architecture(config) }
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("lead_failed");

      setUnlocked(true);
      setGateOpen(false);
      setStatus("sent");
      setEmailDelivery("sending");

      const emailResponse = await fetch("/api/machine-kit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName.trim() || null,
          machine_id: MACHINE_ID,
          machine_name: MACHINE_NAME,
          machine_slug: MACHINE_SLUG,
          kit_markdown: kit
        })
      });

      setEmailDelivery(emailResponse.ok ? "sent" : "failed");

      trackLeadConversion({ form_id: "machine-builder-kit-gate", mode: "machine-builder", requested_service: "machine-builder" });
      trackEvent("machine_kit_unlocked", {
        machine_id: MACHINE_ID,
        mail_provider: config.mailProvider,
        commerce: config.commerce,
        crm: config.crm,
        ai: config.ai,
        email_delivery: emailResponse.ok ? "sent" : "failed"
      });
    } catch {
      setStatus("error");
      setEmailDelivery("failed");
      setError("Le kit n’a pas pu être débloqué. Merci de réessayer.");
    }
  }

  async function sendKitEmail() {
    setEmailDelivery("sending");
    try {
      const response = await fetch("/api/machine-kit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: firstName.trim() || null,
          machine_id: MACHINE_ID,
          machine_name: MACHINE_NAME,
          machine_slug: MACHINE_SLUG,
          kit_markdown: kit
        })
      });
      setEmailDelivery(response.ok ? "sent" : "failed");
      trackEvent("machine_kit_email_retry", {
        machine_id: MACHINE_ID,
        result: response.ok ? "sent" : "failed"
      });
    } catch {
      setEmailDelivery("failed");
    }
  }

  function downloadKit() {
    const blob = new Blob([kit], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "AUTONOMIA-kit-machine-IA-sav-ecommerce.md";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    trackEvent("machine_kit_download", { machine_id: MACHINE_ID });
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    trackEvent("machine_prompt_copy", { machine_id: MACHINE_ID, ai: config.ai });
  }

  const OptionRow = ({ group, values }) => (
    <div className={styles.options}>
      {values.map((value) => (
        <button
          type="button"
          key={value}
          className={config[group] === value ? styles.optionActive : styles.option}
          onClick={() => choose(group, value)}
        >
          {label(group, value)}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>AUTONOMIA MACHINE BUILDER · #01</p>
          <h1>Automatisez votre SAV e-commerce avec l’IA, de l’e-mail au brouillon de réponse.</h1>
          <p className={styles.lead}>
            Configurez votre messagerie, votre outil e-commerce et vos règles de validation.
            AUTONOMIA génère ensuite le kit à uploader dans Claude ou ChatGPT pour construire la machine étape par étape.
          </p>
          <div className={styles.promise}>
            <span>15 min pour cadrer</span>
            <span>0 n8n / Make requis</span>
            <span>Validation humaine prévue</span>
          </div>
        </div>
        <div className={styles.heroMachine} aria-label="Schéma de la machine">
          <small>MACHINE #01</small>
          <strong>E-mail entrant</strong><i>→</i>
          <strong>Comprendre</strong><i>→</i>
          <strong>Vérifier</strong><i>→</i>
          <strong>Préparer</strong><i>→</i>
          <strong>Valider</strong>
        </div>
      </section>

      <section className={styles.builder}>
        <div className={styles.builderIntro}>
          <span>01 — CONFIGURATION</span>
          <h2>Dites-nous simplement avec quoi vous travaillez.</h2>
          <p>Le kit se construit à partir de vos réponses. Vous pourrez ensuite le télécharger et le donner tel quel à Claude ou ChatGPT.</p>
        </div>

        <div className={styles.questionGrid}>
          <article className={styles.card}>
            <span>01</span><h3>Votre boîte mail</h3>
            <OptionRow group="mailProvider" values={["gmail", "outlook", "other"]} />
          </article>
          <article className={styles.card}>
            <span>02</span><h3>Quel niveau d’accès avez-vous ?</h3>
            <OptionRow group="mailAccess" values={["standard", "shared", "admin", "unknown"]} />
          </article>
          <article className={styles.card}>
            <span>03</span><h3>Où sont les commandes / données métier ?</h3>
            <OptionRow group="commerce" values={["shopify", "woocommerce", "prestashop", "none", "other"]} />
          </article>
          <article className={styles.card}>
            <span>04</span><h3>Où suivez-vous le client ?</h3>
            <OptionRow group="crm" values={["odoo", "hubspot", "salesforce", "sheets", "none", "other"]} />
          </article>
          <article className={styles.card}>
            <span>05</span><h3>Avec quelle IA voulez-vous travailler ?</h3>
            <OptionRow group="ai" values={["chatgpt", "claude", "auto"]} />
          </article>
          <article className={styles.card}>
            <span>06</span><h3>Avez-vous déjà un accès API IA ?</h3>
            <OptionRow group="apiAccess" values={["yes", "no", "unknown"]} />
          </article>
          <article className={styles.card}>
            <span>07</span><h3>Quel volume traitez-vous ?</h3>
            <OptionRow group="volume" values={["low", "medium", "high"]} />
          </article>

          <article className={styles.cardWide}>
            <span>08</span><h3>Que doit faire la machine ?</h3>
            <p className={styles.selectionHelp}>Sélectionnez uniquement les actions que vous souhaitez automatiser. Aucune option n’est présélectionnée.</p>
            <div className={styles.checkGrid}>
              {ACTIONS.map(([id, text]) => (
                <label key={id} className={config.actions.includes(id) ? styles.checkActive : styles.check}>
                  <input type="checkbox" checked={config.actions.includes(id)} onChange={() => setConfig((current) => ({ ...current, actions: toggle(current.actions, id) }))} />
                  <b>{text}</b>
                </label>
              ))}
            </div>
          </article>

          <article className={styles.cardWide}>
            <span>09</span><h3>Quand voulez-vous garder un humain dans la boucle ?</h3>
            <p className={styles.selectionHelp}>Choisissez vos règles métier. Pendant la phase de test, le kit garde de toute façon les actions sensibles sous validation humaine.</p>
            <div className={styles.checkGrid}>
              {HUMAN_RULES.map(([id, text]) => (
                <label key={id} className={config.humanRules.includes(id) ? styles.checkActive : styles.check}>
                  <input type="checkbox" checked={config.humanRules.includes(id)} onChange={() => setConfig((current) => ({ ...current, humanRules: toggle(current.humanRules, id) }))} />
                  <b>{text}</b>
                </label>
              ))}
            </div>
          </article>
        </div>

        <div className={styles.preview}>
          <div>
            <span>VOTRE ARCHITECTURE</span>
            <p>{architecture(config)}</p>
          </div>
          <button
            type="button"
            disabled={!config.actions.length}
            onClick={() => {
              setGateOpen(true);
              setError("");
              trackEvent("machine_kit_gate_open", { machine_id: MACHINE_ID });
            }}
          >
            {config.actions.length ? "Générer mon kit personnalisé →" : "Choisissez au moins une action"}
          </button>
        </div>
      </section>

      {unlocked && (
        <section className={styles.result}>
          <div className={styles.resultHead}>
            <div>
              <span>02 — KIT DÉBLOQUÉ</span>
              <h2>Votre machine est cadrée.</h2>
              <p>Le plus simple : uploadez directement le fichier complet dans Claude ou ChatGPT et écrivez <b>START</b>. L’IA doit ensuite vous guider une étape à la fois jusqu’au test final.</p>
              {emailDelivery === "sending" && <p className={styles.deliveryNote}>Envoi du kit par e-mail en cours…</p>}
              {emailDelivery === "sent" && <p className={styles.deliverySuccess}>✓ Le kit a aussi été envoyé à {email}.</p>}
              {emailDelivery === "failed" && (
                <div className={styles.deliveryWarning}>
                  <span>Le téléchargement reste disponible ici. L’envoi par e-mail a rencontré un problème.</span>
                  <button type="button" onClick={sendKitEmail}>Réessayer l’envoi</button>
                </div>
              )}
            </div>
            <div className={styles.resultActions}>
              <button type="button" onClick={downloadKit}>Télécharger le kit .md ↓</button>
              <button type="button" className={styles.secondary} onClick={copyPrompt}>
                {copied ? "Prompt copié ✓" : "Ou copier uniquement le prompt"}
              </button>
            </div>
          </div>

          <div className={styles.resultGrid}>
            <article><small>ARCHITECTURE</small><p>{architecture(config)}</p></article>
            <article><small>GARDE-FOU</small><p>Lecture seule au départ, brouillons uniquement, validation humaine avant toute action sensible.</p></article>
            <article><small>PROCHAINE ÉTAPE</small><p>Créez un label / dossier test avec 5 à 10 messages représentatifs, puis lancez le prompt fourni.</p></article>
          </div>

          <pre className={styles.promptPreview}>{prompt}</pre>

          <div className={styles.buildCta}>
            <div>
              <span>VOUS PRÉFÉREZ QU’ON LA CONSTRUISE ?</span>
              <h3>AUTONOMIA BUILD peut reprendre exactement cette configuration.</h3>
            </div>
            <a href="https://calendly.com/deborah-build-autonomia/30min" target="_blank" rel="noreferrer">Parler de cette machine →</a>
          </div>
        </section>
      )}

      <section className={styles.nextMachines}>
        <div className={styles.nextMachinesHead}>
          <div>
            <span>PROCHAINES MACHINES</span>
            <h2>Elles arrivent au fur et à mesure.</h2>
          </div>
          <a href={LINKEDIN_FOLLOW_URL} target="_blank" rel="noreferrer">
            Suivre les prochaines machines sur LinkedIn ↗
          </a>
        </div>
        <div>
          {MACHINE_BUILDERS.filter((machine) => machine.slug !== MACHINE_SLUG).map((machine) =>
            machine.status === "available" ? (
              <Link className={styles.availableMachine} href={machineBuilderHref(machine)} key={machine.id}>
                <div><b>#{machine.id}</b><em>Disponible</em></div>
                <strong>{machine.shortTitle || machine.title}</strong>
              </Link>
            ) : (
              <article className={styles.comingMachine} key={machine.id} aria-disabled="true">
                <div><b>#{machine.id}</b><em>À venir</em></div>
                <strong>{machine.shortTitle || machine.title}</strong>
              </article>
            )
          )}
        </div>
        <p className={styles.newsletterHint}>
          Dès que la newsletter <b>AUTONOMIA — L’IA, concrètement.</b> est ouverte, ce bouton pointera directement vers l’abonnement.
        </p>
      </section>

      {gateOpen && (
        <div className={styles.modalBackdrop} role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setGateOpen(false);
        }}>
          <div className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="machine-gate-title">
            <button type="button" className={styles.modalClose} onClick={() => setGateOpen(false)} aria-label="Fermer">×</button>
            <span>VOTRE KIT EST PRÊT</span>
            <h2 id="machine-gate-title">Débloquez votre kit AUTONOMIA.</h2>
            <p>Nous enregistrons votre configuration pour vous permettre de la reprendre avec AUTONOMIA si vous le souhaitez.</p>

            <form onSubmit={unlockKit}>
              <label>
                <span>Prénom <small>(facultatif)</small></span>
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" />
              </label>
              <label>
                <span>E-mail professionnel *</span>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="vous@entreprise.fr" />
              </label>

              <label className={styles.consent}>
                <input type="checkbox" checked={projectConsent} onChange={(e) => setProjectConsent(e.target.checked)} />
                <span>J’accepte qu’AUTONOMIA utilise mon e-mail et ma configuration pour générer mon kit et me recontacter au sujet de cette machine. *</span>
              </label>

              <label className={styles.consent}>
                <input type="checkbox" checked={newsletterConsent} onChange={(e) => setNewsletterConsent(e.target.checked)} />
                <span>Je souhaite aussi recevoir <b>AUTONOMIA — L’IA, concrètement.</b> et les ressources associées. Facultatif.</span>
              </label>

              <p className={styles.privacy}>
                Vos données sont traitées conformément à la <Link href="/politique-de-confidentialite">politique de confidentialité</Link>.
                Vous pouvez retirer votre consentement aux communications à tout moment.
              </p>

              {error && <p className={styles.error} role="alert">{error}</p>}

              <button type="submit" className={styles.unlock} disabled={status === "sending"}>
                {status === "sending" ? "Préparation…" : "Débloquer mon kit →"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
