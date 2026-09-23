function clean(value, max = 1000) {
  return String(value || "").trim().slice(0, max);
}

function slug(value) {
  return clean(value, 240)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function numberOrNull(value) {
  const normalized = clean(value, 60)
    .replace(/\s/g, "")
    .replace(",", ".")
    .replace(/[^0-9.+-]/g, "");
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function booleanValue(value) {
  return /^(1|true|yes|oui|y|o|remote|hybride)$/i.test(clean(value, 40));
}

function dateValue(value) {
  const input = clean(value, 40);
  if (!input) return null;

  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;

  const french = input.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
  if (french) {
    const [, d, m, y] = french;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }

  return null;
}

function listValue(value) {
  return [...new Set(
    clean(value, 3000)
      .split(/[|,]/)
      .map((item) => item.trim())
      .filter(Boolean)
  )];
}

function isHeader(row = []) {
  return /^(nom|name|consultant|display.?name)$/i.test(clean(row[0], 80));
}

export function parseConsultantImportText(input, { maxRows = 200 } = {}) {
  const raw = String(input || "").trim();
  if (!raw) return [];

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, Math.max(1, Number(maxRows) || 200) + 1);

  const separator = lines.some((line) => line.includes(";")) ? ";" : "\t";
  const rows = lines.map((line) => line.split(separator).map((cell) => cell.trim()));
  const dataRows = rows.length && isHeader(rows[0]) ? rows.slice(1) : rows;

  return dataRows
    .map((row, index) => {
      const displayName = clean(row[0], 240);
      if (!displayName) return null;

      const skillNames = listValue(row[1]);
      const externalRef = "manual:" + slug(displayName);

      return {
        line_number: index + 1,
        external_ref: externalRef,
        display_name: displayName,
        status: "active",
        skills: skillNames,
        tjm: numberOrNull(row[2]),
        available_from: dateValue(row[3]),
        remote: booleanValue(row[4]),
        locations: listValue(row[5]),
        years_experience: numberOrNull(row[6]),
        notes: clean(row[7], 3000) || null
      };
    })
    .filter(Boolean);
}

export function consultantImportTemplate() {
  return [
    "Nom;Compétences;TJM;Disponible le;Remote;Localisations;Expérience;Notes",
    "Jane Doe;LangGraph,RAG,Python;750;01/10/2026;oui;Paris,Remote;8;Lead AI / Agentic",
    "John Doe;Copilot,Formation IA,Change;650;2026-09-25;oui;Lyon,Remote;10;Formateur senior"
  ].join("\n");
}
