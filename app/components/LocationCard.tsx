import Link from "next/link";
import { XIcon } from "lucide-react";
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
  onRemove?: () => void;
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
  onRemove,
}: LocationCardProps) {
  const background = getWeatherBackground(weatherCode, isNight ?? false);

  return (
    <div className="group/card relative h-full">
      <Link
        href={`/${slug}`}
        className={`block h-full rounded-2xl px-5 py-6 shadow-md/80 shadow-black/30 inset-shadow-xs inset-shadow-white/20 transition-opacity duration-200 hover:opacity-90 sm:px-6 xl:px-7 ${background}`}
      >
        <div className="flex justify-between items-center gap-1">
          <div>
            <h2 className="text-base font-semibold text-foreground text-shadow-md">{name}</h2>
            <p className="text-sm text-foreground/70 text-shadow-sm">
              {getCurrentTimeInTimezone(timezone)} - {description}
            </p>
          </div>
          <div className="flex gap-6 items-center">
            <span className="text-4xl font-light text-foreground text-shadow-md">
              <TemperatureValue celsius={temperature} />
            </span>
            <Icon
              className="size-12 [--animation-duration:0] group-hover/card:[--animation-duration:4s]"
              isNight={isNight}
            />
          </div>
        </div>
      </Link>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="absolute top-2 right-2 flex size-6 items-center justify-center rounded-full bg-black/30 text-white opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-black/50 group-hover/card:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white/60"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
