"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemperatureScale } from "../context/TemperatureScaleContext";

export function TemperatureToggle() {
  const { scale, setScale } = useTemperatureScale();

  return (
    <Select
      value={scale}
      onValueChange={(value) => {
        if (value) setScale(value);
      }}
    >
      <SelectTrigger
        aria-label="Temperature unit"
        className="h-9 min-h-10 min-w-10 rounded-full border-white/15 bg-white/10 px-4 text-xs font-semibold text-white shadow-sm inset-shadow-xs inset-shadow-white/20 backdrop-blur-sm hover:bg-white/15 focus-visible:border-white/30 focus-visible:ring-white/20 dark:bg-card/40 dark:hover:bg-white/15 [&_svg]:text-white/50"
      >
        <SelectValue>
          {(value) => (value === "fahrenheit" ? "°F" : "°C")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="end"
        alignItemWithTrigger={false}
        sideOffset={8}
        className="min-w-36 rounded-2xl border border-white/15 bg-background/80 p-1.5 text-white shadow-xl shadow-black/30 inset-shadow-xs inset-shadow-white/10 backdrop-blur-xl ring-0"
      >
        <SelectItem
          value="celsius"
          className="rounded-xl px-2.5 py-2 text-xs font-medium text-white/70 data-highlighted:bg-white/10 data-highlighted:text-white data-selected:bg-white/15 data-selected:text-white"
        >
          Celsius (°C)
        </SelectItem>
        <SelectItem
          value="fahrenheit"
          className="rounded-xl px-2.5 py-2 text-xs font-medium text-white/70 data-highlighted:bg-white/10 data-highlighted:text-white data-selected:bg-white/15 data-selected:text-white"
        >
          Fahrenheit (°F)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
