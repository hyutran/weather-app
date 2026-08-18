import Link from "next/link";
import { XIcon } from "lucide-react";
import { getCurrentTimeInTimezone } from "../lib/dateTime";
import { WeatherIcon } from "../lib/types";
import { getWeatherSurfaceProps } from "../lib/weatherBackgrounds";
import { TemperatureValue } from "./TemperatureValue";
import { weatherCardSurface } from "./weatherCardSurface";

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
  return (
    <div className="group/card relative h-full">
      <Link
        href={`/${slug}`}
        draggable={false}
        {...getWeatherSurfaceProps(
          weatherCode,
          isNight,
          "card",
          `${weatherCardSurface} block h-full`
        )}
      >
        <div className="flex justify-between items-center gap-1">
          <div>
            <h2 className="text-base font-semibold text-foreground text-on-weather">{name}</h2>
            <p className="text-sm text-muted-foreground text-on-weather-sm">
              {getCurrentTimeInTimezone(timezone)} - {description}
            </p>
          </div>
          <div className="flex gap-6 items-center">
            <span className="font-minecart text-4xl font-light text-foreground text-on-weather">
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
        // The white glyph and focus ring stay literal on purpose: this button
        // sits on top of an arbitrary weather gradient, so it has to remain
        // legible regardless of what is behind it or which theme is active.
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${name}`}
          className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full bg-foreground/10 text-white opacity-0 shadow-sm backdrop-blur-sm transition-opacity duration-200 hover:bg-foreground/30 group-hover/card:opacity-100 focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-white/60"
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}
