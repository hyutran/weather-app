"use client";

import { getWeatherIcon } from "../lib/weatherIcon";
import { getWeatherDescription } from "../lib/weatherDescription";
import { isNightTime } from "../lib/utils";
import { LocationCard } from "./LocationCard";
import { AddCityDialog } from "./AddCityDialog";
import { useWeather } from "../context/WeatherContext";

function LocationCardSkeleton({ name }: { name: string }) {
  return (
    <div className="h-full min-h-28 rounded-4xl bg-white/10 px-5 py-6 shadow-md/80 shadow-black/30 inset-shadow-xs inset-shadow-white/20 sm:px-6 xl:px-7 ">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground text-shadow-md">
            {name}
          </h2>
          <div className="mt-2 h-3.5 w-28 animate-pulse-shimmering rounded-full bg-white/20" />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-9 w-14 animate-pulse-shimmering rounded-full bg-white/20" />
          <div className="size-12 animate-pulse-shimmering rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export function CityList() {
  const {
    userCities,
    weatherBySlug,
    hardRefreshPendingSlugs,
    addCity,
    removeCity,
  } = useWeather();

  return (
    <div className="mx-auto max-w-xl px-6 py-32">
      <div className="mb-3 flex justify-end">
        {/* <button
          type="button"
          onClick={() => void refreshAll()}
          disabled={!hasHydrated || isRefreshing}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium text-foreground/70 transition-colors hover:bg-white/10 hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
        >
          <RefreshCwIcon
            className={`size-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh weather
        </button> */}
      </div>
      <ul className="flex flex-col gap-3">
        {userCities.map((city) => {
          const entry = weatherBySlug[city.slug];
          const isHardRefreshPending = hardRefreshPendingSlugs.has(
            city.slug
          );

          if (!entry || isHardRefreshPending) {
            return (
              <li key={city.slug} className="h-full">
                <LocationCardSkeleton name={city.name} />
              </li>
            );
          }

          const { weather } = entry;
          const Icon = getWeatherIcon(weather.current.weatherCode);
          const description = getWeatherDescription(
            weather.current.weatherCode
          );
          const isNight = isNightTime(
            weather.current.timezone,
            weather.current.sunrise,
            weather.current.sunset
          );

          return (
            <li key={city.slug} className="h-full animate-fade-in">
              <LocationCard
                slug={city.slug}
                name={city.name}
                description={description}
                temperature={weather.current.temperature}
                timezone={weather.current.timezone}
                Icon={Icon}
                isNight={isNight}
                weatherCode={weather.current.weatherCode}
                onRemove={() => removeCity(city.slug)}
              />
            </li>
          );
        })}
        <li className="h-full">
          <AddCityDialog
            existingSlugs={userCities.map((city) => city.slug)}
            onAdd={(city) => void addCity(city)}
          />
        </li>
      </ul>
    </div>
  );
}
