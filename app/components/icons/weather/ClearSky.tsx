import { WeatherIconProps } from "../../../lib/types";
import { CelestialBody } from "../primitives";
import { WeatherIconFrame } from "../WeatherIconFrame";

export function ClearSky({ className, isNight }: WeatherIconProps) {
    return (
        <WeatherIconFrame className={className}>
            <CelestialBody isNight={isNight} />
        </WeatherIconFrame>
    );
}
