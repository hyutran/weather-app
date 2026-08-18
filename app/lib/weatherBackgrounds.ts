import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface WeatherPalette {
  base: string;
  glow: string;
  glowBright: string;
}

function getWeatherPalette(code: number, isNight: boolean): WeatherPalette {
  // Clear sky (0), Mainly clear (1), Partly cloudy (2)
  if ([0, 1, 2].includes(code)) {
    return isNight
      ? {
          base: "oklch(2% 0.12 260)",
          glow: "oklch(35% 0.15 260)",
          glowBright: "oklch(48% 0.3 250)",
        }
      : {
          base: "oklch(5% 0.15 250)",
          glow: "oklch(65% 0.3 250)",
          glowBright: "oklch(78% 0.28 250)",
        };
  }

  // Thunderstorm (95, 96, 99) - darkest variant
  if ([95, 96, 99].includes(code)) {
    return isNight
      ? {
          base: "oklch(5% 0.07 260)",
          glow: "oklch(25% 0.04 260)",
          glowBright: "oklch(42% 0.05 260)",
        }
      : {
          base: "oklch(25% 0.02 257)",
          glow: "oklch(55% 0.05 257)",
          glowBright: "oklch(68% 0.06 257)",
        };
  }

  // Overcast (3), Fog (45, 48), Rainy (51, 53, 55, 61, 63, 65, 80, 81, 82), Snow (71, 73, 75), Default
  return isNight
    ? {
        base: "oklch(2% 0.07 260)",
        glow: "oklch(45% 0.045 266)",
        glowBright: "oklch(52% 0.055 266)",
      }
    : {
        base: "oklch(25% 0.02 257)",
        glow: "oklch(65% 0.05 257)",
        glowBright: "oklch(78% 0.06 257)",
      };
}

interface WeatherBackground {
  className: string;
  style: CSSProperties & {
    "--weather-base": string;
    "--weather-glow": string;
    "--weather-glow-bright": string;
  };
}

function getWeatherBackground(
  code: number,
  isNight: boolean
): WeatherBackground {
  const { base, glow, glowBright } = getWeatherPalette(code, isNight);

  return {
    className: "weather-background",
    style: {
      "--weather-base": base,
      "--weather-glow": glow,
      "--weather-glow-bright": glowBright,
    },
  };
}

// The two `.weather-background--*` recipes in globals.css. Both build on the
// same `.weather-background` base and the same three palette custom properties;
// they differ only in how far the gradient and glows are thrown.
type WeatherSurfaceVariant = "card" | "detail";

const WEATHER_SURFACE_VARIANT_CLASS: Record<WeatherSurfaceVariant, string> = {
  card: "weather-background--card",
  detail: "weather-background--detail",
};

// Every prop a weather-painted surface needs, in one object to spread.
//
// The palette travels as inline custom properties rather than classes, so the
// className and the style are two halves of one decision — a call site that
// spreads only the first gets the recipe with no colours in it, and nothing in
// the type system objects. Returning them together is what removes that gap.
// Consumers differ in root element (`Link`, `div`), so this is a props getter
// rather than a wrapper component.
export function getWeatherSurfaceProps(
  code: number,
  isNight: boolean | undefined,
  variant: WeatherSurfaceVariant,
  className?: string
): WeatherBackground {
  const background = getWeatherBackground(code, isNight ?? false);

  return {
    className: cn(
      background.className,
      WEATHER_SURFACE_VARIANT_CLASS[variant],
      className
    ),
    style: background.style,
  };
}
