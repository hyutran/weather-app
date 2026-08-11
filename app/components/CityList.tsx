"use client";

import { useEffect, useState } from "react";
import { getWeather } from "../actions/actions";
import { getWeatherIcon } from "../lib/weatherIcon";
import { getWeatherDescription } from "../lib/weatherDescription";
import { isNightTime } from "../lib/utils";
import { WeatherData } from "../lib/types";
import { LocationCard } from "./LocationCard";
import { AddCityDialog } from "./AddCityDialog";
import { cities, type City } from "@/data/cities";

const STORAGE_KEY = "user-cities";
const DEFAULT_CITY_SLUGS = ["new-york", "london", "tokyo"];
const DEFAULT_CITIES = cities.filter((city) =>
  DEFAULT_CITY_SLUGS.includes(city.slug)
);

interface CityWeather {
  city: City;
  weather: WeatherData;
}

function LocationCardSkeleton({ name }: { name: string }) {
  return (
    <div className="h-full rounded-2xl bg-white/10 px-5 py-6 shadow-md/80 shadow-black/30 inset-shadow-xs inset-shadow-white/20 sm:px-6 xl:px-7">
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

function readStoredCities(): City[] {
  if (typeof window === "undefined") {
    return DEFAULT_CITIES;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const slugs: unknown = raw ? JSON.parse(raw) : null;

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return DEFAULT_CITIES;
    }

    const resolved = slugs
      .map((slug) => cities.find((city) => city.slug === slug))
      .filter((city): city is City => Boolean(city));

    return resolved.length > 0 ? resolved : DEFAULT_CITIES;
  } catch {
    return DEFAULT_CITIES;
  }
}

export function CityList() {
  const [userCities, setUserCities] = useState<City[]>([]);
  const [weatherEntries, setWeatherEntries] = useState<CityWeather[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSavedCities() {
      const storedCities = readStoredCities();
      setUserCities(storedCities);

      const entries = await Promise.all(
        storedCities.map(async (city) => ({
          city,
          weather: await getWeather(city.lat, city.lon),
        }))
      );

      if (!cancelled) {
        setWeatherEntries(entries);
        setHasLoaded(true);
      }
    }

    loadSavedCities();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(userCities.map((city) => city.slug))
    );
  }, [userCities, hasLoaded]);

  async function handleAdd(city: City) {
    if (userCities.some((existing) => existing.slug === city.slug)) {
      return;
    }

    const weather = await getWeather(city.lat, city.lon);

    setUserCities((current) => [...current, city]);
    setWeatherEntries((current) => [...current, { city, weather }]);
  }

  function handleRemove(slug: string) {
    setUserCities((current) => current.filter((city) => city.slug !== slug));
    setWeatherEntries((current) =>
      current.filter((entry) => entry.city.slug !== slug)
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-32">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {!hasLoaded &&
          userCities.map((city) => (
            <li key={city.slug} className="h-full">
              <LocationCardSkeleton name={city.name} />
            </li>
          ))}
        {hasLoaded &&
          weatherEntries.map(({ city, weather }) => {
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
                  onRemove={() => handleRemove(city.slug)}
                />
              </li>
            );
          })}
        <li className="h-full">
          <AddCityDialog
            existingSlugs={userCities.map((city) => city.slug)}
            onAdd={handleAdd}
          />
        </li>
      </ul>
    </div>
  );
}
