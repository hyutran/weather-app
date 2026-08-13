import { WeatherIconProps } from "../../../lib/types";
import { Cloud, Sun, Moon } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function MainlyClear({ className, isNight }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            {isNight ? <Moon x={10} y={-20} /> : <Sun x={10} y={-20} />}
            <g className="animate-hover">
                <Cloud x={-80} y={80} scale={0.5} />
            </g>
            <g className="animate-hover [--animation-delay:-2.5s]">
                <Cloud x={80} y={-80} scale={0.5} />
            </g>
        </WeatherIconFrame>
    );
}
