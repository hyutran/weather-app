import { WeatherIconProps } from "../../../lib/types";
import { Cloud } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function Overcast({ className }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            <Cloud x={-60} y={-15} scale={0.75} opacity={0.7} animation="hover" />
            <Cloud x={20} y={30} animation="hover" delay="-2s" />
        </WeatherIconFrame>
    );
}
