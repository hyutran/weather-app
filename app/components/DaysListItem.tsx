import { LucideIcon } from "lucide-react";

interface DaysListItemProps {
  day: string;
  maxTemp: number;
  minTemp: number;
  Icon: LucideIcon;
}

export function DaysListItem({
  day,
  maxTemp,
  minTemp,
  Icon,
}: DaysListItemProps) {
  return (
    <li className="flex justify-between items-center py-4 gap-4 border-t border-border">
      <h3 className="text-base font-medium">{day}</h3>
      <Icon className="size-5 text-muted-foreground/70 ml-auto" />
      <div className="flex gap-4 w-16 justify-end text-base font-normal">
        <span>{maxTemp}°</span>
        <span className="text-muted-foreground">{minTemp}°</span>
      </div>
    </li>
  );
}