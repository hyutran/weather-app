"use client";

import { getWeatherIcon } from "../lib/weatherIcon";
import { getWeatherDescription } from "../lib/weatherDescription";
import { isNightTime } from "../lib/dateTime";
import { useReorderableList } from "../hooks/useReorderableList";
import { LocationCard } from "./LocationCard";
import { LocationCardSkeleton } from "./LocationCardSkeleton";
import { AddLocationDialog } from "./AddLocationDialog";
import { PageShell } from "./PageShell";
import { useLocations } from "../context/WeatherContext";
import { cn } from "@/lib/utils";

export function LocationList() {
  const {
    userLocations,
    weatherBySlug,
    hardRefreshPendingSlugs,
    addLocation,
    removeLocation,
    moveLocation,
  } = useLocations();

  const { announcement, instructionsId, getItemProps } = useReorderableList(
    userLocations,
    moveLocation
  );

  return (
    <PageShell>
      <p id={instructionsId} className="sr-only">
        Drag a location to reorder it, or focus it and press Alt or Option with
        the up or down arrow key.
      </p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
      <ul className="flex flex-col gap-3">
        {userLocations.map((location, index) => {
          const weatherEntry = weatherBySlug[location.slug];
          const isHardRefreshPending = hardRefreshPendingSlugs.has(
            location.slug
          );
          const isLoading = !weatherEntry || isHardRefreshPending;

          let content;
          if (isLoading) {
            content = <LocationCardSkeleton name={location.name} />;
          } else {
            const { weather } = weatherEntry;
            const Icon = getWeatherIcon(weather.current.weatherCode);
            const description = getWeatherDescription(
              weather.current.weatherCode
            );
            const isNight = isNightTime(
              weather.current.timezone,
              weather.current.sunrise,
              weather.current.sunset
            );

            content = (
              <LocationCard
                slug={location.slug}
                name={location.name}
                description={description}
                temperature={weather.current.temperature}
                timezone={weather.current.timezone}
                Icon={Icon}
                isNight={isNight}
                weatherCode={weather.current.weatherCode}
                onRemove={() => removeLocation(location.slug)}
              />
            );
          }

          return (
            <li
              key={location.slug}
              {...getItemProps(location.slug, index)}
              className={cn(
                "location-card-sortable h-full",
                !isLoading && "animate-fade-in"
              )}
            >
              {content}
            </li>
          );
        })}
        <li className="h-full">
          <AddLocationDialog
            existingSlugs={userLocations.map((location) => location.slug)}
            onAdd={(location) => void addLocation(location)}
          />
        </li>
      </ul>
    </PageShell>
  );
}
