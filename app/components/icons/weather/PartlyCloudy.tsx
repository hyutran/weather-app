import { WeatherIconProps } from "../../../lib/types";
import { CelestialBody, Cloud } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function PartlyCloudy({ className, isNight }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            <CelestialBody isNight={isNight} x={20} y={-10} />
            <Cloud x={-20} y={30} animation="hover" />
        </WeatherIconFrame>
    );
}
