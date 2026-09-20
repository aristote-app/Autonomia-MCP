"use client";

import { useEffect, useState } from "react";
import LeadForm from "@/components/LeadForm";

function readScanContext() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(window.sessionStorage.getItem("autonomia_scan_context") || "null");
  } catch {
    return null;
  }
}

export default function HomeLeadSwitch() {
  const [mode, setMode] = useState("experts");
  const [scanContext, setScanContext] = useState(null);

  useEffect(() => {
    const existing = readScanContext();
    if (existing) {
      setScanContext(existing);
      setMode(existing.plan === "academy" ? "academy" : "experts");
    }

    function onScan(event) {
      const context = event.detail || readScanContext();
      if (!context) return;
      setScanContext(context);
      setMode(context.plan === "academy" ? "academy" : "experts");
    }

    window.addEventListener("autonomia-scan-complete", onScan);
    return () => window.removeEventListener("autonomia-scan-complete", onScan);
  }, []);

  return (
    <div className="homeLead">
      {scanContext && (
        <div className="scanHandoff">
          <span>AUTONOMIA SCAN</span>
          <strong>Votre diagnostic est déjà repris dans la demande.</strong>
          <small>Vous n’avez pas à ressaisir votre besoin.</small>
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
        key={`${mode}-${scanContext?.created_at || "manual"}`}
        mode={mode}
        formId={`home-${mode}`}
        requestedService={scanContext ? `scan_${scanContext.plan}` : mode}
        scanContext={scanContext}
      />
    </div>
  );
}
