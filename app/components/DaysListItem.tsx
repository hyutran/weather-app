import { WeatherIcon } from "../lib/types";
import { TemperatureValue } from "./TemperatureValue";

interface DaysListItemProps {
  day: string;
  maxTemp: number;
  minTemp: number;
  Icon: WeatherIcon;
}

export function DaysListItem({
  day,
  maxTemp,
  minTemp,
  Icon,
}: DaysListItemProps) {
  return (
    <li className="flex justify-between items-center py-4 gap-4 border-t border-border ">
      <h3 className="text-base font-medium text-shadow-sm">{day}</h3>
      <Icon className="size-8 ml-auto" />
      <div className="flex w-24 justify-end gap-4 text-base font-normal">
        <span className="text-foreground text-shadow-sm">
          <TemperatureValue celsius={maxTemp} />
        </span>
        <span className="text-foreground/80 text-shadow-sm">
          <TemperatureValue celsius={minTemp} />
        </span>
      </div>
    </li>
  );
}
