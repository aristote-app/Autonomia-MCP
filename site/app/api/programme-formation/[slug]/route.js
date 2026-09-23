import { NextResponse } from "next/server";
import {
  getAcademyTraining,
  getAcademyTrainingStaticParams,
  trainingPrice
} from "@/content/academy-trainings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getAcademyTrainingStaticParams();
}

function clean(value = "") {
  return String(value)
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("œ", "oe")
    .replaceAll("Œ", "OE")
    .replaceAll("€", "EUR")
    .replaceAll("…", "...")
    .replace(/[^\x09\x0A\x0D\x20-\xFF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function esc(value = "") {
  return clean(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}

function wrap(text, max = 78) {
  const words = clean(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (next.length <= max) line = next;
    else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function text(lines, {
  x = 42,
  y = 760,
  size = 11,
  leading = 15,
  bold = false,
  color = "0.09 0.12 0.19"
} = {}) {
  const font = bold ? "/F2" : "/F1";
  const out = ["BT", color + " rg", font + " " + size + " Tf", "1 0 0 1 " + x + " " + y + " Tm"];
  lines.forEach((line, index) => {
    if (index) out.push("0 -" + leading + " Td");
    out.push("(" + esc(line) + ") Tj");
  });
  out.push("ET");
  return out.join("\n");
}

function logo(x = 42, y = 790) {
  const s = 11, g = 4;
  const pts = [
    [0,0],[s+g,0],
    [0,-s-g],[s+g,-s-g],[2*(s+g),-s-g],
    [0,-2*(s+g)],[s+g,-2*(s+g)],[2*(s+g),-2*(s+g)]
  ];
  return [
    "0.05 0.05 0.05 rg",
    ...pts.map(([dx,dy]) => (x+dx) + " " + (y+dy) + " " + s + " " + s + " re f"),
    "1 0.78 0.34 rg",
    (x+2*(s+g)+3) + " " + (y+11) + " " + s + " " + s + " re f"
  ].join("\n");
}

function makePdf(pages) {
  const objects = [];
  const add = (body) => {
    objects.push(body);
    return objects.length;
  };

  const catalogId = add("");
  const pagesId = add("");
  const fontRegular = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const fontBold = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");

  const pageIds = [];

  for (const commands of pages) {
    const stream = Buffer.from(commands, "latin1");
    const contentId = add(Buffer.concat([
      Buffer.from("<< /Length " + stream.length + " >>\nstream\n", "latin1"),
      stream,
      Buffer.from("\nendstream", "latin1")
    ]));
    const pageId = add(
      "<< /Type /Page /Parent " + pagesId + " 0 R " +
      "/MediaBox [0 0 595 842] " +
      "/Resources << /Font << /F1 " + fontRegular + " 0 R /F2 " + fontBold + " 0 R >> >> " +
      "/Contents " + contentId + " 0 R >>"
    );
    pageIds.push(pageId);
  }

  objects[catalogId - 1] = "<< /Type /Catalog /Pages " + pagesId + " 0 R >>";
  objects[pagesId - 1] = "<< /Type /Pages /Kids [" + pageIds.map((id) => id + " 0 R").join(" ") + "] /Count " + pageIds.length + " >>";

  const chunks = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "latin1")];
  const offsets = [0];
  let offset = chunks[0].length;

  objects.forEach((body, index) => {
    offsets.push(offset);
    const prefix = Buffer.from((index + 1) + " 0 obj\n", "latin1");
    const payload = Buffer.isBuffer(body) ? body : Buffer.from(body, "latin1");
    const suffix = Buffer.from("\nendobj\n", "latin1");
    chunks.push(prefix, payload, suffix);
    offset += prefix.length + payload.length + suffix.length;
  });

  const xrefOffset = offset;
  const xref = [
    "xref",
    "0 " + (objects.length + 1),
    "0000000000 65535 f ",
    ...offsets.slice(1).map((value) => String(value).padStart(10, "0") + " 00000 n "),
    "trailer",
    "<< /Size " + (objects.length + 1) + " /Root " + catalogId + " 0 R >>",
    "startxref",
    String(xrefOffset),
    "%%EOF"
  ].join("\n");

  chunks.push(Buffer.from(xref, "latin1"));
  return Buffer.concat(chunks);
}

function coverPage(training) {
  const duration = training.standardDays + " jours - " + (training.standardDays * 7) + " heures";
  return [
    "0.09 0.12 0.19 rg 0 0 595 842 re f",
    logo(42, 793),
    text(["AUTONOMIA"], { x:105, y:797, size:16, bold:true, color:"1 1 1" }),
    text(["ACADEMY"], { x:105, y:777, size:9, bold:true, color:"1 0.78 0.34" }),
    text(["PROGRAMME DE FORMATION"], { x:42, y:690, size:10, bold:true, color:"1 0.78 0.34" }),
    text(wrap(training.title, 34), { x:42, y:646, size:29, leading:33, bold:true, color:"1 1 1" }),
    text(wrap(training.subtitle, 74), { x:42, y:525, size:13, leading:19, color:"0.86 0.88 0.92" }),
    "0.13 0.17 0.26 rg 42 304 511 128 re f",
    text(["FORMAT RECOMMANDE"], { x:60, y:402, size:9, bold:true, color:"1 0.78 0.34" }),
    text([duration], { x:60, y:374, size:20, bold:true, color:"1 1 1" }),
    text(["Presentiel ou distanciel - Intra ou inter-entreprises"], { x:60, y:348, size:10, color:"0.86 0.88 0.92" }),
    text(["Intra : 1 800 EUR HT / jour / groupe"], { x:60, y:326, size:10, bold:true, color:"1 1 1" }),
    text(["Inter : 990 EUR HT / jour / participant"], { x:300, y:326, size:9, color:"0.86 0.88 0.92" }),
    text(["Initiation " + training.introDays + " j  |  Operationnel " + training.standardDays + " j  |  Expert " + training.expertDays + " j"], { x:42, y:242, size:11, bold:true, color:"1 0.78 0.34" }),
    text(["build-autonomia.com"], { x:42, y:48, size:9, color:"0.65 0.68 0.74" })
  ].join("\n");
}

function essentialsPage(training) {
  let y = 775;
  const c = [
    "0.97 0.96 0.94 rg 0 0 595 842 re f",
    text(["AUTONOMIA ACADEMY  |  PROGRAMME"], { x:42, y:806, size:9, bold:true, color:"0.09 0.12 0.19" }),
    text(["01 - L'ESSENTIEL"], { x:42, y, size:10, bold:true, color:"0.10 0.46 0.43" })
  ];
  y -= 34;
  c.push(text(wrap("Public, prerequis et objectifs pedagogiques", 46), { x:42, y, size:24, leading:28, bold:true }));
  y -= 84;
  c.push(text(["PUBLIC VISE"], { x:42, y, size:9, bold:true, color:"0.10 0.46 0.43" }));
  y -= 20;
  training.audience.forEach((item) => { c.push(text(wrap("- " + item, 58), { x:42, y, size:10, leading:14 })); y -= 32; });
  y -= 8;
  c.push(text(["PREREQUIS"], { x:42, y, size:9, bold:true, color:"0.10 0.46 0.43" }));
  y -= 20;
  training.prerequisites.forEach((item) => { c.push(text(wrap("- " + item, 58), { x:42, y, size:10, leading:14 })); y -= 32; });
  y -= 6;
  c.push(text(["OBJECTIFS PEDAGOGIQUES"], { x:42, y, size:9, bold:true, color:"0.10 0.46 0.43" }));
  y -= 20;
  training.goals.slice(0, 6).forEach((item) => { c.push(text(wrap("- " + item, 82), { x:42, y, size:10, leading:14 })); y -= 32; });
  c.push(text(["build-autonomia.com"], { x:42, y:30, size:8, color:"0.40 0.43 0.48" }));
  return c.join("\n");
}

function dayPage(training, day, index) {
  let y = 775;
  const c = [
    "1 1 1 rg 0 0 595 842 re f",
    text(["AUTONOMIA ACADEMY  |  " + training.title], { x:42, y:806, size:8, bold:true, color:"0.09 0.12 0.19" }),
    text([String(index + 2).padStart(2, "0") + " - PROGRAMME DETAILLE"], { x:42, y, size:10, bold:true, color:"0.10 0.46 0.43" })
  ];
  y -= 34;
  c.push(text(wrap(day.title, 48), { x:42, y, size:23, leading:27, bold:true }));
  y -= 88;
  day.modules.forEach((item) => {
    c.push("1 0.78 0.34 rg 42 " + (y + 4) + " 6 6 re f");
    c.push(text(wrap(item, 72), { x:58, y, size:11, leading:15 }));
    y -= Math.max(34, wrap(item, 72).length * 15 + 14);
  });
  y -= 10;
  c.push("0.95 0.94 0.91 rg 42 " + (y - 128) + " 511 128 re f");
  c.push(text(["ATELIER"], { x:60, y: y - 25, size:9, bold:true, color:"0.10 0.46 0.43" }));
  c.push(text(wrap(day.workshop, 70), { x:60, y: y - 46, size:10, leading:14 }));
  c.push(text(["LIVRABLE"], { x:60, y: y - 84, size:9, bold:true, color:"0.10 0.46 0.43" }));
  c.push(text(wrap(day.deliverable, 70), { x:60, y: y - 105, size:10, leading:14 }));
  c.push(text(["build-autonomia.com"], { x:42, y:30, size:8, color:"0.40 0.43 0.48" }));
  return c.join("\n");
}

function finalPage(training) {
  const intra = trainingPrice(training.standardDays, "intra");
  const inter = trainingPrice(training.standardDays, "inter");
  return [
    "0.97 0.96 0.94 rg 0 0 595 842 re f",
    text(["AUTONOMIA ACADEMY  |  MODALITES & TARIFS"], { x:42, y:806, size:9, bold:true }),
    text(["MODALITES PEDAGOGIQUES"], { x:42, y:760, size:10, bold:true, color:"0.10 0.46 0.43" }),
    text(wrap("Apports courts, demonstrations, exercices progressifs, ateliers fil rouge et production de livrables reutilisables. En intra, les cas peuvent etre adaptes aux outils et processus de l'entreprise.", 82), { x:42, y:735, size:11, leading:16 }),
    text(["EVALUATION"], { x:42, y:650, size:10, bold:true, color:"0.10 0.46 0.43" }),
    text(wrap("Positionnement initial, exercices d'application, observation des productions et evaluation finale des acquis. Une attestation de fin de formation peut etre remise.", 82), { x:42, y:625, size:11, leading:16 }),
    "0.09 0.12 0.19 rg 42 324 511 210 re f",
    text(["TARIFS"], { x:60, y:505, size:10, bold:true, color:"1 0.78 0.34" }),
    text(["INTRA-ENTREPRISE"], { x:60, y:468, size:9, bold:true, color:"0.86 0.88 0.92" }),
    text(["1 800 EUR HT / jour / groupe"], { x:60, y:440, size:18, bold:true, color:"1 1 1" }),
    text(["INTER-ENTREPRISES"], { x:60, y:395, size:9, bold:true, color:"0.86 0.88 0.92" }),
    text(["990 EUR HT / jour / participant"], { x:60, y:367, size:18, bold:true, color:"1 1 1" }),
    text(["Parcours recommande : " + training.standardDays + " jours - Intra " + intra + " EUR HT / groupe - Inter " + inter + " EUR HT / participant"], { x:60, y:340, size:9, color:"0.86 0.88 0.92" }),
    text(["FINANCEMENT OPCO"], { x:42, y:270, size:10, bold:true, color:"0.10 0.46 0.43" }),
    text(wrap("Une demande de prise en charge OPCO peut etre etudiee et peut aller jusqu'a 100 % selon votre branche, les budgets disponibles, les criteres d'eligibilite et l'accord prealable du financeur. Aucune prise en charge n'est garantie avant accord ecrit.", 84), { x:42, y:244, size:10, leading:15 }),
    text(["AUTONOMIA ACADEMY - build-autonomia.com"], { x:42, y:45, size:10, bold:true, color:"0.09 0.12 0.19" })
  ].join("\n");
}

export async function GET(_request, { params }) {
  const { slug } = await params;
  const training = getAcademyTraining(slug);
  if (!training) {
    return NextResponse.json({ error: "training_not_found" }, { status: 404 });
  }

  const pages = [
    coverPage(training),
    essentialsPage(training),
    ...training.days.map((day, index) => dayPage(training, day, index)),
    finalPage(training)
  ];

  const bytes = makePdf(pages);
  const filename = "programme-" + training.slug + "-autonomia.pdf";

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": 'attachment; filename="' + filename + '"',
      "cache-control": "public, max-age=3600"
    }
  });
}
