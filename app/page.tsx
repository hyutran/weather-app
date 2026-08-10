import { locations } from "./data/locations";
import { getWeather } from "./actions/actions";
import { getWeatherIcon } from "./lib/weatherIcon";
import { getWeatherDescription } from "./lib/weatherDescription";
import { LocationCard } from "./components/LocationCard";
import { isNightTime } from "./lib/utils";


export default async function Home() {
  const weatherData = await Promise.all(
    locations.map(async (location) => {
      const weather = await getWeather(location.lat, location.lon);
      return { location, weather };
    })
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-32">
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {weatherData.map(({ location, weather }) => {
          const Icon = getWeatherIcon(weather.current.weatherCode);
          const description = getWeatherDescription(weather.current.weatherCode);
          const isNight = isNightTime(
            weather.current.timezone,
            weather.current.sunrise,
            weather.current.sunset
          );

          return (
            <li key={location.slug} className="h-full">
              <LocationCard
                slug={location.slug}
                name={location.name}
                description={description}
                temperature={weather.current.temperature}
                timezone={weather.current.timezone}
                Icon={Icon}
                isNight={isNight}
                weatherCode={weather.current.weatherCode}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
