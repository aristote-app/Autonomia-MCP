export default function AutonomiaMark({ inverse = false, size = 40 }) {
  const ink = inverse ? "#FFFFFF" : "#07111f";
  return (
    <svg
      className="autonomiaMarkSvg"
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-label="Autonomia"
    >
      <path d="M14 50 29 14h6l15 36h-8l-3.6-9H25.8L22 50h-8Zm14.5-16h7.2L32 24.8 28.5 34Z" fill={ink} />
      <rect x="44" y="10" width="8" height="8" rx="1.5" fill="#3de2d0" transform="rotate(45 48 14)" />
    </svg>
  );
}
