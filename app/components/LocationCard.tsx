import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { getCurrentTimeInTimezone } from "../lib/utils";


interface LocationCardProps {
  slug: string;
  name: string;
  description: string;
  temperature: number;
  timezone: string;
  Icon: LucideIcon;
}

export function LocationCard({
  slug,
  name,
  description,
  temperature,
  timezone,
  Icon,
}: LocationCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="block py-6 px-7 border border-white rounded-2xl bg-background/80 hover:bg-muted"
    >
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-base font-semibold">{name}</h2>
          <p className="text-sm text-muted-foreground">
            {getCurrentTimeInTimezone(timezone)} - {description}
          </p>
        </div>
        <div className="flex gap-6 items-center">
          <span className="text-4xl font-light">{temperature}°</span>
          <Icon className="size-9 text-muted-foreground/70 stroke-[1.5]" />
        </div>
      </div>
    </Link>
  );
}