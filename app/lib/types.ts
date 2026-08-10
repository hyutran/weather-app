import { ComponentType } from "react";

export interface WeatherIconProps {
    className?: string;
    isNight?: boolean;
}

export type WeatherIcon = ComponentType<WeatherIconProps>;

export interface CurrentWeather {
    temperature: number;
    weatherCode: number;
    timezone: string;
    sunrise: string;
    sunset: string;
}

export interface DailyForecast {
    date: string;
    maxTemp: number;
    minTemp: number;
    weatherCode: number;
}

export interface WeatherData {
    current: CurrentWeather;
    daily: DailyForecast[];
}

export interface HourlyForecast {
    time: string;
    hourOffset: number;
    temperature: number;
    weatherCode: number;
    precipitationChance: number;
}

export interface SunEvent {
    label: string;
    hourOffset: number;
}