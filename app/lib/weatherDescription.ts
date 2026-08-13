export function getWeatherDescription(weatherCode: number): string {
  // WMO Weather interpretation codes
  if (weatherCode === 0) return "Clear sky";
  if (weatherCode === 1) return "Mainly clear";
  if (weatherCode === 2) return "Partly cloudy";
  if (weatherCode === 3) return "Overcast";
  if (weatherCode === 45) return "Fog";
  if (weatherCode === 48) return "Depositing rime fog";
  if (weatherCode === 51) return "Light drizzle";
  if (weatherCode === 53) return "Moderate drizzle";
  if (weatherCode === 55) return "Dense drizzle";
  if (weatherCode === 56) return "Light freezing drizzle";
  if (weatherCode === 57) return "Dense freezing drizzle";
  if (weatherCode === 61) return "Slight rain";
  if (weatherCode === 63) return "Moderate rain";
  if (weatherCode === 65) return "Heavy rain";
  if (weatherCode === 66) return "Light freezing rain";
  if (weatherCode === 67) return "Heavy freezing rain";
  if (weatherCode === 71) return "Slight snow";
  if (weatherCode === 73) return "Moderate snow";
  if (weatherCode === 75) return "Heavy snow";
  if (weatherCode === 77) return "Snow grains";
  if (weatherCode === 80) return "Slight rain showers";
  if (weatherCode === 81) return "Moderate rain showers";
  if (weatherCode === 82) return "Violent rain showers";
  if (weatherCode === 85) return "Slight snow showers";
  if (weatherCode === 86) return "Heavy snow showers";
  if (weatherCode === 95) return "Thunderstorm";
  if (weatherCode === 96) return "Thunderstorm with slight hail";
  if (weatherCode === 99) return "Thunderstorm with heavy hail";

  return "Unknown";
}