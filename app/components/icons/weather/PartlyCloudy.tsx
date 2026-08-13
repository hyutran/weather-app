import { WeatherIconProps } from "../../../lib/types";
import { Cloud, Sun, Moon } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function PartlyCloudy({ className, isNight }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            {isNight ? <Moon x={20} y={-10} /> : <Sun x={20} y={-10} />}
            <g className="animate-hover">
                <Cloud x={-20} y={30} />
            </g>
        </WeatherIconFrame>
    );
}
