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
  const p1=streamBuilder(), p2=streamBuilder();
  const rawInitials=String(profile.initials||"IA").replace(/\./g,"").slice(0,3).toUpperCase();
  const initials=rawInitials.split("").join(".")+".";
  const title=String(profile.title||roleTitle||"Consultant IA").trim();
  const skills=unique(profile.skills||[]).slice(0,10);
  const bullets=unique(profile.cv_bullets||[]).slice(0,6);
  const location=profile.location||"France";
  const modality=profile.remote?"Remote / Hybride":"Modalités à confirmer";
  const availability=profile.availability?.label||"Disponibilité à confirmer";
  const rate=profile.tjm==null?"TJM à confirmer":new Intl.NumberFormat("fr-FR",{maximumFractionDigits:0}).format(Number(profile.tjm))+" € HT / jour";
  const useCases=deriveUseCases(profile,roleTitle);
  const strengths=deriveStrengths(profile,roleTitle);

  // PAGE 1 — approved Autonomia visual language
  p1.rect(0,0,W,184,C.navy);
  drawLogo(p1,28,25,.72);
  p1.circle(523,54,31,C.navy2,C.cyan,1.8);
  p1.text(503,42,initials,17,true,C.white);

  const titleSize=title.length>68?18:title.length>48?20:24;
  const titleLines=wrap(title,titleSize<=18?46:38).slice(0,3);
  titleLines.forEach((ln,i)=>p1.text(28,94+i*(titleSize+5),ln,titleSize,true,i===titleLines.length-1&&titleLines.length>1?C.cyan:C.white));
  const locTop=96+titleLines.length*(titleSize+5)+3;
  p1.text(30,locTop,location+"  •  "+modality,10,false,[.85,.89,.93]);

  // decorative waves
  [0,7,14,21].forEach((o,i)=>p1.curve(385,178-o,455,148-o,500,145+o,595,126+o,i%2?C.cyan2:C.cyan,.35));

  p1.roundedRect(20,198,555,112,12,[.95,.99,.98],C.line,.5);
  p1.circle(50,226,17,[.86,.97,.94]);
  p1.text(44,215,"✓",18,true,C.green);
  p1.text(78,212,"Pourquoi ce profil peut être pertinent",15,true,C.text);
  const reasons=[
    "Profil proposé pour : "+(roleTitle||"expertise IA")+".",
    skills.length?"Compétences déclarées : "+skills.slice(0,5).join(" · ")+".":"Compétences détaillées à confirmer lors du cadrage.",
    profile.remote?"Intervention remote / hybride indiquée dans le profil.":"Modalités d’intervention à cadrer selon la mission."
  ];
  reasons.forEach((r,i)=>{
    p1.circle(83,247+i*18,5,C.green);
    p1.text(80.5,242.5+i*18,"✓",7.5,true,C.white);
    p1.paragraph(96,241+i*18,r,455,9.2,11,false,C.text,2);
  });

  p1.roundedRect(20,326,322,126,12,C.pale,C.line,.5);
  p1.circle(52,356,17,[.89,.95,1]);
  p1.text(46,347,"•",18,true,C.blue);
  p1.text(80,342,"Positionnement",15,true,C.text);
  const summary=bullets[0]||title;
  p1.paragraph(80,374,summary,240,10,14,false,C.muted,5);

  p1.roundedRect(351,326,224,126,12,C.pale,C.line,.5);
  p1.text(373,345,"TJM AUTONOMIA",8.5,true,C.muted);
  p1.paragraph(373,366,rate,180,17,19,true,C.text,2);
  p1.line(373,410,553,410,C.line,.6);
  p1.text(373,421,availability,8.5,true,C.green);

  p1.roundedRect(20,468,555,84,12,[.975,.985,.995],C.line,.5);
  p1.circle(52,498,17,[.87,.97,.94]);
  p1.text(45,489,"+",18,true,C.blue);
  p1.text(80,484,"Expertises clés",15,true,C.text);
  let cx=80, cy=514;
  (skills.length?skills:["IA","Automatisation","Transformation"]).slice(0,8).forEach(skill=>{
    const w=Math.min(104,Math.max(48,14+skill.length*5.2));
    if(cx+w>556){cx=80;cy+=25}
    p1.roundedRect(cx,cy,w,20,10,C.pale2,C.line,.4);
    p1.text(cx+8,cy+5,skill,7.8,true,C.text);
    cx+=w+6;
  });

  p1.roundedRect(20,568,555,126,12,[.982,.988,.995],C.line,.5);
  p1.text(36,585,"Cas d’usage / champs d’intervention",15,true,C.text);
  const colW=128;
  useCases.forEach((u,i)=>{
    const x=34+i*136;
    if(i>0)p1.line(x-8,614,x-8,678,C.line,.5);
    p1.circle(x+13,625,13,i%2?C.green:C.blue);
    p1.text(x+8,617,String(i+1).padStart(2,"0"),7.5,true,C.white);
    p1.paragraph(x,646,u[0],colW-4,9.5,11,true,C.text,2);
    p1.paragraph(x,668,u[1],colW-4,7.6,9,false,C.muted,3);
  });

  p1.roundedRect(20,710,555,76,12,[.965,.99,.98],C.line,.5);
  p1.text(36,726,"Points forts marquants",14,true,C.text);
  strengths.forEach((s,i)=>{
    const x=36+i*132;
    p1.roundedRect(x,752,120,23,11,[.91,.98,.96],C.line,.35);
    p1.text(x+9,758,s,7.7,true,C.text);
  });

  p1.line(20,804,575,804,C.line,.6);
  p1.text(22,812,"Profil consultant — document commercial AUTONOMIA",7,false,C.muted);
  p1.text(552,812,"1/2",7,true,C.text);

  // PAGE 2
  p2.rect(0,0,W,88,C.navy);
  drawLogo(p2,25,20,.55);
  p2.text(425,27,initials+" — Consultant IA",10,true,C.white);
  [0,6,12].forEach((o,i)=>p2.curve(380,86-o,455,60-o,520,58+o,595,40+o,i%2?C.cyan2:C.cyan,.35));

  p2.text(24,112,"01",34,true,C.cyan);
  p2.text(88,122,"Expérience & repères du profil",18,true,C.text);

  const expItems=bullets.length?bullets:[
    title,
    skills.length?"Compétences clés : "+skills.slice(0,6).join(" · "):"Compétences à confirmer",
    modality
  ];
  let etop=158;
  expItems.slice(0,3).forEach((b,i)=>{
    const h=i===0?82:68;
    p2.roundedRect(24,etop,547,h,10,C.pale,C.line,.45);
    p2.circle(55,etop+28,17,[.89,.95,1]);
    p2.text(49,etop+18,String(i+1).padStart(2,"0"),8,true,C.blue);
    p2.paragraph(84,etop+15,i===0?title:b,460,i===0?11:9.3,i===0?14:12,i===0,C.text,i===0?3:4);
    if(i===0){
      p2.text(84,etop+58,location+"  •  "+modality,8.5,false,C.muted);
    }
    etop+=h+12;
  });

  const section2Top=Math.max(430,etop+2);
  p2.text(24,section2Top,"02",34,true,C.cyan);
  p2.text(88,section2Top+10,"Compétences & modalités",18,true,C.text);

  p2.roundedRect(24,section2Top+52,547,116,10,C.pale,C.line,.45);
  let sx=40, sy=section2Top+69;
  (skills.length?skills:["IA","Automatisation","Transformation"]).slice(0,8).forEach(skill=>{
    const w=Math.min(105,Math.max(50,14+skill.length*5.2));
    if(sx+w>554){sx=40;sy+=27}
    p2.roundedRect(sx,sy,w,21,10,[.93,.98,.97],C.line,.35);
    p2.text(sx+8,sy+5,skill,7.8,true,C.text);
    sx+=w+7;
  });
  p2.text(40,section2Top+127,"LOCALISATION",7,true,C.muted);
  p2.text(125,section2Top+127,location,8.5,true,C.text);
  p2.text(288,section2Top+127,"MODALITÉS",7,true,C.muted);
  p2.text(365,section2Top+127,modality,8.5,true,C.text);
  p2.text(40,section2Top+148,"DISPONIBILITÉ",7,true,C.muted);
  p2.text(125,section2Top+148,availability,8.5,true,C.text);

  const contactTop=Math.max(684,section2Top+190);
  p2.text(24,contactTop,"03",34,true,C.cyan);
  p2.text(88,contactTop+10,"Rencontrer ce consultant",18,true,C.text);
  p2.roundedRect(24,contactTop+50,547,88,10,C.pale,C.line,.45);
  p2.circle(55,contactTop+88,17,[.89,.95,1]);
  p2.text(47,contactTop+77,"DDG",8,true,C.blue);
  p2.text(84,contactTop+66,"Déborah Dian Goldcher",11,true,C.text);
  p2.text(84,contactTop+87,"deborah@build-autonomia.com",8.5,false,C.text);
  p2.text(84,contactTop+105,"06 09 74 62 40",8.5,false,C.text);
  p2.line(320,contactTop+66,320,contactTop+122,C.line,.5);
  p2.text(342,contactTop+66,"Échanger sur ce profil",10,true,C.text);
  p2.text(342,contactTop+89,"build-autonomia.com/contact",8.5,true,C.blue);
  p2.text(342,contactTop+107,"Présentez votre projet et votre besoin.",7.8,false,C.muted);

  p2.line(20,818,575,818,C.line,.6);
  p2.text(22,825,"Profil consultant — document commercial AUTONOMIA",7,false,C.muted);
  p2.text(552,825,"2/2",7,true,C.text);

  // PDF assembly
  const objects=[];
  const add=body=>{objects.push(body);return objects.length};
  const f1=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  const f2=add("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  const s1=p1.out.join("\n"), s2=p2.out.join("\n");
  const c1=add("<< /Length "+Buffer.byteLength(s1,"binary")+" >>\nstream\n"+s1+"\nendstream");
  const c2=add("<< /Length "+Buffer.byteLength(s2,"binary")+" >>\nstream\n"+s2+"\nendstream");
  const linkY1=H-(contactTop+138), linkY2=H-(contactTop+50);
  const annot=add("<< /Type /Annot /Subtype /Link /Rect [320 "+linkY1+" 571 "+linkY2+"] /Border [0 0 0] /A << /S /URI /URI (https://build-autonomia.com/contact) >> >>");
  const pagesFuture=objects.length+3;
  const pg1=add("<< /Type /Page /Parent "+pagesFuture+" 0 R /MediaBox [0 0 "+W+" "+H+"] /Resources << /Font << /F1 "+f1+" 0 R /F2 "+f2+" 0 R >> >> /Contents "+c1+" 0 R >>");
  const pg2=add("<< /Type /Page /Parent "+pagesFuture+" 0 R /MediaBox [0 0 "+W+" "+H+"] /Resources << /Font << /F1 "+f1+" 0 R /F2 "+f2+" 0 R >> >> /Contents "+c2+" 0 R /Annots ["+annot+" 0 R] >>");
  const pages=add("<< /Type /Pages /Kids ["+pg1+" 0 R "+pg2+" 0 R] /Count 2 >>");
  const catalog=add("<< /Type /Catalog /Pages "+pages+" 0 R >>");

  const chunks=[Buffer.from("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n","binary")];
  const offsets=[0]; let offset=chunks[0].length;
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
