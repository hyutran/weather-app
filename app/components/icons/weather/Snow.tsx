import { WeatherIconProps } from "../../../lib/types";
import { Cloud, Snowflake } from "../primitives";
import { WeatherIcon } from "../WeatherIcon";

export function Snow({ className }: WeatherIconProps) {
    return (
        <WeatherIcon className={className}>
            <Cloud y={-20} />
            <Snowflake x={-50} y={-15} scale={0.7} />
            <Snowflake x={50} y={10} scale={0.85} />
        </WeatherIcon>
    );
}
