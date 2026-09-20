const TAXONOMY = Object.freeze({
  roles: [
    ["ai_project_manager", "AI Project Manager", /\b(ai|ia)\s+(project|program|programme)\s+manager\b|\bchef(?:fe)?\s+de\s+projet\s+(ia|ai)\b/i],
    ["ai_product_manager", "AI Product Manager", /\b(ai|ia)\s+product\s+manager\b|\bproduct\s+manager\s+(ai|ia)\b/i],
    ["genai_engineer", "GenAI Engineer", /\b(genai|generative\s+ai|ia\s+g[eé]n[eé]rative)\b.{0,30}\b(engineer|ing[eé]nieur)/i],
    ["llm_engineer", "LLM Engineer", /\bllm\b.{0,25}\b(engineer|ing[eé]nieur)|\b(engineer|ing[eé]nieur)\b.{0,25}\bllm\b/i],
    ["rag_engineer", "RAG Engineer", /\brag\b.{0,25}\b(engineer|ing[eé]nieur)|\b(engineer|ing[eé]nieur)\b.{0,25}\brag\b/i],
    ["agentic_ai_engineer", "Agentic AI Engineer", /\b(agentic\s+ai|agentic\s+automation|ai\s+agent|agents?\s+ia)\b.{0,35}\b(engineer|lead|architect|ing[eé]nieur)/i],
    ["ai_automation_engineer", "AI & Automation Engineer", /\b(ai|ia)\b.{0,20}\bautomation\b.{0,25}\b(engineer|ing[eé]nieur)|\bautomation\b.{0,20}\b(ai|ia)\b/i],
    ["ml_engineer", "ML Engineer", /\b(machine\s+learning|ml)\s+(engineer|ing[eé]nieur)\b/i],
    ["data_scientist", "Data Scientist", /\bdata\s+scientist\b/i],
    ["mlops_llmops", "MLOps / LLMOps", /\bmlops\b|\bllmops\b/i],
    ["ai_governance", "AI Governance / Responsible AI", /\b(responsible\s+ai|ai\s+governance|gouvernance\s+(ia|ai)|ai\s+act)\b/i]
  ],
  tools: [
    ["n8n", "n8n", /\bn8n\b/i],
    ["make", "Make", /\bmake(?:\.com)?\b/i],
    ["power_platform", "Microsoft Power Platform", /\bpower\s+(platform|automate|apps)\b/i],
    ["copilot", "Microsoft Copilot", /\bmicrosoft\s+copilot\b|\bcopilot\s+studio\b/i],
    ["openai", "OpenAI", /\bopenai\b|\bchatgpt\b/i],
    ["mistral", "Mistral AI", /\bmistral\b/i],
    ["anthropic", "Anthropic / Claude", /\banthropic\b|\bclaude\b/i],
    ["azure_openai", "Azure OpenAI", /\bazure\s+openai\b/i],
    ["aws_bedrock", "AWS Bedrock", /\bbedrock\b/i],
    ["vertex_ai", "Google Vertex AI", /\bvertex\s+ai\b/i],
    ["langchain", "LangChain", /\blangchain\b/i],
    ["langgraph", "LangGraph", /\blanggraph\b/i],
    ["llamaindex", "LlamaIndex", /\bllamaindex\b/i],
    ["databricks", "Databricks", /\bdatabricks\b/i],
    ["dataiku", "Dataiku", /\bdataiku\b/i]
  ],
  skills: [
    ["genai", "IA générative / GenAI", /\bgenai\b|\bgenerative\s+ai\b|\bia\s+g[eé]n[eé]rative\b/i],
    ["llm", "LLM", /\bllms?\b|\blarge\s+language\s+model/i],
    ["rag", "RAG", /\brag\b|retrieval[- ]augmented/i],
    ["agents", "Agents IA", /\bagentic\b|\bagents?\s+(ia|ai)\b|\bai\s+agents?\b/i],
    ["workflow_orchestration", "Orchestration de workflows", /\bworkflow\b|\borchestrat(?:ion|eur|or)\b/i],
    ["automation", "Automatisation", /\bautomation\b|\bautomatisation\b|\brpa\b/i],
    ["api_integration", "Intégration API / SI", /\bapi\b|\bint[eé]gration\b.{0,30}\b(syst[eè]me|si|application|outil)/i],
    ["evaluation", "Évaluation de systèmes IA", /\bevaluation\b|\b[eé]valuation\b|\bbenchmark\b.{0,30}\b(llm|model|mod[eè]le)/i],
    ["guardrails", "Guardrails / sécurité LLM", /\bguardrails?\b|\bprompt\s+injection\b|\bhallucination/i],
    ["observability", "Observabilité / supervision", /\bobservabilit[eé]\b|\bsupervision\b|\bjournalisation\b|\blogging\b/i],
    ["human_in_loop", "Human-in-the-loop", /\bhuman[- ]in[- ]the[- ]loop\b|\bvalidation\s+humaine\b|\bsupervision\s+humaine\b/i],
    ["prompt_engineering", "Prompt engineering", /\bprompt\s+engineering\b|\bprompting\b/i],
    ["vector_search", "Recherche vectorielle / embeddings", /\bvector\s+(search|database|db)\b|\bembeddings?\b|\brecherche\s+vectorielle\b/i],
    ["governance", "Gouvernance IA", /\bgouvernance\s+(ia|ai)\b|\bai\s+governance\b|\bresponsible\s+ai\b/i],
    ["change_adoption", "Adoption / conduite du changement", /\badoption\b|\bchange\s+management\b|\bconduite\s+du\s+changement\b/i]
  ],
  useCases: [
    ["knowledge_management", "Knowledge management / base de connaissances", /\bknowledge\s+(base|management)\b|\bbase\s+de\s+connaissances\b|\bknowledge\s+assistant/i],
    ["document_processing", "Traitement de documents", /\bdocument\b.{0,30}\b(extract|classif|analyse|processing|traitement)|\bocr\b/i],
    ["customer_support", "Support / service client", /\b(customer\s+support|service\s+client|support\s+client|ticketing)\b/i],
    ["sales_automation", "Automatisation commerciale / RevOps", /\b(revops|sales\s+automation|automatisation\s+commerciale|crm)\b/i],
    ["marketing_content", "Marketing / contenu", /\b(marketing|content|contenu)\b.{0,35}\b(ai|ia|automation|automatisation)/i],
    ["hr_recruiting", "RH / recrutement", /\b(recrutement|recruitment|talent|rh|human\s+resources)\b.{0,40}\b(ai|ia|automation)/i],
    ["finance_ops", "Finance / opérations", /\b(finance|comptabilit[eé]|factur|invoice)\b.{0,40}\b(ai|ia|automation|automatisation)/i],
    ["reporting_analytics", "Reporting / analyse", /\b(reporting|analytics|analyse\s+de\s+donn[eé]es|dashboard)\b/i],
    ["messaging_collaboration", "Messagerie / collaboration", /\b(messagerie|email|e-mail|gmail|outlook|teams|slack)\b/i],
    ["files_documents", "Fichiers / GED / Drive", /\b(google\s+drive|sharepoint|ged|fichiers?|files?|documents?)\b/i],
    ["field_operations", "Opérations terrain", /\b(field\s+operations|op[eé]rations\s+terrain|maintenance|infrastructure)\b/i],
    ["process_integration", "Intégration de processus métier", /\bprocess(?:us)?\s+m[eé]tier\b|\bbusiness\s+process\b|\bprocess\s+automation\b/i]
  ]
});

export const JOB_SIGNAL_LABELS = Object.freeze(
  Object.fromEntries(
    Object.values(TAXONOMY)
      .flat()
      .map(([key, label]) => [key, label])
  )
);

function cleanText(value) {
  return String(value ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function matches(items, text) {
  return items
    .filter(([, , pattern]) => pattern.test(text))
    .map(([key]) => key);
}

export function extractJobContentSignals(job = {}) {
  const competenceText = Array.isArray(job.competences)
    ? job.competences.map((item) => item?.libelle || item?.label || item).join(" ")
    : "";

  const text = cleanText([
    job.title,
    job.intitule,
    job.description,
    competenceText,
    job.experienceLabel,
    job.experienceLibelle,
    job.contractType,
    job.typeContrat,
    job.companyName
  ].filter(Boolean).join(" "));

  const roles = matches(TAXONOMY.roles, text);
  const tools = matches(TAXONOMY.tools, text);
  const skills = matches(TAXONOMY.skills, text);
  const useCases = matches(TAXONOMY.useCases, text);

  const anchors = /\b(artificial intelligence|intelligence artificielle|\bia\b|\bai\b|genai|llm|machine learning|mlops|rag|agentic|copilot|n8n|power platform)\b/i;
  const signalKeys = [...new Set([...roles, ...tools, ...skills, ...useCases])];

  return {
    roles,
    tools,
    skills,
    useCases,
    signalKeys,
    isAiRelevant: anchors.test(text) && signalKeys.length > 0
  };
}

export function labelsFor(keys = []) {
  return keys.map((key) => ({
    key,
    label: JOB_SIGNAL_LABELS[key] || key
  }));
}
