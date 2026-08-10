"use client";

import { useTemperatureScale } from "../context/TemperatureScaleContext";

export function TemperatureToggle() {
  const { scale, toggleScale } = useTemperatureScale();
  const isFahrenheit = scale === "fahrenheit";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isFahrenheit}
      aria-label={`Temperature unit: degrees ${isFahrenheit ? "Fahrenheit" : "Celsius"}`}
      onClick={toggleScale}
      className="relative grid h-9 w-20 shrink-0 grid-cols-2 items-center rounded-full border border-white/15 bg-white/10 p-1 set-shadow-xs inset-shadow-white/20 backdrop-blur-sm transition-colors duration-300 hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1 left-1 w-9 rounded-full bg-linear-to-b from-white to-gray-300 shadow-sm transition-transform duration-300 ease-out motion-reduce:transition-none ${
          isFahrenheit ? "translate-x-9" : "translate-x-0"
        }`}
      />
      <span
        className={`relative z-10 text-xs font-semibold transition-colors duration-300 ${
          isFahrenheit ? "text-muted-foreground" : "text-slate-900"
        }`}
      >
        °C
      </span>
      <span
        className={`relative z-10 text-xs font-semibold transition-colors duration-300 ${
          isFahrenheit ? "text-slate-900" : "text-muted-foreground"
        }`}
      >
        °F
      </span>
    </button>
  );
}
