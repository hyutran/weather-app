export interface CurrentWeather {
    temperature: number;
    weathercode: number;
    timezone: string;
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