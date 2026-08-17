import { weatherCardSurface } from "./weatherCardSurface";

export function LocationCardSkeleton({ name }: { name: string }) {
  return (
    <div
      className={`${weatherCardSurface} h-full bg-foreground/10 inset-shadow-xs inset-shadow-(color:--weather-card-inset-highlight)`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-foreground text-on-weather">
            {name}
          </h2>
          <div className="mt-2 h-3.5 w-28 animate-pulse-shimmering rounded-full bg-foreground/20" />
        </div>
        <div className="flex items-center gap-6">
          <div className="h-9 w-14 animate-pulse-shimmering rounded-full bg-foreground/20" />
          <div className="size-12 animate-pulse-shimmering rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}
