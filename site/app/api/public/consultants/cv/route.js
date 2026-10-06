export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const W = 595.28;
const H = 841.89;

const COLORS = {
  navy: [0.027, 0.067, 0.122],
  navy2: [0.055, 0.114, 0.184],
  cyan: [0.239, 0.886, 0.816],
  text: [0.071, 0.129, 0.231],
  muted: [0.40, 0.443, 0.49],
  pale: [0.953, 0.969, 0.98],
  line: [0.863, 0.898, 0.922],
  white: [1, 1, 1],
  green: [0.08, 0.62, 0.55]
};

function cp1252Byte(char) {
  const code = char.codePointAt(0);
  if (code <= 0x7f) return code;
  if (code >= 0xa0 && code <= 0xff) return code;
  const map = {
    0x20ac: 0x80, 0x201a: 0x82, 0x0192: 0x83, 0x201e: 0x84,
    0x2026: 0x85, 0x2020: 0x86, 0x2021: 0x87, 0x02c6: 0x88,
    0x2030: 0x89, 0x0160: 0x8a, 0x2039: 0x8b, 0x0152: 0x8c,
    0x017d: 0x8e, 0x2018: 0x91, 0x2019: 0x92, 0x201c: 0x93,
    0x201d: 0x94, 0x2022: 0x95, 0x2013: 0x96, 0x2014: 0x97,
    0x02dc: 0x98, 0x2122: 0x99, 0x0161: 0x9a, 0x203a: 0x9b,
    0x0153: 0x9c, 0x017e: 0x9e, 0x0178: 0x9f
  };
  return map[code] || 0x3f;
}

function hexText(value) {
  const bytes = [];
  for (const char of String(value || "")) bytes.push(cp1252Byte(char));
  return "<" + Buffer.from(bytes).toString("hex").toUpperCase() + ">";
}

function escName(value) {
  return String(value || "consultant")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function rgb(color) {
  return color.map((v) => Number(v).toFixed(3)).join(" ");
}

function wrap(text, maxChars) {
  const words = String(text || "").replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const lines = [];
  let current = "";
  for (const word of words) {
    const next = current ? current + " " + word : word;
    if (next.length <= maxChars || !current) current = next;
    else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function streamBuilder() {
  const out = [];
  const y = (top) => H - top;
  function rect(x, top, w, h, fill, stroke = null, lineWidth = 1) {
    if (fill) out.push(`${rgb(fill)} rg`);
    if (stroke) out.push(`${rgb(stroke)} RG ${lineWidth} w`);
    out.push(`${x.toFixed(2)} ${(H - top - h).toFixed(2)} ${w.toFixed(2)} ${h.toFixed(2)} re ${fill && stroke ? "B" : fill ? "f" : "S"}`);
  }
  function line(x1, top1, x2, top2, color, width = 1) {
    out.push(`${rgb(color)} RG ${width} w ${x1.toFixed(2)} ${y(top1).toFixed(2)} m ${x2.toFixed(2)} ${y(top2).toFixed(2)} l S`);
  }
  function circle(cx, topCy, r, fill, stroke = null, lineWidth = 1) {
    const cy = y(topCy);
    const k = 0.5522847498 * r;
    if (fill) out.push(`${rgb(fill)} rg`);
    if (stroke) out.push(`${rgb(stroke)} RG ${lineWidth} w`);
    out.push(
      `${(cx+r).toFixed(2)} ${cy.toFixed(2)} m`,
      `${(cx+r).toFixed(2)} ${(cy+k).toFixed(2)} ${(cx+k).toFixed(2)} ${(cy+r).toFixed(2)} ${cx.toFixed(2)} ${(cy+r).toFixed(2)} c`,
      `${(cx-k).toFixed(2)} ${(cy+r).toFixed(2)} ${(cx-r).toFixed(2)} ${(cy+k).toFixed(2)} ${(cx-r).toFixed(2)} ${cy.toFixed(2)} c`,
      `${(cx-r).toFixed(2)} ${(cy-k).toFixed(2)} ${(cx-k).toFixed(2)} ${(cy-r).toFixed(2)} ${cx.toFixed(2)} ${(cy-r).toFixed(2)} c`,
      `${(cx+k).toFixed(2)} ${(cy-r).toFixed(2)} ${(cx+r).toFixed(2)} ${(cy-k).toFixed(2)} ${(cx+r).toFixed(2)} ${cy.toFixed(2)} c`,
      fill && stroke ? "B" : fill ? "f" : "S"
    );
  }
  function text(x, top, value, size = 10, bold = false, color = COLORS.text) {
    out.push(`BT ${rgb(color)} rg /${bold ? "F2" : "F1"} ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${(H - top - size).toFixed(2)} Tm ${hexText(value)} Tj ET`);
  }
  function paragraph(x, top, value, width, size = 10, leading = 13, bold = false, color = COLORS.text, maxLines = 20) {
    const maxChars = Math.max(12, Math.floor(width / (size * 0.53)));
    const lines = wrap(value, maxChars).slice(0, maxLines);
    lines.forEach((ln, i) => text(x, top + i * leading, ln, size, bold, color));
    return lines.length * leading;
  }
  function pill(x, top, label, maxW = 120) {
    const w = Math.min(maxW, Math.max(48, 16 + label.length * 5.6));
    rect(x, top, w, 22, COLORS.pale, COLORS.line, 0.6);
    text(x + 8, top + 5, label, 8.2, true, COLORS.text);
    return w;
  }
  return { out, rect, line, circle, text, paragraph, pill };
}

function buildPdf(profile, roleTitle) {
  const p1 = streamBuilder();
  const p2 = streamBuilder();
  const initials = (profile.initials || "IA").replace(/\./g, "").slice(0, 3);
  const displayInitials = initials.split("").join(".") + ".";
  const title = profile.title || roleTitle || "Consultant IA";
  const skills = Array.isArray(profile.skills) ? profile.skills.slice(0, 12) : [];
  const bullets = Array.isArray(profile.cv_bullets) ? profile.cv_bullets.slice(0, 8) : [];
  const location = profile.location || "France";
  const modality = profile.remote ? "Remote / Hybride" : "Modalités à confirmer";
  const availability = profile.availability?.label || "Disponibilité à confirmer";
  const rate = profile.tjm == null ? "TJM à confirmer" : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(profile.tjm)) + " EUR HT / jour";

  // PAGE 1
  p1.rect(0, 0, W, 155, COLORS.navy);
  p1.text(34, 26, "AUTONOMIA", 22, true, COLORS.white);
  p1.text(34, 51, "AI EXECUTION PARTNER", 8, true, [0.62,0.69,0.77]);
  p1.circle(527, 54, 29, COLORS.navy2, COLORS.cyan, 1.8);
  p1.text(507, 43, displayInitials, 17, true, COLORS.white);
  p1.text(34, 85, title, 24, true, COLORS.white);
  p1.text(34, 119, location + "  -  " + modality, 10, false, [0.82,0.87,0.91]);

  p1.rect(28, 172, 539, 96, [0.945,0.99,0.98], COLORS.line, 0.5);
  p1.text(42, 187, "Pourquoi ce profil peut être pertinent", 15, true, COLORS.text);
  const reasons = [
    `Profil proposé pour : ${roleTitle || "expertise IA"}.`,
    skills.length ? `Compétences déclarées : ${skills.slice(0,4).join(" - ")}.` : "Compétences à confirmer lors du cadrage.",
    profile.remote ? "Intervention remote / hybride indiquée dans le profil." : "Modalités d’intervention à cadrer selon la mission."
  ];
  reasons.forEach((r, i) => {
    p1.circle(48, 219 + i*22, 5, COLORS.green);
    p1.text(45.5, 214.5 + i*22, "✓", 8, true, COLORS.white);
    p1.paragraph(61, 211 + i*22, r, 485, 9, 11, false, COLORS.text, 2);
  });

  p1.text(34, 294, "Positionnement", 14, true, COLORS.text);
  const summary = bullets[0] || `Consultant spécialisé sur des missions ${roleTitle || "IA"} et présenté par Autonomia selon les informations disponibles dans le pool.`;
  p1.paragraph(34, 316, summary, 330, 10, 13, false, COLORS.muted, 5);
  p1.rect(385, 292, 182, 86, COLORS.pale, COLORS.line, 0.5);
  p1.text(400, 307, "TJM AUTONOMIA", 8.5, true, COLORS.muted);
  p1.text(400, 328, rate, 14, true, COLORS.text);
  p1.line(400, 352, 550, 352, COLORS.line, 0.6);
  p1.text(400, 360, availability, 8.5, true, COLORS.green);

  p1.text(34, 407, "Expertises clés", 14, true, COLORS.text);
  let px = 34, py = 432;
  const chipSkills = skills.length ? skills.slice(0, 9) : ["IA", "Automatisation", "Transformation"];
  chipSkills.forEach((skill) => {
    const w = Math.min(118, Math.max(52, 18 + skill.length * 5.5));
    if (px + w > 561) { px = 34; py += 29; }
    p1.rect(px, py, w, 22, COLORS.pale, COLORS.line, 0.5);
    p1.text(px + 8, py + 5, skill, 8, true, COLORS.text);
    px += w + 7;
  });

  p1.text(34, 510, "Éléments marquants du profil", 14, true, COLORS.text);
  const keyBullets = bullets.slice(0, 4);
  const fallbackBullets = [
    `Rôle ciblé : ${roleTitle || "Consultant IA"}`,
    `Zone : ${location}`,
    `Modalités : ${modality}`,
    `Disponibilité : ${availability}`
  ];
  (keyBullets.length ? keyBullets : fallbackBullets).forEach((b, i) => {
    const top = 538 + i*48;
    p1.rect(34, top, 527, 38, [0.975,0.982,0.988], COLORS.line, 0.4);
    p1.circle(49, top+19, 4, COLORS.cyan);
    p1.paragraph(62, top+9, b, 485, 9, 11, false, COLORS.text, 2);
  });

  p1.line(28, 806, 567, 806, COLORS.line, 0.6);
  p1.text(28, 814, "Profil consultant - document commercial AUTONOMIA", 7, false, COLORS.muted);
  p1.text(548, 814, "1/2", 7, true, COLORS.text);

  // PAGE 2
  p2.rect(0, 0, W, 76, COLORS.navy);
  p2.text(34, 21, "AUTONOMIA", 19, true, COLORS.white);
  p2.text(34, 44, "AI EXECUTION PARTNER", 7.5, true, [0.62,0.69,0.77]);
  p2.text(430, 26, displayInitials + " - Consultant IA", 10, true, COLORS.white);

  p2.text(28, 104, "01", 34, true, COLORS.cyan);
  p2.text(88, 113, "Synthèse du profil", 18, true, COLORS.text);
  let cur = 152;
  const allBullets = bullets.length ? bullets : fallbackBullets;
  allBullets.slice(0,6).forEach((b) => {
    p2.circle(48, cur+6, 3.5, COLORS.cyan);
    const used = p2.paragraph(62, cur, b, 490, 10, 13, false, COLORS.text, 3);
    cur += Math.max(36, used + 12);
  });

  p2.line(28, 390, 567, 390, COLORS.line, 0.7);
  p2.text(28, 412, "02", 34, true, COLORS.cyan);
  p2.text(88, 421, "Compétences & modalités", 18, true, COLORS.text);
  p2.text(34, 463, "COMPÉTENCES", 8, true, COLORS.muted);
  let sx = 34, sy = 485;
  chipSkills.slice(0,10).forEach((skill) => {
    const w = Math.min(115, Math.max(50, 16 + skill.length * 5.3));
    if (sx + w > 560) { sx = 34; sy += 29; }
    p2.rect(sx, sy, w, 22, COLORS.pale, COLORS.line, 0.5);
    p2.text(sx+8, sy+5, skill, 7.8, true, COLORS.text);
    sx += w + 7;
  });

  const infoTop = Math.max(548, sy + 42);
  const infos = [
    ["Localisation", location],
    ["Modalités", modality],
    ["Disponibilité", availability],
    ["TJM Autonomia", rate]
  ];
  infos.forEach((item, i) => {
    const top = infoTop + i*33;
    p2.text(34, top, item[0].toUpperCase(), 7.5, true, COLORS.muted);
    p2.text(160, top, item[1], 9.5, true, COLORS.text);
  });

  p2.text(28, 684, "03", 34, true, COLORS.cyan);
  p2.text(88, 693, "Rencontrer ce consultant", 18, true, COLORS.text);
  p2.rect(28, 730, 539, 72, COLORS.pale, COLORS.line, 0.5);
  p2.text(44, 746, "Déborah Dian Goldcher", 11, true, COLORS.text);
  p2.text(44, 766, "deborah@build-autonomia.com  -  06 09 74 62 40", 8.5, false, COLORS.text);
  p2.text(344, 746, "Échanger sur ce profil", 10, true, COLORS.text);
  p2.text(344, 766, "build-autonomia.com/contact", 8.5, true, [0.08,0.35,0.65]);
  p2.line(28, 813, 567, 813, COLORS.line, 0.6);
  p2.text(28, 820, "Profil consultant - document commercial AUTONOMIA", 7, false, COLORS.muted);
  p2.text(548, 820, "2/2", 7, true, COLORS.text);

  const objects = [];
  const add = (body) => { objects.push(body); return objects.length; };
  const font1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const font2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const content1 = add(`<< /Length ${Buffer.byteLength(p1.out.join("\n"), "ascii")} >>\nstream\n${p1.out.join("\n")}\nendstream`);
  const content2 = add(`<< /Length ${Buffer.byteLength(p2.out.join("\n"), "ascii")} >>\nstream\n${p2.out.join("\n")}\nendstream`);
  const linkAnnot = add(`<< /Type /Annot /Subtype /Link /Rect [344 ${H-802} 555 ${H-730}] /Border [0 0 0] /A << /S /URI /URI (https://build-autonomia.com/contact) >> >>`);
  const pagesId = objects.length + 3;
  const page1Id = add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${content1} 0 R >>`);
  const page2Id = add(`<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${W} ${H}] /Resources << /Font << /F1 ${font1} 0 R /F2 ${font2} 0 R >> >> /Contents ${content2} 0 R /Annots [${linkAnnot} 0 R] >>`);
  const pages = add(`<< /Type /Pages /Kids [${page1Id} 0 R ${page2Id} 0 R] /Count 2 >>`);
  const catalog = add(`<< /Type /Catalog /Pages ${pages} 0 R >>`);

  const parts = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary")];
  const offsets = [0];
  let offset = parts[0].length;
  objects.forEach((body, i) => {
    offsets[i+1] = offset;
    const buf = Buffer.from(`${i+1} 0 obj\n${body}\nendobj\n`, "binary");
    parts.push(buf);
    offset += buf.length;
  });
  const xrefOffset = offset;
  let xref = `xref\n0 ${objects.length+1}\n0000000000 65535 f \n`;
  for (let i=1;i<=objects.length;i++) xref += String(offsets[i]).padStart(10,"0") + " 00000 n \n";
  xref += `trailer\n<< /Size ${objects.length+1} /Root ${catalog} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  parts.push(Buffer.from(xref, "ascii"));
  return Buffer.concat(parts);
}

export async function GET(request) {
  const url = new URL(request.url);
  const role = String(url.searchParams.get("role") || "").trim();
  const id = String(url.searchParams.get("id") || "").trim();
  const roleTitle = String(url.searchParams.get("roleTitle") || "Consultant IA").trim();

  if (!role || !id) {
    return Response.json({ ok: false, error: "role_and_id_required" }, { status: 400 });
  }

  try {
    const feedUrl = new URL("/api/public/consultants", url.origin);
    feedUrl.searchParams.set("role", role);
    feedUrl.searchParams.set("limit", "12");
    const response = await fetch(feedUrl, { cache: "no-store" });
    const payload = await response.json();
    const profile = Array.isArray(payload?.profiles)
      ? payload.profiles.find((item) => String(item.id) === id)
      : null;

    if (!response.ok || !payload?.ok || !profile) {
      return Response.json({ ok: false, error: "consultant_not_found" }, { status: 404 });
    }

    const pdf = buildPdf(profile, roleTitle);
    const filename = `CV_AUTONOMIA_${escName(profile.initials || "IA")}_${escName(role)}.pdf`;

    return new Response(pdf, {
      status: 200,
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="${filename}"`,
        "cache-control": "no-store"
      }
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: "cv_generation_failed" },
      { status: 500, headers: { "cache-control": "no-store" } }
    );
  }
}
