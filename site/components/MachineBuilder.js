"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import styles from "./MachineBuilder.module.css";
import { getClientAttribution } from "@/lib/clientAttribution";
import { trackEvent, trackLeadConversion } from "@/lib/clientTracking";

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
    "TA MISSION",
    "1. Vérifie d'abord les accès et prérequis. Pose uniquement les questions indispensables.",
    "2. Donne-moi une étape à la fois et attends ma validation avant de poursuivre.",
    "3. Génère le code COMPLET correspondant à mon environnement avec les API officielles actuelles.",
    "4. Dis-moi exactement où créer chaque fichier, variable ou secret.",
    "5. Les clés API, mots de passe et tokens restent dans des variables d'environnement ou un gestionnaire de secrets.",
    "6. Commence en lecture seule sur un dossier / label de test.",
    "7. Les réponses sont d'abord créées en brouillon. Aucun envoi automatique avant validation explicite.",
    "8. Ajoute les logs, la gestion des erreurs, les doublons et les cas où une information manque.",
    "9. Donne-moi un test concret à exécuter à la fin de chaque étape.",
    "10. Quand le flux fonctionne, propose une checklist de passage en production.",
    "",
    "Commence par l'étape 1 : vérification des accès et prérequis."
  ].join("\n");
}

function buildKit(config) {
  const selectedActions = ACTIONS.filter(([id]) => config.actions.includes(id)).map(([, text]) => "- " + text);
  const selectedRules = HUMAN_RULES.filter(([id]) => config.humanRules.includes(id)).map(([, text]) => "- " + text);

  return [
    "# AUTONOMIA — KIT MACHINE IA",
    "Machine #01 · E-mails / SAV / demandes entrantes",
    "",
    "## 0. Comment utiliser ce kit",
    "Ce kit est une feuille de route opérationnelle à utiliser avec Claude ou ChatGPT.",
    "1. Ouvrez ce fichier .md dans votre navigateur, un éditeur de texte, Claude ou ChatGPT.",
    "2. Lisez d’abord les sections Configuration, Architecture et Règles de validation humaine.",
    "3. Copiez la section « Prompt à copier dans Claude ou ChatGPT » dans une nouvelle conversation.",
    "4. L’IA vous accompagne ensuite étape par étape : accès, code complet, emplacement des fichiers, tests et passage en production.",
    "5. Commencez toujours sur un dossier / label TEST et avec des brouillons. Activez les actions réelles seulement après validation.",
    "6. Le script fourni est un point de départ adapté à votre messagerie : l’IA doit le compléter avec vos accès et les API officielles de vos outils.",
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
    actions: ["classify", "order", "status", "draft", "crm"],
    humanRules: ["refund", "missing", "angry", "always_send"]
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
      message: "Kit Machine #01 · " + architecture(config),
      desired_timeline: null,
      company_size: null,
      ...getClientAttribution(),
      form_id: "machine-builder-kit-gate",
      landing_page_topic: "AUTONOMIA Machine Builder — Machine #01 e-mails",
      marketing_consent: Boolean(newsletterConsent),
      consent_timestamp: now,
      privacy_notice_version: "2026-10-09-machine-v1",
      consent_source: "machine-builder-kit-gate",
      project_contact_consent: true,
      newsletter_optin: Boolean(newsletterConsent),
      machine_context: { machine_id: "email-sav-01", ...config, architecture: architecture(config) }
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
          machine_id: "email-sav-01",
          kit_markdown: kit
        })
      });

      setEmailDelivery(emailResponse.ok ? "sent" : "failed");

      trackLeadConversion({ form_id: "machine-builder-kit-gate", mode: "machine-builder", requested_service: "machine-builder" });
      trackEvent("machine_kit_unlocked", {
        machine_id: "email-sav-01",
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

  function downloadKit() {
    const blob = new Blob([kit], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "AUTONOMIA-kit-machine-IA-email.md";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    trackEvent("machine_kit_download", { machine_id: "email-sav-01" });
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    trackEvent("machine_prompt_copy", { machine_id: "email-sav-01", ai: config.ai });
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
          <h1>Construisez votre machine IA à partir de votre environnement réel.</h1>
          <p className={styles.lead}>
            Répondez à quelques questions. AUTONOMIA génère votre architecture, votre plan de mise en place,
            un script de départ et le brief exact à donner à Claude ou ChatGPT.
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
          <button type="button" onClick={() => {
            setGateOpen(true);
            setError("");
            trackEvent("machine_kit_gate_open", { machine_id: "email-sav-01" });
          }}>
            Générer mon kit personnalisé →
          </button>
        </div>
      </section>

      {unlocked && (
        <section className={styles.result}>
          <div className={styles.resultHead}>
            <div>
              <span>02 — KIT DÉBLOQUÉ</span>
              <h2>Votre machine est cadrée.</h2>
              <p>Gardez le fichier comme feuille de route, puis copiez le prompt dans Claude ou ChatGPT pour construire la machine étape par étape.</p>
              {emailDelivery === "sending" && <p className={styles.deliveryNote}>Envoi du kit par e-mail en cours…</p>}
              {emailDelivery === "sent" && <p className={styles.deliverySuccess}>✓ Le kit a aussi été envoyé à {email}.</p>}
              {emailDelivery === "failed" && <p className={styles.deliveryWarning}>Le téléchargement reste disponible ici. L’envoi par e-mail a rencontré un problème.</p>}
            </div>
            <div className={styles.resultActions}>
              <button type="button" onClick={downloadKit}>Télécharger le kit .md ↓</button>
              <button type="button" className={styles.secondary} onClick={copyPrompt}>
                {copied ? "Prompt copié ✓" : "Copier le prompt Claude / ChatGPT"}
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
        <span>PROCHAINES MACHINES</span>
        <div>
          <article><b>#02</b><strong>Réunion → compte rendu → plan d’action</strong></article>
          <article><b>#03</b><strong>Boîte mail → détection des prospects</strong></article>
          <article><b>#04</b><strong>Documents → analyse de contrats</strong></article>
          <article><b>#05</b><strong>Drive → assistant documentaire</strong></article>
        </div>
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
