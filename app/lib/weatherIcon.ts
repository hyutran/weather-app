import { WeatherIcon } from "./types";
import { PartlyCloudy, ClearSky, MainlyClear, Overcast, Rainy, Snow, Thunderstorm } from "../components/icons";

export function getWeatherIcon(weatherCode: number): WeatherIcon {
  // Map weather codes to icons
  switch (weatherCode) {
    case 0: // Clear sky
      return ClearSky;
    case 1: // Mainly clear
      return MainlyClear;
    case 2: // Partly cloudy
      return PartlyCloudy;
    case 3: // Overcast
      return Overcast;
    case 45: // Fog
    case 48: // Depositing rime fog
      return Overcast;
    case 51: // Light drizzle
    case 53: // Moderate drizzle
    case 55: // Dense drizzle
      return Rainy;
    case 61: // Slight rain
    case 63: // Moderate rain
    case 65: // Heavy rain
      return Rainy;
    case 71: // Slight snow fall
    case 73: // Moderate snow fall
    case 75: // Heavy snow fall
      return Snow;
    case 80: // Slight rain showers
    case 81: // Moderate rain showers
    case 82: // Violent rain showers
      return Rainy;
    case 95: // Slight thunderstorm
    case 96: // Moderate thunderstorm
    case 99: // Heavy thunderstorm
      return Thunderstorm;
    default:
      return PartlyCloudy; // Default to partly cloudy for unknown codes
  }
}