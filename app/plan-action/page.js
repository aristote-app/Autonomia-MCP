import ActionPlanBoard from "./ActionPlanBoard";
import { ROADMAP_PHASES } from "./roadmapData";

export const metadata = {
  title: "Plan d'action AUTONOMIA — 90 jours",
  description: "Pilotage des actions, responsables, priorités et échéances du plan AUTONOMIA."
};

export default function ActionPlanPage() {
  return <ActionPlanBoard phases={ROADMAP_PHASES} />;
}
