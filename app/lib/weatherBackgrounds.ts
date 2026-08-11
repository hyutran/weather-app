export function getWeatherBackground(code: number, isNight: boolean): string {
    // Clear sky (0), Mainly clear (1), Partly cloudy (2)
    if ([0, 1, 2].includes(code)) {
        return isNight
            ? "bg-linear-to-b from-[oklch(30%_0.1_260)] to-[oklch(20%_0.08_260)]"
            : "bg-linear-to-b from-[oklch(60%_0.20_250)] to-[oklch(40%_0.214_250))]";
    }
    // Thunderstorm (95, 96, 99) - darkest variant
    if ([95, 96, 99].includes(code)) {
        return isNight
            ? "bg-linear-to-b from-[oklch(28%_0.041_260)] to-[oklch(13%_0.042_265)]"
            : "bg-linear-to-b from-[oklch(45%_0.043_257)] to-[oklch(28%_0.041_260)]";
    }

    // Overcast (3), Fog (45, 48), Rainy (51, 53, 55, 61, 63, 65, 80, 81, 82), Snow (71, 73, 75), Default
    return isNight
        ? "bg-linear-to-b from-[oklch(35%_0.044_257)] to-[oklch(25%_0.042_266)]"
        : "bg-linear-to-b from-[oklch(70%_0.04_257)] to-[oklch(45%_0.043_257)]";
}
