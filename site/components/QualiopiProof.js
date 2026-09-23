export default function QualiopiProof({ compact = false }) {
  const label = process.env.QUALIOPI_PUBLIC_LABEL;
  const certificateUrl = process.env.QUALIOPI_CERTIFICATE_URL;

  if (!label) return null;

  return (
    <aside className={compact ? "qualiopiProof compact" : "qualiopiProof"} aria-label="Information Qualiopi">
      <div>
        <span>QUALIOPI</span>
        <strong>{label}</strong>
      </div>
      {certificateUrl && (
        <a href={certificateUrl} target="_blank" rel="noreferrer">
          Vérifier le certificat ↗
        </a>
      )}
    </aside>
  );
}
