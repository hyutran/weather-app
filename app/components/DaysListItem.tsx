import { WeatherIcon } from "../lib/types";
import { TemperatureValue } from "./TemperatureValue";

interface DaysListItemProps {
  day: string;
  maxTemp: number;
  minTemp: number;
  Icon: WeatherIcon;
}

// Renders one row of the 7-day forecast list: day name, icon, and high/low temps.
export function DaysListItem({
  day,
  maxTemp,
  minTemp,
  Icon,
}: DaysListItemProps) {
  return (
    <li className="flex justify-between items-center py-4 gap-4 border-t border-border ">
      <h4 className="text-base text-muted-foreground font-medium text-on-weather-sm">{day}</h4>
      <Icon className="size-8 ml-auto" />
      <div className="flex w-24 justify-end gap-4 text-base font-normal">
        <span className="text-foreground text-on-weather-sm">
          <TemperatureValue celsius={maxTemp} />
        </span>
        <span className="text-muted-foreground text-on-weather-sm">
          <TemperatureValue celsius={minTemp} />
        </span>
      </div>
    </li>
  );
}
