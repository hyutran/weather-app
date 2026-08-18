import { WeatherIconProps } from "../../../lib/types";
import { CelestialBody, Cloud } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function MainlyClear({ className, isNight }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            <CelestialBody isNight={isNight} x={10} y={-20} />
            <Cloud x={-80} y={80} scale={0.5} animation="hover" />
            <Cloud x={80} y={-80} scale={0.5} animation="hover" delay="-2.5s" />
        </WeatherIconFrame>
    );
}
