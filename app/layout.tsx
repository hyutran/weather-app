import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";

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
    >
      <body 
        className={`${geistSans.variable} antialiased bg-muted text-foreground`}
        style={{
          background: "linear-gradient(120deg, oklch(90% 0.10 260) 0%, oklch(95% 0.08 120) 100%)",
        }}
      >
        <div className="min-h-screen py-8 px-6">
          <main className="max-w-xl mx-auto">
              <h1 className="text-2xl font-semibold mb-6 text-foreground hover:text-foreground">
                <Link href="/">Weather in Vietnam</Link>
              </h1>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
