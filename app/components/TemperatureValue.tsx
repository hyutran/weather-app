"use client";

import { useTemperatureScale } from "../context/TemperatureScaleContext";
import { formatTemperature } from "../lib/temperature";

interface TemperatureValueProps {
  celsius: number;
}

// Renders a Celsius value converted and formatted for the user's preferred scale.
export function TemperatureValue({ celsius }: TemperatureValueProps) {
  const { scale } = useTemperatureScale();

  return formatTemperature(celsius, scale);
}
