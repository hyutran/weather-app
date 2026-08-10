"use client";

import { useTemperatureScale } from "../context/TemperatureScaleContext";
import { formatTemperature } from "../lib/temperature";

interface TemperatureValueProps {
  celsius: number;
}

export function TemperatureValue({ celsius }: TemperatureValueProps) {
  const { scale } = useTemperatureScale();

  return formatTemperature(celsius, scale);
}
