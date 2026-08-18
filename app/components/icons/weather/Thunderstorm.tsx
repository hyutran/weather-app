import { WeatherIconProps } from "../../../lib/types";
import { Cloud, Rain, Thunderbolt } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function Thunderstorm({ className }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            <Rain x={-15} y={-50} scale={0.9} animation="fall" delay="-1s" />
            <Rain x={-20} y={10} scale={0.8} animation="fall" delay="-1.5s" />
            <Thunderbolt y={90} scale={0.6} animation="flash" />
            <Cloud y={-50} />
        </WeatherIconFrame>
    );
}
