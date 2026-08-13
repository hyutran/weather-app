"use server";

import { updateTag } from "next/cache";
import { WeatherData } from "../lib/types";

export async function getWeather(
  lat: number,
  lon: number,
  forceRefresh = false
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code,sunrise,sunset&timezone=auto&forecast_days=7`;
  const weatherTag = `weather:${lat}:${lon}`;

  if (forceRefresh) {
    updateTag(weatherTag);
  }

  const response = await fetch(url, {
    next: { revalidate: 5 * 60, tags: [weatherTag] },
  });

  if (!response.ok) {
    throw new Error(`Weather API error: ${response.status}`);
  }

  const weatherResponse = await response.json();

  return {
    current: {
      temperature: Math.round(weatherResponse.current.temperature_2m),
      weatherCode: weatherResponse.current.weather_code,
      timezone: weatherResponse.timezone,
      sunrise: weatherResponse.daily.sunrise[0],
      sunset: weatherResponse.daily.sunset[0],
    },
    daily: weatherResponse.daily.time.map((date: string, index: number) => ({
      date,
      maxTemp: Math.round(weatherResponse.daily.temperature_2m_max[index]),
      minTemp: Math.round(weatherResponse.daily.temperature_2m_min[index]),
      weatherCode: weatherResponse.daily.weather_code[index],
    })),
  };
}
