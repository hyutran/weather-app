"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTemperatureScale } from "../context/TemperatureScaleContext";

// Dropdown for switching the app's temperature scale between Celsius and Fahrenheit.
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
        className="h-9 min-h-10 min-w-10 rounded-full bg-foreground/10 px-4 text-sm font-medium text-foreground text-on-weather-sm shadow-sm inset-shadow-xs inset-shadow-(color:--weather-card-inset-highlight) backdrop-blur-sm hover:bg-foreground/15 focus-visible:border-foreground/30 focus-visible:ring-foreground/20 [&_svg]:text-muted-foreground"
      >
        <SelectValue>
          {(value) => (value === "fahrenheit" ? "°F" : "°C")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent
        align="end"
        alignItemWithTrigger={false}
        sideOffset={8}
        className="surface-overlay min-w-40 p-1.5 text-popover-foreground"
      >
        <SelectItem
          value="celsius"
          className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground data-highlighted:bg-foreground/10 data-highlighted:text-popover-foreground data-selected:bg-foreground/15 data-selected:text-popover-foreground"
        >
          Celsius (°C)
        </SelectItem>
        <SelectItem
          value="fahrenheit"
          className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground data-highlighted:bg-foreground/10 data-highlighted:text-popover-foreground data-selected:bg-foreground/15 data-selected:text-popover-foreground"
        >
          Fahrenheit (°F)
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
