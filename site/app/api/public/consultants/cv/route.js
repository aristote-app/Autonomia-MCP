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

  function iconCircle(p, x, top, fill=[.89,.95,1]) {
    p.circle(x, top, 17, fill);
  }
  function iconPerson(p, x, top) {
    iconCircle(p, x, top);
    p.circle(x, top-5, 4.2, C.blue);
    p.roundedRect(x-7.5, top+2, 15, 8, 4, C.blue);
  }
  function iconCoins(p, x, top) {
    iconCircle(p, x, top);
    [0,1,2].forEach(i => {
      p.roundedRect(x-8+i*5, top-2-i*2, 6, 10, 2, C.blue);
      p.line(x-8+i*5, top+1-i*2, x-2+i*5, top+1-i*2, C.white, .5);
    });
  }
  function iconGear(p, x, top) {
    iconCircle(p, x, top, [.87,.97,.94]);
    p.circle(x, top, 7, C.blue);
    p.circle(x, top, 3, [.87,.97,.94]);
    for (let i=0;i<8;i++) {
      const a=i*Math.PI/4, x1=x+Math.cos(a)*8, y1=top+Math.sin(a)*8;
      const x2=x+Math.cos(a)*11, y2=top+Math.sin(a)*11;
      p.line(x1,y1,x2,y2,C.blue,2);
    }
  }
  function iconBulb(p, x, top) {
    iconCircle(p, x, top, [.86,.97,.94]);
    p.circle(x, top-3, 7, null, C.green, 1.5);
    p.line(x-4, top+4, x-2, top+9, C.green, 1.4);
    p.line(x+4, top+4, x+2, top+9, C.green, 1.4);
    p.line(x-3, top+10, x+3, top+10, C.green, 1.4);
  }
  function iconTarget(p, x, top) {
    iconCircle(p, x, top);
    p.circle(x, top, 9, null, C.blue, 1.2);
    p.circle(x, top, 5, null, C.blue, 1.2);
    p.circle(x, top, 2, C.blue);
  }
  function iconStar(p, x, top) {
    iconCircle(p, x, top, [.87,.97,.94]);
    const pts=[];
    for(let i=0;i<10;i++) {
      const a=-Math.PI/2+i*Math.PI/5;
      const r=i%2===0?9:4;
      pts.push([x+Math.cos(a)*r, top+Math.sin(a)*r]);
    }
    p.polygon(pts,C.blue);
  }
  function iconBriefcase(p, x, top) {
    iconCircle(p, x, top);
    p.roundedRect(x-9, top-5, 18, 12, 2, C.blue);
    p.roundedRect(x-4, top-9, 8, 4, 2, null, C.blue, 1.2);
    p.line(x-9, top, x+9, top, C.white, .5);
  }
  function iconRocket(p, x, top) {
    iconCircle(p, x, top);
    p.polygon([[x-3,top+7],[x+4,top-7],[x+8,top-10],[x+5,top-3]],C.blue);
    p.circle(x+3, top-4, 1.6, C.white);
    p.polygon([[x-4,top+4],[x-9,top+7],[x-5,top+9]],C.green);
  }
  function iconGlobe(p, x, top) {
    iconCircle(p, x, top);
    p.circle(x, top, 9, null, C.blue, 1.2);
    p.line(x-9, top, x+9, top, C.blue, 1);
    p.line(x, top-9, x, top+9, C.blue, 1);
  }
  function iconBars(p, x, top) {
    iconCircle(p, x, top);
    p.roundedRect(x-8, top+1, 4, 8, 1, C.blue);
    p.roundedRect(x-2, top-5, 4, 14, 1, C.blue);
    p.roundedRect(x+4, top-9, 4, 18, 1, C.blue);
  }
  function iconMail(p, x, top) {
    p.roundedRect(x-8, top-6, 16, 12, 2, C.blue);
    p.line(x-8, top-5, x, top+1, C.white, .8);
    p.line(x+8, top-5, x, top+1, C.white, .8);
  }
  function iconPhone(p, x, top) {
    // cleaner handset icon
    p.curve(x-7, top-7, x-9, top-2, x-2, top+7, x+5, top+9, C.blue, 2.6);
    p.roundedRect(x-9, top-9, 5, 8, 2, C.blue);
    p.roundedRect(x+4, top+5, 5, 8, 2, C.blue);
  }
  function iconAutonomiaMark(p, x, top) {
    // Autonomia favicon / mark only
    p.circle(x, top, 18, [.94,.98,.99]);
    p.polygon([[x-10,top+10],[x-2,top-8],[x+2,top-2],[x-5,top+10]], C.cyan2);
    p.polygon([[x,top-11],[x+12,top+10],[x+5,top+10],[x-4,top-3]], C.cyan);
    p.polygon([[x-3,top+2],[x+2,top-3],[x+10,top+10],[x+3,top+10]], C.cyan);
  }
  function iconExternal(p, x, top) {
    p.roundedRect(x-8, top-6, 12, 12, 1, null, C.blue, 1.3);
    p.line(x, top-7, x+8, top-7, C.blue, 1.3);
    p.line(x+8, top-7, x+8, top+1, C.blue, 1.3);
    p.line(x, top+1, x+8, top-7, C.blue, 1.3);
  }
  function drawSkillPill(p, x, top, label, width) {
    p.roundedRect(x, top, width, 27, 13, [.96,.98,.995], C.line, .35);
    p.text(x+10, top+8, label, 8.2, true, C.text);
  }

  // PAGE 1 — exact visual structure from validated master
  p1.rect(0, 0, W, 182, C.navy);
  drawLogo(p1, 24, 22, .72);
  [0,7,14,21].forEach((o,i)=>p1.curve(385,178-o,455,148-o,510,145+o,595,126+o,i%2?C.cyan2:C.cyan,.35));

  p1.circle(524, 52, 30, C.navy2, C.cyan, 1.8);
  p1.text(504, 40, initials, 17, true, C.white);

  const headline = roleTitle || title;
  const titleLines = wrap(headline, 28).slice(0, 2);
  p1.text(26, 80, titleLines[0] || headline, 30, true, C.white);
  if (titleLines[1]) p1.text(26, 116, titleLines[1], 30, true, C.cyan);
  else if (title.toLowerCase().includes("automation") || title.toLowerCase().includes("automatisation")) {
    p1.text(26, 116, title, 22, true, C.cyan);
  }
  p1.text(28, 157, location + "  •  " + modality, 10.5, false, C.white);

  // Why relevant
  p1.roundedRect(18, 195, 559, 115, 10, [.95,.99,.98], C.line, .4);
  iconBulb(p1, 49, 225);
  p1.line(82, 206, 82, 296, C.line, .7);
  p1.text(96, 207, "Pourquoi ce profil peut être pertinent", 16.5, true, C.text);

  const reasons = [
    bullets[0] || "Capacité à transformer un besoin métier en solution IA concrète.",
    skills.length ? "Maîtrise déclarée : " + skills.slice(0, 5).join(" · ") + "." : "Compétences à confirmer lors du cadrage.",
    profile.remote ? "Approche opérationnelle compatible avec une intervention remote / hybride." : "Approche opérationnelle à cadrer selon le contexte de mission."
  ];
  reasons.forEach((r,i)=>{
    p1.circle(104, 242+i*22, 6, C.green);
    p1.text(101.5, 236.7+i*22, "✓", 8, true, C.white);
    p1.paragraph(120, 234+i*22, r, 430, 9.7, 12, false, C.text, 2);
  });

  // Positioning / TJM
  p1.roundedRect(18, 324, 322, 132, 10, C.pale, C.line, .4);
  iconPerson(p1, 49, 355);
  p1.text(80, 341, "Positionnement", 16, true, C.text);
  p1.paragraph(80, 377, bullets[0] || title, 235, 10.3, 14, false, C.muted, 5);

  p1.roundedRect(350, 324, 227, 132, 10, C.pale, C.line, .4);
  iconCoins(p1, 382, 355);
  p1.text(414, 341, "TJM AUTONOMIA", 9, true, C.text);
  p1.paragraph(414, 365, rate, 145, 18, 20, true, C.text, 2);
  p1.line(370, 404, 558, 404, C.line, .55);
  p1.text(414, 414, "Disponibilité : " + availability, 8.7, true, C.text);
  p1.line(370, 433, 558, 433, C.line, .55);
  p1.text(414, 440, "Modalités : " + modality, 8.7, true, C.text);

  // Expertise
  p1.roundedRect(18, 470, 559, 95, 10, [.975,.985,.995], C.line, .4);
  iconGear(p1, 49, 500);
  p1.text(82, 486, "Expertises clés", 16, true, C.text);
  let sx = 30;
  const displaySkills = skills.length ? skills : ["IA générative","Automatisation","Prompt engineering"];
  displaySkills.slice(0,8).forEach(skill=>{
    const w=Math.min(92,Math.max(52,16+skill.length*5.2));
    drawSkillPill(p1,sx,520,skill,w);
    sx += w+6;
  });

  // Use cases
  p1.roundedRect(18, 579, 559, 154, 10, [.982,.989,.996], C.line, .4);
  iconTarget(p1, 49, 608);
  p1.text(82, 594, "Cas d’usage maîtrisés", 16, true, C.text);
  useCases.slice(0,4).forEach((u,i)=>{
    const x=30+i*139;
    if(i>0) p1.line(x-8, 628, x-8, 714, C.line, .5);
    p1.circle(x+14, 643, 13, i%2 ? C.green : C.blue);
    p1.text(x+8, 635, String(i+1).padStart(2,"0"), 7.2, true, C.white);
    p1.paragraph(x, 665, u[0], 122, 9.6, 11.5, true, C.text, 2);
    p1.paragraph(x, 691, u[1], 122, 7.6, 9.6, false, C.muted, 3);
  });

  // Strengths
  p1.roundedRect(18, 746, 559, 70, 10, [.965,.99,.98], C.line, .4);
  iconStar(p1, 49, 773);
  p1.text(82, 759, "Points forts marquants", 15.5, true, C.text);
  strengths.slice(0,4).forEach((label,i)=>{
    const x=30+i*139;
    p1.roundedRect(x, 789, 128, 22, 11, [.91,.98,.96], C.line, .3);
    p1.text(x+10, 795, label, 7.7, true, C.text);
  });

  p1.line(18, 826, 577, 826, C.line, .55);
  p1.text(20, 832, "Profil consultant — document commercial AUTONOMIA", 6.5, false, C.muted);
  p1.text(552, 832, "1/2", 6.5, true, C.text);

  // PAGE 2
  p2.rect(0, 0, W, 92, C.navy);
  drawLogo(p2, 24, 18, .62);
  p2.text(424, 27, initials + " — Consultant IA", 10.5, true, C.white);
  [0,6,12].forEach((o,i)=>p2.curve(360,88-o,445,56-o,520,58+o,595,39+o,i%2?C.cyan2:C.cyan,.33));

  p2.text(18, 104, "01", 40, true, C.cyan);
  p2.text(92, 120, "Expérience sélectionnée", 18.5, true, C.text);

  // Experience 1
  p2.roundedRect(18, 152, 559, 160, 10, C.pale, C.line, .4);
  iconBriefcase(p2, 50, 186);
  p2.paragraph(88, 166, title, 460, 12.2, 14.5, true, C.text, 2);
  p2.text(88, 203, "Freelance / Indépendant  •  " + location, 9.5, false, C.text);
  p2.paragraph(88, 231, bullets[0] || "Intervention sur des sujets IA, automatisation et intégration d’outils selon les informations disponibles.", 455, 9.1, 12, false, C.muted, 4);
  p2.roundedRect(30, 278, 533, 22, 10, [.92,.97,.98], null);
  p2.text(40, 284, "STACK :", 7.8, true, C.green);
  p2.text(82, 284, displaySkills.slice(0,7).join("   •   "), 7.6, true, C.text);

  // Experience 2
  p2.roundedRect(18, 328, 559, 105, 10, C.pale, C.line, .4);
  iconRocket(p2, 50, 360);
  p2.text(88, 343, "Repères complémentaires", 12.2, true, C.text);
  p2.paragraph(88, 376, bullets[1] || "Périmètre complémentaire à préciser : contexte métier, niveau d’autonomie, livrables et environnement technique.", 455, 9.1, 12, false, C.muted, 4);

  // 02
  p2.text(18, 456, "02", 40, true, C.cyan);
  p2.text(98, 472, "Formation & langues", 18.5, true, C.text);

  p2.roundedRect(18, 505, 559, 103, 10, C.pale, C.line, .4);
  iconGlobe(p2, 50, 538);
  p2.text(88, 520, "Formation & langues — informations disponibles", 12, true, C.text);
  p2.paragraph(88, 548, "Les informations de formation, certification et langues sont affichées lorsqu’elles figurent dans le profil source vérifié.", 455, 8.8, 11.5, false, C.muted, 3);
  p2.text(88, 588, "Compétences : " + displaySkills.slice(0,5).join(" · "), 8.6, false, C.text);

  p2.roundedRect(18, 620, 559, 88, 10, C.pale, C.line, .4);
  iconBars(p2, 50, 652);
  p2.text(88, 634, "Secteurs & modalités d’intervention", 12.2, true, C.text);
  const sectorChips = [location, strengths[0] || "PME / TPE", strengths[1] || "IA générative", modality];
  let cx2=88;
  sectorChips.forEach(label=>{
    const w=Math.min(120,Math.max(76,18+label.length*4.8));
    p2.roundedRect(cx2, 667, w, 25, 12, [.91,.98,.96], C.line, .3);
    p2.text(cx2+10, 674, label, 7.7, true, C.text);
    cx2 += w+7;
  });

  // 03
  p2.text(18, 728, "03", 40, true, C.cyan);
  p2.text(98, 744, "Rencontrer ce consultant", 18.5, true, C.text);

  p2.roundedRect(18, 777, 559, 50, 10, C.pale, C.line, .4);
  iconAutonomiaMark(p2, 50, 802);
  p2.text(88, 786, "Déborah Dian Goldcher", 11, true, C.text);
  iconMail(p2, 92, 809);
  p2.text(108, 803, "deborah@build-autonomia.com", 8.5, false, C.text);
  iconPhone(p2, 92, 824);
  p2.text(108, 818, "06 09 74 62 40", 8.5, false, C.text);

  p2.line(316, 785, 316, 823, C.line, .45);
  iconExternal(p2, 339, 798);
  p2.text(355, 786, "Échanger sur ce profil", 10.2, true, C.text);
  p2.roundedRect(339, 807, 210, 18, 9, C.navy, null);
  p2.text(350, 812, "Prendre RDV", 7.8, true, C.white);

  // PDF assembly
  const objects = [];
  const add = body => { objects.push(body); return objects.length; };
  const f1 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const f2 = add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const s1 = p1.out.join("\n"), s2 = p2.out.join("\n");
  const c1 = add("<< /Length " + Buffer.byteLength(s1, "binary") + " >>\nstream\n" + s1 + "\nendstream");
  const c2 = add("<< /Length " + Buffer.byteLength(s2, "binary") + " >>\nstream\n" + s2 + "\nendstream");
  const annot = add("<< /Type /Annot /Subtype /Link /Rect [339 " + (H-827) + " 559 " + (H-777) + "] /Border [0 0 0] /A << /S /URI /URI (https://calendly.com/deborah-build-autonomia/30min) >> >>");
  const pagesFuture = objects.length + 3;
  const pg1 = add("<< /Type /Page /Parent " + pagesFuture + " 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /Font << /F1 " + f1 + " 0 R /F2 " + f2 + " 0 R >> >> /Contents " + c1 + " 0 R >>");
  const pg2 = add("<< /Type /Page /Parent " + pagesFuture + " 0 R /MediaBox [0 0 " + W + " " + H + "] /Resources << /Font << /F1 " + f1 + " 0 R /F2 " + f2 + " 0 R >> >> /Contents " + c2 + " 0 R /Annots [" + annot + " 0 R] >>");
  const pages = add("<< /Type /Pages /Kids [" + pg1 + " 0 R " + pg2 + " 0 R] /Count 2 >>");
  const catalog = add("<< /Type /Catalog /Pages " + pages + " 0 R >>");

  const chunks = [Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n", "binary")];
  const offsets = [0]; let offset = chunks[0].length;
  objects.forEach((body,i)=>{
    offsets[i+1]=offset;
    const b=Buffer.from((i+1)+" 0 obj\n"+body+"\nendobj\n","binary");
    chunks.push(b); offset+=b.length;
  });
  const xrefOffset=offset;
  let xref="xref\n0 "+(objects.length+1)+"\n0000000000 65535 f \n";
  for(let i=1;i<=objects.length;i++) xref+=String(offsets[i]).padStart(10,"0")+" 00000 n \n";
  xref+="trailer\n<< /Size "+(objects.length+1)+" /Root "+catalog+" 0 R >>\nstartxref\n"+xrefOffset+"\n%%EOF";
  chunks.push(Buffer.from(xref,"ascii"));
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
