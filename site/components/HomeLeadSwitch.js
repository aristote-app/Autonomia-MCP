"use client";

import { useEffect, useState } from "react";
import LeadForm from "@/components/LeadForm";

function readJson(key) {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.sessionStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function readLatestContext() {
  const scan = readJson("autonomia_scan_context");
  const solution = readJson("autonomia_solution_context");
  if (!scan) return { type: solution ? "solution" : null, value: solution };
  if (!solution) return { type: "scan", value: scan };

  const scanDate = Date.parse(scan.created_at || "") || 0;
  const solutionDate = Date.parse(solution.created_at || "") || 0;
  return solutionDate >= scanDate
    ? { type: "solution", value: solution }
    : { type: "scan", value: scan };
}

export default function HomeLeadSwitch() {
  const [mode, setMode] = useState("experts");
  const [scanContext, setScanContext] = useState(null);
  const [solutionContext, setSolutionContext] = useState(null);

  useEffect(() => {
    const existing = readLatestContext();
    if (existing.type === "solution" && existing.value) {
      setSolutionContext(existing.value);
      setMode(existing.value.route === "academy" ? "academy" : "experts");
    } else if (existing.type === "scan" && existing.value) {
      setScanContext(existing.value);
      setMode(existing.value.plan === "academy" ? "academy" : "experts");
    }

    function onScan(event) {
      const context = event.detail || readJson("autonomia_scan_context");
      if (!context) return;
      setSolutionContext(null);
      setScanContext(context);
      setMode(context.plan === "academy" ? "academy" : "experts");
    }

    function onSolution(event) {
      const context = event.detail || readJson("autonomia_solution_context");
      if (!context) return;
      setScanContext(null);
      setSolutionContext(context);
      setMode(context.route === "academy" ? "academy" : "experts");
    }

    window.addEventListener("autonomia-scan-complete", onScan);
    window.addEventListener("autonomia-solution-complete", onSolution);
    return () => {
      window.removeEventListener("autonomia-scan-complete", onScan);
      window.removeEventListener("autonomia-solution-complete", onSolution);
    };
  }, []);

  const handoffContext = solutionContext || scanContext;

  return (
    <div className="homeLead">
      {solutionContext && (
        <div className="scanHandoff solutionHandoffBanner">
          <span>AUTONOMIA AI MATCH</span>
          <strong>Votre besoin et les solutions proposées sont déjà joints à la demande.</strong>
          <small>{solutionContext.summary || solutionContext.original_query}</small>
        </div>
      )}

      {!solutionContext && scanContext && (
        <div className="scanHandoff">
          <span>AUTONOMIA SCAN</span>
          <strong>Votre premier plan d’exécution est déjà repris dans la demande.</strong>
          <small>{scanContext.orientation?.priority || "Vous n’avez pas à ressaisir votre besoin."}</small>
        </div>
      )}

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
        key={`${mode}-${handoffContext?.created_at || "manual"}`}
        mode={mode}
        formId={solutionContext ? "home-solution-finder" : `home-${mode}`}
        requestedService={
          solutionContext
            ? `solution_${solutionContext.route || "hybrid"}`
            : scanContext
              ? `scan_${scanContext.plan}`
              : mode
        }
        scanContext={scanContext}
        solutionContext={solutionContext}
      />
    </div>
  );
}
