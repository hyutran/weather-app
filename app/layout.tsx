import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Effects } from "./components/icons/Effects";
import { TemperatureToggle } from "./components/TemperatureToggle";
import { TemperatureScaleProvider } from "./context/TemperatureScaleContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Weather App",
  description: "Check the weather in our favorite locations in Vietnam",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${geistSans.variable}`}
    >
      <body
        // className="antialiased bg-white text-foreground"
        className="antialiased bg-linear-to-b from-sky-950 to-slate-900 text-foreground"

        style={{
        }}
      >
        <TemperatureScaleProvider>
          <Effects />
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
      </body>
    </html>
  );
}
