import { WeatherIconProps } from "../../../lib/types";
import { Sun, Moon } from "../primitives";
import { WeatherIcon } from "../WeatherIcon";

export function ClearSky({ className, isNight }: WeatherIconProps) {
    return (
        <WeatherIcon className={className}>
            {isNight ? <Moon /> : <Sun />}
        </WeatherIcon>
    );
}
