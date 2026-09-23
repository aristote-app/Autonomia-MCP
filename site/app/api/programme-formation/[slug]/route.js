import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb, degrees } from "pdf-lib";
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

function safeText(value = "") {
  return String(value)
    .replaceAll("’", "'")
    .replaceAll("‘", "'")
    .replaceAll("“", '"')
    .replaceAll("”", '"')
    .replaceAll("–", "-")
    .replaceAll("—", "-")
    .replaceAll("œ", "oe")
    .replaceAll("Œ", "OE")
    .replaceAll("…", "...")
    .replaceAll("·", "-");
}

function wrap(text, font, size, width) {
  const words = safeText(text).split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? line + " " + word : word;
    if (font.widthOfTextAtSize(test, size) <= width) {
      line = test;
    } else {
      if (line) lines.push(line);
      line = word;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawWrapped(page, text, x, y, opts) {
  const { font, size = 11, maxWidth = 500, lineHeight = size * 1.35, color = rgb(0.11,0.12,0.16), maxLines } = opts;
  const lines = wrap(text, font, size, maxWidth);
  const useLines = maxLines ? lines.slice(0, maxLines) : lines;
  let cursor = y;
  for (const line of useLines) {
    page.drawText(line, { x, y: cursor, size, font, color });
    cursor -= lineHeight;
  }
  return cursor;
}

function drawLogo(page, x, y, scale = 1) {
  const black = rgb(0.08, 0.08, 0.08);
  const yellow = rgb(1, 0.784, 0.341);
  const s = 14 * scale;
  const gap = 4 * scale;
  const radius = 2.5 * scale;
  const points = [
    [0, 0], [s+gap, 0],
    [0, -(s+gap)], [s+gap, -(s+gap)], [2*(s+gap), -(s+gap)],
    [0, -2*(s+gap)], [s+gap, -2*(s+gap)], [2*(s+gap), -2*(s+gap)]
  ];
  for (const [dx, dy] of points) {
    page.drawRectangle({ x:x+dx, y:y+dy, width:s, height:s, color:black, borderRadius:radius });
  }
  page.drawRectangle({
    x:x+2*(s+gap)+3*scale,
    y:y+11*scale,
    width:s,
    height:s,
    color:yellow,
    rotate: degrees(12),
    borderRadius:radius
  });
}

function header(page, fonts, label) {
  const { regular, bold } = fonts;
  page.drawRectangle({ x:0, y:806, width:595.28, height:36, color: rgb(0.09,0.12,0.19) });
  drawLogo(page, 32, 820, .55);
  page.drawText("AUTONOMIA", { x:90, y:819, size:12, font:bold, color:rgb(1,1,1) });
  page.drawText("ACADEMY", { x:164, y:819, size:9, font:bold, color:rgb(1,0.784,0.341) });
  page.drawText(safeText(label), { x:420, y:819, size:8, font:regular, color:rgb(.86,.88,.92) });
}

function footer(page, fonts, pageNo) {
  page.drawLine({ start:{x:32,y:32}, end:{x:563,y:32}, thickness:.6, color:rgb(.83,.84,.86) });
  page.drawText("build-autonomia.com", { x:32, y:18, size:8, font:fonts.regular, color:rgb(.35,.37,.42) });
  page.drawText(String(pageNo), { x:548, y:18, size:8, font:fonts.bold, color:rgb(.35,.37,.42) });
}

function newPage(pdf, fonts, label, pageNo) {
  const page = pdf.addPage([595.28, 841.89]);
  header(page, fonts, label);
  footer(page, fonts, pageNo);
  return page;
}

function sectionTitle(page, fonts, index, title, y) {
  page.drawText(index, { x:32, y, size:9, font:fonts.bold, color:rgb(.61,.42,0) });
  const next = drawWrapped(page, title, 92, y+2, {
    font:fonts.bold, size:22, maxWidth:445, lineHeight:25, color:rgb(.09,.12,.19)
  });
  return next - 14;
}

function bulletList(page, items, x, y, fonts, width = 470, size = 10.5, gap = 9) {
  let cursor = y;
  for (const item of items) {
    page.drawCircle({ x:x+3, y:cursor+3, size:2.3, color:rgb(1,.784,.341) });
    cursor = drawWrapped(page, item, x+14, cursor+7, {
      font:fonts.regular, size, maxWidth:width-14, lineHeight:size*1.35
    }) - gap;
  }
  return cursor;
}

export async function GET(request, { params }) {
  const { slug } = await params;
  const training = getAcademyTraining(slug);
  if (!training) {
    return NextResponse.json({ error:"training_not_found" }, { status:404 });
  }

  const pdf = await PDFDocument.create();
  const fonts = {
    regular: await pdf.embedFont(StandardFonts.Helvetica),
    bold: await pdf.embedFont(StandardFonts.HelveticaBold)
  };
  const W = 595.28;
  const navy = rgb(.09,.12,.19);
  const yellow = rgb(1,.784,.341);
  const teal = rgb(.10,.48,.45);
  const muted = rgb(.38,.41,.47);

  let pageNo = 1;
  let page = pdf.addPage([595.28, 841.89]);
  page.drawRectangle({ x:0, y:0, width:W, height:841.89, color:navy });
  drawLogo(page, 38, 774, 1.05);
  page.drawText("AUTONOMIA", { x:128, y:788, size:18, font:fonts.bold, color:rgb(1,1,1) });
  page.drawText("ACADEMY", { x:128, y:770, size:10, font:fonts.bold, color:yellow });

  page.drawText("PROGRAMME DE FORMATION", { x:38, y:694, size:10, font:fonts.bold, color:yellow });
  let cy = drawWrapped(page, training.title, 38, 655, {
    font:fonts.bold, size:30, maxWidth:515, lineHeight:33, color:rgb(1,1,1)
  });
  cy -= 18;
  cy = drawWrapped(page, training.subtitle, 38, cy, {
    font:fonts.regular, size:14, maxWidth:505, lineHeight:19, color:rgb(.83,.86,.91)
  });

  page.drawRectangle({ x:38, y:392, width:519, height:126, color:rgb(.13,.17,.26), borderColor:rgb(.22,.26,.35), borderWidth:.8 });
  page.drawText("FORMAT RECOMMANDE", { x:58, y:488, size:9, font:fonts.bold, color:yellow });
  page.drawText(training.standardDays + " jours - " + (training.standardDays*7) + " heures", { x:58, y:463, size:22, font:fonts.bold, color:rgb(1,1,1) });
  page.drawText("Presentiel ou distanciel - Intra ou inter-entreprises", { x:58, y:438, size:11, font:fonts.regular, color:rgb(.83,.86,.91) });
  page.drawText("Intra : 1 800 EUR HT / jour / groupe", { x:58, y:414, size:10, font:fonts.bold, color:rgb(1,1,1) });
  page.drawText("Inter : 990 EUR HT / jour / participant - session selon programmation", { x:294, y:414, size:9.5, font:fonts.regular, color:rgb(.83,.86,.91) });

  page.drawText("Parcours disponibles", { x:38, y:335, size:11, font:fonts.bold, color:yellow });
  const levels = [
    ["Initiation", training.introDays],
    ["Operationnel", training.standardDays],
    ["Expert", training.expertDays]
  ];
  levels.forEach(([name, days], idx) => {
    const x = 38 + idx*173;
    page.drawRectangle({ x, y:245, width:157, height:72, color: idx === 1 ? teal : rgb(.13,.17,.26) });
    page.drawText(name.toUpperCase(), { x:x+12, y:292, size:9, font:fonts.bold, color:idx===1?rgb(1,1,1):yellow });
    page.drawText(days + " j - " + (days*7) + " h", { x:x+12, y:267, size:17, font:fonts.bold, color:rgb(1,1,1) });
  });
  page.drawText("Programme detaille - edition 2026", { x:38, y:64, size:9, font:fonts.regular, color:rgb(.63,.67,.74) });
  footer(page, fonts, pageNo);

  // Page 2 - public, prereqs, objectives
  pageNo++;
  page = newPage(pdf, fonts, "PROGRAMME", pageNo);
  let y = 770;
  y = sectionTitle(page, fonts, "01", "Public, prerequis et objectifs pedagogiques", y);
  page.drawText("PUBLIC VISE", { x:32, y, size:9, font:fonts.bold, color:teal }); y -= 18;
  y = bulletList(page, training.audience, 32, y, fonts, 250, 10); 
  page.drawText("PREREQUIS", { x:318, y:744, size:9, font:fonts.bold, color:teal });
  bulletList(page, training.prerequisites, 318, 726, fonts, 240, 10);

  y -= 6;
  page.drawLine({ start:{x:32,y}, end:{x:563,y}, thickness:.7, color:rgb(.83,.84,.86) }); y -= 28;
  page.drawText("OBJECTIFS PEDAGOGIQUES", { x:32, y, size:9, font:fonts.bold, color:teal }); y -= 20;
  y = bulletList(page, training.goals, 32, y, fonts, 520, 10.5, 10);

  y -= 4;
  page.drawText("COMPETENCES TRAVAILLEES", { x:32, y, size:9, font:fonts.bold, color:teal }); y -= 22;
  let tx = 32;
  let ty = y;
  for (const skill of training.skills) {
    const label = safeText(skill);
    const width = Math.min(150, fonts.bold.widthOfTextAtSize(label, 9) + 18);
    if (tx + width > 563) { tx = 32; ty -= 30; }
    page.drawRectangle({ x:tx, y:ty-5, width, height:22, color:rgb(.95,.93,.88), borderColor:rgb(.83,.79,.66), borderWidth:.5 });
    page.drawText(label, { x:tx+9, y:ty+2, size:9, font:fonts.bold, color:navy });
    tx += width + 8;
  }

  page.drawText("OUTILS ET ENVIRONNEMENTS", { x:32, y:ty-42, size:9, font:fonts.bold, color:teal });
  bulletList(page, training.tools, 32, ty-60, fonts, 520, 10);

  // Program pages
  for (let i=0; i<training.days.length; i++) {
    pageNo++;
    page = newPage(pdf, fonts, "PROGRAMME DETAILLE", pageNo);
    let py = 770;
    py = sectionTitle(page, fonts, String(i+2).padStart(2,"0"), training.days[i].title, py);
    py = bulletList(page, training.days[i].modules, 32, py, fonts, 520, 11, 13);
    py -= 6;
    page.drawRectangle({ x:32, y:py-108, width:531, height:104, color:rgb(.96,.95,.91), borderColor:rgb(.84,.82,.75), borderWidth:.7 });
    page.drawText("ATELIER", { x:48, y:py-28, size:9, font:fonts.bold, color:teal });
    drawWrapped(page, training.days[i].workshop, 48, py-47, { font:fonts.regular, size:10.5, maxWidth:480, lineHeight:14 });
    page.drawText("LIVRABLE", { x:48, y:py-79, size:9, font:fonts.bold, color:teal });
    drawWrapped(page, training.days[i].deliverable, 48, py-97, { font:fonts.regular, size:10.5, maxWidth:480, lineHeight:14 });

    page.drawText("EXEMPLES DE CAS APPLICATIFS", { x:32, y:py-145, size:9, font:fonts.bold, color:teal });
    bulletList(page, training.cases.slice(0,4), 32, py-165, fonts, 520, 10);
  }

  // Final page
  pageNo++;
  page = newPage(pdf, fonts, "MODALITES & TARIFS", pageNo);
  let fy = 770;
  fy = sectionTitle(page, fonts, String(training.days.length+2).padStart(2,"0"), "Modalites, evaluation, tarifs et financement", fy);

  const blocks = [
    ["MODALITES PEDAGOGIQUES", "Apports courts, demonstrations, exercices progressifs, ateliers fil rouge, supports et modeles reutilisables. En intra, les cas pratiques peuvent etre adaptes a l'environnement de l'entreprise."],
    ["EVALUATION", "Positionnement initial, exercices d'application, observation des productions, evaluation finale des acquis et synthese des points a renforcer."],
    ["ACCESSIBILITE", "Les besoins specifiques peuvent etre signales en amont afin d'etudier les adaptations pedagogiques ou materielles possibles."],
    ["ATTESTATION", "Une attestation de fin de formation peut etre remise avec les objectifs et la duree effectivement suivis."]
  ];
  for (const [title,text] of blocks) {
    page.drawText(title, { x:32, y:fy, size:9, font:fonts.bold, color:teal }); fy -= 17;
    fy = drawWrapped(page, text, 32, fy, { font:fonts.regular, size:10.5, maxWidth:520, lineHeight:14.5, color:muted }) - 14;
  }

  page.drawRectangle({ x:32, y:194, width:531, height:130, color:navy });
  page.drawText("TARIFS", { x:50, y:298, size:10, font:fonts.bold, color:yellow });
  page.drawText("Intra : 1 800 EUR HT / jour / groupe", { x:50, y:270, size:15, font:fonts.bold, color:rgb(1,1,1) });
  page.drawText("Inter : 990 EUR HT / jour / participant", { x:50, y:247, size:14, font:fonts.bold, color:rgb(1,1,1) });
  page.drawText("Parcours operationnel : " + training.standardDays + " jours", { x:50, y:222, size:10, font:fonts.regular, color:rgb(.82,.85,.9) });
  page.drawText("Intra : " + trainingPrice(training.standardDays,"intra").toLocaleString("fr-FR") + " EUR HT / groupe", { x:300, y:270, size:10, font:fonts.regular, color:rgb(.82,.85,.9) });
  page.drawText("Inter : " + trainingPrice(training.standardDays,"inter").toLocaleString("fr-FR") + " EUR HT / participant", { x:300, y:247, size:10, font:fonts.regular, color:rgb(.82,.85,.9) });

  page.drawText("FINANCEMENT OPCO", { x:32, y:156, size:9, font:fonts.bold, color:teal });
  drawWrapped(page,
    "Une demande de prise en charge OPCO peut etre etudiee et peut aller jusqu'a 100 % selon la branche, les budgets disponibles, les criteres d'eligibilite et l'accord prealable de l'OPCO. Aucune prise en charge n'est garantie avant accord ecrit.",
    32, 137, { font:fonts.regular, size:10.2, maxWidth:520, lineHeight:14, color:muted }
  );

  const bytes = await pdf.save();
  const filename = "programme-" + training.slug + "-autonomia.pdf";

  return new NextResponse(bytes, {
    status: 200,
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "public, max-age=3600"
    }
  });
}
