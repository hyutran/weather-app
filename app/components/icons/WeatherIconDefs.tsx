export function WeatherIconDefs() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        {/* Yellow gradient */}
        <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "var(--color-yellow-400)" }} />
          <stop offset="100%" style={{ stopColor: "var(--color-amber-600)" }} />
        </linearGradient>

        {/* Yellow glow */}
        <radialGradient id="yellowGlow" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            style={{ stopColor: "var(--color-yellow-100)", stopOpacity: 1 }}
          />
          <stop
            offset="35%"
            style={{ stopColor: "var(--color-yellow-100)", stopOpacity: 0.7 }}
          />
          <stop
            offset="60%"
            style={{ stopColor: "var(--color-yellow-200)", stopOpacity: 0.4 }}
          />
          <stop
            offset="80%"
            style={{ stopColor: "var(--color-yellow-300)", stopOpacity: 0.15 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--color-yellow-300)", stopOpacity: 0 }}
          />
        </radialGradient>

        {/* Amber glow — the Moon's counterpart to yellowGlow. Same stop
            geometry as the Sun's so the two bodies pulse with the same falloff,
            but warmer and dimmer: moonlight should read as reflected, not
            emitted. */}
        <radialGradient id="amberGlow" cx="50%" cy="50%" r="50%">
          <stop
            offset="0%"
            style={{ stopColor: "var(--color-amber-100)", stopOpacity: 0.45 }}
          />
          <stop
            offset="35%"
            style={{ stopColor: "var(--color-amber-100)", stopOpacity: 0.3 }}
          />
          <stop
            offset="60%"
            style={{ stopColor: "var(--color-amber-200)", stopOpacity: 0.18 }}
          />
          <stop
            offset="80%"
            style={{ stopColor: "var(--color-amber-300)", stopOpacity: 0.1 }}
          />
          <stop
            offset="100%"
            style={{ stopColor: "var(--color-amber-300)", stopOpacity: 0 }}
          />
        </radialGradient>

        {/* Cloud gradient 3 - subtle warm-gray refinement */}
        <linearGradient id="cloudGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: "var(--color-gray-50)" }} />
            <stop offset="25%" style={{ stopColor: "var(--color-gray-100)" }} />
            <stop offset="50%" style={{ stopColor: "var(--color-gray-200)" }} />
            <stop offset="65%" style={{ stopColor: "var(--color-gray-300)" }} />
            <stop offset="100%" style={{ stopColor: "var(--color-gray-400)" }} />
        </linearGradient>

        {/* White inner shadow*/}
        <filter
          id="whiteInnerShadow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur" />
          <feOffset dx="0" dy="10" result="offsetBlur" />
          <feComposite
            in="SourceGraphic"
            in2="offsetBlur"
            operator="out"
            result="inverse"
          />
          <feFlood
            style={{ floodColor: "white" }}
            floodOpacity="0.5"
            result="color"
          />
          <feComposite in="color" in2="inverse" operator="in" result="shadow" />
          <feComposite in="shadow" in2="SourceGraphic" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
