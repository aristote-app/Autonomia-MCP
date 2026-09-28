"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeStartEmail({ origin = "home", compact = false }) {
  const [email, setEmail] = useState("");
  const router = useRouter();

  function submit(event) {
    event.preventDefault();
    const value = email.trim();
    if (!value) return;

    const params = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    params.set("email", value);
    params.set("origin", origin);
    router.push(`/start?${params.toString()}`);
  }

  return (
    <form className={compact ? "homeStartEmail compact" : "homeStartEmail"} onSubmit={submit}>
      {!compact && (
        <div className="homeStartEmailCopy">
          <strong>Commencez simplement.</strong>
          <span>Laissez votre e-mail professionnel. Le parcours suivant qualifie ensuite le besoin étape par étape.</span>
        </div>
      )}
      <div className="homeStartEmailFields">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Votre e-mail professionnel"
          aria-label="Votre e-mail professionnel"
          required
        />
        <button type="submit">Commencer →</button>
      </div>
      {!compact && <small>Aucun gros formulaire dans le Hero : l’e-mail ouvre le parcours Start.</small>}
    </form>
  );
}
