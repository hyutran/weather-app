import { LocationHeading } from "./LocationHeading";
import { raisedSurface } from "./raisedSurface";
import { weatherCardSurface } from "./weatherCardSurface";

export function LocationCardSkeleton({ name }: { name: string }) {
  return (
    <div
      className={`${weatherCardSurface} ${raisedSurface} h-full`}
    >
      <div className="flex items-center justify-between">
        <LocationHeading
          name={name}
          // `span`, not `div`: the meta slot renders inside a `<p>`. `block`
          // and `mt-2` reproduce the standalone bar this replaced.
          meta={
            <span className="mt-2 block h-3.5 w-28 animate-pulse-shimmering rounded-full bg-foreground/20" />
          }
        />
        <div className="flex items-center gap-6">
          <div className="h-9 w-14 animate-pulse-shimmering rounded-full bg-foreground/20" />
          <div className="size-12 animate-pulse-shimmering rounded-full bg-foreground/20" />
        </div>
      </div>
    </div>
  );
}
