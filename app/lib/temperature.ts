export type TemperatureScale = "celsius" | "fahrenheit";

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
