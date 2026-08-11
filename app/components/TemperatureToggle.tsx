"use client";

import { Switch } from "@/components/ui/switch";
import { useTemperatureScale } from "../context/TemperatureScaleContext";

export function TemperatureToggle() {
  const { scale, toggleScale } = useTemperatureScale();
  const isFahrenheit = scale === "fahrenheit";

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 inset-shadow-xs inset-shadow-white/20 backdrop-blur-sm transition-colors duration-300 hover:bg-white/15">
      <span
        className={`text-xs font-semibold transition-colors duration-300 ${
          isFahrenheit ? "text-muted-foreground" : "text-foreground text-shadow-sm"
        }`}
      >
        °C
      </span>
      <Switch
        checked={isFahrenheit}
        onCheckedChange={toggleScale}
        aria-label={`Temperature unit: degrees ${isFahrenheit ? "Fahrenheit" : "Celsius"}`}
      />
      <span
        className={`text-xs font-semibold transition-colors duration-300 ${
          isFahrenheit ? "text-foreground text-shadow-sm" : "text-muted-foreground"
        }`}
      >
        °F
      </span>
    </div>
  );
}
