import { WeatherIconProps } from "../../../lib/types";
import { Cloud } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function Overcast({ className }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            <g className="animate-hover">
                <Cloud x={-60} y={-15} scale={0.75} opacity={0.7} />
            </g>
            <g className="animate-hover [--animation-delay:-2s]">
            <Cloud x={20} y={30} />
            </g>
        </WeatherIconFrame>
    );
}
