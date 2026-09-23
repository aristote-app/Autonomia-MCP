function unique(values = []) {
  return [...new Set(values.filter(Boolean))];
}

function node(id, type, label, meta = {}) {
  return { id, type, label, ...meta };
}

function edge(from, to, relation) {
  return { from, to, relation };
}

function safeId(prefix, value) {
  return prefix + ":" + String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function buildAccountOpportunityGraph(account = {}) {
  const nodes = [];
  const edges = [];
  const accountId = safeId("account", account.slug || account.name || "account");

  nodes.push(node(accountId, "account", account.name || "Compte"));

  const signals = (account.timeline || []).slice(0, 8);
  for (const signal of signals) {
    const signalId = safeId("signal", signal.id || signal.source_url || signal.title);
    nodes.push(node(signalId, "signal", signal.title || "Signal", {
      source_id: signal.source_id || null,
      source_url: signal.source_url || null,
      date: signal.date || null,
      kind: signal.kind || null
    }));
    edges.push(edge(signalId, accountId, "observé chez"));
  }

  const offers = unique(account.offers || []);
  for (const offer of offers) {
    const offerId = safeId("offer", offer);
    nodes.push(node(offerId, "offer", offer, {
      recommended: offer === account.recommended_offer
    }));
    edges.push(edge(accountId, offerId, "peut ouvrir"));
  }

  const roles = (account.decision_roles || []).slice(0, 5);
  for (const role of roles) {
    const roleId = safeId("role", role.label);
    nodes.push(node(roleId, "decision_role", role.label, {
      reason: role.reason || null
    }));
    edges.push(edge(accountId, roleId, "cible"));
  }

  const kinds = unique((account.timeline || []).map((event) => {
    if (event.kind === "training") return "Formation / adoption";
    if (event.kind === "freelance") return "Staffing / freelance";
    if (event.kind === "public") return "Commande publique";
    if (event.kind === "private") return "Projet / transformation";
    return null;
  }));

  for (const need of kinds) {
    const needId = safeId("need", need);
    nodes.push(node(needId, "need", need));
    edges.push(edge(accountId, needId, "besoin détecté"));

    for (const offer of offers) {
      const offerId = safeId("offer", offer);
      const related =
        (/formation/i.test(need) && /formation|adoption/i.test(offer)) ||
        (/staffing/i.test(need) && /staffing|freelance/i.test(offer)) ||
        (/commande/i.test(need) && /marché public|ao/i.test(offer)) ||
        (/projet|transformation/i.test(need) && /prestation|automatisation/i.test(offer));

      if (related) edges.push(edge(needId, offerId, "oriente vers"));
    }
  }

  return {
    account_id: accountId,
    nodes,
    edges,
    stats: {
      signals: nodes.filter((item) => item.type === "signal").length,
      needs: nodes.filter((item) => item.type === "need").length,
      decision_roles: nodes.filter((item) => item.type === "decision_role").length,
      offers: nodes.filter((item) => item.type === "offer").length
    }
  };
}
