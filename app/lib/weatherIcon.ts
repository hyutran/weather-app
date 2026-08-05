import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
  LucideIcon,
} from "lucide-react";

export function getWeatherIcon(code: number): LucideIcon {
  // WMO Weather interpretation codes
  // 0: Clear sky
  if (code === 0) return Sun;

  // 1, 2, 3: Mainly clear, partly cloudy, overcast
  if (code >= 1 && code <= 2) return CloudSun;
  if (code === 3) return Cloud;

  // 45, 48: Fog
  if (code === 45 || code === 48) return CloudFog;

  // 51, 53, 55: Drizzle
  if (code >= 51 && code <= 55) return CloudDrizzle;

  // 56, 57: Freezing drizzle
  if (code === 56 || code === 57) return CloudDrizzle;

  // 61, 63, 65: Rain
  if (code >= 61 && code <= 65) return CloudRain;

  // 66, 67: Freezing rain
  if (code === 66 || code === 67) return CloudRain;

  // 71, 73, 75, 77: Snow
  if (code >= 71 && code <= 77) return Snowflake;

  // 80, 81, 82: Rain showers
  if (code >= 80 && code <= 82) return CloudRain;

  // 85, 86: Snow showers
  if (code === 85 || code === 86) return Snowflake;

  // 95, 96, 99: Thunderstorm
  if (code >= 95 && code <= 99) return CloudLightning;

  return Cloud;
}