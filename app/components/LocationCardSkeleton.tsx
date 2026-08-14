export function LocationCardSkeleton({ name }: { name: string }) {
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
