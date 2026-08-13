"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { TemperatureScale } from "../lib/temperature";

const STORAGE_KEY = "temperature-scale";

interface TemperatureScaleContextValue {
  scale: TemperatureScale;
  setScale: (scale: TemperatureScale) => void;
}

const TemperatureScaleContext =
  createContext<TemperatureScaleContextValue | null>(null);

interface TemperatureScaleProviderProps {
  children: ReactNode;
}

function readStoredScale(): TemperatureScale {
  if (typeof window === "undefined") {
    return "celsius";
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "celsius" || stored === "fahrenheit" ? stored : "celsius";
}

export function TemperatureScaleProvider({
  children,
}: TemperatureScaleProviderProps) {
  const [scale, setScale] = useState<TemperatureScale>(readStoredScale);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, scale);
  }, [scale]);

  return (
    <TemperatureScaleContext.Provider value={{ scale, setScale }}>
      {children}
    </TemperatureScaleContext.Provider>
  );
}

export function useTemperatureScale() {
  const context = useContext(TemperatureScaleContext);

  if (!context) {
    throw new Error(
      "useTemperatureScale must be used within a TemperatureScaleProvider",
    );
  }

  return context;
}
