import { WeatherIconProps } from "../../../lib/types";
import { Sun, Moon } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function ClearSky({ className, isNight }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            {isNight ? <Moon /> : <Sun />}
        </WeatherIconFrame>
    );
}
