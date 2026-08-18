import { WeatherIconProps } from "../../../lib/types";
import { Cloud, Rain } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function Rainy({ className }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            <Cloud y={-20} />
            <Rain x={-5} y={-5} animation="fall" delay="-0.1s" />
            <Rain x={-20} y={10} animation="fall" delay="-1.5s" />
        </WeatherIconFrame>
    );
}
