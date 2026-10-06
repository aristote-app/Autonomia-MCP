import Link from "next/link";

export default function PrivacyNotice({ actionLabel = "Envoyer ma demande", context = "ma demande" }) {
  return (
    <p className="privacyNote legalPrivacyNotice">
      En cliquant sur « {actionLabel} », j’accepte que mes données soient utilisées par AUTONOMIA pour me recontacter au sujet de {context}, conformément à la{" "}
      <Link href="/politique-de-confidentialite">politique de confidentialité</Link>. *
    </p>
  );
}
