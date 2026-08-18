import { Moon } from "./Moon";
import { Sun } from "./Sun";

interface CelestialBodyProps {
    isNight?: boolean;
    x?: number;
    y?: number;
}

// Whichever body belongs in the sky right now. Every icon that shows one places
// it at the same coordinates in both states, so pairing the choice with the
// position here removes the one thing the three call sites could disagree on:
// day and night drifting to different offsets.
export function CelestialBody({ isNight, x, y }: CelestialBodyProps) {
    return isNight ? <Moon x={x} y={y} /> : <Sun x={x} y={y} />;
}
