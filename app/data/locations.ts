import { cities } from "@/data/cities";

export interface Location {
  name: string;
  slug: string;
  lat: number;
  lon: number;
}
export const locations: Location[] = [
  { name: "Hanoi", slug: "hanoi", lat: 21.0285, lon: 105.8542 },
  { name: "Ho Chi Minh City", slug: "ho-chi-minh-city", lat: 10.8231, lon: 106.6297 },
  { name: "Da Lat", slug: "da-lat", lat: 11.9404, lon: 108.4583 },
  { name: "Hoi An", slug: "hoi-an", lat: 15.8801, lon: 108.338 },
  { name: "Phu Quoc", slug: "phu-quoc", lat: 10.2899, lon: 103.984 },
  { name: "Con Dao", slug: "con-dao", lat: 8.6833, lon: 106.6167 },
  { name: "Tokyo", slug: "tokyo", lat: 35.6762, lon: 139.6503 },
  { name: "New York", slug: "new-york", lat: 40.7128, lon: -74.006 },
  { name: "London", slug: "london", lat: 51.5074, lon: -0.1278 },
  { name: "Paris", slug: "paris", lat: 48.8566, lon: 2.3522 },
  { name: "Sydney", slug: "sydney", lat: -33.8688, lon: 151.2093 },

];
export function getLocationBySlug(slug: string): Location | undefined {
  return (
    locations.find((location) => location.slug === slug) ??
    cities.find((city) => city.slug === slug)
  );
}