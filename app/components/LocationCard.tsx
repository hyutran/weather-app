import Link from "next/link";
import { getCurrentTimeInTimezone } from "../lib/utils";
import { WeatherIcon } from "../lib/types";
import { getWeatherBackground } from "../lib/weatherBackgrounds";
import { TemperatureValue } from "./TemperatureValue";

interface LocationCardProps {
  slug: string;
  name: string;
  description: string;
  temperature: number;
  timezone: string;
  Icon: WeatherIcon;
  isNight?: boolean;
  weatherCode: number;
}

export function LocationCard({
  slug,
  name,
  description,
  temperature,
  timezone,
  Icon,
  isNight,
  weatherCode,
}: LocationCardProps) {
  const background = getWeatherBackground(weatherCode, isNight ?? false);

  return (
    <Link
      href={`/${slug}`}
      className={`group block h-full rounded-2xl bg-linear-to-b px-5 py-6 shadow-lg shadow-black/30 inset-shadow-xs inset-shadow-white/20 transition-opacity duration-200 hover:opacity-90 sm:px-6 xl:px-7 ${background}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold text-foreground text-shadow-md">{name}</h2>
          <p className="text-sm text-muted-foreground text-shadow-sm">
            {getCurrentTimeInTimezone(timezone)} - {description}
          </p>
        </div>
        <div className="flex gap-6 items-center">
          <span className="text-4xl font-light text-foreground text-shadow-md">
            <TemperatureValue celsius={temperature} />
          </span>
          <Icon 
          className="size-12 [--animation-duration:0] group-hover:[--animation-duration:4s]" 
          isNight={isNight} />
        </div>
      </div>
    </Link>
  );
}
