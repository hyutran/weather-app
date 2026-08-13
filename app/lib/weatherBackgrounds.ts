import type { CSSProperties } from "react";

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

export function getWeatherBackground(
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
