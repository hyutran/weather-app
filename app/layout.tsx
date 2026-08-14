import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Link from "next/link";
import { WeatherIconDefs } from "./components/icons/WeatherIconDefs";
import { TemperatureToggle } from "./components/TemperatureToggle";
import { TemperatureScaleProvider } from "./context/TemperatureScaleContext";
import { WeatherProvider } from "./context/WeatherContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const minecart = localFont({
  src: "./fonts/MinecartLCD.ttf",
  variable: "--font-minecart",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weather App",
  description: "Check the weather in our favorite locations in Vietnam",
};

// Root layout wrapping every page with fonts, weather/temperature providers, and the shared header.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${minecart.variable}`}
    >
      <body
        className="antialiased bg-app-background text-foreground"

        style={{
        }}
      >
        <WeatherProvider>
          <TemperatureScaleProvider>
            <WeatherIconDefs />
            <header className="fixed top-0 left-0 w-full z-10 bg-">
              <div className="max-w-xl mx-auto py-12 px-6">
                <div className="flex items-center justify-between gap-4">
                  <h1 className="text-base font-semibold text-foreground/80 hover:text-foreground text-shadow-sm">
                    <Link href="/">Weather here and there</Link>
                  </h1>
                  <TemperatureToggle />
                </div>
              </div>
            </header>
            <main className="min-h-screen">
              {children}
            </main>
          </TemperatureScaleProvider>
        </WeatherProvider>
      </body>
    </html>
  );
}
