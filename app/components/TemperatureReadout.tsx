import { cn } from "@/lib/utils";
import { TemperatureValue } from "./TemperatureValue";

// The two places a temperature is displayed at display size: the location card
// and the detail-page hero. Only the step differs — everything else about the
// treatment (Minecart, light weight, primary text tier, heavier shadow) is one
// decision, and was previously re-typed at both sites.
const TEMPERATURE_READOUT_SIZE = {
  card: "text-4xl",
  hero: "text-6xl",
} as const;

interface TemperatureReadoutProps {
  celsius: number;
  size?: keyof typeof TEMPERATURE_READOUT_SIZE;
  className?: string;
}

// Renders a temperature at display size, in the user's preferred scale.
export function TemperatureReadout({
  celsius,
  size = "card",
  className,
}: TemperatureReadoutProps) {
  return (
    <span
      className={cn(
        "font-minecart font-light text-foreground text-on-weather",
        TEMPERATURE_READOUT_SIZE[size],
        className
      )}
    >
      <TemperatureValue celsius={celsius} />
    </span>
  );
}
