export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const W = 595.28;
const H = 841.89;

const C = {
  navy: [0.027, 0.067, 0.122],
  navy2: [0.035, 0.11, 0.19],
  cyan: [0.22, 0.88, 0.79],
  cyan2: [0.18, 0.72, 0.94],
  text: [0.03, 0.08, 0.25],
  muted: [0.31, 0.38, 0.50],
  pale: [0.955, 0.978, 0.992],
  pale2: [0.925, 0.965, 0.985],
  line: [0.82, 0.89, 0.93],
  white: [1,1,1],
  green: [0.06, 0.72, 0.56],
  blue: [0.06, 0.30, 0.64]
};

function cp1252Byte(char) {
  const code = char.codePointAt(0);
  if (code <= 0x7f) return code;
  if (code >= 0xa0 && code <= 0xff) return code;
  const map = {
    0x20ac:0x80,0x201a:0x82,0x0192:0x83,0x201e:0x84,0x2026:0x85,0x2020:0x86,
    0x2021:0x87,0x02c6:0x88,0x2030:0x89,0x0160:0x8a,0x2039:0x8b,0x0152:0x8c,
    0x017d:0x8e,0x2018:0x91,0x2019:0x92,0x201c:0x93,0x201d:0x94,0x2022:0x95,
    0x2013:0x96,0x2014:0x97,0x02dc:0x98,0x2122:0x99,0x0161:0x9a,0x203a:0x9b,
    0x0153:0x9c,0x017e:0x9e,0x0178:0x9f
  };
  return map[code] || 0x3f;
}

function hexText(value) {
  const bytes = [];
  for (const char of String(value || "")) bytes.push(cp1252Byte(char));
  return "<" + Buffer.from(bytes).toString("hex").toUpperCase() + ">";
}

function slug(value) {
  return String(value || "consultant")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "").slice(0, 60);
}

function rgb(c) { return c.map(v => Number(v).toFixed(3)).join(" "); }

function wrap(text, maxChars) {
  const words = String(text || "").replace(/\s+/g," ").trim().split(" ").filter(Boolean);
  const lines = []; let line = "";
  for (const word of words) {
    const next = line ? line + " " + word : word;
    if (!line || next.length <= maxChars) line = next;
    else { lines.push(line); line = word; }
  }
  if (line) lines.push(line);
  return lines;
}

function unique(items=[]) {
  return [...new Set(items.map(x => String(x || "").trim()).filter(Boolean))];
}

function streamBuilder() {
  const out = [];
  const Y = top => H - top;

  function rect(x, top, w, h, fill, stroke=null, sw=1) {
    if (fill) out.push(rgb(fill)+" rg");
    if (stroke) out.push(rgb(stroke)+" RG "+sw+" w");
    out.push([x,H-top-h,w,h].map(n=>Number(n).toFixed(2)).join(" ")+" re "+(fill&&stroke?"B":fill?"f":"S"));
  }

  function roundedRect(x, top, w, h, r, fill, stroke=null, sw=1) {
    const x2=x+w, y1=H-top-h, y2=H-top, k=.5522847498*r;
    if (fill) out.push(rgb(fill)+" rg");
    if (stroke) out.push(rgb(stroke)+" RG "+sw+" w");
    out.push(
      (x+r)+" "+y1+" m",
      (x2-r)+" "+y1+" l",
      (x2-r+k)+" "+y1+" "+x2+" "+(y1+r-k)+" "+x2+" "+(y1+r)+" c",
      x2+" "+(y2-r)+" l",
      x2+" "+(y2-r+k)+" "+(x2-r+k)+" "+y2+" "+(x2-r)+" "+y2+" c",
      (x+r)+" "+y2+" l",
      (x+r-k)+" "+y2+" "+x+" "+(y2-r+k)+" "+x+" "+(y2-r)+" c",
      x+" "+(y1+r)+" l",
      x+" "+(y1+r-k)+" "+(x+r-k)+" "+y1+" "+(x+r)+" "+y1+" c",
      "h "+(fill&&stroke?"B":fill?"f":"S")
    );
  }

  function polygon(points, fill) {
    if (!points.length) return;
    out.push(rgb(fill)+" rg");
    const [first,...rest] = points;
    out.push(first[0]+" "+Y(first[1])+" m");
    rest.forEach(p => out.push(p[0]+" "+Y(p[1])+" l"));
    out.push("h f");
  }

  function line(x1,t1,x2,t2,color,w=1) {
    out.push(rgb(color)+" RG "+w+" w "+x1+" "+Y(t1)+" m "+x2+" "+Y(t2)+" l S");
  }

  function curve(x1,t1,c1x,c1t,c2x,c2t,x2,t2,color,w=1) {
    out.push(rgb(color)+" RG "+w+" w "+x1+" "+Y(t1)+" m "+c1x+" "+Y(c1t)+" "+c2x+" "+Y(c2t)+" "+x2+" "+Y(t2)+" c S");
  }

  function circle(cx,topCy,r,fill,stroke=null,sw=1) {
    const cy=Y(topCy), k=.5522847498*r;
    if (fill) out.push(rgb(fill)+" rg");
    if (stroke) out.push(rgb(stroke)+" RG "+sw+" w");
    out.push(
      (cx+r)+" "+cy+" m",
      (cx+r)+" "+(cy+k)+" "+(cx+k)+" "+(cy+r)+" "+cx+" "+(cy+r)+" c",
      (cx-k)+" "+(cy+r)+" "+(cx-r)+" "+(cy+k)+" "+(cx-r)+" "+cy+" c",
      (cx-r)+" "+(cy-k)+" "+(cx-k)+" "+(cy-r)+" "+cx+" "+(cy-r)+" c",
      (cx+k)+" "+(cy-r)+" "+(cx+r)+" "+(cy-k)+" "+(cx+r)+" "+cy+" c",
      fill&&stroke?"B":fill?"f":"S"
    );
  }

  function text(x,top,value,size=10,bold=false,color=C.text) {
    out.push("BT "+rgb(color)+" rg /"+(bold?"F2":"F1")+" "+size+" Tf 1 0 0 1 "+x+" "+(H-top-size)+" Tm "+hexText(value)+" Tj ET");
  }

  function paragraph(x,top,value,width,size=10,leading=13,bold=false,color=C.text,maxLines=20) {
    const maxChars=Math.max(12,Math.floor(width/(size*.52)));
    const lines=wrap(value,maxChars).slice(0,maxLines);
    lines.forEach((ln,i)=>text(x,top+i*leading,ln,size,bold,color));
    return lines.length*leading;
  }

  return {out,rect,roundedRect,polygon,line,curve,circle,text,paragraph};
}

function drawLogo(p, x, top, scale=1) {
  p.polygon([[x,top+48*scale],[x+27*scale,top],[x+36*scale,top+12*scale],[x+17*scale,top+48*scale]], C.cyan2);
  p.polygon([[x+30*scale,top-4*scale],[x+64*scale,top+48*scale],[x+49*scale,top+48*scale],[x+23*scale,top+10*scale]], C.cyan);
  p.polygon([[x+25*scale,top+28*scale],[x+36*scale,top+13*scale],[x+59*scale,top+48*scale],[x+44*scale,top+48*scale]], C.cyan);
  p.text(x+78*scale,top+6*scale,"AUTONOMIA",25*scale,true,C.white);
  p.text(x+80*scale,top+39*scale,"AI EXECUTION PARTNER",8.5*scale,true,[.78,.84,.9]);
}

function deriveUseCases(profile, roleTitle) {
  const hay = (roleTitle+" "+profile.title+" "+(profile.skills||[]).join(" ")).toLowerCase();
  const out=[];
  const add=(title,desc)=>{ if(!out.some(x=>x[0]===title)) out.push([title,desc]); };
  if (/n8n|make|zapier|automation|automatisation|workflow/.test(hay)) add("Automatisation métier","Workflows et automatisations connectés aux outils opérationnels.");
  if (/agent|agentic|llm|openai|claude|anthropic/.test(hay)) add("Agents & IA générative","Agents, assistants et usages IA générative adaptés au contexte métier.");
  if (/api|webhook|integration|intégration/.test(hay)) add("Connexions API","Connexion d’outils, API, webhooks et circulation de données.");
  if (/crm|sales|lead|prospect/.test(hay)) add("Sales & CRM","Automatisation des flux commerciaux, CRM et enrichissement.");
  if (/content|contenu|marketing|seo/.test(hay)) add("Content Factory","Production, validation et diffusion de contenus assistées par IA.");
  if (/data|python|machine learning|ml\b/.test(hay)) add("Data & IA","Traitement de données, scripts et composants IA.");
  if (/rag|retrieval|vector|embedding/.test(hay)) add("RAG documentaire","Recherche augmentée et assistants connectés aux connaissances.");
  if (/project|projet|product|transformation/.test(hay)) add("Pilotage IA","Cadrage, priorisation et mise en œuvre de cas d’usage IA.");
  const fallback=[
    ["Expertise ciblée",roleTitle || "Intervention IA spécialisée."],
    ["Cadrage opérationnel","Traduction du besoin métier en périmètre d’intervention."],
    ["Delivery","Intervention orientée usages et résultats opérationnels."],
    ["Mise en relation","Profil proposé et coordonné par Autonomia."]
  ];
  for (const f of fallback) if(out.length<4) add(...f);
  return out.slice(0,4);
}

function deriveStrengths(profile, roleTitle) {
  const hay=(roleTitle+" "+profile.title+" "+(profile.skills||[]).join(" ")).toLowerCase();
  const s=[];
  const add=x=>{ if(!s.includes(x)) s.push(x); };
  if (/automation|automatisation|n8n|make|zapier/.test(hay)) add("Automatisation métier");
  if (/agent|agentic/.test(hay)) add("Agents IA");
  if (/api|webhook/.test(hay)) add("Connexions API");
  if (/product|produit/.test(hay)) add("Vision produit");
  if (/python|code|developer|engineer/.test(hay)) add("Delivery technique");
  if (/no-code|low-code|n8n|make|zapier/.test(hay)) add("No-Code / Low-Code");
  if (/rag|llm|openai|claude/.test(hay)) add("IA générative");
  ["Expertise ciblée","Approche opérationnelle","Mise en œuvre","Coordination Autonomia"].forEach(x=>{if(s.length<4)add(x)});
  return s.slice(0,4);
}

function buildPdf(profile, roleTitle) {
  const p1 = streamBuilder();
  const p2 = streamBuilder();

  const rawInitials = String(profile.initials || "IA").replace(/\./g, "").slice(0, 3).toUpperCase();
  const initials = rawInitials.split("").join(".") + ".";
  const title = String(profile.title || roleTitle || "Consultant IA").trim();
  const skills = unique(profile.skills || []).slice(0, 10);
  const bullets = unique(profile.cv_bullets || []).slice(0, 6);
  const location = profile.location || "France";
  const modality = profile.remote ? "Remote / Hybride" : "Modalités à confirmer";
  const availability = profile.availability?.label || "Disponibilité à confirmer";
  const rate = profile.tjm == null
    ? "TJM à confirmer"
    : new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Number(profile.tjm)) + " € HT / jour";
  const useCases = deriveUseCases(profile, roleTitle);
  const strengths = deriveStrengths(profile, roleTitle);

  // ---------------- PAGE 1 — MASTER TEMPLATE ----------------
  p1.rect(0, 0, W, 130, C.navy);
  drawLogo(p1, 24, 18, .58);

  // subtle wave motif, like approved master
  [0, 6, 12, 18].forEach((o, i) =>
    p1.curve(360, 126 - o, 430, 104 - o, 510, 110 + o, 595, 91 + o, i % 2 ? C.cyan2 : C.cyan, .35)
  );

  p1.circle(529, 42, 27, C.navy2, C.cyan, 1.7);
  p1.text(511, 31, initials, 15.5, true, C.white);

  // exact title rhythm: two lines max, second accented cyan
  const shortTitle = title.length > 64 ? title.slice(0, 64).trim() : title;
  const titleLines = wrap(shortTitle, 34).slice(0, 2);
  if (titleLines.length === 1) {
    p1.text(24, 73, titleLines[0], 24, true, C.white);
  } else {
    p1.text(24, 66, titleLines[0], 22, true, C.white);
    p1.text(24, 92, titleLines[1], 22, true, C.cyan);
  }
  p1.text(24, 113, location + "  •  " + modality, 10, false, [.88,.91,.94]);

  // Why relevant
  p1.roundedRect(18, 142, 559, 105, 10, [.95,.99,.98], C.line, .4);
  p1.circle(49, 174, 17, [.86,.97,.94]);
  p1.text(42, 162, "✓", 20, true, C.green);
  p1.text(80, 157, "Pourquoi ce profil peut être pertinent", 15.5, true, C.text);

  const reasons = [
    "Profil proposé pour : " + (roleTitle || "expertise IA") + ".",
    skills.length
      ? "Compétences déclarées : " + skills.slice(0, 5).join(" · ") + "."
      : "Compétences détaillées à confirmer lors du cadrage.",
    profile.remote
      ? "Intervention remote / hybride indiquée dans le profil."
      : "Modalités d’intervention à cadrer selon la mission."
  ];
  reasons.forEach((r, i) => {
    p1.circle(88, 190 + i * 18, 4.8, C.green);
    p1.text(85.5, 185.8 + i * 18, "✓", 7, true, C.white);
    p1.paragraph(101, 183 + i * 18, r, 452, 9, 11, false, C.text, 2);
  });

  // Positioning and TJM two-column block
  p1.roundedRect(18, 257, 324, 126, 10, C.pale, C.line, .4);
  p1.circle(50, 286, 16, [.89,.95,1]);
  p1.text(45, 276, "●", 13, true, C.blue);
  p1.text(80, 272, "Positionnement", 15, true, C.text);
  const summary = bullets[0] || title;
  p1.paragraph(80, 305, summary, 236, 9.8, 13, false, C.muted, 5);

  p1.roundedRect(351, 257, 226, 126, 10, C.pale, C.line, .4);
  p1.text(374, 277, "TJM AUTONOMIA", 8.2, true, C.muted);
  p1.paragraph(374, 300, rate, 176, 16.5, 18, true, C.text, 2);
  p1.line(374, 342, 552, 342, C.line, .5);
  p1.text(374, 353, availability, 8.5, true, C.green);
  p1.text(374, 369, "Modalités : " + modality, 8.2, true, C.text);

  // Expertise row
  p1.roundedRect(18, 395, 559, 82, 10, [.974,.986,.995], C.line, .4);
  p1.circle(49, 425, 16, [.87,.97,.94]);
  p1.text(43, 414, "+", 17, true, C.blue);
  p1.text(80, 410, "Expertises clés", 15, true, C.text);
  let cx = 34, cy = 441;
  (skills.length ? skills : ["IA", "Automatisation", "Transformation"]).slice(0, 8).forEach(skill => {
    const w = Math.min(92, Math.max(46, 14 + skill.length * 4.8));
    if (cx + w > 561) { cx = 34; cy += 24; }
    p1.roundedRect(cx, cy, w, 20, 10, C.pale2, C.line, .3);
    p1.text(cx + 7, cy + 5, skill, 7.4, true, C.text);
    cx += w + 6;
  });

  // Use cases
  p1.roundedRect(18, 490, 559, 148, 10, [.982,.989,.996], C.line, .4);
  p1.circle(49, 520, 16, [.89,.95,1]);
  p1.text(43, 510, "◎", 14, true, C.blue);
  p1.text(80, 505, "Cas d’usage maîtrisés", 15, true, C.text);

  useCases.forEach((u, i) => {
    const x = 32 + i * 138;
    if (i > 0) p1.line(x - 9, 540, x - 9, 620, C.line, .45);
    p1.circle(x + 13, 551, 13, i % 2 ? C.green : C.blue);
    p1.text(x + 8, 543, String(i + 1).padStart(2, "0"), 7, true, C.white);
    p1.paragraph(x, 572, u[0], 122, 9.2, 11, true, C.text, 2);
    p1.paragraph(x, 600, u[1], 122, 7.4, 9, false, C.muted, 3);
  });

  // Strengths
  p1.roundedRect(18, 651, 559, 100, 10, [.965,.99,.98], C.line, .4);
  p1.circle(49, 680, 16, [.87,.97,.94]);
  p1.text(43, 670, "★", 13, true, C.blue);
  p1.text(80, 665, "Points forts marquants", 15, true, C.text);

  strengths.forEach((s, i) => {
    const x = 34 + i * 133;
    p1.roundedRect(x, 704, 120, 26, 12, [.91,.98,.96], C.line, .25);
    p1.text(x + 9, 712, s, 7.5, true, C.text);
  });

  p1.line(18, 790, 577, 790, C.line, .5);
  p1.text(20, 799, "Profil consultant — document commercial AUTONOMIA", 7, false, C.muted);
  p1.text(552, 799, "1/2", 7, true, C.text);

  // ---------------- PAGE 2 — MASTER TEMPLATE ----------------
  p2.rect(0, 0, W, 74, C.navy);
  drawLogo(p2, 24, 14, .50);
  p2.text(421, 22, initials + " — Consultant IA", 10, true, C.white);
  [0, 5, 10].forEach((o, i) =>
    p2.curve(365, 72 - o, 440, 49 - o, 510, 52 + o, 595, 32 + o, i % 2 ? C.cyan2 : C.cyan, .3)
  );

  // 01 Experience
  p2.text(18, 87, "01", 39, true, C.cyan);
  p2.text(86, 103, "Expérience sélectionnée", 18.5, true, C.text);

  const exp1Title = title;
  p2.roundedRect(18, 132, 559, 120, 10, C.pale, C.line, .4);
  p2.circle(51, 164, 16, [.89,.95,1]);
  p2.text(45, 153, "1", 9, true, C.blue);
  p2.paragraph(85, 145, exp1Title, 460, 11.5, 14, true, C.text, 2);
  p2.text(85, 176, "Freelance / Indépendant  •  " + location, 8.7, false, C.text);
  p2.paragraph(
    85, 197,
    bullets[0] || "Intervention sur des besoins opérationnels IA et automatisation selon les informations disponibles dans le profil.",
    452, 8.6, 11.5, false, C.muted, 3
  );
  p2.roundedRect(30, 225, 534, 22, 9, [.92,.97,.98], null);
  p2.text(40, 231, "STACK :", 7.7, true, C.green);
  p2.text(83, 231, (skills.length ? skills.slice(0,7).join("  •  ") : "Compétences à confirmer"), 7.5, true, C.text);

  // optional second experience-like block from second bullet
  p2.roundedRect(18, 266, 559, 86, 10, C.pale, C.line, .4);
  p2.circle(51, 298, 16, [.89,.95,1]);
  p2.text(45, 287, "2", 9, true, C.blue);
  p2.text(85, 280, "Repères complémentaires", 11.5, true, C.text);
  p2.paragraph(
    85, 305,
    bullets[1] || ("Modalités : " + modality + ". Disponibilité : " + availability + "."),
    452, 8.6, 11.5, false, C.muted, 3
  );

  // 02 Formation & languages / profile details
  p2.text(18, 373, "02", 39, true, C.cyan);
  p2.text(86, 389, "Formation & langues", 18.5, true, C.text);

  p2.roundedRect(18, 419, 559, 84, 10, C.pale, C.line, .4);
  p2.circle(51, 452, 16, [.89,.95,1]);
  p2.text(45, 441, "•", 14, true, C.blue);
  p2.text(85, 436, "Informations disponibles dans le profil", 11.5, true, C.text);
  p2.text(85, 461, "Formation / langues : à confirmer si absentes du profil source", 8.5, true, C.text);
  p2.text(85, 480, "Compétences : " + (skills.length ? skills.slice(0,6).join(" · ") : "à confirmer"), 8, false, C.muted);

  p2.roundedRect(18, 516, 559, 78, 10, C.pale, C.line, .4);
  p2.circle(51, 548, 16, [.89,.95,1]);
  p2.text(44, 538, "||", 10, true, C.blue);
  p2.text(85, 532, "Secteurs & modalités d’intervention", 12, true, C.text);

  const chips = [
    location,
    strengths[0] || "Expertise IA",
    strengths[1] || "Automatisation",
    modality
  ];
  let chipX = 85;
  chips.forEach((chip, i) => {
    const w = Math.min(120, Math.max(72, 18 + chip.length * 4.3));
    p2.roundedRect(chipX, 560, w, 23, 11, [.91,.98,.96], C.line, .25);
    p2.text(chipX + 8, 567, chip, 7.4, true, C.text);
    chipX += w + 7;
  });

  // 03 contact
  p2.text(18, 615, "03", 39, true, C.cyan);
  p2.text(86, 631, "Rencontrer ce consultant", 18.5, true, C.text);

  p2.roundedRect(18, 663, 559, 105, 10, C.pale, C.line, .4);
  p2.circle(51, 704, 16, [.89,.95,1]);
  p2.text(43, 694, "DDG", 8, true, C.blue);

  p2.text(85, 681, "Déborah Dian Goldcher", 11.5, true, C.text);
  p2.text(85, 706, "deborah@build-autonomia.com", 8.5, false, C.text);
  p2.text(85, 726, "06 09 74 62 40", 8.5, false, C.text);

  p2.line(315, 680, 315, 750, C.line, .45);
  p2.text(338, 681, "Échanger sur ce profil", 10.5, true, C.text);
  p2.paragraph(338, 701, "Présentez votre projet et vérifiez avec Autonomia l’adéquation de ce consultant à votre besoin.", 212, 7.8, 9.5, false, C.muted, 3);
  p2.roundedRect(338, 730, 205, 24, 12, C.navy, null);
  p2.text(351, 736, "Ouvrir la page contact", 8.5, true, C.white);
  p2.text(525, 736, "↗", 10, true, C.cyan);
  p2.text(338, 758, "build-autonomia.com/contact", 7.2, true, C.blue);

  p2.line(18, 790, 577, 790, C.line, .5);
  p2.text(20, 799, "Profil consultant — document commercial AUTONOMIA", 7, false, C.muted);
  p2.text(552, 799, "2/2", 7, true, C.text);

  // PDF assembly
  const objects = [];
  const add = body => { objects.push(body); return objects.length; };
  const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const s1 = p1.out.join("\n");
  const s2 = p2.out.join("\n");
  const c1 = add("<< /Length " + Buffer.byteLength(s1, "binary") + " >>\nstream\n" + s1 + "\nendstream");
  const c2 = add("<< /Length " + Buffer.byteLength(s2, "binary") + " >>\nstream\n" + s2 + "\nendstream");

  const linkY1 = H - 768;
  const linkY2 = H - 663;
  const annot = add("<< /Type /Annot /Subtype /Link /Rect [315 " + linkY1 + " 577 " + linkY2 + "] /Border [0 0 0] /A << /S /URI /URI (https://build-autonomia.com/contact) >> >>");

  const pagesFuture = objects.length + 3;
  const pg1 = add("<< /Type /Page /Parent " + pagesFuture + " 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /Font << /F1 " + f1 + " 0 R /F2 " + f2 + " 0 R >> >> /Contents " + c1 + " 0 R >>");
  const pg2 = add("<< /Type /Page /Parent " + pagesFuture + " 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /Font << /F1 " + f1 + " 0 R /F2 " + f2 + " 0 R >> >> /Contents " + c2 + " 0 R /Annots [" + annot + " 0 R] >>");
  const pages = add("<< /Type /Pages /Kids [" + pg1 + " 0 R " + pg2 + " 0 R] /Count 2 >>");
  const catalog = add("<< /Type /Catalog /Pages " + pages + " 0 R >>");

  const chunks = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary")];
  const offsets = [0];
  let offset = chunks[0].length;

  objects.forEach((body, i) => {
    offsets[i + 1] = offset;
    const b = Buffer.from((i + 1) + " 0 obj\n" + body + "\nendobj\n", "binary");
    chunks.push(b);
    offset += b.length;
  });

  const xrefOffset = offset;
  let xref = "xref\n0 " + (objects.length + 1) + "\n0000000000 65535 f \n";
  for (let i = 1; i <= objects.length; i++) {
    xref += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  xref += "trailer\n<< /Size " + (objects.length + 1) + " /Root " + catalog + " 0 R >>\nstartxref\n" + xrefOffset + "\n%%EOF";
  chunks.push(Buffer.from(xref, "ascii"));

  return Buffer.concat(chunks);
}

export async function GET(request) {
  const url=new URL(request.url);
  const role=String(url.searchParams.get("role")||"").trim();
  const id=String(url.searchParams.get("id")||"").trim();
  const roleTitle=String(url.searchParams.get("roleTitle")||"Consultant IA").trim();
  if(!role||!id) return Response.json({ok:false,error:"role_and_id_required"},{status:400});

  try {
    const feedBase=process.env.AUTONOMIA_CONSULTANTS_URL||"https://cockpit.build-autonomia.com/api/public/consultants";
    const feedUrl=new URL(feedBase);
    feedUrl.searchParams.set("role",role);
    feedUrl.searchParams.set("limit","12");
    const response=await fetch(feedUrl,{cache:"no-store",headers:{accept:"application/json"}});
    const payload=await response.json();
    const profile=Array.isArray(payload?.profiles)?payload.profiles.find(item=>String(item.id)===id):null;
    if(!response.ok||!payload?.ok||!profile) return Response.json({ok:false,error:"consultant_not_found"},{status:404});

    const pdf=buildPdf(profile,roleTitle);
    const filename="CV_AUTONOMIA_"+slug(profile.initials||"IA")+"_"+slug(role)+".pdf";
    return new Response(pdf,{
      status:200,
      headers:{
        "content-type":"application/pdf",
        "content-disposition":'attachment; filename="'+filename+'"',
        "cache-control":"no-store"
      }
    });
  } catch(error) {
    console.error("consultant_cv_generation_failed",error);
    return Response.json({ok:false,error:"cv_generation_failed"},{status:500,headers:{"cache-control":"no-store"}});
  }
}
