export default function AutonomiaMark({ inverse = false, size = 40 }) {
  const tile = inverse ? "#FFFFFF" : "#111111";
  return (
    <svg
      className="autonomiaMarkSvg"
      width={size}
      height={size}
      viewBox="0 0 102 108"
      role="img"
      aria-label="Autonomia"
    >
      <rect x="6" y="18" width="24" height="24" rx="6" fill={tile} />
      <rect x="36" y="18" width="24" height="24" rx="6" fill={tile} />
      <rect x="6" y="48" width="24" height="24" rx="6" fill={tile} />
      <rect x="36" y="48" width="24" height="24" rx="6" fill={tile} />
      <rect x="66" y="48" width="24" height="24" rx="6" fill={tile} />
      <rect x="6" y="78" width="24" height="24" rx="6" fill={tile} />
      <rect x="36" y="78" width="24" height="24" rx="6" fill={tile} />
      <rect x="66" y="78" width="24" height="24" rx="6" fill={tile} />
      <rect x="72" y="0" width="24" height="24" rx="6" fill="#FFC857" transform="rotate(12 84 12)" />
    </svg>
  );
}
