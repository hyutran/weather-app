import { WeatherIconProps } from "../../../lib/types";
import { Cloud, Sun, Moon } from "../primitives";
import { WeatherIcon } from "../WeatherIcon";

export function PartlyCloudy({ className, isNight }: WeatherIconProps) {
    return (
        <WeatherIcon className={className}>
            {isNight ? <Moon x={20} y={-10} /> : <Sun x={20} y={-10} />}
            <g className="animate-hover">
                <Cloud x={-20} y={30} />
            </g>
        </WeatherIcon>
    );
}
