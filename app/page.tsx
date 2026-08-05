import { locations } from "./data/locations";
import { getWeather } from "./actions/actions";
import { getWeatherIcon } from "./lib/weatherIcon";
import { getWeatherDescription } from "./lib/weatherDescription";
import { LocationCard } from "./components/LocationCard";

export default async function Home() {
  const weatherData = await Promise.all(
    locations.map(async (location) => {
      const weather = await getWeather(location.lat, location.lon);
      return { location, weather };
    })
  );

  return (
    <ul className="flex flex-col gap-4">
      {weatherData.map(({ location, weather }) => {
        const Icon = getWeatherIcon(weather.current.weatherCode);
        const description = getWeatherDescription(weather.current.weatherCode);

        return (
          <li key={location.slug}>
            <LocationCard
              slug={location.slug}
              name={location.name}
              description={description}
              temperature={weather.current.temperature}
              timezone={weather.current.timezone}
              Icon={Icon}
            />
          </li>
        );
      })}
    </ul>
  );
}