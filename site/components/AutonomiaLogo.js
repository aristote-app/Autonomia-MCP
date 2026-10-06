export default function AutonomiaLogo({ width = 190, inverse = true }) {
  const primary = inverse ? "#FFFFFF" : "#07111f";
  const secondary = inverse ? "#8ea0b2" : "#66717d";
  return (
    <svg
      width={width}
      viewBox="0 0 240 52"
      role="img"
      aria-label="AUTONOMIA — AI EXECUTION PARTNER"
      className="autonomiaLogoSvg"
    >
      <text
        x="0"
        y="27"
        fill={primary}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="31"
        fontWeight="700"
        letterSpacing="-0.8"
      >
        AUTONOMI
      </text>
      <text
        x="169"
        y="27"
        fill={primary}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="31"
        fontWeight="700"
      >
        A
      </text>
      <circle cx="179.8" cy="19.2" r="3.7" fill="#3de2d0" />
      <text
        x="0"
        y="45"
        fill={secondary}
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="10.5"
        fontWeight="400"
        letterSpacing="0.15"
      >
        AI EXECUTION PARTNER
      </text>
    </svg>
  );
}
