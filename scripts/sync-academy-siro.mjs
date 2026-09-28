import { createClient } from "@supabase/supabase-js";

const DATASET_API = "https://www.data.gouv.fr/api/1/datasets/table-siret-opco/";
const BATCH_SIZE = 1000;

function needEnv(name, fallback) {
  const value = process.env[name] || (fallback ? process.env[fallback] : "");
  if (!value) throw new Error(`Missing environment variable ${name}`);
  return value;
}

function normalize(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "");
}

function digits(value, max) {
  return String(value || "").replace(/\D/g, "").slice(0, max);
}

function opcoCode(value) {
  const n = normalize(value);
  if (!n) return null;
  if (n.includes("AFDAS")) return "AFDAS";
  if (n.includes("AKTO")) return "AKTO";
  if (n.includes("ATLAS")) return "ATLAS";
  if (n.includes("CONSTRUCTYS")) return "CONSTRUCTYS";
  if (n.includes("OPCOMMERCE") || n.includes("OPCOCOMMERCE")) return "OPCOMMERCE";
  if (n.includes("OCAPIAT")) return "OCAPIAT";
  if (n.includes("OPCO2I") || n === "2I") return "OPCO2I";
  if (n.includes("ENTREPRISESDEPROXIMITE") || n.includes("OPCOEP")) return "OPCOEP";
  if (n.includes("MOBILITES") || n.includes("OPCOMOBILITES")) return "OPCOMOBILITES";
  if (n.includes("SANTE") || n.includes("OPCOSANTE")) return "OPCOSANTE";
  if (n.includes("UNIFORMATION")) return "UNIFORMATION";
  return n.slice(0, 64);
}

function parseCsvLine(line, delimiter) {
  const out = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        field += '"';
        i += 1;
      } else {
        quoted = !quoted;
      }
    } else if (ch === delimiter && !quoted) {
      out.push(field);
      field = "";
    } else {
      field += ch;
    }
  }
  out.push(field);
  return out;
}

function detectDelimiter(line) {
  const candidates = ["|", ";", ",", "\t"];
  let best = ";";
  let score = -1;
  for (const candidate of candidates) {
    const count = line.split(candidate).length - 1;
    if (count > score) {
      score = count;
      best = candidate;
    }
  }
  return best;
}

async function getHeaderAndReader(response) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let text = "";
  while (!text.includes("\n")) {
    const { value, done } = await reader.read();
    if (done) break;
    text += decoder.decode(value, { stream: true });
  }

  const newline = text.indexOf("\n");
  const rawHeaderText = (newline >= 0 ? text.slice(0, newline) : text).replace(/^\uFEFF/, "").replace(/\r$/, "");
  const headerText =
    rawHeaderText.startsWith('"') && rawHeaderText.endsWith('"') && rawHeaderText.includes("|")
      ? rawHeaderText.slice(1, -1).replace(/""/g, '"')
      : rawHeaderText;
  const remainder = newline >= 0 ? text.slice(newline + 1) : "";
  const delimiter = detectDelimiter(headerText);
  const headers = parseCsvLine(headerText, delimiter).map((v) => String(v || "").trim());

  async function* chunks() {
    if (remainder) yield remainder;
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      yield decoder.decode(value, { stream: true });
    }
    const tail = decoder.decode();
    if (tail) yield tail;
  }

  return { headers, delimiter, chunks: chunks() };
}

async function* parseRecords(chunks, delimiter) {
  let row = [];
  let field = "";
  let quoted = false;
  let pendingQuote = false;

  for await (const chunk of chunks) {
    for (let i = 0; i < chunk.length; i += 1) {
      const ch = chunk[i];

      if (pendingQuote) {
        if (ch === '"') {
          field += '"';
          pendingQuote = false;
          continue;
        }
        quoted = false;
        pendingQuote = false;
      }

      if (ch === '"') {
        if (quoted) {
          if (i + 1 < chunk.length) {
            if (chunk[i + 1] === '"') {
              field += '"';
              i += 1;
            } else {
              quoted = false;
            }
          } else {
            pendingQuote = true;
          }
        } else if (field.length === 0) {
          quoted = true;
        } else {
          field += ch;
        }
        continue;
      }

      if (ch === delimiter && !quoted) {
        row.push(field);
        field = "";
        continue;
      }

      if ((ch === "\n" || ch === "\r") && !quoted) {
        if (ch === "\r" && chunk[i + 1] === "\n") i += 1;
        row.push(field);
        field = "";
        if (row.some((value) => value !== "")) yield row;
        row = [];
        continue;
      }

      field += ch;
    }
  }

  if (pendingQuote) quoted = false;
  if (field.length || row.length) {
    row.push(field);
    if (row.some((value) => value !== "")) yield row;
  }
}

function columnIndex(headers, matchers) {
  const normalized = headers.map(normalize);
  for (const matcher of matchers) {
    const idx = normalized.findIndex((value) => matcher(value));
    if (idx >= 0) return idx;
  }
  return -1;
}

async function main() {
  const supabaseUrl = needEnv("SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");
  const supabaseKey = needEnv("SUPABASE_SECRET_KEY");
  const db = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  const metaResponse = await fetch(DATASET_API, { headers: { accept: "application/json" } });
  if (!metaResponse.ok) throw new Error(`SIRO metadata HTTP ${metaResponse.status}`);
  const dataset = await metaResponse.json();
  const resource = (dataset.resources || []).find((item) =>
    String(item.format || "").toLowerCase() === "csv" && item.type === "main"
  ) || (dataset.resources || []).find((item) => String(item.format || "").toLowerCase() === "csv");

  if (!resource?.url) throw new Error("No SIRO CSV resource found");

  const syncToken = `${resource.id || "siro"}:${resource.last_modified || dataset.last_update || Date.now()}`;

  const { data: running } = await db
    .from("academy_sync_runs")
    .select("id,started_at")
    .eq("source", "SIRO")
    .eq("status", "running")
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (running?.started_at && Date.now() - new Date(running.started_at).getTime() < 2 * 60 * 60 * 1000) {
    console.log(JSON.stringify({ ok: true, skipped: "sync_already_running", run_id: running.id }));
    return;
  }

  const { data: run, error: runError } = await db
    .from("academy_sync_runs")
    .insert({
      source: "SIRO",
      status: "running",
      resource_id: resource.id || null,
      file_name: resource.title || null,
      source_updated_at: resource.last_modified || dataset.last_update || null,
      metadata: { dataset_url: DATASET_API, resource_url: resource.url, sync_token: syncToken }
    })
    .select("id")
    .single();

  if (runError) throw runError;

  let seen = 0;
  let upserted = 0;

  try {
    const response = await fetch(resource.url, { headers: { accept: "text/csv,*/*" } });
    if (!response.ok || !response.body) throw new Error(`SIRO CSV HTTP ${response.status}`);

    const parsed = await getHeaderAndReader(response);
    const headers = parsed.headers;
    const siretIdx = columnIndex(headers, [
      (v) => v === "SIRET",
      (v) => v.includes("SIRET") && v.includes("ETABL")
    ]);
    const idccIdx = columnIndex(headers, [
      (v) => v === "IDCC",
      (v) => v.includes("IDCC")
    ]);
    const ownerIdx = columnIndex(headers, [
      (v) => v === "OPCOPROPRIETAIRE",
      (v) => v.includes("OPCO") && v.includes("PROPRIETAIRE"),
      (v) => v === "OPCO"
    ]);

    if (siretIdx < 0 || ownerIdx < 0) {
      throw new Error(`Unexpected SIRO headers: ${headers.join(" | ")}`);
    }

    const managementCols = headers
      .map((header, index) => ({ header, index, normalized: normalize(header) }))
      .filter((item) => item.normalized.includes("OPCOGESTION"));

    let batch = [];

    const upsertRows = async (rows) => {
      if (!rows.length) return;
      const { error } = await db
        .from("academy_siro")
        .upsert(rows, { onConflict: "siret", ignoreDuplicates: false });

      if (!error) {
        upserted += rows.length;
        return;
      }

      const message = String(error.message || error.details || error);
      const retryable = /statement timeout|timeout|canceling statement/i.test(message);
      if (retryable && rows.length > 100) {
        const middle = Math.ceil(rows.length / 2);
        await upsertRows(rows.slice(0, middle));
        await upsertRows(rows.slice(middle));
        return;
      }

      throw error;
    };

    const flush = async () => {
      if (!batch.length) return;
      const rows = batch;
      batch = [];
      await upsertRows(rows);

      if (upserted % 25000 < BATCH_SIZE) {
        await db
          .from("academy_sync_runs")
          .update({ rows_seen: seen, rows_upserted: upserted })
          .eq("id", run.id);
        console.log(JSON.stringify({ seen, upserted }));
      }
    };

    for await (const parsedRow of parseRecords(parsed.chunks, parsed.delimiter)) {
      seen += 1;
      const row =
        parsedRow.length === 1 && String(parsedRow[0] || "").includes(parsed.delimiter)
          ? parseCsvLine(String(parsedRow[0] || ""), parsed.delimiter)
          : parsedRow;
      const siret = digits(row[siretIdx], 14);
      if (siret.length !== 14) continue;

      const owner = String(row[ownerIdx] || "").trim();
      const management = {};
      for (const item of managementCols) {
        const value = String(row[item.index] || "").trim();
        if (value) management[item.header] = value;
      }

      batch.push({
        siret,
        opco_code: opcoCode(owner),
        opco_name: owner || null,
        idcc: idccIdx >= 0 ? String(row[idccIdx] || "").trim() || null : null,
        management_json: management,
        source_resource_id: resource.id || null,
        source_file_name: resource.title || null,
        source_updated_at: resource.last_modified || dataset.last_update || null,
        sync_token: syncToken,
        imported_at: new Date().toISOString()
      });

      if (batch.length >= BATCH_SIZE) await flush();
    }

    await flush();

    const { error: cleanupError } = await db
      .from("academy_siro")
      .delete()
      .neq("sync_token", syncToken);
    if (cleanupError) throw cleanupError;

    const { error: finishError } = await db
      .from("academy_sync_runs")
      .update({
        status: "completed",
        rows_seen: seen,
        rows_upserted: upserted,
        finished_at: new Date().toISOString(),
        metadata: {
          dataset_url: DATASET_API,
          resource_url: resource.url,
          sync_token: syncToken,
          delimiter: parsed.delimiter === "\t" ? "TAB" : parsed.delimiter,
          headers
        }
      })
      .eq("id", run.id);
    if (finishError) throw finishError;

    console.log(JSON.stringify({ ok: true, run_id: run.id, seen, upserted, file: resource.title }));
  } catch (error) {
    await db
      .from("academy_sync_runs")
      .update({
        status: "failed",
        rows_seen: seen,
        rows_upserted: upserted,
        finished_at: new Date().toISOString(),
        error_message: error?.message || String(error)
      })
      .eq("id", run.id);
    throw error;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
