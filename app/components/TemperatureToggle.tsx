"use client";

import { Switch } from "@/components/ui/switch";
import { useTemperatureScale } from "../context/TemperatureScaleContext";

export function TemperatureToggle() {
  const { scale, toggleScale } = useTemperatureScale();
  const isFahrenheit = scale === "fahrenheit";

  return (
    <div className="relative shrink-0">
      <Switch
        checked={isFahrenheit}
        onCheckedChange={toggleScale}
        aria-label={`Temperature unit: degrees ${isFahrenheit ? "Fahrenheit" : "Celsius"}`}
        className="data-[size=default]:h-9 data-[size=default]:w-19 border-white/15 bg-white/10 inset-shadow-xs inset-shadow-white/20 backdrop-blur-sm data-checked:bg-white/10 data-unchecked:bg-white/10 hover:bg-white/15 [&_[data-slot=switch-thumb]]:opacity-0"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-1 grid grid-cols-2"
      >
        <span
          className={`absolute inset-y-0 left-0 w-[34px] rounded-full bg-white/20 shadow-sm transition-transform duration-300 ${isFahrenheit ? "translate-x-[34px]" : "translate-x-0"
            }`}
        />
        <span
          className={`relative z-10 flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${isFahrenheit ? "text-white/50" : "text-white text-shadow-sm"
            }`}
        >
          °C
        </span>
        <span
          className={`relative z-10 flex items-center justify-center text-xs font-semibold transition-colors duration-300 ${isFahrenheit ? "text-white text-shadow-sm" : "text-white/50"
            }`}
        >
          °F
        </span>
      </div>
    </div>
  );
}
