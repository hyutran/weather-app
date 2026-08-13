"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getWeather } from "../actions/actions";
import type { WeatherData } from "../lib/types";
import { cities, type City } from "@/data/cities";

const CITY_STORAGE_KEY = "user-cities";
const WEATHER_STORAGE_KEY = "weather-cache-v1";
const WEATHER_CACHE_TTL = 5 * 60 * 1000;
const DEFAULT_CITY_SLUGS = ["new-york", "london", "tokyo"];
const DEFAULT_CITIES = cities.filter((city) =>
  DEFAULT_CITY_SLUGS.includes(city.slug)
);

interface WeatherCacheEntry {
  weather: WeatherData;
  updatedAt: number;
}

type WeatherBySlug = Record<string, WeatherCacheEntry>;

interface WeatherContextValue {
  userCities: City[];
  weatherBySlug: WeatherBySlug;
  hasHydrated: boolean;
  isRefreshing: boolean;
  hardRefreshPendingSlugs: Set<string>;
  addCity: (city: City) => Promise<void>;
  removeCity: (slug: string) => void;
  refreshAll: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

function readStoredCities(): City[] {
  try {
    const raw = window.localStorage.getItem(CITY_STORAGE_KEY);
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

function readStoredWeather(): WeatherBySlug {
  try {
    const raw = window.localStorage.getItem(WEATHER_STORAGE_KEY);

    if (!raw) {
      return {};
    }

    const parsed: unknown = JSON.parse(raw);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return Object.fromEntries(
      Object.entries(parsed).filter(([, value]) => {
        if (!value || typeof value !== "object" || Array.isArray(value)) {
          return false;
        }

        const entry = value as Partial<WeatherCacheEntry>;
        return (
          typeof entry.updatedAt === "number" &&
          Boolean(entry.weather?.current) &&
          Array.isArray(entry.weather?.daily)
        );
      })
    ) as WeatherBySlug;
  } catch {
    return {};
  }
}

function isFresh(entry: WeatherCacheEntry | undefined) {
  return Boolean(entry && Date.now() - entry.updatedAt < WEATHER_CACHE_TTL);
}

function isBrowserReload() {
  const navigationEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming | undefined;

  return navigationEntry?.type === "reload";
}

export function WeatherProvider({ children }: { children: ReactNode }) {
  const hasInitialized = useRef(false);
  const [userCities, setUserCities] = useState<City[]>(DEFAULT_CITIES);
  const [weatherBySlug, setWeatherBySlug] = useState<WeatherBySlug>({});
  const [hasHydrated, setHasHydrated] = useState(false);
  const [refreshingSlugs, setRefreshingSlugs] = useState<Set<string>>(
    () => new Set()
  );
  const [hardRefreshPendingSlugs, setHardRefreshPendingSlugs] = useState<
    Set<string>
  >(() => new Set());

  const loadWeather = useCallback(
    async (targetCities: City[], forceRefresh = false) => {
      if (targetCities.length === 0) {
        return;
      }

      const slugs = targetCities.map((city) => city.slug);
      setRefreshingSlugs((current) => new Set([...current, ...slugs]));

      const results = await Promise.allSettled(
        targetCities.map(async (city) => ({
          city,
          weather: await getWeather(city.lat, city.lon, forceRefresh),
        }))
      );

      setWeatherBySlug((current) => {
        const next = { ...current };

        for (const result of results) {
          if (result.status === "fulfilled") {
            next[result.value.city.slug] = {
              weather: result.value.weather,
              updatedAt: Date.now(),
            };
          } else {
            console.error("Unable to refresh weather", result.reason);
          }
        }

        return next;
      });

      setRefreshingSlugs((current) => {
        const next = new Set(current);
        slugs.forEach((slug) => next.delete(slug));
        return next;
      });

      setHardRefreshPendingSlugs((current) => {
        if (current.size === 0) {
          return current;
        }

        const next = new Set(current);
        slugs.forEach((slug) => next.delete(slug));
        return next;
      });
    },
    []
  );

  useEffect(() => {
    if (hasInitialized.current) {
      return;
    }

    hasInitialized.current = true;

    const storedCities = readStoredCities();
    const storedWeather = readStoredWeather();

    setUserCities(storedCities);
    setWeatherBySlug(storedWeather);
    setHasHydrated(true);

    const shouldForceRefresh = isBrowserReload();
    const citiesToLoad = shouldForceRefresh
      ? storedCities
      : storedCities.filter((city) => !isFresh(storedWeather[city.slug]));

    setHardRefreshPendingSlugs(
      new Set(shouldForceRefresh ? citiesToLoad.map((city) => city.slug) : [])
    );

    void loadWeather(citiesToLoad, shouldForceRefresh);
  }, [loadWeather]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(
      CITY_STORAGE_KEY,
      JSON.stringify(userCities.map((city) => city.slug))
    );
  }, [hasHydrated, userCities]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(
      WEATHER_STORAGE_KEY,
      JSON.stringify(weatherBySlug)
    );
  }, [hasHydrated, weatherBySlug]);

  const addCity = useCallback(
    async (city: City) => {
      if (userCities.some((existing) => existing.slug === city.slug)) {
        return;
      }

      setUserCities((current) => [...current, city]);

      if (!isFresh(weatherBySlug[city.slug])) {
        await loadWeather([city]);
      }
    },
    [loadWeather, userCities, weatherBySlug]
  );

  const removeCity = useCallback((slug: string) => {
    setUserCities((current) => current.filter((city) => city.slug !== slug));
  }, []);

  const refreshAll = useCallback(async () => {
    await loadWeather(userCities, true);
  }, [loadWeather, userCities]);

  const value = useMemo<WeatherContextValue>(
    () => ({
      userCities,
      weatherBySlug,
      hasHydrated,
      isRefreshing: refreshingSlugs.size > 0,
      hardRefreshPendingSlugs,
      addCity,
      removeCity,
      refreshAll,
    }),
    [
      addCity,
      hardRefreshPendingSlugs,
      hasHydrated,
      refreshAll,
      refreshingSlugs,
      removeCity,
      userCities,
      weatherBySlug,
    ]
  );

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }

  return context;
}
