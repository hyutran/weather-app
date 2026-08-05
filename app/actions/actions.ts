"use server";

import { WeatherData } from "../lib/types";     

export async function getWeather(
    lat: number,
    lon: number
): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7`;

  const resonse = await fetch(url);

    if (!resonse.ok) {
        throw new Error(`Weather API error: ${resonse.status}`);
    }

    const data = await resonse.json();

    return {
        current: {
            temperature: Math.round(data.current.temperature_2m),
            weatherCode: data.current.code,
            timezone: data.timezone,
        },
        daily: data.daily.time.map((date: string, index: number) => ({
            date,
            maxTemp: Math.round(data.daily.temperature_2m_max[index]),
            minTemp: Math.round(data.daily.temperature_2m_min[index]),
            weatherCode: data.daily.weather_code[index],
        })),
    }
}