import { notFound } from "next/navigation";
import { locations, getLocationBySlug } from "../data/locations";
import { getWeather } from "../actions/actions";
import { getWeatherIcon } from "../lib/weatherIcon";
import { getWeatherDescription } from "../lib/weatherDescription";
import { getCurrentTimeInTimezone, formatDate, getDayName } from "../lib/utils";
import { DaysListItem } from "../components/DaysListItem";

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

  return (
    <div className="flex flex-col gap-16 py-8
        px-8 border border-white rounded-2xl bg-background/80 ">
      <header className="flex flex-col gap-8">
        <section className="flex flex-col">
          <h2 className="text-xl font-semibold">{location.name}</h2>
          <p className="text-base text-muted-foreground">
            {formatDate(todayForecast.date)}{" "}
            {getCurrentTimeInTimezone(weather.current.timezone)}
          </p>
        </section>

        <section className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <span className="text-6xl font-light">
              {weather.current.temperature}°
            </span>
            <p className="text-base text-muted-foreground">{description}</p>
          </div>
          <Icon className="size-20 text-muted-foreground/70 stroke-1" />
        </section>
      </header>

      <section>
        <h2 className="text-base font-semibold mb-4">7-Day Forecast</h2>
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
  );
}