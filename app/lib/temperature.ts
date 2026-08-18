export type TemperatureScale = "celsius" | "fahrenheit";

// Cookie holding the user's preferred scale, so the server can render the same
// value the client hydrates with.
export const TEMPERATURE_SCALE_COOKIE = "temperature-scale";

export const DEFAULT_TEMPERATURE_SCALE: TemperatureScale = "celsius";

export function parseTemperatureScale(
  value: string | undefined,
): TemperatureScale {
  return value === "celsius" || value === "fahrenheit"
    ? value
    : DEFAULT_TEMPERATURE_SCALE;
}

export function convertTemperature(
  temperatureCelsius: number,
  scale: TemperatureScale,
) {
  if (scale === "fahrenheit") {
    return (temperatureCelsius * 9) / 5 + 32;
  }

  return temperatureCelsius;
}

export function formatTemperature(
  temperatureCelsius: number,
  scale: TemperatureScale,
) {
  const temperature = Math.round(
    convertTemperature(temperatureCelsius, scale),
  );
  const unit = scale === "celsius" ? "C" : "F";

  return `${temperature}°${unit}`;
}
