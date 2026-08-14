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
import { locations, type Location } from "@/data/locations";

const LOCATION_STORAGE_KEY = "user-locations";
const WEATHER_STORAGE_KEY = "weather-cache-v1";
const WEATHER_CACHE_TTL = 5 * 60 * 1000;
const DEFAULT_LOCATION_SLUGS = ["hanoi", "new-york", "london", "tokyo"];
const DEFAULT_LOCATIONS = locations.filter((location) =>
  DEFAULT_LOCATION_SLUGS.includes(location.slug)
);

interface WeatherCacheEntry {
  weather: WeatherData;
  updatedAt: number;
}

type WeatherBySlug = Record<string, WeatherCacheEntry>;

interface LocationsContextValue {
  userLocations: Location[];
  weatherBySlug: WeatherBySlug;
  hardRefreshPendingSlugs: Set<string>;
  addLocation: (location: Location) => Promise<void>;
  removeLocation: (slug: string) => void;
  moveLocation: (slug: string, targetSlug: string) => void;
}

interface RefreshStatusContextValue {
  hasHydrated: boolean;
  isRefreshing: boolean;
  refreshAll: () => Promise<void>;
}

const LocationsContext = createContext<LocationsContextValue | null>(null);
const RefreshStatusContext = createContext<RefreshStatusContextValue | null>(
  null
);

// Reads the user's saved location list from localStorage, falling back to defaults if missing or invalid.
function readStoredLocations(): Location[] {
  try {
    const raw = window.localStorage.getItem(LOCATION_STORAGE_KEY);
    const slugs: unknown = raw ? JSON.parse(raw) : null;

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return DEFAULT_LOCATIONS;
    }

    const resolved = slugs
      .map((slug) => locations.find((location) => location.slug === slug))
      .filter((location): location is Location => Boolean(location));

    return resolved.length > 0 ? resolved : DEFAULT_LOCATIONS;
  } catch {
    return DEFAULT_LOCATIONS;
  }
}

// Reads cached weather data from localStorage, filtering out any malformed entries.
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

// Checks whether a cached weather entry is still within the TTL window.
function isCacheEntryFresh(entry: WeatherCacheEntry | undefined) {
  return Boolean(entry && Date.now() - entry.updatedAt < WEATHER_CACHE_TTL);
}

// Detects whether the current page load was a browser reload (vs. a fresh navigation).
function isBrowserReload() {
  const navigationEntry = performance.getEntriesByType(
    "navigation"
  )[0] as PerformanceNavigationTiming | undefined;

  return navigationEntry?.type === "reload";
}

// Provides the tracked locations, their cached weather, and refresh state; syncs both to localStorage.
export function WeatherProvider({ children }: { children: ReactNode }) {
  const hasInitialized = useRef(false);
  const [userLocations, setUserLocations] = useState<Location[]>(DEFAULT_LOCATIONS);
  const [weatherBySlug, setWeatherBySlug] = useState<WeatherBySlug>({});
  const [hasHydrated, setHasHydrated] = useState(false);
  const [refreshingSlugs, setRefreshingSlugs] = useState<Set<string>>(
    () => new Set()
  );
  const [hardRefreshPendingSlugs, setHardRefreshPendingSlugs] = useState<
    Set<string>
  >(() => new Set());

  // Fetches weather for the given locations and merges the results into the cache.
  const loadWeather = useCallback(
    async (targetLocations: Location[], forceRefresh = false) => {
      if (targetLocations.length === 0) {
        return;
      }

      const slugs = targetLocations.map((location) => location.slug);
      setRefreshingSlugs((current) => new Set([...current, ...slugs]));

      const results = await Promise.allSettled(
        targetLocations.map(async (location) => ({
          location,
          weather: await getWeather(location.lat, location.lon, forceRefresh),
        }))
      );

      setWeatherBySlug((current) => {
        const next = { ...current };

        for (const result of results) {
          if (result.status === "fulfilled") {
            next[result.value.location.slug] = {
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

    const storedLocations = readStoredLocations();
    const storedWeather = readStoredWeather();

    setUserLocations(storedLocations);
    setWeatherBySlug(storedWeather);
    setHasHydrated(true);

    const shouldForceRefresh = isBrowserReload();
    const locationsToLoad = shouldForceRefresh
      ? storedLocations
      : storedLocations.filter((location) => !isCacheEntryFresh(storedWeather[location.slug]));

    if (shouldForceRefresh) {
      setHardRefreshPendingSlugs(
        new Set(locationsToLoad.map((location) => location.slug))
      );
    }

    void loadWeather(locationsToLoad, shouldForceRefresh);
  }, [loadWeather]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(
      LOCATION_STORAGE_KEY,
      JSON.stringify(userLocations.map((location) => location.slug))
    );
  }, [hasHydrated, userLocations]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(
      WEATHER_STORAGE_KEY,
      JSON.stringify(weatherBySlug)
    );
  }, [hasHydrated, weatherBySlug]);

  // Adds a location to the user's list and fetches its weather if not already cached.
  const addLocation = useCallback(
    async (location: Location) => {
      if (userLocations.some((existing) => existing.slug === location.slug)) {
        return;
      }

      setUserLocations((current) => [...current, location]);

      if (!isCacheEntryFresh(weatherBySlug[location.slug])) {
        await loadWeather([location]);
      }
    },
    [loadWeather, userLocations, weatherBySlug]
  );

  // Removes a location from the user's list.
  const removeLocation = useCallback((slug: string) => {
    setUserLocations((current) => current.filter((location) => location.slug !== slug));
  }, []);

  // Moves a location to sit at another location's position in the list.
  const moveLocation = useCallback((slug: string, targetSlug: string) => {
    if (slug === targetSlug) {
      return;
    }

    setUserLocations((current) => {
      const fromIndex = current.findIndex((location) => location.slug === slug);
      const targetIndex = current.findIndex((location) => location.slug === targetSlug);

      if (fromIndex === -1 || targetIndex === -1) {
        return current;
      }

      const next = [...current];
      const [movedLocation] = next.splice(fromIndex, 1);
      next.splice(targetIndex, 0, movedLocation);

      return next;
    });
  }, []);

  // Force-refreshes weather for every currently tracked location.
  const refreshAll = useCallback(async () => {
    await loadWeather(userLocations, true);
  }, [loadWeather, userLocations]);

  const locationsValue = useMemo<LocationsContextValue>(
    () => ({
      userLocations,
      weatherBySlug,
      hardRefreshPendingSlugs,
      addLocation,
      removeLocation,
      moveLocation,
    }),
    [
      addLocation,
      hardRefreshPendingSlugs,
      removeLocation,
      moveLocation,
      userLocations,
      weatherBySlug,
    ]
  );

  const refreshStatusValue = useMemo<RefreshStatusContextValue>(
    () => ({
      hasHydrated,
      isRefreshing: refreshingSlugs.size > 0,
      refreshAll,
    }),
    [hasHydrated, refreshingSlugs, refreshAll]
  );

  return (
    <LocationsContext.Provider value={locationsValue}>
      <RefreshStatusContext.Provider value={refreshStatusValue}>
        {children}
      </RefreshStatusContext.Provider>
    </LocationsContext.Provider>
  );
}

// Hook to access tracked locations, their weather, and location-list mutators.
export function useLocations() {
  const context = useContext(LocationsContext);

  if (!context) {
    throw new Error("useLocations must be used within a WeatherProvider");
  }

  return context;
}

// Hook to access hydration/refresh status and trigger a manual refresh of all locations.
export function useRefreshStatus() {
  const context = useContext(RefreshStatusContext);

  if (!context) {
    throw new Error("useRefreshStatus must be used within a WeatherProvider");
  }

  return context;
}
