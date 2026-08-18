import { notFound } from "next/navigation";
import { locations, getLocationBySlug } from "@/data/locations";
import { getWeather } from "../actions/actions";
import { getWeatherIcon } from "../lib/weatherIcon";
import { getWeatherDescription } from "../lib/weatherDescription";
import { getWeatherSurfaceProps } from "../lib/weatherBackgrounds";
import { getCurrentTimeInTimezone, formatDate, getDayName, isNightTime } from "../lib/dateTime";
import { DaysListItem } from "../components/DaysListItem";
import { PageShell } from "../components/PageShell";
import { TemperatureReadout } from "../components/TemperatureReadout";

export function generateStaticParams() {
  return locations.map((location) => ({
    slug: location.slug,
  }));
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const location = getLocationBySlug(slug);

  if (!location) {
    notFound();
  }

  const weather = await getWeather(location.lat, location.lon);
  const todayForecast = weather.daily[0];
  const Icon = getWeatherIcon(weather.current.weatherCode);
  const description = getWeatherDescription(weather.current.weatherCode);
  const isNight = isNightTime(
    weather.current.timezone,
    weather.current.sunrise,
    weather.current.sunset
  );
  return (
    <div
      {...getWeatherSurfaceProps(
        weather.current.weatherCode,
        isNight,
        "detail",
        "min-h-screen"
      )}
    >
      <PageShell>
        <div className="flex flex-col gap-16 animate-fade-in">
          <header className="flex flex-col gap-10">
            <section className="flex flex-col">
              <h2 className="text-lg font-semibold text-on-weather">{location.name}</h2>
              <p className="text-base text-muted-foreground text-on-weather-sm">
                {formatDate(todayForecast.date)}{" "}
                {getCurrentTimeInTimezone(weather.current.timezone)}
              </p>
            </section>

            <section className="flex justify-between items-center">
              <div className="flex flex-col gap-4">
                <TemperatureReadout
                  celsius={weather.current.temperature}
                  size="hero"
                />
                <p className="text-base text-muted-foreground text-on-weather-sm">{description}</p>
              </div>
              <Icon isNight={isNight} className="size-28" />
            </section>
          </header>

          <section className="flex flex-col gap-4">
            <h3 className="text-base text-foreground font-semibold text-on-weather-sm">7-Day Forecast</h3>
            <ul className="flex flex-col">
              {weather.daily.map((day, index) => {
                const DayIcon = getWeatherIcon(day.weatherCode);
                return (
                  <DaysListItem
                    key={day.date}
                    day={getDayName(day.date, index)}
                    maxTemp={day.maxTemp}
                    minTemp={day.minTemp}
                    Icon={DayIcon}
                  />
                );
              })}
            </ul>
          </section>

        </div>
      </PageShell>
    </div>
  );
}
