const CONTACTED = new Set(["queued","active","replied","meeting","proposal","won","lost"]);
const REPLIED = new Set(["replied","meeting","proposal","won","lost"]);
const MEETING = new Set(["meeting","proposal","won","lost"]);
const PROPOSAL = new Set(["proposal","won","lost"]);
const TERMINAL = new Set(["won","lost"]);

function pct(part, total) {
  if (!total) return null;
  return Math.round((part / total) * 1000) / 10;
}

function clean(value, fallback = "Non renseigné") {
  const text = String(value || "").trim();
  return text || fallback;
}

function groupBy(items, selector) {
  const groups = new Map();
  for (const item of items) {
    const key = clean(selector(item));
    const current = groups.get(key) || [];
    current.push(item);
    groups.set(key, current);
  }

  return [...groups.entries()]
    .map(([key, group]) => {
      const contacted = group.filter((item) => CONTACTED.has(item.outreach_status)).length;
      const replies = group.filter((item) => REPLIED.has(item.outreach_status)).length;
      const meetings = group.filter((item) => MEETING.has(item.outreach_status)).length;
      const proposals = group.filter((item) => PROPOSAL.has(item.outreach_status)).length;
      const won = group.filter((item) => item.outreach_status === "won").length;
      const lost = group.filter((item) => item.outreach_status === "lost").length;
      const concluded = won + lost;

      return {
        key,
        contacts: group.length,
        contacted,
        replies,
        meetings,
        proposals,
        won,
        lost,
        concluded,
        reply_rate: pct(replies, contacted),
        meeting_rate: pct(meetings, contacted),
        observed_win_rate: pct(won, concluded)
      };
    })
    .sort((a, b) => b.contacts - a.contacts || a.key.localeCompare(b.key, "fr"));
}

export function buildSalesLearningSnapshot(contacts = []) {
  const items = Array.isArray(contacts) ? contacts : [];
  const contacted = items.filter((item) => CONTACTED.has(item.outreach_status)).length;
  const replies = items.filter((item) => REPLIED.has(item.outreach_status)).length;
  const meetings = items.filter((item) => MEETING.has(item.outreach_status)).length;
  const proposals = items.filter((item) => PROPOSAL.has(item.outreach_status)).length;
  const won = items.filter((item) => item.outreach_status === "won").length;
  const lost = items.filter((item) => item.outreach_status === "lost").length;
  const concluded = won + lost;

  return {
    generated_at: new Date().toISOString(),
    sample_size: items.length,
    learning_ready: concluded >= 20 && contacted >= 40,
    learning_reason:
      concluded >= 20 && contacted >= 40
        ? "Volume suffisant pour commencer à tester des ajustements de priorisation, avec validation humaine."
        : `Collecte en cours : ${concluded}/20 issues conclues et ${contacted}/40 contacts travaillés.`,
    funnel: {
      contacts: items.length,
      verified: items.filter((item) => item.verification_status === "verified").length,
      enriched: items.filter((item) => item.enrichment_status === "enriched").length,
      contacted,
      replies,
      meetings,
      proposals,
      won,
      lost,
      reply_rate: pct(replies, contacted),
      meeting_rate: pct(meetings, contacted),
      proposal_rate: pct(proposals, contacted),
      observed_win_rate: pct(won, concluded)
    },
    by_offer: groupBy(items, (item) => item.metadata?.offer_track),
    by_role: groupBy(items, (item) => item.matched_role || item.role_title),
    by_trigger_source: groupBy(items, (item) => item.metadata?.trigger_source)
  };
}
