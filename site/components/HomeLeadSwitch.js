"use client";

import { useState } from "react";
import LeadForm from "@/components/LeadForm";

export default function HomeLeadSwitch() {
  const [mode, setMode] = useState("experts");

  return (
    <div className="homeLead">
      <div className="leadTabs" role="tablist" aria-label="Type de besoin">
        <button
          type="button"
          className={mode === "experts" ? "active" : ""}
          onClick={() => setMode("experts")}
        >
          Experts IA
        </button>
        <button
          type="button"
          className={mode === "academy" ? "active" : ""}
          onClick={() => setMode("academy")}
        >
          Academy
        </button>
      </div>
      <LeadForm
        key={mode}
        mode={mode}
        formId={`home-${mode}`}
        requestedService={mode}
      />
    </div>
  );
}
