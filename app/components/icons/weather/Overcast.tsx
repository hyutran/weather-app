import { WeatherIconProps } from "../../../lib/types";
import { Cloud } from "../primitives";
import { WeatherIcon } from "../WeatherIcon";

export function Overcast({ className }: WeatherIconProps) {
    return (
        <WeatherIcon className={className}>
            <g className="animate-hover">
                <Cloud x={-60} y={-15} scale={0.75} opacity={0.7} />
            </g>
            <g className="animate-hover [--animation-delay:-2s]">
            <Cloud x={20} y={30} />
            </g>
        </WeatherIcon>
    );
}
