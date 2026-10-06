export default function AutonomiaLogo({ width = 260 }) {
  return (
    <svg
      width={width}
      viewBox="0 0 520 105"
      role="img"
      aria-label="AUTONOMIA — AI EXECUTION PARTNER"
      className="autonomiaLogoSvg"
    >
      <defs>
        <linearGradient id="aGrad1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#54E7FF"/>
          <stop offset="100%" stopColor="#35E0C0"/>
        </linearGradient>
        <linearGradient id="aGrad2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#35B9FF"/>
          <stop offset="100%" stopColor="#57F1D5"/>
        </linearGradient>
      </defs>

      {/* Logo mark from the CV: stylised A positioned to the LEFT of AUTONOMIA */}
      <polygon points="10,86 50,18 62,37 34,86" fill="url(#aGrad2)" />
      <polygon points="55,10 104,86 80,86 43,30" fill="url(#aGrad1)" />
      <polygon points="47,58 63,36 96,86 72,86" fill="url(#aGrad1)" />
      <polygon points="50,86 61,68 73,86" fill="#07111F" opacity="0.9" />

      <text
        x="121"
        y="60"
        fill="#FFFFFF"
        fontFamily="Montserrat, Arial, Helvetica, sans-serif"
        fontSize="46"
        fontWeight="500"
        letterSpacing="7"
      >
        AUTONOMIA
      </text>
      <text
        x="122"
        y="91"
        fill="#FFFFFF"
        fontFamily="Montserrat, Arial, Helvetica, sans-serif"
        fontSize="19"
        fontWeight="400"
        letterSpacing="7.2"
      >
        AI EXECUTION PARTNER
      </text>
    </svg>
  );
}
