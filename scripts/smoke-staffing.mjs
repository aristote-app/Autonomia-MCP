import {
  matchConsultantToOpportunity,
  rankConsultantsForOpportunity,
  rankOpportunitiesForConsultant
} from "../lib/staffing/matcher.js";

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const opportunity = {
  id: "opp-1",
  title: "Lead RAG / LLM",
  requiredSkills: ["RAG", "LLM", "Python"],
  preferredSkills: ["Azure", "MLOps"],
  startDate: "2026-10-01",
  tjmMax: 900,
  location: "Paris",
  remoteAllowed: true
};

const consultant = {
  id: "c-1",
  name: "Consultant A",
  skills: ["RAG", "LLM", "Python", "Azure"],
  availableFrom: "2026-09-25",
  tjm: 850,
  locations: ["Paris"],
  remote: true
};

const direct = matchConsultantToOpportunity({ consultant, opportunity });
assert(direct.required.missing.length === 0, "Required skills should all match");
assert(direct.score >= 80, "Expected strong staffing score");

const ranked = rankConsultantsForOpportunity({
  opportunity,
  consultants: [
    consultant,
    {
      id: "c-2",
      name: "Consultant B",
      skills: ["Python"],
      availableFrom: "2026-09-20",
      tjm: 650,
      locations: ["Paris"],
      remote: true
    }
  ]
});

assert(ranked.matches[0].consultantId === "c-1", "Best matching consultant should rank first");
assert(ranked.matches[1].hardSkillGap === true, "Second consultant should have skill gap");

const inverse = rankOpportunitiesForConsultant({
  consultant,
  opportunities: [
    opportunity,
    {
      id: "opp-2",
      title: "Java legacy",
      requiredSkills: ["Java", "Spring"]
    }
  ]
});

assert(inverse.matches[0].opportunityId === "opp-1", "Inverse staffing should rank AI mission first");

console.log("STAFFING", {
  score: direct.score,
  coverage: direct.coverage,
  bestConsultant: ranked.matches[0].consultantName,
  bestOpportunity: inverse.matches[0].opportunityTitle
});
