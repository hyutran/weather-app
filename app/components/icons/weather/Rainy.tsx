import { WeatherIconProps } from "../../../lib/types";
import { Cloud, Rain } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function Rainy({ className }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            <Cloud y={-20} />
            <g className="animate-fall [--animation-delay:-0.1s]">
                <Rain x={-5} y={-5} />
            </g>
            <g className="animate-fall [--animation-delay:-1.5s]">
                <Rain x={-20} y={10} />
            </g>
        </WeatherIconFrame>
    );
}
