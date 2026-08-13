"use client";

import {
  type DragEvent,
  type KeyboardEvent,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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
    moveCity,
  } = useWeather();

  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const previousRects = useRef(new Map<string, DOMRect>());
  const draggedSlugRef = useRef<string | null>(null);
  const reorderAnimations = useRef(new Map<string, Animation>());
  const justDragged = useRef(false);
  const [draggedSlug, setDraggedSlug] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");

  useLayoutEffect(() => {
    if (previousRects.current.size === 0) {
      return;
    }

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    for (const city of userCities) {
      const element = itemRefs.current.get(city.slug);
      const previousRect = previousRects.current.get(city.slug);

      if (!element || !previousRect || city.slug === draggedSlugRef.current) {
        continue;
      }

      const nextRect = element.getBoundingClientRect();
      const deltaY = previousRect.top - nextRect.top;

      if (Math.abs(deltaY) < 1 || reduceMotion) {
        continue;
      }

      reorderAnimations.current.get(city.slug)?.cancel();
      reorderAnimations.current.set(
        city.slug,
        element.animate(
          [
            { transform: `translateY(${deltaY}px)` },
            { transform: "translateY(0)" },
          ],
          {
            duration: 320,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          }
        )
      );
    }

    previousRects.current.clear();
  }, [userCities]);

  function capturePositions() {
    previousRects.current = new Map(
      [...itemRefs.current].map(([slug, element]) => [
        slug,
        element.getBoundingClientRect(),
      ])
    );
  }

  function reorderCity(slug: string, targetSlug: string) {
    capturePositions();
    moveCity(slug, targetSlug);
  }

  function handleDragStart(event: DragEvent<HTMLLIElement>, slug: string) {
    draggedSlugRef.current = slug;
    setDraggedSlug(slug);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", slug);
  }

  function handleDragOver(
    event: DragEvent<HTMLLIElement>,
    targetSlug: string
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    const activeSlug = draggedSlugRef.current;

    if (!activeSlug || activeSlug === targetSlug) {
      return;
    }

    const activeIndex = userCities.findIndex(
      ({ slug }) => slug === activeSlug
    );
    const targetIndex = userCities.findIndex(
      ({ slug }) => slug === targetSlug
    );
    const targetRect = event.currentTarget.getBoundingClientRect();
    const pointerIsPastMiddle =
      event.clientY > targetRect.top + targetRect.height / 2;

    if (
      (activeIndex < targetIndex && !pointerIsPastMiddle) ||
      (activeIndex > targetIndex && pointerIsPastMiddle)
    ) {
      return;
    }

    reorderCity(activeSlug, targetSlug);
  }

  function finishDragging() {
    const activeSlug = draggedSlugRef.current;

    if (activeSlug) {
      const city = userCities.find(({ slug }) => slug === activeSlug);
      const position = userCities.findIndex(({ slug }) => slug === activeSlug);

      if (city && position !== -1) {
        setAnnouncement(
          `${city.name} moved to position ${position + 1} of ${userCities.length}.`
        );
      }
    }

    justDragged.current = true;
    draggedSlugRef.current = null;
    setDraggedSlug(null);
    window.setTimeout(() => {
      justDragged.current = false;
    }, 0);
  }

  function handleKeyDown(
    event: KeyboardEvent<HTMLLIElement>,
    slug: string,
    index: number
  ) {
    if (event.target !== event.currentTarget || !event.altKey) {
      return;
    }

    const direction = event.key === "ArrowUp" ? -1 : event.key === "ArrowDown" ? 1 : 0;
    const targetCity = userCities[index + direction];

    if (direction === 0 || !targetCity) {
      return;
    }

    event.preventDefault();
    reorderCity(slug, targetCity.slug);
    setAnnouncement(
      `${userCities[index].name} moved to position ${index + direction + 1} of ${userCities.length}.`
    );
  }

  return (
    <div className="mx-auto max-w-xl px-6 py-32">
      <p id="location-reorder-instructions" className="sr-only">
        Drag a location to reorder it, or focus it and press Alt or Option with
        the up or down arrow key.
      </p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
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
        {userCities.map((city, index) => {
          const entry = weatherBySlug[city.slug];
          const isHardRefreshPending = hardRefreshPendingSlugs.has(
            city.slug
          );

          if (!entry || isHardRefreshPending) {
            return (
              <li
                key={city.slug}
                ref={(element) => {
                  if (element) itemRefs.current.set(city.slug, element);
                  else itemRefs.current.delete(city.slug);
                }}
                draggable
                tabIndex={0}
                aria-roledescription="sortable location"
                aria-describedby="location-reorder-instructions"
                onDragStart={(event) => handleDragStart(event, city.slug)}
                onDragOver={(event) => handleDragOver(event, city.slug)}
                onDrop={(event) => {
                  event.preventDefault();
                  finishDragging();
                }}
                onDragEnd={finishDragging}
                onKeyDown={(event) => handleKeyDown(event, city.slug, index)}
                onClickCapture={(event) => {
                  if (justDragged.current) event.preventDefault();
                }}
                data-dragging={draggedSlug === city.slug || undefined}
                className="location-card-sortable h-full"
              >
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
            <li
              key={city.slug}
              ref={(element) => {
                if (element) itemRefs.current.set(city.slug, element);
                else itemRefs.current.delete(city.slug);
              }}
              draggable
              tabIndex={0}
              aria-roledescription="sortable location"
              aria-describedby="location-reorder-instructions"
              onDragStart={(event) => handleDragStart(event, city.slug)}
              onDragOver={(event) => handleDragOver(event, city.slug)}
              onDrop={(event) => {
                event.preventDefault();
                finishDragging();
              }}
              onDragEnd={finishDragging}
              onKeyDown={(event) => handleKeyDown(event, city.slug, index)}
              onClickCapture={(event) => {
                if (justDragged.current) event.preventDefault();
              }}
              data-dragging={draggedSlug === city.slug || undefined}
              className="location-card-sortable h-full animate-fade-in"
            >
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
