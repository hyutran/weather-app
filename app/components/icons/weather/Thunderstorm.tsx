import { WeatherIconProps } from "../../../lib/types";
import { Cloud, Rain, Thunderbolt } from "../primitives";
import { WeatherIcon } from "../WeatherIcon";

export function Thunderstorm({ className }: WeatherIconProps) {
    return (
        <WeatherIcon className={className}>
            <g className="animate-fall [--animation-delay:-1s]">
                <Rain x={-15} y={-50} scale={0.9} />
            </g>
            <g className="animate-fall [--animation-delay:-1.5s]">
                <Rain x={-20} y={10} scale={0.8} />
            </g>
            <g className="animate-flash">
                <Thunderbolt y={90} scale={0.6} />
            </g>
            <Cloud y={-50} />
        </WeatherIcon>
    );
}
